/**
 * Gmail Workspace Integration Utility
 * Implements Google OAuth 2.0 Implicit Grant Flow and Google Gmail API Client-side.
 */

export interface GmailUser {
  email: string;
  name?: string;
  picture?: string;
}

const CLIENT_ID_STORAGE_KEY = 'portfolio_custom_google_client_id';
const TOKEN_STORAGE_KEY = 'portfolio_google_access_token';
const TOKEN_EXP_STORAGE_KEY = 'portfolio_google_token_expiry';

/**
 * Get the Google Client ID. Checks local temporary override, then environment variables.
 */
export function getGoogleClientId(): string {
  // Check if saved in session/local storage
  const customId = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
  if (customId) return customId;
  
  return (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
}

/**
 * Saves a custom Client ID locally for manual testing (if not set in env)
 */
export function setGoogleClientId(clientId: string) {
  if (clientId.trim()) {
    localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientId.trim());
  } else {
    localStorage.removeItem(CLIENT_ID_STORAGE_KEY);
  }
}

/**
 * Checks if the user is authenticated (valid unexpired token is stored in memory or storage)
 */
export function getCachedToken(): string | null {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const expiry = localStorage.getItem(TOKEN_EXP_STORAGE_KEY);
  
  if (!token || !expiry) return null;
  
  if (Date.now() > Number(expiry)) {
    // Token expired
    clearCachedToken();
    return null;
  }
  
  return token;
}

export function saveToken(token: string, expiresInSeconds: number) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  const expiryTime = Date.now() + (expiresInSeconds - 60) * 1000; // subtract 60s safety buffer
  localStorage.setItem(TOKEN_EXP_STORAGE_KEY, String(expiryTime));
}

export function clearCachedToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_EXP_STORAGE_KEY);
}

/**
 * Initiates the Google OAuth 2.0 Flow
 */
export function initiateGoogleOAuth() {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error('Google Client ID is not configured.');
  }

  const redirectUri = `${window.location.origin}/`;
  const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: scopes.join(' '),
    state: 'gmail_auth_state',
    prompt: 'consent'
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  // Open popup or direct redirect
  // Let's open in a popup window
  const width = 600;
  const height = 700;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  
  window.open(
    authUrl,
    'google_oauth_popup',
    `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
  );
}

/**
 * Extracts and saves the Google OAuth access token from the URL hash fragment.
 * Run this on application load / inside an effect.
 */
export function handleOAuthRedirectResponse(hash: string): string | null {
  if (!hash) return null;
  
  // Remove leading '#' if present
  const cleanedHash = hash.startsWith('#') ? hash.substring(1) : hash;
  const params = new URLSearchParams(cleanedHash);
  
  const accessToken = params.get('access_token');
  const expiresIn = params.get('expires_in');
  const state = params.get('state');

  if (accessToken) {
    const seconds = expiresIn ? Number(expiresIn) : 3600;
    saveToken(accessToken, seconds);
    
    // Clear hash from URL cleanly without page reload
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    
    // Send message to parent/opener if we are in an OAuth popup
    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'GMAIL_AUTH_SUCCESS', token: accessToken }, window.location.origin);
      } catch (err) {
        console.error('Error posing message to opener:', err);
      }
    }
    
    return accessToken;
  }
  
  return null;
}

/**
 * Fetches user profile using OAuth credentials
 */
export async function fetchGoogleProfile(token: string): Promise<GmailUser> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      clearCachedToken();
    }
    throw new Error('Failed to retrieve Google user profile.');
  }
  
  return res.json();
}

/**
 * Safely encodes message content in Base64Url format
 */
function base64UrlEncode(str: string): string {
  // UTF-8 base64 conversion supporting emojis/unicode characters
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates and sends a single mail via the Gmail API
 */
async function sendRawGmail(token: string, to: string, subject: string, htmlBody: string): Promise<void> {
  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: =?utf-8?B?${btoa(encodeURIComponent(subject)).replace(/=+$/, '')}?=`, // UTF-8 base64 encoded subject line
    '',
    htmlBody
  ];

  const rawEmail = emailLines.join('\n');
  const encodedEmail = base64UrlEncode(rawEmail);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: encodedEmail })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error('Gmail send error payload:', errData);
    throw new Error(errData.error?.message || 'Failed to transmit message via Gmail API.');
  }
}

/**
 * Dispatches the contact inquiry to Dhruvik AND sends a receipt confirmation to the client user.
 */
export async function sendPortfolioEmails(
  token: string,
  formData: { name: string; email: string; company?: string; phone?: string; budget: string; message: string }
): Promise<void> {
  const dhruvikEmail = 'dhruviktra.rajput.1379@gmail.com';
  const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });

  // 1. Build Inquiry Email (To: Dhruvik)
  const inquiryHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #0f172a;">
      <div style="max-width: 600px; margin: 0 auto; bg-color: #ffffff; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #0f172a; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; tracking-tight: -0.025em; font-family: 'Inter', sans-serif;">New Strategic Inquiry Registered</h1>
          <p style="color: #94a3b8; font-size: 11px; font-family: monospace; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.1em;">DHRUVIK VANOL PORTFOLIO CORE</p>
        </div>
        <div style="padding: 32px;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-weight: 700;">TRANSMISSION DETAILS</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 600; width: 140px; text-transform: uppercase;">Client Name:</td>
              <td style="padding: 10px 0; color: #0f172a; font-size: 13px; font-weight: 700;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Client Email:</td>
              <td style="padding: 10px 0; color: #0f172a; font-size: 13px; font-weight: 700;"><a href="mailto:${formData.email}" style="color: #2563eb; text-decoration: none;">${formData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Phone Number:</td>
              <td style="padding: 10px 0; color: #0f172a; font-size: 13px; font-weight: 700;">${formData.phone || '<em>Not Provided</em>'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Company/Brand:</td>
              <td style="padding: 10px 0; color: #0f172a; font-size: 13px;">${formData.company || '<em>Not Specified</em>'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Budget Bracket:</td>
              <td style="padding: 10px 0; color: #10b981; font-size: 13px; font-weight: 700;">${formData.budget}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Timestamp:</td>
              <td style="padding: 10px 0; color: #475569; font-size: 12px; font-family: monospace;">${timestamp}</td>
            </tr>
          </table>

          <h3 style="color: #0f172a; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-weight: 700;">PROJECT SPECIFICATIONS</h3>
          <div style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 16px; margin-top: 12px; color: #334155; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${formData.message}</div>
          
          <div style="margin-top: 32px; text-align: center;">
            <a href="mailto:${formData.email}?subject=In response to your inquiry" style="box-shadow: 0 4px 6px -1px rgba(37,99,235, 0.2); background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 12px; font-weight: 700; display: inline-block; text-transform: uppercase; tracking-wider: 0.05em;">Draft Reply Now</a>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
          Integrated via secured Google API Suite. Port 3000 Security Audited.
        </div>
      </div>
    </div>
  `;

  // 2. Build Confirmation Receipt Email (To: Client)
  const confirmationHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #0f172a;">
      <div style="max-width: 600px; margin: 0 auto; bg-color: #ffffff; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #0f172a; padding: 32px; text-align: center;">
          <div style="display: inline-block; padding: 8px 16px; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 9999px; margin-bottom: 16px;">
            <p style="color: #10b981; font-size: 11px; font-family: monospace; font-weight: 700; text-transform: uppercase; tracking-wide: 0.1em; margin: 0; display: flex; align-items: center; gap: 4px;">✔ Transmission Confirmed</p>
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; tracking-tight: -0.025em; font-family: 'Inter', sans-serif;">Inquiry Transmitted Successfully</h1>
          <p style="color: #94a3b8; font-size: 12px; font-family: sans-serif; margin: 8px 0 0 0;">Thank you for contacting Dhruvik Vanol.</p>
        </div>
        <div style="padding: 32px; line-height: 1.6;">
          <p style="margin-top: 0; font-size: 14px; font-weight: 600;">Hello ${formData.name},</p>
          <p style="font-size: 13px; color: #334155;">
            This email confirms that your project inquiry has been successfully serialized and received at Dhruvik's secure inbox. 
            He has already received your structural specifications and budget details.
          </p>
          <p style="font-size: 13px; color: #334155;">
            Dhruvik evaluates all incoming client requirements carefully and responds with a strategic brief or scheduling invitation <strong>within 4 business hours</strong>.
          </p>

          <div style="margin: 28px 0; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; background-color: #f8fafc;">
            <p style="margin: 0 0 12px 0; font-size: 11px; font-family: monospace; font-weight: 700; color: #64748b; text-transform: uppercase; tracking-wider: 0.05em;">YOUR DEPOSITED DETAILS</p>
            <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; color: #64748b; width: 110px;">Company/Brand:</td>
                <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">${formData.company || 'Not Specified'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b;">Phone Number:</td>
                <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">${formData.phone || 'Not Provided'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b;">Budget bracket:</td>
                <td style="padding: 4px 0; color: #10b981; font-weight: 700;">${formData.budget}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; vertical-align: top;">Specifications:</td>
                <td style="padding: 4px 0; color: #334155; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${formData.message}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; color: #334155;">
            In the meantime, feel free to visit the portfolio home or contact Dhruvik directly via WhatsApp for any immediate emergency optimization requests: 
            <a href="https://wa.me/918320763694" style="color: #10b981; text-decoration: none; font-weight: 600;">+91 832076 3694</a>.
          </p>

          <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
            Best Regards,<br />
            <strong>Dhruvik Vanol</strong><br />
            <span style="font-size: 11px; color: #94a3b8;">Strategic Web Development & Database Architecture</span>
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8;">
          This is an automated confirmation message sent securely via Gmail API Integration.
        </div>
      </div>
    </div>
  `;

  // Send both concurrently
  await Promise.all([
    sendRawGmail(token, dhruvikEmail, `New Portfolio Inquiry from ${formData.name}`, inquiryHtml),
    sendRawGmail(token, formData.email, `Transmission Confirmed - Portfolio Inquiry`, confirmationHtml)
  ]);
}

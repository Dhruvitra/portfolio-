import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Linkedin, 
  PhoneCall, 
  Send, 
  ShieldCheck, 
  CheckCircle, 
  Copy, 
  Check, 
  LogIn, 
  LogOut, 
  RefreshCw, 
  AlertCircle,
  Inbox,
  Trash2,
  Calendar,
  Building,
  User,
  ExternalLink,
  Lock,
  MapPin
} from 'lucide-react';
import { 
  getGoogleClientId, 
  setGoogleClientId, 
  getCachedToken, 
  initiateGoogleOAuth, 
  handleOAuthRedirectResponse, 
  fetchGoogleProfile, 
  sendPortfolioEmails, 
  clearCachedToken,
  GmailUser 
} from '../lib/gmail';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, query, updateDoc, deleteDoc } from 'firebase/firestore';

export interface Submission {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  budget: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'replied';
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    budget: '$1k — $5k',
    message: ''
  });

  // Custom budget states to support any number with $ and ₹ rupee symbols
  const [isCustomBudget, setIsCustomBudget] = useState(false);
  const [budgetCurrency, setBudgetCurrency] = useState<'$' | '₹'>('$');
  const [customBudgetValue, setCustomBudgetValue] = useState('');

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Gmail OAuth and User state variables
  const [googleToken, setGoogleToken] = useState<string | null>(getCachedToken());
  const [gmailUser, setGmailUser] = useState<GmailUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(getGoogleClientId());

  // Admin Panel states
  const [inquiryTab, setInquiryTab] = useState<'dispatch' | 'admin'>('dispatch');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [locallyDeletedIds, setLocallyDeletedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('locally_deleted_submissions') || '[]');
    } catch {
      return [];
    }
  });

  const budgets = ['Under $1k', '$1k — $5k', '$5k — $10k', 'Enterprise $10k+'];

  // Listen for external service card selection events
  useEffect(() => {
    const handleSelectService = (e: Event) => {
      const customEvent = e as CustomEvent<{ serviceName: string; budget?: string }>;
      if (customEvent.detail?.serviceName) {
        setIsCustomBudget(false);
        setFormData(prev => ({
          ...prev,
          message: `Hi Dhruvik, I am interested in inquiring about your "${customEvent.detail.serviceName}" service. I'd love to organize a brief call to align on custom deliverables and timelines!`,
          budget: customEvent.detail.budget && budgets.includes(customEvent.detail.budget) 
            ? customEvent.detail.budget 
            : prev.budget
        }));
        
        // Ensure the dispatch view is active
        setInquiryTab('dispatch');
        
        // Scroll to the contact form smoothly
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('select-service', handleSelectService);
    return () => window.removeEventListener('select-service', handleSelectService);
  }, []);

  // Sync custom budget inputs back to the primary budget field
  useEffect(() => {
    if (isCustomBudget) {
      const sanitized = customBudgetValue.replace(/[^\d.,]/g, '');
      const formatted = sanitized ? `${budgetCurrency}${sanitized}` : `${budgetCurrency}0`;
      setFormData(prev => ({ ...prev, budget: formatted }));
    }
  }, [isCustomBudget, budgetCurrency, customBudgetValue]);

  // Sync and seed submissions on mount
  useEffect(() => {
    const q = query(collection(db, 'submissions'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const records: Submission[] = [];
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data() as Submission);
      });
      
      // Sort records by timestamp descending
      records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      if (records.length === 0) {
        const seeds: Submission[] = [
          {
            id: 'seed-1',
            name: 'Arjun Ramesh',
            email: 'arjun.ramesh@techventures.io',
            company: 'TechVentures Inc.',
            budget: '$5k — $10k',
            message: 'Looking to implement a custom headless Shopify Liquid storefront with real-time checkout updates and deep multi-currency support. We require an optimized clean codebase.',
            timestamp: new Date(Date.now() - 3600000 * 3).toLocaleString(),
            status: 'new'
          },
          {
            id: 'seed-2',
            name: 'Richard Stone',
            email: 'richard.s@liquidcommerce.com',
            company: 'LiquidCommerce Co.',
            budget: 'Enterprise $10k+',
            message: 'Need a dedicated freelance engineer to develop our MERN stack vendor system and configure Express secure cookies for OAuth authentication. Standard compliance must be optimal.',
            timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString(),
            status: 'read'
          }
        ];
        for (const seed of seeds) {
          try {
            await setDoc(doc(db, 'submissions', seed.id), seed);
          } catch (err) {
            console.error('Failed to seed resource: ', err);
          }
        }
      } else {
        setSubmissions(records);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'submissions', false);
    });

    return () => unsubscribe();
  }, []);

  // Effect on mount to capture OAuth redirect hash or register cross-window listener for popup
  useEffect(() => {
    // 1. Check if we have an incoming token in URL hash
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const token = handleOAuthRedirectResponse(hash);
      if (token) {
        setGoogleToken(token);
      }
    }

    // 2. Register message listener for popup
    const handlePopupMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'GMAIL_AUTH_SUCCESS') {
        const token = event.data.token;
        setGoogleToken(token);
      }
    };

    window.addEventListener('message', handlePopupMessage);
    return () => window.removeEventListener('message', handlePopupMessage);
  }, []);

  // Sync Google user profile when token is updated
  useEffect(() => {
    if (!googleToken) {
      setGmailUser(null);
      return;
    }

    const fetchProfile = async () => {
      setIsVerifyingAuth(true);
      setAuthError(null);
      try {
        const profile = await fetchGoogleProfile(googleToken);
        setGmailUser(profile);
      } catch (err: any) {
        console.error('Failed to resolve Google profile:', err);
        setAuthError('Authentication session expired or is invalid. Please reconnect.');
        setGoogleToken(null);
        clearCachedToken();
      } finally {
        setIsVerifyingAuth(false);
      }
    };

    fetchProfile();
  }, [googleToken]);

  // Handle Clipboard copies
  const handleCopy = (text: string, type: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        // Fallback for primitive user-agents or highly strict iframes
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.warn('Clipboard write disallowed by iframe sandbox: ', err);
    }
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Keep only digits and restrict to maximum of 10 digits
    const filtered = val.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: filtered }));
    setFormErrors(prev => ({ ...prev, phone: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { name: '', email: '', phone: '', message: '' };

    if (!formData.name.trim()) {
      errors.name = 'Please provide your full name.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = 'An email is required to respond.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please provide a valid email structure.';
      isValid = false;
    }
    
    const cleanedPhone = formData.phone.trim().replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errors.phone = 'Mobile / phone number is compulsory.';
      isValid = false;
    } else if (cleanedPhone.length !== 10) {
      errors.phone = 'Phone number must contain exactly 10 digits.';
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = 'Please provide some project requirements.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setAuthError(null);
    try {
      if (googleToken) {
        try {
          await sendPortfolioEmails(googleToken, formData);
        } catch (emailErr) {
          console.warn('Gmail forwarding failed, continuing with database logging:', emailErr);
        }
      }
      
      // Store submission to Firestore database registry
      const docId = Math.random().toString(36).substring(2, 9);
      const newSub: Submission = {
        id: docId,
        name: formData.name,
        email: formData.email,
        budget: formData.budget,
        message: formData.message,
        timestamp: new Date().toLocaleString(),
        status: 'new'
      };
      if (formData.company) newSub.company = formData.company;
      if (formData.phone) newSub.phone = formData.phone;

      try {
        await setDoc(doc(db, 'submissions', docId), newSub);
      } catch (fbErr) {
        handleFirestoreError(fbErr, OperationType.CREATE, `submissions/${docId}`);
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        budget: '$1k — $5k',
        message: ''
      });
    } catch (err: any) {
      console.error('Error handling submission:', err);
      setAuthError(err?.message || 'Failed to transmit inquiry.');
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="relative py-28 bg-[#FFFFFF] overflow-hidden border-b border-slate-100"
    >
      {/* Background ring indicators */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-slate-50 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-20 animate-fade-in">
          <span className="text-xs font-mono tracking-[0.25em] text-[#2563EB] uppercase font-bold block mb-3">
            05 • STRATEGIC CALL
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Initiate Your Project
          </h2>
          <p className="text-[#334155] mt-4 leading-relaxed font-sans">
            Let's design codebases that elevate your revenue indices. Choose a budget bracket 
            below and share your structural requirements.
          </p>
        </div>

        {/* Master Row Split Layout grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT COLUMN: Channels and communication details (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight mb-4">
                Let's construct high-converting custom assets together.
              </h3>
              <p className="text-[#334155] text-xs leading-relaxed mb-10 max-w-sm font-sans">
                Have an urgent Shopify Liquid optimization requirement or looking to provision 
                a customized full-stack MERN application? Reach out immediately.
              </p>

              {/* Direct channels */}
              <div className="flex flex-col gap-5">
                
                {/* Email Panel Channel */}
                <div className="group relative p-4 flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0F172A]">
                      <Mail className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold">SECURE EMAIL CHANNELS</h4>
                      <p className="text-xs font-bold text-[#0F172A] truncate max-w-[160px] sm:max-w-xs xl:max-w-md">
                        dhruviktra.rajput.1379@gmail.com
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('dhruviktra.rajput.1379@gmail.com', 'email')}
                    className="p-2 bg-slate-50 text-slate-450 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    aria-label="Copy Email"
                  >
                    {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#334155]" />}
                  </button>
                </div>

                {/* LinkedIn Channel link */}
                <a 
                  href="https://www.linkedin.com/in/dhruvitra-vanol-849a51321" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group p-4 flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm transition-all text-current"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0F172A]">
                      <Linkedin className="w-4 h-4 text-[#0077B5]" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold">LINKEDIN CONNECT</h4>
                      <p className="text-xs font-bold text-[#0F172A]">dhruvitra-vanol-849a51321</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#2563EB] group-hover:underline">View Profile</span>
                </a>

                {/* Local SEO Address / NAP */}
                <div 
                  className="group p-4 flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm transition-all"
                  itemScope
                  itemType="http://schema.org/LocalBusiness"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0F172A]">
                      <MapPin className="w-4 h-4 text-[#ef4444]" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold">HEADQUARTERS</h4>
                      <div itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
                        <p className="text-xs font-bold text-[#0F172A]">
                          <span itemProp="addressLocality">Ahmedabad</span>, <span itemProp="addressRegion">Gujarat</span>, <span itemProp="addressCountry">India</span>
                        </p>
                      </div>
                      <span className="hidden" itemProp="name">Dhruvik Vanol - Web Developer India</span>
                      <span className="hidden" itemProp="telephone">+918320763694</span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Connection */}
                <a 
                  href="https://wa.me/918320763694" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group p-4 flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm transition-all text-current"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F8F2] flex items-center justify-center text-[#25D366]">
                      <PhoneCall className="w-4 h-4 text-[#25D366]" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold">WHATSAPP DIRECT</h4>
                      <p className="text-xs font-bold text-[#0F172A]">+91 832076 3694</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#10B981] group-hover:underline">Start Chat</span>
                </a>

                {/* GitHub Channel */}
                <a 
                  href="https://github.com/Dhruvitra" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group p-4 flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm transition-all text-current"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold">GITHUB PROFILE</h4>
                      <p className="text-xs font-bold text-[#0F172A]">github.com/Dhruvitra</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#2563EB] group-hover:underline">View Repos</span>
                </a>

              </div>
            </div>

            {/* Certification values bottom */}
            <div className="mt-12 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex gap-2.5 items-start">
                <ShieldCheck className="w-5 h-5 text-[#2563EB] mt-0.5 shrink-0" />
                <p className="text-[11px] text-[#334155] leading-relaxed font-sans">
                  <strong>SECURE EXCHANGE GUARANTEE:</strong> All messages sent are processed using secure 
                  email-mapping services, preventing bot harvesting and protecting your brand's integrity.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive business contact form (7 columns) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E8F0] p-6 md:p-8 relative">
            
            {/* Elegant Header Accent for dispatching */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6 select-none">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0F172A] font-mono">
                  Dispatch Inquiry Stream
                </span>
              </div>
              
              <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
                SYS_VERSION: 1.2.0 • PORT_3000
              </div>
            </div>

            <AnimatePresence mode="wait">
              {inquiryTab === 'dispatch' ? (
                submitSuccess ? (
                  // Beautiful successive animation screen
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-16 text-center flex flex-col items-center justify-center font-sans"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 animate-bounce">
                      <CheckCircle className="w-8 h-8 text-[#10B981]" />
                    </div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-[#0F172A] mb-2 font-sans">Message Logged Successfully!</h3>
                    <p className="text-xs text-[#334155] leading-relaxed max-w-sm mb-2 font-sans">
                      Thank you! Your requirements have been dynamically registered to our database registry.
                    </p>
                  </motion.div>
                ) : (
                  // Primary interactive form layout
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Full Name input */}
                      <div className="flex flex-col">
                        <label htmlFor="form-name" className="text-xs font-extrabold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="form-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Jane Cooper"
                          aria-invalid={!!formErrors.name}
                          aria-describedby={formErrors.name ? "name-error" : undefined}
                          className={`w-full px-4 py-3 border rounded-xl text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 transition-all ${
                            formErrors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-[#E2E8F0] focus:ring-[#2563EB]'
                          }`}
                          style={{ outline: 'none' }}
                        />
                        {formErrors.name && (
                          <p id="name-error" className="text-[10px] text-rose-500 mt-1 flex items-center gap-1" role="alert">
                            <span className="w-1 h-1 rounded-full bg-rose-500" /> {formErrors.name}
                          </p>
                        )}
                      </div>

                      {/* Business Email input */}
                      <div className="flex flex-col">
                        <label htmlFor="form-email" className="text-xs font-extrabold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                          Business Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="form-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g., jane@cooperbrand.com"
                          aria-invalid={!!formErrors.email}
                          aria-describedby={formErrors.email ? "email-error" : undefined}
                          className={`w-full px-4 py-3 border rounded-xl text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 transition-all ${
                            formErrors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-[#E2E8F0] focus:ring-[#2563EB]'
                          }`}
                          style={{ outline: 'none' }}
                        />
                        {formErrors.email && (
                          <p id="email-error" className="text-[10px] text-rose-500 mt-1 flex items-center gap-1" role="alert">
                            <span className="w-1 h-1 rounded-full bg-rose-500" /> {formErrors.email}
                          </p>
                        )}
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Company name optional */}
                      <div className="flex flex-col">
                        <label htmlFor="form-company" className="text-xs font-extrabold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                          Brand Name / Company
                        </label>
                        <input
                          id="form-company"
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="e.g., Cooper Apparel Ltd"
                          className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-xs bg-[#F8FAFC] hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#2563EB] transition-all"
                          style={{ outline: 'none' }}
                        />
                      </div>

                      {/* Mobile / Phone Number */}
                      <div className="flex flex-col">
                        <label htmlFor="form-phone" className="text-xs font-extrabold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                          Mobile / Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="form-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder="e.g., 8320763694"
                          aria-invalid={!!formErrors.phone}
                          aria-describedby={formErrors.phone ? "phone-error" : undefined}
                          className={`w-full px-4 py-3 border rounded-xl text-xs bg-[#F8FAFC] hover:bg-slate-50 focus:bg-white focus:ring-1 transition-all ${
                            formErrors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-[#E2E8F0] focus:ring-[#2563EB]'
                          }`}
                          style={{ outline: 'none' }}
                        />
                        {formErrors.phone && (
                          <p id="phone-error" className="text-[10px] text-rose-500 mt-1 flex items-center gap-1" role="alert">
                            <span className="w-1 h-1 rounded-full bg-rose-500" /> {formErrors.phone}
                          </p>
                        )}
                      </div>

                    </div>

                              {/* Dynamic budget picker selection */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <label htmlFor="form-budget" className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wide">
                          Target Budget Bracket
                        </label>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                          Flexible options
                        </span>
                      </div>
                      
                      {/* Interactive Visual Pills Selector */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {budgets.map((b) => {
                          const isActive = !isCustomBudget && formData.budget === b;
                          return (
                            <button
                              key={b}
                              type="button"
                              onClick={() => {
                                setIsCustomBudget(false);
                                setFormData(prev => ({ ...prev, budget: b }));
                              }}
                              className={`py-2.5 px-3 rounded-xl text-[11px] font-semibold transition-all duration-300 border text-center cursor-pointer active:scale-95 ${
                                isActive 
                                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-blue-100/50 translate-y-[-1px]'
                                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                              }`}
                            >
                              {b}
                            </button>
                          );
                        })}
                        {/* Custom Choice Pill Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomBudget(true);
                          }}
                          className={`py-2.5 px-3 rounded-xl text-[11px] font-semibold transition-all duration-300 border text-center cursor-pointer active:scale-95 col-span-2 sm:col-span-1 ${
                            isCustomBudget 
                              ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-blue-100/50 translate-y-[-1px]'
                              : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                          }`}
                        >
                          Custom ₹ / $
                        </button>
                      </div>

                      {/* Interactive Visual Custom Input Panel */}
                      {isCustomBudget && (
                        <motion.div 
                          initial={{ opacity: 0, y: -8 }} 
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row gap-4 items-end"
                        >
                          {/* Currency Toggle */}
                          <div className="flex flex-col w-full sm:w-auto shrink-0 select-none">
                            <span className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 block">Currency</span>
                            <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => setBudgetCurrency('$')}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                  budgetCurrency === '$' 
                                    ? 'bg-[#2563EB] text-white shadow-sm' 
                                    : 'text-slate-650 hover:bg-slate-50'
                                }`}
                              >
                                USD ($)
                              </button>
                              <button
                                type="button"
                                onClick={() => setBudgetCurrency('₹')}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                  budgetCurrency === '₹' 
                                    ? 'bg-[#2563EB] text-white shadow-sm' 
                                    : 'text-slate-650 hover:bg-slate-50'
                                }`}
                              >
                                INR (₹)
                              </button>
                            </div>
                          </div>

                          {/* Number Input */}
                          <div className="flex flex-col w-full">
                            <span className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 block">Custom Amount</span>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-455 select-none">
                                {budgetCurrency}
                              </span>
                              <input
                                type="text"
                                value={customBudgetValue}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  // Strip invalid text, allow digits, commas, dots
                                  const filtered = val.replace(/[^\d.,]/g, '');
                                  setCustomBudgetValue(filtered);
                                }}
                                placeholder="e.g., 15,000"
                                className="w-full pl-8 pr-4 py-3 border border-[#E2E8F0] rounded-xl text-xs bg-white focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] focus:bg-white hover:border-slate-300 transition-all font-bold text-slate-800"
                                style={{ outline: 'none' }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Customized Standard Select Component */}
                      <select
                        id="form-budget"
                        name="budget"
                        value={isCustomBudget ? 'custom' : formData.budget}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setIsCustomBudget(true);
                          } else {
                            setIsCustomBudget(false);
                            setFormData(prev => ({ ...prev, budget: e.target.value }));
                          }
                        }}
                        className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-xs bg-[#F8FAFC] hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium text-slate-700 shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2523475569%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_16px_center] bg-no-repeat pr-12"
                        style={{ outline: 'none' }}
                      >
                        {budgets.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                        <option value="custom">Custom Amount...</option>
                      </select>
                    </div>

                    {/* Project description textarea */}
                    <div className="flex flex-col">
                      <label htmlFor="form-message" className="text-xs font-extrabold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                        Project Specifications <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="form-message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="e.g., Looking to design a custom liquid catalog grid..."
                        rows={5}
                        aria-invalid={!!formErrors.message}
                        aria-describedby={formErrors.message ? "message-error" : undefined}
                        className={`w-full px-4 py-3 border rounded-xl text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 transition-all resize-none ${
                          formErrors.message ? 'border-rose-400 focus:ring-rose-400' : 'border-[#E2E8F0] focus:ring-[#2563EB]'
                        }`}
                        style={{ outline: 'none' }}
                      />
                      {formErrors.message && (
                        <p id="message-error" className="text-[10px] text-rose-500 mt-1 flex items-center gap-1" role="alert">
                          <span className="w-1 h-1 rounded-full bg-rose-500" /> {formErrors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button with loading animation */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#0F172A] text-white text-xs font-bold rounded-xl hover:bg-[#2563EB] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 disabled:cursor-wait"
                    >
                      <span>{isSubmitting ? 'Transmitting Core Data...' : 'Dispatch Request'}</span>
                      <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                    </button>

                  </motion.form>
                )
              ) : (
                // Beautiful interactive Admin Dashboard for viewing inquiry records
                <motion.div
                  key="admin-inbox"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-5 text-[#0F172A] font-sans"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Inbox className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                          Inquiry Stream ({submissions.length})
                        </h3>
                        <p className="text-[10px] text-slate-500">Live Client Submissions Logged</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-mono font-bold text-slate-500 text-right self-start sm:self-auto uppercase">
                      <Lock className="w-3 h-3 text-slate-400" /> Secure Sandbox
                    </span>
                  </div>

                  {/* Filter / Search input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter database by name, company, email, specifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] hover:bg-slate-50/80 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-slate-300 rounded-xl text-xs font-sans transition-all"
                      style={{ outline: 'none' }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-650 font-bold text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Submissions Stack */}
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {submissions.filter(s => !locallyDeletedIds.includes(s.id)).filter(sub => {
                      const q = searchQuery.toLowerCase();
                      return (
                        sub.name.toLowerCase().includes(q) ||
                        sub.email.toLowerCase().includes(q) ||
                        (sub.company && sub.company.toLowerCase().includes(q)) ||
                        sub.message.toLowerCase().includes(q) ||
                        sub.budget.toLowerCase().includes(q)
                      );
                    }).length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                        <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-xs text-slate-400 font-sans">No matching records registered.</p>
                      </div>
                    ) : (
                      submissions
                        .filter(s => !locallyDeletedIds.includes(s.id))
                        .filter(sub => {
                          const q = searchQuery.toLowerCase();
                          return (
                            sub.name.toLowerCase().includes(q) ||
                            sub.email.toLowerCase().includes(q) ||
                            (sub.company && sub.company.toLowerCase().includes(q)) ||
                            sub.message.toLowerCase().includes(q) ||
                            sub.budget.toLowerCase().includes(q)
                          );
                        })
                        .map(sub => {
                          const isExpanded = expandedSubmissionId === sub.id;
                          
                          // Identify budget colored badge styling
                          let budgetPillClass = "bg-slate-50 text-slate-600 border-slate-100";
                          if (sub.budget.toLowerCase().includes('enterprise') || sub.budget.toLowerCase().includes('10k')) {
                            budgetPillClass = "bg-purple-50 text-purple-600 border-purple-100";
                          } else if (sub.budget.includes('$5k')) {
                            budgetPillClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
                          } else if (sub.budget.includes('$1k')) {
                            budgetPillClass = "bg-blue-50 text-blue-600 border-blue-100";
                          }

                          return (
                            <div
                              key={sub.id}
                              onClick={() => setExpandedSubmissionId(isExpanded ? null : sub.id)}
                              className={`group border rounded-2xl p-4 transition-all duration-200 cursor-pointer text-left ${
                                isExpanded 
                                  ? 'bg-[#F8FAFC] border-slate-350 shadow-xs' 
                                  : sub.status === 'new' 
                                    ? 'bg-indigo-50/10 border-indigo-150 hover:bg-indigo-50/20' 
                                    : 'bg-white border-slate-150 hover:border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h4 className="text-xs font-black text-[#0F172A] tracking-tight truncate max-w-[150px] sm:max-w-[200px]">
                                      {sub.name}
                                    </h4>
                                    {sub.company && (
                                      <span className="text-[10px] text-slate-400 font-sans font-semibold border-l border-slate-200 pl-2 truncate max-w-[125px]">
                                        {sub.company}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-sans truncate pr-4">
                                    {sub.email}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-1.5 shrink-0 select-none">
                                  {sub.status === 'new' && (
                                    <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse shrink-0" title="New" />
                                  )}
                                  <span className={`text-[9px] font-black px-2 py-0.5 border rounded-full shrink-0 uppercase tracking-wide font-mono ${budgetPillClass}`}>
                                    {sub.budget}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-2.5">
                                {isExpanded ? (
                                  <div className="space-y-4">
                                    {/* Expanded Message view */}
                                    <div className="text-xs text-[#334155] bg-white border border-slate-200/60 p-3 rounded-xl font-sans whitespace-pre-wrap leading-relaxed select-text cursor-text" onClick={e => e.stopPropagation()}>
                                      {sub.message}
                                    </div>
                                    
                                    {/* Parameters Footer row */}
                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 border-t border-slate-100 pt-3 select-none">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Sent: {sub.timestamp}</span>
                                      </div>
                                      <div className="flex items-center gap-1 justify-end font-mono">
                                        <span className={`capitalize font-bold px-1.5 py-0.5 rounded-md ${
                                          sub.status === 'new' ? 'bg-indigo-50 text-indigo-600' : 
                                          sub.status === 'read' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                          STATUS: {sub.status}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Actions menu row */}
                                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 flex-wrap" onClick={e => e.stopPropagation()}>
                                      <div className="flex items-center gap-2 select-none">
                                        {/* Copy button */}
                                        <button
                                          type="button"
                                          onClick={() => handleCopy(JSON.stringify(sub, null, 2), `sub-${sub.id}`)}
                                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-700 transition-all cursor-pointer"
                                        >
                                          {copiedType === `sub-${sub.id}` ? (
                                            <>
                                              <Check className="w-3 h-3 text-emerald-500" />
                                              Copied payload
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3 h-3" />
                                              Copy JSON
                                            </>
                                          )}
                                        </button>

                                        {/* Cycle Status */}
                                        <button
                                          type="button"
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            const states: ('new' | 'read' | 'replied')[] = ['new', 'read', 'replied'];
                                            const nextState = states[(states.indexOf(sub.status) + 1) % states.length];
                                            try {
                                              await updateDoc(doc(db, 'submissions', sub.id), { status: nextState });
                                            } catch (err) {
                                              handleFirestoreError(err, OperationType.UPDATE, `submissions/${sub.id}`);
                                            }
                                          }}
                                          className="px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 cursor-pointer uppercase font-mono"
                                        >
                                          Cycle State
                                        </button>
                                      </div>

                                      <div className="flex items-center gap-2 ml-auto">
                                        {/* Delete transmission */}
                                        <button
                                          type="button"
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            if (deleteConfirmId !== sub.id) {
                                              setDeleteConfirmId(sub.id);
                                              setTimeout(() => setDeleteConfirmId(curr => curr === sub.id ? null : curr), 3000);
                                              return;
                                            }
                                            try {
                                              await deleteDoc(doc(db, 'submissions', sub.id));
                                              setDeleteConfirmId(null);
                                            } catch (err) {
                                              handleFirestoreError(err, OperationType.DELETE, `submissions/${sub.id}`);
                                            }
                                          }}
                                          className={`p-1.5 px-3.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                                            deleteConfirmId === sub.id 
                                              ? 'text-white bg-rose-600 border-rose-600 hover:bg-rose-700 animate-pulse'
                                              : 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-100'
                                          }`}
                                          title={deleteConfirmId === sub.id ? "Click again within 3 seconds to permanently delete" : "Delete entry"}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          {deleteConfirmId === sub.id && <span className="font-mono text-[10px]">Sure?</span>}
                                        </button>

                                        {/* Direct Email draft reply link */}
                                        <a
                                          href={`mailto:${sub.email}?subject=RE: Shopify %26 MERN Web Project Inquiry&body=Hi ${sub.name},%0D%0A%0D%0AThank you for reaching out in regards to your budget bracket: "${sub.budget}".%0D%0A%0D%0AI evaluated your requirements and would love to support you with your goal.%0D%0A%0D%0ABest regards,%0D%0ADhruvik Vanol`}
                                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0F172A] hover:bg-[#2563EB] text-white rounded-lg text-[10px] font-bold transition-all shadow-xs"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          Draft Reply
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-500 font-sans line-clamp-1 leading-normal pr-3">
                                    {sub.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

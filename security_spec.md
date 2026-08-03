# Security Specification - Portfolio Submission Datastore

This specification establishes concrete identity, integrity, and temporal structures for portfolio transmissions stored in our Google Cloud Firestore registry.

## 1. Data Invariants
1. **Submission Creation**: Anyone (both anonymous visitors and clients) can successfully write a portfolio dispatch, provided it satisfies exact schema properties.
2. **Review Triage**: Submissions can be updated or read by administrators looking to reply and manage incoming business leads. Since there is no high-privileged custom authentication required on this open public dashboard, state modification of existing records is validated to only allow modification of `status` while keeping core specs immutable.
3. **ID Protection**: IDs must be rigorously verified to prevent injection and Denial-of-Wallet attacks.

## 2. Validation Scheme
We define safe type checks and key constraints. We must enforce that:
- `id` matches lowercase alphanumeric rules.
- `name` is a valid string of length <= 128.
- `email` is <= 128 chars.
- `budget` is <= 64 chars.
- `message` is <= 10000 chars.
- `status` is one of `['new', 'read', 'replied']`.
- No additional shadow fields are allowed to prevent identity or privilege poisoning.

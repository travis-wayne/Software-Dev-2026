# Lesson 32 — Web Security Basics (CORS, XSS, CSRF)
# 🗂️ Tutor Notes (90-Minute Session)

---

## Session Objectives

By the end of this lesson students will be able to:

1. **Understand the Same-Origin Policy (SOP)** and why browsers block cross-origin requests by default.
2. **Configure CORS** in an Express app to explicitly allow trusted frontend domains.
3. **Execute an XSS attack** in a sandbox environment and explain why `innerHTML` is dangerous.
4. **Implement input sanitization** using libraries like `xss` to neutralize malicious scripts.
5. **Explain CSRF** and how modern `SameSite` cookie policies prevent ambient credential exploitation.

---

## Pre-Session Checklist

| Item | Details |
|------|---------|
| Node.js installed? | v18+ required |
| Run `npm install` in `examples/security-api/` | Installs `express`, `cors`, `helmet`, `xss` |
| Start Server | Run `pnpm dev` and open `localhost:3000` |
| Review Analogies | Bouncer (CORS), Graffiti (XSS), Forged Check (CSRF) |

---

## Phase-by-Phase Lesson Flow (90 min)

---

### Phase 1 — CORS: The Strict Bouncer (25 min)

**Goal**: Students understand *why* CORS exists and how to configure it.

1. **The Same-Origin Policy (10 min)**
   - Explain SOP: "If you are on `google.com`, a script running there cannot silently read data from `yourbank.com`."
   - The browser is the one blocking it, not the server.

2. **The Analogy (5 min)**
   - Use the "Cross-Border Club" analogy from the student notes. The browser is the bouncer following default laws. CORS is the manager's explicit VIP list.

3. **Live Lab: The CORS Tester (10 min)**
   - Open the Security Lab UI.
   - Run the "Test CORS" button. Show how it fails if we try to fetch from a blocked origin.
   - Show the code in Express: `app.use(cors({ origin: 'http://localhost:3000' }))`.
   - Discuss why `app.use(cors())` (allowing `*`) is dangerous for private APIs.

---

### Phase 2 — XSS: The Malicious Graffiti (30 min)

**Goal**: Students see a real XSS attack and learn how to sanitize inputs.

1. **The Exploit (10 min)**
   - Ask: "What happens if someone types `<script>alert('hacked')</script>` into a comment box?"
   - Explain the "Graffiti Artist" analogy. If the app blindly renders it, the browser executes it.
   - Explain the danger: Attackers don't just alert; they steal `localStorage.getItem('token')` and send it to their own server.

2. **Live Lab: Hack Yourself (10 min)**
   - In the Security Lab UI, paste an XSS payload into the Vulnerable Input.
   - Watch the alert trigger!
   - Now paste it into the Secure Input. Show how the `<script>` tag is stripped out, but the text remains.

3. **The Fix (10 min)**
   - Show the code for the secure route.
   - Explain *Output Encoding* (React does this automatically) vs *Input Sanitization* (using the `xss` library on the backend).

---

### Phase 3 — CSRF & Helmet (20 min)

**Goal**: Understand CSRF and the easiest ways to mitigate it today.

1. **The CSRF Exploit (10 min)**
   - Explain the "Forged Bank Check" analogy.
   - Key concept: Ambient Credentials. If you use Cookies, the browser sends them automatically. If `evil.com` creates a hidden form pointing to `yourbank.com/transfer`, the browser attaches the bank cookies. The bank thinks the request is legitimate.

2. **The Modern Fix: SameSite (5 min)**
   - Explain that modern browsers largely solved this with the `SameSite` cookie attribute. 
   - `SameSite=Lax` means the browser refuses to send the cookie if the request originated from `evil.com`.
   - Mention CSRF Tokens as the legacy/fallback method.

3. **Helmet (5 min)**
   - Introduce `helmet`. It sets 14 HTTP headers (like `X-Frame-Options` to prevent Clickjacking). It's a "free" security boost. Show how it's implemented with one line of code.

---

### Phase 4 — Quiz & Lab Verification (15 min)

**Goal**: Verify retention.

1. **Quiz (15 min)**
   - Have students complete the 7-question quiz in the UI.
   - Review Q2 (CORS wildcard): Ensure they know `*` is bad for authenticated APIs.
   - Review Q4 (XSS vs CSRF): XSS executes code; CSRF forges requests.

**Expected scores:**
- 6-7/7: Ready for the take-home project.
- < 5/7: Re-explain the difference between the three vulnerabilities.

---

## Common Errors Table

| Error | Cause | Fix |
|-------|-------|-----|
| `Blocked by CORS policy` | Frontend domain isn't in backend's `cors()` options. | Add frontend domain (exactly as it appears in the address bar) to the `origin` array. |
| XSS payload doesn't trigger | React or modern framework auto-encoded it. | Good! But remind them to sanitize on the backend anyway in case someone uses `dangerouslySetInnerHTML` later. |
| Sanitizer strips normal HTML | The `xss` library is too aggressive. | Configure `xss` whitelist options to allow basic tags like `<b>` or `<i>`. |

---

## Homework / Take-Home

Assign `exercises/security_practice.md` — Securing the Movies API.
Students will implement CORS, Helmet, and XSS sanitization on their existing CRUD API.

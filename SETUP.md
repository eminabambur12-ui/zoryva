# Zoryva — Complete Setup Guide
### Go from zero to live SaaS in one afternoon

---

## What You're Building

A real web app at your own domain where users:
1. Visit your landing page and pricing
2. Choose a plan and pay with Stripe
3. Create an account
4. Access their personal dashboard with budgets, business P&L, and AI coaching

**Tech stack:** Next.js (website) + Supabase (accounts/database) + Stripe (payments) + Vercel (hosting)

---

## PHASE 1 — Get the Code Running Locally

### Step 1.1 — Install Node.js

1. Go to **nodejs.org**
2. Click the "LTS" (recommended) download button
3. Install it like any normal app
4. To verify: open Terminal (Mac) or Command Prompt (Windows), type `node --version`, press Enter
5. You should see something like `v20.11.0`

### Step 1.2 — Open the Zoryva folder in Terminal

**On Mac:**
1. Open the **Terminal** app (search "Terminal" in Spotlight)
2. Type: `cd ` (with a space after cd)
3. Drag the `zoryva-app` folder from Finder into the Terminal window
4. Press Enter

**On Windows:**
1. Open the `zoryva-app` folder in File Explorer
2. Click the address bar at the top, type `cmd`, press Enter
3. A black window will open — you're in the right folder

### Step 1.3 — Install Dependencies

In your Terminal/Command Prompt, type exactly:
```
npm install
```
Press Enter. Wait for it to finish (1–3 minutes). You'll see a lot of text — that's normal.

### Step 1.4 — Create Your Environment Variables File

1. Inside the `zoryva-app` folder, find the file called `.env.local.example`
2. Make a copy of it
3. Rename the copy to `.env.local` (remove the word "example")
4. Open `.env.local` in any text editor (Notepad, TextEdit, or VS Code)

You'll fill in the values in the steps below. Keep this file open.

---

## PHASE 2 — Set Up Supabase (Your Database & User Accounts)

### Step 2.1 — Create a Supabase Account

1. Go to **supabase.com**
2. Click "Start your project"
3. Sign up with GitHub or email
4. Click "New project"
5. Fill in:
   - **Organization:** Create one (your name or brand)
   - **Project name:** `zoryva`
   - **Database password:** Create a strong password and **save it somewhere** (you'll need it later)
   - **Region:** Choose the one closest to your location
6. Click "Create new project"
7. Wait 1–2 minutes while it sets up

### Step 2.2 — Get Your API Keys

1. In your Supabase project, click **Settings** (gear icon in left sidebar)
2. Click **API**
3. You'll see two values — copy them into your `.env.local` file:
   - **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL=`
   - **anon public** key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
   - **service_role secret** key → paste as `SUPABASE_SERVICE_ROLE_KEY=`

⚠️ **Keep the service_role key secret.** Never share it publicly.

### Step 2.3 — Run the Database Schema

This creates all the tables Zoryva needs.

1. In Supabase, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/schema.sql` from the `zoryva-app` folder in a text editor
4. Select ALL the text (Ctrl+A / Cmd+A) and copy it
5. Paste it into the SQL Editor in Supabase
6. Click the green **Run** button
7. You should see "Success. No rows returned" — that's correct!

### Step 2.4 — Configure Auth Settings

1. In Supabase, click **Authentication** in the left sidebar
2. Click **URL Configuration**
3. Under **Site URL**, enter: `http://localhost:3000` (for local testing)
4. Under **Redirect URLs**, click "+ Add URL" and add: `http://localhost:3000/auth/callback`
5. Click **Save**

---

## PHASE 3 — Set Up Stripe (Payments)

### Step 3.1 — Create a Stripe Account

1. Go to **stripe.com**
2. Click "Start now" and create a free account
3. Verify your email

### Step 3.2 — Get Your API Keys (Test Mode)

1. In Stripe Dashboard, click **Developers** in the top right
2. Click **API keys**
3. Copy into your `.env.local`:
   - **Publishable key** → paste as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=`
   - **Secret key** → paste as `STRIPE_SECRET_KEY=`

You're in **Test Mode** — no real money moves yet. Test cards: `4242 4242 4242 4242`, any future date, any CVC.

### Step 3.3 — Create Your Products and Prices

**Create the Starter Plan:**
1. In Stripe → click **Products** in the left sidebar
2. Click **+ Add product**
3. Name: `Zoryva Starter`
4. Description: `Personal budgeting & daily money clarity`
5. Under Pricing → click **+ Add a price**
   - Price: `$19.00`
   - Billing period: **Monthly**
   - Click **Save product**
6. After saving, you'll see a **Price ID** that starts with `price_` — copy it
7. Paste it into `.env.local` as `STRIPE_STARTER_PRICE_ID=price_xxxxx`

**Create the Growth Plan:**
1. Click **+ Add product** again
2. Name: `Zoryva Growth`, Price: `$49.00/month`
3. Copy the Price ID → paste as `STRIPE_GROWTH_PRICE_ID=price_xxxxx`

**Create the Pro Plan:**
1. Name: `Zoryva Pro`, Price: `$99.00/month`
2. Copy the Price ID → paste as `STRIPE_PRO_PRICE_ID=price_xxxxx`

### Step 3.4 — Enable the Customer Portal

This lets users manage/cancel their subscriptions.

1. In Stripe → click **Settings** (top right) → **Billing** → **Customer portal**
2. Toggle it to **Active**
3. Check the boxes for: Cancel subscription, Update payment method, View invoices
4. Click **Save**

### Step 3.5 — Set Up Webhook (for Vercel — do this after deploying)

*Skip this step until you've deployed to Vercel in Phase 5. Come back here.*

---

## PHASE 4 — Set Up OpenAI (AI Coach)

### Step 4.1 — Get an OpenAI API Key

1. Go to **platform.openai.com**
2. Sign up or log in
3. Click your name in the top right → **API keys**
4. Click **+ Create new secret key**
5. Name it `Zoryva`
6. Copy the key immediately (you won't see it again)
7. Paste into `.env.local` as `OPENAI_API_KEY=sk-...`

### Step 4.2 — Add Billing to OpenAI

1. In platform.openai.com → click **Billing**
2. Add a credit card
3. Start with $10–20 credit (very affordable — AI chats cost ~$0.01–0.05 each)

---

## PHASE 5 — Run Locally and Test

### Step 5.1 — Start the App

In your Terminal (inside the `zoryva-app` folder):
```
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

### Step 5.2 — Open Your App

1. Open a browser
2. Go to: **http://localhost:3000**
3. You should see the Zoryva landing page!

### Step 5.3 — Test Sign Up

1. Click "Get Started Free"
2. Enter your name, email, and password
3. Click "Create Account"
4. Check your email for a confirmation link
5. Click the link → you'll be redirected to the dashboard

### Step 5.4 — Test Adding Transactions

1. In the dashboard, click "Personal" in the sidebar
2. Click "+ Add Transaction"
3. Add an expense and an income transaction
4. Go back to the Dashboard — your numbers should update

### Step 5.5 — Test the AI Coach

1. Click "AI Coach" in the sidebar
2. Type: "How much can I safely spend today?"
3. Zara should respond with advice based on your transactions

### Step 5.6 — Test Stripe Payment (Test Mode)

1. Go to http://localhost:3000/pricing
2. Click "Start Growth Plan"
3. Use test card: `4242 4242 4242 4242`, any future date, any CVC
4. Complete checkout
5. You'll be redirected to the dashboard
6. Check Stripe Dashboard → Payments — you should see a test payment

---

## PHASE 6 — Deploy to Vercel (Make It Live)

### Step 6.1 — Push Code to GitHub

1. Go to **github.com** and create a free account
2. Create a new repository called `zoryva`
3. Download **GitHub Desktop** from desktop.github.com (easiest for beginners)
4. In GitHub Desktop: File → Add Local Repository → choose your `zoryva-app` folder
5. Click "Publish repository" → make it private
6. Click "Commit to main" → then "Push to origin"

### Step 6.2 — Create a Vercel Account

1. Go to **vercel.com**
2. Click "Sign Up" → continue with GitHub
3. Authorize Vercel

### Step 6.3 — Import Your Project

1. In Vercel Dashboard → click "Add New Project"
2. Find your `zoryva` repository → click "Import"
3. Framework Preset: Next.js (auto-detected)
4. Click "Environment Variables" and add ALL your variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET` (you'll set this next)
   - `STRIPE_STARTER_PRICE_ID`
   - `STRIPE_GROWTH_PRICE_ID`
   - `STRIPE_PRO_PRICE_ID`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (e.g., `https://zoryva.vercel.app`)
5. Click "Deploy"
6. Wait 2–3 minutes

Your site is now live at something like `https://zoryva.vercel.app`! 🎉

---

## PHASE 7 — Connect Your Domain

### Step 7.1 — Buy Your Domain (if you haven't)

1. Go to **namecheap.com**
2. Search `zoryva.com` (or your preferred domain)
3. Purchase it (~$12/year)

### Step 7.2 — Connect Domain to Vercel

1. In Vercel → your project → **Settings** → **Domains**
2. Type in `zoryva.com` → click "Add"
3. Also add `www.zoryva.com`
4. Vercel will show you DNS records to add

### Step 7.3 — Add DNS Records in Namecheap

1. In Namecheap → click "Manage" next to your domain
2. Click **Advanced DNS**
3. Add the records Vercel gave you:
   - Usually an **A record** pointing to `76.76.21.21`
   - A **CNAME record** pointing `www` to `cname.vercel-dns.com`
4. Click the checkmark to save each
5. Wait 10–60 minutes for DNS to propagate

### Step 7.4 — Update Supabase & Stripe with Your Live Domain

**Supabase:**
1. Authentication → URL Configuration
2. Change Site URL to `https://zoryva.com`
3. Add redirect URL: `https://zoryva.com/auth/callback`
4. Also add: `https://www.zoryva.com/auth/callback`
5. Save

**Stripe:**
1. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables to `https://zoryva.com`
2. In Vercel: go to your project → Settings → Environment Variables → edit it
3. After saving, redeploy: go to Deployments → click the 3 dots on your latest → Redeploy

---

## PHASE 8 — Set Up Stripe Webhooks (Critical!)

Webhooks are how Stripe tells your app "someone just paid" so you can unlock their account.

### Step 8.1 — Add Webhook in Stripe

1. In Stripe → **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. Endpoint URL: `https://zoryva.com/api/stripe/webhook`
4. Click **Select events** and choose:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click **Add endpoint**

### Step 8.2 — Get the Webhook Secret

1. Click on the webhook you just created
2. Click **Reveal** under "Signing secret"
3. Copy the `whsec_...` value
4. In Vercel → your project → Settings → Environment Variables
5. Add: `STRIPE_WEBHOOK_SECRET` = `whsec_...`
6. Redeploy your app in Vercel

---

## PHASE 9 — Switch to Stripe Live Mode (When Ready to Charge Real Money)

When you're ready to accept real payments:

1. In Stripe → toggle from **Test** to **Live** (top left switch)
2. Get your **Live API keys** (Developers → API Keys)
3. Create your 3 products again in Live mode and get new Price IDs
4. Update ALL Stripe environment variables in Vercel with the Live versions:
   - `STRIPE_SECRET_KEY` = `sk_live_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
   - `STRIPE_STARTER_PRICE_ID`, `STRIPE_GROWTH_PRICE_ID`, `STRIPE_PRO_PRICE_ID`
5. Create a new webhook in Stripe Live mode pointing to your domain
6. Update `STRIPE_WEBHOOK_SECRET` with the live `whsec_...`
7. Redeploy

⚠️ Test everything in Test mode first before switching to Live.

---

## PHASE 10 — Test Everything End-to-End

Run through this checklist before telling anyone about your site:

### Auth
- [ ] Sign up with a new email — confirmation email arrives
- [ ] Click confirmation link — lands on dashboard
- [ ] Sign out — returns to landing page
- [ ] Sign in again — dashboard loads with your data

### Transactions
- [ ] Add a personal income transaction
- [ ] Add a personal expense transaction
- [ ] Dashboard shows updated totals
- [ ] Add a business revenue entry
- [ ] Add a business expense entry
- [ ] Business page shows profit/loss

### Budgets
- [ ] Set a budget for "Food & Dining"
- [ ] Add a "Food & Dining" expense
- [ ] Budget page shows progress bar

### AI Coach
- [ ] Ask "How much can I safely spend today?"
- [ ] Get a personalized response (not generic)
- [ ] Ask "How much should I save for taxes?"

### Stripe
- [ ] Visit /pricing
- [ ] Click "Start Growth Plan"
- [ ] Complete checkout with test card `4242 4242 4242 4242`
- [ ] Redirected to dashboard with ?subscribed=true
- [ ] In Stripe Dashboard → Payments, see the test payment
- [ ] In Supabase → Table Editor → profiles, user's plan_type = 'growth'
- [ ] In Settings → Subscription, click "Manage Billing" → opens Stripe portal

---

## Troubleshooting

**"Cannot find module" errors when running npm run dev**
→ Run `npm install` again

**Supabase auth emails not arriving**
→ Check spam. In Supabase → Authentication → Email Templates to customize them.

**Stripe webhook not working**
→ Make sure the webhook URL matches exactly: `https://yourdomain.com/api/stripe/webhook`
→ Verify the STRIPE_WEBHOOK_SECRET is updated in Vercel and you've redeployed

**AI Coach not responding**
→ Check your OPENAI_API_KEY in .env.local (locally) or Vercel environment variables (deployed)
→ Make sure you've added billing to your OpenAI account

**Changes not showing on live site**
→ Every time you change environment variables in Vercel, you must redeploy

**User plan_type not updating after payment**
→ The webhook is not firing. Double-check Step 8. In Stripe → Webhooks → click your webhook → see recent events for errors.

---

## Helpful Links

| Resource | URL |
|---|---|
| Supabase Dashboard | supabase.com |
| Stripe Dashboard | dashboard.stripe.com |
| OpenAI Platform | platform.openai.com |
| Vercel Dashboard | vercel.com/dashboard |
| Namecheap DNS | namecheap.com → Manage → Advanced DNS |
| Next.js Docs | nextjs.org/docs |

---

## Estimated Timeline

| Phase | Time |
|---|---|
| Phase 1–4 (setup) | 1–2 hours |
| Phase 5 (local testing) | 30 minutes |
| Phase 6 (deploy to Vercel) | 30 minutes |
| Phase 7 (connect domain) | 30 minutes + DNS wait |
| Phase 8 (webhooks) | 20 minutes |
| Phase 9–10 (live testing) | 1 hour |
| **Total** | **4–6 hours** |

---

*Zoryva — Know Your Numbers. Grow With Confidence.*
*Built with Next.js · Supabase · Stripe · OpenAI · Vercel*

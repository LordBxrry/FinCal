# Financial Calendar App

A comprehensive financial calendar web app to track income and expenses, view daily cash flow, and project past and future money movement with premium social features.

## Features

### Core Features
- **Calendar View**: Visual calendar showing daily net value so gains and losses are easy to spot
- **Income & Expense Tracking**: Add one-time or recurring transactions with optional indefinite end dates
- **Vercel Accounts**: Sign up and sign in to securely save accounts over Vercel
- **Account Persistence**: All financial data syncs and persists across devices using Vercel KV storage
- **Budget Goals & Wishlist**: Set savings goals, track progress, and save wishlist items for future purchases
- **Monthly Summary**: Net balance, total inflow, and outflow calculations
- **Positive Reinforcement**: Motivational messaging to celebrate progress toward goals
- **Local & Cloud Storage**: Data persists locally and syncs to Vercel for cross-device access
- **CSV Export**: Download transaction history as CSV file
- **Responsive Design**: Works on desktop and mobile devices

### Premium Features (Stripe Integration)
- **Monthly Membership**: $9.99/month for full premium access
- **Weekly Membership**: $2.99/week (referral special offer)
- **Referral System**: 20% discount with code "SHARED2026"
- **Friend Pooling**: Invite friends to pool money together
- **Shared Events**: Create group events with budgets
- **Secure Payments**: PCI-compliant Stripe Elements integration

## Quick Start

### Prerequisites
- Node.js and npm (for Vercel CLI)
- Stripe account (free)
- Vercel account (free)

## Stripe Setup

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and click "Start now"
2. Complete account registration
3. Verify your email address

### 2. Get API Keys
1. In your Stripe dashboard, go to **Developers → API keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. **Important**: Keep these keys secure and never commit them to code

### 3. Test Mode vs Live Mode
- **Test Mode**: Use `pk_test_` and `sk_test_` keys for development
- **Live Mode**: Switch to `pk_live_` and `sk_live_` keys for production
- Test payments don't charge real cards

## Vercel Deployment

### Option 1: Using Vercel CLI (Recommended)

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Deploy the App
```bash
# Navigate to your project directory
cd path/to/financial-calendar

# Login to Vercel (first time only)
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new? → Create new
# - Project name → financial-calendar (or your choice)
# - Directory → ./ (current directory)
```

### Option 2: Using Vercel Web Interface

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. **Import Git Repository** or **Upload** your project folder
4. Configure build settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: Leave empty
   - **Output Directory**: `./`

## Environment Variables Setup

### In Vercel Dashboard
1. Go to your project dashboard
2. Click **Settings** tab
3. Click **Environment Variables**
4. Add the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | Your Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Your Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Optional: For webhook verification |

## Vercel KV Setup (Account Persistence)

Account persistence and cross-device sync is powered by Vercel KV (Redis).

### Enable Vercel KV in Your Project

1. **Open Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Select your FinCal project

2. **Add KV Storage**
   - Click **Storage** tab
   - Click **Create Database** → **KV**
   - Choose region (pick closest to your users)
   - Click **Create**

3. **Connect to Your Project**
   - Vercel automatically adds `KV_URL`, `KV_REST_API_URL`, and `KV_REST_API_TOKEN` to environment variables
   - These are automatically available in your `/api/auth.js` and `/api/user-data.js` files

4. **Verify Installation**
   - In Vercel dashboard, check **Settings** → **Environment Variables**
   - You should see `KV_*` variables listed

### How Account Persistence Works

- **Sign Up**: Creates account in Vercel KV with hashed password and auth token
- **Sign In**: Validates credentials and returns auth token
- **Data Sync**: All financial data syncs to Vercel automatically when changes are made
- **Cross-Device Access**: Sign in on any device and retrieve your complete financial data
- **Security**: Passwords are hashed with SHA-256; tokens expire after 30 days

### Account Data Stored in Vercel KV

```
user:{email}
  ├─ email
  ├─ name
  ├─ password (hashed)
  ├─ token (session token)
  ├─ createdAt
  ├─ updatedAt
  └─ data (all financial transactions, goals, wishlist, etc.)

token:{token}
  └─ email (for quick token lookup)
```

### Update Code with Your Keys
1. In your deployed project, go to the file editor
2. Open `static/js/app.js`
3. Find this line:
   ```javascript
   stripe = Stripe('pk_test_51QEXAMPLE...'); // Replace with your actual publishable key
   ```
4. Replace `'pk_test_51QEXAMPLE...'` with your actual publishable key

## Testing the App

### Test Payment Cards
Use these Stripe test cards (no real charges):

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Succeeds |
| `4000 0000 0000 0002` | Declines |
| `4000 0025 0000 3155` | Requires authentication |

All test cards use:
- **Expiry**: Any future date (e.g., 12/28)
- **CVC**: Any 3 digits (e.g., 123)
- **Name**: Any name

### Test Referral System
- Use referral code: `SHARED2026` for 20% off weekly membership
- Weekly plan: $2.99 → $2.39 (after discount)

### Test Flow
1. Visit your deployed app URL
2. Click "Sign in" and create an account
3. Click "Buy Premium"
4. Select a plan (Monthly or Weekly)
5. Enter referral code (optional)
6. Enter test card details
7. Complete payment
8. Verify premium features unlock

## Webhook Setup (Optional)

### For Production Use
1. In Stripe Dashboard → **Developers → Webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://your-app.vercel.app/api/webhook`
4. **Events to send**: `payment_intent.succeeded`
5. Copy the **Webhook signing secret** (starts with `whsec_`)
6. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Production Deployment

### Switch to Live Mode
1. In Stripe Dashboard → **Activate live mode**
2. Get live API keys (`pk_live_` and `sk_live_`)
3. Update Vercel environment variables
4. Update the publishable key in `static/js/app.js`
5. Redeploy to Vercel

### Domain Setup
1. In Vercel project settings → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed

## Project Structure

```
financial-calendar/
├── index.html                 # Main app HTML
├── README.md                  # This file
├── vercel.json               # Vercel deployment config
├── static/
│   ├── css/
│   │   └── style.css        # App styling
│   └── js/
│       └── app.js           # Main application logic
└── api/
    ├── create-payment-intent.js  # Stripe payment creation
    └── webhook.js               # Payment confirmation webhook
```

## Troubleshooting

### Common Issues

**Payments not working:**
- Check environment variables are set correctly
- Verify Stripe keys are for the correct mode (test/live)
- Check browser console for JavaScript errors

**App not loading:**
- Ensure all files are deployed
- Check Vercel build logs
- Verify `vercel.json` configuration

**Referral code not working:**
- Code is case-sensitive: `SHARED2026`
- Only applies to weekly plan
- Check for typos

### Vercel Build Issues
- Check build logs in Vercel dashboard
- Ensure `vercel.json` is in project root
- Verify Node.js version compatibility

### Stripe Issues
- Test in Stripe dashboard → **Payments**
- Check webhook delivery logs
- Verify API keys are correct

## Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **App Issues**: Check browser console and Vercel logs

## License

This project is open source. Modify and deploy as needed.

---

**Ready to deploy?** Follow the steps above and you'll have a fully functional financial calendar app with real payment processing!

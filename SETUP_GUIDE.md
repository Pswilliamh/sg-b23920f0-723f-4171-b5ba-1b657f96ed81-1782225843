# My Gift Song 2.0 - Setup Guide

## 🎵 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env.local` file and add your API keys:

```bash
# Required for song generation
VITE_SUNO_API_KEY=sk-your-actual-suno-key
GEMINI_API_KEY=your-actual-gemini-key

# Optional for payments
STRIPE_SECRET_KEY=sk_test_your-stripe-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
```

### 3. Get Your API Keys

#### Suno API (Required)
- Visit: https://302.ai (or your Suno provider)
- Sign up and navigate to API section
- Copy your API key starting with `sk-`
- Add to `.env.local` as `VITE_SUNO_API_KEY`

#### Google Gemini API (Required)
- Visit: https://ai.google.dev/
- Create a project and enable Gemini API
- Generate API key
- Add to `.env.local` as `GEMINI_API_KEY`

#### Stripe (Optional - for payments)
- Visit: https://dashboard.stripe.com/
- Get test API keys from Developers section
- Add both secret and publishable keys

### 4. Run the Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🔧 Troubleshooting

### Suno API Not Connecting

**Issue**: "Suno Connection Error" or songs not generating

**Solutions**:
1. Verify your `VITE_SUNO_API_KEY` is correct (starts with `sk-`)
2. Check API key is active on your Suno provider dashboard
3. Ensure you have API credits available
4. The app uses fallback audio URLs if Suno fails

### Admin Test Studio Access

**How to Access**:
1. Navigate to: http://localhost:3000/#test-studio
2. Enter password: `SHALOM` or `ADMIN`
3. Enter your email: `Pswilliamh@gmail.com` (or update in code)
4. Click "Unlock Sandbox Controls"

**Purpose**: Test song generation without going through payment flow

### Missing Environment Variables

**Symptoms**: 
- "API Key missing" errors
- Fallback/mock responses instead of real generation

**Fix**:
1. Copy `.env.local` template
2. Fill in ALL required variables
3. Restart server: `npm run dev`

---

## 🎯 Testing Without API Keys

The app includes fallback mechanisms:

- **No Suno Key**: Uses high-fidelity placeholder audio URLs
- **No Gemini Key**: Returns pre-built mock song structures
- **No Stripe Key**: Simulates successful checkout flow

This allows you to test the UI/UX before connecting real services.

---

## 📝 API Endpoints

### POST /api/generate-song
Generate custom lyrics based on user input
- Body: `{ target, context, setType, customGenre }`
- Returns: Song data with lyrics sections

### POST /api/generate-suno
Connect to live Suno AI for audio generation
- Body: `{ prompt, tags, make_instrumental, wait_audio_ready }`
- Returns: Audio URLs

### POST /api/generate-avatar-intro
Generate TTS intro speech (Gemini voice)
- Body: `{ introText }`
- Returns: Base64 audio

### POST /api/create-checkout-session
Create Stripe payment session
- Body: User details + song parameters
- Returns: Checkout URL

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Set Production Environment Variables
Make sure to set all environment variables in your hosting platform:
- Vercel: Project Settings > Environment Variables
- Heroku: Config Vars
- Railway: Variables tab

**Important**: Use production API keys, not test keys!

---

## 💡 Key Features

1. **Custom Song Generation** - AI-powered lyrics with Gemini
2. **Suno Audio Integration** - Real vocal track generation
3. **Multiple Song Styles** - Acoustic Folk, Bluegrass, Worship, etc.
4. **Premium Packages** - Quick Strum, Full Set, Premium Video, Legacy Bundle
5. **Admin Test Studio** - Internal testing without payment flow
6. **Fallback Systems** - Graceful degradation when APIs unavailable

---

## 📞 Support

Having issues? Check:
1. All environment variables are set correctly
2. API keys are active and have credits
3. Server is running on port 3000
4. Browser console for error messages

For Suno-specific issues, contact your API provider's support.
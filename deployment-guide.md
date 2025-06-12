# Amara AI Therapy - Complete Deployment Guide

## 🚀 Step-by-Step Deployment Process

### Step 1: Create Supabase Project

1. **Go to [Supabase Dashboard](https://app.supabase.com)**
2. **Click "New Project"**
3. **Fill in project details:**
   - Organization: Select or create
   - Name: `amara-ai-therapy`
   - Database Password: Generate a strong password (save this!)
   - Region: Choose closest to your users
4. **Click "Create new project"**
5. **Wait for project initialization (2-3 minutes)**

### Step 2: Get API Keys

1. **In your Supabase project dashboard:**
   - Go to **Settings** → **API**
   - Copy the **Project URL** (starts with `https://`)
   - Copy the **anon public** key (starts with `eyJ`)
   - Copy the **service_role** key (starts with `eyJ`) - Keep this secret!

### Step 3: Configure Environment Variables

1. **Create `.env` file in project root:**
```bash
# Copy from .env.example and fill in your actual values
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Never commit `.env` to version control!**

### Step 4: Set Up Database Schema

1. **In Supabase Dashboard:**
   - Go to **SQL Editor**
   - Click **"New query"**
   - Copy the entire content from `supabase/migrations/create_initial_schema.sql`
   - Paste and click **"Run"**
   - Verify all tables are created in **Database** → **Tables**

### Step 5: Deploy Edge Functions

1. **Install Supabase CLI:**
```bash
npm install -g supabase
```

2. **Login to Supabase:**
```bash
supabase login
```

3. **Link your project:**
```bash
supabase link --project-ref your-project-id
```

4. **Deploy functions:**
```bash
supabase functions deploy trial-status
supabase functions deploy update-trial-usage
supabase functions deploy initialize-trial-plan
```

### Step 6: Configure Authentication

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Settings**
   - **Site URL:** Set to your domain (e.g., `https://amara-ai.com`)
   - **Redirect URLs:** Add your domain + `/auth/callback`

2. **Enable Email Auth:**
   - **Enable email confirmations:** OFF (for easier testing)
   - **Enable email signup:** ON

3. **Configure OAuth Providers (Optional):**

   **For Google OAuth:**
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Add Client ID and Client Secret

   **For Apple OAuth:**
   - Enable **Apple**
   - Get credentials from [Apple Developer](https://developer.apple.com)
   - Add Client ID and Client Secret

### Step 7: Test Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Test authentication:**
   - Try signing up with email/password
   - Check Supabase Dashboard → **Authentication** → **Users**
   - Verify user profile is created automatically

4. **Test anonymous trial:**
   - Use chat without signing up
   - Verify trial limits work
   - Check **Database** → **device_trials** table

### Step 8: Deploy to Production

#### Option A: Deploy to Netlify

1. **Build the project:**
```bash
npm run build
```

2. **Deploy to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repository

3. **Set environment variables in Netlify:**
   - Go to Site Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

#### Option B: Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Set environment variables:**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Step 9: Configure Custom Domain (Optional)

1. **In your hosting platform:**
   - Add your custom domain
   - Configure DNS records

2. **Update Supabase settings:**
   - Go to **Authentication** → **Settings**
   - Update **Site URL** to your custom domain
   - Update **Redirect URLs**

### Step 10: Set Up Monitoring & Analytics

1. **Supabase Dashboard:**
   - Monitor **Database** → **Reports**
   - Check **Authentication** → **Users** growth
   - Review **Edge Functions** → **Logs**

2. **Add Google Analytics (Optional):**
   - Add tracking code to `index.html`
   - Monitor user engagement

## 🔧 Environment Variables Reference

```bash
# Required for frontend
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Required for Edge Functions (automatically available)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚨 Security Checklist

- [ ] Environment variables are set correctly
- [ ] `.env` file is in `.gitignore`
- [ ] RLS policies are enabled on all tables
- [ ] Service role key is kept secret
- [ ] HTTPS is enabled in production
- [ ] CORS is configured properly
- [ ] Authentication redirects are whitelisted

## 🧪 Testing Checklist

- [ ] User can sign up with email/password
- [ ] User can sign in with email/password
- [ ] Anonymous trial limits work correctly
- [ ] Trial conversion to paid account works
- [ ] Chat interface loads and functions
- [ ] Responsive design works on mobile
- [ ] All API endpoints respond correctly

## 🎯 Production Optimization

1. **Performance:**
   - Enable Supabase connection pooling
   - Optimize database queries
   - Add CDN for static assets

2. **Monitoring:**
   - Set up error tracking (Sentry)
   - Monitor API response times
   - Track user conversion rates

3. **Backup:**
   - Enable automatic database backups
   - Export user data regularly
   - Document recovery procedures

## 📞 Support & Troubleshooting

**Common Issues:**

1. **"Invalid API key" error:**
   - Check environment variables are set correctly
   - Verify API keys in Supabase dashboard

2. **CORS errors:**
   - Check Site URL in Supabase auth settings
   - Verify redirect URLs are whitelisted

3. **Database connection issues:**
   - Check RLS policies
   - Verify table permissions

4. **Edge function errors:**
   - Check function logs in Supabase dashboard
   - Verify function deployment

**Need Help?**
- Check Supabase documentation
- Review browser console for errors
- Check network tab for failed requests
- Contact support if needed

---

🎉 **Congratulations!** Your Amara AI Therapy application is now fully deployed and ready for users!
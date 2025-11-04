# 🎉 Welcome to TradieBear V6!

Your complete Next.js + Supabase MVP is ready to go!

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Check Your Environment
Your `.env.local` should already have these values:
```
NEXT_PUBLIC_SUPABASE_URL=https://hrymdzhmcizajjruofoy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Step 3: Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

## 🗄️ Database Setup Required

Before you can use the app, you need to set up your Supabase database tables:

### Option 1: Quick Setup (Recommended)
Open your Supabase SQL Editor and run the complete schema from:
**`DEPLOYMENT.md`** (lines 50-300)

This will create all 7 required tables:
- profiles
- referral_links
- services
- leads
- service_areas
- commission_tiers
- support_tickets

### Option 2: Manual Setup
Follow the detailed SQL commands in `DEPLOYMENT.md` under "Supabase Setup Checklist"

## 👤 Create Your First Admin User

### Step 1: Sign Up
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" or use the Supabase Auth signup flow
3. Create a user with your email/password

### Step 2: Make User Admin
In Supabase SQL Editor:
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## 🧪 Test the App

### 1. Login Test
```
URL: http://localhost:3000/login
Email: your-email@example.com
Password: your-password
```

You should be redirected to `/admin` ✅

### 2. Create Test Data

#### Add Services
```sql
INSERT INTO services (name, description, is_active) VALUES
('Plumbing', 'Residential plumbing services', true),
('Electrical', 'Electrical work', true),
('HVAC', 'Heating and cooling', true);
```

#### Create a Referral Link
```sql
INSERT INTO referral_links (user_id, slug, is_active)
VALUES (
  'your-user-uuid',  -- Get from profiles table
  'test-partner',
  true
);
```

### 3. Test the Form
Visit: `http://localhost:3000/r/test-partner`
- Fill out the form
- Upload some images
- Submit!

### 4. Check Admin Dashboard
Go back to `/admin` → Leads tab
Your test submission should appear! 🎉

## 📁 What's Inside?

```
✅ Authentication System (email/password with roles)
✅ Public Referral Forms (/r/[slug]) with image upload
✅ Admin Dashboard with 5 tabs:
   - Leads (view & manage submissions)
   - Services (toggle active/inactive)
   - Areas (define service areas)
   - Commissions (manage tiers)
   - Support (handle tickets)
✅ Dark/Light Mode Toggle
✅ Fully Responsive Design
✅ TypeScript Throughout
✅ Production-Ready Code
```

## 🎯 Key Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Home (redirects) | Optional |
| `/login` | Admin login | No |
| `/r/[slug]` | Public referral form | No |
| `/admin` | Dashboard | Yes (admin) |

## 🎨 Features Highlights

### For Homeowners (Public)
- Beautiful, easy-to-use form
- Upload up to 10 images
- Mobile-friendly
- Instant submission confirmation

### For Admins (Dashboard)
- View all leads in one place
- Track lead stages (new → won/lost)
- Manage services and areas
- Update commission structures
- Handle support tickets
- Search and filter leads

## 📚 Documentation

- **QUICKSTART.md** - 5-minute setup guide
- **README.md** - Complete documentation (recommended read!)
- **DEPLOYMENT.md** - Deploy to production
- **PROJECT_SUMMARY.md** - Technical overview

## 🚀 Deploy to Production

When ready, follow **DEPLOYMENT.md** for step-by-step Vercel deployment:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

Your app will be live in ~2 minutes ⚡

## 🔧 Common Tasks

### Add a New Service
Admin Dashboard → Services tab → (manage via Supabase for now)

### Create Referral Link for Partner
```sql
INSERT INTO referral_links (user_id, slug, is_active)
VALUES ('partner-uuid', 'partner-name', true);
```

Share link: `yourdomain.com/r/partner-name`

### Update Lead Stage
Admin Dashboard → Leads tab → Click stage badge → Select new stage

## ⚙️ Tech Stack

- **Next.js 14** (App Router, RSC)
- **TypeScript** (strict mode)
- **TailwindCSS** (custom theme)
- **shadcn/ui** (15 components)
- **Supabase** (auth + database)
- **Lucide Icons**

## 🐛 Troubleshooting

### "Can't log in"
- Verify user exists in `profiles` table
- Check `role = 'admin'`
- Clear browser cookies

### "Referral link 404"
- Check link exists in `referral_links` table
- Verify `is_active = true`
- Ensure slug matches URL

### "Images not uploading"
- Create `lead-attachments` bucket in Supabase Storage
- Set bucket to **public**
- Verify file size < 10 MB

## 💡 Pro Tips

1. **Use the search** - Filter leads by name, email, or phone
2. **Stage colors** - Quick visual status (blue=new, green=won, etc.)
3. **Dark mode** - Click sun/moon icon in header
4. **View details** - Click eye icon on any lead for full info
5. **Mobile friendly** - Works great on phones and tablets

## 📧 Next: Email Integration

Want email notifications when leads submit? Add Resend integration:

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxx
   ```
4. Create API route at `app/api/lead/route.ts`

(Full code available on request!)

## ✅ Pre-Launch Checklist

Before going live:
- [ ] All Supabase tables created
- [ ] Admin user created and tested
- [ ] At least 3 services added
- [ ] Test referral link created
- [ ] Form submission tested
- [ ] Image upload tested
- [ ] Admin dashboard tested
- [ ] Dark mode works
- [ ] Mobile responsive checked
- [ ] Environment variables set

## 🆘 Need Help?

1. Check the README.md (comprehensive guide)
2. Review DEPLOYMENT.md (database schema)
3. See QUICKSTART.md (quick reference)
4. Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
5. Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)

## 🎊 You're All Set!

Everything is ready to go. Just:
1. `npm install`
2. Set up Supabase tables
3. Create admin user
4. `npm run dev`

**Happy building!** 🚀

---

**Questions about email integration?** Let me know and I'll provide the Resend implementation!

**Ready to add features?** The codebase is clean, typed, and ready to extend.

**Need hosting?** Follow DEPLOYMENT.md for Vercel deployment (free tier available).


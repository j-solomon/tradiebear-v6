# TradieBear V6

A production-ready MVP web application connecting homeowners with verified contractors through referral links.

## 🚀 Features

- **Public Referral Forms**: Unique `/r/[slug]` pages for each partner with image upload support
- **Admin Dashboard**: Comprehensive management interface for leads, services, areas, and commissions
- **Authentication**: Secure email-based login with Supabase Auth and role-based access control
- **Dark/Light Mode**: Full theme support with next-themes
- **Responsive Design**: Mobile-first UI built with TailwindCSS and shadcn/ui
- **TypeScript**: Fully typed for better developer experience and code quality

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Database & Auth**: Supabase
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase project with the following tables:
  - `profiles` (with `role` field)
  - `referral_links` (with `slug` field)
  - `leads`
  - `services`
  - `service_areas`
  - `commission_tiers`
  - `support_tickets`
- Supabase Storage bucket: `lead-attachments` (public)

## 🏁 Getting Started

### 1. Clone and Install

\`\`\`bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 2. Run Development Server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
TradieBear-V6/
├── app/
│   ├── admin/              # Admin dashboard
│   │   ├── tabs/           # Dashboard tab components
│   │   ├── page.tsx        # Admin page (server)
│   │   └── admin-dashboard.tsx
│   ├── login/              # Authentication
│   ├── r/[slug]/           # Public referral forms
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home (redirects)
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── theme-provider.tsx  # Theme context
│   └── theme-toggle.tsx    # Dark/light mode toggle
├── lib/
│   ├── supabase/           # Supabase client setup
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client
│   │   └── middleware.ts   # Auth middleware
│   └── utils.ts            # Utility functions
├── middleware.ts           # Next.js middleware (auth)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
\`\`\`

## 🔐 Authentication Flow

1. Admin navigates to `/login`
2. Enters email and password
3. Supabase Auth validates credentials
4. Role check against `profiles.role = 'admin'`
5. Redirect to `/admin` if authorized
6. Middleware protects all routes except `/r/[slug]` and `/login`

## 🎨 Key Routes

- `/` - Home (redirects to login or admin)
- `/login` - Admin authentication
- `/r/[slug]` - Public referral form (no auth required)
- `/admin` - Admin dashboard (auth required, role: admin)

## 📊 Admin Dashboard Tabs

### 1. Leads
- View all submitted lead requests
- Filter by stage and search
- Update lead stages (new → contacted → qualified → quoted → won/lost)
- View detailed lead information including attachments

### 2. Services
- View all available services
- Toggle services active/inactive
- Services appear in referral form dropdowns when active

### 3. Areas
- Define geographic service areas (state, county, city, ZIP)
- Add new areas
- Delete areas

### 4. Commissions
- View commission tier structure
- Update commission percentages based on project value ranges

### 5. Support
- View support tickets from partners
- Update ticket status (open → in progress → resolved → closed)

## 🎨 Design System

The app uses shadcn/ui components with a custom color palette supporting dark/light modes:

- **Primary**: Main brand color
- **Secondary**: Supporting accent
- **Muted**: Subtle backgrounds
- **Destructive**: Error/warning states

Toggle between themes using the sun/moon icon in the header.

## 🖼️ Image Upload

The referral form supports:
- Up to 10 images per submission
- Max 10 MB per file
- Formats: JPG, PNG, HEIC
- Stored in Supabase Storage (`lead-attachments` bucket)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables on Vercel

Add these in your Vercel project settings → Environment Variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
\`\`\`

**Note:** The `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is required for address autocomplete on the referral form. Get your API key from [Google Cloud Console](https://console.cloud.google.com/) and enable **Places API** and **Maps JavaScript API**.

## 🔧 Customization

### Adding New Services

Services are managed in Supabase. Add entries to the `services` table:

\`\`\`sql
INSERT INTO services (name, description, is_active)
VALUES ('Plumbing', 'Residential and commercial plumbing services', true);
\`\`\`

### Creating Referral Links

Add entries to `referral_links` table:

\`\`\`sql
INSERT INTO referral_links (user_id, slug, is_active)
VALUES ('user-uuid', 'partner-name', true);
\`\`\`

The link will be accessible at `/r/partner-name`

## 📝 To-Do / Future Enhancements

- [ ] Email notifications via Resend API
- [ ] Partner dashboard for viewing their referred leads
- [ ] Lead assignment and routing logic
- [ ] Advanced filtering and search
- [ ] Export leads to CSV
- [ ] Analytics and reporting
- [ ] SMS notifications
- [ ] Payment processing integration

## 🐛 Troubleshooting

### Authentication Issues

- Ensure Supabase URL and keys are correct in `.env.local`
- Check that user exists in `profiles` table with `role = 'admin'`
- Clear browser cookies and try again

### Image Upload Failing

- Verify `lead-attachments` storage bucket exists in Supabase
- Check bucket is set to public
- Verify file size is under 10 MB

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild
- Check Node.js version (18+)

## 📄 License

MIT License - feel free to use this for your own projects!

## 💬 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

Built with ❤️ by TradieBear Team


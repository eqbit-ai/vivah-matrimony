# 🎊 Vivah Matrimony Platform

A complete production-ready Indian matrimonial web application with modern UI, secure authentication, subscription system, and comprehensive admin panel.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser/Mobile)                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND (Vercel) - Next.js 14                      │
│  Landing Page │ Auth │ Dashboard │ Admin Panel │ Search         │
└─────────────────────────────────────────────────────────────────┘
                               │ REST API
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND (Railway) - NestJS                          │
│  Auth │ Profiles │ Interests │ Subscriptions │ Notifications    │
└─────────────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
┌───────────────────┐ ┌───────────────┐ ┌──────────────────┐
│   PostgreSQL DB   │ │    Redis      │ │  File Storage    │
│   (Railway)       │ │   (Cache)     │ │  (Railway Vol)   │
└───────────────────┘ └───────────────┘ └──────────────────┘
```

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Zustand |
| Backend | NestJS, TypeScript, Prisma ORM, JWT, Passport |
| Database | PostgreSQL |
| Payment | Razorpay |
| Email | Nodemailer |
| Deployment | Railway (Backend), Vercel (Frontend) |

## 📁 Project Structure

```
vivah-matrimony/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema with all models
│   │   └── seed.ts             # Seed data for testing
│   ├── src/
│   │   ├── auth/               # JWT authentication
│   │   ├── users/              # User management
│   │   ├── profiles/           # Profile CRUD & search
│   │   ├── interests/          # Interest system
│   │   ├── subscriptions/      # Payment & subscriptions
│   │   ├── admin/              # Admin panel APIs
│   │   ├── notifications/      # Notification system
│   │   ├── email/              # Email service
│   │   ├── upload/             # File uploads
│   │   └── prisma/             # Database service
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # API client, store, utils
│   │   ├── types/              # TypeScript definitions
│   │   └── styles/             # Global CSS
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔐 Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Signup  │────▶│  Create  │────▶│  Send    │────▶│  Store   │
│  Form    │     │  User    │     │  Email   │     │  JWT     │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                         │
┌──────────┐     ┌──────────┐     ┌──────────┐          │
│  Login   │────▶│ Validate │────▶│ Generate │──────────┘
│  Form    │     │ Password │     │   JWT    │
└──────────┘     └──────────┘     └──────────┘

Protected Routes: JWT in Authorization header → JwtAuthGuard → RolesGuard
```

## 🔄 API Contracts

### Authentication

```typescript
// POST /api/v1/auth/signup
Request: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  religion: string;
  phone: string;
  state: string;
  city: string;
  education: string;
  profession: string;
}
Response: {
  accessToken: string;
  user: { id, email, role, profile }
}

// POST /api/v1/auth/login
Request: { email: string; password: string; }
Response: { accessToken: string; user: {...} }

// POST /api/v1/auth/forgot-password
Request: { email: string; }
Response: { message: string; }

// POST /api/v1/auth/reset-password
Request: { token: string; password: string; }
Response: { message: string; }
```

### Profiles

```typescript
// GET /api/v1/profiles/me - Get own profile
// PUT /api/v1/profiles/me - Update profile
// GET /api/v1/profiles/search?page=1&minAge=25&religion=HINDU
Response: {
  data: Profile[];
  meta: { total, page, limit, totalPages, hasMore }
}

// GET /api/v1/profiles/:id - View profile (limited for free users)
// GET /api/v1/profiles/:id/full - Full profile (paid users only)
```

### Interests

```typescript
// POST /api/v1/interests - Send interest (paid only)
Request: { receiverId: string; message?: string; }

// PUT /api/v1/interests/:id/respond
Request: { status: "ACCEPTED" | "REJECTED" }

// GET /api/v1/interests/sent
// GET /api/v1/interests/received
// GET /api/v1/interests/matches
```

### Subscriptions

```typescript
// GET /api/v1/subscriptions/plans
// GET /api/v1/subscriptions/status
// POST /api/v1/subscriptions/create-order
Request: { planType: "BASIC" | "PREMIUM" }

// POST /api/v1/subscriptions/verify-payment
Request: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
```

### Admin

```typescript
// GET /api/v1/admin/dashboard - Metrics
// GET /api/v1/admin/users?search=&gender=&religion=&subscriptionStatus=
// GET /api/v1/admin/users/:id - Full user details with contact
// PUT /api/v1/admin/users/:id/verify
// PUT /api/v1/admin/users/:id/deactivate
// GET /api/v1/admin/interests
// POST /api/v1/admin/interests/schedule-meeting
Request: { interestId, meetingDate, meetingVenue, meetingNotes }
```

## 🛡️ Authorization Logic

```typescript
// Role-based access
@Roles(Role.ADMIN)        // Admin only
@UseGuards(JwtAuthGuard)  // Authenticated users
@UseGuards(SubscriptionGuard)  // Paid users only

// Subscription enforcement
FREE_PLAN:
  ✓ Browse profiles (basic info only)
  ✓ See: name, age, profession, location, profile picture
  ✗ View full profile
  ✗ Express interest
  ✗ See contact info

PAID_PLAN (₹1499):
  ✓ All free features
  ✓ View full profiles
  ✓ View gallery images
  ✓ Express interest
  ✗ Message users
  ✗ See contact info

ADMIN:
  ✓ All features
  ✓ View contact info
  ✓ Schedule meetings
  ✓ Manage users
```

## 💳 Subscription Flow

```
User clicks "Upgrade" → Create Razorpay Order → Open Razorpay Checkout
    → User completes payment → Razorpay callback → Verify signature
    → Update subscription status → Grant access
```

## 🔔 Notification System

| Event | Recipient | Channel |
|-------|-----------|---------|
| New Interest | Receiver | In-app, Email |
| Interest Accepted | Sender | In-app, Email |
| Meeting Scheduled | Both | In-app, Email |
| Profile Viewed | Owner | In-app |

## 🚀 Deployment Guide

### Backend (Railway)

1. **Create Railway Project**
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
```

2. **Add PostgreSQL**
- Go to Railway Dashboard
- Click "New" → "Database" → "PostgreSQL"
- Copy the DATABASE_URL

3. **Configure Environment Variables**
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=<from-railway>
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.vercel.app
BASE_URL=https://your-backend.railway.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
```

4. **Deploy**
```bash
cd backend
railway up
```

5. **Run Migrations**
```bash
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

### Frontend (Vercel)

1. **Connect Repository**
- Go to vercel.com
- Import your Git repository
- Set root directory to `frontend`

2. **Configure Environment Variables**
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
```

3. **Deploy**
- Vercel auto-deploys on push to main branch

### Docker (Local Development)

```bash
# Clone and setup
git clone <repo>
cd vivah-matrimony

# Create .env file
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma db seed

# Access
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
# API Docs: http://localhost:4000/api/docs
```

## 🔒 Security Best Practices

1. **Authentication**
   - Bcrypt password hashing (12 rounds)
   - JWT with expiration
   - HTTP-only cookies option
   - Rate limiting on auth endpoints

2. **Data Protection**
   - Input validation (class-validator)
   - SQL injection prevention (Prisma)
   - XSS prevention (React default)
   - CORS configuration

3. **API Security**
   - Helmet middleware
   - Request throttling
   - Role-based guards
   - Subscription enforcement

4. **Privacy**
   - Contact info hidden from users
   - Profile views logged
   - Admin audit logging

## 🧪 Testing Strategy

```bash
# Backend tests
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage

# Frontend tests
cd frontend
npm run test          # Jest tests
npm run test:e2e      # Playwright
```

## ✅ Production Checklist

- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure production DATABASE_URL
- [ ] Set up SMTP credentials
- [ ] Configure Razorpay live keys
- [ ] Enable SSL/HTTPS
- [ ] Set CORS to frontend domain only
- [ ] Configure rate limiting
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure backups for PostgreSQL
- [ ] Set up CI/CD pipeline
- [ ] Load testing completed
- [ ] Security audit completed

## 📝 Demo Credentials

```
Admin:
  Email: admin@vivahmatrimony.com
  Password: Admin@123

User (Male, Paid):
  Email: rahul@example.com
  Password: User@123

User (Female, Free):
  Email: priya@example.com
  Password: User@123
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for Indian families seeking perfect matches.

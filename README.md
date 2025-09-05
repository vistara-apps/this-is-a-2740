# KnowYourRights AI

**Instant legal clarity in your pocket. Stay safe, stay informed.**

A mobile-first web application providing instant, actionable legal information and scripting for interactions with law enforcement, designed for quick access across US states.

## 🚀 Features

### Core Features
- **On-the-Spot Rights & Scripts**: Immediate guidance on user rights during police interactions with state-specific 'what to say' and 'what NOT to say' scripts
- **State-Specific Legal Summaries**: Condensed state laws and regulations in easily digestible, mobile-optimized content
- **Incident Recording & Sharing**: Quick audio/video recording with secure IPFS storage and sharing capabilities
- **Best Practice Guides & Scenarios**: Educational content on proactive steps and common mistakes to avoid

### Advanced Features
- **AI-Powered Script Generation**: Dynamic, context-aware legal scripts using OpenAI
- **Multilingual Support**: Spanish translations for all content
- **Cloud Storage**: Decentralized storage via Pinata IPFS
- **Subscription Management**: Freemium model with Stripe integration
- **Real-time Updates**: State law changes and legal updates

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI GPT-3.5-turbo for script generation
- **Storage**: Pinata IPFS for decentralized file storage
- **Payments**: Stripe for subscription management
- **Deployment**: Docker-ready with Vite build

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key (optional, for AI features)
- Pinata account (optional, for IPFS storage)
- Stripe account (optional, for payments)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd knowyourrights-ai
npm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
# Required - Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - AI Features
VITE_OPENAI_API_KEY=your_openai_api_key

# Optional - IPFS Storage
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key

# Optional - Payments
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema:

```sql
-- Copy and paste the contents of database/schema.sql into your Supabase SQL editor
```

3. The schema includes:
   - User profiles and preferences
   - State laws data with initial content
   - Incident reports with IPFS integration
   - Row Level Security (RLS) policies
   - Automatic user profile creation triggers

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗 Architecture

### Data Model

```
Users
├── user_id (UUID, FK to auth.users)
├── email
├── subscription_status ('free' | 'premium')
├── preferred_state
└── timestamps

State Laws
├── state_name (unique)
├── rights_summary
├── script_guidance_english (JSONB)
├── script_guidance_spanish (JSONB)
├── common_pitfalls (TEXT[])
└── specific_laws (JSONB)

Incident Reports
├── report_id (UUID)
├── user_id (FK)
├── timestamp
├── location (JSONB)
├── notes
├── recording_url
├── ipfs_hash
└── sharing info
```

### User Flows

1. **User Onboarding**
   - Landing → State selection → Feature tour → Optional signup

2. **Accessing Rights Information**
   - Rights section → State selection → Scenario-specific scripts → AI-generated variations (Premium)

3. **Recording an Incident**
   - Record button → Permissions → Recording → Notes/Location → IPFS upload → Sharing options

## 🎨 Design System

The app uses a comprehensive design system built with Tailwind CSS:

- **Colors**: Primary (blue), Accent (green), Error (red), Surface (white/gray)
- **Typography**: Display, Headings, Body, Caption styles
- **Components**: Button, Card, AlertBanner, Accordion, InputWithLabel
- **Layout**: 12-column grid, responsive breakpoints
- **Motion**: Smooth transitions with cubic-bezier easing

## 🔧 API Integration

### Supabase
- **Authentication**: Email/password with automatic profile creation
- **Database**: PostgreSQL with RLS for security
- **Real-time**: Subscription to data changes

### OpenAI (Optional)
- **Script Generation**: Context-aware legal scripts
- **Translation**: Spanish language support
- **Text Simplification**: Complex legal text made accessible

### Pinata IPFS (Optional)
- **File Storage**: Decentralized incident recordings
- **Metadata**: Searchable file information
- **Sharing**: Immutable, censorship-resistant links

### Stripe (Optional)
- **Subscriptions**: $4.99/month premium tier
- **Customer Portal**: Self-service billing management
- **Feature Gating**: Premium feature access control

## 🚀 Deployment

### Docker Deployment

```bash
# Build the image
docker build -t knowyourrights-ai .

# Run the container
docker run -p 3000:3000 knowyourrights-ai
```

### Manual Deployment

```bash
# Build for production
npm run build

# Preview the build
npm run preview

# Deploy the dist/ folder to your hosting provider
```

## 🔒 Security

- **Row Level Security**: Database-level access control
- **Authentication**: Supabase Auth with JWT tokens
- **API Keys**: Environment-based configuration
- **CORS**: Proper cross-origin resource sharing
- **Input Validation**: Client and server-side validation

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first approach
- **Touch Interactions**: Optimized for touch devices
- **Performance**: Lazy loading and code splitting
- **PWA Ready**: Service worker and manifest support
- **Offline Capability**: Local storage fallbacks

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📈 Analytics & Monitoring

The app includes user activity logging for:
- Feature usage tracking
- Error monitoring
- Performance metrics
- User engagement analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@knowyourrights-ai.com or create an issue in this repository.

## 🔮 Roadmap

- [ ] Additional state coverage (all 50 states)
- [ ] Video recording capabilities
- [ ] Legal aid organization partnerships
- [ ] Multi-language support beyond Spanish
- [ ] Mobile app versions (iOS/Android)
- [ ] Advanced AI features (case law analysis)
- [ ] Community features (shared experiences)
- [ ] Legal professional network integration

---

**Disclaimer**: This application provides general legal information and should not be considered as legal advice. Always consult with a qualified attorney for specific legal matters.

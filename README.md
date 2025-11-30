# Subscrybe Demo App 🚀

A stunning, fully-animated demo application showcasing crypto subscription management on Cardano with privacy-first design.

## 🎯 Features

### Core Pages
- **Landing Page** - Beautiful hero section with animated features
- **Dashboard** - Overview with spending analytics and charts
- **Subscriptions** - Manage all subscriptions with search and filters
- **Calendar View** - Visual payment calendar
- **Hydra Demo** - Interactive L1 vs Hydra comparison
- **Privacy Dashboard** - Privacy score and data control
- **Merchant Dashboard** - Revenue analytics for merchants

### Key Highlights
- ⚡ **Hydra Integration** - Demonstrates 100x faster, 88% cheaper transactions
- 🔒 **Privacy-First** - Minimal data collection, full user control
- 🎨 **Beautiful UI** - Cardano-branded design with smooth animations
- 📊 **Analytics** - Spending trends and payment tracking
- 🎉 **Meme Integration** - Achievement popups and celebrations
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Confetti**: Canvas Confetti

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd subscrybe-demo
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
subscrybe-demo/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Landing page
│   ├── dashboard/           # Dashboard page
│   ├── subscriptions/       # Subscriptions management
│   ├── calendar/            # Payment calendar
│   ├── hydra/               # Hydra demo
│   ├── privacy/             # Privacy dashboard
│   └── merchant/            # Merchant dashboard
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Layout components
│   ├── dashboard/           # Dashboard-specific components
│   ├── subscriptions/       # Subscription components
│   ├── hydra/               # Hydra demo components
│   └── memes/               # Meme/achievement popups
├── lib/
│   ├── mock-data.ts         # All mock data
│   ├── utils.ts             # Utility functions
│   ├── animations.ts        # Framer Motion variants
│   └── context.tsx          # React Context for state
└── public/                  # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: #0033AD (Cardano Blue)
- **Secondary**: #00D4AA (Cardano Teal)
- **Background**: #0F172A (Dark Slate)
- **Surface**: #1E293B (Slate 800)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)

### Typography
- **Primary Font**: Inter
- **Monospace**: JetBrains Mono

## 🎭 Key Features Explained

### Hydra Demo
The Hydra demo page showcases the dramatic difference between Layer 1 and Hydra Layer 2:
- L1: 18 seconds, 0.17 ADA fee
- Hydra: 0.2 seconds, 0.02 ADA fee
- Includes animated progress bars and confetti celebration

### Privacy Dashboard
Demonstrates privacy-first approach:
- Shows minimal data collection (only wallet address)
- Privacy score with animated gauge
- Export data functionality
- Account deletion option

### Subscription Management
- Add/cancel subscriptions
- Search and filter functionality
- Status badges (active/paused/cancelled)
- Achievement popups for milestones

## 🚫 What's NOT Implemented (By Design)

This is a visual demo, so the following are intentionally mocked:
- ❌ Real smart contract deployment
- ❌ Wallet integration (uses mock wallet)
- ❌ Blockfrost API calls
- ❌ Real Hydra implementation
- ❌ Backend server
- ❌ Database
- ❌ Authentication

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚀 Deploy to Vercel

The easiest way to deploy:

1. Push to GitHub
2. Import to Vercel
3. Deploy automatically

Or use the Vercel CLI:
```bash
vercel
```

## 🎯 Demo Flow

1. **Landing Page** - Introduces the concept
2. **Dashboard** - Shows spending overview
3. **Subscriptions** - Add/manage subscriptions
4. **Hydra Demo** - Run the comparison
5. **Privacy** - Export data or delete account
6. **Calendar** - View payment schedule
7. **Merchant** - See merchant perspective

## 🏆 Achievement System

Meme popups appear for:
- First subscription added
- 3+ subscriptions cancelled
- 0 ADA spent in a month
- Hydra demo completion

## 📱 Responsive Design

- **Mobile**: 375px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🤝 Contributing

This is a demo project. Feel free to fork and customize!

## 📄 License

MIT License - feel free to use this for your own demos and presentations.

## 🙏 Acknowledgments

- Built for Cardano ecosystem
- Inspired by Web2 subscription management tools
- Designed to showcase Hydra's potential

---

**Built with ❤️ for the Cardano community**

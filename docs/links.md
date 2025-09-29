# ai-writer - Deployment Links

## 🚀 Live Application

- **App URL**: https://ai.vercel.app

> **Note**: To open the app, use the domain link above. If the page is already open, refresh to see the latest version.

## 📝 Repository

- **GitHub**: https://github.com/Yabonev/ai-writer
- **Clone**: `git clone https://github.com/Yabonev/ai-writer.git`

## 🗄️ Database

- **Provider**: Neon PostgreSQL
- **Project ID**: lingering-paper-79037587
- **Console**: https://console.neon.tech/app/projects/lingering-paper-79037587

## 🛠️ Local Development

### Prerequisites

- Docker (for local database)

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/Yabonev/ai-writer.git
cd ai-writer

# 2. Install dependencies
npm install

# 3. Create local database (requires Docker)
./database.sh

# 4. Start development server
npm run dev
```

### Working in this directory:

The deployment script automatically:

- ✅ Sets up local database (requires Docker)
- ✅ Runs Prisma schema migration
- ✅ Starts development server
- ✅ Opens both production and local URLs

Manual commands (if needed):

```bash
# Restart development server
npm run dev

# Check dev server logs
tail -f dev.log

# Reset local database
./database.sh && npx prisma db push
```

## 📊 Management URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Console**: https://console.neon.tech/
- **GitHub Repository**: https://github.com/Yabonev/ai-writer

---

_Generated on Mon Sep 29 20:15:02 EEST 2025 by T3 Deployment Script_

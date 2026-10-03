# AppHub

**Une plateforme SaaS complète avec système de crédits, abonnements et paiement**

## 🎯 Fonctionnalités

- ✅ **Système d'abonnement** (Free, Simple+, Pro, VIP, Premium)
- ✅ **Gestion des crédits** (crédits du plan + packs d'achat)
- ✅ **10+ outils IA** (générateur QR, assistant code, génération d'images, etc.)
- ✅ **Quotas journaliers** (protection contre les abus)
- ✅ **Audit complet** (ledger immuable)
- ✅ **Intégration paiement** (Lemon Squeezy / Paddle)
- ✅ **Sécurité RLS** (Row Level Security avec Supabase)

## 🏗️ Architecture

- **Backend** : Next.js (routes API + RPC Supabase)
- **Base de données** : PostgreSQL (Supabase)
- **Paiement** : Lemon Squeezy ou Paddle
- **Frontend** : React/TypeScript

## 📁 Structure du projet

```
AppHub/
├── supabase/
│   ├── migrations/
│   │   └── 001_init_credits_schema.sql    # Schéma initial
│   └── types/
│       └── database.types.ts
├── app/
│   ├── api/
│   │   ├── credits/
│   │   │   ├── consume.ts                 # Consommer des crédits
│   │   │   └── balance.ts                 # Voir le solde
│   │   ├── webhooks/
│   │   │   ├── lemonsqueezy.ts            # Webhook Lemon Squeezy
│   │   │   └── paddle.ts                  # Webhook Paddle
│   │   └── tools/
│   │       └── list.ts
│   └── dashboard/
│       ├── page.tsx                       # Tableau de bord
│       └── credits/
│           └── page.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                      # Client Supabase côté client
│   │   └── server.ts                      # Client Supabase côté serveur
│   └── types.ts
├── .env.local
├── package.json
└── README.md
```

## 🚀 Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration Supabase

```bash
# Copier le template env
cp .env.example .env.local

# Ajouter tes clés Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Exécuter les migrations

```bash
supabase migration up
```

Ou copier/coller le contenu de `supabase/migrations/001_init_credits_schema.sql` dans l'éditeur SQL de Supabase.

### 4. Démarrer l'app

```bash
npm run dev
```

## 📚 API Endpoints

### Consommer des crédits
```bash
POST /api/credits/consume
{
  "tool": "code-assistant",
  "quantity": 1
}
```

### Voir le solde
```bash
GET /api/credits/balance
```

### Webhooks
- `POST /api/webhooks/lemonsqueezy` → Lemon Squeezy
- `POST /api/webhooks/paddle` → Paddle

## 🔐 Sécurité

- Toutes les écritures passent par le serveur (clé `service_role`)
- RLS active sur toutes les tables
- Les utilisateurs ne voient que leurs données

## 📖 Docs

- [Schéma SQL](./supabase/migrations/001_init_credits_schema.sql)
- [Exemple d'utilisation serveur](./supabase/migrations/001_init_credits_schema.sql#L365)

---

**Créé avec ❤️ pour les makers**

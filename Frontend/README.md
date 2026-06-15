# Blume Frontend

Web application for the Blume smart water management system — a dashboard and landing site for monitoring and controlling automated irrigation zones.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui, Radix UI
- **Icons:** Lucide React
- **Package Manager:** pnpm

## Project Structure

```
app/
├── components/       # Landing page sections (Hero, About, Services, etc.)
├── dashboard/        # Dashboard UI with zone cards, charts, tank gauge
│   └── _components/
├── admin/            # Admin panel
├── globals.css
├── layout.tsx
└── page.tsx
components/
└── ui/               # Reusable shadcn components
lib/
├── mockData.ts       # Mock sensor/zone data
└── utils.ts
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm lint` | Run ESLint |

## Part of

This is the **Frontend** module of the Blume system. See the root repository for the **Cloud** and **Hardware** modules.

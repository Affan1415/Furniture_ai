# FORMA - AI-Powered Furniture Showcase

A modern, production-ready Next.js application for showcasing furniture products with AI-generated multi-view images.

## Features


- **AI-Powered Visualization**: Generate multiple product views (front, side, 45° angle, in-room) using Gemini Vision
- **Modern Design**: Clean, premium furniture-brand aesthetic (IKEA × BoConcept inspired)
- **Responsive**: Mobile-first, fully responsive design
- **Performance Optimized**: Image optimization, lazy loading, streaming
- **Type-Safe**: Full TypeScript coverage

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Google Gemini API
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   └── generate-view/  # AI view generation endpoint
│   ├── products/
│   │   └── [id]/          # Dynamic product detail pages
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Homepage with product grid
│   ├── loading.tsx        # Loading state
│   └── not-found.tsx      # 404 page
├── components/            # Reusable UI components
│   ├── ProductCard.tsx    # Product card with hover effects
│   ├── ProductGrid.tsx    # Responsive product grid
│   ├── ImageGallery.tsx   # AI-powered image carousel
│   ├── CategoryFilter.tsx # Category filter chips
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Site footer
├── lib/                   # Core logic
│   ├── ai.ts             # AI abstraction layer (Gemini)
│   ├── products.ts       # Product data & queries
│   └── utils.ts          # Utility functions
└── types/                # TypeScript definitions
    └── index.ts          # Shared types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd furniture-ai

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### Environment Variables

Add your Gemini API key to `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

Get your API key at: https://aistudio.google.com/app/apikey

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Architecture Decisions

### Server Components by Default
Pages and layouts use Server Components for better performance and SEO. Client Components are used only where interactivity is required (ImageGallery, CategoryFilter, Header mobile menu).

### AI Abstraction Layer
The `/lib/ai.ts` module provides a clean abstraction over the Gemini API:
- Parameterized prompt generation
- Mock responses when API key is unavailable
- Support for multiple view types
- Extensible for future AI models

### Prompt Engineering
AI prompts are generated dynamically with:
- Product context (name, category, materials)
- View-specific instructions
- Lighting and background options
- Quality parameters

Example prompt structure:
```typescript
generatePrompt(product, 'angle-45', {
  lighting: 'studio',
  background: 'minimal',
  quality: 'high'
})
```

### Image Optimization
- Uses `next/image` for automatic optimization
- Responsive sizes based on viewport
- Priority loading for above-fold images
- Blur placeholders for smooth loading

### Scalability Considerations
The architecture supports future enhancements:
- **3D Views**: Add WebGL/Three.js viewer component
- **AR Preview**: Integrate AR.js or 8th Wall
- **Admin Uploads**: Add `/app/admin` routes with file upload
- **Database**: Replace static data with Prisma + PostgreSQL

## Key Files

| File | Description |
|------|-------------|
| `src/app/page.tsx` | Homepage with hero, featured products, product grid |
| `src/app/products/[id]/page.tsx` | Product detail with gallery and specs |
| `src/components/ImageGallery.tsx` | AI view carousel with zoom and transitions |
| `src/lib/ai.ts` | Gemini integration and prompt generation |
| `src/lib/products.ts` | Product catalog and query functions |

## API Endpoints

### POST `/api/generate-view`

Generate an AI view for a product.

**Request:**
```json
{
  "productId": "oslo-lounge-chair",
  "viewType": "angle-45"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://...",
  "metadata": {
    "model": "gemini-2.0-flash-exp",
    "generationTime": 1234,
    "promptUsed": "..."
  }
}
```

## License

MIT

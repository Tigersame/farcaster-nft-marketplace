# NFT Portal Layout & Navigation System

## 🎨 Portal Structure

### 1. **Main Marketplace** (`/`)
- **Hero Banner**: Collection selector with quick filters
- **NFT Grid**: 1-6 columns responsive grid (250x250px cards)
- **Collection Filtering**: Click buttons to filter by collection
- **Event Handler**: `router.push(\`/collection/\${address}\`)` on "View Full Collection Page"
- **Quick Stats**: Total items, volume, floor price

### 2. **Collections Grid** (`/collections`)
- **Verified Collections Page**: Shows all 8 Base chain collections
- **Collection Cards**: 
  - Collection avatar (first letter of symbol)
  - Name, description, verification badge
  - Category badge (Gaming, Art, PFP, etc.)
  - Floor price & total supply stats
  - Social links (website, Twitter)
  - Click to navigate to collection page
- **Event Handler**: Click card → `router.push(\`/collection/\${address}\`)`

### 3. **Individual Collection Pages** (`/collection/[address]`)
- **Dynamic Route**: Each collection gets dedicated page
- **Collection Hero Banner**:
  - Back button to marketplace
  - Large collection avatar
  - Name, verification, description
  - Category, website, Twitter, contract links
  - Stats: Total supply, floor price, items loaded
- **Full NFT Grid**: All NFTs from that collection with pagination
- **Load More**: Infinite scroll with Alchemy API pagination

## 🔄 Event-Driven Navigation Commands

### Navigation Events

```typescript
// 1. FROM MARKETPLACE → COLLECTION PAGE
// Event: Click "View Full Collection Page" button
onClick={() => router.push(`/collection/${selectedCollection}`)}

// 2. FROM COLLECTIONS GRID → COLLECTION PAGE
// Event: Click collection card
onClick={() => handleCollectionClick(collection.address)}
// Triggers: router.push(`/collection/${address}`)

// 3. FROM COLLECTION PAGE → MARKETPLACE
// Event: Click "Back to Collections" button
onClick={() => router.push('/')}

// 4. HEADER NAVIGATION
// Event: Click "Collections" in nav
<a href="/collections">Collections</a>

// 5. FROM MARKETPLACE → COLLECTIONS GRID
// Event: Click header "Collections" link
```

## 📱 Layout Components

### NFT Card (250x250px)
```tsx
<NFTCard
  tokenId="1"
  name="DX Terminal #001"
  image="https://..."
  ethPrice="0.0038"
  onBuy={() => {}}
/>
```

### Collection Selector (Marketplace)
- **All Collections** button → Shows mixed NFTs from all 8 collections
- **Individual Collection** buttons → Filters to that collection
- **View Full Collection Page** → Navigates to `/collection/[address]`

### Collection Card (Collections Grid)
- Avatar with first letter
- Name + verification badge
- Description (2-line clamp)
- Category badge
- Stats grid (floor price, supply)
- Social links row
- "View Collection" button

### Collection Page Hero
- Back button
- 128x128px avatar
- Large title + verification
- Full description
- Links row (website, Twitter, contract)
- Stats row (supply, floor, items, owners)

## 🎯 User Flows

### Flow 1: Browse All Collections
1. Land on `/` (marketplace)
2. Click "All Collections" button
3. See mixed NFTs from 8 collections
4. Click header "Collections" link
5. See grid of all collections
6. Click any collection card
7. Navigate to `/collection/[address]`

### Flow 2: Explore Specific Collection
1. Land on `/` (marketplace)
2. Click "DX Terminal" button
3. See preview (first 100 NFTs)
4. Click "View Full Collection Page"
5. Navigate to `/collection/0x41Dc69132ccE31FCbF6755c84538CA268520246f`
6. See full collection with pagination
7. Click "Load More" for next page

### Flow 3: Direct Collection Access
1. Visit `/collections` directly
2. Browse 8 collection cards
3. Click any card
4. Navigate to full collection page
5. Browse NFTs with infinite scroll

## 🛠️ Technical Implementation

### Route Structure
```
/                                    → Main marketplace
/collections                         → Collections grid
/collection/[address]                → Individual collection page
```

### Data Sources
- **Marketplace**: `useVerifiedNFTs(100)` for "All Collections"
- **Marketplace**: `useBaseNFTs(address)` for single collection preview
- **Collection Page**: `useBaseNFTs(address)` with full pagination
- **Collections Grid**: Static `BASE_NFT_CONTRACTS` array

### Event Handlers
```typescript
// In marketplace.tsx
const router = useRouter()

// Navigate to collection page
<button onClick={() => router.push(`/collection/${selectedCollection}`)}>
  View Full Collection Page
</button>

// In collections/page.tsx
const handleCollectionClick = (address: string) => {
  router.push(`/collection/${address}`)
}

// In collection/[address]/page.tsx
const params = useParams()
const address = params?.address as string
```

### State Management
- **selectedCollection**: 'all' | contract address
- **selectedCategory**: null | 'Gaming' | 'Art' | etc.
- **marketItems**: Transformed NFT array
- **loading**: Boolean for loading states

## 🎨 Design System

### Colors
- Background: `#0b0b0b`
- Cards: `gray-900` (#111827)
- Primary: `blue-600`
- Text: `white` / `gray-300`
- Borders: `gray-800`

### Animations
- Framer Motion for page transitions
- Stagger animations for grid items (0.02s delay per item)
- Hover effects: `scale(1.02)`, 0.2s transition

### Responsive Grid
```css
grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6
```

## 📊 Collection Data Structure

```typescript
interface NFTContract {
  address: string
  name: string
  symbol: string
  description: string
  category: 'Gaming' | 'Art' | 'PFP' | 'Utility' | 'Metaverse' | 'Music' | 'Sports'
  verified: boolean
  floorPrice?: string
  totalSupply?: number
  website?: string
  twitter?: string
}
```

## ✅ Completed Features

1. ✅ Collection-specific pages with dynamic routing
2. ✅ Collections grid overview page
3. ✅ Event-driven navigation (click handlers)
4. ✅ "View Full Collection Page" button in marketplace
5. ✅ Back navigation from collection pages
6. ✅ Hero banners with collection metadata
7. ✅ Social links (website, Twitter, contract)
8. ✅ Pagination on collection pages
9. ✅ Responsive layouts (mobile → desktop)
10. ✅ Header "Collections" navigation link

## 🚀 Next Steps

- [ ] Add category filtering on collections page
- [ ] Implement search functionality
- [ ] Add sorting options (price, recent, popular)
- [ ] Collection activity feed
- [ ] NFT detail modal on card click

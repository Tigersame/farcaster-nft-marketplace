// src/app/api/sidebar/previews/route.js
// API endpoint for sidebar hover preview data
// Returns preview metadata for sidebar navigation items

import { NextResponse } from 'next/server';

// Preview data mapping for sidebar navigation items
// Replace with dynamic fetch from your NFT metadata service
const PREVIEW_MAP = {
  all: {
    id: "all",
    title: "All NFTs",
    price: "Browse all collections",
    img: "/nfts/preview1.svg"
  },
  trending: {
    id: "trending",
    title: "Trending NFTs",
    price: "12 hot items",
    img: "/nfts/preview2.svg"
  },
  collections: {
    id: "collections",
    title: "Base NFT Collection",
    price: "Floor: 0.0025 ETH",
    img: "/nfts/preview3.svg"
  },
  mint: {
    id: "mint",
    title: "Mint New NFT",
    price: "Create your NFT",
    img: "/nfts/preview4.svg"
  },
  swap: {
    id: "swap",
    title: "Token Swap",
    price: "Best rate available",
    img: "/nfts/preview5.svg"
  },
  portfolio: {
    id: "portfolio",
    title: "Your Portfolio",
    price: "Total: 5.4 ETH",
    img: "/nfts/preview6.svg"
  },
  activity: {
    id: "activity",
    title: "Recent Activity",
    price: "5 new notifications",
    img: "/nfts/preview7.svg"
  },
  favorites: {
    id: "favorites",
    title: "Favorite NFTs",
    price: "3 saved items",
    img: "/nfts/preview1.svg"
  },
  search: {
    id: "search",
    title: "Search NFTs",
    price: "Find anything",
    img: "/nfts/preview2.svg"
  },
  featured: {
    id: "featured",
    title: "Featured Collections",
    price: "Curated picks",
    img: "/nfts/preview3.svg"
  },
  analytics: {
    id: "analytics",
    title: "Market Analytics",
    price: "Stats & insights",
    img: "/nfts/preview4.svg"
  },
  recent: {
    id: "recent",
    title: "Recent NFTs",
    price: "Latest additions",
    img: "/nfts/preview5.svg"
  },
  buy: {
    id: "buy",
    title: "Buy NFTs",
    price: "Make purchases",
    img: "/nfts/preview6.svg"
  },
  sell: {
    id: "sell",
    title: "Sell NFTs",
    price: "List your items",
    img: "/nfts/preview7.svg"
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If specific id requested, return that preview
    if (id) {
      const preview = PREVIEW_MAP[id];
      if (preview) {
        // Return as { id: data } format
        return NextResponse.json({ [id]: preview });
      }
      // Return empty object if not found
      return NextResponse.json({});
    }

    // If no id, return entire map (be careful with large datasets in production)
    return NextResponse.json(PREVIEW_MAP);

  } catch (error) {
    console.error('Error in sidebar preview API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preview data' },
      { status: 500 }
    );
  }
}

// Example: To integrate with real token metadata service
// 
// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get('id');
//   
//   if (id) {
//     try {
//       // Fetch from your indexer or NFT metadata URL
//       const response = await fetch(`https://your-api.example.com/token-preview?id=${id}`);
//       const tokenPreview = await response.json();
//       return NextResponse.json({ [id]: tokenPreview });
//     } catch (error) {
//       // Fallback to static data
//       return NextResponse.json({ [id]: PREVIEW_MAP[id] || {} });
//     }
//   }
//   
//   return NextResponse.json(PREVIEW_MAP);
// }

// API endpoint for recent NFTs with pagination
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  
  // Replace with your real data source
  const items = Array.from({length:8}).map((_,i)=>({
    id: `recent-${page}-${i}`, 
    tokenId: page*8+i+1, 
    name: `Recent NFT #${page*8+i+1}`, 
    image: `https://picsum.photos/seed/recent${page}-${i}/600/800`, 
    price: (0.001*(Math.random()*10)).toFixed(4)
  }));

  return NextResponse.json({ items, page, hasMore: page < 10 });
}

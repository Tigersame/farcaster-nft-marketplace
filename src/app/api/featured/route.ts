// API endpoint for featured NFTs
import { NextResponse } from 'next/server';

export async function GET() {
  // Replace with your real data source
  const featured = Array.from({length:6}).map((_,i)=>({
    id: "featured-"+i, 
    tokenId: i+1, 
    name: `Featured NFT #${i+1}`, 
    image: `https://picsum.photos/seed/feat${i}/800/1000`, 
    price: (0.001*(i+2)).toFixed(4)
  }));

  return NextResponse.json(featured);
}

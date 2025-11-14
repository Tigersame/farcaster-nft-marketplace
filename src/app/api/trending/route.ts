// API endpoint for trending collections
import { NextResponse } from 'next/server';

export async function GET() {
  // Replace with your real data source
  const trending = Array.from({length:8}).map((_,i)=>({
    id: "collection-"+i, 
    name: `Collection ${i+1}`, 
    image: `https://picsum.photos/seed/col${i}/300/300`, 
    floor: (0.01*(i+1)).toFixed(3), 
    volume: (Math.random()*100).toFixed(1)
  }));

  return NextResponse.json(trending);
}

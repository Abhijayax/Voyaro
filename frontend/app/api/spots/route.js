import { NextResponse } from 'next/server';
import shimlaData from '../../data/shimla.json';

export async function GET() {
  return NextResponse.json({
    spots: shimlaData.spots
  });
}

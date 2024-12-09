import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Package from '@/app/models/Package';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { annualRentalIncome, discountRate, ownerAddress } = body;
    
    // Calculate upfront price
    const upfrontPrice = annualRentalIncome / (1 + (discountRate / 100));
    
    const newPackage = await Package.create({
      annualRentalIncome,
      discountRate,
      upfrontPrice,
      ownerAddress,
    });
    
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const packages = await Package.find({ status: 'available' });
    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
} 
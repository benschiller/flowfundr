import connectDB from './db';
import Package from '../models/Package';

export async function getPackages() {
  try {
    await connectDB();
    const packages = await Package.find({ status: 'available' });
    return JSON.parse(JSON.stringify(packages)); // Serialize for Next.js
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
} 
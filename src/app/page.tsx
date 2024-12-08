import Image from "next/image";
import { getPackages } from '@/app/lib/packages';

export default async function Home() {
  const packages = await getPackages();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">FlowFundr</h1>
        <p className="text-xl mb-8">Turn Future Rental Income Into Instant Capital</p>
      </div>

      <div className="flex gap-6">
        <a 
          href="/owner"
          className="px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
        >
          Property Owner
        </a>
        <a 
          href="/investor"
          className="px-6 py-3 border border-foreground rounded-lg hover:bg-foreground hover:text-background transition-all"
        >
          Investor
        </a>
      </div>

      {/* Live Feed of Available Packages */}
      <div className="mt-16 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6">Available Packages</h2>
        <div className="space-y-4">
          {packages.map((pkg: any) => (
            <div key={pkg._id} className="border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Annual Income</p>
                  <p className="font-semibold">${pkg.annualRentalIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Discount Rate</p>
                  <p className="font-semibold">{pkg.discountRate}%</p>
                </div>
              </div>
            </div>
          ))}
          {packages.length === 0 && (
            <p className="text-center text-gray-500">No packages available</p>
          )}
        </div>
      </div>
    </div>
  );
}

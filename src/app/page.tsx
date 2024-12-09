import { getPackages } from '@/app/lib/packages';
import type { Package } from '@/app/types';

export default async function Home() {
  const packages = await getPackages();

  return (
    <div>
      <div className="text-center mb-4">
        <h1>FlowFundr</h1>
        <p>Turn future rental income into instant capital</p>
        <div>
          <a className="btn btn-primary me-2" href="/owner">List Your Property</a>
          <a className="btn btn-secondary" href="/investor">Browse Investments</a>
        </div>
      </div>

      {/* <div className="text-center mb-4">
        <h2>Available Investment Packages</h2>
        
        <div className="row">
          {packages.length > 0 ? (
            packages.map((pkg: Package) => (
              <div className="col-md-4 mb-3" key={pkg._id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Annual Rental Income</h5>
                    <p className="card-text">${pkg.annualRentalIncome.toLocaleString()}</p>
                    <h5 className="card-title">Discount Rate</h5>
                    <p className="card-text">{pkg.discountRate}%</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>
              <p>No investment packages available</p>
              <p>Check back soon or list your property</p>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}

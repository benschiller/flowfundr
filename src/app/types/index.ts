export interface Package {
  _id: string;
  annualRentalIncome: number;
  discountRate: number;
  upfrontPrice: number;
  status: 'available' | 'sold';
  requestId?: string;
  ownerAddress: string;
  createdAt: string;
  updatedAt: string;
} 
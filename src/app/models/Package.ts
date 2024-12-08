import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  annualRentalIncome: {
    type: Number,
    required: true
  },
  discountRate: {
    type: Number,
    required: true
  },
  upfrontPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available'
  },
  ownerAddress: {
    type: String,
    required: true
  },
  requestId: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Package || mongoose.model('Package', PackageSchema); 
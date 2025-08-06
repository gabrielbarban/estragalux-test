import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  apartmentOwnerId: mongoose.Types.ObjectId;
  amount: number;
  month: string; // Format: "YYYY-MM"
  description?: string;
  paymentDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    apartmentOwnerId: {
      type: Schema.Types.ObjectId,
      ref: 'ApartmentOwner',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/ // YYYY-MM format
    },
    description: {
      type: String,
      trim: true
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema); 
import mongoose, { Document, Schema } from 'mongoose';

export interface IApartmentOwner extends Document {
  name: string;
  email: string;
  apartmentNumber: string;
  buildingId?: mongoose.Types.ObjectId;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApartmentOwnerSchema = new Schema<IApartmentOwner>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    apartmentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: 'Building'
    },
    phoneNumber: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IApartmentOwner>('ApartmentOwner', ApartmentOwnerSchema); 
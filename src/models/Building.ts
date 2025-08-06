import mongoose, { Document, Schema } from 'mongoose';

export interface IBuilding extends Document {
  name: string;
  address: string;
  totalFloors: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BuildingSchema = new Schema<IBuilding>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    totalFloors: {
      type: Number,
      required: true,
      min: 1
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IBuilding>('Building', BuildingSchema); 
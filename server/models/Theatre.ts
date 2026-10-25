import mongoose, { Schema, Document } from 'mongoose';

export interface ISeatLayoutTier {
  name: 'Silver' | 'Gold' | 'Platinum';
  price: number;
  rows: string[];
}

export interface ISeatLayout {
  totalRows: number;
  seatsPerRow: number;
  tiers: ISeatLayoutTier[];
}

export interface ITheatre extends Document {
  name: string;
  location: string;
  address: string;
  city: string;
  screens: string[];
  totalSeats: number;
  seatLayout: ISeatLayout;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const TheatreSchema = new Schema<ITheatre>(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location / Mall name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: true,
      default: 'Metro City',
    },
    screens: {
      type: [String],
      default: ['Screen 1 - IMAX Laser', 'Screen 2 - Dolby Atmos'],
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 60,
    },
    seatLayout: {
      type: Schema.Types.Mixed,
      required: true,
      default: {
        totalRows: 6,
        seatsPerRow: 10,
        tiers: [
          { name: 'Silver', price: 12, rows: ['A', 'B'] },
          { name: 'Gold', price: 16, rows: ['C', 'D'] },
          { name: 'Platinum', price: 22, rows: ['E', 'F'] },
        ],
      },
    },
    amenities: {
      type: [String],
      default: ['Dolby Atmos', 'Recliner Luxury', 'Kiosk Ticketing', 'Gourmet Concessions'],
    },
  },
  {
    timestamps: true,
  }
);

export const TheatreModel = mongoose.models.Theatre || mongoose.model<ITheatre>('Theatre', TheatreSchema);

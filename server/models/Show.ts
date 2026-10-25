import mongoose, { Schema, Document } from 'mongoose';

export interface ISeatItem {
  seatNumber: string; // e.g. "A1", "C5"
  row: string;
  col: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  price: number;
  status: 'available' | 'booked' | 'blocked' | 'reserved';
  heldBy?: string;
  heldUntil?: Date;
}

export interface IShow extends Document {
  movieId: mongoose.Types.ObjectId | string;
  theatreId: mongoose.Types.ObjectId | string;
  showDate: string; // "YYYY-MM-DD" format
  startTime: string; // "14:30" or "02:30 PM"
  screenFormat: string; // "IMAX 3D", "Dolby Atmos", "Standard 2D"
  screenName: string; // "Screen 1"
  basePrice: number;
  tierPrices: {
    Silver: number;
    Gold: number;
    Platinum: number;
  };
  seatInventory: ISeatItem[];
  status: 'active' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export const ShowSchema = new Schema<IShow>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
      index: true,
    },
    theatreId: {
      type: Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
      index: true,
    },
    showDate: {
      type: String,
      required: [true, 'Show date (YYYY-MM-DD) is required'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Show start time is required'],
    },
    screenFormat: {
      type: String,
      default: 'IMAX 3D',
    },
    screenName: {
      type: String,
      default: 'Audi 1',
    },
    basePrice: {
      type: Number,
      default: 15,
    },
    tierPrices: {
      Silver: { type: Number, default: 12 },
      Gold: { type: Number, default: 16 },
      Platinum: { type: Number, default: 22 },
    },
    seatInventory: {
      type: [
        {
          seatNumber: { type: String, required: true },
          row: { type: String, required: true },
          col: { type: Number, required: true },
          tier: {
            type: String,
            enum: ['Silver', 'Gold', 'Platinum'],
            default: 'Gold',
          },
          price: { type: Number, required: true },
          status: {
            type: String,
            enum: ['available', 'booked', 'blocked', 'reserved'],
            default: 'available',
          },
          heldBy: { type: String },
          heldUntil: { type: Date },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee fast query on movie + date
ShowSchema.index({ movieId: 1, showDate: 1, theatreId: 1 });

export const ShowModel = mongoose.models.Show || mongoose.model<IShow>('Show', ShowSchema);

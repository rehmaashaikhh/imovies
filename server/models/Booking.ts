import mongoose, { Schema, Document } from 'mongoose';

export interface IBookedSeatDetail {
  seatNumber: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  price: number;
}

export interface IBooking extends Document {
  bookingReference: string;
  userId: mongoose.Types.ObjectId | string;
  showId: mongoose.Types.ObjectId | string;
  movieId: mongoose.Types.ObjectId | string;
  theatreId: mongoose.Types.ObjectId | string;
  selectedSeats: string[];
  seatsDetail: IBookedSeatDetail[];
  numberOfTickets: number;
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalAmount: number;
  bookingStatus: 'confirmed' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'refunded' | 'failed' | 'simulated';
  paymentMethod: string;
  bookedAt: Date;
  cancelledAt?: Date;
  qrCodeData: string;
  customerName?: string;
  customerEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    showId: {
      type: Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Show ID is required'],
      index: true,
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theatreId: {
      type: Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    selectedSeats: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, 'At least one seat must be selected'],
    },
    seatsDetail: {
      type: [
        {
          seatNumber: { type: String, required: true },
          tier: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
      required: true,
    },
    numberOfTickets: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      default: 2.5,
    },
    tax: {
      type: Number,
      default: 1.5,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'confirmed',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'refunded', 'failed', 'simulated'],
      default: 'paid',
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card (Simulated Gateway)',
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    cancelledAt: {
      type: Date,
    },
    qrCodeData: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

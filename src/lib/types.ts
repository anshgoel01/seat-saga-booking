
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  duration: string;
  genre: string[];
  releaseDate: string;
  director: string;
  cast: string[];
  description: string;
  showTimes: ShowTime[];
}

export interface ShowTime {
  id: string;
  movieId: string;
  date: string;
  time: string;
  theater: string;
  seatsBooked: number;
  totalSeats: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  status: 'available' | 'selected' | 'booked';
}

export interface SeatRow {
  row: string;
  seats: Seat[];
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  showTimeId: string;
  seats: string[]; // Seat IDs
  totalPrice: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingDate: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
  read: boolean;
}

export interface AdminSettings {
  seatLayout: {
    rows: number;
    seatsPerRow: number;
  };
  seatPricing: {
    standard: number;
    premium: number;
    vip: number;
  };
  notificationThresholds: {
    bookingPercentage: number[];
  };
}

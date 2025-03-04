
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  MapPin,
  Film,
  Ticket,
  Printer,
  Share2,
  Download,
  Home
} from 'lucide-react';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState<any>(null);
  
  useEffect(() => {
    const bookingId = location.state?.bookingId;
    
    if (!bookingId) {
      toast.error('Booking information not found');
      navigate('/');
      return;
    }
    
    // Get booking from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const foundBooking = savedBookings.find((b: any) => b.id === bookingId);
    
    if (!foundBooking) {
      toast.error('Booking not found');
      navigate('/');
      return;
    }
    
    setBooking(foundBooking);
  }, [location.state, navigate]);
  
  const formatSeatLabels = (seats: any[]) => {
    return seats.map(seat => `${seat.row}${seat.number}`).join(', ');
  };
  
  if (!booking) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <Ticket className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
        <p className="text-muted-foreground">Your tickets are ready</p>
      </div>
      
      <Card className="mb-6 border-2 border-green-500/20">
        <CardHeader className="pb-2">
          <CardTitle>
            <div className="flex justify-between items-start">
              <span>{booking.movieTitle}</span>
              <div className="text-sm font-normal text-muted-foreground">
                Booking ID: {booking.id}
              </div>
            </div>
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> 
              <span>{booking.showDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> 
              <span>{booking.showTime}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> 
              <span>{booking.theater}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="pt-4 border-t mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Seats</div>
                <div className="font-medium">{formatSeatLabels(booking.seats)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Paid</div>
                <div className="font-medium">${booking.totalPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mb-8">
        <div className="p-4 bg-black text-white rounded-lg max-w-xs">
          <div className="text-center mb-2">
            <div className="text-xs mb-1">Scan at the theater</div>
            <div className="font-bold">{booking.id}</div>
          </div>
          <div className="w-48 h-48 bg-white mx-auto flex items-center justify-center">
            {/* In a real app, this would be an actual QR code */}
            <div className="text-black text-xs text-center">
              <Film className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              QR Code for<br/>Booking ID: {booking.id}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Printer className="h-4 w-4" /> Print Tickets
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download Tickets
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={() => navigate('/')} className="flex items-center gap-2">
          <Home className="h-4 w-4" /> Return to Home
        </Button>
      </div>
      
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>Please arrive 15 minutes before showtime.</p>
        <p>For assistance, contact support@cinetix.com</p>
      </div>
    </div>
  );
};

export default Confirmation;

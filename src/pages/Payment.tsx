
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  ChevronLeft, 
  CreditCard, 
  Calendar as CalendarIcon, 
  Lock, 
  Check,
  Loader2 
} from 'lucide-react';
import { PaymentDetails } from '@/lib/types';

const Payment = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });
  
  const [errors, setErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });
  
  useEffect(() => {
    // Get booking data from local storage
    const storedBooking = localStorage.getItem('currentBooking');
    if (storedBooking) {
      setBookingData(JSON.parse(storedBooking));
    } else {
      toast.error('No booking information found');
      navigate('/movies');
    }
  }, [navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces after every 4 digits
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      setPaymentDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    // Format expiry date with slash after first 2 digits
    if (name === 'expiryDate') {
      const sanitized = value.replace(/[^\d]/g, '').substring(0, 4);
      if (sanitized.length > 2) {
        const formatted = `${sanitized.substring(0, 2)}/${sanitized.substring(2)}`;
        setPaymentDetails(prev => ({ ...prev, [name]: formatted }));
      } else {
        setPaymentDetails(prev => ({ ...prev, [name]: sanitized }));
      }
      return;
    }
    
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    const newErrors = {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
    };
    
    let isValid = true;
    
    // Validate card number (16 digits)
    const cardNumberDigits = paymentDetails.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumberDigits)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      isValid = false;
    }
    
    // Validate expiry date (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      isValid = false;
    } else {
      const [month, year] = paymentDetails.expiryDate.split('/').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (
        month < 1 || 
        month > 12 || 
        year < currentYear || 
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.expiryDate = 'Card has expired';
        isValid = false;
      }
    }
    
    // Validate CVV (3 or 4 digits)
    if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
      isValid = false;
    }
    
    // Validate name on card
    if (paymentDetails.nameOnCard.trim().length < 3) {
      newErrors.nameOnCard = 'Please enter the name as it appears on your card';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      
      // Save booking to localStorage
      const bookingId = `BK${Date.now().toString().slice(-6)}`;
      const bookingDate = new Date().toISOString();
      
      const completedBooking = {
        id: bookingId,
        userId: 'u1', // In real app, would be actual user ID
        movieId: bookingData.movieId,
        showTimeId: bookingData.showTimeId,
        seats: bookingData.seats.map((s: any) => s.id),
        totalPrice: bookingData.totalPrice + 1.5, // Including booking fee
        paymentStatus: 'completed',
        bookingDate,
        ...bookingData
      };
      
      // Get existing bookings or create empty array
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      existingBookings.push(completedBooking);
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));
      
      // Remove current booking data
      localStorage.removeItem('currentBooking');
      
      setPaymentSuccess(true);
      
      // Redirect to confirmation after 2 seconds
      setTimeout(() => {
        navigate('/confirmation', { state: { bookingId } });
      }, 2000);
    }, 2000);
  };
  
  if (!bookingData) {
    return <div className="flex justify-center items-center h-screen">Loading booking data...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-md">
      {paymentSuccess ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="rounded-full bg-green-100 p-6 mb-4">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">Your booking has been confirmed.</p>
          <div className="animate-pulse">
            <p className="text-sm">Redirecting to your confirmation...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            
            <h1 className="text-2xl font-bold">Payment</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Secure payment for your booking
            </p>
          </div>
          
          <div className="space-y-6">
            <Card className="border-2 border-primary">
              <CardHeader className="pb-4">
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {bookingData.movieTitle} - {bookingData.showDate} at {bookingData.showTime}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Seats ({bookingData.seats.length})</span>
                    <span>${bookingData.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Booking Fee</span>
                    <span>$1.50</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>${(bookingData.totalPrice + 1.5).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter your card information securely</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      name="nameOnCard"
                      placeholder="John Smith"
                      value={paymentDetails.nameOnCard}
                      onChange={handleInputChange}
                      className={errors.nameOnCard ? 'border-red-500' : ''}
                    />
                    {errors.nameOnCard && (
                      <p className="text-xs text-red-500">{errors.nameOnCard}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
                        maxLength={19} // 16 digits + 3 spaces
                      />
                    </div>
                    {errors.cardNumber && (
                      <p className="text-xs text-red-500">{errors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={paymentDetails.expiryDate}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.expiryDate ? 'border-red-500' : ''}`}
                          maxLength={5} // MM/YY
                        />
                      </div>
                      {errors.expiryDate && (
                        <p className="text-xs text-red-500">{errors.expiryDate}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={paymentDetails.cvv}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.cvv ? 'border-red-500' : ''}`}
                          maxLength={4}
                        />
                      </div>
                      {errors.cvv && (
                        <p className="text-xs text-red-500">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Pay ${(bookingData.totalPrice + 1.5).toFixed(2)}</>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2 flex items-center justify-center">
                      <Lock className="h-3 w-3 mr-1" /> Secure payment powered by Stripe
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Payment;

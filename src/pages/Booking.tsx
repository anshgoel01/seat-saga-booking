
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { ChevronLeft, ChevronRight, Clock, Calendar, Film, MapPin } from 'lucide-react';
import { Movie, ShowTime, Seat, SeatRow, User } from '@/lib/types';
import { movies, generateSeats } from '@/lib/data';

const BookingSteps = {
  SELECT_SHOWTIME: 0,
  SELECT_SEATS: 1,
  CHECKOUT: 2,
};

const Booking = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [currentStep, setCurrentStep] = useState(BookingSteps.SELECT_SHOWTIME);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowTime | null>(null);
  const [seats, setSeats] = useState<SeatRow[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  
  // Get settings from local storage if available
  const storedSettings = localStorage.getItem('adminSettings');
  const adminSettings = storedSettings 
    ? JSON.parse(storedSettings) 
    : {
        seatLayout: { rows: 10, seatsPerRow: 10 },
        seatPricing: { standard: 10, premium: 15, vip: 20 },
        notificationThresholds: { bookingPercentage: [50, 75, 90] },
      };
      
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      toast.error('Please login to book tickets');
      navigate('/login', { state: { redirectTo: `/movies/${movieId}` } });
    }
    
    // Find movie
    if (movieId) {
      const foundMovie = movies.find(m => m.id === movieId);
      if (foundMovie) {
        setMovie(foundMovie);
      } else {
        toast.error('Movie not found');
        navigate('/movies');
      }
    }
  }, [movieId, navigate]);
  
  useEffect(() => {
    // Generate seats when showtime is selected
    if (selectedShowtime) {
      // Generate seats using the admin settings
      const generatedSeats = generateSeats(
        adminSettings.seatLayout.rows, 
        adminSettings.seatLayout.seatsPerRow
      );
      
      // Update seat prices based on admin settings
      const updatedSeats = generatedSeats.map(row => ({
        ...row,
        seats: row.seats.map(seat => {
          let price = adminSettings.seatPricing.standard;
          if (seat.type === 'premium') {
            price = adminSettings.seatPricing.premium;
          } else if (seat.type === 'vip') {
            price = adminSettings.seatPricing.vip;
          }
          return { ...seat, price };
        })
      }));
      
      setSeats(updatedSeats);
    }
  }, [selectedShowtime, adminSettings]);
  
  const handleShowtimeSelect = (showtime: ShowTime) => {
    setSelectedShowtime(showtime);
    setCurrentStep(BookingSteps.SELECT_SEATS);
  };
  
  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats(prev => [...prev, { ...seat, status: 'selected' }]);
    }
  };
  
  const handleContinueToCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    
    setCurrentStep(BookingSteps.CHECKOUT);
  };
  
  const handleProceedToPayment = () => {
    // Save booking data to local storage for payment page
    const booking = {
      movieId: movie?.id,
      movieTitle: movie?.title,
      showTimeId: selectedShowtime?.id,
      showDate: selectedShowtime?.date,
      showTime: selectedShowtime?.time,
      theater: selectedShowtime?.theater,
      seats: selectedSeats,
      totalPrice: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
    };
    
    localStorage.setItem('currentBooking', JSON.stringify(booking));
    navigate('/payment');
  };
  
  const calculateTotal = () => {
    return selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  };
  
  if (!movie) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/movies/${movieId}`)}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Movie
        </Button>
        
        <h1 className="text-2xl font-bold">{movie.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-1">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{movie.duration}</span>
          </div>
          <div>{movie.genre.join(', ')}</div>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= BookingSteps.SELECT_SHOWTIME ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              1
            </div>
            <div className="text-xs font-medium ml-2">Select Showtime</div>
          </div>
          <div className={`h-1 w-16 mx-2 ${currentStep > BookingSteps.SELECT_SHOWTIME ? 'bg-primary' : 'bg-secondary'}`}></div>
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= BookingSteps.SELECT_SEATS ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              2
            </div>
            <div className="text-xs font-medium ml-2">Select Seats</div>
          </div>
          <div className={`h-1 w-16 mx-2 ${currentStep > BookingSteps.SELECT_SEATS ? 'bg-primary' : 'bg-secondary'}`}></div>
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= BookingSteps.CHECKOUT ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              3
            </div>
            <div className="text-xs font-medium ml-2">Checkout</div>
          </div>
        </div>
        
        {/* Step content */}
        {currentStep === BookingSteps.SELECT_SHOWTIME && (
          <Card>
            <CardHeader>
              <CardTitle>Select a Showtime</CardTitle>
              <CardDescription>Choose your preferred date and time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {movie.showTimes.map((showtime) => {
                  const availableSeats = showtime.totalSeats - showtime.seatsBooked;
                  const isAvailable = availableSeats > 0;
                  const availabilityPercentage = (availableSeats / showtime.totalSeats) * 100;
                  
                  return (
                    <div 
                      key={showtime.id}
                      className={`border rounded-lg p-4 transition-all ${isAvailable ? 'hover:border-primary cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                      onClick={() => isAvailable && handleShowtimeSelect(showtime)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" /> 
                            <span className="font-medium">{showtime.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" /> 
                            <span className="text-xl font-semibold">{showtime.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" /> 
                            <span>{showtime.theater}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium mb-1">
                            {isAvailable 
                              ? `${availableSeats} seats available` 
                              : 'Sold out'}
                          </div>
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${availabilityPercentage > 70 ? 'bg-green-500' : availabilityPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${100 - (availableSeats / showtime.totalSeats) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        
        {currentStep === BookingSteps.SELECT_SEATS && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Seats</CardTitle>
                <CardDescription>
                  {selectedShowtime && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" /> 
                        <span>{selectedShowtime.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" /> 
                        <span>{selectedShowtime.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" /> 
                        <span>{selectedShowtime.theater}</span>
                      </div>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-8">
                  <div className="w-full max-w-2xl bg-gray-800 h-4 rounded-t-lg mb-10" />
                </div>
                
                <div className="grid gap-2 mb-6">
                  {seats.map((row) => (
                    <div key={row.row} className="flex items-center">
                      <div className="w-6 text-center text-sm font-medium">{row.row}</div>
                      <div className="flex-1 grid grid-cols-10 gap-1">
                        {row.seats.map((seat) => {
                          const isSelected = selectedSeats.some(s => s.id === seat.id);
                          
                          let seatClass = 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
                          if (seat.status === 'booked') {
                            seatClass = 'bg-gray-300 text-gray-400 cursor-not-allowed';
                          } else if (isSelected) {
                            seatClass = 'bg-primary text-primary-foreground hover:bg-primary/90';
                          } else if (seat.type === 'premium') {
                            seatClass = 'bg-blue-100 text-blue-700 hover:bg-blue-200';
                          } else if (seat.type === 'vip') {
                            seatClass = 'bg-purple-100 text-purple-700 hover:bg-purple-200';
                          }
                          
                          return (
                            <button
                              key={seat.id}
                              className={`h-7 text-xs font-medium rounded flex items-center justify-center ${seatClass}`}
                              onClick={() => handleSeatSelect(seat)}
                              disabled={seat.status === 'booked'}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>
                      <div className="w-6 text-center text-sm font-medium">{row.row}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mb-4 space-x-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-secondary rounded mr-2"></div>
                    <span className="text-sm">Standard (${adminSettings.seatPricing.standard})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
                    <span className="text-sm">Premium (${adminSettings.seatPricing.premium})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-100 rounded mr-2"></div>
                    <span className="text-sm">VIP (${adminSettings.seatPricing.vip})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                    <span className="text-sm">Booked</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(BookingSteps.SELECT_SHOWTIME)}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-2">
                    {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
                  </div>
                  <Button onClick={handleContinueToCheckout} disabled={selectedSeats.length === 0}>
                    Continue <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {currentStep === BookingSteps.CHECKOUT && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Booking</CardTitle>
              <CardDescription>Confirm your selection before proceeding to payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-20 w-14 rounded overflow-hidden flex-shrink-0">
                    <img src={movie.imageUrl} alt={movie.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{movie.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> 
                        <span>{selectedShowtime?.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> 
                        <span>{selectedShowtime?.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" /> 
                        <span>{selectedShowtime?.theater}</span>
                      </div>
                      <div className="flex items-center">
                        <Film className="h-4 w-4 mr-1" /> 
                        <span>{movie.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Selected Seats</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="border rounded-md p-2 text-sm">
                        <div className="font-medium">{seat.row}{seat.number}</div>
                        <div className="text-xs text-muted-foreground">{seat.type} - ${seat.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-1">
                    <span>Seat{selectedSeats.length !== 1 ? 's' : ''} ({selectedSeats.length})</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Booking Fee</span>
                    <span>$1.50</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>${(calculateTotal() + 1.5).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(BookingSteps.SELECT_SEATS)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={handleProceedToPayment}>
                Proceed to Payment <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Booking;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User } from '@/lib/types';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  LogOut, 
  User as UserIcon, 
  Ticket, 
  Settings,
  ChevronRight
} from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
      // Get user bookings
      const storedBookings = localStorage.getItem('userBookings');
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } else {
      toast.error('Please login to view your account');
      navigate('/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}
        </p>
      </div>
      
      <Tabs defaultValue="bookings">
        <TabsList className="mb-6">
          <TabsTrigger value="bookings"><Ticket className="h-4 w-4 mr-2" /> My Bookings</TabsTrigger>
          <TabsTrigger value="profile"><UserIcon className="h-4 w-4 mr-2" /> Profile</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" /> Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View your current and past bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-4">Looks like you haven't booked any tickets yet.</p>
                    <Button onClick={() => navigate('/movies')}>
                      Browse Movies
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/3 bg-muted p-4">
                            <div className="mb-4 font-medium">{booking.movieTitle}</div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{booking.showDate}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{booking.showTime}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{booking.theater}</span>
                              </div>
                            </div>
                          </div>
                          <div className="sm:w-2/3 p-4">
                            <div className="flex justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Booking ID</div>
                                <div className="font-medium">{booking.id}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground mb-1">Booked on</div>
                                <div className="font-medium">{formatDate(booking.bookingDate)}</div>
                              </div>
                            </div>
                            
                            <div className="my-4 border-t pt-4">
                              <div className="flex justify-between mb-2">
                                <div>
                                  <div className="text-sm text-muted-foreground">Seats</div>
                                  <div>
                                    {booking.seats.map((s: any) => `${s.row}${s.number}`).join(', ')}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Total Paid</div>
                                  <div className="font-medium">${booking.totalPrice.toFixed(2)}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <Button variant="ghost" size="sm" className="text-primary">
                                View Details <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-lg">{user.name}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                    {user.isAdmin && (
                      <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded mt-1 inline-block">
                        Admin
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid gap-4 pt-4">
                  <Button variant="outline" onClick={() => navigate('/admin')} disabled={!user.isAdmin}>
                    {user.isAdmin ? 'Go to Admin Dashboard' : 'Admin Access Required'}
                  </Button>
                  
                  <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto opacity-30 mb-3" />
                <h3 className="text-lg font-medium mb-2">Settings Coming Soon</h3>
                <p>This feature is currently under development.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;

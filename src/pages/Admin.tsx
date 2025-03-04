
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Movie, ShowTime, Notification, AdminSettings } from '@/lib/types';
import { movies, notifications } from '@/lib/data';
import { 
  Settings, 
  Users, 
  Film, 
  Calendar, 
  Bell, 
  Edit, 
  Trash, 
  Plus,
  Save,
  AlertTriangle,
  Info,
  Check,
  X
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    seatLayout: {
      rows: 10,
      seatsPerRow: 10,
    },
    seatPricing: {
      standard: 10,
      premium: 15,
      vip: 20,
    },
    notificationThresholds: {
      bookingPercentage: [50, 75, 90],
    },
  });
  const [notificationsList, setNotificationsList] = useState<Notification[]>(notifications);
  
  useEffect(() => {
    // Check if user is admin
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      
      if (!parsedUser.isAdmin) {
        toast.error('Unauthorized access');
        navigate('/');
      }
    } else {
      toast.error('Please login first');
      navigate('/login');
    }
  }, [navigate]);
  
  // Theater settings handlers
  const handleSeatLayoutChange = (key: keyof typeof adminSettings.seatLayout, value: number) => {
    setAdminSettings(prev => ({
      ...prev,
      seatLayout: {
        ...prev.seatLayout,
        [key]: value
      }
    }));
  };
  
  const handlePricingChange = (tier: keyof typeof adminSettings.seatPricing, value: number) => {
    setAdminSettings(prev => ({
      ...prev,
      seatPricing: {
        ...prev.seatPricing,
        [tier]: value
      }
    }));
  };
  
  const handleNotificationThresholdChange = (index: number, value: number) => {
    const newThresholds = [...adminSettings.notificationThresholds.bookingPercentage];
    newThresholds[index] = value;
    newThresholds.sort((a, b) => a - b); // Keep thresholds sorted
    
    setAdminSettings(prev => ({
      ...prev,
      notificationThresholds: {
        bookingPercentage: newThresholds
      }
    }));
  };
  
  const saveSettings = () => {
    // In a real app, this would save to a database
    localStorage.setItem('adminSettings', JSON.stringify(adminSettings));
    toast.success('Settings saved successfully');
  };
  
  const markNotificationAsRead = (notificationId: string) => {
    setNotificationsList(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const deleteNotification = (notificationId: string) => {
    setNotificationsList(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  if (!user || !user.isAdmin) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Site
        </Button>
      </div>
      
      <Tabs defaultValue="theater">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-6">
          <TabsTrigger value="theater"><Settings className="h-4 w-4 mr-2" /> Theater Settings</TabsTrigger>
          <TabsTrigger value="movies"><Film className="h-4 w-4 mr-2" /> Movies</TabsTrigger>
          <TabsTrigger value="showtimes"><Calendar className="h-4 w-4 mr-2" /> Showtimes</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" /> Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theater">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Seat Layout</CardTitle>
                <CardDescription>Configure theater seating arrangement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rows">Number of Rows: {adminSettings.seatLayout.rows}</Label>
                    <span className="text-sm text-muted-foreground">(A-{String.fromCharCode(64 + adminSettings.seatLayout.rows)})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>5</span>
                    <Slider 
                      id="rows"
                      min={5} 
                      max={20} 
                      step={1} 
                      value={[adminSettings.seatLayout.rows]}
                      onValueChange={(value) => handleSeatLayoutChange('rows', value[0])} 
                    />
                    <span>20</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="seatsPerRow">Seats Per Row: {adminSettings.seatLayout.seatsPerRow}</Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>5</span>
                    <Slider 
                      id="seatsPerRow"
                      min={5} 
                      max={20} 
                      step={1} 
                      value={[adminSettings.seatLayout.seatsPerRow]}
                      onValueChange={(value) => handleSeatLayoutChange('seatsPerRow', value[0])} 
                    />
                    <span>20</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set ticket prices for different seat types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="standard">Standard: ${adminSettings.seatPricing.standard}</Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>$5</span>
                    <Slider 
                      id="standard"
                      min={5} 
                      max={30} 
                      step={1} 
                      value={[adminSettings.seatPricing.standard]}
                      onValueChange={(value) => handlePricingChange('standard', value[0])} 
                    />
                    <span>$30</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="premium">Premium: ${adminSettings.seatPricing.premium}</Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>$10</span>
                    <Slider 
                      id="premium"
                      min={10} 
                      max={40} 
                      step={1} 
                      value={[adminSettings.seatPricing.premium]}
                      onValueChange={(value) => handlePricingChange('premium', value[0])} 
                    />
                    <span>$40</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="vip">VIP: ${adminSettings.seatPricing.vip}</Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>$15</span>
                    <Slider 
                      id="vip"
                      min={15} 
                      max={50} 
                      step={1} 
                      value={[adminSettings.seatPricing.vip]}
                      onValueChange={(value) => handlePricingChange('vip', value[0])} 
                    />
                    <span>$50</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure booking threshold alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Booking Capacity Thresholds</Label>
                    <p className="text-sm text-muted-foreground">Get notified when booking reaches these percentages</p>
                  </div>
                  
                  {adminSettings.notificationThresholds.bookingPercentage.map((threshold, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <Label>Threshold {index + 1}: {threshold}%</Label>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>25%</span>
                          <Slider 
                            min={25} 
                            max={95} 
                            step={5} 
                            value={[threshold]}
                            onValueChange={(value) => handleNotificationThresholdChange(index, value[0])} 
                          />
                          <span>95%</span>
                        </div>
                      </div>
                      {index > 0 && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            setAdminSettings(prev => ({
                              ...prev,
                              notificationThresholds: {
                                bookingPercentage: prev.notificationThresholds.bookingPercentage.filter((_, i) => i !== index)
                              }
                            }));
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {adminSettings.notificationThresholds.bookingPercentage.length < 4 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setAdminSettings(prev => ({
                          ...prev,
                          notificationThresholds: {
                            bookingPercentage: [...prev.notificationThresholds.bookingPercentage, 75]
                          }
                        }));
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Threshold
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} className="ml-auto">
                  <Save className="h-4 w-4 mr-2" /> Save All Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="movies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Movie Management</CardTitle>
                <CardDescription>Add, edit, or remove movies</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Movie
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Movie</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.map((movie) => (
                    <TableRow key={movie.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-8 rounded overflow-hidden">
                            <img src={movie.imageUrl} alt={movie.title} className="h-full w-full object-cover" />
                          </div>
                          <span>{movie.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{movie.genre.join(', ')}</TableCell>
                      <TableCell>{movie.duration}</TableCell>
                      <TableCell>{movie.releaseDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="showtimes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Showtime Management</CardTitle>
                <CardDescription>Manage movie showtimes and theaters</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Showtime
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Movie</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Theater</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.flatMap(movie => 
                    movie.showTimes.map(showtime => (
                      <TableRow key={showtime.id}>
                        <TableCell className="font-medium">{movie.title}</TableCell>
                        <TableCell>{showtime.date}</TableCell>
                        <TableCell>{showtime.time}</TableCell>
                        <TableCell>{showtime.theater}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${(showtime.seatsBooked / showtime.totalSeats) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{showtime.seatsBooked}/{showtime.totalSeats}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>System alerts and messages</CardDescription>
            </CardHeader>
            <CardContent>
              {notificationsList.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No notifications to display
                </div>
              ) : (
                <div className="space-y-4">
                  {notificationsList.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border ${notification.read ? 'bg-background' : 'bg-secondary/20'}`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-medium'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => markNotificationAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

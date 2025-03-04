
import { useState, useEffect } from 'react';
import { SeatRow, Seat } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface SeatMapProps {
  seats: SeatRow[];
  onSeatSelect: (selectedSeats: Seat[]) => void;
  maxSelections?: number;
}

const SeatMap = ({ seats, onSeatSelect, maxSelections = 10 }: SeatMapProps) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  
  useEffect(() => {
    onSeatSelect(selectedSeats);
  }, [selectedSeats, onSeatSelect]);
  
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    setSelectedSeats(prev => {
      // Check if seat is already selected
      const isSelected = prev.some(s => s.id === seat.id);
      
      if (isSelected) {
        // Remove seat if already selected
        return prev.filter(s => s.id !== seat.id);
      } else {
        // Add seat if not at max selections
        if (prev.length >= maxSelections) {
          toast({
            title: "Maximum seats reached",
            description: `You can only select up to ${maxSelections} seats.`,
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, seat];
      }
    });
  };
  
  const getSeatStatus = (seat: Seat) => {
    if (seat.status === 'booked') return 'booked';
    if (selectedSeats.some(s => s.id === seat.id)) return 'selected';
    return 'available';
  };
  
  const getSeatTypeLabel = (type: 'standard' | 'premium' | 'vip') => {
    switch(type) {
      case 'standard': return 'Standard';
      case 'premium': return 'Premium';
      case 'vip': return 'VIP';
      default: return '';
    }
  };
  
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full mb-10 text-center">
        <div className="w-3/4 h-8 mx-auto bg-gray-800 rounded-t-3xl mb-10 text-white text-sm flex items-center justify-center">
          Screen
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 w-full max-w-3xl">
        {seats.map((row) => (
          <div key={row.row} className="flex items-center justify-center space-x-2">
            <div className="w-6 text-center font-medium text-sm">
              {row.row}
            </div>
            <div className="flex-1 flex flex-wrap justify-center gap-2">
              {row.seats.map((seat) => {
                const status = getSeatStatus(seat);
                return (
                  <button
                    key={seat.id}
                    disabled={seat.status === 'booked'}
                    onClick={() => handleSeatClick(seat)}
                    onMouseEnter={() => setHoveredSeat(seat.id)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    className={cn(
                      "relative w-8 h-8 rounded transition-all duration-300 transform text-xs font-medium",
                      status === 'available' && 
                        (seat.type === 'standard' && "bg-secondary hover:bg-primary/20 text-foreground") ||
                        (seat.type === 'premium' && "bg-blue-100 hover:bg-blue-200 text-blue-800") ||
                        (seat.type === 'vip' && "bg-amber-100 hover:bg-amber-200 text-amber-800"),
                      status === 'selected' && 
                        (seat.type === 'standard' && "bg-primary text-primary-foreground scale-105") ||
                        (seat.type === 'premium' && "bg-blue-600 text-white scale-105") ||
                        (seat.type === 'vip' && "bg-amber-600 text-white scale-105"),
                      status === 'booked' && "bg-gray-200 text-gray-400 cursor-not-allowed",
                      hoveredSeat === seat.id && "scale-110"
                    )}
                  >
                    {seat.number}
                    
                    {hoveredSeat === seat.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10">
                        {getSeatTypeLabel(seat.type)} - ${seat.price}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="w-6 text-center font-medium text-sm">
              {row.row}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 flex items-center justify-center space-x-8">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-secondary mr-2"></div>
          <span className="text-sm">Standard (${seats[0]?.seats.find(s => s.type === 'standard')?.price})</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-blue-100 mr-2"></div>
          <span className="text-sm">Premium (${seats[0]?.seats.find(s => s.type === 'premium')?.price})</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-amber-100 mr-2"></div>
          <span className="text-sm">VIP (${seats[0]?.seats.find(s => s.type === 'vip')?.price})</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-gray-200 mr-2"></div>
          <span className="text-sm">Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-primary mr-2"></div>
          <span className="text-sm">Selected</span>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-center text-muted-foreground">
        <p>Select up to {maxSelections} seats. Click on a seat to select/deselect it.</p>
        <p className="mt-1">You've selected {selectedSeats.length} seat(s) for a total of $
          {selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
        </p>
      </div>
    </div>
  );
};

export default SeatMap;

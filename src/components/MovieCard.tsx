
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, CalendarDays } from 'lucide-react';
import { Movie } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard = ({ movie, className }: MovieCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleBookNow = () => {
    navigate(`/movies/${movie.id}`);
  };
  
  return (
    <div 
      className={cn(
        "glass-card overflow-hidden rounded-lg group transition-all duration-500 cursor-pointer",
        className
      )}
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={movie.imageUrl}
          alt={movie.title}
          onLoad={handleImageLoad}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 filter group-hover:scale-105",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{movie.rating}/10</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>{movie.duration}</span>
          </div>
        </div>
        
        <div className="absolute top-2 right-2">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm flex items-center">
            <Star className="h-3 w-3 text-yellow-400 mr-1" />
            {movie.rating}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-base md:text-lg mb-1 tracking-tight line-clamp-1">{movie.title}</h3>
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <Clock className="h-3 w-3 mr-1" />
          <span>{movie.duration}</span>
          <span className="mx-2">•</span>
          <CalendarDays className="h-3 w-3 mr-1" />
          <span>{movie.releaseDate}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {movie.genre.slice(0, 3).map((genre) => (
            <span 
              key={genre} 
              className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
        <Button 
          className="w-full mt-2 transition-all duration-300 transform hover:translate-y-[-2px]"
          onClick={(e) => {
            e.stopPropagation();
            handleBookNow();
          }}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default MovieCard;

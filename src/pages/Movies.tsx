
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { movies } from '@/lib/data';
import { Movie } from '@/lib/types';

const Movies = () => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'date'>('rating');
  const [loading, setLoading] = useState(true);
  
  // Extract all unique genres
  const allGenres = [...new Set(movies.flatMap(movie => movie.genre))].sort();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
      setFilteredMovies(movies);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Filter and sort movies
    let result = [...movies];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query) ||
        movie.genre.some(g => g.toLowerCase().includes(query)) ||
        movie.cast.some(c => c.toLowerCase().includes(query))
      );
    }
    
    // Apply genre filter
    if (selectedGenre) {
      result = result.filter(movie => 
        movie.genre.some(g => g === selectedGenre)
      );
    }
    
    // Apply sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    }
    
    setFilteredMovies(result);
  }, [searchQuery, selectedGenre, sortBy]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic is handled in the useEffect
  };
  
  const handleGenreChange = (genre: string) => {
    setSelectedGenre(currentGenre => currentGenre === genre ? '' : genre);
  };
  
  const handleSortChange = (sort: 'rating' | 'title' | 'date') => {
    setSortBy(sort);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Movies</h1>
            <p className="text-muted-foreground">
              Find and book tickets for the latest movies in theaters
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="mb-8 bg-white border rounded-lg p-4 shadow-sm">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Search movies, directors, or actors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="relative">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => {
                        // Toggle filter dropdown
                      }}
                    >
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => {
                        // Toggle sort dropdown
                      }}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Sort</span>
                    </Button>
                  </div>
                  
                  <Button type="submit">Search</Button>
                </div>
              </div>
            </form>
            
            {/* Filters */}
            <div className="mt-4 pt-4 border-t">
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        selectedGenre === genre
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => handleGenreChange(genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Sort By</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      sortBy === 'rating'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSortChange('rating')}
                  >
                    Rating
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      sortBy === 'title'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSortChange('title')}
                  >
                    Title (A-Z)
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      sortBy === 'date'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSortChange('date')}
                  >
                    Release Date
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Movie Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-[2/3] bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="flex gap-1 mb-4">
                      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    </div>
                    <div className="h-9 bg-gray-200 rounded-md w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMovies.map((movie, index) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium mb-2">No movies found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedGenre('');
                setSortBy('rating');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;


import { Movie, Seat, SeatRow, Notification } from './types';

export const movies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 8.8,
    duration: "2h 28m",
    genre: ["Sci-Fi", "Action", "Thriller"],
    releaseDate: "2023-07-16",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    showTimes: [
      {
        id: "st1",
        movieId: "1",
        date: "2023-11-10",
        time: "18:30",
        theater: "Theater 1",
        seatsBooked: 35,
        totalSeats: 100
      },
      {
        id: "st2",
        movieId: "1",
        date: "2023-11-10",
        time: "21:00",
        theater: "Theater 2",
        seatsBooked: 22,
        totalSeats: 100
      },
      {
        id: "st3",
        movieId: "1",
        date: "2023-11-11",
        time: "14:00",
        theater: "Theater 1",
        seatsBooked: 48,
        totalSeats: 100
      }
    ]
  },
  {
    id: "2",
    title: "The Dark Knight",
    imageUrl: "https://images.unsplash.com/photo-1497124401559-3e75ec2ed794?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 9.0,
    duration: "2h 32m",
    genre: ["Action", "Crime", "Drama"],
    releaseDate: "2023-08-21",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    showTimes: [
      {
        id: "st4",
        movieId: "2",
        date: "2023-11-10",
        time: "19:00",
        theater: "Theater 3",
        seatsBooked: 60,
        totalSeats: 100
      },
      {
        id: "st5",
        movieId: "2",
        date: "2023-11-11",
        time: "16:30",
        theater: "Theater 2",
        seatsBooked: 32,
        totalSeats: 100
      }
    ]
  },
  {
    id: "3",
    title: "Interstellar",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 8.6,
    duration: "2h 49m",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    releaseDate: "2023-09-15",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    showTimes: [
      {
        id: "st6",
        movieId: "3",
        date: "2023-11-10",
        time: "20:00",
        theater: "Theater 1",
        seatsBooked: 42,
        totalSeats: 100
      },
      {
        id: "st7",
        movieId: "3",
        date: "2023-11-11",
        time: "15:30",
        theater: "Theater 3",
        seatsBooked: 28,
        totalSeats: 100
      }
    ]
  },
  {
    id: "4",
    title: "The Matrix",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 8.7,
    duration: "2h 16m",
    genre: ["Action", "Sci-Fi"],
    releaseDate: "2023-10-01",
    director: "Lana Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    showTimes: [
      {
        id: "st8",
        movieId: "4",
        date: "2023-11-10",
        time: "21:30",
        theater: "Theater 2",
        seatsBooked: 15,
        totalSeats: 100
      },
      {
        id: "st9",
        movieId: "4",
        date: "2023-11-11",
        time: "17:00",
        theater: "Theater 1",
        seatsBooked: 52,
        totalSeats: 100
      }
    ]
  },
  {
    id: "5",
    title: "Pulp Fiction",
    imageUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 8.9,
    duration: "2h 34m",
    genre: ["Crime", "Drama"],
    releaseDate: "2023-10-25",
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    showTimes: [
      {
        id: "st10",
        movieId: "5",
        date: "2023-11-10",
        time: "18:00",
        theater: "Theater 3",
        seatsBooked: 38,
        totalSeats: 100
      },
      {
        id: "st11",
        movieId: "5",
        date: "2023-11-11",
        time: "19:30",
        theater: "Theater 2",
        seatsBooked: 25,
        totalSeats: 100
      }
    ]
  },
  {
    id: "6",
    title: "The Shawshank Redemption",
    imageUrl: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 9.3,
    duration: "2h 22m",
    genre: ["Drama"],
    releaseDate: "2023-11-05",
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    showTimes: [
      {
        id: "st12",
        movieId: "6",
        date: "2023-11-10",
        time: "19:30",
        theater: "Theater 1",
        seatsBooked: 70,
        totalSeats: 100
      },
      {
        id: "st13",
        movieId: "6",
        date: "2023-11-11",
        time: "20:30",
        theater: "Theater 3",
        seatsBooked: 45,
        totalSeats: 100
      }
    ]
  }
];

export function generateSeats(totalRows: number = 10, seatsPerRow: number = 10): SeatRow[] {
  const rows: SeatRow[] = [];
  const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  for (let r = 0; r < totalRows; r++) {
    const row = rowLetters[r];
    const seats: Seat[] = [];
    
    for (let s = 1; s <= seatsPerRow; s++) {
      let type: 'standard' | 'premium' | 'vip' = 'standard';
      let price = 10;
      
      // Set seat types and prices based on row position
      if (r < 3) {
        type = 'standard';
        price = 10;
      } else if (r < 7) {
        type = 'premium';
        price = 15;
      } else {
        type = 'vip';
        price = 20;
      }
      
      // Randomly set some seats as booked (20% chance)
      const status = Math.random() < 0.2 ? 'booked' : 'available';
      
      seats.push({
        id: `${row}${s}`,
        row,
        number: s,
        type,
        price,
        status
      });
    }
    
    rows.push({ row, seats });
  }
  
  return rows;
}

export const notifications: Notification[] = [
  {
    id: "1",
    message: "Theater 1 has reached 50% booking capacity for 'Inception' at 18:30.",
    type: "info",
    createdAt: "2023-11-08T14:35:22Z",
    read: false
  },
  {
    id: "2",
    message: "Theater 3 has reached 50% booking capacity for 'The Dark Knight' at 19:00.",
    type: "info",
    createdAt: "2023-11-08T12:15:10Z",
    read: true
  },
  {
    id: "3",
    message: "Theater 1 has reached 70% booking capacity for 'The Shawshank Redemption' at 19:30.",
    type: "warning",
    createdAt: "2023-11-07T18:42:55Z",
    read: false
  }
];

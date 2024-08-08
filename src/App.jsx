import React, { useState } from 'react';
import MovieGenre from './components/MovieGenre/MovieGenre';
import MovieList from './components/MovieList/MovieList';

// Main container component for movies
const MovieContainer = () => {
  const [selectedGenres, setSelectedGenres] = useState([]); 

  const handleGenreChange = (genreId) => {
    if (genreId === 'all') {
      // If 'all' is selected, clear all selected genres
      setSelectedGenres([]); 
    } else {
      setSelectedGenres(prevGenres =>
        prevGenres.includes(genreId)
          ? prevGenres.filter(id => id !== genreId)
          : [...prevGenres, genreId]
      );
    }
  };

  return (
    <div>
      <MovieGenre selectedGenres={selectedGenres} onGenreChange={handleGenreChange} />
      <MovieList selectedGenres={selectedGenres} />
    </div>
  );
};

export default MovieContainer;

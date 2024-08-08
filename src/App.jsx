import React, { useState } from 'react';
import MovieGenre from './components/MovieGenre/MovieGenre';
import MovieList from './components/MovieList/MovieList';

const MovieContainer = () => {
  const [selectedGenres, setSelectedGenres] = useState([]); 

  const handleGenreChange = (genreId) => {
    if (genreId === 'all') {
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

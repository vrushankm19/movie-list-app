import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieGenre.scss';
import logo from '/logo.svg';

const MovieGenre = ({ selectedGenres, onGenreChange }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: '382ed57d2aff6607fcb9a6857dbdef40',
          },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres from TMDB:', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className='tmdb-head'>
      <div className='container tmdb-head-con'>
        <div className='tmdb-head-flex'>
          <img className='tmdb-head-flex-img' src={logo} alt="TMDB Logo" />
        </div>
        <div className='tmdb-head-btn'>
          <div className='tmdb-head-btn-flex'>
            <button
              className={`btn-primary ${selectedGenres.length === 0 ? 'active' : ''}`}
              onClick={() => onGenreChange('all')}
            >
              All
            </button>
            {genres.map(genre => (
              <button
                key={genre.id}
                className={`btn-primary ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                onClick={() => onGenreChange(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieGenre;

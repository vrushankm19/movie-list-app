import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieGenre.scss';
import logo from '/logo.svg';


// It accepts selectedGenres (an array of selected genre IDs) and onGenreChange (a function to handle genre selection) as props.
const MovieGenre = ({ selectedGenres, onGenreChange }) => {
  // Initializing the state 'genres' as an empty array to store the list of genres fetched from the API.
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Making a GET request to the TMDB API to retrieve the list of movie genres.
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
           {/* Button to select all genres. It is highlighted if no specific genres are selected. */}
            <button
              className={`btn-primary ${selectedGenres.length === 0 ? 'active' : ''}`}
              onClick={() => onGenreChange('all')}
            >
              All
            </button>
            {/* Mapping through the genres array to create a button for each genre. */}
            {genres.map(genre => (
              <button
                key={genre.id}
                className={`btn-primary ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                onClick={() => onGenreChange(genre.id)}
              >
                {genre.name} {/* Displaying the name of each genre on the button. */}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieGenre;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Loader from '../Futures/Loader';
import './MovieList.scss';

const MovieList = ({ selectedGenres }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalPages = 10;
  const yearRefs = useRef({});
  const hasScrolled = useRef(false);

  useEffect(() => {
    const fetchMovies = async () => {
      let allMovies = [];
      setLoading(true);

      try {
        for (let page = 1; page <= totalPages; page++) {
          const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
              api_key: '382ed57d2aff6607fcb9a6857dbdef40',
              sort_by: 'popularity.desc',
              include_adult: false,
              include_video: false,
              page: page,
              with_genres: selectedGenres.length > 0 ? selectedGenres.join(',') : undefined
            }
          });
          allMovies = allMovies.concat(response.data.results);
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        setMovies(allMovies);
      } catch (error) {
        console.error('Error fetching data from TMDB:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenres]);

  useEffect(() => {
    const scrollToYear = () => {
      const targetYear = 2012;
      console.log('Checking scroll conditions', { loading, hasScrolled: hasScrolled.current, yearRef: yearRefs.current[targetYear] });
      if (yearRefs.current[targetYear] && !hasScrolled.current) {
        yearRefs.current[targetYear].scrollIntoView({ behavior: 'smooth' });
        hasScrolled.current = true;
        console.log('Scrolled to 2012');
      }
    };

    if (!loading && movies.length > 0) {
      scrollToYear();
    }
  }, [loading, movies]);

  const groupMoviesByYear = (movies) => {
    return movies.reduce((acc, movie) => {
      const year = new Date(movie.release_date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      if (acc[year].length < 20) {
        acc[year].push(movie);
      }
      return acc;
    }, {});
  };

  const groupedMovies = groupMoviesByYear(movies);

  return (
    <div className='tmdb-body'>
      <div className='container tmdb-body-con'>
        <div className='tmdb-body-data'>
          {
            loading 
            ? <Loader />
            : (
              Object.keys(groupedMovies).sort((a, b) => a - b).map(year => (
                <div key={year} ref={el => yearRefs.current[year] = el}>
                  <h2 className='tmdb-body-title'>{year}</h2>
                  <div className='tmdb-body-flex'>
                    {groupedMovies[year].sort((a, b) => b.popularity - a.popularity).map(item => (
                      <div key={item.id} className='tmdb-body-flex-item'>
                        <img className='tmdb-body-flex-item-img' src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.original_title} />
                        <div className='tmdb-body-flex-item-copy'>
                          <h3 className='tmdb-body-flex-item-copy-h3'>{item.original_title}</h3>
                          <p className='tmdb-body-flex-item-copy-p'>{item.overview}</p>
                        </div>
                          <p className='tmdb-body-flex-item-copy-tag'>{item.vote_count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )
          }
        </div>
      </div>
    </div>
  );
};

export default MovieList;

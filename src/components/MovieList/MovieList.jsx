import React, { useEffect, useState, useRef, useCallback } from 'react';
// Importing axios for making HTTP requests.
import axios from 'axios';
// Importing InfiniteScroll for implementing infinite scrolling functionality.
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../Features/Loader';
import './MovieList.scss';

// It accepts selectedGenres (an array of selected genre IDs) as a prop.
const MovieList = ({ selectedGenres }) => {
  // Initializing the state to manage movies by year, current year, list of years, loading state, and infinite scroll control.
  const [movies, setMovies] = useState({});
  const [currentYear, setCurrentYear] = useState(2012);
  const [years, setYears] = useState([2012]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Fetches movies for a specific year based on selected genres.
  const fetchMoviesForYear = useCallback(async (year) => {
    setIsFetching(true); // Start loading
    try {
      // Making a GET request to the TMDB API to discover movies for a given year.
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: '382ed57d2aff6607fcb9a6857dbdef40', // TMDB API key for authentication.
          sort_by: 'popularity.desc', // Sort movies by popularity
          primary_release_year: year, 
          vote_count_gte: 100,
          page: 1,
          with_genres: selectedGenres.length > 0 ? selectedGenres.join(',') : undefined // Filter by selected genres if any are chosen  
        }
      });

      // Extract the first 20 movies from the response.
      const newMovies = response.data.results.slice(0, 20);
      setMovies((prevMovies) => ({
        ...prevMovies,
        [year]: newMovies
      }));
    } catch (error) {
      console.error('Error fetching data from TMDB:', error);
    } finally {
      setIsFetching(false); 
    }
  }, [selectedGenres]); // Dependencies are selectedGenres to refetch if they change.

  // useEffect hook to fetch movies for the current year when the component mounts or when currentYear changes.
  useEffect(() => {
    fetchMoviesForYear(currentYear);
  }, [fetchMoviesForYear, currentYear]);

  
  // Function to fetch more data as the user scrolls.
  const fetchMoreData = () => {
    const nextYear = currentYear + 1; // Next year to fetch
    const prevYear = currentYear - 1; // Previous year to fetch if no more future years

    // If there are more future years to fetch.
    if (nextYear <= new Date().getFullYear()) {
      setCurrentYear(nextYear);
      fetchMoviesForYear(nextYear);
      setYears((prevYears) => [...prevYears, nextYear]); // Add the year to the list of loaded years
    } 
    // If there are no more future years, try fetching previous years.
    else if (prevYear > 1900) {
      setCurrentYear(prevYear);
      fetchMoviesForYear(prevYear);
      setYears((prevYears) => [prevYear, ...prevYears]); // Add the year at the beginning of the list
    } 
    // If there are no more years to fetch, stop the infinite scroll.
    else {
      setHasMore(false);
    }
  };


  return (
    <div className='tmdb-body'>
      <div className='container tmdb-body-con'>
        {/* InfiniteScroll component for handling infinite scrolling */}
        <InfiniteScroll
          dataLength={years.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={isFetching ? <Loader /> : null} 
          scrollThreshold={0.9}
          style={{ overflow: 'hidden' }}
        >
          {/* Mapping through each year to render the movies of that year */}
          {years.map(year => (
            <div key={year}>
              <h2 className='tmdb-body-title'>{year}</h2>
              <div className='tmdb-body-flex'>
                {movies[year] && movies[year].sort((a, b) => b.popularity - a.popularity).map(item => (
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
          ))}
          {/* Show loader at the bottom if more data is being fetched */}
          {isFetching && <Loader />} 
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default MovieList;

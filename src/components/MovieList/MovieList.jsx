import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../Features/Loader';
import './MovieList.scss';

const MovieList = ({ selectedGenres }) => {
  const [movies, setMovies] = useState({});
  const [currentYear, setCurrentYear] = useState(2012);
  const [years, setYears] = useState([2012]);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoviesForYear = useCallback(async (year) => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: '382ed57d2aff6607fcb9a6857dbdef40',
          sort_by: 'popularity.desc',
          primary_release_year: year,
          vote_count_gte: 100,
          page: 1,
          with_genres: selectedGenres.length > 0 ? selectedGenres.join(',') : undefined
        }
      });

      const newMovies = response.data.results.slice(0, 20);
      setMovies((prevMovies) => ({
        ...prevMovies,
        [year]: newMovies
      }));
    } catch (error) {
      console.error('Error fetching data from TMDB:', error);
    }
  }, [selectedGenres]);

  useEffect(() => {
    fetchMoviesForYear(currentYear);
  }, [fetchMoviesForYear, currentYear]);

  const fetchMoreData = () => {
    const nextYear = currentYear + 1;
    const prevYear = currentYear - 1;
    if (nextYear <= new Date().getFullYear()) {
      setCurrentYear(nextYear);
      fetchMoviesForYear(nextYear);
      setYears((prevYears) => [...prevYears, nextYear]);
    } else if (prevYear > 1900) {
      setCurrentYear(prevYear);
      fetchMoviesForYear(prevYear);
      setYears((prevYears) => [prevYear, ...prevYears]);
    } else {
      setHasMore(false);
    }
  };

  return (
    <div className='tmdb-body'>
      <div className='container tmdb-body-con'>
        <InfiniteScroll
          dataLength={years.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Loader />}
          scrollThreshold={0.9} // Load more data when the scroll position is 90% from the top or bottom
          style={{ overflow: 'hidden' }} // To prevent default scroll behavior
        >
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
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default MovieList;

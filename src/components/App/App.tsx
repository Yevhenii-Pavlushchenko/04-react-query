import './App.module.css'

import fetchMovies from '../../services/movieService'
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import MovieModal from '../MovieModal/MovieModal'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'

import { toast, Toaster } from 'react-hot-toast'
import ReactPaginate from 'react-paginate';

import { useState } from 'react'
import type { Movie } from '../../types/movie'


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>(''); // зберігаємо запит
  const [page, setPage] = useState<number>(1);    // зберігаємо сторінку
  const [totalPages, setTotalPages] = useState<number>(0); // для приховування кнопки
  
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsErrror] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Функція завантаження (спільна для першого пошуку та пагінації)
  const loadMovies = async (searchQuery: string, searchPage: number) => {
    try {
      setIsLoading(true);
      setIsErrror(false);

      const data = await fetchMovies(searchQuery, searchPage); // Тепер повертає об'єкт {results, total_pages...}

      if (data.results.length === 0) {
        toast("No movies found.");
        setMovies([])
        return;
      }

      // Якщо це перша сторінка — замінюємо масив, якщо наступна — додаємо в кінець
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch {
      setIsErrror(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Викликається при сабміті форми
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1); // скидаємо на першу сторінку
    loadMovies(newQuery, 1);
  };

  // Функція для react-paginate
  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1; // Бібліотека рахує з 0, а API з 1
    setPage(newPage);
    loadMovies(query, newPage);
    window.scrollTo(0, 0); // Прокрутка вгору при зміні сторінки
  };

  return (
    <>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      
      
      
      {/* Компонент пагінації */}
      {movies.length > 0 && totalPages > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={totalPages > 500 ? 500 : totalPages} // TMDB обмежує пагінацію до 500 сторінок
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          forcePage={page - 1} // Синхронізація зі стейтом
          // Класи для стилізації (додайте їх у свій CSS)
          containerClassName="pagination"
          activeClassName="active"
        />
      )}
      
      {movies.length > 0 && <MovieGrid onSelect={setSelectedMovie} movies={movies} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && <MovieModal onClose={() => setSelectedMovie(null)} movie={selectedMovie}/>}
    </>
  );
}




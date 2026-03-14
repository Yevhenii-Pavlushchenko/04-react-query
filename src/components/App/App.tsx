import css from "./App.module.css";

import fetchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { toast, Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>(""); 
  const [page, setPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState<number>(0); 

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsErrror] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);


  const loadMovies = async (searchQuery: string, searchPage: number) => {
    if (!searchQuery) return;

    try {
      setIsLoading(true);
      setIsErrror(false);
      const data = await fetchMovies(searchQuery, searchPage);

      if (data.results.length === 0) {
        toast("No movies found.");
        setMovies([]);
        setTotalPages(0);
        return;
      }

      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch {
      setIsErrror(true);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    loadMovies(query, page);
  }, [query, page]);

  const handleSearch = (newQuery: string) => {
    if (newQuery === query) return;
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {/*  Пагинация*/}
      {movies.length > 0 && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => {
            setPage(selected + 1);

          }}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {/*  тут я  вывожу список фильмов если длина респонса больше 0*/}
      {movies.length > 0 && (
        <MovieGrid onSelect={setSelectedMovie} movies={movies} />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      
      {selectedMovie && (
        <MovieModal
          onClose={() => setSelectedMovie(null)}
          movie={selectedMovie}
        />
      )}
    </div>
  );
}
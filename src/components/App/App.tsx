import css from "./App.module.css";

import fetchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { toast, Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie";

export default function App() {
  const [query, setQuery] = useState<string>(""); 
  const [page, setPage] = useState<number>(1); 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const {
    data,
    isLoading,
    isError, } = useQuery({
      queryKey: ["movies", query, page],
      queryFn: () => fetchMovies(query, page),
      enabled: query.trim() !== "",
      placeholderData:keepPreviousData,
    })
  
  const movies = data?.results ?? []
  const totalPages = data?.total_pages ?? 0
 
  useEffect(() => {
    if (query && data && movies.length === 0 && !isLoading) {
      toast("No movie found.", {icon:"ℹ️"})
    }
  }, [data, movies.length, query, isLoading])


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
      {totalPages > 1 && (
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
          pageClassName={css.pageItem}
          
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
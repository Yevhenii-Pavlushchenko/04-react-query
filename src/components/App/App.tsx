import './App.module.css'

import fetchMovies from '../../services/movieService'
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import MovieModal from '../MovieModal/MovieModal'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'

import { toast, Toaster } from 'react-hot-toast'
import { useState } from 'react'
import type { Movie } from '../../types/movie'


export default function App() {

  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsErrror] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie)
  }

  const closeModal = () => {
    setSelectedMovie(null)
  }

  const handleSearch = async (query: string) => {
    
    try {
      setIsLoading(true)
      setIsErrror(false)
      setMovies([])

      const data = await fetchMovies(query)
      if (data.length === 0 ) {
        toast("No movies found for your request.")
        return
    }
      setMovies(data)
    } catch{
      setIsErrror(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {movies.length > 0 && <MovieGrid onSelect={openModal} movies={movies} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      { selectedMovie && ( 
        <MovieModal onClose={closeModal} movie={selectedMovie}/>
      )}
    </>
  )
}



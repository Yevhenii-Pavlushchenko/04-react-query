import axios, { type AxiosRequestConfig } from "axios";
import {type Movie} from '../types/movie'

const BASE_URL = "https://api.themoviedb.org/3/";
axios.defaults.baseURL = BASE_URL;

const endpoint = "search/movie";

const APIKEY = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesHttpResponse {
  results: Movie[];
}

export default async function fetchMovies(query: string): Promise<Movie[]> {
    const config: AxiosRequestConfig = {
         params: { query },
         headers: {
            Authorization: `Bearer ${APIKEY}`,
            },
        
    }

    const response = await axios.get<MoviesHttpResponse>(endpoint, config);
    return response.data.results
}


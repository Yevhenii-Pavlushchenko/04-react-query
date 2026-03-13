import axios, { type AxiosRequestConfig } from "axios";
import {type Movie} from '../types/movie'

const BASE_URL = "https://api.themoviedb.org/3/";
axios.defaults.baseURL = BASE_URL;

const endpoint = "search/movie";

const APIKEY = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

export default async function fetchMovies(query: string , page:number): Promise<MoviesHttpResponse> {
    const config: AxiosRequestConfig = {
         params: { query, page },
         headers: {
            Authorization: `Bearer ${APIKEY}`,
            },
        
    }

  const response = await axios.get<MoviesHttpResponse>(endpoint, config);
    return response.data
}


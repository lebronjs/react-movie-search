import React, { useState, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet';
import './index.css';
import Header from '../Header';
import Movie from '../Movie';
import Search from '../Search';

interface Movie {
    Title: string;
    Year: number;
    imdbID: number;
    Type: string;
    Poster: string;
}

const MOVIE_API_URL = 'https://www.omdbapi.com/?s=Detective Conan&apikey=4a3b711b'; // you should replace this with yours

const movieReducer = function (state, action) {
    switch (action.type) {
        case 'SEARCH_REQUEST':
            return {
                ...state,
                loading: true,
                errorMessage: null,
            };
        case 'SEARCH_SUCCESS':
            return {
                ...state,
                loading: false,
                movies: action.payload,
            };
        case 'SEARCH_ERROR':
            return {
                ...state,
                loading: false,
                errorMessage: action.error,
            };
        default:
            return state;
    }
};
const initialMovieState = {
    loading: true,
    movies: [],
    errorMessage: null,
};
function App() {
    // const [loading, setLoading] = useState(true);
    // const [movies, setMovies] = useState([]);
    // const [errorMessage, setErrorMessage] = useState(null);
    const [state, dispatch] = useReducer(movieReducer, initialMovieState);

    useEffect(() => {
        fetch(MOVIE_API_URL)
            .then((response) => response.json())
            .then((jsonResponse) => {
                dispatch({
                    type: 'SEARCH_SUCCESS',
                    payload: jsonResponse.Search,
                });
            });
    }, []);

    const search = (searchValue) => {
        dispatch({
            type: 'SEARCH_REQUEST',
        });
        fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`)
            .then((response) => response.json())
            .then((jsonResponse) => {
                if (jsonResponse.Response === 'True') {
                    setTimeout(() => {
                        dispatch({
                            type: 'SEARCH_SUCCESS',
                            payload: jsonResponse.Search,
                        });
                    }, 1500);
                } else {
                    dispatch({
                        type: 'SEARCH_ERROR',
                        error: jsonResponse.Error,
                    });
                }
            });
    };
    const { movies, errorMessage, loading } = state;
    return (
        <div className="App">
            <Helmet>
                <title>🎬电影搜索</title>
            </Helmet>
            <Header text="Lebronjs Movie Search" />
            <Search search={search} />
            <p className="App-intro">Grid layout is awsome !</p>
            <div className="movies">
                {loading && !errorMessage ? (
                    <div className="lds-grid">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                ) : errorMessage ? (
                    <div className="errorMessage">{errorMessage}</div>
                ) : (
                    movies.map((movie: Movie, index) => <Movie key={`${index}-${movie.Title}`} movie={movie} />)
                )}
            </div>
        </div>
    );
}

export default App;

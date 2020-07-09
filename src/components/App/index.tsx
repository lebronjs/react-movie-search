import React, { useState, useEffect } from 'react';
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

const MOVIE_API_URL =
    'https://www.omdbapi.com/?s=Detective Conan&apikey=4a3b711b'; // you should replace this with yours

function App() {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        fetch(MOVIE_API_URL)
            .then((response) => response.json())
            .then((jsonResponse) => {
                setMovies(jsonResponse.Search);
                setLoading(false);
            });
    }, []);

    const search = (searchValue) => {
        setLoading(true);
        setErrorMessage(null);

        fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`)
            .then((response) => response.json())
            .then((jsonResponse) => {
                if (jsonResponse.Response === 'True') {
                    setMovies(jsonResponse.Search);
                    setLoading(false);
                } else {
                    setErrorMessage(jsonResponse.Error);
                    setLoading(false);
                }
            });
    };
    return (
        <div className="App">
            <Helmet>
                <title>🎬电影搜索</title>
            </Helmet>
            <Header text="Lebronjs Movie Search" />
            <Search search={search} />
            <p className="App-intro">Sharing a few of our favourite movies</p>
            <div className="movies">
                {loading && !errorMessage ? (
                    <span>loading...</span>
                ) : errorMessage ? (
                    <div className="errorMessage">{errorMessage}</div>
                ) : (
                    movies.map((movie: Movie, index) => (
                        <Movie key={`${index}-${movie.Title}`} movie={movie} />
                    ))
                )}
            </div>
        </div>
    );
}

export default App;

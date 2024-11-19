import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MovieCard from './components/MovieCard';
import MovieDetailsPage from './components/MovieDetailsPage';
import axios from 'axios';

function App() {
  const [movies, setMovies] = useState([]); // Almacena las películas obtenidas del backend

  // Obtener películas desde el backend al cargar el componente
  useEffect(() => {
    axios
      .get('http://localhost:5824/movies') // Cambia esta URL según tu backend
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Página principal con las tarjetas de películas */}
          <Route
            path="/"
            element={
              <div className="row g-4">
                {movies.map((movie) => (
                  <div
                    key={movie.episode}
                    className="col-12 col-md-6 col-lg-4 d-flex justify-content-center"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            }
          />
          {/* Página de detalles de la película */}
          <Route
            path="/movie/:episode"
            element={<MovieDetailsPage movies={movies} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




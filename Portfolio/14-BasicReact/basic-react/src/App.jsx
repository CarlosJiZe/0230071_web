import React, { useState } from 'react';
import './App.css';
import MovieCard from './components/MovieCard';
import CharacterDetails from './components/CharacterDetails';
import sw from './data/data.js';

function App() {
  const [expandedMovie, setExpandedMovie] = useState(null); // Almacena la película expandida
  const [comments, setComments] = useState({});

  const addComment = (episode, newComment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [episode]: [...(prevComments[episode] || []), newComment],
    }));
  };

  // Maneja el clic para alternar entre expandir y colapsar
  const handleToggle = (movie) => {
    setExpandedMovie((prev) => (prev?.episode === movie.episode ? null : movie));
  };

  return (
    <div className="container">
      <div className="row g-4">
        {sw.map((movie) => (
          <React.Fragment key={movie.episode}>
            <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
              <MovieCard 
                movie={movie} 
                onToggle={() => handleToggle(movie)} // Alterna el estado expandido
                isExpanded={expandedMovie?.episode === movie.episode} // Controla el estado expandido
              />
            </div>
            
            {expandedMovie?.episode === movie.episode && (
              <div className="col-12">
                <CharacterDetails 
                  character={expandedMovie.best_character} 
                  comments={comments[expandedMovie.episode] || []} 
                  onAddComment={(newComment) => addComment(expandedMovie.episode, newComment)} 
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default App;




import React, { useState } from 'react';
import './App.css';
import MovieCard from './components/MovieCard';
import CharacterDetails from './components/CharacterDetails';
import sw from './data/data.js';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [comments, setComments] = useState({}); // Objeto para almacenar comentarios por película

  const addComment = (episode, newComment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [episode]: [...(prevComments[episode] || []), newComment],
    }));
  };

  return (
    <div className="container">
      <div className="row g-4">
        {sw.map((movie) => (
          <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center" key={movie.episode}>
            <MovieCard movie={movie} onShowCharacter={() => setSelectedMovie(movie)} />
          </div>
        ))}
      </div>

      {selectedMovie && (
        <CharacterDetails 
          character={selectedMovie.best_character} 
          comments={comments[selectedMovie.episode] || []} 
          onAddComment={(newComment) => addComment(selectedMovie.episode, newComment)} 
        />
      )}
    </div>
  );
}

export default App;


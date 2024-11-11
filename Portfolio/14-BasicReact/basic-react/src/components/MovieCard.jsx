// MovieCard.js
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function MovieCard({ movie, onShowCharacter }) {
  const [hover, setHover] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  // Determinar el color de borde según afiliación
  const borderColor = (movie.best_character.affiliation === 'Sith' || movie.best_character.affiliation === 'Empire') ? 'red' : 'blue';

  return (
    <Card 
      style={{ width: '18rem', border: `2px solid ${borderColor}`, minHeight: '100%' }}
      className="d-flex flex-column mb-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card.Img 
        variant="top"
        className='bg-dark' 
        src={hover ? `${process.env.PUBLIC_URL}/${movie.best_character.affiliation}.png` : `${process.env.PUBLIC_URL}/${movie.poster}`} 
        alt={`${movie.title} Poster`} 
        style={{ height: '400px', objectFit: 'contain' }}
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title>{movie.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{movie.year}</Card.Subtitle>
        </div>
        <div>
          {/* Verifica que el personaje se pasa correctamente al hacer clic */}
          <Button variant="primary" onClick={() => {
            console.log("Personaje seleccionado:", movie.best_character);
            onShowCharacter(movie.best_character);
          }}>
            More...
          </Button>
          <div className="mt-2">
            <Button variant="outline-success" onClick={() => setLikes(likes + 1)}>👍 {likes}</Button>
            <Button variant="outline-danger" onClick={() => setDislikes(dislikes + 1)} className="ms-2">👎 {dislikes}</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default MovieCard;



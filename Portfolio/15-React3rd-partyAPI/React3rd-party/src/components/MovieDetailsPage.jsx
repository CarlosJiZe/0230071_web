import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CharacterDetails from './CharacterDetails';
import Button from 'react-bootstrap/Button';

function MovieDetailsPage({ movies }) {
  const { episode } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const selectedMovie = movies.find((m) => m.episode === episode);
    setMovie(selectedMovie);

    // Obtener comentarios de la API
    axios
      .get(`http://localhost:5824/comments/${episode}`)
      .then((response) => setComments(response.data))
      .catch((error) => console.error('Error fetching comments:', error));
  }, [episode, movies]);

  const addComment = (newComment) => {
    axios
      .post('http://localhost:5824/comments', {
        episode,
        ...newComment,
      })
      .then((response) => setComments((prev) => [...prev, response.data]))
      .catch((error) => console.error('Error saving comment:', error));
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>{movie.title}</h1>
      <CharacterDetails
        character={movie.best_character}
        comments={comments}
        onAddComment={addComment}
      />
      <div className="mt-4">
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to Movies
        </Button>
      </div>
    </div>
  );
}

export default MovieDetailsPage;


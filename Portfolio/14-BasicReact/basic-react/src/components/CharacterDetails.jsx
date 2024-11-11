// CharacterDetails.js
import React from 'react';
import Card from 'react-bootstrap/Card';
import CommentsSection from './CommentsSection';

function CharacterDetails({ character, comments, onAddComment }) {
  if (!character) return null;

  const affiliationColor = character.affiliation === 'Sith' || character.affiliation === 'Empire' ? 'text-danger' : 'text-primary';

  return (
    <div>
      <Card className="bg-dark text-white my-4 p-3">
        <div className="d-flex flex-column flex-md-row align-items-center">
          <Card.Img 
            src={`${process.env.PUBLIC_URL}/${character.image}`} 
            alt={`${character.name} Image`} 
            style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
            className="mb-3 mb-md-0 me-md-3"
          />
          <Card.Body>
            <Card.Title>{character.name}</Card.Title>
            <Card.Subtitle className={`${affiliationColor} mb-3`}>{character.affiliation}</Card.Subtitle>
            <Card.Text>{character.bio}</Card.Text>
          </Card.Body>
        </div>
      </Card>

      {/* Pasamos los comentarios y la función para agregar un nuevo comentario */}
      <CommentsSection comments={comments} onAddComment={onAddComment} />
    </div>
  );
}

export default CharacterDetails;


import css from './MovieModal.module.css'

import type { Movie } from '../../types/movie';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';


interface MovieModalProps{
    onClose: () => void;
    movie: Movie;
}

export default function MovieModal({ onClose, movie }: MovieModalProps) {
    
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    useEffect(() => {
         
            const hadleKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    onClose()
                }
            }
        
            document.addEventListener("keydown", hadleKeyDown);
            document.body.style.overflow = "hidden";
            
        return () => {
                document.removeEventListener("keydown", hadleKeyDown);
                document.body.style.overflow = "";
            }
            
        },[onClose])
    

    return createPortal(
        <div className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            <div className={css.modal}>
                <button
                    className={css.closeButton}
                    aria-label="Close modal"
                    onClick={onClose}
                >
                    &times;
                </button>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                    className={css.image}
                />
                <div className={css.content}>
                    <h2>{movie.title}</h2>
                    <p>{movie.overview}</p>
                    <p>
                        <strong>Release Date:</strong> {movie.release_date}
                    </p>
                    <p>
                        <strong>Rating:</strong> {movie.vote_average}/10
                    </p>
                </div>
            </div>
        </div>,
        document.body,
    );
    
}
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdbServices, getImageUrl, get } from '../api/tmdb';
import SectionRow from '../components/SectionRow';
import { HeroSkeleton } from '../components/Skeletons';
import './Details.css';

const PersonDetails = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState({ cast: [] });
  const [loading, setLoading] = useState(true);

  const fetchPersonDetails = useCallback(async () => {
    setLoading(true);
    try {
      const personData = await tmdbServices.getPersonDetails(id);
      // Fetch combined credits for both movies and tv
      const creditsData = await get(`/person/${id}/combined_credits`);

      setPerson(personData);
      setCredits(creditsData);
    } catch (error) {
      console.error('Failed to fetch person details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPersonDetails();
    window.scrollTo(0, 0);
  }, [fetchPersonDetails]);

  if (loading) return <HeroSkeleton />;
  if (!person) return <div className="error-state">Person not found</div>;

  const movieCredits = credits.cast.filter(c => c.media_type === 'movie').sort((a, b) => b.popularity - a.popularity);
  const tvCredits = credits.cast.filter(c => c.media_type === 'tv').sort((a, b) => b.popularity - a.popularity);

  return (
    <div className="details-page person-details">
      <div className="details-container">
        <div className="details-poster person-poster">
          <img src={getImageUrl(person.profile_path, 'h632')} alt={person.name} />
        </div>

        <div className="details-info">
          <h1 className="details-title">{person.name}</h1>

          <div className="details-meta">
            {person.birthday && (
              <div className="meta-item">
                <i className="ri-calendar-event-line"></i>
                <span>Born: {new Date(person.birthday).toLocaleDateString()}</span>
              </div>
            )}
            {person.place_of_birth && (
              <div className="meta-item">
                <i className="ri-map-pin-line"></i>
                <span>{person.place_of_birth}</span>
              </div>
            )}
          </div>

          <h2 className="section-h2">Biography</h2>
          <p className="details-overview person-bio">
            {person.biography || `We don't have a biography for ${person.name}.`}
          </p>

          <div className="person-quick-info">
            <div className="info-box">
              <span className="info-label">Known For</span>
              <span className="info-value">{person.known_for_department}</span>
            </div>
            <div className="info-box">
              <span className="info-label">Gender</span>
              <span className="info-value">{person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Non-binary'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="details-sections">
        {movieCredits.length > 0 && (
          <SectionRow
            title="Movie Credits"
            items={movieCredits}
            type="movie"
          />
        )}

        {tvCredits.length > 0 && (
          <SectionRow
            title="TV Show Credits"
            items={tvCredits}
            type="tv"
          />
        )}
      </div>
    </div>
  );
};

export default PersonDetails;

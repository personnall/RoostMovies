import React from 'react';
import './Skeletons.css';

export const MovieCardSkeleton = () => (
  <div className="skeleton card-skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-info">
      <div className="skeleton-line title-line"></div>
      <div className="skeleton-line small-line"></div>
    </div>
  </div>
);

export const SectionSkeleton = () => (
  <div className="section-skeleton">
    <div className="skeleton-line section-title-line"></div>
    <div className="skeleton-row">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="skeleton hero-skeleton">
    <div className="skeleton-hero-content">
      <div className="skeleton-line hero-logo-line"></div>
      <div className="skeleton-line hero-info-line"></div>
      <div className="skeleton-line hero-desc-line"></div>
      <div className="skeleton-line hero-desc-line"></div>
      <div className="skeleton-hero-btns">
        <div className="skeleton-btn"></div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  </div>
);

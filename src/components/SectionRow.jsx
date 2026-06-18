import React, { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { SectionSkeleton } from './Skeletons';
import './SectionRow.css';

const SectionRow = ({ title, items, loading, type = 'movie' }) => {
  const rowRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftBtn(scrollLeft > 0);
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const row = rowRef.current;
    if (row) {
      row.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      return () => row.removeEventListener('scroll', handleScroll);
    }
  }, [items]);

  if (loading) return <SectionSkeleton />;

  return (
    <section className="section-row-container">
      <h2 className="section-title">{title}</h2>

      <div className="row-wrapper">
        {showLeftBtn && (
          <button
            className="row-nav-btn left"
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
        )}

        <div className="section-row" ref={rowRef}>
          {items.map((item) => (
            <div className="row-item" key={item.id}>
              <MovieCard item={item} type={type} />
            </div>
          ))}
        </div>

        {showRightBtn && (
          <button
            className="row-nav-btn right"
            onClick={() => scroll('right')}
            aria-label="Scroll Right"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        )}
      </div>
    </section>
  );
};

export default React.memo(SectionRow);

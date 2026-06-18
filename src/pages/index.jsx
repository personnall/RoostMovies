import Home from './Home';
import Search from './Search';
import MovieDetails from './MovieDetails';
import TVDetails from './TVDetails';
import PersonDetails from './PersonDetails';
import Favorites from './Favorites';
import Watchlist from './Watchlist';
import Player from './Player';

export { Home, Search, MovieDetails, TVDetails, PersonDetails, Favorites, Watchlist, Player };

const PagePlaceholder = ({ title }) => {
  return (
    <div className="page-placeholder">
      <h1>{title}</h1>
      <p>Content for {title} will be implemented in future phases.</p>
    </div>
  );
};

export const Movies = () => <PagePlaceholder title="Movies" />;
export const TVShows = () => <PagePlaceholder title="TV Shows" />;
export const Popular = () => <PagePlaceholder title="Popular" />;
export const TopRated = () => <PagePlaceholder title="Top Rated" />;
export const People = () => <PagePlaceholder title="People" />;

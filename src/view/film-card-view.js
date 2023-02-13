import AbstractView from '../framework/view/abstract-view.js';
import { humanizeFilmDueDate, getComments } from '../util.js';

function createFilmCardTemplate(film) {
  const {
    filmInfo,
    userDetails: { watchlist, alreadyWatched, favorite },
  } = film;
  const { commentCount, description, poster, title, release, totalRating, genres, duration } =
    filmInfo;

  const isFavorite = !!favorite;
  const favoriteActiveClass = isFavorite ? 'film-card__controls-item--active' : '';

  const isWatched = !!alreadyWatched;
  const watchedActiveClass = isWatched ? 'film-card__controls-item--active' : '';

  const isWatchList = !!watchlist;
  const watchListActiveClass = isWatchList ? 'film-card__controls-item--active' : '';

  return `
        <article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${humanizeFilmDueDate(release.date)}</span>
              <span class="film-card__duration">${duration}</span>
              <span class="film-card__genre">${genres.slice(0, 1)}</span>
            </p>
            <img src="./${poster}" alt="${title}" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <span class="film-card__comments">${getComments(commentCount)}</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchListActiveClass}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedActiveClass}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteActiveClass}" type="button">Mark as favorite</button>
          </div>
        </article>
        `;
}

export default class FilmCard extends AbstractView {
  #filmInfo = null;

  constructor({ film, onClick, onFavoriteClick, onWatchedClick, onWatchListClick }) {
    super();
    this.#filmInfo = film;

    this.element.querySelector('a').addEventListener('click', onClick);

    this.element
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', onFavoriteClick);

    this.element
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', onWatchedClick);

    this.element
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', onWatchListClick);
  }

  get template() {
    return createFilmCardTemplate(this.#filmInfo);
  }
}

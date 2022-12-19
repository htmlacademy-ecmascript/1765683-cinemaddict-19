import { createElement } from '../render.js';
import { humanizeFilmDueDate } from '../util.js';

function createFilmCardTemplate(film) {
  const { filmInfo } = film;
  const { commentCount, description, poster, title, release, totalRating, genres, duration } = filmInfo;

  return `
        <article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${humanizeFilmDueDate(release.date)}</span>
              <span class="film-card__duration">${duration}</span>
              <span class="film-card__genre">${genres}</span>
            </p>
            <img src="./${poster}" alt="${title}" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <span class="film-card__comments">${commentCount}</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
          </div>
        </article>
        `;
}

export default class FilmCardView {
  constructor({ film }) {
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

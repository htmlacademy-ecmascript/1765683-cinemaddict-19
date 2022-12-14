import { createElement } from '../render.js';

function createFiltersTemplate() {
  return `
    <nav class="main-navigation">
      <a
        href="#all"
        class="main-navigation__item main-navigation__item--active"
      >
        All movies
      </a>
      <a href="#watchlist" class="main-navigation__item">
        Watchlist <span class="main-navigation__item-count">24</span>
      </a>
      <a href="#history" class="main-navigation__item">
        History <span class="main-navigation__item-count">9</span>
      </a>
      <a href="#favorites" class="main-navigation__item">
        Favorites <span class="main-navigation__item-count">3</span>
      </a>
    </nav>
    `;
}

export default class Filters {
  #element = null;

  get template() {
    return createFiltersTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

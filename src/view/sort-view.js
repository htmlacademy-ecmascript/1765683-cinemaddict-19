import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../mock/const.js';

function createFilmSortTemplate(currentSortType) {
  return `
    <ul class="sort">
      <li><a href="#" class="sort__button  ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}"  data-sort-type="${SortType.DEFAULT}" >Sort by default</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.BY_DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.BY_RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
    </ul>
  `;
}

export default class Sort extends AbstractView {
  #currentSortType = 'default';
  #handleSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createFilmSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {

    if (evt.target.tagName !== 'A') {
      return;
    }
    this.#currentSortType = evt.target.dataset.sortType;
    evt.preventDefault();
    createFilmSortTemplate();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}

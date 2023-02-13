import { FilterType } from '../mock/const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  return `
    <a href="#${type}" data-filter-type="${type}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
      ${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>
    `;
};

const createFiltersTemplate = (filters, currentFilterType) =>
  `<nav class="main-navigation">
      <a href="#all" data-filter-type="${FilterType.ALL}"
      class="main-navigation__item ${currentFilterType === FilterType.ALL ? 'main-navigation__item--active' : ''}">
        All movies
      </a>
      ${Object.keys(filters).slice(1).map((filter) => `
        ${createFilterItemTemplate(filters[filter], currentFilterType)}
      `).join('')}
   </nav>`;

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    const filter = evt.target.closest('.main-navigation__item');
    if (filter && !filter.classList.contains('main-navigation__item--active')) {
      this.#handleFilterTypeChange(filter.dataset.filterType);
    }
  };
}

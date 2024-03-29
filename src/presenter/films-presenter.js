import { render, remove } from '../framework/render.js';
import { sortDate, sortRating, updateItem } from '../util.js';
import FilmSection from '../view/film-section-view.js';
import FilmListContainer from '../view/film-list-container-view.js';
import FilmList from '../view/film-list-view.js';
import Sort from '../view/sort-view.js';
import Filters from '../view/filters-view.js';
import FilmListHeader from '../view/film-list-header.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import EmptyListMessage from '../view/empty-film-list-message.js';
import FilmPresenter from './film-presenter.js';
import FilmSectionPresenter from './film-section-presenter.js';
import { SortMode } from '../mock/const.js';

const FILM_COUNT_PER_STEP = 5;
export default class FilmsPresenter {
  #mainContainer = document.querySelector('.main');
  #filmSectionComponent = new FilmSection();
  #filmListContainerComponent = new FilmListContainer();
  #filmListComponent = new FilmList();
  #sortComponent = null;
  #filmListHeaderComponent = new FilmListHeader();
  #filmCards = null;
  #emptyMessage = new EmptyListMessage();
  #filtersComponent;
  #filmPresenter = new Map();
  #page = 1;
  #showMoreBtn;
  #currentSortType = SortMode.DEFAULT;
  #sourcedFilms = [];

  constructor({ filmModel, commentModel, filters }) {
    this.filmModel = filmModel;
    this.commentModel = commentModel;
    this.filters = filters;
  }

  init() {
    this.#filmCards = [...this.filmModel.films];
    this.#sourcedFilms = [...this.filmModel.films];

    this.#renderFilters(this.filters);
    this.#renderSort();
    this.#renderFilmSection();
    this.#renderFilmList();

    if (this.#filmCards.length === 0) {
      render(this.#emptyMessage, this.#filmListContainerComponent.element);

      return;
    }

    if (this.#filmCards.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreBtn();
    }
  }

  #renderSort() {
    this.#sortComponent = new Sort({
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#mainContainer);
  }

  #sortFilmCards = (sortMode) => {
    switch (sortMode) {
      case SortMode.BY_DATE:
        this.#filmCards.sort(sortDate);
        break;

      case SortMode.BY_RATING:
        this.#filmCards.sort(sortRating);
        break;

      case SortMode.DEFAULT:
        this.#filmCards = [...this.#sourcedFilms];
        break;
    }

    this.#currentSortType = sortMode;
  };

  #handleSortTypeChange = (sortMode) => {
    if (this.#currentSortType === sortMode) {
      return;
    }

    this.#sortFilmCards(sortMode);
    this.#clearFilmsList();
    this.#renderFilmList();
    this.#renderShowMoreBtn();
  };

  #renderFilmSection() {
    const filmSectionPresenter = new FilmSectionPresenter({
      filmSectionComponent: this.#filmSectionComponent,
      filmSectionContainer: this.#mainContainer,
    });
    filmSectionPresenter.init();
  }

  #renderFilmList() {
    render(this.#filmListComponent, this.#filmSectionComponent.element);
    render(this.#filmListHeaderComponent, this.#filmListComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);

    this.#renderFilms(0, Math.min(this.#filmCards.length, FILM_COUNT_PER_STEP));
  }

  #renderFilms(from, to) {
    this.#filmCards.slice(from, to).forEach((film) => this.#renderFilm(film));
  }

  #renderFilters(filters) {
    this.#filtersComponent = new Filters({ filters });
    render(this.#filtersComponent, this.#mainContainer);
  }

  #renderShowMoreBtn() {
    this.#showMoreBtn = new ShowMoreButton({ onClick: this.#showMoreBtnClickHandler });
    render(this.#showMoreBtn, this.#filmListComponent.element);
  }

  #showMoreBtnClickHandler = () => {
    this.#page += 1;
    const start = FILM_COUNT_PER_STEP * (this.#page - 1);
    const end = FILM_COUNT_PER_STEP * this.#page;

    if (FILM_COUNT_PER_STEP * this.#page >= this.#filmCards.length) {
      this.#renderFilms(start, this.#filmCards.length);
      return true;
    }
    this.#renderFilms(start, end);
    return false;
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter({
      commentsModel: this.commentModel,
      filmListContainer: this.#filmListContainerComponent,
      onFilmChange: this.#handleFilmChange,
      onModeChange: this.#handleModeChange,
    });
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #handleFilmChange = (updatedFilm) => {
    this.#filmCards = updateItem(this.#filmCards, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearFilmsList() {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#page = 1;

    remove(this.#showMoreBtn);
  }
}

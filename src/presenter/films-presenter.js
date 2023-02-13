import { render, remove } from '../framework/render.js';
import { sortDate, sortRating } from '../util.js';
import FilmSection from '../view/film-section-view.js';
import FilmListContainer from '../view/film-list-container-view.js';
import FilmList from '../view/film-list-view.js';
import Sort from '../view/sort-view.js';
import FilmListHeader from '../view/film-list-header.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import EmptyListMessage from '../view/empty-film-list-message.js';
import FilmPresenter from './film-presenter.js';
import FilmSectionPresenter from './film-section-presenter.js';
import { SortType, UpdateType, UserAction } from '../mock/const.js';
import { FILM_COUNT_PER_STEP, filter } from '../mock/const.js';

export default class FilmsPresenter {
  #mainContainer = document.querySelector('.main');
  #filmSectionComponent = new FilmSection();
  #filmListContainerComponent = new FilmListContainer();
  #filmListComponent = new FilmList();
  #sortComponent = null;
  #filmListHeaderComponent = new FilmListHeader();
  #emptyMessage = new EmptyListMessage();
  #filmPresenter = new Map();
  #showMoreBtn;
  #currentSortType = SortType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_PER_STEP;


  constructor({ filmModel, commentModel, filterModel }) {
    this.filmModel = filmModel;
    this.commentModel = commentModel;
    this.filterModel = filterModel;

    this.filmModel.addObserver(this.#handleModelEvent);
    this.commentModel.addObserver(this.#handleModelEvent);
    this.filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const filterType = this.filterModel.filter;
    const films = this.filmModel.films;
    const filteredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredFilms.sort(sortDate);

      case SortType.BY_RATING:
        return filteredFilms.sort(sortRating);
    }
    return this.filmModel.films;
  }

  init() {
    this.#renderPage();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.filmModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT: {
        this.commentModel.addComment(updateType, update);
        this.filmsModel.updateFilm(updateType, update);
        break;}
      case UserAction.DELETE_COMMENT:
        this.commentModel.deleteComment(updateType, update);
        this.filmsModel.updateFilm(updateType, update);
        break;
    }
    return this.filmModel.films;
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.film.id).init(data.film);
        break;

      case UpdateType.MINOR:
        this.#clearPage();
        this.#renderPage();

        break;
      case UpdateType.MAJOR:
        this.#clearPage({ resetSortType: true, resetRenderedFilmCount: true });
        this.#renderPage();
        break;
    }
  };


  #renderSort() {
    this.#sortComponent = new Sort({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#mainContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPage({ resetRenderedFilmCount: true });
    this.#renderPage();
  };

  #renderFilmSection() {
    const filmSectionPresenter = new FilmSectionPresenter({
      filmSectionComponent: this.#filmSectionComponent,
      filmSectionContainer: this.#mainContainer,
    });
    filmSectionPresenter.init();
  }

  #renderFilms(films) {
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderShowMoreBtn() {
    this.#showMoreBtn = new ShowMoreButton({ onClick: this.#showMoreBtnClickHandler });
    render(this.#showMoreBtn, this.#filmListComponent.element);
  }

  #showMoreBtnClickHandler = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreBtn);
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter({
      commentsModel: this.commentModel,
      filmListContainer: this.#filmListContainerComponent,
      onFilmChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      handleViewAction: this.#handleViewAction
    });
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPage({ resetRenderedFilmCount = false, resetSortType = false } = {}) {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#emptyMessage);
    remove(this.#showMoreBtn);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderPage() {
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));

    this.#renderSort();
    this.#renderFilmSection();

    render(this.#filmListComponent, this.#filmSectionComponent.element);
    render(this.#filmListHeaderComponent, this.#filmListComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);

    if (!filmCount) {
      render(this.#emptyMessage, this.#filmListContainerComponent.element);
      return;
    }

    this.#renderFilms(films);

    if (filmCount > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreBtn();
    }
  }

}

import FilmCard from '../view/film-card-view';
import FilmPopup from '../view/film-popup-view';
import { render, remove, replace } from '../framework/render';
import { UserAction, UpdateType } from '../mock/const';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPEN: 'OPEN',
};

export default class FilmPresenter {
  #filmListContainer = null;

  #filmCardComponent = null;
  #filmPopupComponent = null;

  #film = null;
  #comments = null;
  #commentsModel = null;
  #handleFilmChange = null;
  #mode = Mode.DEFAULT;
  #handleModeChange = null;
  #popupScrollTop = null;

  constructor({ commentsModel, filmListContainer, onFilmChange, onModeChange, addComment }) {
    this.#filmListContainer = filmListContainer;
    this.#commentsModel = commentsModel;
    this.#handleFilmChange = onFilmChange;
    this.#handleModeChange = onModeChange;
    this.addComment = addComment;
  }

  init(film) {
    this.#comments = this.#commentsModel.getComments().filter((comment) => film.comments.includes(comment.id));

    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCard({
      film: this.#film,
      onClick: this.#openPopup,
      onWatchListClick: this.#handleWatchListClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#filmPopupComponent = new FilmPopup({
      film: {
        ...this.#film,
        comments: this.#comments,
      },
      onCloseClick: this.#closePopup,
      scrollPosition: this.#popupScrollTop,
      onWatchListClick: this.#handlePopUpFilterClick,
      onWatchedClick: this.#handlePopUpFilterClick,
      onFavoriteClick: this.#handlePopUpFilterClick,
      onScroll: this.#popupScrollPosHandler,
      addComment: this.#addComment,
      deleteComment: this.#deleteComment
    });

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmListContainer.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (this.#mode === Mode.OPEN) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      this.#filmPopupComponent.restoreScroll();
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this.#filmCardComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #openPopup = () => {
    this.#handleModeChange();

    document.body.appendChild(this.#filmPopupComponent.element);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#mode = Mode.OPEN;
  };

  #closePopup = () => {
    document.body.removeChild(this.#filmPopupComponent.element);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#mode = Mode.DEFAULT;
  };

  #handleWatchListClick = () => {
    this.#handleFilmChange(UserAction.UPDATE_FILM, UpdateType.MINOR, {
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist,
      },
    });
  };

  #handleWatchedClick = () => {
    this.#handleFilmChange(UserAction.UPDATE_FILM, UpdateType.MINOR, {
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched,
      },
    });
  };

  #handleFavoriteClick = () => {
    this.#handleFilmChange(UserAction.UPDATE_FILM, UpdateType.MINOR, {
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite,
      },
    });
  };

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  }

  #popupScrollPosHandler = (offset) => {
    this.#popupScrollTop = offset;
    this.#filmPopupComponent.updateScrollPosition(offset);
  };

  #handlePopUpFilterClick = (userDetails) => {
    this.#handleFilmChange(UserAction.UPDATE_FILM, UpdateType.MINOR, {
      ...this.#film,
      userDetails,
    });
  };

  #addComment = (data) => {
    this.#handleFilmChange(UserAction.ADD_COMMENT, UpdateType.PATCH, { film: this.#film, data });
  };

  #deleteComment = (data) => {
    this.#handleFilmChange(UserAction.DELETE_COMMENT, UpdateType.PATCH, { film: this.#film, data });
  };
}

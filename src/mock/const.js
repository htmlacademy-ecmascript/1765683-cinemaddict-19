import { getRandomArrayElement } from '../util.js';

const FILM_COUNT_PER_STEP = 5;
/*
const filter = [
  {
    type: 'all',
    name: 'ALL',
    count: 0,
  },
];*/


const BOOLEAN = [true, false];

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};


const FilterType = {
  ALL: 'All Movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITE: 'Favorite',
};


const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.userDetails.favorite),
};

const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RATING: 'by-rating',
};


const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const SOME_POSTER = getRandomArrayElement(POSTERS);

const USER_RANK = ['Novice', 'Fan', 'Movie Buff'];

const SOME_RANK = getRandomArrayElement(USER_RANK);

const getUserProfile = () => ({
  userRank: SOME_RANK,
});

export { FILM_COUNT_PER_STEP, BOOLEAN, FilterType, SOME_POSTER, getUserProfile, SortType, UserAction, UpdateType, filter };

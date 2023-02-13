import dayjs from 'dayjs';
import require from 'dayjs';
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const POPUP_DATE_FORMAT = 'D MMMM YYYY';
const FILM_DATE_FORMAT = 'YYYY';
const COMMENT_DATE_FORMAT = 'YYYY/MM/DD HH:mm';

const MAX_ARRAY_LENGTH = 3;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * max + min);
}

function getTime(mins) {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
}

function getComments(comments) {
  if (comments === 1) {
    return `${comments} comment`;
  } else {
    return `${comments} comments`;
  }
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizeFilmDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(FILM_DATE_FORMAT) : '';
}

function humanizePopUpDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(POPUP_DATE_FORMAT) : '';
}

function humanizeCommentsDueDate(dueDate) {
  const date1 = dayjs();
  const date2 = dayjs(dueDate);

  return date1.diff(date2, 'week')
    ? dayjs(dueDate).format(COMMENT_DATE_FORMAT)
    : dayjs(dueDate).fromNow();

}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomUniqArrayElement(items) {
  const length = MAX_ARRAY_LENGTH;
  shuffle(items);
  items.length = length;
  const result = items.reduce((acc, item) => {
    if (acc.includes(item)) {
      return acc;
    }
    return [...acc, item];
  }, []);
  return result;
}

const sortRating = (filmA, filmB) =>
  filmA.filmInfo.totalRating > filmB.filmInfo.totalRating ? -1 : 1;

const sortDate = (filmA, filmB) =>
  filmA.filmInfo.release.date > filmB.filmInfo.release.date ? -1 : 1;

export {
  getRandomInt,
  getRandomArrayElement,
  humanizeFilmDueDate,
  getRandomUniqArrayElement,
  humanizePopUpDueDate,
  getTime,
  getComments,
  humanizeCommentsDueDate,
  sortRating,
  sortDate,
};

import FooterPresenter from './presenter/footer-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import FilmsModel from '../src/model/film-model.js';
import FilmsPresenter from './presenter/films-presenter.js';
import CommentsModel from './model/comment-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filters-presenter.js';
import FilmsApiService from './film-api.js';
import CommentsApiService from './comment-api.js';

const AUTHORIZATION = 'Basic SPMsk28493';
const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');

const filmModel = new FilmsModel({filmsApiService: new FilmsApiService(END_POINT, AUTHORIZATION)});
const commentModel = new CommentsModel({commentsApiService: new CommentsApiService(END_POINT, AUTHORIZATION)});
const filterModel = new FilterModel();
const filmsPresenter = new FilmsPresenter({ filmModel, commentModel, filterModel });

const filterPresenter = new FilterPresenter({
  filterContainer: siteMainElement,
  filterModel,
  filmModel,
});
const headerPresenter = new HeaderPresenter();
const footerPresenter = new FooterPresenter();

headerPresenter.init();
filmsPresenter.init();
footerPresenter.init();
filterPresenter.init();
filmModel.init();

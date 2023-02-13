import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;

  constructor({commentsApiService}) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  async getComments(filmId) {
    return await this.#commentsApiService.getComments(filmId);
  }

  async addComment(updateType, update) {
    try {
      this.#commentsApiService.addComment(update.id, update.commentToAdd);
      delete update.commentToAdd;
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  async deleteComment(updateType, update) {
    try {
      this.#commentsApiService.deleteComment(update.commentToDelete.id);
      delete update.commentToDelete;
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }
}

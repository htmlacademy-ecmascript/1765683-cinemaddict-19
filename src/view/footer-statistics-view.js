import { createElement } from '../render.js';

function createFooterStatisticsTemplate() {
  return `
    <section class="footer__statistics">
      <p>130 291 movies inside</p>
    </section>
  `;
}

export default class FooterStatistics {

  #element = null;

  get template() {
    return createFooterStatisticsTemplate();
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

import View from "./view";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandelEvent(handler) {
    this._parentElement.addEventListener("click", function (event) {
      const btn = event.target.closest(".btn--inline");
      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }
  _generateMarkup() {
    const numPage = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );
    const curentPage = this._data.page;

    if (numPage === 1) return "";

    if (curentPage === 1 && curentPage < numPage)
      return `
        <button data-goto=${
          curentPage + 1
        } class="btn--inline pagination__btn--next">
            <span>Page ${curentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;

    if (curentPage > 1 && curentPage < numPage)
      return `
        <button data-goto=${
          curentPage - 1
        } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curentPage - 1}</span>
        </button>
        <button data-goto=${
          curentPage + 1
        } class="btn--inline pagination__btn--next">
            <span>Page ${curentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;

    if (curentPage === numPage)
      return `
    <button data-goto=${
      curentPage - 1
    } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curentPage - 1}</span>
    </button>`;
  }
}

export default new PaginationView();

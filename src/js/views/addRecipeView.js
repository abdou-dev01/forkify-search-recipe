import icons from "url:../../img/icons.svg";
import View from "./view";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnAddRecipe = document.querySelector(".nav__btn--add-recipe");
  _btnCloseModal = document.querySelector(".btn--close-modal");
  _message = "You added a new recipe successuflly :)";

  constructor() {
    super();
    this._openAddRecipe();
    this._closeAddRecipe();
    // this.addHandelUpload();
  }

  toggleRecipe() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _openAddRecipe() {
    this._btnAddRecipe.addEventListener("click", this.toggleRecipe.bind(this));
  }

  _closeAddRecipe() {
    this._overlay.addEventListener("click", this.toggleRecipe.bind(this));
    this._btnCloseModal.addEventListener("click", this.toggleRecipe.bind(this));
  }

  addHandleUpload(handler) {
    this._parentElement.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = Object.fromEntries([...new FormData(this)]);
      handler(data);
    });
  }

  _generateMarkup(results) {}
}

export default new AddRecipeView();

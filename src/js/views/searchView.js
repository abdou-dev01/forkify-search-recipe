import View from "./view";

class SearchView extends View {
  _parentElement = document.querySelector(".search");
  _errorMessage = "We could not found this recipe. Please try another one!";

  getQuery() {
    return this._parentElement.querySelector(".search__field").value;
  }

  addHandelEvent(handler) {
    this._parentElement.addEventListener("submit", function (event) {
      event.preventDefault();
      handler();
    });
  }
}

export default new SearchView();

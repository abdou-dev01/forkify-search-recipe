import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  render(result) {
    this._data = result;
    const markup = this._generateMarkup(result);
    this._parentElement.innerHTML = markup;
  }

  update(result) {
    this._data = result;
    const newMarkup = this._generateMarkup(result);
    const newDom = document
      .createRange()
      .createContextualFragment(newMarkup)
      .querySelectorAll("*");
    const newElement = Array.from(newDom);
    const currentElement = Array.from(
      this._parentElement.querySelectorAll("*")
    );

    newElement.forEach((newElement, i) => {
      const currElement = currentElement[i];
      if (
        !newElement.isEqualNode(currElement) &&
        newElement.firstChild?.nodeValue.trim() !== ""
      ) {
        currElement.textContent = newElement.textContent;
      }

      if (!newElement.isEqualNode(currElement)) {
        Array.from(newElement.attributes).forEach((element) =>
          currElement.setAttribute(element.name, element.value)
        );
      }
    });

    // this._parentElement.innerHTML = newMarkup;
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  addHandelEvent(handler) {
    ["hashchange", "load"].forEach((event) => addEventListener(event, handler));
  }

  renderError(message = this._errorMessage) {
    const markup = `
            <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
            </div>`;
    this._parentElement.innerHTML = markup;
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._parentElement.innerHTML = markup;
  }
}

import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import resultsView from "./views/resultsView.js";
import searchView from "./views/searchView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { CLOSE_MODEL_SEC } from "./config.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controllerRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    //Update the result search to mark selected result
    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    // renderSpinner(recipeContainer);
    recipeView.renderSpinner();

    // load recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    //render view
    recipeView.render(recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controllerSearch = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResult(query);
    const data = model.state.search.result;

    // check if no data found
    if (!data || (Array.isArray(data) && data.length === 0)) throw Error;

    //render search result
    resultsView.render(model.getSearchResultPage());

    //render pagination
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError();
  }
};

const controllerPagination = function (goTo) {
  //Render new result
  resultsView.render(model.getSearchResultPage(goTo));
  paginationView.render(model.state.search);
};

const controllerUpdatingServings = function (newValue) {
  model.updateServings(newValue);
  recipeView.update(model.state.recipe);
};

const controllerAddBookmark = function () {
  // Add bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.bookmarks);

  //Update the view
  recipeView.update(model.state.recipe);

  //Render bookmark
  if (model.state.bookmarks.length === 0) bookmarksView.renderError();
  else bookmarksView.render(model.state.bookmarks);
};

const controllerRenderBookmark = function () {
  if (model.state.bookmarks.length === 0) bookmarksView.renderError();
  else bookmarksView.render(model.state.bookmarks);
};

const controllerUploadRecipe = async function (data) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(data);

    //Render data received
    recipeView.render(model.state.recipe);

    //render success message
    addRecipeView.renderMessage();

    //Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    //Update ID in the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //Close form
    setTimeout(() => {
      addRecipeView.toggleRecipe();
    }, CLOSE_MODEL_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandelBookmark(controllerRenderBookmark);
  recipeView.addHandelEvent(controllerRecipe);
  recipeView.addHandelUpdateServings(controllerUpdatingServings);
  recipeView.addHandelBookmarks(controllerAddBookmark);
  searchView.addHandelEvent(controllerSearch);
  paginationView.addHandelEvent(controllerPagination);
  addRecipeView.addHandleUpload(controllerUploadRecipe);
};
init();

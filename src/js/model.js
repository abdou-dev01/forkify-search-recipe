import { API_URL, KEY, RESULT_PER_PAGE } from "./config";
import { getJSON, sendJSON } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    page: 1,
    result: [],
    resultPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

const formatData = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);

    state.recipe = formatData(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.result = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        title: recipe.title,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    //reset te page
    state.search.page = 1;
    // console.log(state);
  } catch (error) {
    console.log(error);
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.result.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      ingredient.quantity * (newServings / state.recipe.servings);
  });
  state.recipe.servings = newServings;
};

const addToLocalStorage = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add recipe to bookmark array
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) recipe.bookmarked = true;

  addToLocalStorage();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((element) => element.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  addToLocalStorage();
};

/**
 * Upload new recipe to the API
 * @param {Object | Object[]} newRecipe the data to be added
 * @returns {Promise}
 * @author abdou ben
 * @todo finish implementation
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ingredient) => {
        const ingredientArray = ingredient[1].split(",").map((el) => el.trim());

        if (ingredientArray.length !== 3)
          throw new Error("Please use correct format of data :)");

        const [quantity, unit, description] = ingredientArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      cooking_time: newRecipe.cookingTime,
    };
    const sendData = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    // console.log(sendData);
    state.recipe = formatData(sendData);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

const init = function () {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  if (bookmarks) state.bookmarks = bookmarks;
};
init();

const clearStorage = function () {
  localStorage.clear();
};
// clearStorage();

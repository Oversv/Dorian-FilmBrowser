"use strict";

window.addEventListener('load', function () {
  showFilms();
});

var showFilms = function showFilms() {
  var user = JSON.parse(sessionStorage.getItem('user'));
  var bookmarksContainer = document.getElementById('bookmarks');
  var fragment = document.createDocumentFragment(); //Info bookmarks

  var totalBookmarks = document.getElementById('total-bookmarks');
  var totalMovies = document.getElementById('total-movies');
  var totalSeries = document.getElementById('total-series');
  var totalEpisodes = document.getElementById('total-episodes');
  totalBookmarks.textContent = " Bookmarks ".concat(user.bookmarks.length, ":");
  totalMovies.textContent = " Movies ".concat(user.bookmarks.filter(function (e) {
    return e.Type === 'movie';
  }).length);
  totalSeries.textContent = " Series ".concat(user.bookmarks.filter(function (e) {
    return e.Type === 'series';
  }).length);
  totalEpisodes.textContent = " Episodes ".concat(user.bookmarks.filter(function (e) {
    return e.Type === 'episode';
  }).length);
  bookmarksContainer.innerHTML = '';
  user.bookmarks.sort(function (a, b) {
    return a.Title > b.Title ? 1 : -1;
  }).forEach(function (e) {
    var div = document.createElement('div');
    div.classList.add('bookmarks__item');
    div.innerHTML += "\n            <div class=\"bookmarks__img-container\">\n                <img class=\"bookmarks__img\" src=\"".concat(e.Poster, "\" alt=\"").concat(e.Title, "\" onerror=\"this.src='./images/not-found.png';\">\n            </div>\n            <div class=\"bookmarks__info\">\n                <p>").concat(e.Title, "<p/>\n                <p>Year: ").concat(e.Year, "<p/>\n                <p>Type: ").concat(e.Type, "<p/>\n            </div>\n            <div>\n                <button class=\"btn--small\" onclick=\"deleteBookmark('").concat(e.imdbID, "')\">Delete</button>\n            </div>\n        ");
    fragment.appendChild(div);
  });
  bookmarksContainer.appendChild(fragment);
};

var deleteBookmark = function deleteBookmark(id) {
  //Update sessionStorage
  var user = JSON.parse(sessionStorage.getItem('user'));
  user.bookmarks = user.bookmarks.filter(function (e) {
    return e.imdbID !== id;
  });
  sessionStorage.setItem('user', JSON.stringify(user)); //Update socalStorage

  var allLocalStorage = JSON.parse(localStorage.users).filter(function (e) {
    return e.id !== user.id;
  });
  allLocalStorage.push(user);
  localStorage.setItem('users', JSON.stringify(allLocalStorage));
  showFilms();
};
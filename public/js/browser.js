"use strict";

var form = document.getElementById('browser');
var filmList = document.getElementById('filmList');
var modal = document.getElementById('modal');
var arrFilmList = []; //This array saves the result of the browser

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var film = document.getElementById('film').value.trim();
  var error = document.getElementById('error-browser');

  if (film.length === 0) {
    error.textContent = "Write something :-)";
  } else {
    error.textContent = "";
    fetch("https://www.omdbapi.com/?apikey=72cf791f&s=".concat(film)).then(function (res) {
      return res.ok ? Promise.resolve(res) : Promise.reject(res);
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      createBrowserList(data);
    })["catch"](function (err) {
      return console.log("Error in the request ".concat(err));
    });
    form.reset();
  }
});
filmList.addEventListener('click', function (e) {
  //Update the btns [It is probably better in the addBookmark function]
  if (e.target.getAttribute("data-add") === 'on') {
    e.target.classList.add('added');
    e.target.textContent = 'ADDED';
  } //Create the modal


  if (e.target.getAttribute("data-modal")) {
    createModal(e);
  }
});
modal.addEventListener('click', function (e) {
  var btnAdd = document.getElementById('add'); //close modal 

  if (e.target.getAttribute('id') === 'modal-close') {
    modal.classList.remove('modal--show');
  } //Update btns 


  if (e.target.getAttribute('data-add') === 'on') {
    //Update btn of modal
    btnAdd.classList.add('added');
    btnAdd.textContent = 'ADDED'; //Update btn of browser list

    var id = e.target.getAttribute('data-id');
    var btnBrowserList = Array.from(document.querySelectorAll("[data-id]"));
    btnBrowserList = btnBrowserList.filter(function (e) {
      return e.getAttribute('data-id') === id;
    });
    btnBrowserList[0].textContent = 'ADDED';
    btnBrowserList[0].classList.add('added');
  }
}); //Create the browser list, it receives a parameter with the fetch data

var createBrowserList = function createBrowserList(data) {
  var user = JSON.parse(sessionStorage.getItem('user'));
  var fragment = document.createDocumentFragment();
  var added = false;
  filmList.innerHTML = '';

  if (data.Response === 'True') {
    arrFilmList = data.Search;
    data.Search.forEach(function (e) {
      var div = document.createElement('div');
      div.setAttribute('class', 'film-list__item');
      added = user.bookmarks.some(function (ele) {
        return ele.imdbID.includes(e.imdbID);
      });
      div.innerHTML += "                       \n                <p class=\"film-list__title\" data-modal=\"".concat(e.imdbID, "\">").concat(e.Title, "</p>\n                <button \n                    class=\"film-list__add-bookmark btn--small ").concat(added ? 'added' : "", "\" data-add=\"on\" \n                    data-id=\"").concat(e.imdbID, "\" \n                    onclick=\"addBookmark('").concat(e.imdbID, "')\"\n                    >").concat(added ? 'ADDED' : 'ADD', "</button>           \n            ");
      fragment.appendChild(div);
    });
  } else {
    var div = document.createElement('div');
    div.innerHTML += "\n            <p class=\"film-list__item--not-found\">".concat(data.Error, "</p>                  \n        ");
    fragment.appendChild(div);
  }

  filmList.appendChild(fragment);
}; //Add a film to bookmarks


var addBookmark = function addBookmark(id) {
  var film = arrFilmList.filter(function (e) {
    return e.imdbID === id;
  }); //Get the film from the array

  var user = JSON.parse(sessionStorage.getItem('user')); //Get the user from the sessionStorage

  var allLocalStorage = JSON.parse(localStorage.users).filter(function (e) {
    return e.id !== user.id;
  }); //Check if the film is not in the user's bookmarks

  if (!user.bookmarks.some(function (e) {
    return e.imdbID === id;
  })) {
    //Save data in sessionStorage
    user.bookmarks.push(film[0]);
    sessionStorage.setItem('user', JSON.stringify(user)); //Save data in localStorage

    allLocalStorage.push(user);
    localStorage.setItem('users', JSON.stringify(allLocalStorage));
  }
}; //Create modal


var createModal = function createModal(e) {
  var modal = document.getElementById('modal');
  var id = e.target.getAttribute('data-modal');
  var user = JSON.parse(sessionStorage.getItem('user'));
  var added = user.bookmarks.some(function (e) {
    return e.imdbID.includes(id);
  });
  fetch("https://www.omdbapi.com/?apikey=72cf791f&i=".concat(id)).then(function (res) {
    return res.ok ? Promise.resolve(res) : Promise.reject(res);
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    modal.innerHTML = '';
    var div = document.createElement('div');
    div.classList.add('modal__item');
    div.innerHTML = "\n            <div class=\"modal__close\" id=\"modal-close\">+</div>\n            <div class=\"modal__container-top\">\n                <div class=\"modal__img-container\">\n                    <img \n                    class=\"modal__img\" \n                    src=\"".concat(data.Poster, "\" \n                    alt=\"").concat(data.Title, "\" \n                    onerror=\"this.src='./images/not-found.png';\"/>\n                </div>\n                <div class=\"modal__info\">\n                    <p class=\"modal__title\">").concat(data.Title, "</p>\n                    <p>Type: ").concat(data.Type, "</p>\n                    <p>Genre: ").concat(data.Genre, "</p>\n                    <p>Year: ").concat(data.Year, "</p>\n                    <p>Duration: ").concat(data.Runtime, "</p>\n                    <p class=\"modal__rating\">Rating: ").concat(data.imdbRating, "</p>                   \n                </div>\n            </div>\n            <div class=\"modal__details\">\n                <p>Director: ").concat(data.Director, "</p>\n                <p>Actors: ").concat(data.Actors, "</p>\n                <p>Synopsis: ").concat(data.Plot, "</p>                \n            </div>\n            <div class=\"modal__btn\">\n                <button id=\"add\" \n                    class=\"btn--small ").concat(added ? 'added' : '', "\" \n                    data-add=\"on\" \n                    data-id=\"").concat(data.imdbID, "\" \n                    onclick=\"addBookmark('").concat(data.imdbID, "')\"\n                    >").concat(added ? 'ADDED' : 'ADD', "\n                </button>\n            </div>\n        </div>");
    modal.appendChild(div);
    modal.classList.add('modal--show');
  })["catch"](function (err) {
    return console.log("Error in the request ".concat(err));
  });
};
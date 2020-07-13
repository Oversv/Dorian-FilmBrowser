"use strict";

var form = document.getElementById('browser');
var filmList = document.getElementById('filmList');
var arrFilmList = []; //This array keeps the search data

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var film = document.getElementById('film').value.trim();

  if (film.length === 0) {
    //------Mensaje de error
    console.log("Rellena el campo");
  } else {
    fetch("http://www.omdbapi.com/?apikey=72cf791f&s=".concat(film)).then(function (res) {
      return res.ok ? Promise.resolve(res) : Promise.reject(res);
    }) //Sin esta línea, se entraría siempre en el data, auque le peteción sea incorrecta
    .then(function (res) {
      return res.json();
    }).then(function (data) {
      var fragment = document.createDocumentFragment();
      filmList.innerHTML = '';

      if (data.Response === 'True') {
        arrFilmList = data.Search;
        data.Search.forEach(function (e) {
          var div = document.createElement('div');
          div.setAttribute('class', 'film-list__item');
          div.innerHTML += "\n                        <p class=\"film-list__item-type\">".concat(e.Type, "</p>\n                        <p class=\"film-list__item-title\" data-modal=\"").concat(e.imdbID, "\">").concat(e.Title, "</p>\n                        <button data-id=\"").concat(e.imdbID, "\">ADD</button>\n                    ");
          fragment.appendChild(div);
        });
      } else {
        var div = document.createElement('div');
        div.innerHTML += "\n                    <p class=\"film-list__item--not-found\">".concat(data.Error, "</p>                     \n                "); //--------------Falta crear la clase para el div Error

        fragment.appendChild(div);
      }

      filmList.appendChild(fragment);
    })["catch"](function (err) {
      return console.log("Error en la petici\xF3n ".concat(err));
    });
    form.reset(); //------Revisar el tema del placeholder, no me convence mucho
  }
});
filmList.addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON') {
    var id = e.target.getAttribute("data-id");
    addBookmark(id);
  }

  if (e.target.getAttribute("data-modal")) {
    createModal(e);
  }
});

var addBookmark = function addBookmark(id) {
  var film = arrFilmList.filter(function (e) {
    return e.imdbID === id;
  }); //Get the film of the array

  var user = JSON.parse(sessionStorage.getItem('user')); //Get the user of sessionStorage

  var allLocalStorage = JSON.parse(localStorage.users).filter(function (e) {
    return e.id !== user.id;
  });

  if (!user.bookmarks.some(function (e) {
    return e.imdbID === id;
  })) {
    //Save data in sessionStrorage
    user.bookmarks.push(film[0]);
    sessionStorage.setItem('user', JSON.stringify(user)); //Save data in localStrorage

    allLocalStorage.push(user);
    localStorage.setItem('users', JSON.stringify(allLocalStorage));
  }
}; //Modal


var createModal = function createModal(e) {
  var modal = document.getElementById('modal');
  var id = e.target.getAttribute('data-modal');
  var film = arrFilmList.filter(function (e) {
    return e.imdbID === id;
  });
  modal.innerHTML = '';
  var div = document.createElement('div');
  div.classList.add('modal__item');
  div.innerHTML = "\n        <div class=\"modal__close\" id=\"modal-close\">+</div>\n        <div class=\"modal__img-container\">\n            <img class=\"modal__img\" src=\"".concat(film[0].Poster, "\" alt=\"").concat(film[0].Title, "\"/>\n        </div>\n        <div class=\"modal__info\">\n            <p class=\"modal_title\">").concat(film[0].Title, "</p>\n            <p class=\"modal_year\">").concat(film[0].Year, "</p>\n        </div>\n    </div>");
  modal.appendChild(div);
  modal.classList.add('modal--show');
}; //Close Modal


var modal = document.getElementById('modal');
modal.addEventListener('click', function (e) {
  if (e.target.getAttribute('id') === 'modal-close') {
    modal.classList.remove('modal--show');
  }
});
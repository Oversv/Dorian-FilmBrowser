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
        arrFilmList = data.Search; //console.log(arrFilmList)//////////////////////////

        data.Search.forEach(function (e) {
          var div = document.createElement('div');
          div.setAttribute('class', 'film-list__item');
          div.innerHTML += "\n                        <p class=\"film-list__item-type\">".concat(e.Type, "</p>\n                        <p class=\"film-list__item-title\">").concat(e.Title, "</p>\n                        <button data-id=\"").concat(e.imdbID, "\">ADD</button>\n                    ");
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
};
"use strict";

var form = document.getElementById('browser');
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
      var filmList = document.getElementById('filmList');
      filmList.innerHTML = '';

      if (data.Response === 'True') {
        data.Search.forEach(function (e) {
          var div = document.createElement('div');
          div.setAttribute('class', 'film-list__item');
          div.innerHTML += "\n                        <p class=\"film-list__item-type\">".concat(e.Type, "</p>\n                        <p class=\"film-list__item-title\">").concat(e.Title, "</p>\n                        <p>ADD</p>\n                    ");
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
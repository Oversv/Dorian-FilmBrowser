"use strict";

var form = document.getElementById('browser');
var filmList = document.getElementById('filmList');
var modal = document.getElementById('modal');
var arrFilmList = []; //This array saves the result of the browser

var pagination = document.getElementById('pagination');
/*** FUNCTIONS ***/
//Create the browser list, it receives a parameter with the fetch data

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
    createPagination(Number(data.totalResults), Number(user.actualPage));
  } else {
    var div = document.createElement('div');
    div.innerHTML += "\n            <p class=\"film-list__item--not-found\">".concat(data.Error, "</p>                  \n        ");
    fragment.appendChild(div);
    pagination.innerHTML = '';
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
}; //Pagination
//TODO Add first and last page 


var createPagination = function createPagination(results) {
  var actualPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var pages = Math.ceil(results / 10);
  var fragment = document.createDocumentFragment();
  pagination.innerHTML = '';

  if (pages !== 1) {
    var list = document.createElement('ul');
    list.setAttribute('class', 'pagination__list');

    if (pages <= 5) {
      for (var i = 1; i <= pages; i++) {
        var item = document.createElement('li');
        item.setAttribute('class', 'pagination__list-item');
        item.setAttribute('data-value', i);
        item.textContent = i;

        if (i === actualPage) {
          item.setAttribute('class', 'pagination__list-item--active');
        }

        list.appendChild(item);
      }

      fragment.appendChild(list);
      pagination.appendChild(fragment);
    } else {
      if (actualPage > 2 && actualPage <= pages - 2) {
        for (var _i = actualPage - 2; _i <= actualPage + 2; _i++) {
          var _item = document.createElement('li');

          _item.setAttribute('class', 'pagination__list-item');

          _item.setAttribute('data-value', _i);

          _item.textContent = _i;

          if (_i === actualPage) {
            _item.setAttribute('class', 'pagination__list-item--active');
          }

          list.appendChild(_item);
        }

        fragment.appendChild(list);
        pagination.appendChild(fragment);
      } else if (actualPage > pages - 2) {
        for (var _i2 = pages - 4; _i2 <= pages; _i2++) {
          var _item2 = document.createElement('li');

          _item2.setAttribute('class', 'pagination__list-item');

          _item2.setAttribute('data-value', _i2);

          _item2.textContent = _i2;

          if (_i2 === actualPage) {
            _item2.setAttribute('class', 'pagination__list-item--active');
          }

          list.appendChild(_item2);
        }

        fragment.appendChild(list);
        pagination.appendChild(fragment);
      } else {
        for (var _i3 = 1; _i3 <= 5; _i3++) {
          var _item3 = document.createElement('li');

          _item3.setAttribute('class', 'pagination__list-item');

          _item3.setAttribute('data-value', _i3);

          _item3.textContent = _i3;

          if (_i3 === actualPage) {
            _item3.setAttribute('class', 'pagination__list-item--active');
          }

          list.appendChild(_item3);
        }

        fragment.appendChild(list);
        pagination.appendChild(fragment);
      }
    }
  }
}; //Create modal


var createModal = function createModal(e) {
  var modal = document.getElementById('modal');
  var id = e.target.getAttribute('data-modal');
  var user = JSON.parse(sessionStorage.getItem('user'));
  var added = user.bookmarks.some(function (e) {
    return e.imdbID.includes(id);
  });
  var API_KEY = '72cf791f';
  fetch("https://www.omdbapi.com/?apikey=".concat(API_KEY, "&i=").concat(id)).then(function (res) {
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
/*** LISTENERS ***/


form.addEventListener('submit', function (e) {
  e.preventDefault();
  var film = document.getElementById('film').value.trim();
  var error = document.getElementById('error-browser');
  var API_KEY = '72cf791f';
  var user = JSON.parse(sessionStorage.getItem('user'));
  user.browserFilm = film;
  user.actualPage = 1;
  sessionStorage.setItem('user', JSON.stringify(user));

  if (film.length === 0) {
    error.textContent = "Write something :-)";
  } else {
    error.textContent = "";
    fetch("https://www.omdbapi.com/?apikey=".concat(API_KEY, "&s=").concat(film)).then(function (res) {
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
  var btnAdd = document.getElementById('add'); //Close modal 

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
});
pagination.addEventListener('click', function (e) {
  if (e.target.nodeName === 'LI') {
    var user = JSON.parse(sessionStorage.getItem('user'));
    var API_KEY = '72cf791f';
    var film = user.browserFilm;
    var page = e.target.getAttribute('data-value');
    user.actualPage = page;
    sessionStorage.setItem('user', JSON.stringify(user));
    fetch("https://www.omdbapi.com/?apikey=".concat(API_KEY, "&s=").concat(film, "&page=").concat(page)).then(function (res) {
      return res.ok ? Promise.resolve(res) : Promise.reject(res);
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      createBrowserList(data);
    })["catch"](function (err) {
      return console.log("Error in the request ".concat(err));
    });
  }
});
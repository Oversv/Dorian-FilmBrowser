"use strict";

var login = document.getElementById('login');
var user = {
  id: "",
  username: "",
  password: "",
  bookmarks: []
};
login.addEventListener('submit', function (e) {
  var username = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value.trim();

  if (username.length < 4 || password.length < 4) {
    e.preventDefault(); //-----Cambiar idioma y estos mensajes se tienen que mostrar por pantalla

    if (username.length < 4) {
      console.log("El usuario tiene que tener 4 caracteres o más");
    }

    if (password.length < 4) {
      console.log("La contraseña tiene que tener 4 caracteres o más");
    }
  } else {
    user.username = username;
    user.password = password;
    addUserLocalStorage(user);
    addUserSessionStorage(username, password);
    login.reset();
  }
}); //Id generator

var id = function id() {
  return Date.now() + Math.floor(Math.random() * 1000);
}; //Add an user to localstorage


var addUserLocalStorage = function addUserLocalStorage(user) {
  var data = JSON.parse(localStorage.getItem("users"));
  var userExist = checkUser(data, user);

  if (!userExist) {
    user.id = id();

    if (data === null) {
      data = [user];
    } else {
      data.push(user);
    }

    localStorage.setItem("users", JSON.stringify(data));
  }
};

var addUserSessionStorage = function addUserSessionStorage(username, password) {
  var userLocalStorage = JSON.parse(localStorage.getItem('users')).find(function (e) {
    return e.username === username && e.password === password;
  });
  sessionStorage.setItem('user', JSON.stringify(userLocalStorage));
}; //Return true if the user and password are equal to other user in the localstorage


var checkUser = function checkUser(storage, user) {
  var result = false;

  if (storage === null) {
    return result;
  } else {
    storage.forEach(function (e) {
      var username = JSON.stringify(e.username);
      var password = JSON.stringify(e.password);

      if (username === JSON.stringify(user.username) && password === JSON.stringify(user.password)) {
        result = true;
      }
    });
  }

  return result;
};
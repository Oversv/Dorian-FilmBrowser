"use strict";

var login = document.getElementById('login');
var user = {
  id: "",
  //----Revisar si hace falta
  username: "",
  password: "",
  //----Hacer el hash
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
    //Generar id aquí
    user.username = username;
    user.password = password;
    addUserLocalStorage(user);
    addUserSessionStorage(user);
    login.reset();
  }
}); //Add an user to localstorage

var addUserLocalStorage = function addUserLocalStorage(user) {
  var data = JSON.parse(localStorage.getItem("users"));
  var userExist = checkUser(data, user);

  if (!userExist) {
    if (data === null) {
      data = [user];
    } else {
      data.push(user);
    }

    localStorage.setItem("users", JSON.stringify(data));
  }
};

var addUserSessionStorage = function addUserSessionStorage(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
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
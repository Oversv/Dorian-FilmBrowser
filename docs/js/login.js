"use strict";

var login = document.getElementById('login');
var user = {
  id: "",
  username: "",
  password: "",
  bookmarks: []
};
/*** FUNCTIONS ***/
//Id generator

var id = function id() {
  return Date.now() + Math.floor(Math.random() * 1000);
}; //Add an user to localStorage


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
}; //Return true if the user and password are equal to another user in the localstorage


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
/*** LISTENERS ***/


login.addEventListener('submit', function (e) {
  var username = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value.trim();
  var error = document.getElementById('error-login');

  if (username.length < 4 || password.length < 4) {
    e.preventDefault();

    if (username.length < 4) {
      error.textContent = "Username is too short";
    }

    if (password.length < 4) {
      error.textContent = " Password is too short";
    }

    if (username.length < 4 && password.length < 4) {
      error.textContent = "Username and password are too short";
    }
  } else {
    user.username = username;
    user.password = password;
    addUserLocalStorage(user);
    addUserSessionStorage(username, password);
    login.reset();
  }
});
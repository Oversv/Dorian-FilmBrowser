"use strict";

/** Info Header **/
var welcome = document.getElementById('welcome');
var user = JSON.parse(sessionStorage.getItem('user'));

if (user === undefined || user === null) {
  sessionStorage.clear();
  window.location.href = "./index.html";
} else {
  welcome.textContent = "Welcome ".concat(user.username);
}
/** Logout **/


var logoutBtn = document.getElementById('btn-logout');
logoutBtn.addEventListener('click', function () {
  sessionStorage.clear();
  window.location.href = "./index.html";
});
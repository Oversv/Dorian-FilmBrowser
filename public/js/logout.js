"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

/** Info Header **/
var welcome = document.getElementById('welcome');
var user = JSON.parse(sessionStorage.getItem('user'));
if (user === undefined) user = (_readOnlyError("user"), 'stranger');
welcome.textContent = "Welcome ".concat(user.username);
/** Logout **/

var logoutBtn = document.getElementById('btn-logout');
logoutBtn.addEventListener('click', function () {
  sessionStorage.clear();
  window.location.href = "./index.html";
});
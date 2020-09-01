"use strict";

/** Logout **/
var logoutBtn = document.getElementById('btn-logout');
logoutBtn.addEventListener('click', function () {
  sessionStorage.clear();
  window.location.href = "./index.html";
});
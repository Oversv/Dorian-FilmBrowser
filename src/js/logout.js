/** Logout **/
const logoutBtn = document.getElementById('btn-logout')

logoutBtn.addEventListener('click', ()=>{

    sessionStorage.clear();
    window.location.href = "./index.html"
})
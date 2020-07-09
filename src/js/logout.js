/** Info Header **/
const welcome = document.getElementById('welcome')

const user = JSON.parse(sessionStorage.getItem('user'))
if(user === undefined) user = 'stranger'

welcome.textContent = `Welcome ${user.username}`


/** Logout **/
const logoutBtn = document.getElementById('btn-logout')

logoutBtn.addEventListener('click', ()=>{

    sessionStorage.clear();
    window.location.href = "./index.html"
})
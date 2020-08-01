/** Info Header **/
const welcome = document.getElementById('welcome')

const user = JSON.parse(sessionStorage.getItem('user'))
if(user === undefined || user === null){
    sessionStorage.clear();
    window.location.href = "./index.html"
}
else{
    welcome.textContent = `Welcome ${user.username}`
}

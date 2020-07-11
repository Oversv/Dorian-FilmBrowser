const form = document.getElementById('browser')
const filmList = document.getElementById('filmList')

let arrFilmList = [] //This array keeps the search data

form.addEventListener('submit', (e)=>{
    e.preventDefault()
    
    const film = document.getElementById('film').value.trim()
    
    if(film.length === 0){
        //------Mensaje de error
        console.log("Rellena el campo")
    }else{
        fetch(`http://www.omdbapi.com/?apikey=72cf791f&s=${film}`)
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))//Sin esta línea, se entraría siempre en el data, auque le peteción sea incorrecta
        .then(res => res.json())
        .then(data => {

            const fragment = document.createDocumentFragment()
            
            filmList.innerHTML= ''
         
            if(data.Response === 'True'){               
                arrFilmList = data.Search
                //console.log(arrFilmList)//////////////////////////
                data.Search.forEach(e => {
                    const div = document.createElement('div')
                    div.setAttribute('class', 'film-list__item')
                    
                    div.innerHTML+=`
                        <p class="film-list__item-type">${e.Type}</p>
                        <p class="film-list__item-title">${e.Title}</p>
                        <button data-id="${e.imdbID}">ADD</button>
                    `
    
                    fragment.appendChild(div)                   
                })
                
            }else{
               
                const div = document.createElement('div')
                div.innerHTML+=`
                    <p class="film-list__item--not-found">${data.Error}</p>                     
                `
                //--------------Falta crear la clase para el div Error
                fragment.appendChild(div)
            }
            filmList.appendChild(fragment)

        })
        .catch(err => console.log(`Error en la petición ${err}`)) 
        form.reset()
        //------Revisar el tema del placeholder, no me convence mucho
    }
})

filmList.addEventListener('click', e =>{
   if(e.target.tagName === 'BUTTON'){
       const id = e.target.getAttribute("data-id")
       addBookmark(id)
   }
})

const addBookmark = (id) =>{
   
    const film = arrFilmList.filter(e => e.imdbID === id)  //Get the film of the array
    const user = JSON.parse(sessionStorage.getItem('user'))  //Get the user of sessionStorage
    const allLocalStorage = JSON.parse(localStorage.users).filter(e => e.id !== user.id);  

    if(!user.bookmarks.some(e => e.imdbID === id)){
    
        //Save data in sessionStrorage
        user.bookmarks.push(film[0])    
        sessionStorage.setItem('user', JSON.stringify(user))

        //Save data in localStrorage
        allLocalStorage.push(user)
        localStorage.setItem('users', JSON.stringify(allLocalStorage))
    }
}
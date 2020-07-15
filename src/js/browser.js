const form = document.getElementById('browser')
const filmList = document.getElementById('filmList')
let arrFilmList = [] //This array keeps the result of the browser

form.addEventListener('submit', (e)=>{
    e.preventDefault()
    
    const film = document.getElementById('film').value.trim()
    const user = JSON.parse(sessionStorage.getItem('user'))
    const error = document.getElementById('error-browser')
    let added = false
    
    if(film.length === 0){
        error.textContent = "Write something :-)"
    }else{
        error.textContent = ""
        
        fetch(`http://www.omdbapi.com/?apikey=72cf791f&s=${film}`)
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))//Sin esta línea, se entraría siempre en el data, auque le peteción sea incorrecta
        .then(res => res.json())
        .then(data => {

            const fragment = document.createDocumentFragment()
            
            filmList.innerHTML= ''
         
            if(data.Response === 'True'){               
                arrFilmList = data.Search
              
                data.Search.forEach(e => {
                    const div = document.createElement('div')
                    div.setAttribute('class', 'film-list__item')
                    added = user.bookmarks.some(ele =>ele.imdbID.includes(e.imdbID))
                    
                    div.innerHTML+=`                       
                        <p class="film-list__title" data-modal="${e.imdbID}">${e.Title}</p>
                        <button class="film-list__add-bookmark btn--small ${(added) ? 'added': ""}" onclick="addBookmark('${e.imdbID}')">${(added)? 'ADDED':'ADD'}</button>
                    `    
                    fragment.appendChild(div)                   
                })
                
            }else{
               
                const div = document.createElement('div')
                div.innerHTML+=`
                    <p class="film-list__item--not-found">${data.Error}</p>                  
                `                
                fragment.appendChild(div)
            }
            filmList.appendChild(fragment)
        })
        .catch(err => console.log(`Error en la petición ${err}`)) 
        form.reset()       
    }
})

filmList.addEventListener('click', e =>{

   if(e.target.getAttribute("data-modal")){      
       createModal(e)
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

//Modal
const createModal = (e) =>{
    const modal = document.getElementById('modal')
    const id = e.target.getAttribute('data-modal')
    const film = arrFilmList.filter(e => e.imdbID === id)    
    const added = user.bookmarks.some(ele =>ele.imdbID.includes(id))

    modal.innerHTML = ''

    const div = document.createElement('div')
    div.classList.add('modal__item')
    
    div.innerHTML = `
        <div class="modal__close" id="modal-close">+</div>
        <div class="modal__img-container">
            <img class="modal__img" src="${film[0].Poster}" alt="${film[0].Title}" onerror="this.src='./images/not-found.png';"/>
        </div>
        <div class="modal__info">
            <p class="modal__paragraph">${film[0].Title}</p>
            <p class="modal__paragraph">Type: ${film[0].Type}</p>
            <p class="modal__paragraph">Year: ${film[0].Year}</p>
            <button id="add" class="film-list__add-bookmark btn--small ${(added) ? 'added': ''}" onclick="addBookmark('${film[0].imdbID}')">${(added) ? 'ADDED': 'ADD'}</button>
        </div>
    </div>`

    modal.appendChild(div)
    modal.classList.add('modal--show')
}

const modal = document.getElementById('modal')

modal.addEventListener('click', e =>{
    const btnAdd = document.getElementById('add')

    if(e.target.getAttribute('id') === 'modal-close'){
        modal.classList.remove('modal--show')
    }
    if(e.target.getAttribute('id') === 'add'){
        btnAdd.classList.add('added')
        console.log(btnAdd)
        btnAdd.textContent = 'ADDED'
    }
})
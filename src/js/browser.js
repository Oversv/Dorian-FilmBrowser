const form = document.getElementById('browser')
const filmList = document.getElementById('filmList')
const modal = document.getElementById('modal')
let arrFilmList = [] //This array saves the result of the browser
const pagination = document.getElementById('pagination')

/*** FUNCTIONS ***/
//Create the browser list, it receives a parameter with the fetch data
const createBrowserList = data =>{
    const user = JSON.parse(sessionStorage.getItem('user'))
    const fragment = document.createDocumentFragment()
    let added = false
            
    filmList.innerHTML= ''
 
    if(data.Response === 'True'){               
        arrFilmList = data.Search
      
        data.Search.forEach(e => {
            const div = document.createElement('div')
            div.setAttribute('class', 'film-list__item')
            added = user.bookmarks.some(ele =>ele.imdbID.includes(e.imdbID))
            
            div.innerHTML+=`
                <img src="${e.Poster}" class="film-list__img" onerror="this.src='./images/not-found.png';"/>                       
                <p class="film-list__title" data-modal="${e.imdbID}">${e.Title}</p>
                <button 
                    class="film-list__add-bookmark btn--small ${(added) ? 'added': ""}" data-add="on" 
                    data-id="${e.imdbID}" 
                    onclick="addBookmark('${e.imdbID}')"
                    >${(added)? 'ADDED':'ADD'}</button>           
            `    
            fragment.appendChild(div)                   
        })    
        createPagination(Number(data.totalResults), Number(user.actualPage))
        
    }else{
       
        const div = document.createElement('div')
        div.innerHTML+=`
            <p class="film-list__item--not-found">${data.Error}</p>                  
        `                
        fragment.appendChild(div)
        pagination.innerHTML=''
    }
    filmList.appendChild(fragment)
}

//Add a film to bookmarks
const addBookmark = id =>{
  
    const film = arrFilmList.filter(e => e.imdbID === id)  //Get the film from the array
    const user = JSON.parse(sessionStorage.getItem('user'))  //Get the user from the sessionStorage
    const allLocalStorage = JSON.parse(localStorage.users).filter(e => e.id !== user.id);  
    
    //Check if the film is not in the user's bookmarks
    if(!user.bookmarks.some(e => e.imdbID === id)){
    
        //Save data in sessionStorage
        user.bookmarks.push(film[0])    
        sessionStorage.setItem('user', JSON.stringify(user))

        //Save data in localStorage
        allLocalStorage.push(user)
        localStorage.setItem('users', JSON.stringify(allLocalStorage))
    }    
}

//Pagination
//TODO Add first and last page 
const createPagination = (results, actualPage = 1) =>{
    
    const pages = Math.ceil(results / 10)
    const fragment = document.createDocumentFragment()
    pagination.innerHTML=''

    if(pages !== 1){

        const list = document.createElement('ul')
        list.setAttribute('class', 'pagination__list')

        if(pages <= 5){
         
            for(let i = 1; i <= pages; i ++){
                 
                const item = document.createElement('li')
                item.setAttribute('class', 'pagination__list-item')
                item.setAttribute('data-value', i)
                item.textContent = i
                
                if(i === actualPage){
                    item.setAttribute('class', 'pagination__list-item--active')
                }

                list.appendChild(item)
            }
        
            fragment.appendChild(list)
            pagination.appendChild(fragment)

        }else{

            if(actualPage > 2 && actualPage <= pages -2){
    
                for(let i = actualPage -2; i <= actualPage + 2; i ++){
                     
                    const item = document.createElement('li')
                    item.setAttribute('class', 'pagination__list-item')
                    item.setAttribute('data-value', i)
                    item.textContent = i
                    
                    if(i === actualPage){
                        item.setAttribute('class', 'pagination__list-item--active')
                    }

                    list.appendChild(item)
                }
            
                fragment.appendChild(list)
                pagination.appendChild(fragment)

            }else if(actualPage > pages -2){
    
                for(let i = pages -4; i <= pages; i ++){
                     
                    const item = document.createElement('li')
                    item.setAttribute('class', 'pagination__list-item')
                    item.setAttribute('data-value', i)
                    item.textContent = i
                    
                    if(i === actualPage){
                        item.setAttribute('class', 'pagination__list-item--active')
                    }

                    list.appendChild(item)
                }
            
                fragment.appendChild(list)
                pagination.appendChild(fragment)
            
            }else{
    
                for(let i = 1; i <= 5; i ++){
                     
                    const item = document.createElement('li')
                    item.setAttribute('class', 'pagination__list-item')
                    item.setAttribute('data-value', i)
                    item.textContent = i

                    if(i === actualPage){
                        item.setAttribute('class', 'pagination__list-item--active')
                    }

                    list.appendChild(item)
                }
            
                fragment.appendChild(list)
                pagination.appendChild(fragment)
            }
        }
    }    
}

//Create modal
const createModal = e =>{
    const modal = document.getElementById('modal')
    const id = e.target.getAttribute('data-modal')
    const user = JSON.parse(sessionStorage.getItem('user'))  
    const added = user.bookmarks.some(e =>e.imdbID.includes(id))
    const API_KEY = '72cf791f'

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(data => {
        
        modal.innerHTML = ''

        const div = document.createElement('div')
        div.classList.add('modal__item')
        
        div.innerHTML = `
            <div class="modal__close" id="modal-close">+</div>
            <div class="modal__container-top">
                <div class="modal__img-container">
                    <img 
                    class="modal__img" 
                    src="${data.Poster}" 
                    alt="${data.Title}" 
                    onerror="this.src='./images/not-found.png';"/>
                </div>
                <div class="modal__info">
                    <p class="modal__title">${data.Title}</p>
                    <p>Type: ${data.Type}</p>
                    <p>Genre: ${data.Genre}</p>
                    <p>Year: ${data.Year}</p>
                    <p>Duration: ${data.Runtime}</p>
                    <p class="modal__rating">Rating: ${data.imdbRating}</p>                   
                </div>
            </div>
            <div class="modal__details">
                <p>Director: ${data.Director}</p>
                <p>Actors: ${data.Actors}</p>
                <p>Synopsis: ${data.Plot}</p>                
            </div>
            <div class="modal__btn">
                <button id="add" 
                    class="btn--small ${(added) ? 'added': ''}" 
                    data-add="on" 
                    data-id="${data.imdbID}" 
                    onclick="addBookmark('${data.imdbID}')"
                    >${(added) ? 'ADDED': 'ADD'}
                </button>
            </div>
        </div>`
    
        modal.appendChild(div)
        modal.classList.add('modal--show')
    })
    .catch(err => console.log(`Error in the request ${err}`)) 
}

/*** LISTENERS ***/
form.addEventListener('submit', (e)=>{
    e.preventDefault()
    
    const film = document.getElementById('film').value.trim()    
    const error = document.getElementById('error-browser')
    const API_KEY = '72cf791f'    
    const user = JSON.parse(sessionStorage.getItem('user'))

    user.browserFilm = film 
    user.actualPage = 1   
    sessionStorage.setItem('user', JSON.stringify(user))

    if(film.length === 0){
        error.textContent = "Write something :-)"
    }else{
        error.textContent = ""
        
        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${film}`)
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(data => {
            createBrowserList(data);            
        })
        .catch(err => console.log(`Error in the request ${err}`)) 
        form.reset()       
    }
})

filmList.addEventListener('click', e =>{

    //Update the btns [It is probably better in the addBookmark function]
    if(e.target.getAttribute("data-add") === 'on'){      
        e.target.classList.add('added')        
        e.target.textContent = 'ADDED'
    }

    //Create the modal
    if(e.target.getAttribute("data-modal")){      
        createModal(e)
    }
})

modal.addEventListener('click', e =>{
    const btnAdd = document.getElementById('add')

    //Close modal 
    if(e.target.getAttribute('id') === 'modal-close'){
        modal.classList.remove('modal--show')
    }
    //Update btns 
    if(e.target.getAttribute('data-add') === 'on'){
        //Update btn of modal
        btnAdd.classList.add('added')        
        btnAdd.textContent = 'ADDED'     

        //Update btn of browser list
        const id = e.target.getAttribute('data-id')        
        let btnBrowserList = Array.from(document.querySelectorAll(`[data-id]`))

        btnBrowserList=btnBrowserList.filter(e => e.getAttribute('data-id') === id)
        btnBrowserList[0].textContent = 'ADDED'
        btnBrowserList[0].classList.add('added')
    }
})

pagination.addEventListener('click', e =>{ 

    if(e.target.nodeName === 'LI'){
        const user = JSON.parse(sessionStorage.getItem('user'))
        const API_KEY = '72cf791f'
        const film = user.browserFilm        
        const page = e.target.getAttribute('data-value')

        user.actualPage = page
        sessionStorage.setItem('user', JSON.stringify(user))

        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${film}&page=${page}`)
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(data => {
            createBrowserList(data);            
        })
        .catch(err => console.log(`Error in the request ${err}`)) 
    }    
})

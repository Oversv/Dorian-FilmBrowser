window.addEventListener('load', () =>{
    showFilms()    
})

const showFilms = () =>{
    const user = JSON.parse(sessionStorage.getItem('user'))
    const bookmarksContainer = document.getElementById('bookmarks')
    const fragment = document.createDocumentFragment()
    
    bookmarksContainer.innerHTML = ''

    user.bookmarks.sort((a, b) => (a.Title > b.Title) ? 1 : -1).forEach(e => {
        const div = document.createElement('div')
        div.innerHTML+=`
            <div>
                <img src="${e.Poster}" alt="${e.Title}">
            </div>
            <div>
                <p>${e.Title}<p/>
                <p>Year: ${e.Year}<p/>
                <p>Type: ${e.Type}<p/>
            </div>
            <div>
                <button onclick="deleteBookmark('${e.imdbID}')">Delete</button>
            </div>
        `

        fragment.appendChild(div)
    });

    bookmarksContainer.appendChild(fragment)
}

const deleteBookmark = id =>{
     //Update sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'))   
    user.bookmarks = user.bookmarks.filter(e => e.imdbID !== id) 
    sessionStorage.setItem('user', JSON.stringify(user))

    //Update socalStorage
    const allLocalStorage = JSON.parse(localStorage.users).filter(e => e.id !== user.id);
    allLocalStorage.push(user)
    localStorage.setItem('users', JSON.stringify(allLocalStorage))
   
    showFilms()      
}
window.addEventListener('load', () =>{
    showFilms()    
})

const showFilms = () =>{
    const user = JSON.parse(sessionStorage.getItem('user'))
    const bookmarksContainer = document.getElementById('bookmarks')
    const fragment = document.createDocumentFragment()
    
    //Info bookmarks
    const totalBookmarks = document.getElementById('total-bookmarks')
    const totalMovies = document.getElementById('total-movies')
    const totalSeries = document.getElementById('total-series')
    const totalEpisodes = document.getElementById('total-episodes')

    totalBookmarks.textContent = ` Bookmarks ${user.bookmarks.length}:`
    totalMovies.textContent = ` Movies ${user.bookmarks.filter(e => e.Type === 'movie').length}`
    totalSeries.textContent = ` Series ${user.bookmarks.filter(e => e.Type === 'series').length}`
    totalEpisodes.textContent = ` Episodes ${user.bookmarks.filter(e => e.Type === 'episode').length}`

    bookmarksContainer.innerHTML = ''

    user.bookmarks.sort((a, b) => (a.Title > b.Title) ? 1 : -1).forEach(e => {
        const div = document.createElement('div')
        div.classList.add('bookmarks__item')
        
        div.innerHTML+=`
            <div class="bookmarks__img-container">
                <img class="bookmarks__img" 
                    src="${e.Poster}" 
                    alt="${e.Title}" 
                    onerror="this.src='./images/not-found.png';">
            </div>
            <div class="bookmarks__info">
                <p>${e.Title}<p/>
                <p>Year: ${e.Year}<p/>
                <p>Type: ${e.Type}<p/>
            </div>
            <div>
                <button class="btn--small" onclick="deleteBookmark('${e.imdbID}')">Delete</button>
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

    //Update localStorage
    const allLocalStorage = JSON.parse(localStorage.users).filter(e => e.id !== user.id);
    allLocalStorage.push(user)
    localStorage.setItem('users', JSON.stringify(allLocalStorage))
   
    showFilms()      
}
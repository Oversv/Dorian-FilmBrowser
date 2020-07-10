const form = document.getElementById('browser')

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
            const filmList = document.getElementById('filmList')
            filmList.innerHTML= ''
           
            if(data.Response === 'True'){               

                data.Search.forEach(e => {
                    const div = document.createElement('div')
                    div.setAttribute('class', 'film-list__item')
                    
                    div.innerHTML+=`
                        <p class="film-list__item-type">${e.Type}</p>
                        <p class="film-list__item-title">${e.Title}</p>
                        <p>ADD</p>
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
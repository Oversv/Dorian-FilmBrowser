const login = document.getElementById('login')

const user = {
    id: "",
    username: "",
    password: "",
    bookmarks: []
}

login.addEventListener('submit', e =>{

    const username = document.getElementById('username').value.trim()
    const password = document.getElementById('password').value.trim()
    const error = document.getElementById('error-login')  

    if(username.length < 4 || password.length < 4){
        e.preventDefault()
       
        if(username.length < 4){
            error.textContent = "Username is too short"
        }
        if(password.length < 4){
            error.textContent = " Password is too short"
        }
        if(username.length < 4 && password.length < 4){
            error.textContent = "Username and password are too short"
        }         
        
    }else{               
        user.username = username
        user.password = password  
       
        addUserLocalStorage(user)
        addUserSessionStorage(username, password)
     
        login.reset()
    }    
})

//Id generator
const id = () =>{
    return Date.now()+(Math.floor(Math.random()*1000))
}

//Add an user to localstorage
const addUserLocalStorage = user =>{
    
    let data = JSON.parse(localStorage.getItem("users"))   

    let userExist = checkUser(data, user)
    
    if(!userExist){     
        user.id = id()  

        if(data === null){
            data = [user]               
        }else{
            data.push(user)
        } 
    
        localStorage.setItem("users", JSON.stringify(data))        
    }      
}

const addUserSessionStorage = (username, password)=>{       

    let userLocalStorage = JSON.parse(localStorage.getItem('users')).find(e => {
        return e.username === username && e.password === password
     })

    sessionStorage.setItem('user', JSON.stringify(userLocalStorage) )
}

//Return true if the user and password are equal to other user in the localstorage
const checkUser = (storage, user) => {   
    let result = false

    if(storage === null){
        return result
    }else{
        storage.forEach(e =>{
            const username = JSON.stringify(e.username)
            const password = JSON.stringify(e.password)  
    
            if(username === JSON.stringify(user.username) && password === JSON.stringify(user.password)){     
                result = true
            }
        })
    }
    return result
}
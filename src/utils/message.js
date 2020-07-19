const genrateMessage = (username,text)=>{
    return {
        username,
        text,
        createdAt: new Date()
    }
}
const genrateLocationMessage = (username,url)=>{
    return {
        username,
        url,
        createdAt: new Date()
    }
}


module.exports ={genrateMessage, genrateLocationMessage}
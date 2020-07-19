const users = [];

const addUser = ({id,username,room})=>{
    // clean data
     username = username.trim().toLowerCase();
     room = room.trim().toLowerCase();
     //required fild
     if(!username || !room) return {error: 'username and room is required'}
     
     
     // validation of user
     const userExist = users.find((user)=> user.room===room && user.username==username);
     const user = {id,username,room};
     
     if(!userExist){
         users.push(user);
         return {user};
        }
    return {error: 'user is exists!!'}

}



const removeUser =(id)=>{
    const index = users.findIndex(user => user.id ===id);
    if(index!==-1){
     return users.splice(index,1)[0];
     
    }
    return {error:'user is not exits'}
}

const getUser = (id)=>{
    const user = users.find((user)=> user.id===id);
    return user;
}
const getUsersInRoom = (room)=>{
    // room = room.trim().toLowerCase();
    const userInRoom = users.filter(user=> user.room==room);
    return userInRoom
}
module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
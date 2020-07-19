const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormButton = document.querySelector('button');
const $messageFormInput = document.querySelector('input');
const $userLocationButton = document.querySelector('#user-location')
 
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $messageLocationTemplate = document.querySelector('#location-message-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
const $messages = document.querySelector('#messages');

const audio= new Audio('/audio/notify.mp3');

const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoScroll =()=>{
     // new message elements
     const $newMessage = $messages.lastElementChild;
     console.log($newMessage)
     // new message height
     const $newMessageStyle = getComputedStyle($newMessage);
     const $newMessageMargin = parseInt($newMessageStyle.marginBottom);
     const $newMessageHeight = $newMessage.offsetHeight + $newMessageMargin;
     // visialbe height
     const visialbeHeight = $messages.offsetHeight;

     // Height of message container
     const containerHeight = $messages.scrollHeight;

     // how far far i scrolled
     const scrolled = $messages.scrollTop + visialbeHeight;
     console.log(scrolled);
     if(containerHeight-$newMessageHeight<=scrolled){
         $messages.scrollIntoView= $messages.scrollHeight;
     }
}

socket.on('message',(message)=>{
    audio.play();
    console.log(message);
    const html = Mustache.render($messageTemplate,{
        pos:'float:left;clear:both',
        username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html);
    // document.getElementById('msg').setAttribute("style",'float:left; clear:both')
    autoScroll();
})
socket.on('locationMessage',(url)=>{
    console.log(url);
    const html = Mustache.render($messageLocationTemplate,{
            pos:'float:left;clear:both',
            username: url.username,
            url:url.url,
             createdAt:moment(url.createdAt).format('h:mm a')
            });
    $messages.insertAdjacentHTML('beforeend',html);
    audio.play();
    autoScroll();
    
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg = $messageFormInput.value;
    $messageFormButton.setAttribute('disabled','disabled');
    const html = Mustache.render($messageTemplate,{
        pos:'float:right;clear:both',
        username:'You',
        message:msg,
        createdAt: moment(new Date()).format('h:mm a')
    })
    console.log();
    $messages.insertAdjacentHTML('beforeend',html);
    
    autoScroll(); 
    
    socket.emit('sendMessage',msg,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value="";
        $messageFormInput.focus();
        if(error){
            return console.log("message not sent")
        }
        console.log("message dilevered!")
    });
})


$userLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('your browser does not support geolocation');
    }
    $userLocationButton.setAttribute('disabled','disabled')
 
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',
        { latitude: position.coords.latitude,
            longitude: position.coords.longitude

        },()=>{
            console.log("location shared!!!")
            $userLocationButton.removeAttribute('disabled')
        });
        
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href="/"
    }

})

socket.on('roomUsers',({room,users})=>{
    console.log(room,users)

    const html = Mustache.render($sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html;

})
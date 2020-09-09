const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');



//get user name from url roomname
const {username,room}= Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
const socket=io();

//join chatroom with particular room
socket.emit('joinRoom',{username, room});

//get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message',message=>{
    console.log(message);
    outputMessage(message);
    //for scoll down
    chatMessages.scrollTop=chatMessages.scrollHeight;

});

chatForm.addEventListener('submit',e=>{
    e.preventDefault();
    let msg=e.target.elements.msg.value;
    msg=msg.trim();
    if(!msg){
        return false;
    }
    socket.emit('chatMessage',msg);

    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

});

//output message to Dom
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');

    div.innerHTML=`<div class="message">
						<p class="meta">${message.username} <span>${message.time} </span></p>
						<p class="text">
                        ${message.text}
						</p>
                    </div>`;

   
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to dom
function outputRoomName(room){
roomName.innerText=room;
}
//add user to Dom
function outputUsers(users){
    userList.innerHTML = '';
    users.forEach(user=>{
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
}
var flag=0;
const socket = io();
window.onload = function(){
const chatMessages = document.getElementById('chat');
const userList = document.getElementById('liveUsers');
const Counter= document.getElementById('count');
const toggle= document.getElementById('toggle');
const msend= document.getElementById('sendgrp');
const send=document.getElementById('sendbtn');
userList.style.display = "none";
toggle.onclick=function(){
  if(flag==0){
    flag=1;
    console.log("0");
  userList.style.display="inherit";
  msend.style.display = "none";
  chatMessages.style.display = "none";
}
else{
  flag=0;
  console.log("1");
  chatMessages.style.display="inherit";
  msend.style.display="inherit";
  userList.style.display = "none";
}
};

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
/*chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  console.log("send clicked");
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg){
    return false;
  }
  send.onclick=function(){
    var
  };

  // Emit message to server
  socket.emit('chatMessage', msg);
  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});*/
send.onclick=function(){
  var msg=$('#Mssg').val();
  console.log(msg);
  msg = msg.trim();
  if(msg){
    socket.emit('chatMessage', {msg,uid,pic});
    console.log("emmited");
  }
  console.log("done");
  $('#Mssg').val('');
};

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  if(message.uid==uid){
    div.innerHTML=`<div class="d-flex justify-content-end mb-4">
    <div class="msg_cotainer_send">
    ${message.text}
      <span class="msg_time_send">${message.username} ${message.time}</span>
    </div>
    <div class="img_cont_msg">
      <img src="${message.pic}" class="rounded-circle user_img_msg">
    </div>
  </div>`;
  }
  else{
  div.innerHTML=`<div class="d-flex justify-content-start mb-4">
  <div class="img_cont_msg">
    <img src="${message.pic}" class="rounded-circle user_img_msg">
  </div>
  <div class="msg_cotainer">
    ${message.text}
    <span class="msg_time_send">${message.username} ${message.time}</span>
  </div>
</div>`;
  }
  chatMessages.appendChild(div);
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  var count=0;
  users.forEach(user=>{
    count+=1;
    userList.innerHTML +=`<div><div class="d-flex justify-content-start mb-4">
    <div class="msg_cotainer_send">
    ${user.username}
    </div></div>`;
  });
  Counter.innerHTML=count+" Live";
 }
}

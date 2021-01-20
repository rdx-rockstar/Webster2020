var flag=0;
var datachannal;
const socket = io();
window.onload = function(){
const schatMessages = document.getElementById('schat');
const ichatMessages = document.getElementById('ichat');
const userList = document.getElementById('liveUsers');
const Counter= document.getElementById('count');
const user_view= document.getElementById('toggle');
const socket_chat= document.getElementById('socket_chat');
const ice_chat= document.getElementById('ice_chat');
const send=document.getElementById('sendbtn');
const smsend= document.getElementById('sendgrp');
const btnPlayPause = document.getElementById('btnPlayPause');
const btnMute      = document.getElementById('btnMute');
const volumeBar    = document.getElementById('volume-bar');
const btnFullScreen=document.getElementById('btnFullScreen');
var isplaying=1;
// ice_chat.style.display = "none";
userList.style.display = "none";
ichatMessages.style.display="none";
user_view.onclick=function(){
    console.log("0");
  userList.style.display="initial";
  schatMessages.style.display = "none";
  smsend.style.display = "none";
  ichatMessages.style.display = "none";
}
socket_chat.onclick=function(){
  console.log("1");
  schatMessages.style.display="initial";
  smsend.style.display = "initial";
  ichatMessages.style.display = "none";
  userList.style.display = "none";
}
ice_chat.onclick=function(){
  console.log("1");
  schatMessages.style.display="none";
  smsend.style.display = "none";
  ichatMessages.style.display = "initial";
  userList.style.display = "none";
}

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

  schatMessages.scrollTop = schatMessages.scrollHeight;
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
  schatMessages.appendChild(div);
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
 ////////video
let peerConnection;
const config = { 
  iceServers: [
      { 
        "urls": "stun:stun.l.google.com:19302",
      },
      // { 
      //   "urls": "turn:TURN_IP?transport=tcp",
      //   "username": "TURN_USERNAME",
      //   "credential": "TURN_CREDENTIALS"
      // }
  ]
};

const video = document.getElementById("v&a");
const videoElem = document.getElementById("screen");
var embed_vid_pos=0;
video.addEventListener("click", function(evt) {
  if(embed_vid_pos==0){
    video.style.left="1%";
    video.style.top="4%";
    embed_vid_pos=1;
  }
  else{
    video.style.left="75%";
    video.style.top="60%";
    embed_vid_pos=0;
  }
});
///
socket.emit("watcher",room);
console.log("watcher came on "+room);
//
socket.on("offer", (id, description) => {
  peerConnection = new RTCPeerConnection(config);
  peerConnection.ondatachannel = receiveChannelCallback;
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("answer", id, peerConnection.localDescription);
    });

    let cnt=1;
  peerConnection.ontrack = event => {
    console.log(".");
      console.log(event);
      
    if(cnt<2){
      cnt+=1;
      console.log("1");
    videoElem.srcObject=event.streams[0];}
    else{
      console.log("2");
      cnt+=1;
      video.srcObject = event.streams[0];}
  };
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };
  console.log("offer came and answer sent");
});
video.muted = false;
function receiveChannelCallback(event) {
  receiveChannel = event.channel;
  receiveChannel.onmessage = handleReceiveMessage;
  receiveChannel.onopen = handleReceiveChannelStatusChange;
  receiveChannel.onclose = handleReceiveChannelStatusChange;
}
function handleReceiveMessage(event) {
  const div = document.createElement('div');
  div.innerHTML=`<div class="d-flex justify-content-start mb-4">
  <div class="msg_cotainer">
  ${event.data}
  </div>
</div>`;
ichatMessages.appendChild(div);
}

function handleReceiveChannelStatusChange(event) {
  if (receiveChannel) {
    console.log("Receive channel's status has changed to " +
                receiveChannel.readyState);
  }
}
socket.on("candidate", (id, candidate) => {
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

socket.on("broadcaster", () => {
  console.log("broadcaster came");
  socket.emit("watcher",room);
});

socket.on("disconnectPeer", () => {
  peerConnection.close();
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
};

function changeButtonType(btn, value) {
  btn.title     = value;
  // btn.innerHTML = value;
  btn.className = value +" b2";
}
// Update the video volume
volumeBar.addEventListener("change", function(evt) {
  console.log("volume bar clicked");
  video.volume = evt.target.value;
});
btnMute.onclick= function() {
  console.log("volume clicked");
  if (video.muted) {
    // Change the button to a mute button
    changeButtonType(btnMute, 'mute');
    video.muted = false;
  }
  else {
    // Change the button to an unmute button
    changeButtonType(btnMute, 'unmute');
    video.muted = true;
  }
}
changeButtonType(btnPlayPause, 'pause');
btnPlayPause.onclick= function() {
  if (isplaying==0) {
    changeButtonType(btnPlayPause, 'pause');
    video.play();
    videoElem.play();
    isplaying=1
  }
  else {
    isplaying=0;
    changeButtonType(btnPlayPause, 'play');
    video.pause();
    videoElem.pause();
  }
}
function exitFullScreen() {
  if (document.exitFullscreen) {
      document.exitFullscreen();
  } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
  }
}

function toggleFullScreen() {
  if (videoElem.requestFullscreen)
      if (document.fullScreenElement) {
          document.cancelFullScreen();
      } else {
          videoElem.requestFullscreen();
      }
      else if (videoElem.msRequestFullscreen)
      if (document.msFullscreenElement) {
          document.msExitFullscreen();
      } else {
        videoElem.msRequestFullscreen();
      }
      else if (videoElem.mozRequestFullScreen)
      if (document.mozFullScreenElement) {
          document.mozCancelFullScreen();
      } else {
        videoElem.mozRequestFullScreen();
      }
      else if (video.webkitRequestFullscreen)
      if (document.webkitFullscreenElement) {
          document.webkitCancelFullScreen();
      } else {
        videoElem.webkitRequestFullscreen();
      }
  else {
      alert("Fullscreen API is not supported");
      
  }
}
}
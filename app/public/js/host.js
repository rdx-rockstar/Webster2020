var flag=0;
var ison=0;
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
console.log("--"+room+"--");
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
 //////////video
 const peerConnections = {};
const config = {
  iceServers: [
    { 
      "urls": "stun:stun.l.google.com:19302",
    },
  ]
};

socket.on("answer", (id, description) => {
  peerConnections[id].setRemoteDescription(description);
  console.log("ans came");
});

socket.on("watcher", id => {
  console.log("watcher came to broadcaster and offer sent 00");
  const peerConnection = new RTCPeerConnection(config);
  peerConnections[id] = peerConnection;

  let stream = videoElement.srcObject;
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  let sstream=videoElem.srcObject;
  sstream.getTracks().forEach(track => peerConnection.addTrack(track, sstream));

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };

  peerConnection
    .createOffer()
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("offer", id, peerConnection.localDescription);
    });
    console.log("watcher came to broadcaster and offer sent");
});

socket.on("candidate", (id, candidate) => {
  peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on("disconnectPeer", id => {
  if(peerConnections[id]){
  peerConnections[id].close();
  delete peerConnections[id];
  }
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
};

// Get camera and microphone
const videoElement = document.getElementById("v&a");
const audioSelect = document.querySelector("select#audioSource");
const videoSelect = document.querySelector("select#videoSource");

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

getStream()
  .then(getDevices)
  .then(gotDevices);

function getDevices() {
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos;
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement("option");
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === "audioinput") {
      option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
      audioSelect.appendChild(option);
    } else if (deviceInfo.kind === "videoinput") {
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }
  }
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const audioSource = audioSelect.value;
  const videoSource = videoSelect.value;
  const constraints = {
    audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
    video: { deviceId: videoSource ? { exact: videoSource } : undefined }
  };
  return navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotStream)
    .catch(handleError);
}

function gotStream(stream) {
  window.stream = stream;
  audioSelect.selectedIndex = [...audioSelect.options].findIndex(
    option => option.text === stream.getAudioTracks()[0].label
  );
  videoSelect.selectedIndex = [...videoSelect.options].findIndex(
    option => option.text === stream.getVideoTracks()[0].label
  );
  videoElement.srcObject = stream;
  socket.emit("broadcaster",room);
  console.log("Bradcast emitted on "+room);
}
/////////////screen
const videoElem = document.getElementById("screen");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
const preview = document.getElementById("preview");
const cpreview = document.getElementById("closepreview");
const lableElem=document.getElementById("lable");
const hashtagElem=document.getElementById("hashtag");
const thumbnailElem=document.getElementById("thumbnail");
const audioElem=document.getElementById("audio");
const videoelem=document.getElementById("video");

stopElem.disabled=true;


// Options for getDisplayMedia()

var displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};
audioElem.addEventListener("click", function(evt) {
  if(videoElement.srcObject){
    videoElement.srcObject.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled);
  }
}, false);
videoElem.addEventListener("click", function(evt) {
  if(videoElement.srcObject){
    videoElement.srcObject.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled);
  }
}, false);
preview.addEventListener("click", function(evt) {
  getpreview();
}, false);
cpreview.addEventListener("click", function(evt) {
  if(videoElement.srcObject){
  let tracks = videoElement.srcObject.getTracks();
  tracks.forEach(track => track.stop());
  videoElement.srcObject = null;
}
}, false);
// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function(evt) {
  startCapture();
}, false);

stopElem.addEventListener("click", function(evt) {
  stopCapture();
}, false);
function stopCapture() {
  let tracks = videoElem.srcObject.getTracks();
  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
  tracks = videoElement.srcObject.getTracks();
  tracks.forEach(track => track.stop());
  videoElement.srcObject = null;
  var formData = {
    username : room,
  }
  ison=0;
    stopElem.disabled=true;
    startElem.disabled=false;
    preview.disabled=false;
    cpreview.disabled=false;
    lableElem.disabled=false;
    thumbnailElem.disabled=false;
    hashtagElem.disabled=false;
  $.ajax({
    type : "POST",
    contentType : "application/json",
  url : "/users/deluser",
  data : JSON.stringify(formData),
  dataType : 'json',
  success : function(customer) {
  },
  error : function(e) {
    alert("Error!")
    console.log("ERROR: ", e);
  }
});
}
async function getpreview(){
  getStream();
}
async function startCapture() {
  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    getStream()
    dumpOptionsInfo();
    var formData = {
      username : room,
      name:name[0],
      lable : $("#lable").val(),
      hashtags : $("#hashtag").val(),
      pic: pic,
      thumbnail: $("#thumbnail").val(),
      uid:uid,
    }
    ison=1;
    stopElem.disabled=false;
  startElem.disabled=true;
  preview.disabled=true;
  cpreview.disabled=true;
  thumbnailElem.disabled=true;
  lableElem.disabled=true;
  hashtagElem.disabled=true;
  $.ajax({
    type : "POST",
    contentType : "application/json",
    url :"/users/adduser",
    data : JSON.stringify(formData),
    dataType : 'json',
    success : function(done) {
    },
    error : function(e) {
      alert("Error!")
      console.log("ERROR: ", e);
    }
  });
  } catch(err) {
    console.error("Error: " + err);
  }
}
function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];
 
  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

function handleError(error) {
  console.error("Error: ", error);
}
}
window.onbeforeunload = function(){
  if(ison){
    let tracks = videoElem.srcObject.getTracks();
  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
  var formData = {
    username : room,
  }
  $.ajax({
    type : "POST",
    contentType : "application/json",
  url : "/users/deluser",
  data : JSON.stringify(formData),
  dataType : 'json',
  success : function(customer) {
    ison=0;
  },
  error : function(e) {
    alert("Error!")
    console.log("ERROR: ", e);
  }
});
  }
}

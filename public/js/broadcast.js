var io = io()
var configuration = {
   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
 }; 
   
var yourConn = new RTCPeerConnection(configuration);
console.log(yourConn);
var myvid = document.getElementById('myvid');

navigator.mediaDevices.getUserMedia({video: {width: 1280, height: 720} , audio: true}).then((stream) => {
    myvid.srcObject = stream;
        
     // setup stream listening 
     yourConn.addStream(stream); 
})

// Setup ice handling 
yourConn.onicecandidate = event => {
   console.log(event);
     if (event.candidate) { 
      io.emit('message', JSON.stringify(
         {
            type: 'candidate', 
            data: event.candidate
         }))            
     } 
         
  };

io.on("message", function(mydata){
   var mdata = JSON.parse(mydata);
   console.log(mdata);
   switch (mdata.type) {
      case 'offer':
         onOffer(mdata.data);
         break;

      case 'candidate':
         onCandidate(mdata.data);
         break;
   
      default:
         break;
   }
});

function onOffer(offer) { 
   yourConn.setRemoteDescription(new RTCSessionDescription(offer)); 
	
   yourConn.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    }).then((answer) =>{ 
      yourConn.setLocalDescription(answer); 
		console.log(answer);
      io.emit('message', JSON.stringify(
      {
         type: 'answer', 
         data: answer
      }));
		
   }).catch((error) => { 
      alert("oops...error"); 
   }); 
}

function onCandidate(candidate) { 
   yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
}
var io = io()
var configuration = {
   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
 }; 
   
var yourConn = new RTCPeerConnection(configuration);

var myvid = document.getElementById('myvid');

navigator.mediaDevices.getUserMedia({video: {width: 1280, height: 720} , audio: {echoCancellation: true}}).then((stream) => {       
     // setup stream listening 
     yourConn.addStream(stream); 
})

yourConn.onaddstream = function (e) { 
   console.log(e);
   myvid.srcObject = e.stream; 
};

// Setup ice handling 
yourConn.onicecandidate = event => {
   
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
	
   yourConn.createAnswer().then((answer) =>{ 
      yourConn.setLocalDescription(answer); 
		
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
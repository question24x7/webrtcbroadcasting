var io = io()
var configuration = {
   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
 }; 
   
var yourConn = new RTCPeerConnection(configuration);

var myvid = document.getElementById('myvid');

navigator.mediaDevices.getUserMedia({video: false , audio: true}).then((stream) => {
       
    // setup stream listening 
    yourConn.addStream(stream); 
}) 
     //when a remote user adds stream to the peer connection, we display it 
     yourConn.onaddstream = function (e) { 
        myvid.srcObject = e.stream; 
      };
     console.log(yourConn);
     
     yourConn.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    }).then((offer)=>{
      console.log(offer);
      yourConn.setLocalDescription(offer);
      io.emit('message', JSON.stringify(
          {
             type: 'offer', 
             data: offer
          }
       ))
   }).catch ((error) => { 
       alert("An error has occurred."); 
    });
     // Setup ice handling 
     yourConn.onicecandidate = function (event) {
        console.log(event);
        if (event.candidate) { 
            io.emit('message', JSON.stringify(
            {
               type: 'candidate', 
               data: event.candidate
            }));            
        } 
     };

io.on("message", function(mydata){
   var mdata = JSON.parse(mydata);
   console.log(mdata);
   switch (mdata.type) {
      case 'answer':
         onAnswer(mdata.data);
         break;

      case 'candidate':
         onCandidate(mdata.data);
         break;
   
      default:
         break;
   }
});

function onAnswer(answer) { 
   yourConn.setRemoteDescription(new RTCSessionDescription(answer)); 
} 

function onCandidate(candidate) { 
   yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
}
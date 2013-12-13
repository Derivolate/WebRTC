//constants

var AUDIO = true;
var VIDEO = true;

var width = 200;
var height = 150;
var vids = 4;
// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

// PeerJS object (default key)
//TODO set up own peerjs server https://github.com/peers/peerjs-server
//TODO set up/get STUN and TURN server.
var peer = new Peer({key: 'wzjo8kfky0qz1tt9'
});
peer.on('open', function() {
    $('#my-id').text(peer.id);
});

// Receiving a call
peer.on('call', function(call) {
    // Answer the call automatically
    call.answer(window.localStream);
    step3(call);
});

peer.on('error', function(err) {
    alert(err.message);
    stopCall();
});

    start();
// Click handlers setup
$(function() {
    $('#make-call').click(function() {
        // Initiate a call!
        var call = peer.call($('#callto-id').val(), window.localStream);

        step3(call);
    });

    $('#end-call').click(function() {
        window.existingCall.close();
    });
});

function start() {
    // Get audio/video stream
    navigator.getUserMedia({
        audio : AUDIO,
        video : VIDEO
    }, function(stream) {
        // Set your video displays
        $('#vid0').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        //Error callback
    }, function(err) {
        alert("An error occured! " + err);
    });
}

function stopCall(){
    
}
function step3(call) {
    // Hang up on an existing call if present
    if (window.existingCall) {
        window.existingCall.close();
    }

    // Wait for stream on the call, then set peer video display
    call.on('stream', function(stream) {
        $('#vid1').prop('src', URL.createObjectURL(stream));
    });

    // UI stuff
    window.existingCall = call;
    $('#their-id').text(call.peer);
    call.on('close', stopCall());
}

/*
 
 
    peer.on('open', function(){
      $('#my-id').text(peer.id);
    });

    // Receiving a call
    peer.on('call', function(call){
      call.answer(window.localStream);
      step3(call);
    });
    peer.on('error', function(err){
      alert(err.message);
      step2();
    });

    $(function(){
      $('#make-call').click(function(){
      
        var call = peer.call($('#callto-id').val(), window.localStream);

        step3(call);
      });

      $('#end-call').click(function(){
        window.existingCall.close();
        step2();
      });

      $('#step1-retry').click(function(){
        $('#step1-error').hide();
        step1();
      });

      step1();
    });

    function step1 () {
      navigator.getUserMedia({audio: true, video: true}, function(stream){
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        step2();
      }, function(){ $('#step1-error').show(); });
    }

    function step2 () {
      $('#step1, #step3').hide();
      $('#step2').show();
    }

    function step3 (call) {
      if (window.existingCall) {
        window.existingCall.close();
      }

      call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
      });

      window.existingCall = call;
      call.on('close', step2);
      $('#step1, #step2').hide();
      $('#step3').show();
    }
* */

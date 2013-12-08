//constants

var AUDIO = false;
var VIDEO = true;

var width = 200;
var height = 150;
var vids = 4;
//var video = [$('#vid0'),$('#vid1')];
// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

// PeerJS object (default key)
//TODO set up own peerjs server https://github.com/peers/peerjs-server
//TODO set up/get STUN and TURN server.
var peer = new Peer({key: 'wzjo8kfky0qz1tt9'});
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
    // Return to step 2 if error occurs
    step2();
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

    // Get things started

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
    call.on('close', stopCall());
}

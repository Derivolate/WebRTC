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
var peer = new Peer({
    
    key: 'wzjo8kfky0qz1tt9',
        // Set highest debug level (log everything!).
    debug : 3,

    // Set a logging function:
    logFunction : function() {
        var copy = Array.prototype.slice.call(arguments).join(' ');
        $('.log').append(copy + '<br>');
    },
    
    // Use a TURN server for more network support
    config : {
        'iceServers' : [{
            url : 'stun:stun.l.google.com:19302'
        }]
    }
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

// Make sure things clean up properly.

window.onunload = window.onbeforeunload = function(e) {
    if (!!peer && !peer.destroyed) {
        peer.destroy();
    }
};

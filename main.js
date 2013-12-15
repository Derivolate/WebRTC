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
//http://cdn.peerjs.com/demo/chat.html
// // Await connections from others
// peer.on('connection', connect);
// 
// // Handle a connection object.
// 
// 
// $(document).ready(function() {
    // // Prepare file drop box.
    // var box = $('#box');
    // box.on('dragenter', doNothing);
    // box.on('dragover', doNothing);
    // box.on('drop', function(e) {
        // e.originalEvent.preventDefault();
        // var file = e.originalEvent.dataTransfer.files[0];
        // eachActiveConnection(function(c, $c) {
            // if (c.label === 'file') {
                // c.send(file);
                // $c.find('.messages').append('<div><span class="file">You sent a file.</span></div>');
            // }
        // });
    // });
    // function doNothing(e) {
        // e.preventDefault();
        // e.stopPropagation();
    // }
// 
    // // Connect to a peer
    // $('#connect').click(function() {
        // requestedPeer = $('#rid').val();
        // if (!connectedPeers[requestedPeer]) {
            // // Create 2 connections, one labelled chat and another labelled file.
            // var c = peer.connect(requestedPeer, {
                // label : 'chat',
                // serialization : 'none',
                // reliable : false,
                // metadata : {
                    // message : 'hi i want to chat with you!'
                // }
            // });
            // c.on('open', function() {
                // connect(c);
            // });
            // c.on('error', function(err) {
                // alert(err);
            // });
            // var f = peer.connect(requestedPeer, {
                // label : 'file'
            // });
            // f.on('open', function() {
                // connect(f);
            // });
            // f.on('error', function(err) {
                // alert(err);
            // });
        // }
        // connectedPeers[requestedPeer] = 1;
    // });
// 
    // // Close a connection.
    // $('#close').click(function() {
        // eachActiveConnection(function(c) {
            // c.close();
        // });
    // });
// 
    // // Send a chat message to all active connections.
    // $('#send').submit(function(e) {
        // e.preventDefault();
        // // For each active connection, send the message.
        // var msg = $('#text').val();
        // eachActiveConnection(function(c, $c) {
            // if (c.label === 'chat') {
                // c.send(msg);
                // $c.find('.messages').append('<div><span class="you">You: </span>' + msg + '</div>');
            // }
        // });
        // $('#text').val('');
        // $('#text').focus();
    // });
// 
    // // Goes through each active peer and calls FN on its connections.
    // function eachActiveConnection(fn) {
        // var actives = $('.active');
        // var checkedIds = {};
        // actives.each(function() {
            // var peerId = $(this).attr('id');
// 
            // if (!checkedIds[peerId]) {
                // var conns = peer.connections[peerId];
                // for (var i = 0, ii = conns.length; i < ii; i += 1) {
                    // var conn = conns[i];
                    // fn(conn, $(this));
                // }
            // }
// 
            // checkedIds[peerId] = 1;
        // });
    // }
// 
    // // Show browser version
    // $('#browsers').text(navigator.userAgent);
// });
// 
// // Make sure things clean up properly.
// 
// function connect(c) {
    // // Handle a chat connection.
    // if (c.label === 'chat') {
        // var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
        // var header = $('<h1></h1>').html('Chat with <strong>' + c.peer + '</strong>');
        // var messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
        // chatbox.append(header);
        // chatbox.append(messages);
// 
        // // Select connection handler.
        // chatbox.on('click', function() {
            // if ($(this).attr('class').indexOf('active') === -1) {
                // $(this).addClass('active');
            // } else {
                // $(this).removeClass('active');
            // }
        // });
        // $('.filler').hide();
        // $('#connections').append(chatbox);
// 
        // c.on('data', function(data) {
            // messages.append('<div><span class="peer">' + c.peer + '</span>: ' + data + '</div>');
        // });
        // c.on('close', function() {
            // alert(c.peer + ' has left the chat.');
            // chatbox.remove();
            // if ($('.connection').length === 0) {
                // $('.filler').show();
            // }
            // delete connectedPeers[c.peer];
        // });
    // } else if (c.label === 'file') {
        // c.on('data', function(data) {
            // // If we're getting a file, create a URL for it.
            // if (data.constructor === ArrayBuffer) {
                // var dataView = new Uint8Array(data);
                // var dataBlob = new Blob([dataView]);
                // var url = window.URL.createObjectURL(dataBlob);
                // $('#' + c.peer).find('.messages').append('<div><span class="file">' + c.peer + ' has sent you a <a target="_blank" href="' + url + '">file</a>.</span></div>');
            // }
        // });
    // }
// };

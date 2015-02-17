$(function() {
    var socket = io.connect(null, { port: port });

    socket.on('connect', function() {
        console.log('connect');
    });

    socket.on('message', function(msg) {
        // var date = new Date();
        // $('#list').prepend($('<dt>' + date + '</dt><dd>' + msg + '</dd>'));
        $('#list').prepend(msg + '<br>');

    });

    socket.on('twitter', function(data) {
        $('#list').prepend(data.text + '<br>');
    });

    socket.on('disconnect', function() {
        console.log('disconnect');
    });

    $('#form').submit(function() {
        var message = $('#message');
        socket.send(message.val());
        message.val('');
        // message.attr('value', '');
        return false;
    });
});
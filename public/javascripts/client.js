$(function() {
    var socket = io.connect(null, { port: port });
    var msg_counter = 0;
    var msg_list = [];
    var stream_list = [];
    var lane_list = [];

    socket.on('connect', function() {
        console.log('connect');
    });

    socket.on('message', function(msg) {
        msgStream({text: msg});
    });

    socket.on('twitter', function(data) {
        msgStream(data);
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

    var msgStream = function(data){
        msg_counter++;
        if(msg_counter>1000) msg_counter=0;
        msg_list.push(msg_counter);

        var lane = laneManager(msg_counter ,data.text.length);

        var item = $('<div>')
                    .attr({
                        'class': 'tweet tweet' + msg_counter
                    })
                    .css('bottom', lane)
                    .append(data.text);

        $('#list').prepend(item);

        setTimeout(function(){
            var i = msg_list.splice(0, 1);
            stream_list.push(i);
            $(".tweet"+i).addClass('stream')
        }, 100)
        setTimeout(function(){
            var i = stream_list.splice(0,1);
            $(".tweet"+i).remove();
        }, 25000)
    }

    var laneManager = function(num, msg_length){
        // console.log("length : "+ msg_length)
        // var lane = num%4*20;
        var undefined;

        for (var i = 0; i <= lane_list.length; i++) {
            if(lane_list[i]==undefined){
                lane_list[i]=num;
                // console.log(lane_list);
                break;
            }
        //     // console.log("i :"+lane_list[i]);

        };

        // // console.log(i);
        // console.log("time :", msg_length*60);

        setTimeout(function(){
            // console.log("i,num:"+i+","+num+","+msg_length*40);
            lane_list[i]=undefined;
            // console.log(lane_list);
        }, msg_length*60)

        var lane = i*20+30;
        return lane;
    }
});
var color = '#000000';
var width = 2;

$(document).ready(function()
    {
        function Point(event, target)
        {
            this.x = event.pageX - $(target).position().left;
            this.y = event.pageY - $(target).position().top;
        }

        var canvas =  document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var isDown = false;

        var newPoint, oldPoint;
        var drawId = null;
        var authorId = null;
        var ratio = 2;
        var key =1;
        var flag =false;
        var points = new Array();

        var socket = io.connect("http://121.134.147.73:13333/") ;
//        var socket = io.connect("http://jhun88.cafe24.com:3000/") ;

        socket.on('connect', function()
        {
            socket.emit('joinRoom', {
                key : key});
        });

        socket.on('canvasSync',function(data){
            for(var i=0;i<data.length;i++){
                var old_x=data[i].points[0].x;
                var old_y=data[i].points[0].y;

                var x = data[i].points[1].x;
                var y = data[i].points[1].y;

                context.lineWidth = data[i].strokeWidth;
                context.strokeStyle = data[i].strokeColor;
                context.beginPath();
                context.moveTo(old_x * ratio, old_y * ratio);
                context.lineTo(x * ratio, y * ratio);
                context.stroke();
            }
        });

        socket.on('senddata', function(data){
//            console.log(data);

            if(data.length>0){
                var i=0;
                var interval = setInterval(function(){
                    var old_x=data[i].points[0].x;
                    var old_y=data[i].points[0].y;

                    var x = data[i].points[1].x;
                    var y = data[i].points[1].y;

                    context.lineWidth = data[i].strokeWidth;
                    context.strokeStyle = data[i].strokeColor;
                    context.beginPath();
                    context.moveTo(old_x * ratio, old_y * ratio);
                    context.lineTo(x * ratio, y * ratio);
                    context.stroke();
                    i++;

                    if(i>=data.length) clearInterval(interval);
                },1000/data.length);
            } else{
                var old_x=data.points[0].x;
                var old_y=data.points[0].y;

                var x = data.points[1].x;
                var y = data.points[1].y;

                context.lineWidth = data.strokeWidth;
                context.strokeStyle = data.strokeColor;
                context.beginPath();
                context.moveTo(old_x * ratio, old_y * ratio);
                context.lineTo(x * ratio, y * ratio);
                context.stroke();
            }
        });

        socket.on('clear', function(data)
        {
              context.clearRect(0, 0, 2000, 2000);
        });


        $('#canvas').mousedown(function(event)
            {
                drawId =  parseInt(Math.random() * Math.pow(10,10));
                authorId= parseInt(Math.random() * Math.pow(10,10));
                console.log(drawId);
                isDown = true;

                oldPoint = new Point(event, this);

                context.lineWidth = width;
                context.strokeStyle = color;
            }
        ).mouseup(function()
            {
                console.log("mouseup");
                isDown = false;
            }
        ).mousemove(function(event)
            {
                if(isDown)
                {
                    flag=true;
                    newPoint = new Point(event, this);
                    context.beginPath();
                    context.moveTo(oldPoint.x * 2, oldPoint.y * 2);
                    context.lineTo(newPoint.x * 2, newPoint.y * 2);
                    context.stroke();

//                    console.log(newPoint.length);

//                    socket.emit('senddata', {
//                        key : key,
//                        strokeWidth : width,
//                        strokeColor : color,
////                        fillColor : color,
////                        authorName : 'jh',
////                        authorId : '0',
////                        id : drawId,
////                        isFill : false,
////                        isErase : false,
//                        points : [{x : oldPoint.x, y:oldPoint.y}, {x : newPoint.x, y : newPoint.y}]
//                     });

                    points.push({
                        key : key,
                        strokeWidth : width,
                        strokeColor : color,
                        points : [{x : oldPoint.x, y:oldPoint.y}, {x : newPoint.x, y : newPoint.y}]
                    });
                    oldPoint = newPoint;
                }
            }
        );

        function repeat(){
            console.log(points.length);
            if(flag){
                socket.emit('senddata', {
                    key:key,
                    datas:points
                });
            }
            points.length=0;
            flag=false;
            setTimeout(function(){repeat();},1000);
        };
        repeat();

        $('.clearBtn').click(function()
        {
            socket.emit('clear',{
                key:key
            });
        });

        $('#colorpicker').farbtastic(function(data)
        {
            color = data;
            console.log(data);
        });

        $('.saveBtn').click(function(){
//            var saveImage = canvas.toDataURL("image/bmp");
//            var img = document.getElementById("imageView");
//
//            console.log(saveImage);
//            img.src=saveImage;
            socket.emit('redis');
        });

    }
)

function showValue(newValue)
{
    width = newValue;
    document.getElementById("range").innerHTML=newValue;
}

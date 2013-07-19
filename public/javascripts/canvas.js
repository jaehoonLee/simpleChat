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
        var color = '#000000';
        var width = 2;
        var newPoint, oldPoint;

        var socket = io.connect("http://127.0.0.1:3000/") ;
//        var socket = io.connect("http://jhun88.cafe24.com:3000/") ;
        socket.on('connect', function()
        {
            console.log("connected2");
        });

        socket.on('canvasSync', function (data) {
//            for (var i = 0 ; i < data.pointArr.length; i++)
//            {
//                var x1 = data.pointArr[i].x1
//                var y1 = data.pointArr[i].y1
//                var x2 = data.pointArr[i].x2
//                var y2 = data.pointArr[i].y2
//
//                context.lineWidth = width;
//                context.strokeStyle = color;
//                context.beginPath();
//                context.moveTo(x1, y1);
//                context.lineTo(x2, y2);
//                context.stroke();
            var firstPoint = null;
            for (var i = 0 ; i < data.pointArr.length; i++)
            {
                var x1 = data.pointArr[i].sendQ[0].x;
                var y1 = data.pointArr[i].sendQ[0].y;
                var x2 = data.pointArr[i].sendQ[1].x;
                var y2 = data.pointArr[i].sendQ[1].y;


                console.log("not zero:" + firstPoint);
                context.lineWidth = width;
                context.strokeStyle = color;
                context.beginPath();
//                        context.moveTo(firstPoint.x, firstPoint.y); // 간격이 있을텐데, 간격에 딸 씌
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();

            }
        });

        socket.on('draw', function(data)
        {
            context.lineWidth = data.width;
            context.strokeStyle = data.color;
            context.beginPath();
            context.moveTo(data.x1, data.y1);
            context.lineTo(data.x2, data.y2);
            context.stroke();
        });

        socket.on('senddata', function(data){
            context.lineWidth = data.strokeWidth;
            context.strokeStyle = data.strokeColor;
            context.beginPath();
            context.moveTo(oldPoint.x, oldPoint.y);
            context.lineTo(data.sendQ[0].x2, data.sendQ[0].y2);
            context.stroke();

            oldPoint = newPoint
        });

        $('#canvas').mousedown(function(event)
            {
                console.log("mousedown");
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

                newPoint = new Point(event, this);
                context.beginPath();
                context.moveTo(oldPoint.x, oldPoint.y);
                context.lineTo(newPoint.x, newPoint.y);
                context.stroke();
//                socket.emit('draw',
//                    {
//                       width : width,
//                       color : color,
//                       x1 : oldPoint.x,
//                       y1 : oldPoint.y,
//                       x2 : newPoint.x,
//                       y2 : newPoint.y
//                    });

                socket.emit('senddata', {
                       strokeWidth : width,
                       strokeColor : color,
                       fillColor : color,
                       authorName : 'jh',
                       authorId : '0',
                       id : '0',
                       isFill : false,
                       isErase : false,
                       sendQ : [{x : oldPoint.x, y:oldPoint.y}, {x : newPoint.x, y : newPoint.y}]
                     });
//                console.log("mouse move (" + oldPoint.x + "," + oldPoint.y + "), (" + newPoint.x + ", " + newPoint.y + ")");
                oldPoint = newPoint
                }
            }
        );
    }
)
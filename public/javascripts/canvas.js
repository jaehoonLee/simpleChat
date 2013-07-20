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
        var oldPointDatas = null;
        var oldPointData = null;
        var drawId = null;

        var socket = io.connect("http://127.0.0.1:3000/") ;
//        var socket = io.connect("http://jhun88.cafe24.com:3000/") ;
        socket.on('connect', function()
        {
            console.log("connected2");
        });

        socket.on('canvasSync', function (data) {
            for (var i = 0 ; i < data.pointArr.length; i++)
            {
                var pointDatas = data.pointArr[i];
                if(pointDatas.points.length != 0)
                {
                    if(oldPoint != null && oldPointDatas.id == pointDatas.id)
                    {
                        var x = pointDatas.points[0].x;
                        var y = pointDatas.points[0].y;

                        context.lineWidth = width;
                        context.strokeStyle = color;
                        context.beginPath();
                        context.moveTo(oldPoint.x, oldPoint.y);
                        context.lineTo(x, y);
                        context.stroke();
                    }
                }
                oldPoint = pointDatas.points[0];
                for(var j = 1 ; j < pointDatas.points.length; j++)
                {
                    var x = pointDatas.points[j].x;
                    var y = pointDatas.points[j].y;

                    context.lineWidth = width;
                    context.strokeStyle = color;
                    context.beginPath();
                    context.moveTo(oldPoint.x, oldPoint.y);
                    context.lineTo(x, y);
                    context.stroke();
                    oldPoint = pointDatas.points[j];
                }
                oldPointDatas = pointDatas;
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

            if(data.points.length != 0 && oldPointData != null)
            {
//                console.log("oldPoint:" + oldPointData.id+ ":" + data.id)  ;
                console.log("oldPoint:" + oldPoint + ":" + oldPointData.id+ ":" + data.id);
                if(oldPoint != null && oldPointData.id == data.id)
                {
                    console.log("oldPoint");
                    var x = data.points[0].x;
                    var y = data.points[0].y;

                    context.lineWidth = width;
                    context.strokeStyle = color;
                    context.beginPath();
                    context.moveTo(oldPoint.x, oldPoint.y);
                    context.lineTo(x, y);
                    context.stroke();
                }
            }

            oldPoint = data.points[0];
            for(var i = 1 ; i < data.points.length; i++)
            {
                var x = data.points[i].x;
                var y = data.points[i].y;

                context.lineWidth = width;
                context.strokeStyle = color;
                context.beginPath();
                context.moveTo(oldPoint.x, oldPoint.y);
                context.lineTo(x, y);
                context.stroke();
                oldPoint = data.points[i];
            }
            oldPointData = data;
        });

        socket.on('clear', function(data)
        {
              context.clearRect(0, 0, 600, 400);
        });


        $('#canvas').mousedown(function(event)
            {
                drawId =  parseInt(Math.random() * Math.pow(10,10));
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
                       id : drawId,
                       isFill : false,
                       isErase : false,
                       points : [{x : oldPoint.x, y:oldPoint.y}, {x : newPoint.x, y : newPoint.y}]
                     });
//                console.log("mouse move (" + oldPoint.x + "," + oldPoint.y + "), (" + newPoint.x + ", " + newPoint.y + ")");
                oldPoint = newPoint
                }
            }
        );


        $('.clearBtn').click(function()
        {
            socket.emit('clear');
        });
    }
)

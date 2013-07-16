/**
 * Created with JetBrains WebStorm.
 * User: user
 * Date: 13. 7. 16
 * Time: 오전 11:56
 * To change this template use File | Settings | File Templates.
 */




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
        $('#canvas').mousedown(function(event)
            {
                console.log("mousedown");
                isDown = true;

                oldPoint = new Point(event, this);
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
                console.log("mouse move " + oldPoint.x);
                newPoint = new Point(event, this);

                context.lineWidth = width;
                context.strokeStyle = color;
                context.beginPath();
                context.moveTo(oldPoint.x, oldPoint.y);
                context.lineTo(newPoint.x, newPoint.y);
                context.stroke();
//                socket.emit('draw',
//                    {
//                       width : width,
//                       color : color,
//                       x1 : oldPoint.x,
//                       y2 : oldPoint.y,
//                       x2 : newPoint.x,
//                       y2 : newPoint.y
//                    });
                oldPoint = newPoint
                }
            }
        );
    }
)
/**
 * Created by wd001 on 2018/11/8.
 */
var canvasWidth=Math.min(800,$(window).width()-20);
var canvasHeight=canvasWidth;
var strokeColor = "black"
var isMouseDown=false;
var lastLoc={x:0,y:0}
var lastTimestamp = 0
var lastLineWidth = -1

var canvas=document.getElementById('canvas');
var context = canvas.getContext("2d")
canvas.height=canvasHeight
canvas.width=canvasWidth

//清除画笔
$('#clear_btn').on('click',function(e){
    context.clearRect(0,0,canvasWidth,canvasHeight)
    drawGrid()
})
//选择颜色
$(".color_btn").click(
    function(e){
        $(".color_btn").removeClass("color_btn_selected")
        $(this).addClass("color_btn_selected")
        strokeColor = $(this).css("background-color")
    }
)
function startStroke(point){
    isMouseDown=true
    lastLoc=windowToCanvas(point.x, point.y)
    lastTimestamp=new Date().getTime()
}
function endStroke(){
    isMouseDown=false
}
function moveStroke(point){
    if(isMouseDown) {
        var curLoc = windowToCanvas(point.x, point.y)
        var curTimestamp = new Date().getTime()
        var s = calcDistance(curLoc, lastLoc)
        var t = curTimestamp - lastTimestamp
        var linewidth = calcLineWidth(t, s)
        context.beginPath()
        context.moveTo(lastLoc.x, lastLoc.y)
        context.lineTo(curLoc.x, curLoc.y)
        context.strokeStyle = strokeColor
        context.lineWidth = linewidth
        context.lineCap = 'round'
        context.lineJoin = 'round'
        context.stroke()
        lastLoc = curLoc
        lastTimestamp = curTimestamp
    }
}

drawGrid()
canvas.onmousedown=function(e){
    e.preventDefault()
    startStroke({x:e.clientX,y:e.clientY})
}
canvas.onmouseup=function(e){
    e.preventDefault()
    endStroke()
}
canvas.onmouseout=function(e){
    e.preventDefault()
    endStroke()
}
canvas.onmousemove=function(e){
    e.preventDefault()
    moveStroke({x:e.clientX,y:e.clientY})

}

//移动端
canvas.addEventListener('touchstart',function(e){
    e.preventDefault()
    touch= e.touches[0]
    startStroke({x:touch.pageX,y:touch.pageY})
})
canvas.addEventListener('touchend',function(e){
    e.preventDefault()
    endStroke()
})
canvas.addEventListener('touchmove',function(e){
    e.preventDefault()
    touch = e.touches[0]
    moveStroke({x:touch.pageX,y:touch.pageY})
})


//获得运笔宽度
var maxLineWidth =10;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;
function calcLineWidth( t , s ){
    var v = s / t;
    var resultLineWidth;
    if( v <= minStrokeV ){
        resultLineWidth = maxLineWidth;
    }
    else if ( v >= maxStrokeV ){
        resultLineWidth = minLineWidth;
    }
    else{
        resultLineWidth = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
    }
    if( lastLineWidth == -1 )
        return resultLineWidth;
    return resultLineWidth*1/3 + lastLineWidth*2/3;
}

function calcDistance( loc1 , loc2 ){
    return Math.sqrt( (loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y) )
}

//获得坐标系
function windowToCanvas(x,y){
    var bbox=canvas.getBoundingClientRect()
    return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)}
}
//画格子
function drawGrid(){
    context.save()
    context.strokeStyle = "rgb(230,11,9)"
    context.beginPath()
    context.moveTo( 3 , 3 )
    context.lineTo( canvasWidth - 3 , 3 )
    context.lineTo( canvasWidth - 3 , canvasHeight - 3 )
    context.lineTo( 3 , canvasHeight - 3 )
    context.closePath()
    context.lineWidth=6
    context.stroke()

    context.beginPath()
    context.moveTo(0,0)
    context.lineTo(canvasWidth,canvasHeight)
    context.moveTo(canvasWidth,0)
    context.lineTo(0,canvasHeight)
    context.moveTo(1/2*canvasWidth,0)
    context.lineTo(1/2*canvasWidth,canvasHeight)
    context.moveTo(0,1/2*canvasHeight)
    context.lineTo(canvasWidth,1/2*canvasHeight)
    context
    context.closePath()
    context.lineWidth=1
    context.stroke()

    context.restore()
}
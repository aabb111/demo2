var canvas = document.getElementById('canvas')
var caCtx = canvas.getContext('2d')
var color = document.getElementById('color')
var coCtx = color.getContext("2d")
var pen = document.getElementById('pen')
var pCtx = pen.getContext("2d")
var clear = document.getElementById('clear')
var clCtx = clear.getContext('2d')

var status = 0

var nowColor = "#000000"
var nowPen = 6
var clickEraser = 0
var clickTrash = 0
var bColor = ["#000000", "#999999", "#FFFFFF", "#FF0000",
              "#FF9900", "#FFFF00", "#008000", "#00CCFF",
              "#0099FF", "#FF33CC", "#CC66FF", "#FFCCCC",]

// 填充颜色
function drawColor() {
    var coWidth = color.width/6,
        coHeight = color.height/2
    var i = 0
    for (i; i < bColor.length; i++) {
      coCtx.fillStyle = bColor[i]
      if (i < bColor.length/2) {
        coCtx.fillRect(i*coWidth, 0, coWidth,coHeight)
      }
      else {
        coCtx.fillRect((i-6)*coWidth, coHeight, coWidth,coHeight)
      }
    }
}
drawColor()

// 填充画笔
function drawPen() {
  var pWidth  = pen.width/4,
      pHeight = pen.height/2

  for (var i = 0; i < 4; i++) {
    pCtx.beginPath()
    pCtx.arc(pWidth*i+10, pHeight, i+3, 0, Math.PI*2)
    pCtx.closePath()
    pCtx.fill()
  }
}
drawPen()

// 橡皮擦和清除
function drawClear() {
  var imgSrcArr = ["img/eraser.png","img/trash.png"]
  var imgArr = []
  for(let i in imgSrcArr) {
    imgArr[i] = new Image()
    imgArr[i].src = imgSrcArr[i]
    imgArr[i].onload = function () {
      clCtx.drawImage(imgArr[i], i*50+10,0,30,30)
    }
  }

}
drawClear()

//得到鼠标在canvas上的坐标
function getPointOnCanvas(canvas, x, y) {
  var bbox = canvas.getBoundingClientRect()
  return {
    x: Math.round((x- bbox.left )*(canvas.width / bbox.width)),
    y: Math.round((y - bbox.top) * (canvas.height / bbox.height))
  }
}

//在canvas上绘图
canvas.addEventListener("mousedown", startDraw, false)
canvas.addEventListener("mousemove", draw, false)
canvas.addEventListener("mouseup", stopDraw, false)
canvas.addEventListener("mouseout", stopDraw, false)

function startDraw(e) {
  e = window.event || e
  var pos = getPointOnCanvas(canvas, e.clientX, e.clientY)
  caCtx.beginPath()
  caCtx.moveTo(pos.x, pos.y)
  status = 1
}

function draw(e) {
  e = window.event || e
  var pos = getPointOnCanvas(canvas, e.clientX, e.clientY)
  if (status == 1) {
    caCtx.lineTo(pos.x,pos.y)
    if (clickEraser) {
      caCtx.strokeStyle = "#F9C"
      caCtx.lineWidth = 15
    }
    else {
      caCtx.strokeStyle = nowColor
      caCtx.lineWidth = nowPen
    }
    caCtx.stroke()
  }
  else {
    return false
  }
}

function stopDraw(e) {
  caCtx.closePath()
  status = 0
}

//鼠标在color上取色
color.addEventListener("mousedown",getColor)
function getColor(e) {
  var pos = getPointOnCanvas(color, e.clientX, e.clientY)
  var coWidth = color.width/6,
      coHeight = color.height/2

  var i = Math.floor(pos.x/coWidth),
      j = Math.floor(pos.y/coHeight)

  coCtx.clearRect(0,0,color.width,color.height)
  drawColor()
  if (!clickEraser) {
    coCtx.beginPath()
    coCtx.strokeStyle = "#000"
    coCtx.strokeRect(i*coWidth, j*coHeight, coWidth, coHeight)
  }

  //设置画笔颜色
  nowColor = bColor[i+j*6]
}

//鼠标在pen上取画笔样式
pen.addEventListener("mousedown", getPen)
function getPen(e) {
  var pos = getPointOnCanvas(pen, e.clientX, e.clientY)
  var pWidth  = pen.width/4,
      pHeight = pen.height/2

      var i = Math.floor(pos.x/pWidth),
          j = Math.floor(pos.y/pHeight)

      pCtx.clearRect(0,0,pen.width,pen.height)
      drawPen()
      if (!clickEraser) {
        pCtx.beginPath()
        pCtx.strokeStyle = "#000"
        pCtx.strokeRect(i*pWidth, 0, pWidth, pen.height)
      }

      nowPen = (i+3)*2
}

//橡皮或者清空页面
clear.addEventListener("mousedown", getClear)
function getClear(e) {
  var pos = getPointOnCanvas(clear, e.clientX, e.clientY)
  var clWidth  = clear.width/2,
      clHeight = clear.height

      var i = Math.floor(pos.x/clWidth),
          j = Math.floor(pos.y/clHeight)

      clCtx.clearRect(0,0,clear.width,clear.height)
      drawClear()
      if (i == 0) {
        clickEraser = !clickEraser
        if (clickEraser) {
          clCtx.beginPath()
          clCtx.strokeStyle = "#000"
          clCtx.strokeRect(i*clWidth, 0, clWidth, clear.height)
        }
      }
      else if (i == 1) {
        clickTrash = !clickTrash
        clickEraser = 0
        caCtx.clearRect(0,0,canvas.width,canvas.height)

      }

}

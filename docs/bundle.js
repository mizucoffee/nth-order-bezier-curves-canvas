(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const bezier = require("simple-bezier")

const points = [[100,100],[400,100],[400,400]]
let canvas, ctx, fineness
let dragging = 0

window.onload = () => {
  canvas = document.getElementById("canvas")
  ctx = canvas.getContext("2d")
  fineness = document.getElementById("fineness")

  fineness.onchange = render
  canvas.addEventListener('mousedown', onDown, false)
  canvas.addEventListener('mouseup', onUp, false)
  canvas.addEventListener('mousemove', onMove, false)

  document.getElementById("add").onclick = () => {
    if(points.length >= 3) remove.disabled = false
    points.push([250,250])
    render()
  }
  document.getElementById("remove").onclick = () => {
    if(points.length <= 4) remove.disabled = true
    points.pop()
    render()
  }
  render()
}

function onDown(e) {
  const x = e.clientX - canvas.getBoundingClientRect().left
  const y = e.clientY - canvas.getBoundingClientRect().top

  points.forEach((p,i) => {
    if ((p[0]-10) < x && (p[0]+10) > x && (p[1]-10) < y && (p[1]+10) > y)
      dragging = i+1
  })
}

function onUp(e) { dragging = 0 }

function onMove(e) {
  if (!dragging) return
  points[Number(dragging)-1][0] = e.clientX - canvas.getBoundingClientRect().left
  points[Number(dragging)-1][1] = e.clientY - canvas.getBoundingClientRect().top
  render()
}

function render() {
  ctx.clearRect(0,0,500,500)

  // draw line
  for (let i = 0; i < points.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(points[i][0], points[i][1]);
    ctx.lineTo(points[i + 1][0], points[i + 1][1]);
    ctx.lineWidth = 1
    ctx.strokeStyle = "#ff000088";
    ctx.stroke();
  }

  // draw circle
  for (let i = 0; i < points.length-1; i++) {
    ctx.beginPath();
    ctx.arc(points[i][0], points[i][1], 10, 180 * Math.PI, 0, true);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(points[points.length - 1][0], points[points.length - 1][1], 10, 180 * Math.PI, 0, true);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 3
  ctx.stroke();

  ctx.beginPath();
  bezier(points,Number(fineness.value)).forEach(p => {
    ctx.lineTo(p[0], p[1])
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2
    ctx.stroke();
  })

}

},{"simple-bezier":2}],2:[function(require,module,exports){
module.exports = (points, fineness) => {
  if(points.length < 3) return []
  if(fineness <= 0) return []
  if(points.some(p => p.length < 2 || !Number.isFinite(p[0]) || !Number.isFinite(p[1]))) return []

  let lines = []
  for (let i = 0; i < points.length - 1; i++) lines.push(lineSplit(points[i][0], points[i][1],points[i+1][0], points[i+1][1], fineness))

  const bezier = [];
  bezier.push([points[0][0],points[0][1]]);
  [...Array(fineness)].forEach((n, index) => {
    let l = lines.map(e => e[index])
    while(l.length > 1) {
      let t = []
      for (let i = 0; i < l.length - 1; i++) {
        t.push(lineSplit(l[i][0], l[i][1],l[i+1][0], l[i+1][1], fineness)[index])
      }
      l = t.slice()
    }
    bezier.push([l[0][0], l[0][1]])
  })
  bezier.push([points[points.length-1][0],points[points.length-1][1]])
  return bezier
}

const lineSplit = (x1,y1,x2,y2, split) => [...Array(split)]
  .map((e,i) => ([x1 + ((x2 - x1) / (split+1)) * (i+1), y1 + ((y2 - y1) / (split+1)) * (i+1)]))

},{}]},{},[1]);

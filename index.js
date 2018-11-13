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

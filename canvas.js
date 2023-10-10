const brushColor = 'lime';
const brushSize = 100;

const getDrawCursor = () => {
	const circle = `
		<svg
			height="${ brushSize }"
			fill="${ brushColor }"
            fill-opacity="0.5"
			viewBox="0 0 ${ brushSize * 2 } ${ brushSize * 2 }"
			width="${ brushSize }"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="50%"
				cy="50%"
				r="${ brushSize }" 
			/>
		</svg>
	`;
	
	return `data:image/svg+xml;base64,${ window.btoa(circle) }`;
};

const canvas = new fabric.Canvas("rasterCanvas", {
    width : 2*window.innerWidth/3,
    height : 4*window.innerHeight/5,
    backgroundColor : "#333",
    isDrawingMode: true,
    enableRetinaScaling: true,
    fireMiddleClick: true,
    freeDrawingCursor: `url(${ getDrawCursor() }) ${ brushSize / 2 } ${ brushSize / 2 }, crosshair`,
});

canvas.requestRenderAll();

fabric.Image.fromURL("./assets/export--69797765.jpg", function(oImg) {
    // oImg.set("lockMovementX", true);
    // oImg.set("lockMovementY", true);
    oImg.set("selectable", false);
    oImg.set("hasControls", false);
    oImg.set("hoverCursor", "default");
    canvas.add(oImg);
  });




canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });

canvas.on('mouse:down', function(opt) {
    var evt = opt.e;
    if (evt.altKey === true) {
        this.isDragging = true;
        canvas.isDrawingMode = false;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
    } else {
        brush = canvas.freeDrawingBrush;
        brush.color = brushColor;
        brush.opacity = 0.5;
        brush.width = brushSize;
        brush.drawDot = true;
    }
});
canvas.on('mouse:move', function(opt) {
    if (this.isDragging) {
        canvas.isDrawingMode = false;
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
    }
});
canvas.on('mouse:up', function(opt) {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    canvas.isDrawingMode = true;
    this.setViewportTransform(this.viewportTransform);
    this.isDragging = false;
    this.selection = true;
  });

// rect = new fabric.Rect({
//     left: 10,
//     top: 200,
//     fill: 'red',
//     width: 200,
//     height: 200
//   });
// canvas.add(rect);
// console.log(canvas.toJSON());
const brushColor = 'lime';
const brushSize = 100;
var zoom = 0.1;

function myFunction(e) {
    let x = e.clientX;
    let y = e.clientY;
    let coor = "Coordinates: (" + x + "," + y + ")";
    console.log(coor);
};

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
				r="${ brushSize*zoom }" 
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



const img = fabric.Image.fromURL("./assets/export--69797765.jpg", function(oImg) {
    // oImg.set("lockMovementX", true);
    // oImg.set("lockMovementY", true);
    oImg.set("selectable", false);
    oImg.set("hasControls", false);
    oImg.set("hoverCursor", "default");
    canvas.add(oImg);
    canvas.zoomToPoint(new fabric.Point(oImg.width/1000, oImg.height/1000), 0.1);
});
  
canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    zoom = canvas.getZoom();
    console.log("Zoom:", zoom);
    zoom *= 0.999 ** delta;
    if (zoom > 1) zoom = 1;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    canvas.freeDrawingCursor = `url(${ getDrawCursor() }) ${ brushSize / 2 } ${ brushSize / 2 }, crosshair`;
    this.requestRenderAll();
});

canvas.on('mouse:down', function(opt) {
    var evt = opt.e;
    console.log(opt.e.buttons);
    if (evt.buttons === 4) {
        this.isDragging = true;
        canvas.isDrawingMode = false;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
    } else {
        brush = canvas.freeDrawingBrush;
        canvas.freeDrawingCursor = `url(${ getDrawCursor() }) ${ brushSize / 2 } ${ brushSize / 2 }, crosshair`;
        brush.color = brushColor;
        brush.opacity = 0.5;
        brush.width = brushSize;
        brush.drawDot = true;
    }
});
addEventListener("keydown", async evt => {
    // var evt = opt.e;
    console.log(evt.key);
    // canvas.freeDrawingCursor = 'move';
    if (evt.key == " ") {
        console.log(document.querySelector(".canvas-container"));
        canvas.on('mouse:move', function(opt) {
            // document.querySelector(".upper-canvas").style.cursor = 'move';
            canvas.setCursor('move');
            var evt = opt.e;
            // console.log(opt.e.buttons);
            this.isDragging = true;
            canvas.isDrawingMode = false;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
        });
    }
});
addEventListener("keyup", async evt => {
    // var evt = opt.e;
    // console.log(evt.key);
    if (evt.key == " ") {
        // document.documentElement.style.cursor = 'default';
        canvas.on('mouse:move', function(opt) {
            var evt = opt.e;
            canvas.setCursor(`url(${ getDrawCursor() }) ${ brushSize / 2 } ${ brushSize / 2 }, crosshair`);
            // document.getElementsByClassName("upper-canvas")[0].style.removeProperty("cursor");
            // console.log(opt.e.buttons);
            this.isDragging = false;
            canvas.isDrawingMode = true;
            this.selection = true;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
            canvas.freeDrawingCursor = `url(${ getDrawCursor() }) ${ brushSize / 2 } ${ brushSize / 2 }, crosshair`;
        });
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
    } else {
        // console.log(opt);
        // console.log(opt.target);
        // console.log(opt.e.clientX, opt.e.clientY);
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


  
canvas.on('mouse:move', function(event) {
    // Get the mouse pointer coordinates relative to the canvas
    // Get an array of all objects on the canvas

    ///////// La DATA pareciera estar desfasada hacia abajo y la derecha ///////////
    // var ctx = canvas.getContext('2d');
    // // console.log(ctx.getImageData(event.e.clientX, event.e.clientY, 6, 6).data);
    // var data = ctx.getImageData(event.e.clientX, event.e.clientY, 6, 6).data;
    // var array = [];
	// for(var i = 0; i<36; i++){
	// 	array[i] = data[4*i]
	// }
    // console.log(data);

    ///////// sacando las coordenadas de los pixeles de la imagen ///////////
    var objects = canvas.getObjects();
    
    console.log();
    var pointer = canvas.getPointer(event.e);
    
    mammography = objects[0]
    // Get the mouse pointer coordinates relative to the image
    var imagePointer = mammography.toLocalPoint(new fabric.Point(pointer.x, pointer.y), 'top', 'left');
    // console.log(mammography.imageData);  
    
    // Log the coordinates to the console
    console.log('Mouse coordinates relative to the image:', imagePointer.x, imagePointer.y);
    console.log('Mouse coordinates relative to the canvas:', pointer.x, pointer.y);
});

canvas.requestRenderAll();
// rect = new fabric.Rect({
//     left: 10,
//     top: 200,
//     fill: 'red',
//     width: 200,
//     height: 200
//   });
// canvas.add(rect);
// console.log(canvas.toJSON());
var brushSize = 100; // A default value for the slider

const brushColor = '#FF0F0F90';
// var brushSize = sliderValue;
var zoom = 0.25;

var imgInstance = null;

imgURL = "./assets/C/export--69797765.jpg";

mammo_img = new Image();
mammo_img.onload = function() {
    console.log("Height: " + mammo_img.height);
    console.log("Width: " + mammo_img.width);
};
mammo_img.src = imgURL;


function updateSliderValue(value) {
  brushSize = parseInt(value, 10);
  // Update the display
  document.getElementById("sliderValue").textContent = toString(brushSize);
  // Additional actions can be performed here
  console.log("slidervalue", brushSize)
}


function myFunction(e) {
    let x = e.clientX;
    let y = e.clientY;
    let coor = "Coordinates: (" + x + "," + y + ")";
    console.log(coor);
};

const getDrawCursor = () => {
    const square = `
        <svg
            height="${ brushSize*zoom }" 
            width="${ brushSize*zoom }"
            fill="${ brushColor }"
            fill-opacity="0.9"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                width="${ brushSize*zoom }"
                height="${ brushSize*zoom }"
            />
        </svg>
    `; // tienen que estar iguales, si no no calzan
    
    return `data:image/svg+xml;base64,${ window.btoa(square) }`;
};

const canvas = new fabric.Canvas("rasterCanvas", {
    width : 2*window.innerWidth/3,
    height : 4*window.innerHeight/5,
    backgroundColor : "#333",
    isDrawingMode: false,
    enableRetinaScaling: true,
    fireMiddleClick: true,
    freeDrawingCursor: `url(${ getDrawCursor() }) ${ brushSize } ${ brushSize }, crosshair`,
    selection: false,
});

canvas.selectionColor = 'rgba(0,0,0,0)';  // Transparent selection color
canvas.selectionBorderColor = 'rgba(0,0,0,0)';  // Transparent border color
canvas.selectionLineWidth = 0;  // No border width

const img = new fabric.Image.fromURL(imgURL, function(oImg) {
// const img = fabric.Image.fromURL("./assets/phantoms/phantom.png", function(oImg) {
    // oImg.set("lockMovementX", true);
    // oImg.set("lockMovementY", true);
    oImg.set("selectable", false);
    oImg.set("hasControls", false);
    oImg.set("hoverCursor", "default");
    oImg.selectable = false;
    canvas.add(oImg);
    canvas.zoomToPoint(new fabric.Point(0, 0), zoom);
    imgInstance = oImg;
    // canvas.zoomToPoint(new fabric.Point(oImg.width/1000, oImg.height/1000), 0.1);
});
  
canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    zoom = canvas.getZoom();
    console.log("Zoom:", zoom);
    zoom *= 0.999 ** delta;
    if (zoom > 10) zoom = 10;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    
    canvas.freeDrawingCursor = `url(${ getDrawCursor() }) 0 0, crosshair`;
    canvas.setCursor(`url(${ getDrawCursor() }) 0 0, crosshair`);
    canvas.requestRenderAll();
});

canvas.on('mouse:up', function(opt) {
    canvas.setCursor(`url(${ getDrawCursor() }) 0 0, crosshair`);
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
        // brush = canvas.freeDrawingBrush;
        // canvas.freeDrawingCursor = `url(${ getDrawCursor() }) ${ brushSize / 2 } ${ brushSize / 2 }, crosshair`;
        // brush.color = brushColor;
        // brush.opacity = 0.5;
        // brush.width = brushSize;
        // brush.drawDot = true;
        
        canvas.freeDrawingCursor = `url(${ getDrawCursor() }) 0 0, crosshair`;
        var pointer = canvas.getPointer(opt.e);
        var rect = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            fill: 'rgba(255,0,0,0.5)',
            width: brushSize,
            height: brushSize,
            selectable: false,
            hasBorders: false,
            hasControls: false,
        });
        canvas.add(rect);
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
            canvas.setCursor('grabbing');
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
            canvas.setCursor(`url(${ getDrawCursor() }) 0 0, crosshair`);
            var evt = opt.e;
            // document.getElementsByClassName("upper-canvas")[0].style.removeProperty("cursor");
            // console.log(opt.e.buttons);
            this.isDragging = false;
            // canvas.isDrawingMode = true;
            this.selection = true;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
            canvas.freeDrawingCursor = `url(${ getDrawCursor() }) 0 0, crosshair`;
        });
    }
});

canvas.on('mouse:move', function(opt) {
    canvas.setCursor(`url(${ getDrawCursor() }) 0 0, crosshair`);
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
    // canvas.isDrawingMode = true;
    this.setViewportTransform(this.viewportTransform);
    this.isDragging = false;
    this.selection = true;
  });


var tempCanvas = new fabric.Canvas();

console.log("img", img);
console.log("img height", mammo_img.height, "img width", mammo_img.width);
tempCanvas.setWidth(img.width); // Set to required dimensions
tempCanvas.setHeight(img.height);

// Copy only rectangle objects to the temporary canvas


document.getElementById('saveButton').addEventListener('click', function() {
    // console.log("Saving image!")
    canvas.forEachObject(function(obj){
        console.log(obj)
        if(obj.type === 'rect'){
            var clone = fabric.util.object.clone(obj);
            tempCanvas.add(clone);
        }
    });

    console.log("saved!")
    tempCanvas.renderAll();
    var imageData = tempCanvas.toDataURL({
        format: 'png',
        quality: 1
    });
    localStorage.setItem('image1', imageData);
    // Additional code to handle the image data (e.g., store it or prepare for download)
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
var mock_dsp = window.mock_dsp;

const arrayDisplay = document.getElementById('arrayDisplay');

function getPixelDataFromOriginalImage(x, y, windowSize) {
	// Create an off-screen canvas
	var offScreenCanvas = document.createElement('canvas');

	// Draw the original image on the off-screen canvas
	var offScreenCtx = offScreenCanvas.getContext('2d', { willReadFrequently: true });
	console.log(typeof offScreenCanvas);
	offScreenCanvas.width = imgInstance._originalElement.width;
	offScreenCanvas.height = imgInstance._originalElement.height;
	offScreenCtx.drawImage(imgInstance._originalElement, 0, 0);


	// Get pixel data
	var pixelData = offScreenCtx.getImageData(x, y, windowSize, windowSize).data;
	return pixelData;
}

canvas.on('mouse:move', function(event) {
    // Get the mouse pointer coordinates relative to the canvas
    // Get an array of all objects on the canvas

    ///////// La DATA pareciera estar desfasada hacia abajo y la derecha ///////////
    const window_size = 10;
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    // // console.log(ctx.getImageData(event.e.clientX, event.e.clientY, 6, 6).data);
	var pointer = canvas.getPointer(event.e);
    var data = ctx.getImageData(event.e.clientX, event.e.clientY, window_size, window_size).data;
    var array = [];
	for(var i = 0; i<100; i++){
		array[i] = data[4*i]	

	}
	// for(var i =0; i<36; i++){
		// 	// console.log(array[i])	;
		
	// } // BUSCAR COMO VISUALIZAR UN ARRAY EN TIEMPO REAL
	
	///////// sacando las coordenadas de los pixeles de la imagen ///////////
	var objects = canvas.getObjects();
	
	// console.log();
	
	mammography = objects[0]
	var BWPixelData = [];
	var imagePointer = mammography.toLocalPoint(new fabric.Point(pointer.x, pointer.y), 'top', 'left');
	var pixelData = getPixelDataFromOriginalImage(Math.round(imagePointer.x) + 50, Math.round(imagePointer.y) + 50, 4);
	for(var i = 0; i<16; i++){
		BWPixelData[i] = pixelData[4*i]/255;
	}
	const newArr = [];
	while(BWPixelData.length) newArr.push(BWPixelData.splice(0,4));
	console.log(BWPixelData)
	arrayDisplay.textContent = ` ${newArr[0]} \n ${newArr[1]} \n ${newArr[2]} \n ${newArr[3]}`;
	// arrayDisplay.textContent = JSON.stringify(newArr, null, 2);
	// Get the mouse pointer coordinates relative to the image
	// arrayDisplay.textContent = `${Math.round(imagePointer.x) + 50}, ${Math.round(imagePointer.y) + 50}`;
    // console.log(mammography.imageData);  
    
    // Log the coordinates to the console
    // console.log('Event:', event.e.clientX, event.e.clientY);
    // console.log('Mouse coordinates relative to the image:', imagePointer.x, imagePointer.y);
    // console.log('Mouse coordinates relative to the canvas:', pointer.x, pointer.y);
    // const newArr = [];
    // while(array.length) newArr.push(array.splice(0,6));
    // console.table(newArr);

    const n = array.length;
	let mean = array.reduce((a,b) => a+b)/n/255;
	let std = Math.sqrt(array.map(x => Math.pow(x/255-mean,2)).reduce((a,b) => a+b)/n);
	let skewness = 0.0001;
	let kurtosis = 0.0001;
    var mute = false;

	if (std < 0.0001){
		skewness = 0.0001;
		kurtosis = 0.0001;
	}
	else {
		skewness = Math.sqrt(array.map(x => Math.pow(x/255-mean, 3)).reduce((a,b) => a+b)/(n*Math.pow(std, 3)));
		kurtosis = Math.sqrt(array.map(x => Math.pow(x/255-mean, 4)).reduce((a,b) => a+b)/(n*Math.pow(std, 4)));
	}
	if (isNaN(skewness)){
		skewness = 0.0001;
	}

    sonification(mean, std, skewness, kurtosis, mute);
});


function sonification(mean, std, skw, kur, mute){
	if (mute){
		mute = 0.0
	} else {
		mute = 1.0
	}
	mean = parseFloat(mean)
	std = parseFloat(std)
	skw = parseFloat(skw)
	kur = parseFloat(kur)

	mock_dsp.setParamValue("/audiogen/mute", mute)
	mock_dsp.setParamValue("/audiogen/vol", mean)
	mock_dsp.setParamValue("/audiogen/noise", std)
	mock_dsp.setParamValue("/audiogen/freq", skw)
	mock_dsp.setParamValue("/audiogen/tempo", kur)

	let indicators = `Mean: ${mean}, Std: ${std}, Skewness: ${skw}, Kurtosis: ${kur}`
	// console.log(indicators);
}
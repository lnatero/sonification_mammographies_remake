var mock_dsp = window.mock_dsp;

canvas.on('mouse:move', function(event) {
    // Get the mouse pointer coordinates relative to the canvas
    // Get an array of all objects on the canvas

    ///////// La DATA pareciera estar desfasada hacia abajo y la derecha ///////////
    const window_size = 6;
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    // // console.log(ctx.getImageData(event.e.clientX, event.e.clientY, 6, 6).data);
    var data = ctx.getImageData(event.e.clientX - window_size/2, event.e.clientY - window_size/2, window_size, window_size).data;
    var array = [];
	for(var i = 0; i<36; i++){
		array[i] = data[4*i]
	}
    // console.log(array);

    ///////// sacando las coordenadas de los pixeles de la imagen ///////////
    var objects = canvas.getObjects();
    
    console.log();
    var pointer = canvas.getPointer(event.e);
    
    mammography = objects[0]
    // Get the mouse pointer coordinates relative to the image
    var imagePointer = mammography.toLocalPoint(new fabric.Point(pointer.x, pointer.y), 'top', 'left');
    // console.log(mammography.imageData);  
    
    // Log the coordinates to the console
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

	let indicators = `Mean: ${mean}, Std: ${std}, Skewness: ${skw}, Kurtosis: ${kur}, NeuralNetwork: ${nn}`
	console.log(indicators);
}
function animateProgressBar(label){
  var progressbar = $('#progressbar'),
    max = progressbar.attr('max'),
    time = (1000/max)*1,
    current_progressmeter = 0,
  	value = progressbar.val();
 
  var loading = function() {
      current_progressmeter += 1;
      addValue = progressbar.val(current_progressmeter);
       
      $('.progress-value').html(label + ' ' + current_progressmeter + '%');
 
      if (current_progressmeter == value) {
          clearInterval(animate);                
      }
  };
 
  var animate = setInterval(function() {
      loading();
  }, time);
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
	// Check if the XMLHttpRequest object has a "withCredentials" property.
	// "withCredentials" only exists on XMLHTTPRequest2 objects.
	xhr.open(method, url, true);
		console.log('withCredentials property found!');
  } else if (typeof XDomainRequest != "undefined") {

	// Otherwise, check if XDomainRequest.
	// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	xhr = new XDomainRequest();
	xhr.open(method, url);
		console.log('XDomainRequest property found!');
  } else {
	// Otherwise, CORS is not supported by the browser.
	xhr = null;
		console.log('CORS not supported!');
  }
  return xhr;
}
function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
}
function classifyImage(){
	var inp_img_url = document.getElementById("inp_image_url").value;
	console.log('clicked:'+inp_img_url+".");
	if(inp_img_url==''){
		console.log('err: Empty url');
		return;
	}
	//var xmlHttp = new XMLHttpRequest();
	var request_url = "https://gateway.watsonplatform.net/visual-recognition/api/v3/classify?version=2018-03-19&classifier_ids=Prototypexmodel_2002943784&url="+inp_img_url;

	$.ajax({
	  url: request_url,
	  type: 'GET',
	  dataType: 'json',
	  headers: {
			'authorization': 'Basic ' + btoa('apikey:82UerIfVAWJlAOQsBUGM3y1MLReZD6EPgcHIcN6HqRqt')
	  },
	  contentType: 'application/json; charset=utf-8',
	  success: function (result) {
		console.log('Results: ');
		document.getElementById("loader").style.display = "none";
		//console.log(result);
		try {
			console.log(result['images'][0]['classifiers'][0]['classes'][0]);
			var resultsection = document.getElementById("results"),
				detectedlabel = document.createElement("LABEL"),
				progressbar = $('#progressbar'),
				score = result['images'][0]['classifiers'][0]['classes'][0]['score'],
				label = result['images'][0]['classifiers'][0]['classes'][0]['class'];
			detectedlabel.setAttribute("value", result['images'][0]['classifiers'][0]['classes'][0]);
			resultsection.appendChild(detectedlabel);
			progressbar.val(Math.ceil(score*100));
			animateProgressBar(label.toUpperCase());
			resultsection.scrollIntoView();
		}
		catch(err) {
			console.log(err);
		}
		
	  },
	  error: function (error) {
		console.log('Error: ');
		console.log(error);
	  }
  	});
	var resultsection = document.getElementById("results"),
		input_image = document.getElementById("input_image");

	var elem = document.createElement("img");
	elem.setAttribute("src", inp_img_url);
	elem.setAttribute("height", "500");
	elem.setAttribute("width", "500");
	//removing the older child if exists
	if (input_image.hasChildNodes()) {
		input_image.removeChild(input_image.lastChild);
	}
	input_image.appendChild(elem);

	resultsection.style.maxHeight = resultsection.scrollHeight + "px";
}

function initMap() {
	var broadway = {
		info: '<strong>windmill 1</strong><br>\
					<br> Fremont, CA 60640<br>\
					<a href="https://goo.gl/maps/jKNEDz4SyyH2">Get Directions</a>',
		lat: 37.5482697,
		long: -121.9885719
		};
	var map = new google.maps.Map(document.getElementById('map'), {
											zoom: 13,
											center: new google.maps.LatLng(37.5482697, -121.9885719),
											mapTypeId: google.maps.MapTypeId.SATELLITE
										});
	var infowindow = new google.maps.InfoWindow({});

	var locations = [["windmill 1", 37.5482697, -121.9885719, 0], ["windmill 2", 37.5177787,-122.0468607, 0]];

	var marker, i;
	for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
											position:  new google.maps.LatLng(locations[i][1], locations[i][2]),
											map: map
										});

										google.maps.event.addListener(marker, 'click', (function (marker, i) {
											return function () {
												infowindow.setContent(locations[i][0]);
												infowindow.open(map, marker);
											}
										})(marker, i));
	}
	var resultsection = document.getElementById("results");
	//toggle the results section
	resultsection.addEventListener("click", function() {
		if (resultsection.style.maxHeight != "50px"){
		  resultsection.style.maxHeight = "50px";
		} else {
		  resultsection.style.maxHeight = resultsection.scrollHeight + "px";
		}
	});	

	/*document.getElementById("file-input").onchange = function(e) {
					var file = e.target.files[0]
					if (file && file.name) {
					 alert(file.name);
						EXIF.getData(file, function() {

						var long = EXIF.getTag(this, 'GPSLongitude');
						var lat = EXIF.getTag(this, 'GPSLatitude');
						var altitude = EXIF.getTag(this, 'GPSAltitude');

							var exifData = EXIF.pretty(this);
							if (exifData) {
								//alert(exifData);
								alert(toDecimal(lat));
								alert(toDecimal(long));
								alert("Altitude == "+altitude);

								var url = 'https://maps.google.com/maps?q=' + toDecimal(lat) + ',' + toDecimal(long);

							   // print '<a href="' + url + '">go</a>';
							   // window.open(url);
								 // openWin(toDecimal(lat),toDecimal(long));



								var infowindow = new google.maps.InfoWindow({});

								var locations = [
									  [broadway.info, toDecimal(lat), toDecimal(long), 0]
									];

									var marker, i;

									for (i = 0; i < locations.length; i++) {
										marker = new google.maps.Marker({
											position: new google.maps.LatLng(locations[i][1], locations[i][2]),
											map: map
										});

										google.maps.event.addListener(marker, 'click', (function (marker, i) {
											return function () {
												infowindow.setContent(locations[i][0]);
												infowindow.open(map, marker);
											}
										})(marker, i));
									}


							} else {
								alert("No EXIF data found in image '" + file.name + "'.");
							}
						});
					}
				}*/

		var toDecimal = function (number) {
			   return number[0].numerator + number[1].numerator /
				   (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
	   };

	var broadway = {
		info: '<strong>windmill 1</strong><br>\
					<br> Fremont, CA 60640<br>\
					<a href="https://goo.gl/maps/jKNEDz4SyyH2">Get Directions</a>',
		lat: 37.5482697,
		long: -121.9885719
		};

	var belmont = {
		info: '<strong>windmill 2</strong><br>\
					1025 W Belmont Ave<br> Newark, CA 60657<br>\
					<a href="https://goo.gl/maps/PHfsWTvgKa92">Get Directions</a>',
		lat: 37.5296593,
		long: -122.0402399
		};

	var sheridan = {
		info: '<strong>windmill 3</strong><br>\r\
					6600 N Sheridan Rd<br> Chicago, IL 60626<br>\
					<a href="https://goo.gl/maps/QGUrqZPsYp92">Get Directions</a>',
		lat: 37.5630519,
		long: -122.0553349
		};

	var locations = [
	  [broadway.info, broadway.lat, broadway.long, 0],
	  [belmont.info, belmont.lat, belmont.long, 1],
	  [sheridan.info, sheridan.lat, sheridan.long, 2],
	];

	/*
	Available parameters in the image metadata...
	ExifTool Version Number         : 10.00
	File Name                       : Example Ibiza.JPG
	Directory                       : .
	File Size                       : 229 kB
	File Modification Date/Time     : 2015:10:11 18:58:06+02:00
	File Access Date/Time           : 2015:10:13 12:41:47+02:00
	File Inode Change Date/Time     : 2015:10:11 18:58:06+02:00
	File Permissions                : rw-r--r--
	File Type                       : JPEG
	File Type Extension             : jpg
	MIME Type                       : image/jpeg
	JFIF Version                    : 1.01
	Profile CMM Type                : Lino
	Profile Version                 : 2.1.0
	Profile Class                   : Display Device Profile
	Color Space Data                : RGB
	Profile Connection Space        : XYZ
	Profile Date Time               : 1998:02:09 06:49:00
	Profile File Signature          : acsp
	Primary Platform                : Microsoft Corporation
	CMM Flags                       : Not Embedded, Independent
	Device Manufacturer             : IEC
	Device Model                    : sRGB
	Device Attributes               : Reflective, Glossy, Positive, Color
	Rendering Intent                : Perceptual
	Connection Space Illuminant     : 0.9642 1 0.82491
	Profile Creator                 : HP
	Profile ID                      : 0
	Profile Copyright               : Copyright (c) 1998 Hewlett-Packard Company
	Profile Description             : sRGB IEC61966-2.1
	Media White Point               : 0.95045 1 1.08905
	Media Black Point               : 0 0 0
	Red Matrix Column               : 0.43607 0.22249 0.01392
	Green Matrix Column             : 0.38515 0.71687 0.09708
	Blue Matrix Column              : 0.14307 0.06061 0.7141
	Device Mfg Desc                 : IEC http://www.iec.ch
	Device Model Desc               : IEC 61966-2.1 Default RGB colour space - sRGB
	Viewing Cond Desc               : Reference Viewing Condition in IEC61966-2.1
	Viewing Cond Illuminant         : 19.6445 20.3718 16.8089
	Viewing Cond Surround           : 3.92889 4.07439 3.36179
	Viewing Cond Illuminant Type    : D50
	Luminance                       : 76.03647 80 87.12462
	Measurement Observer            : CIE 1931
	Measurement Backing             : 0 0 0
	Measurement Geometry            : Unknown
	Measurement Flare               : 0.999%
	Measurement Illuminant          : D65
	Technology                      : Cathode Ray Tube Display
	Red Tone Reproduction Curve     : (Binary data 2060 bytes, use -b option to extract)
	Green Tone Reproduction Curve   : (Binary data 2060 bytes, use -b option to extract)
	Blue Tone Reproduction Curve    : (Binary data 2060 bytes, use -b option to extract)
	Exif Byte Order                 : Big-endian (Motorola, MM)
	Make                            : Apple
	Camera Model Name               : iPhone 4
	Orientation                     : Horizontal (normal)
	X Resolution                    : 72
	Y Resolution                    : 72
	Resolution Unit                 : inches
	Software                        : 4.3.5
	Modify Date                     : 2011:09:04 12:51:11
	Exposure Time                   : 1/3016
	F Number                        : 2.8
	Exposure Program                : Program AE
	ISO                             : 80
	Exif Version                    : 0221
	Date/Time Original              : 2011:09:04 12:51:11
	Create Date                     : 2011:09:04 12:51:11
	Components Configuration        : Y, Cb, Cr, -
	Shutter Speed Value             : 1/3016
	Aperture Value                  : 2.8
	Metering Mode                   : Multi-segment
	Flash                           : No Flash
	Focal Length                    : 3.9 mm
	Flashpix Version                : 0100
	Color Space                     : sRGB
	Exif Image Width                : 1024
	Exif Image Height               : 765
	Sensing Method                  : One-chip color area
	Custom Rendered                 : Unknown (4)
	Exposure Mode                   : Auto
	White Balance                   : Auto
	Scene Capture Type              : Standard
	GPS Latitude Ref                : North
	GPS Longitude Ref               : East
	GPS Altitude Ref                : Above Sea Level
	GPS Time Stamp                  : 11:07:47
	GPS Img Direction Ref           : True North
	GPS Img Direction               : 82.12307692
	GPS Date Stamp                  : 2011:09:04
	XMP Toolkit                     : XMP Core 5.1.2
	Creator Tool                    : 4.3.5
	Date Created                    : 2011:09:04 12:51:11
	Image Width                     : 1024
	Image Height                    : 765
	Encoding Process                : Baseline DCT, Huffman coding
	Bits Per Sample                 : 8
	Color Components                : 3
	Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
	Aperture                        : 2.8
	GPS Altitude                    : 0 m Above Sea Level
	GPS Date/Time                   : 2011:09:04 11:07:47Z
	GPS Latitude                    : 38 deg 54' 35.40" N
	GPS Longitude                   : 1 deg 26' 19.20" E
	GPS Position                    : 38 deg 54' 35.40" N, 1 deg 26' 19.20" E
	Image Size                      : 1024x765
	Megapixels                      : 0.783
	Shutter Speed                   : 1/3016
	Focal Length                    : 3.9 mm
	Light Value                     : 14.9
	*/
}

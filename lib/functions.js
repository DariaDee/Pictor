
var functions = function() {

	// this function calculates the angle between two vectors
	// on Github: https://github.com/Abantech/abantech.github.io/blob/60adc74afbd485d0d33cc51248950c66bb814210/Efficio/Client%20Side/Efficio/src/Helpers/Math.js
	var _vectorAngle = function(v1,v2) {

		// first vector components
		var v1_x = v1[0];
		var v1_y = v1[1];
		var v1_z = v1[2];

		// second vector components
		var v2_x = v2[0];
		var v2_y = v2[1];
		var v2_z = v2[2];

		// dot/scalar product
		var dotProduct = v1_x*v2_x + v1_y*v2_y + v1_z*v2_z;

		// both vector's modules
		var v1_module = Math.sqrt(v1_x*v1_x+v1_y*v1_y+v1_z*v1_z);
		var v2_module = Math.sqrt(v2_x*v2_x+v2_y*v2_y+v2_z*v2_z);

		// return Math.acos(axb / (vector1Length * vector2Length)) * (180 / Math.PI)
		return Math.acos(dotProduct / (v1_module*v2_module)) * 180 / Math.PI;
	};

	// this function verifies the Servos object
	var _checkServos = function(fingers, Servos) {

		// set the result to true
		var check = true;

		// for each finger 
		for( var j = 0; j < fingers.length; j++ ){

	        // current finger
	        var finger = fingers[j];

	        // current finger ID
	        var finger_id = finger.id;

	        // if this finger ID is not present inside the Servos' object then set the result to false
	        if(typeof Servos[finger_id] === "undefined"){
	        	check = false;
	        	break;
	        }
    	}

    	return check;
	};


	
	// this function renews the Servos object
	var _refreshServos = function(fingers) {

		var servosArray = new Array();
			servosArray[0] = 'thumb'; // thumb finger
			servosArray[1] = 'index'; // index finger
			servosArray[2] = 'middle'; // middle finger
			servosArray[3] = 'ring'; // ring finger
			servosArray[4] = 'pinkie'; // pinkie finger
			
		var x = {};
		var Servos = {};
		var sortable = [];

		// for each finger
		for( var j = 0; j < fingers.length; j++ ){

	        // current finger
	        var finger = fingers[j];

	        // current finger ID
	        var finger_id = finger.id;

	        // current finger x position
	        var finger_stabilized_x_position = finger.stabilizedTipPosition[0].toFixed(0);

	        x[finger_id] = finger_stabilized_x_position;

    	}

    	// first assign an array with all values 
		for (var id_finger in x)
			sortable.push([id_finger, x[id_finger]]);
			
		// sort the array
		sortable.sort(function(a, b) {return a[1] - b[1]});

		// generate the Servos object
		for (var i = 0; i < sortable.length; i++) {

			// current finger
			var this_finger_id = sortable[i][0];

			// current finger servo
			var this_finger_servo = servosArray[i];

			// update Servos object
			Servos[this_finger_id] = this_finger_servo;

			// debug
			console.log('COUNTER: '+i+', SERVO NAME: '+this_finger_servo+', FINGER ID: '+this_finger_id+', X_COORDINATE: '+sortable[i][1]);
		};

		return Servos;
    	
	};

	// this function keeps all undetected fingers open
	var _openClaw = function(fingers, Servos, Finger){

		var ServosBuffer = {};

		// Servos' duplicate
		for (var key in Servos) {

			// servo name
			var nome_servo = Servos[key];

			// finger ID 
			var id_leap = key;

			// buffer object
			ServosBuffer[id_leap] = nome_servo;

        }

        // remove all detected fingers (so that only not detected fingers remain)
		for( var j = 0; j < fingers.length; j++ ){

			// current finger
			var finger = fingers[j];

        	// current finger ID
        	var finger_id = finger.id;

        	// remove detected fingers
        	delete ServosBuffer[finger_id];
      		
		}

		// for each not detected finger 
		for (var key in ServosBuffer) {

			// servo name
			var nome_servo = ServosBuffer[key];

			// finger ID 
			var id_leap = key;

			// this keeps the servo closed, however the claw stays open
			_fingerClose(Finger, nome_servo);


        }

	}

	// make a functions
	var _fist = function(Finger){
		Finger['pinkie'].max();
		Finger['ring'].max();
		Finger['middle'].max();
		Finger['index'].max();
		Finger['thumb'].max();
	}

	// relax the hand
	var _relax = function(Finger){
		Finger['pinkie'].min();
		Finger['ring'].min();
		Finger['middle'].min();
		Finger['index'].min();
		Finger['thumb'].min();
	}

	// close a single finger
	var _fingerClose = function(Finger, selectedFinger){

			Finger[selectedFinger].max();
	}

	// open a single finger
	var _fingerOpen = function(Finger, selectedFinger){

			Finger[selectedFinger].min();
	}

	// move a single finger
	var _moveFingerTo = function(Finger, fingerAngle, servo, oldServoAngles, threshold) {



	     // calculate the servo angle
         var servoAngle = (20+(100-fingerAngle)*1.5);  

      	// make sure the servos don't go out of range
		if(servoAngle < 20)
			servoAngle = 20;
		else if (servoAngle > 160)
		  	servoAngle = 160;

		// debug
	  	console.log("THE FINGER "+servo+" IS SET TO: "+fingerAngle+'°');
		console.log("THE FINGER "+servo+" IS MOVING TO: "+servoAngle+'°');

		// calculate the difference between the new angle and the old one
		if(oldServoAngles[servo] > 0){

			// difference
			var anglesDelta = Math.abs(parseInt(servoAngle)-parseInt(oldServoAngles[servo]));

			// debug
			console.log("ANGLES DIFFERENCE (DELTA): "+anglesDelta+'°');

	
			if(anglesDelta > threshold[servo]){
				oldServoAngles[servo] = servoAngle;
				Finger[servo].to(servoAngle);
			}

		// look at the old angles and move the servo
		} else {
			oldServoAngles[servo] = servoAngle;
			Finger[servo].to(servoAngle);
		}

	}

	return {
		vectorAngle: 		_vectorAngle,
		checkServos: 	    _checkServos,
		fist: 				_fist,
		relax: 				_relax,
		fingerClose: 		_fingerClose,
		fingerOpen: 		_fingerOpen,
		refreshServos:      _refreshServos,
		openClaw:           _openClaw,
		moveFingerTo: 		_moveFingerTo
	};
};

module.exports = functions;

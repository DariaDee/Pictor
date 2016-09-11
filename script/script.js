// import needed modules and scripts
var five = require("johnny-five"),
	functions = require('../lib/functions'),
	Leap = require("../lib/index"),
	board, servo;

// create a new arduino object
board = new five.Board();

// servo's threshold
threshold = {'thumb': 0, 'index': 2, 'middle': 3, 'ring': 3, 'pinkie': 3};

// new leap motion object
var controller = new Leap.Controller();

// all mutual functions
var Servos = {};

// servo's x coordinates
var x = {};

// old servo angles
var oldServoAngles = {};

// array with all the servos
var Finger = new Array();

// found in lib/functions
functions = new functions();

// initialize arduino
board.on("ready", function() {

// from https://bocoup.com/weblog/javascript-relay-with-johnny-five
// let's create a relay object which will normally be closed and opened when called

var relay = new five.Relay({
  type: "NC", // normally closed
  pin: 2 // on pin 2
});

var relay1 = new five.Relay({
  type: "NC", // normally closed
  pin: 4 // on pin 4
});

var relay2 = new five.Relay({
  type: "NC", // normally closed
  pin: 7 // on pin 7
});

var relay3 = new five.Relay({
  type: "NC", // normally closed
  pin: 8 // on pin 8
});
    
var relay4 = new five.Relay({
  type: "NC", // normally closed
  pin: 12 // on pin 12
});


	// define all the servos

	// PINKIE FINGER
	Finger['pinkie'] = new five.Servo({
		pin: 3, // Servo 5
		range: [90, 120], 
		type: "standard", 
		startAt: 0, 
		center: false
		
	});

	// RING FINGER
	Finger['ring'] = new five.Servo({
		pin: 5, // Servo 4
		range: [90, 120], 
		type: "standard", 
		startAt: 0, 
		center: false 
	
	});

	// MIDDLE FINGER
	Finger['middle'] = new five.Servo({
		pin: 6, // Servo 3
		range: [90, 120], 
		type: "standard", 
		startAt: 0, 
		center: false
	
	});


	// INDEX FINGER
	Finger['index'] = new five.Servo({
		pin: 9, // Servo 2
		range: [90, 120], 
		type: "standard", 
		startAt: 0,
		center: false 
	
	});

	// THUMB FINGER
	Finger['thumb'] = new five.Servo({
		pin: 10, // Servo 1
		range: [90, 120], 
		type: "standard", 
		startAt: 0, 
		center: false 
		
	});



	// retrieve leap motion frames:
	// the Frame class defines several functions that provide access to the data in the frame
	controller.on("frame", function(frame) {

// switch the relay on
relay.on();
relay1.on();
relay2.on();
relay3.on();
relay4.on();


		 // number of detected hands
	    var nHands = frame.hands.length;

	    // if there is one hand
	    if(nHands == 1){

	    	// retrieve the hand object
  			var hand = frame.hands[0];

  			// retrieve the finger object
  			var finger_obj = hand.fingers;

  			// retrieve the number of detected fingers
  			detectedFingers = finger_obj.length;

  			// if there are some detected fingers
  			if(detectedFingers > 0){

  			
  				// renew the Servos object
  				if(functions.checkServos(finger_obj, Servos) == false){

  					// if there are 5 detected fingers
  					if(detectedFingers == 5){

  						// delete the Servos object
						delete Servos;
						Servos = {};

						// and refresh it
						Servos = functions.refreshServos(finger_obj);

					

					} else

					// otherwise display the alert
						console.log("Place your open hand to recalibrate the device!");

				
  				} else {

  					// if there are less than 5 fingers detected
					if(detectedFingers < 5){
						
						// keep the claw open
						functions.openClaw(finger_obj, Servos, Finger);

					}

					// for each detected finger
					for( var j = 0; j < detectedFingers; j++ ){

						// assign the finger
						var this_finger = finger_obj[j];

			        	// retrieve finger id assigned by leap motion
			        	var this_finger_id = this_finger.id;

			        	// retrieve the relevant servo
			        	var servo = Servos[this_finger_id];

			        	// calculate the angle between the palm normal and finger direction
			        	var fingerAngle = functions.vectorAngle(hand.palmNormal, this_finger.direction).toFixed(0);

			        	// move the servo
			      		functions.moveFingerTo(Finger, fingerAngle, servo, oldServoAngles, threshold);
			      		
					}

  				}

  			} else {

  				// make a fist
  				functions.fist(Finger);

  				// clean the servos object
				delete Servos;
				Servos = {};
  			}


	    } else {

	    	// relax the hand and show the alert
	    	functions.relax(Finger);
	    	console.log("Please, place one hand above the device!");


	    }
	    	

	});


});


// initialize leap motion

controller.on('deviceConnected', function() {
    console.log("Leap Motion is connected!");
});

controller.on('deviceDisconnected', function() {
    console.log("Leap Motion is disconnected!");
});

// connect the controller
controller.connect();



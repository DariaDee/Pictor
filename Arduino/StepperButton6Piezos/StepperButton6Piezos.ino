#define DISTANCE 1000

int StepCounter = 0; // set the stepcounter to 0 first
int Stepping = false; // define "Stepping" to false here

int PiezoSensor1 = A0; // first piezo is connected to analog pin 0
int PiezoSensor2 = A1; // second piezo is connected to analog pin 1
int PiezoSensor3 = A2; // third piezo is connected to analog pin 2
int PiezoSensor4 = A3; // fourth piezo is connected to analog pin 3
int PiezoSensor5 = A4; // fifth piezo connected to analog pin 4
int PiezoSensor6 = A5; // sixth piezo connected to analog pin 5

int threshold = 80;  // threshold value to sense the paint hitting the surface

void setup() {
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  //sets pins 8 and 9 as outputs and as low first
  digitalWrite(8, HIGH);
  digitalWrite(9, LOW);

  pinMode(3, INPUT);
  // set the button to pin 3

}

void loop() {


  if (Stepping == true)
    // if Stepping is set to true
  {
    // toggle pin 9 high and low and wait 1ms between toggles
    // if the stepper motor needs to move faster, change delay() to delayMicroseconds()
    digitalWrite(9, HIGH);
    delay(1);
    digitalWrite(9, LOW);
    delay(1);

    //the EasyDriver defaults to 1/8th microstep mode so each time the "digitalWrite(9, HIGH);"
    //call is executed, the stepper motor will move 1/8th of a full step.


    StepCounter = StepCounter + 1;
    // increment the step for one at a time

    if (StepCounter == DISTANCE)
      // if the stepcounter hits "distance"
    {
      StepCounter = 0;
      // set stepcounter back to 0
      Stepping = false;
      // and set the stepping to false
    }
  }

  if (digitalRead(3) == LOW && Stepping == false)
    // wait for a button press
  {
     // toggle pin 9 high and low and wait 1ms between toggles
    // if the stepper motor needs to move faster, change delay() to delayMicroseconds()
    digitalWrite(9, HIGH);
    delay(1);
    digitalWrite(9, LOW);
    delay(1);

    //the EasyDriver defaults to 1/8th microstep mode so each time the "digitalWrite(9, HIGH);"
    //call is executed, the stepper motor will move 1/8th of a full step.


    StepCounter = StepCounter + 1;
    // increment the step for one at a time

    if (StepCounter == 200)
      // if the stepcounter hits "distance"
    {
      StepCounter = 0;
      // set stepcounter back to 0
      Stepping = false;
      // and set the stepping to false

  }
  }

 
  if (analogRead(PiezoSensor1) >= threshold) {
     // if the sensor reading is greater or equal than the threshold:
    Stepping = true;
  }

  if (analogRead(PiezoSensor2) >= threshold) {
    Stepping = true;
  }

  if (analogRead(PiezoSensor3) >= threshold) {
    Stepping = true;
  }

  if (analogRead(PiezoSensor4) >= threshold) {
    Stepping = true;
  }

  if (analogRead(PiezoSensor5) >= threshold) {
    Stepping = true;
  }

  if (analogRead(PiezoSensor6) >= threshold) {
    Stepping = true;
  }



}


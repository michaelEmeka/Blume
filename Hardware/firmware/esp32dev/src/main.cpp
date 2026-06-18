#include <WiFi.h>
#include <WebSocketsClient.h>
#include <NewPing.h>
#include <ArduinoJson.h>
#include <map>

#define SONAR_NUM 2
#define MAX_LEVEL_DISTANCE 20
#define MIN_LEVEL 2
#define MAX_LEVEL 10
//sense
const int ECHO1 = 18;
const int ECHO2 = 23;
const int TRIG1 = 5;
const int TRIG2 = 19;
//act
const int VALVE1 = 0;
const int VALVE2 = 4;
const int PUMP = 14;
//sig
const int BUZZ = 32;

unsigned long previousSensorMillis = 0;
const unsigned long sensorInterval = 2000;

unsigned long previousStreamMillis = 0;
const unsigned long streamInterval = 4000;
//using namespace std;

namespace Devices {
  enum id {
    Valve_1,
    Valve_2,
    Pump
  };
  std::map<id, int> pinMap = {
    { Valve_1, VALVE1 },
    { Valve_2, VALVE2 },
    { Pump, PUMP }
  };
  std::map<id, bool> deviceState = {
    { Valve_1, false },
    { Valve_2, false },
    { Pump, false }
  };
};


namespace Status {
  bool wifiConnected = true;
  bool wsConnected = false;
  bool distanceDataAvailable = false;
};


long waterDistances[2] = { 5, 5 };

NewPing sonar[SONAR_NUM] = {
  NewPing(TRIG1, ECHO1, MAX_LEVEL_DISTANCE),
  NewPing(TRIG2, ECHO2, MAX_LEVEL_DISTANCE)
};


//ws instance/object
WebSocketsClient WebSocket;

//StaticJsonDocument<200> doc;
//StaticJsonDocument<200> json_object;


void initPins() {
  int pins[8] = { ECHO1, ECHO2, TRIG1, TRIG2, VALVE1, VALVE2, PUMP, BUZZ };

  for (int i = 0; i < 8; i++) {
    pinMode(pins[i], i < 2 ? INPUT : OUTPUT);
    digitalWrite(pins[i], LOW);
  }
  //ledcDetach(2);
}

void initNetwork(char* SSID, char* password) {
  //long ws_timeout = 1000;
  WiFi.begin(SSID, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("..connecting");
    digitalWrite(BUZZ, HIGH);
    if (millis() > 10000) {
      Status::wifiConnected = false;
      digitalWrite(BUZZ, LOW);
      break;
    }
  }
  if (Status::wifiConnected)
    Serial.println("WiFi connected successfully!");
    digitalWrite(BUZZ, LOW);
}

void beep(){
  
}

void payloadPackager(String type) {

  //Handler for sending message to backend server
  /**
   * argument:
   * -type: this is the websocket handler type.
   * returns:
   * nothing
   */

  long waterLevel_1, waterLevel_2;
  bool valid_type = false;

  if (!Status::wsConnected)
    return;
  if (!Status::wifiConnected)
    return;
  
  StaticJsonDocument<200> doc;
  String jsonString;

  Serial.println("in payload packager");
  if (type == "stream") {
    // if (waterDistances[0] > MAX_LEVEL + 5 || waterDistances[1] > MAX_LEVEL + 5 || waterDistances[0] < MIN_LEVEL || waterDistances[1] < MIN_LEVEL)
    //   return;

    waterLevel_1 = 100.0f - (((float)(waterDistances[0] - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL + 3)) * 100.0f);
    waterLevel_2 = 100.0f - (((float)(waterDistances[1] - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL + 2)) * 100.0f);

    Serial.printf("Tank 1: %s", String(waterLevel_1));
    Serial.printf("Tank 2: %s", String(waterLevel_2));
    //Serial.println(MAX_LEVEL);

    doc["tank_1"] = int(waterLevel_1);
    doc["tank_2"] = int(waterLevel_2);
    valid_type = true;
  }
  else if (type == "update_active_1") {
    doc["t_1_active"] = bool(Devices::deviceState[Devices::Valve_1]);
    valid_type = true;
  }
  else if (type == "update_active_2") {
    doc["t_2_active"] = bool(Devices::deviceState[Devices::Valve_2]);
    valid_type = true;
  }

  //check if valid type and add consistent details then send
  if (valid_type) {
    doc["type"] = type;
    serializeJson(doc, jsonString);
    Serial.println(jsonString);
    if (Status::wsConnected)
      WebSocket.sendTXT(jsonString);
    doc.clear();
  }
}

int toggleDevice(Devices::id device, int state) {
  //toggles a device HIGH or LOW
  /**
     * arguments:
     * device - the device's id
     * state - state the device is to be toggled to
     * Return: turned state or -1 if pump is attempted to be toggled
     */

  //Only valves can be on directly
  if (device == Devices::Pump)
    return -1;

      //if to ON and device is off
  if (state && !Devices::deviceState[device]) {
    digitalWrite(Devices::pinMap[device], state);
    Devices::deviceState[device] = state;

    //debugging:
    Serial.print("Valve" + String(Devices::id(device) + 1));
    Serial.print(" state is ");
    Serial.println(state);

    //if pump is off, turn on

    if (!Devices::deviceState[Devices::Pump]) {
      digitalWrite(Devices::pinMap[Devices::Pump], !Devices::deviceState[Devices::Pump]);
      Devices::deviceState[Devices::Pump] = !Devices::deviceState[Devices::Pump];

      Serial.print("Pump");
      Serial.print(" state is ");
      Serial.println(digitalRead(Devices::pinMap[Devices::Pump]));
    }
  }
  //if to OFF and device is on
  else if (!state && Devices::deviceState[device]) {
    digitalWrite(Devices::pinMap[device], state);
    Devices::deviceState[device] = state;

    //debugging:
    Serial.print("Valve" + String(Devices::id(device) + 1));
    Serial.print(" state is ");
    Serial.println(state);

    //Check if other valve is also off else dont off pump
    if (!Devices::deviceState[device == Devices::Valve_1 ? Devices::Valve_2 : Devices::Valve_1]) {
      digitalWrite(Devices::pinMap[Devices::Pump], !Devices::deviceState[Devices::Pump]);
      Devices::deviceState[Devices::Pump] = !Devices::deviceState[Devices::Pump];
      //debugging:
      Serial.print("Pump");
      Serial.print(" state is ");
      Serial.println(Devices::deviceState[Devices::Pump]);
    }
  }
  
  return state;
}

void payloadHandler(uint8_t* payload) {

  StaticJsonDocument<200> json_object;
  deserializeJson(json_object, payload);
  String type = json_object["type"];

  Serial.println("in payload handler");

  (type == "update_active_1" || type == "sync") ? toggleDevice(Devices::Valve_1, bool(json_object["t_1_active"])) : 0;
  (type == "update_active_2" || type == "sync") ? toggleDevice(Devices::Valve_2, bool(json_object["t_2_active"])) : 0;

  //neglect stream inbound data
  json_object.clear();
}

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("[WebSocket] Disconnected!");
      Status::wsConnected = false;
      WebSocket.begin("47.84.74.209", 80, "/ws/socket-server/1/?user=esp32");
      WebSocket.onEvent(webSocketEvent);
      break;
    case WStype_CONNECTED:
      //Serial.println("connected");
      Serial.printf("[WebSocket] Connected! %s", payload);
      Status::wsConnected = true;
      //payloadHandler(payload);
      break;
    case WStype_TEXT:
      Serial.printf("[WebSocket] Message received: %s\n", payload);
      payloadHandler(payload);
      break;
    default:
      break;
  }
}

void moderateTank() {
  for (int id = 0; id < 2; id++) {
    //if tank i is at low level and valve is OFF
    if (waterDistances[id] >= MAX_LEVEL && !Devices::deviceState[Devices::id(id)] && waterDistances[id] < 20.0) {
      //open valve i and turn on pump
      toggleDevice(Devices::id(id), HIGH);
      payloadPackager(!Devices::id(id) ? "update_active_1" : "update_active_2");
    }
    //if tank i is at MAX_LEVEL and valve is ON
    if (waterDistances[id] <= MIN_LEVEL && Devices::deviceState[Devices::id(id)]) {
      //int t = i > 0 ? 0 : 1;
      toggleDevice(Devices::id(id), LOW);
      payloadPackager(!Devices::id(id) ? "update_active_1" : "update_active_2");
    }
  }
}

void getTankLevel() {

  double distance;

  for (uint8_t i = 0; i < SONAR_NUM; i++) {
    //delay(50);
    Serial.print("Valve "+ String(i + 1)+ ": ");
    distance = sonar[i].ping_cm();
    if (distance)
      waterDistances[i] = distance;
    Serial.print(distance);
    Serial.println("cm");
  }
}

void setup() {
  Serial.begin(115200);
  initPins();
  initNetwork("0xmiko.net", "12131490");
  if (Status::wifiConnected) {
    WebSocket.begin("47.84.74.209", 80, "/ws/socket-server/1/?user=esp32");
    WebSocket.onEvent(webSocketEvent);
  }
  //delay(1000);
}

void loop() {
  if (Status::wifiConnected)
    WebSocket.loop();
  unsigned long currentMillis = millis();
  if (currentMillis - previousSensorMillis >= sensorInterval) {
    previousSensorMillis = currentMillis;
    getTankLevel();
    moderateTank();
  }
  if (currentMillis - previousStreamMillis >= streamInterval) {
    previousStreamMillis = currentMillis;
    payloadPackager("stream");
  }
}
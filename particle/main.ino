#include "NexaCtrl/NexaCtrl.h"
#include "pid/pid.h"
#include "spark-dallas-temperature/spark-dallas-temperature.h"
#include "OneWire/OneWire.h"

String debug = "debug";
const int EEPROM_START = 0;
const int EEPROM_DEFAULTS_SET = EEPROM_START;
const int EEPROM_CONTROLLED = EEPROM_START + 1;
const int EEPROM_TARGET_TEMPERATURE = EEPROM_START + 2;
const int EEPROM_NEXA_CONTROLLER_ID = EEPROM_START + 6;
const int EEPROM_KP = EEPROM_START + 10;
const int EEPROM_KI = EEPROM_START + 18;
const int EEPROM_KD = EEPROM_START + 26;
const int EEPROM_TRANSMITTER_PAIRED = EEPROM_START + 34;

const int EVENT_TTL = 60;

const int windowLength = 600;
const int temperatureLoopDelay = 5;
int windowLocation = 0;
time_t lastTime = 0;
time_t now = 0;
const int MIN_STATUS_LENGTH = 300;
time_t lastHeat = 0;
time_t lastCool = 0;

const int STATUS_NONE = 0;
const int STATUS_HEAT = 1;
const int STATUS_COOL = 2;

NexaCtrl nexaCtrl(D0, D1);
OneWire oneWire(D2);
DallasTemperature sensors(&oneWire);
double targetTemperature = 20.0;
double currentTemperature;
double output;
double p = 5;
double i = 2;
double d = 0;
PID myPID(&currentTemperature, &output, &targetTemperature, p, i, d, PID::DIRECT);

String pid;
String lastStatus = "none";

int status = STATUS_NONE;
int controlled = 0;
int transmitterPaired = 0;
int eepromDefaults = 20;
int nexaDevice = 0;
int32_t nexaControllerId = 1223334;

void setup() {
    if(EEPROM.read(EEPROM_DEFAULTS_SET) != eepromDefaults) {
        EEPROM.put(EEPROM_CONTROLLED, controlled);
        EEPROM.put(EEPROM_TRANSMITTER_PAIRED, transmitterPaired);
        EEPROM.put(EEPROM_TARGET_TEMPERATURE, targetTemperature);
        //EEPROM.put(EEPROM_NEXA_CONTROLLER_ID, nexaControllerId);
        EEPROM.put(EEPROM_KP, p);
        EEPROM.put(EEPROM_KI, i);
        EEPROM.put(EEPROM_KD, d);
        EEPROM.put(EEPROM_DEFAULTS_SET, eepromDefaults);
    }
    
    EEPROM.get(EEPROM_CONTROLLED, controlled);
    EEPROM.get(EEPROM_TRANSMITTER_PAIRED, transmitterPaired);
    EEPROM.get(EEPROM_TARGET_TEMPERATURE, targetTemperature);
    //EEPROM.get(EEPROM_NEXA_CONTROLLER_ID, nexaControllerId);
    EEPROM.get(EEPROM_KP, p);
    EEPROM.get(EEPROM_KI, i);
    EEPROM.get(EEPROM_KD, d);
    EEPROM.get(EEPROM_DEFAULTS_SET, eepromDefaults);
    
    pid = String(p) + "," + String(i) + "," + String(d);
    sensors.begin();
    myPID.SetOutputLimits(0, windowLength);
    myPID.SetMode(PID::AUTOMATIC);
    Particle.variable("debug", debug);
    Particle.variable("eeprom", eepromDefaults);
    Particle.variable("nexa", nexaControllerId);
    Particle.variable("temperature", currentTemperature);
    Particle.variable("controlled", controlled);
    Particle.variable("paired", transmitterPaired);
    Particle.variable("targetTemp", targetTemperature);
    Particle.variable("pid", pid);
    Particle.variable("status", lastStatus);
    Particle.function("command", handleCommand);

    // set to now so device never starts before a safe time has passed
    lastHeat = Time.now();
    lastCool = Time.now();
}

void loop() {
    sensors.requestTemperatures();
    currentTemperature = sensors.getTempCByIndex(0);
    if(currentTemperature != -127) {
        myPID.Compute();
    }

    now = Time.now();
    if(now > lastTime + temperatureLoopDelay) {
        // update window location
        windowLocation += now - lastTime;
        if(windowLocation > windowLength) {
            windowLocation = 0;
        }
        lastTime = now;
        
        lastStatus = String(status) + "," + String(currentTemperature) + "," + String(targetTemperature) + "," + String(controlled) + "," + String(transmitterPaired) + "," + Time.now() + "000";
        Particle.publish("status", lastStatus, EVENT_TTL, PRIVATE);

        Particle.publish("loop", String(output) + ", " + String(windowLocation), EVENT_TTL, PRIVATE);
        
        // turn cooling device off if not controlled or paired
        if(controlled == 0 || transmitterPaired == 0) {
            none();
            return;
        }
        
        // temperature not connected (properly)
        if(currentTemperature == -127) {
            return;
        }
        
        if(output < windowLocation) {
            cool();
        }
        else {
            heat();
        }
    }
}

void none() {
    Particle.publish("debug", "idling");
    status = STATUS_NONE;
    deviceOff();
    lastHeat = Time.now();
    lastCool = Time.now();
}

void heat() {
    int now = Time.now();
    if(lastCool < (now - MIN_STATUS_LENGTH)) {
        Particle.publish("debug", "heating, " + String(now) + ", " + String(lastCool), EVENT_TTL, PRIVATE);
        status = STATUS_HEAT;
        if(lastCool >= lastHeat) {
            lastHeat = now;
        }
        deviceOff();
    }
    else {
        Particle.publish("debug", "too soon, skipping heating", EVENT_TTL, PRIVATE);
    }
}

void cool() {
    int now = Time.now();
    if(lastHeat < (now - MIN_STATUS_LENGTH)) {
        Particle.publish("debug", "cooling, " + String(now) + ", " + String(lastHeat), EVENT_TTL, PRIVATE);
        lastCool = now;
        status = STATUS_COOL;
        if(lastHeat >= lastCool) {
            lastCool = now;
        }
        deviceOn();
    }
    else {
        Particle.publish("debug", "too soon, skipping cooling", EVENT_TTL, PRIVATE);
    }
}

int deviceOn() {
    nexaCtrl.DeviceOn(nexaControllerId, nexaDevice);
}

int deviceOff() {
    nexaCtrl.DeviceOff(nexaControllerId, nexaDevice);
}

int handleCommand(String commandAndArgs) {
    String command = commandAndArgs.substring(0, commandAndArgs.indexOf(":"));
    String args = commandAndArgs.substring(commandAndArgs.indexOf(":") + 1, commandAndArgs.length());
    debug = args;
    if(command == "nexa") {
        return nexa(args);
    }
    else if(command == "pid") {
        return setPid(args);
    }
    else if(command == "controlled") {
        return setControlled(args);
    }
    else if(command == "targetTemperature") {
        return setTargetTemperature(args);
    }
    else if(command == "transmitterPaired") {
        return setTransmitterPaired(args);
    }
    else return -1;
}

int nexa(String status) {
    if(status == "on") {
        deviceOn();
        return 1;
    }
    else if(status == "off") {
        deviceOff();
        return 1;
    }
    else return -1;
}

int setPid(String newPid) {
    p = atof(newPid.substring(newPid.indexOf("p:") + 2, newPid.indexOf(",i:")));
    i = atof(newPid.substring(newPid.indexOf("i:") + 2, newPid.indexOf(",d:")));
    d = atof(newPid.substring(newPid.indexOf("d:") + 2, newPid.indexOf("}")));
    EEPROM.put(EEPROM_KP, p);
    EEPROM.put(EEPROM_KI, i);
    EEPROM.put(EEPROM_KD, d);
    pid = String(p) + "," + String(i) + "," + String(d);
    myPID.SetTunings(p, i, d);
    return 1;
}

int setTargetTemperature(String newTargetTemperature) {
    status = STATUS_NONE;
    targetTemperature = atof(newTargetTemperature);
    EEPROM.put(EEPROM_TARGET_TEMPERATURE, targetTemperature);
    return 1;
}

int setControlled(String newControlled) {
    if(newControlled == "true") {
        status = STATUS_NONE;
        controlled = 1;
        EEPROM.put(EEPROM_CONTROLLED, controlled);
        return 1;
    }
    else if(newControlled == "false") {
        status = STATUS_NONE;
        controlled = 0;
        EEPROM.put(EEPROM_CONTROLLED, controlled);
        return 1;
    }
    else return -1;
}

int setTransmitterPaired(String newPaired) {
    if(newPaired == "true") {
        transmitterPaired = 1;
        EEPROM.put(EEPROM_TRANSMITTER_PAIRED, transmitterPaired);
        return 1;
    }
    else if(newPaired == "false") {
        transmitterPaired = 0;
        EEPROM.put(EEPROM_TRANSMITTER_PAIRED, transmitterPaired);
        return 1;
    }
    else return -1;
}

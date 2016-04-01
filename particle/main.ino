#include "NexaCtrl/NexaCtrl.h"
#include "pid/pid.h"
#include "spark-dallas-temperature/spark-dallas-temperature.h"
#include "OneWire/OneWire.h"

String debug = "debug";
const int EVENT_TTL = 60;
const int windowLength = 1200;
const int temperatureLoopDelay = 5;
int windowLocation = 0;
time_t lastTime = 0;
time_t now = 0;
const int MIN_COOLING_LENGTH = 60;
const int MIN_HEATING_LENGTH = 300;
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
double p = 2.5;
double i = 0.1;
double d = 0.0;
PID myPID(&currentTemperature, &output, &targetTemperature, p, i, d, PID::REVERSE);

String pid;
String lastStatus = "none";

int status = STATUS_NONE;
int controlled = 0;
int transmitterPaired = 0;
int nexaDevice = 0;
int nexaControllerId = 1223334;

const int EEPROM_START = 0;
struct Store {
    int saved;
    int controlled;
    int transmitterPaired;
    double targetTemperature;
    int nexaControllerId;
    double p;
    double i;
    double d;
};
struct Store store;

void setup() {
    EEPROM.get(EEPROM_START, store);
    if(store.saved != 2) {
        saveStore();
    }
    controlled = store.controlled;
    transmitterPaired = store.transmitterPaired;
    targetTemperature = store.targetTemperature;
    nexaControllerId = store.nexaControllerId;
    p = store.p;
    i = store.i;
    d = store.d;
    
    myPID.SetTunings(p, i, d);
    pid = String(myPID.GetKp()) + "," + String(myPID.GetKi()) + "," + String(myPID.GetKd());
    sensors.begin();
    myPID.SetOutputLimits(0, windowLength);
    myPID.SetMode(PID::AUTOMATIC);
    myPID.SetSampleTime(60000);
    Particle.variable("debug", debug);
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

void saveStore() {
    store.saved = 2;
    store.controlled = controlled;
    store.transmitterPaired = transmitterPaired;
    store.targetTemperature = targetTemperature;
    store.nexaControllerId = nexaControllerId;
    store.p = p;
    store.i = i;
    store.d = d;
    EEPROM.put(EEPROM_START, store);
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
        publish("status", lastStatus);

        publish("loop", String(output) + ", " + String(windowLocation));
        
        // turn cooling device off if not controlled or paired
        if(controlled == 0 || transmitterPaired == 0) {
            none();
            return;
        }
        
        // temperature not connected (properly)
        if(currentTemperature == -127) {
            return;
        }
        
        if(output > windowLocation) {
            cool();
        }
        else {
            heat();
        }
    }
}

void publish(String name, String value) {
    Particle.publish(name, value, EVENT_TTL, PRIVATE);
}

void none() {
    publish("debug", "idling");
    status = STATUS_NONE;
    deviceOff();
    lastHeat = Time.now();
    lastCool = Time.now();
}

void heat() {
    int now = Time.now();
    if(lastCool < (now - MIN_COOLING_LENGTH)) {
        publish("debug", "heating, " + String(now) + ", " + String(lastCool));
        status = STATUS_HEAT;
        if(lastCool >= lastHeat) {
            lastHeat = now;
        }
        deviceOff();
    }
    else {
        publish("debug", "too soon, skipping heating");
    }
}

void cool() {
    int now = Time.now();
    if(lastHeat < (now - MIN_HEATING_LENGTH)) {
        publish("debug", "cooling, " + String(now) + ", " + String(lastHeat));
        lastCool = now;
        status = STATUS_COOL;
        if(lastHeat >= lastCool) {
            lastCool = now;
        }
        deviceOn();
    }
    else {
        publish("debug", "too soon, skipping cooling");
    }
}

int deviceOn() {
    // TODO enable
    nexaCtrl.DeviceOn(nexaControllerId, nexaDevice);
}

int deviceOff() {
    // TODO enable
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
    saveStore();
    myPID.SetTunings(p, i, d);
    pid = String(myPID.GetKp()) + "," + String(myPID.GetKi()) + "," + String(myPID.GetKd());
    return 1;
}

int setTargetTemperature(String newTargetTemperature) {
    status = STATUS_NONE;
    targetTemperature = atof(newTargetTemperature);
    saveStore();
    return 1;
}

int setControlled(String newControlled) {
    if(newControlled == "true") {
        status = STATUS_NONE;
        controlled = 1;
        saveStore();
        return 1;
    }
    else if(newControlled == "false") {
        status = STATUS_NONE;
        controlled = 0;
        saveStore();
        return 1;
    }
    else return -1;
}

int setTransmitterPaired(String newPaired) {
    if(newPaired == "true") {
        transmitterPaired = 1;
        saveStore();
        return 1;
    }
    else if(newPaired == "false") {
        transmitterPaired = 0;
        saveStore();
        return 1;
    }
    else return -1;
}

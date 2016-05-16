#include "NexaCtrl.h"
#include "pid.h"
#include "spark-dallas-temperature.h"
#include "OneWire.h"
#include "PID-AutoTune.h"

const int EVENT_TTL = 60;
const double windowLength = 900;
const int temperatureLoopInterval = 10;
double windowLocation = 0;
time_t lastLoop = 0;
time_t lastTune = 0;
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
double p = 0.4;
double i = 0.00012;
double d = 420;
PID myPID(&currentTemperature, &output, &targetTemperature, p, i, d, PID::REVERSE);
double aTuneStep = 0.3;
double aTuneNoise = 0.2;
double aTuneLookBack = 1200;
double aTuneStartValue = 0.3;
bool tuning = 0;
PID_ATune aTune(&currentTemperature, &output);

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
    setTunings(p, i, d);

    sensors.begin();
    myPID.SetOutputLimits(0, 1);
    myPID.SetMode(PID::AUTOMATIC);
    myPID.SetSampleTime(10000);
    aTune.SetNoiseBand(aTuneNoise);
    aTune.SetOutputStep(aTuneStep);
    aTune.SetLookbackSec(aTuneLookBack);
    aTune.SetControlType(1);
    lastTune = Time.now();
    // set to now so device never starts before a safe time has passed
    lastHeat = Time.now();
    lastCool = Time.now();

    Particle.variable("nexa", nexaControllerId);
    Particle.variable("paired", transmitterPaired);
    Particle.variable("pid", pid);
    Particle.variable("status", lastStatus);
    Particle.function("command", handleCommand);
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
        if(tuning == 1) {
            bool tuningFinished = aTune.Runtime() != 0;
            if(tuningFinished) {
                tuning = 0;
                p = aTune.GetKp();
                i = aTune.GetKi();
                d = aTune.GetKd();
                setTunings(p, i, d);
                resetPid();
            }
        }
        else {
            myPID.Compute();
        }
    }

    now = Time.now();
    if(now > lastLoop + temperatureLoopInterval) {
        // update window location
        windowLocation += now - lastLoop;
        if(windowLocation > windowLength) {
            windowLocation = 0;
        }
        lastLoop = now;
        
        lastStatus = String(status) + "," + String(currentTemperature) + "," + String(targetTemperature) + "," + String(controlled) + "," + String(transmitterPaired) + "," + Time.now() + "000" + "," + String(tuning);
        publish("status", lastStatus);
        publish("loop", String(output) + ", " + String(windowLocation / windowLength) + "," + String(windowLocation) + "," + String(windowLength));

        if(tuning == 1 || (controlled == 1 && transmitterPaired == 1)) {
            if(output > 0 && windowLocation / windowLength <= output) {
                cool();
            }
            else {
                heat();
            }
        }
        else {
            none();
        }
    }
}

void setTunings(double p, double i, double d) {
    myPID.SetTunings(p, i, d);
    pid = String(myPID.GetKp()) + "," + String(myPID.GetKi()) + "," + String(myPID.GetKd()) + "," + String(tuning);
    saveStore();
}

void publish(String name, String value) {
    Particle.publish(name, value, EVENT_TTL, PRIVATE);
}

void none() {
    status = STATUS_NONE;
    heat();
}

void heat() {
    int now = Time.now();
    if(lastCool < (now - MIN_COOLING_LENGTH)) {
        status = STATUS_HEAT;
        if(lastCool >= lastHeat) {
            lastHeat = now;
        }
        deviceOff();
    }
    else {
    }
}

void cool() {
    int now = Time.now();
    if(lastHeat < (now - MIN_HEATING_LENGTH)) {
        lastCool = now;
        status = STATUS_COOL;
        if(lastHeat >= lastCool) {
            lastCool = now;
        }
        deviceOn();
    }
    else {
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
    else if(command == "resetPid") {
        return resetPid();
    }
    else if(command == "autotune") {
        return autotune(args);
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

int resetPid() {
    myPID.SetMode(PID::MANUAL);
    myPID.SetMode(PID::AUTOMATIC);
    return 1;
}

int setPid(String newPid) {
    p = atof(newPid.substring(newPid.indexOf("p:") + 2, newPid.indexOf(",i:")));
    i = atof(newPid.substring(newPid.indexOf("i:") + 2, newPid.indexOf(",d:")));
    d = atof(newPid.substring(newPid.indexOf("d:") + 2, newPid.indexOf("}")));
    setTunings(p, i, d);
    return 1;
}

int autotune(String state) {
    if(state == "on") {
        tuning = 1;
        lastTune = Time.now();
        output = aTuneStartValue;
        return 1;
    }
    else if(state == "off") {
        tuning = 0;
        aTune.Cancel();
        return 1;
    }
    else return -1;
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

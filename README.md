# Fermtempctrl

Temperature controller for fermenting beer (or anything else). Measures the temperature of a fridge/freezer and turns it on and off using a wireless power socket to achieve the desired temperature.

![Screenshot 1](https://raw.githubusercontent.com/akileh/fermtempctrl/master/images/ss1.png)
![Screenshot 2](https://raw.githubusercontent.com/akileh/fermtempctrl/master/images/ss2.png)
![Hardware 1](https://raw.githubusercontent.com/akileh/fermtempctrl/master/images/hw1.jpg)

## Hardware

* [Particle Photon](https://www.particle.io/)
* Nexa EYCR-2300 wireless power socket
* 433 MHz transmitter
* DS1820 temperature sensor
* 4.7kOhm resistor (for the temperature sensor)
* Some wires and a protoboard

Connect the 433MHz transmitter to D0 and DS1820 temperature sensor to D2.

Currently only the Nexa power socket is supported (since it's the one I use) but adding similar devices shouldn't be hard.

## Flashing particle device

Flashing via ui is currently not working, in the mean time do this:

    npm run particle-login
    // where foo is your device name
    DEVICE=foo npm run particle-flash
    npm run particle-logout

## Development

    // start server on default port 3000
    npm run start-dev

    // compile and watch changes in client
    npm run bundle-dev

    // or both
    npm run dev

    // lint
    npm run lint

## Configuration
With prefixed environment variables. All defaults are defined in ['server/appConfig.js'](server/appConfig.js).

    // e.g. change port
    ft_port=4000 npm start

    // or enable basic auth
    export ft_authEnabled=true
    export ft_authUser=foo
    export ft_authPass=bar
    npm start

## Running

    npm run build
    npm run start

Heroku should "just work" (protip: check the maxDbRows option)

    git push heroku master

## PID autotuning

  Autotuning the PID values uses [this](http://playground.arduino.cc/Code/PIDAutotuneLibrary). Description what it does is [here](http://playground.arduino.cc/Code/PIDAutotuneLibrary).


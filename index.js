'use strict';
const pkg = require('./package.json');
const PhilipsTV = require('./PhilipsTV.js');
const AmbilightModes = require('./AmbilightModes');
const pluginName = pkg.name;
const accessoryName = 'PhilipsTV2';

class PhilipsTvAccessory {

    state = {
        power: true,
        ambilight: true,
        source: 0,
        volume: 0,
    };

    config = {};
    services = [];
    tvService = null;

    constructor(log, config) {
        this.config = {...this.config, ...config};
        this.PhilipsTV = new PhilipsTV(config);

        this.registerAccessoryInformationService();
        this.registerTelevisionService();
        // this.registerVolumeService();

        if (config.has_ambilight) {
            this.registerAmbilightService();
            this.registerAmbilightInputs();
        }
    }

    identify(callback) {
        callback(); // success
    };

    registerAccessoryInformationService = () => {
        const {name, model_year} = this.config;
        const {Name, Manufacturer, Model, FirmwareRevision} = Characteristic;

        const infoService = new Service.AccessoryInformation();
        infoService
            .setCharacteristic(Name, name)
            .setCharacteristic(Manufacturer, "Philips")
            .setCharacteristic(Model, "Year " + model_year)
            .setCharacteristic(FirmwareRevision, pkg.version);
        this.services.push(infoService);
    };

    registerTelevisionService = () => {

        const {name, poll_status_interval} = this.config;
        const {ConfiguredName, SleepDiscoveryMode, Active} = Characteristic;
        const tvService = new Service.Television(name, "Television");
        const power = tvService.getCharacteristic(Active);

        tvService.setCharacteristic(ConfiguredName, name);
        tvService.setCharacteristic(SleepDiscoveryMode, SleepDiscoveryMode.ALWAYS_DISCOVERABLE);

        power.on('get', this.PhilipsTV.getPowerState);
        power.on('set', (value, callback) => {
            this.state.power = value;
            this.PhilipsTV.setPowerState(value, callback)
        });

        if (poll_status_interval) {
            setInterval(() => {
                this.PhilipsTV.getPowerState((err, value) => {
                    if (this.state.power !== value) {
                        this.state.power = value;
                        power.updateValue(value)
                    }
                })
            }, poll_status_interval * 1000);
        }

        this.tvService = tvService;
        this.services.push(tvService);
    };

    registerInputService = () => {
        const {inputs} = this.config;
        const {ActiveIdentifier} = Characteristic;

        this.tvService.setCharacteristic(ActiveIdentifier, 1);
        this.tvService.getCharacteristic(ActiveIdentifier)
            .on('get', callback => {
                this.PhilipsTV.getCurrentSource(inputs).then((source) => {
                    this.state.source = source;
                    callback(null, this.state.source)
                });
            })
            .on('set', (value, callback) => {
                this.state.source = value;
                const input = inputs[value];
                this.PhilipsTV.setSource(input, callback);
            });

        inputs.forEach((item, index) => {
            const input = this.createInputSource(item.name, item.name, index);
            this.tvService.addLinkedService(input);
            this.services.push(input);
        });
    };

    registerAmbilightService = () => {
        const {accessory, name} = this.config.ambilight;
        const {poll_status_interval} = this.config;
        const {ConfiguredName, SleepDiscoveryMode, Active} = Characteristic;
        const ambService = new Service.Television(name, "Television");
        const power = ambService.getCharacteristic(Active);

        ambService.setCharacteristic(ConfiguredName, name);
        ambService.setCharacteristic(SleepDiscoveryMode, SleepDiscoveryMode.ALWAYS_DISCOVERABLE);

        power.on('get', this.PhilipsTV.ambilight.getState);
        power.on('set', (value, callback) => {
            this.state.power = value;
            this.PhilipsTV.ambilight.setState(value, callback);
        });

        if (poll_status_interval) {
            setInterval(() => {
                this.PhilipsTV.ambilight.getState((err, value) => {
                    if (this.state.power !== value) {
                        this.state.power = value;
                        power.updateValue(value);
                    }
                })
            }, poll_status_interval * 1000);
        }

        this.ambService = ambService;
        this.services.push(ambService);
    };

    registerAmbilightInputs = () => {
        // const {inputs} = this.config;
        const {ActiveIdentifier} = Characteristic;

        this.ambService.setCharacteristic(ActiveIdentifier, 1);
        this.ambService.getCharacteristic(ActiveIdentifier)
            .on('get', callback => {
                this.PhilipsTV.ambilight.getMode((err, data) => {
                    AmbilightModes.forEach((mode, i) => {
                        mode["items"].forEach((item, j) => {
                            if (item["displayName"] === data["displayName"]) {
                                this.state.source = item["displayName"];
                                callback(null, this.state.source)
                                return;
                            }
                        })
                    })
                })
            })
            .on('set', (value, callback) => {
                this.state.source = value;
                AmbilightModes.forEach((mode, i) => {
                    mode["items"].forEach((item, j) => {
                        if (value === item["displayName"]) {
                            this.PhilipsTV.ambilight.setMode(mode["styleName"], item["menuSetting"], (err, res) => {
                                console.log(err);
                                console.log(res);
                            })
                            return;
                        }
                    })
                })
            });

        AmbilightModes.forEach((mode, i) => {
            mode["items"].forEach((item, j) => {
                const inp = this.createInputSource(item["displayName"], item["displayName"], item["index"]);
                this.ambService.addLinkedService(inp);
                this.services.push(inp);
            })
        })
    }

    // registerAmbilightService = () => {
    //     const {name, poll_status_interval} = this.config;
    //
    //     this.ambilightService = new Service.Lightbulb(name + " Ambilight", "tvAmbilight");
    //     const ambilightPower = this.ambilightService.getCharacteristic(Characteristic.On);
    //     ambilightPower
    //         .on('get', this.PhilipsTV.getAmbilightState)
    //         .on('set', (value, callback) => {
    //             this.state.ambilight = value;
    //             this.PhilipsTV.setAmbilightState(value, callback)
    //         });
    //     this.services.push(this.ambilightService);
    //
    //     if (poll_status_interval) {
    //         setInterval(() => {
    //             this.PhilipsTV.getAmbilightState((err, value) => {
    //                 if (this.state.ambilight !== value) {
    //                     this.state.ambilight = value;
    //                     ambilightPower.updateValue(value)
    //                 }
    //             })
    //         }, poll_status_interval * 1000);
    //     }
    // };

    registerNewAmbilightService = () => {

    }

    // registerPictureModeService = () => {
    //     const {name, poll_status_interval} = this.config;
    // }

    registerVolumeService = () => {
        const {name, poll_status_interval} = this.config;

        this.volumeService = new Service.Lightbulb(name + " Volume", "tvVolume");
        this.volumeService
            .getCharacteristic(Characteristic.On)
            .on('get', (callback) => {
                callback(null, 1)
            })
            .on('set', (value, callback) => {
                this.PhilipsTV.setMuteState(value, callback)
            });
        const volumeLevel = this.volumeService
            .getCharacteristic(Characteristic.Brightness);
        volumeLevel
            .on('get', this.PhilipsTV.getVolumeState)
            .on('set', (value, callback) => {
                this.state.volume = value;
                this.PhilipsTV.setVolumeState(value, callback)
            });
        if (poll_status_interval) {
            setInterval(() => {
                this.PhilipsTV.getVolumeState((err, value) => {
                    if (this.state.volume !== value) {
                        this.state.volume = value;
                        volumeLevel.updateValue(value)
                    }
                })
            }, poll_status_interval * 1000);
        }
        this.services.push(this.volumeService);
    };

    createInputSource(id, name, number, type = Characteristic.InputSourceType.TV) {
        const {Identifier, ConfiguredName, IsConfigured, InputSourceType} = Characteristic;
        const input = new Service.InputSource(id, name);
        input.setCharacteristic(Identifier, number)
            .setCharacteristic(ConfiguredName, name)
            .setCharacteristic(IsConfigured, IsConfigured.CONFIGURED)
            .setCharacteristic(InputSourceType, type);
        return input;
    }

    getServices() {
        return this.services;
    }
}

let Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory(pluginName, accessoryName, PhilipsTvAccessory);
};

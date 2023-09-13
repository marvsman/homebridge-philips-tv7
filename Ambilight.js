class Ambilight {
    constructor(api) {
        this.api = api;
    }

    getBrightness = (callback = null) => {
        let body = {"nodes": [{"nodeid": 2131230769}]}
        this.api("menuitems/settings/current", JSON.stringify(body))
            .then((data) => {
                console.log(JSON.stringify(data));
                let level = data["values"][0]["value"]["data"]["value"];
                callback && callback(null, level);
            })
            .catch(() => {
                callback && callback(null, null);
            })
    }

    setBrightness = (value, callback = null) => {
        let body = {
            "values": [
                {"value": {"Nodeid": 2131230769, "data": {"value": value}}}
            ]
        }
        this.api("menuitems/settings/update", JSON.stringify(body))
            .then((data) => {
                console.log(JSON.stringify(data));
                callback && callback(null, true)
            })
            .catch(() => {
                callback && callback(null, false)
            })
    }

    getState = (callback = null) => {
        this.api("ambilight/power")
            .then((data) => {
                callback && callback(null, data.power === "On");
            })
            .catch(() => {
                callback && callback(null, null);
            });
    };

    setState = (value = false, callback = null) => {
        // let body = { power: value ? "Off" : "On" };
        let body = {"power": value ? "On" : "Off"};
        console.log(body);
        this.api("ambilight/power", JSON.stringify(body))
            .then((data) => {
                console.log(data);
                callback && callback(null, value);
            })
            .catch(() => {
                callback && callback(null, false);
            });
    };

    getMode = (callback = null) => {
        this.api("ambilight/currentconfiguration")
            .then((data) => {
                callback && callback(null, data);
            })
            .catch(() => {
                callback && callback(null, null);
            })
    }

    setMode = (styleName, menuSetting, callback) => {
        let body = {
            "styleName": styleName,
            "menuSetting": menuSetting,
            "isExpert": false,
        }
        this.api("ambilight/currentconfiguration", JSON.stringify(body))
            .then((data) => {
                callback && callback(null, true);
            })
            .catch(() => {
                callback && callback(null, false);
            })
    }
}

module.exports = Ambilight;

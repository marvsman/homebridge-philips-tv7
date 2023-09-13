"use strict";

const pkg = require("./package.json");
const PhilipsTV = require("./PhilipsTV.js");
const AmbilightModes = require("./AmbilightModes");
const pluginName = pkg.name;
const accessoryName = "PhilipsTV";

let config = {
    accessory: "PhilipsTV",
    name: "Television",
    ip_address: "192.168.0.32",
    poll_status_interval: 30,
    model_year: 2016,
    has_ambilight: true,
    username: "f52bfcqkqBF8pu4i",
    password: "17e7288a82cc835939766d41d4905420a4c2f36027473124ce1ec2e44e304da7",
    inputs: [
        {
            name: "TV Mode",
        },
        {
            name: "Youtube",
            launch: {
                intent: {
                    component: {
                        packageName: "com.google.android.youtube.tv",
                        className:
                            "com.google.android.apps.youtube.tv.activity.ShellActivity",
                    },
                    action: "android.intent.action.MAIN",
                },
            },
        },
        {
            name: "Netflix",
            launch: {
                intent: {
                    component: {
                        packageName: "com.netflix.ninja",
                        className: "com.netflix.ninja.MainActivity",
                    },
                    action: "android.intent.action.MAIN",
                },
            },
        },
        {
            name: "Fox",
            channel: 9,
        },
        {
            name: "TV 8",
            channel: 8,
        },
        {
            name: "Kanal D",
            channel: 3,
        },
        {
            name: "ATV",
            channel: 2,
        },
        {
            name: "Star TV",
            channel: 4,
        },
    ],
};

let tv = new PhilipsTV(config);

// tv.ambilight.getMode((err, data) => {
//     console.log(JSON.stringify(data));
// })
//
// tv.ambilight.setMode("FOLLOW_COLOR", "HOT_LAVA", (err, data) => {
//     console.log(JSON.stringify(data));
// })

AmbilightModes.forEach((mode, menuItem) => {
    mode["items"].forEach((item, i) => {
        console.log(item)
    })
    // console.log(menuItem)
})

// let old_value = 0;
// let call = async () => {
//     tv.amb.getBrightness((err, value) => {
//         old_value = value;
//         console.log(old_value);
//     })
//     tv.amb.setBrightness(10);
//     await new Promise(r => setTimeout(r, 2000));
//
//     tv.amb.getBrightness((err, value) => {
//         console.log(value);
//     })
//
//     tv.amb.setBrightness(old_value);
//
//     tv.amb.getBrightness((err, value) => {
//         console.log(value);
//     })
// }
// call().then()


// tv.getPictureMode((err, data) => {
//     console.log(`current picture mode: ${data}`)
// })
// tv.setPictureMode(11, (err, data) => {
//     console.log(data);
// })
// tv.getPictureMode((err, data) => {
//     console.log(`current picture mode: ${data}`)
// })

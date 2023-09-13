const AmbilightModes = [
    {
        name: "video",
        styleName: "FOLLOW_VIDEO",
        items: [
            {index: 1, menuSetting: "STANDARD", displayName: "[V] Standard"},
            {index: 2, menuSetting: "NATURAL", displayName: "[V] Natural"},
            {index: 3, menuSetting: "FOOTBALL", displayName: "[V] Football"},
            {index: 4, menuSetting: "VIVID", displayName: "[V] Vivid"},
            {index: 5, menuSetting: "GAME", displayName: "[V] Game"},
            {index: 6, menuSetting: "COMFORT", displayName: "[V] Comfort"},
            {index: 7, menuSetting: "RELAX", displayName: "[V] Relax"},
        ]
    },
    {
        name: "audio",
        styleName: "FOLLOW_AUDIO",
        items: [
            {index: 8, menuSetting: "ENERGY_ADAPTIVE_BRIGHTNESS", displayName: "[A] Lumina"},
            {index: 9, menuSetting: "ENERGY_ADAPTIVE_COLORS", displayName: "[A] Colora"},
            {index: 10, menuSetting: "VU_METER", displayName: "[A] Retro"},
            {index: 11, menuSetting: "SPECTRUM_ANALYSER", displayName: "[A] Spectrum"},
            {index: 12, menuSetting: "KNIGHT_RIDER_ALTERNATING", displayName: "[A] Scanner"},
            {index: 13, menuSetting: "RANDOM_PIXEL_FLASH", displayName: "[A] Rhythm"},
            {index: 14, menuSetting: "MODE_RANDOM", displayName: "[A] Party"},
        ]
    },
    {
        name: "color",
        styleName: "FOLLOW_COLOR",
        items: [
            {index: 15, menuSetting: "HOT_LAVA", displayName: "[C] Hot Lava"},
            {index: 16, menuSetting: "DEEP_WATER", displayName: "[C] Deep Water"},
            {index: 17, menuSetting: "FRESH_NATURE", displayName: "[C] Fresh Nature"},
            {index: 18, menuSetting: "ISF", displayName: "[C] Warm White"},
            {index: 29, menuSetting: "PTA_LOUNGE", displayName: "[C] Cool White"},
        ]
    }
];

module.exports = AmbilightModes;
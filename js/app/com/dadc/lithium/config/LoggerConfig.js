var LoggerConfig = function(){}

// DEV
LoggerConfig.CONFIG = {
    PLAY_VIDEOS: true, // set to false in simulations as createVideo calls don't work
    MODEL_DEBUG: false,
    UPDATE_DEBUG: false,
    EXTRA_KEYINPUTS: false, //No idea.
    SKIP_ADS: false,
    PSN_CHECK: false, 
    DISABLE_LOGS: false,
    SHOW_SUBTITLES: true,
    SECURE:false
};

// LoggerConfig.FREEWHEEL = {
//        // TEST
//     // FREEWHEEL_URL: "http://23adc.v.fwmrm.net/ad/g/1",
//     // FREEWHEEL_NETWORK_ID: 146140,
//     // FREEWHEEL_PROFILE: "crackle_"+engine.stats.device.platform+"_test"
//     //FREEWHEEL_PROFILE: "crackle_ps3_test"

//        // PRODUCTION
//     FREEWHEEL_URL: "http://2517d.v.fwmrm.net/ad/g/1",
//     FREEWHEEL_NETWORK_ID: 151933,
//     //FREEWHEEL_PROFILE: "crackle_"+engine.stats.device.platform+"_live"
//     FREEWHEEL_PROFILE: "crackle_ps3_live"
// };

LoggerConfig.GeocodeConfig = {
    // LEAVE IT EMPTY TO ALLOW ALL COUNTRIES
    ALLOWED_COUNTRIES: [], 
    
    // FORCING TO BRAZIL
    //FAKE_COUNTRY: 'BR',
    
    // FORCING TO MX
    //FAKE_COUNTRY: 'MX' 
}

LoggerConfig.PSN = {
    //US
    PS4: "US0007-CUSA00059_00",
    PS3: "US0007-NPUP00077_00"
}

// PRODUCTION
/*
LoggerConfig.CONFIG = {
    PLAY_VIDEOS: true, // set to false in simulations as createVideo calls don't work
    MODEL_DEBUG: false,
    UPDATE_DEBUG: false,
    EXTRA_KEYINPUTS: false, //No idea.
    SKIP_ADS: false,
    PSN_CHECK: true, 
    DISABLE_LOGS: true,
    SHOW_SUBTITLES: true,
    SECURE:true
};

LoggerConfig.FREEWHEEL = {
    FREEWHEEL_URL: "http://2517d.v.fwmrm.net/ad/g/1",
    FREEWHEEL_NETWORK_ID: 151933,
    FREEWHEEL_PROFILE: "crackle_"+engine.stats.device.platform+"_live"
};

LoggerConfig.GeocodeConfig = {
    // LEAVE IT EMPTY TO ALLOW ALL COUNTRIES
    ALLOWED_COUNTRIES: [ ], 

    // BRAZIL
    //FAKE_COUNTRY: 'BR',
    
    // MEXICO
    //FAKE_COUNTRY: 'MX' 
}

//Make sure to use only the correct one here.
LoggerConfig.PSN = {
    
    //US
    //PS3: "US0007-NPUP00077_00",
    //LATAM
    //PS3: "US0007-NPUP00074_00",
    //CA
    //PS3: "US0007-NPUP00072_00",   
    //AU
    //PS3: "US0007-NPUP00074_00",
    
    PS4: "US0007-CUSA00059_00",
    VITA: "US0007-PCSE00222_00"
}
*/

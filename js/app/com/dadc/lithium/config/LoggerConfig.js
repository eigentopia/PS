var LoggerConfig = function(){}

// DEV
LoggerConfig.CONFIG = {
    PLAY_VIDEOS: true, // set to false in simulations as createVideo calls don't work
    MODEL_DEBUG: false,
    UPDATE_DEBUG: false,
    EXTRA_KEYINPUTS: false, //No idea.
    SKIP_ADS: false,
    PSN_CHECK: true, 
    DISABLE_LOGS: false,
    SHOW_SUBTITLES: true,
    SECURE:false
};

LoggerConfig.GeocodeConfig = {
    // LEAVE IT EMPTY TO ALLOW ALL COUNTRIES
    ALLOWED_COUNTRIES: [], 
    
    // FORCING TO BRAZIL
    //FAKE_COUNTRY: 'BR',
    
    // FORCING TO MX
    //FAKE_COUNTRY: 'MX' 
}

LoggerConfig.PSN = {
    //ALL
    PS4: "US0007-CUSA00059_00",
    //Name: US0007-CUSA00059_00-CRACKLEPS4TRILIT
    
    //PKG builder settings:
    //passcode == dgBwZnlECk7SyGlI913xtlnmHRzKfNnk
    //demo app
    //TV Video service native app
    //if PATCH- point to PKG in PS4 directory
    //
    //PARAMSFO
    //cross button enter.
    //Display location; TV & Video

    //US
    PS3: "US0007-NPUP00077_00",
    //LATAM
    //PS3: "US0007-NPUP00074_00",
    //CA
    //PS3: "US0007-NPUP00072_00",   
    //AU
    //PS3: "US0007-NPUP00074_00",

    //PS3:LOCALEPLACEHOLDER
}


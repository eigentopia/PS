// TESTING
var LoggerConfig = function(){}

// TEST
LoggerConfig.CONFIG = {
    SHOW_ANALYTICS_XMLS: false,
    PLAY_VIDEOS: true, // set to false in simulations as createVideo calls don't work
    MODEL_DEBUG: false,
    UNIT_TESTS: false,
    UPDATE_DEBUG: false,
    EXTRA_KEYINPUTS: false,
    SKIP_ADS: false,
    PSN_CHECK: true, 
    DISABLE_LOGS: false,
    SHOW_SUBTITLES: true,
    WEBGL:false,
    SECURE:false
};

// PRODUCTION
//LoggerConfig.CONFIG = {
//    SHOW_ANALYTICS_XMLS: false,
//    PLAY_VIDEOS: true, // set to false in simulations as createVideo calls don't work
//    MODEL_DEBUG: false,
//    UNIT_TESTS: false,
//    UPDATE_DEBUG: false,
//    EXTRA_KEYINPUTS: false,
//    SKIP_ADS: false,
//    PSN_CHECK: true,
//    DISABLE_LOGS: true,
//    SHOW_SUBTITLES: true,
//    WEBGL:false,
//    SECURE:true
//};

include( "js/app/com/dadc/lithium/media/JSVideo.js" );

// MILAN: REFACTORING "MULTIPLE CREATIVES BUG" SOLUTION
var FreewheelVideo = function( adHeaderObj, FreewheelEventCallbackHelperObj, FreewheelPlaylistObj, creativeID, renditionID, mediaObj )
{
    Logger.log("new FreewheelVideo created: " +
    "adHeaderObj: " + adHeaderObj + 
    ", freewheelEventCallbackHelperObj: " + FreewheelEventCallbackHelperObj +
    ", freewheelPlaylistObj: " + FreewheelPlaylistObj + 
    ", creativeID: " + creativeID + 
    ", renditionID: " + renditionID);

    var This = this;
    var m_playback_listeners        = [];
    var m_playback_marks_tc     = [];
    //var m_playback_marks_map      = {};
    var m_marks_finalized       = false;
    //var m_previous_time           = 0;
    var m_current_time          = 0;  
    var m_video_config          = VideoManager.VIDEOCONFIG.TYPE_MP4;
    var m_stalling_start_time       = null;
    
    var m_0hasFired         = false;
    var m_25hasFired            = false;
    var m_50hasFired            = false;
    var m_75hasFired            = false;
    var currentAdBreak = null
    
    this.getResumeTime = function() { return m_current_time; };
    this.getWidth = function() { return 1920; };
    this.getHeight = function() { return 1080; };
    this.getVideoConfig = function() { return m_video_config; };
    
    this.addPlaybackListener = function( playbackListener )
    {
    if( typeof playbackListener !== "undefined" )
        m_playback_listeners.push( playbackListener );
    else Logger.log("FreewheelVideo.addPlaybackListener(" + typeof playbackListener + ") invalid arg");
    };
    
    this.addPlaybackMark = function( double_time_in_seconds )
    {
        if( m_marks_finalized === false )
    {
            m_playback_marks_tc.push( double_time_in_seconds );
        }
    };
    
    // MILAN: REFACTORING "MULTIPLE CREATIVES BUG" SOLUTION
    this.getVideoURL = function()
    {
    Logger.log( 'FreewheelVideo.getVideoURL()' );
        var url = adHeaderObj.getVideoUrl(creativeID, renditionID);
    Logger.log("FreewheelVideo.getVideoURL() - url: " + url);
        return url;
    };
    
    /** begin ad playback */
    this.play = function(adBreak)
    {
        Logger.log( 'FreewheelVideo.play()' );
        VideoManagerInstance.play( this );
        currentAdBreak = adBreak
        return true;
        // if( VideoManagerInstance.play( this ) === true )
        // {
        //     AnalyticsManagerInstance.fireAdStartEvent(mediaObj);
        //     FreewheelEventCallbackHelperObj.postSlotImpressionUrls();
        //     adHeaderObj.postImpressionUrls();
        //     FreewheelEventCallbackHelperObj.postImpressionUrls();
        //     //Comscore.sendClip(adBreak);
        //     return true;
        // }
        // else return false;
    };
    
    /** stop ad playback */
    this.stop = function()
    {
        Logger.log("FreewheelVideo.stop()");
        if( VideoManagerInstance.getCurrentJSVideo() === this ){
            Logger.log("FreewheelVideo.stop() - will stop");
            VideoManagerInstance.stop();
            VideoManagerInstance.close();
            currentAdBreak = null;
        }
        else{
            Logger.log("FreewheelVideo.stop() - will not stop");
        }
    };
    
    
    // DETECT MARK REACHED EVENTS AND DISPATCH
    this.onTimeUpdate = function( currentTime, currentPTS ){
        var duration = adHeaderObj.getDuration();
        
        m_stalling_start_time = null;
            //m_previous_time = m_current_time;
            m_current_time = currentTime;
        
        if( currentTime >= 0 ){
            if( m_0hasFired === false ){
                Logger.log("FreewheelAdVideo - FIRING START EVENTS");
                m_0hasFired = true;
                adHeaderObj.postPlayUrls();
                FreewheelEventCallbackHelperObj.postPlayUrls();
            }
        }
        if( currentTime >= duration * 0.25 ){
            if( m_25hasFired === false ){
                Logger.log("FreewheelAdVideo - FIRING 25% QUARTILE");
                m_25hasFired = true;
                adHeaderObj.postFirstQuartileTrackingUrls();
                FreewheelEventCallbackHelperObj.postFirstQuartileTrackingUrls();
            }
        }
        if( currentTime >= duration * 0.5 ){
            if( m_50hasFired === false ){
                Logger.log("FreewheelAdVideo - FIRING 50% QUARTILE");
                m_50hasFired = true;
                adHeaderObj.postMidPointTrackingUrls();
                FreewheelEventCallbackHelperObj.postMidpointTrackingUrls();
            }
        }
        if( currentTime >= duration * 0.75 ){
            if( m_75hasFired === false ){
                Logger.log("FreewheelAdVideo - FIRING 75% QUARTILE");
                m_75hasFired = true;
                adHeaderObj.postThirdQuartileTrackingUrls();
                FreewheelEventCallbackHelperObj.postThirdQuartileTrackingUrls();
            }
        }
    };

    this.onOpened = function(){
        AnalyticsManagerInstance.fireAdStartEvent(mediaObj);
        FreewheelEventCallbackHelperObj.postSlotImpressionUrls();
        adHeaderObj.postImpressionUrls();
        FreewheelEventCallbackHelperObj.postImpressionUrls();
        Comscore.sendClip(currentAdBreak); 
    }
    
    this.onEnded = function(){

        //This is the true ending point- everything terminates here.
        Logger.log( 'FreewheelAdVideo.onEnded()' );
        Logger.shout("FreewheelAdVideo - FIRING COMPLETE");
        adHeaderObj.postCompleteTrackingUrls();
        FreewheelEventCallbackHelperObj.postCompleteTrackingUrls();
        currentAdBreak = null;
    
        if( typeof ImpressionTracker !== "undefined" ){
            ImpressionTracker.report();
        }
    
        FreewheelPlaylistObj.onEnded( This );
    
       //notifyListeners( new EndOfMediaEvent( ) );
    };
    
    this.onError = function(){
        // TODO: POST ERROR URL
        FreewheelPlaylistObj.onEnded( This );
       // notifyListeners( new PlaybackError( VideoManagerInstance.getPlaybackTimePTS() ) );
    };
    
    this.onPlaying = function(){
        m_stalling_start_time = null;
        //notifyListeners( new PlayingEvent( VideoManagerInstance.getPlaybackTimePTS() ) );
    };
    
    this.onStalled = function(){
        //Logger.log('FreewheelVideo.onStalled()');
        
        // MILAN: Ad stall infinite timeout fix
        if(m_stalling_start_time === null){ 
            m_stalling_start_time = engine.getTimer();
        }
        else {
            var current_time = engine.getTimer();
            //Logger.log(current_time + " - " + m_stalling_start_time);
            if (current_time - m_stalling_start_time > 10){
                Logger.log("* GIVING UP ON AD PLAY * STALLED FOR TO LONG *");
                m_stalling_start_time = null;
                FreewheelPlaylistObj.onEnded(); 
            }
        }
    };
    
    this.setVideoConfig = function( FreewheelVideo_VIDEOCONFIG_TYPE )
    {
    if( typeof FreewheelVideo_VIDEOCONFIG_TYPE !== "undefined" )
        m_video_config = FreewheelVideo_VIDEOCONFIG_TYPE;
    else Logger.log("FreewheelAdVideo.setVideoConfig(" + typeof FreewheelVideo_VIDEOCONFIG_TYPE + ") invalid arg");
    };
    
//    function finalizePlaybackMarks()
//    {
//  Logger.shout("FreewheelAdVideo.finalizePlaybackMarks() - m_playback_marks_tc.length = " + m_playback_marks_tc.length);
//        m_playback_marks_tc.sort( function( a, b ){return a - b;} );
//        for( var i = 0; i < m_playback_marks_tc.length; i++ )
//  {
//            // create an object entry: time => mark number (eg: 4351112 => 56)
//            m_playback_marks_map[ m_playback_marks_tc[ i ] ] = ( i + 1 );
//        }
//    }    

//    function notifyListeners( playbackEventObj )
//    {
//  if( typeof playbackEventObj === "undefined" )
//  {
//      Logger.log("FreewheelAdVideo.notifyListener(" + typeof playbackEventObj +") invalid arg");
//      return;
//  }
//  
//        Logger.log("FreewheelAdVideo.notifyListeners() eventType: " + playbackEventObj.getEventType() );
//  Logger.shout("FreewheelAdVideo.notifyListeners() m_playback_listeners.length = " + m_playback_listeners.length);
//        
//        for( var i = 0; i < m_playback_listeners.length; i++ )
//  {
//      m_playback_listeners[ i ].notifyPlaybackEvent( playbackEventObj, This );
//        }
//    }
    
//    function addMarks()
//    {
//  Logger.log("FreewheelAdVideo.addMarks() - creativeID: " + creativeID);
//  
//  if( isValid( adHeaderObj ) === false )
//  {
//      Logger.log("FreewheelAdVideo.addMarks() - adHeaderObj is invalid");
//      return;
//  }
//  
//        var duration = adHeaderObj.getDuration( creativeID );
//        
//        This.addPlaybackMark( duration * 0.25 );
//        This.addPlaybackMark( duration * 0.5 );
//        This.addPlaybackMark( duration * 0.75 );
//    }
//    addMarks();
};

FreewheelVideo.VIDEOCONFIG = 
{
    TYPE_MP4: 
    { 
        "content-type":"video/mp4",
        "transfer-type":"progressive-download",
        "encryption-type":"none"
    },
    TYPE_PROGRESSIVE: {}
};

var PlaybackEvent = function( ){ };

PlaybackEvent.TYPE = 
{
    PAUSED: 0,
    UNPAUSED: 1,
    STARTED: 2,
    ENDED: 3,
    STOPPED: 4, // timecode passed
    MARKREACHED: 5, // mark index passed, timecode passed
    PLAYING: 7,
    STALLED: 8,
    ERROR: 9,
    ENDOFMEDIA: 10
};

var EndOfMediaEvent = function()
{
    this.getEventType       = function() { return PlaybackEvent.TYPE.ENDOFMEDIA; };  
};

var PlaybackError = function( current_time )
{
    this.getTime        = function() { return current_time; };
    this.getEventType       = function() { return PlaybackEvent.TYPE.ERROR; };
};

var PlaybackStalledEvent = function( current_time )
{
    this.getTime        = function() { return current_time; };
    this.getEventType       = function() { return PlaybackEvent.TYPE.STALLED; };
};

var PlayingEvent = function()
{
    this.getEventType       = function() { return PlaybackEvent.TYPE.PLAYING; };
};

var MarkReachedEvent = function( mark_reached_number, current_time )
{    
    this.getMarkNumber      = function() { return mark_reached_number; };
    this.getTime        = function() { return current_time; };
    this.getEventType       = function() { return PlaybackEvent.TYPE.MARKREACHED; };  
};

var StoppedEvent = function( current_time )
{
    this.getTime        = function() { return current_time; };
    this.getEventType       = function() { return PlaybackEvent.TYPE.STOPPED; };
};

var PausedEvent = function( current_time )
{
    this.getTime        = function() { return current_time; };
    this.getEventType       = function() { return PlaybackEvent.TYPE.PAUSED; };
};

var UnPausedEvent = function( current_time )
{
    this.getTime        = function() { return current_time; };
    this.getEventType       = function() { return PlaybackEvent.TYPE.UNPAUSED; };
};
include( "js/app/com/dadc/lithium/media/JSVideo.js" );

/**
 * THIS IS BASICALLY THE SAME AS THE FREEWHEEL AD VIDEO DEFINITION,
 * EXCEPT THAT IT HAS EXTRA FUNCTIONALITY TO DEAL WITH AN INTERACTIVE AD LAYER.
 * 
 * this video implements the IGAdVideo interface:
 * 
 *      .getIGLayer() : returns the IG widget, controller, whatever will be acted upon by the VideoController
 * 
 */
var InnovidVideo = function( adHeaderObj, FreewheelEventCallbackHelperObj, FreewheelPlaylistObj, creativeID, renditionID, mediaObj )
{
    var This = this;
    var m_playbackListeners = [];
    var m_playbackMarksTC = [];
    var m_playbackMarksMap = {};
    var m_marksFinalized = false;
    var m_previousTime = 0;
    var m_currentTime = 0;  
    var m_videoConfig = VideoManager.VIDEOCONFIG.TYPE_MP4;
    var m_stallingStartTime = null;
    var m_already_started_once = false;
    
    // INNOVID INTEGRATION: declare the interactive layer (IG) here, create in play() (ie: on demand)
    var m_interactive_layer;
    
    // INNOVID INTEGRATION: this is the IGAdVideo interface right here... neat.
    this.getIGLayer = function()
    {
        return m_interactive_layer;
    };
    
    this.addPlaybackListener = function( playbackListener )
    {
        m_playbackListeners[ m_playbackListeners.length ] = playbackListener;
    };
    
    this.addPlaybackMark = function( double_time_in_seconds )
    {
        if( ! m_marksFinalized )
        {
            m_playbackMarksTC[ m_playbackMarksTC.length ] = double_time_in_seconds;
            Logger.log("mark added @ " +  double_time_in_seconds );
        }
        else
        {
            Logger.log("mark not added");
        }
    };
    
    // Accessors
    this.getVideoURL = function(){ var url = adHeaderObj.getVideoUrl(creativeID, renditionID); return url; };
    this.getResumeTime = function(){ 
        Logger.log("returning resume time: " + m_currentTime);
        return m_currentTime; 
    };
    this.getWidth = function(){ return 1920; };
    this.getHeight = function(){ return 1080; };
    this.getVideoSourceConfigFromAdHeaderObj = function() { return adHeaderObj.getInnovidVideoSourceConfig(); };
    this.pause = function( state ){ VideoManagerInstance.pause( state ); };
    this.setVideoConfig = function( FreewheelVideo_VIDEOCONFIG_TYPE ) { m_videoConfig = FreewheelVideo_VIDEOCONFIG_TYPE; };
    this.getVideoConfig = function() { return m_videoConfig; };
    
    this.play = function()
    {
        Logger.log( 'play called in InnovidVideo' );
        //if( ! m_marks_finalized ){
        //    finalizePlaybackMarks();
        //}
        
        if( ! m_already_started_once ){
            m_already_started_once = true;
            AnalyticsManagerInstance.fireAdStartEvent(mediaObj);
            adHeaderObj.postImpressionUrls();
            FreewheelEventCallbackHelperObj.postImpressionUrls();
            m_interactive_layer = new InteractiveAdWidget( adHeaderObj.getInnovidData(), This );
            FreewheelPlaylistObj.notifyIGAdVideoStarted( This );
        }

        VideoManagerInstance.play( This );
    };
    
    this.stop = function()
    {
        Logger.log("InnovidVideo::stop()");
        if( VideoManagerInstance.getCurrentJSVideo() === this )
        {
            FreewheelPlaylistObj.notifyIGAdVideoEnded( This );
            
            Logger.log("will stop");
            VideoManagerInstance.stop( );
            VideoManagerInstance.close( );
            
            m_interactive_layer&&m_interactive_layer.close();
        }
        else
        {
            Logger.log("will not stop");
        }
    };
    
    // DETECT MARK REACHED EVENTS AND DISPATCH
    this.onTimeUpdate = function( currentTime, currentPTS )
    {
        m_stallingStartTime = null;
        m_previousTime = m_currentTime;
        m_currentTime = currentTime;
        
        for( var i = 0; i < m_playbackMarksTC.length; i++ )
        {
            if( m_playbackMarksTC[i] > m_previousTime && 
                m_playbackMarksTC[i] < m_currentTime && 
                ( ( m_currentTime - 2 ) < m_playbackMarksTC[i] ) )
            {
                var mark_number = m_playbackMarksMap[ m_playbackMarksTC[ i ] ];
                var time_pos = m_playbackMarksTC[ i ];
                
                Logger.log("InnovidVideo ------------- mark hit! " +  time_pos );
                Logger.log("InnovidVideo ------------- mark number is: " +  mark_number );

                switch( mark_number )
                {
                    case 1:
                        adHeaderObj.postFirstQuartileTrackingUrls();
                        //FreewheelEventCallbackHelperObj.postFirstQuartileTrackingUrls(); // DAN: fire twice bug
                        break;
                    case 2:
                        adHeaderObj.postMidPointTrackingUrls();
                        //FreewheelEventCallbackHelperObj.postMidpointTrackingUrls(); // DAN: fire twice bug
                        break;
                    case 3:
                        adHeaderObj.postThirdQuartileTrackingUrls();
                        //FreewheelEventCallbackHelperObj.postThirdQuartileTrackingUrls(); // DAN: fire twice bug
                        break;
                }

                break;
            }
        }
    };
    
    this.onOpened = function(){
        
    }
    
    // on video end
    this.onEnded = function()
    {
        Logger.log( 'InnovidVideo.onEnded()' );
        FreewheelPlaylistObj.notifyIGAdVideoEnded( This );
        adHeaderObj.postCompleteTrackingUrls();
        FreewheelEventCallbackHelperObj.postCompleteTrackingUrls();
        FreewheelPlaylistObj.onEnded( This );
        notifyListeners( new EndOfMediaEvent( ) );
        m_interactive_layer&&m_interactive_layer.close();
        UtilLibraryInstance.garbageCollect();
    };
    
    // on video error
    this.onError = function()
    {
        FreewheelPlaylistObj.notifyIGAdVideoEnded( This );
        FreewheelPlaylistObj.onEnded( This );
        m_interactive_layer&&m_interactive_layer.close();
        notifyListeners( new PlaybackError( VideoManagerInstance.getPlaybackTimePTS() ) );
    };
    
    // when video begins
    this.onPlaying = function()
    {
        m_stallingStartTime = null;
        m_interactive_layer&&m_interactive_layer.onPlaying();
        notifyListeners( new PlayingEvent( VideoManagerInstance.getPlaybackTimePTS() ) );
    };
    
    // when the video stalls
    this.onStalled = function()
    {
        //Logger.log('onStalled called in InnovidVideo');
        
        if(m_stallingStartTime === null) 
            m_stallingStartTime = engine.getTimer();
        else 
        {
            if (engine.getTimer() - m_stallingStartTime > 10) 
            {
                Logger.log("InnovidVideo::onStalled() - GIVING UP ON AD PLAY * STALLED FOR TO LONG");
                FreewheelPlaylistObj.notifyIGAdVideoEnded( This );
                m_stallingStartTime = null;
                FreewheelPlaylistObj.onEnded(); 
            }
        }
    };
    
    
    
    function finalizePlaybackMarks()
    {
        m_playbackMarksTC.sort( function( a, b ){return a - b;} );
        for( var i = 0; i < m_playbackMarksTC.length; i++ )
        {
            m_playbackMarksMap[ m_playbackMarksTC[ i ] ] = ( i + 1 );
        }
    }    

    // notify listeners of playback events
    function notifyListeners( playbackEventObj )
    {
        Logger.log("InnovidVideo::notifyListeners() - event type = " + playbackEventObj.getEventType() );
        
        try
        {
            for( var i = 0; i < m_playbackListeners.length; i++ )
            {
                m_playbackListeners[ i ].notifyPlaybackEvent( playbackEventObj, This );
            }
        }
        catch( e )
        {
            Logger.log("InnovidVideo::notifyListeners() - an error has occured");
        }
    }
    
};
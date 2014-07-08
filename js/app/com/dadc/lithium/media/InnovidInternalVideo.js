include( "js/app/com/dadc/lithium/media/JSVideo.js" );

/**
 * Similar to JSVideo, but has it's own analytics functionality applied.
 * It's not similar to InnovidVideo, since it does not have an IG layer
 */
var InnovidInternalVideo = function( video_url, mediaGalleryAdViewObj )
{
    
    var This = this;
    var m_mediaGalleryAdView = mediaGalleryAdViewObj;
    var m_playbackListeners = new Array();
    var m_playbackMarksTC = new Array();
    var m_playbackMarksMap = {};
    var m_marksFinalized = false;
    var m_previousTime = 0;
    var m_currentTime = 0;  
    var m_videoConfig = VideoManager.VIDEOCONFIG.TYPE_MP4;
    var m_stallingStartTime = null;
    
//    this.addPlaybackListener = function( playbackListener )
//    {
//        m_playbackListeners[ m_playbackListeners.length ] = playbackListener;
//    }
    
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
    }
    
    // Accessors
    this.getVideoURL = function(){ return video_url }
    this.getResumeTime = function(){ return m_currentTime; }
    this.getWidth = function(){ return 1920; }
    this.getHeight = function(){ return 1080; }
    this.pause = function( state ){ VideoManagerInstance.pause( state ); }
    this.getVideoConfig = function() { return m_videoConfig; }
    this.setCurrentTime = function( time_pos ){
        // check if current video is self?
        Logger.log("setCurrentTime called on video manager: " + time_pos );
        VideoManagerInstance.setCurrentTime( time_pos );
    }
    this.play = function()
    {
        if( ! m_marksFinalized ){
            finalizePlaybackMarks();
        }
        
        Logger.log( 'play called in InnovidInternalVideo, SETTING TIME TO ZERO' );
        m_currentTime = 0;
        
//        AnalyticsManagerInstance.fireAdStartEvent();
//        adHeaderObj.postImpressionUrls();
//        FreewheelEventCallbackHelperObj.postImpressionUrls();
//        m_interactive_layer = new InteractiveAdWidget( adHeaderObj.getInnovidData(), This );
//        FreewheelPlaylistObj.notifyIGAdVideoStarted( This );

        return VideoManagerInstance.play( This );
    }
    
    this.stop = function()
    {
        Logger.log("InnovidInternalVideo::stop()");
        if( VideoManagerInstance.getCurrentJSVideo() == this )
        {            
            Logger.log("will stop");
            var pts = VideoManagerInstance.getPlaybackTimePTS();
            VideoManagerInstance.stop( );
            VideoManagerInstance.close( );
            notifyListeners( new StoppedEvent( pts ) );
        }
        else
        {
            Logger.log("will not stop");
        }
    }
    
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
                
                Logger.log("InnovidInternalVideo ------------- mark hit! " +  time_pos );
                Logger.log("InnovidInternalVideo ------------- mark number is: " +  mark_number );
                notifyListeners( new MarkReachedEvent( mark_number, time_pos ) );
//                switch( mark_number )
//                {
//                    case 1:
//                        adHeaderObj.postFirstQuartileTrackingUrls();
//                        FreewheelEventCallbackHelperObj.postFirstQuartileTrackingUrls();
//                        break;
//                    case 2:
//                        adHeaderObj.postMidPointTrackingUrls();
//                        FreewheelEventCallbackHelperObj.postMidpointTrackingUrls();
//                        break;
//                    case 3:
//                        adHeaderObj.postThirdQuartileTrackingUrls();
//                        FreewheelEventCallbackHelperObj.postThirdQuartileTrackingUrls();
//                        break;
//                }

                break;
            }
        }
    }
    
    // on video end
    this.onEnded = function()
    {
        Logger.log( 'InnovidVideo.onEnded()' );
//        adHeaderObj.postCompleteTrackingUrls();
        notifyListeners( new EndOfMediaEvent( ) );
        UtilLibraryInstance.garbageCollect();
    }
    
    // on video error
    this.onError = function()
    {
        notifyListeners( new PlaybackError( VideoManagerInstance.getPlaybackTimePTS() ) );
    }
    
    // when video begins
    this.onPlaying = function()
    {
        m_stallingStartTime = null;
        notifyListeners( new PlayingEvent( VideoManagerInstance.getPlaybackTimePTS() ) );
    }
    
    // when the video stalls
    this.onStalled = function()
    {
        //Logger.log('onStalled called in InnovidVideo');
        
        if(m_stallingStartTime == null) 
            m_stallingStartTime = engine.getTimer();
        else 
        {
            if (engine.getTimer() - m_stallingStartTime > 10) 
            {
                Logger.log("InnovidInternalVideo::onStalled() - GIVING UP ON AD PLAY * STALLED FOR TO LONG");
                m_stallingStartTime = null;
            }
        }
    }
    
    function finalizePlaybackMarks()
    {
        m_playbackMarksTC.sort( function( a, b ){return a - b;} );
        for( var i = 0; i < m_playbackMarksTC.length; i++ )
        {
            m_playbackMarksMap[ m_playbackMarksTC[ i ] ] = ( i + 1 );
        }
        m_marksFinalized = true;
    }    

    // notify listeners of playback events
    function notifyListeners( playbackEventObj )
    {
        Logger.log("InnovidInternalVideo::notifyListeners() - event type = " + playbackEventObj.getEventType() );
        m_mediaGalleryAdView.onPlaybackEvent( playbackEventObj, This );
//        try
//        {
//            for( var i = 0; i < m_playbackListeners.length; i++ )
//            {
//                m_playbackListeners[ i ].notifyPlaybackEvent( playbackEventObj, This );
//            }
//        }
//        catch( e )
//        {
//            Logger.log("InnovidInternalVideo::notifyListeners() - an error has occured")
//        }
    }
    
}
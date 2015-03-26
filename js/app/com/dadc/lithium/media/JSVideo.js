
var JSVideo = function( video_url, videoManagerObj ){
    
    var This = this;
    var m_playback_listeners = new Array();
    var m_playback_marks_tc = new Array();
    var m_playback_marks_map = {};
    var m_marks_finalized = false;
    var m_previous_time = 0;
    var m_current_time = 0;  
    var m_video_config = JSVideo.VIDEOCONFIG.TYPE_PROGRESSIVE;
     
    
    this.addPlaybackListener = function( playbackListener ){
        m_playback_listeners[ m_playback_listeners.length ] = playbackListener;
    }
    
    this.addPlaybackMark = function( double_time_in_seconds ){
        // if marks have not been finalized, more can be added.
        if( ! m_marks_finalized ){
            m_playback_marks_tc[ m_playback_marks_tc.length ] = double_time_in_seconds;
            Logger.log("mark added @ " +  double_time_in_seconds );
        }else{
            Logger.log("mark not added");
        }
    }
    
    this.getWidth = function(){ return 1920; }
    
    this.getHeight = function(){ return 1080; }
    
    this.getVideoURL = function(){ return video_url; }
    
    this.getResumeTime = function(){ return m_current_time; }
    
    this.play = function(){
        if( ! m_marks_finalized ){
            finalizePlaybackMarks();
        }
        videoManagerObj.play( this );
    }
    
    this.stop = function(){
        Logger.log("JSVideo.stop called");
        if( videoManagerObj.getCurrentJSVideo() == this ){
            Logger.log("will stop");
            videoManagerObj.stop( );
            videoManagerObj.close( );
        }else{
            Logger.log("will not stop");
        }
    }
    
    
    // DETECT MARK REACHED EVENTS AND DISPATCH
    this.onTimeUpdate = function( currentTime, currentPTS ){
        
        Logger.log("currentTime: " + currentTime );
        Logger.log("currentPTS: " + currentPTS );
        Logger.log( "-" );
        m_previous_time = m_current_time;
        m_current_time = currentTime;
        
        for( var i = 0; i < m_playback_marks_tc.length; i++ ){
            if( m_playback_marks_tc[i] > m_previous_time && m_playback_marks_tc[i] < m_current_time && ( ( m_current_time - 2 ) < m_playback_marks_tc[i] ) ){
                Logger.log("------------- mark hit! " + m_playback_marks_tc[ i ] );
                Logger.log("------------- mark number is: " + m_playback_marks_map[ m_playback_marks_tc[ i ] ] );
                notifyListeners( 
                    new MarkReachedEvent( 
                        m_playback_marks_map[ m_playback_marks_tc[ i ] ], 
                        m_playback_marks_tc[ i ] 
                    ) 
                );
                break;
            }
        }
    }
    
    
    this.onOpened = function(){
        
    }
    
    this.onEnded = function(){
        notifyListeners( new EndOfMediaEvent( ) );
    }
    
    this.onError = function(error){
        console.log("********" +error)
        notifyListeners( new PlaybackError( videoManagerObj.getPlaybackTimePTS() ) );
    }
    
    this.onPlaying = function(){
        notifyListeners( new PlayingEvent( videoManagerObj.getPlaybackTimePTS() ) );
    }
    
    this.onStalled = function(){
        notifyListeners( new PlaybackStalledEvent( videoManagerObj.getPlaybackTimePTS() ) );
    }
    
    function finalizePlaybackMarks(){
        m_playback_marks_tc.sort( function( a, b ){return a - b;} );
        for( var i = 0; i < m_playback_marks_tc.length; i++ ){
            // create an object entry: time => mark number (eg: 4351112 => 56)
            m_playback_marks_map[ m_playback_marks_tc[ i ] ] = ( i + 1 );
        }
    }    
    
    this.setVideoConfig = function( JSVideo_VIDEOCONFIG_TYPE ){
        m_video_config = JSVideo_VIDEOCONFIG_TYPE;
    }
    
    // generates a config for the engine.createVideo calls
    this.getVideoConfig = function(){
        return m_video_config;
    }
    
    function notifyListeners( playbackEventObj ){
        Logger.log("notify listeners called w/ event obj " + playbackEventObj.getEventType() );
        for( var i = 0; i < m_playback_listeners.length; i++ ){
            try{
                m_playback_listeners[ i ].notifyPlaybackEvent( playbackEventObj, This );
            }catch( exception ){}
        }
    }
}

JSVideo.VIDEOCONFIG = {
    TYPE_MP4: { 
        "content-type":"video/mp4",
        "transfer-type":"progressive-download",
        "encryption-type":"none"
    },
    TYPE_PROGRESSIVE: {     "Audio-ChannelCount"    : "2",
                        "Content-Type"          : "video/mp2t",
                        "Transfer-Type"         : "adaptive-streaming",
                        "Video-TargetHeight"    : "1080",
                        "Video-TargetWidth"     : "1920",
                        }
}

var PlaybackEvent = function( ){ };

PlaybackEvent.TYPE = {
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
}

var EndOfMediaEvent = function(){
    this.getEventType = function(){return PlaybackEvent.TYPE.ENDOFMEDIA;}     
}

var PlaybackError = function( current_time ){
    this.getTime = function(){return current_time;}
    this.getEventType = function(){return PlaybackEvent.TYPE.ERROR;} 
}

var PlaybackStalledEvent = function( current_time ){
    this.getTime = function(){return current_time;}
    this.getEventType = function(){return PlaybackEvent.TYPE.STALLED;} 
}

var PlayingEvent = function( ){
    this.getEventType = function(){return PlaybackEvent.TYPE.PLAYING;}
}

var MarkReachedEvent = function( mark_reached_number, current_time ){    
    this.getMarkNumber = function(){return mark_reached_number;}
    this.getTime = function(){return current_time;}
    this.getEventType = function(){return PlaybackEvent.TYPE.MARKREACHED;}    
}

var StoppedEvent = function( current_time ){
    this.getTime = function(){return current_time;}
    this.getEventType = function(){return PlaybackEvent.TYPE.STOPPED;}    
}

var PausedEvent = function( current_time ){
    this.getTime = function(){return current_time;}
    this.getEventType = function(){return PlaybackEvent.TYPE.PAUSED;}    
}

var UnPausedEvent = function( current_time ){
    this.getTime = function(){return current_time;}
    this.getEventType = function(){return PlaybackEvent.TYPE.UNPAUSED;}    
}
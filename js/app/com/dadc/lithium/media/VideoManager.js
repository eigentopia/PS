VideoManager = function(){
    
    Logger.log("VideoManger created");
    
    var m_root_node = engine.createContainer();
    var m_core_video_obj = null;
    var m_m3u8_video_obj = null;
    
    var m_videos = {};
    var m_current_jsvideo = null;
    var m_video_dimensions = {};
        m_video_dimensions.width = 1920;
        m_video_dimensions.height = 1080;
        
    var m_video_time_on_play_before_timeupdate = undefined;
    
    m_root_node.width = 1920;
    m_root_node.height = 1080;
    m_root_node.x = 0;
    m_root_node.y = 0;
    
    // STALL DETECTION, NOT IMPLEMENTED YET
    var STALL_THRESHOLD = 10; // how many update loops should be the stall threshold?
    var m_last_video_time = 0;
    var m_last_video_time_recorded_at = 0;
    var m_unchanged_video_time_ticks = 0;
    
    this.getDisplayNode = function(){
        return m_root_node;
    }
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'VideoManager update() ' + engine_timer );
        
        if( m_video_time_on_play_before_timeupdate !== undefined && engine_timer + STALL_THRESHOLD > m_video_time_on_play_before_timeupdate ){
            onStalled();
        }
        
        // WILL BE USED FOR STALL DETECTION
    }
    
    /** will create and return a video. if video is already created, will return previous instance */
    // this.getVideo = function( video_url ){
    //     if( m_videos[ video_url ] == null ){
    //         Logger.log("video not created yet. creating w/ url: " + video_url );
    //         m_videos[ video_url ] = new JSVideo( video_url, this );
    //     }
    //     return m_videos[ video_url ];
    // }
    
    
    this.play = function( JSVideoObj ){
        Logger.log("play called in VideoManager");
        // stop and close the current video object
        if( m_current_jsvideo != null ){
            this.stop();
            this.close();
            m_current_jsvideo = null
        } 
        
        UtilLibraryInstance.garbageCollect();
        
        // retain a reference to the current JSVideo object
        m_current_jsvideo = JSVideoObj;
         // remove the video from the screen
        while( m_root_node.numChildren > 0 )
            m_root_node.removeChildAt( 0 );
        
        m_core_video_obj = null;     
        
        // get the proper video based on what the current JS video is
        var video_config = m_current_jsvideo.getVideoConfig();
        Logger.log( video_config["content-type"] );
        
        UtilLibraryInstance.garbageCollect();
        switch( video_config["content-type"] ){
            case "video/mp4":
                m_core_video_obj = engine.createVideo( JSVideo.VIDEOCONFIG.TYPE_MP4 );
                m_core_video_obj.streamType = "mp4"
                Logger.log( 'mp4' );
                break;
            default:
                m_core_video_obj = engine.createVideo( JSVideo.VIDEOCONFIG.TYPE_PROGRESSIVE );
                m_core_video_obj.streamType = "m3u8"
                Logger.log( 'm3u8' );
                break;
        }

        m_core_video_obj.width = JSVideoObj.getWidth();
        m_core_video_obj.height = JSVideoObj.getHeight();
        m_core_video_obj.x = ( 1920 / 2 ) - ( JSVideoObj.getWidth() / 2 );
        m_core_video_obj.y = ( 1080 / 2 ) - ( JSVideoObj.getHeight() / 2 );

        // assign listeners
        m_core_video_obj.onOpened = onOpened;
        m_core_video_obj.onEnded = onEnded;
        m_core_video_obj.onError = onError;
        m_core_video_obj.onPlaying = onPlaying;
        m_core_video_obj.onStalled = onStalled;
        m_core_video_obj.onTimeUpdate = onTimeUpdate;
       
        // add the video to the screen
        m_root_node.addChild( m_core_video_obj );
        m_core_video_obj.open( m_current_jsvideo.getVideoURL(), 
            {"video-starttimeoffset": m_current_jsvideo.getResumeTime()} 
        );
        Logger.log( 'url = ' + m_current_jsvideo.getVideoURL() );
        Logger.log("~~~~~~~~~~~~resume time is: " + m_current_jsvideo.getResumeTime() + " "+ m_current_jsvideo.getVideoConfig());
        
        
        Logger.log("core play called");
        
    }
    this.pause = function( state ){
        m_video_time_on_play_before_timeupdate = undefined;
        m_core_video_obj.pause( state );
    }
    this.getCurrentVideoTime = function(){
        if( m_current_jsvideo != null ){
            return m_current_jsvideo.getResumeTime();
        }else{
            return null;
        }
    }
    
    this.setCurrentTime = function( time ){
        Logger.log("VideoManager.setCurrentTime: " + time);
        m_core_video_obj.currentTime = time;
    }
    this.setDimensions = function( width, height ){
        Logger.log( 'setDimensions() width = ' + width + ' height = ' + height );
        
        m_video_dimensions.width = width;
        m_video_dimensions.height = height;
    }

    this.getCoreVideo = function(){
        return m_core_video_obj;
    }
    
    this.getPlaybackTimePTS = function(){
        return ( m_core_video_obj != null )
            ? m_core_video_obj.currentPTS
            : 0;
    }
    
    this.stop = function( ){
        Logger.log("videomanager.stop() called");
        m_video_time_on_play_before_timeupdate = undefined;
        if(m_core_video_obj){
            try{
                m_core_video_obj.stop();
            }catch( e ){Logger.log( e );}
        }
    }
    
    this.close = function(){
        Logger.log("videomanager.close() called");
        if(m_core_video_obj){
            try{
                m_core_video_obj.close();
            }catch( e ){Logger.log( e );}
        }
    }
    
    this.getCurrentJSVideo = function(){
        return m_current_jsvideo;
    }

    function onOpened(){
        Logger.log("core onOpened called");
        m_video_time_on_play_before_timeupdate = engine.getTimer();
        if(m_core_video_obj.streamType == "m3u8"){
            if(ConvivaIntegration.sessionId == null){
                ConvivaIntegration.createSession(m_core_video_obj, m_current_jsvideo.getVideoURL(), m_current_jsvideo.getMediaDetailsObj())
            }

            ConvivaIntegration.attachStreamer(m_core_video_obj)
        }

        m_core_video_obj.play();

        if( m_current_jsvideo != null ){
            m_current_jsvideo.onOpened();  
        }
    }
    
    function onEnded(){
        Logger.log("core onEnded called");
        if( m_current_jsvideo != null )
            m_current_jsvideo.onEnded();
    }
    
    function onError(){
        Logger.log("core onError called");
        if( m_current_jsvideo != null )
            m_current_jsvideo.onError();
    }
    
    function onPlaying(){
        Logger.log("core onPlaying called");
        if( m_current_jsvideo != null )
            m_current_jsvideo.onPlaying();
    }
    
    function onStalled(){
        if( m_current_jsvideo != null )
            m_current_jsvideo.onStalled();
        
    }
    
    function onTimeUpdate(){
        if( m_video_time_on_play_before_timeupdate !== undefined ){
            m_video_time_on_play_before_timeupdate = undefined;
        }
        if( m_current_jsvideo != null )
            m_current_jsvideo.onTimeUpdate( m_core_video_obj.currentTime, m_core_video_obj.currentPTS );
    }
}

VideoManager.VIDEOCONFIG = {
    TYPE_MP4: { 
        "content-type":"video/mp4",
        "transfer-type":"progressive-download",
        "encryption-type":"none"
    },
    TYPE_PROGRESSIVE: {
    }
}
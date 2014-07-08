/**
 * Movie Playback Widget
 */

if ( engine.createVideo ){
var MoviePlaybackWidget = function( video_url ) {
    var m_root_node = engine.createContainer();
    var m_video_url = video_url;
    var m_video;
    
    this.update = function( engine_timer ){};
    
    this.refreshWidget = function( video_url ){
        m_video_url = video_url;
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.openVideo = function(){
        Logger.log( 'open video, url = ' + m_video_url );
        // Load the video into the video object
        m_video.open( m_video_url );
    }
    this.playVideo = function(){
        Logger.log( 'play video' );
        m_video.play();
    }
    this.stopVideo = function(){
        m_video.stop();
    }
    this.pauseVideo = function(){
        m_video.pause();
    }
    
    //Minimal player configuration for mp4 playback.
    var mp4cfg = {
            "content-type":"video/mp4",
            "transfer-type":"progressive-download",
            "encryption-type":"none"
    };
    m_video = engine.createVideo( mp4cfg );
    // Set video container dimensions
    m_video.width = 1920;
    m_video.height = 1080;
    // Add the video to the screen container
    m_root_node.addChild( m_video );
    m_root_node.width = 1920;
    m_root_node.height = 1080;
    
};
}else{
var MoviePlaybackWidget = function( video_url ) {
    var m_root_node = engine.createContainer();
    var m_video_url = video_url;
    var m_video;
    
    this.update = function( engine_timer ){};
    
    this.refreshWidget = function( video_url ){
        m_video_url = video_url;
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.openVideo = function(){
        Logger.log( 'open video, url = ' + m_video_url );
        // Load the video into the video object
    }
    this.playVideo = function(){
        Logger.log( 'play video' );
    }
    this.stopVideo = function(){
    }
    this.pauseVideo = function(){
    }
};

}
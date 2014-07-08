/**
 * Video Progress Widget
 */

/**
 * @params video_duration Video duration in seconds
 * @params current_offset Current video playback offset in seconds
 */
var VideoProgressWidget = function( video_duration, current_offset ) {
    var m_root_node         = engine.createContainer();
    var m_video_duration    = video_duration;
    var m_current_offset    = current_offset;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'VideoProgressWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( video_duration, current_offset ){
        m_video_duration = video_duration;
        m_current_offset = current_offset;
        initWidget();
    };
    this.refreshWithCurrentData = function(){
        initWidget();
    }
    this.getDisplayNode = function(){return m_root_node;};
    this.destroy = function(){
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
    }
    
    function initWidget(){
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        m_root_node.addChild( getBackgroundSlate() );
        var filled_background_slate = getFilledBackgroundSlate();
        
        if ( filled_background_slate ){
            m_root_node.addChild( filled_background_slate );
        }
    }
    
    function getBackgroundSlate(){
        var slate = engine.createSlate();
        slate.width = 310;
        slate.height = 11;
        slate.shader = ShaderCreatorInstance.createSolidColorShader( [70/255, 70/255, 70/255, 1] );
        m_root_node.width = 310;
        m_root_node.height = 11;
        
        return slate;
    }
    
    function getFilledBackgroundSlate(){
        var slate = engine.createSlate();
        if ( m_video_duration > 0 ){
            if ( m_current_offset === undefined ){
                slate.width = 0;
            }else{
                slate.width = 310 * ( m_current_offset / m_video_duration);
            }
            slate.height = 11;
            slate.shader = ShaderCreatorInstance.createSolidColorShader( [255/255, 160/255, 0/255, 1] );

            return slate;
        }else{
            return null;
        }
    }
    
    if ( video_duration ){
        initWidget();
    }

};
include( "js/app/com/dadc/lithium/view/widgets/NavigationControlWidget.js" );

/**
 * This is a cutdown/modified version of the standard crackle timeline widget.
 */
var InnovidTimelineWidget = function( current_time, total_video_length ) {
    
    var SEEK_DELTA = 10;
    
    var This = this;
    
    var m_root_node = engine.createContainer();
    var m_master_container = engine.createContainer();
    
    var m_time_container = engine.createContainer();
    var m_seek_container = engine.createContainer();
    var m_pause_container = engine.createContainer();
    
    var m_current_time = current_time;
    var m_total_video_length = parseFloat( total_video_length );
    
    var m_cursor_time_indicator_container;
    var m_cursor_time_text_container;
    var m_time_position_container;
    var m_filled_container;
    var m_navigation_control_widget = new NavigationControlWidget(
        [
            {control: NavigationControlWidget.CONTROLS.CIRCLE, caption: Dictionary.getText( Dictionary.TEXT.BACK ), x_offset: 270},             // old 470            // old 670
            {control: NavigationControlWidget.CONTROLS.DPAD_RIGHT_LEFT, caption: Dictionary.getText( Dictionary.TEXT.SEEK ), x_offset: 750},    // old 950
        ] );
    
    var m_last_engine_timer_seek = -1;
    var m_last_timeline_activity = -1;
    
    var m_seek_time = 0;
    
    this.update = function( engine_timer ){
        //if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'TimelineWidget update() ' + engine_timer );
        
        if( m_last_engine_timer_seek >= 0 && m_seek_container.numChildren > 0 && engine_timer > m_last_engine_timer_seek + 3 ){
            m_last_engine_timer_seek = -1;
            
            while( m_seek_container.numChildren > 0){
                Logger.log( 'removing seek child' );
                m_seek_container.removeChildAt( 0 );
            }
        }
        if( m_last_timeline_activity > 0 && engine_timer > m_last_timeline_activity + 5 ){
            m_last_timeline_activity = -1;
            This.setVisible( false );
            This.hideCursor();
        }        
    };
    this.refreshWidget = function( current_time, total_video_length ){
        //Logger.log( 'refreshWidget called in TimelineWidget' );
        m_current_time = current_time;
        m_total_video_length = parseFloat( total_video_length );
        
        while( m_seek_container.numChildren > 0 ){
            m_seek_container.removeChildAt( 0 );
        }
        while( m_time_container.numChildren > 0 ){
            m_time_container.removeChildAt( 0 );
        }
        
        m_time_container.addChild( getBackgroundSlate() );
        m_time_container.addChild( m_filled_container );
        
        initWidget();
    };
    
    this.refreshNavigationWidget = function(subtitle_exists, subtitle_on){
        var controls = [
            {control: NavigationControlWidget.CONTROLS.CIRCLE, caption: Dictionary.getText( Dictionary.TEXT.BACK ), x_offset: 470},            // old 670
            {control: NavigationControlWidget.CONTROLS.DPAD_RIGHT_LEFT, caption: Dictionary.getText( Dictionary.TEXT.SEEK ), x_offset: 950},    // old 950
        ];
        
        if(subtitle_exists){
            controls = [
                {control: NavigationControlWidget.CONTROLS.CIRCLE, caption: Dictionary.getText( Dictionary.TEXT.BACK ), x_offset: 270},            // old 670
                {control: NavigationControlWidget.CONTROLS.DPAD_RIGHT_LEFT, caption: Dictionary.getText( Dictionary.TEXT.SEEK ), x_offset: 750}    // old 950
            ];
        }
        
        m_navigation_control_widget.refreshWidget( controls );
    }
    
    this.resetTimer = function(){
        m_last_timeline_activity = engine.getTimer();
    }
    this.getDisplayNode = function(){return m_root_node;};
    this.showCursor = function(){
        Logger.log( 'TimelineWidget showCursor()' );
        if ( ! m_time_container.contains( m_cursor_time_indicator_container ) ){
            m_time_container.addChild( m_cursor_time_indicator_container );
            m_time_container.addChild( m_cursor_time_text_container );
        }
//        m_time_container.addChild( m_current_time_text_container );
        m_seek_time = parseFloat( m_current_time );
        
        var offset = m_seek_time / m_total_video_length;
        
        m_cursor_time_indicator_container.x = 1188 * ( offset === undefined ? 0 : offset ) - 114 / 2;
        
        updateCursorText();
    }
    this.isCursorVisible = function(){
        return m_time_container.contains( m_cursor_time_indicator_container );
    }
    this.setSeekDirection = function( TimelineWidget_SEEK_DIRECTION ){
        
        switch( TimelineWidget_SEEK_DIRECTION ){
            case TimelineWidget.SEEK_DIRECTION.FW:
                break;
            case TimelineWidget.SEEK_DIRECTION.RW:
                break;
        }
    }
    this.hideCursor = function(){
        if ( m_time_container.contains( m_cursor_time_indicator_container ) ){
            m_time_container.removeChild( m_cursor_time_indicator_container );
            m_time_container.removeChild( m_cursor_time_text_container );
        }
    }
    this.setTime = function( time ){
        //Logger.log( 'setTime = ' + time );
        m_current_time = time;
        
        var offset = m_current_time / m_total_video_length;
        
        m_filled_container.clipRect.width = 1188 * ( offset === undefined ? 0 : offset );
        updateTimeContainer();
    }
    
    this.scanForward = function(){
        m_last_timeline_activity = engine.getTimer();
        
        while( m_seek_container.numChildren > 0 ){
            m_seek_container.removeChildAt( 0 );
        }
        
        m_last_engine_timer_seek = engine.getTimer();
        m_seek_container.x = 114+20;
        m_seek_container.y = 15;
        m_seek_container.addChild( getFwSlate() );
        
        Logger.log( 'm_total_video_length = ' + m_total_video_length );
        Logger.log( 'm_seek_time = ' + m_seek_time );

        if( m_seek_time + SEEK_DELTA >= m_total_video_length ){
            m_seek_time = m_total_video_length;
            Logger.log("----- m_seek_time set to end: " + m_seek_time );
        }else{
            m_seek_time += SEEK_DELTA;
            Logger.log("----- m_seek_time incremented to: " + m_seek_time );
        }
        Logger.log( 'SF seek_time = ' + m_seek_time );
        var offset = m_seek_time / m_total_video_length;
        Logger.log("Offset = " + offset);
        var new_x = 1188 * ( offset === undefined ? 0 : offset ) - 114 / 2;
        Logger.log("new_x = " + new_x);
        m_cursor_time_indicator_container.x = new_x;
        m_cursor_time_indicator_container.x += 3; // this moves the [|]
        updateCursorText();
    }
    this.scanBackward = function(){
        m_last_timeline_activity = engine.getTimer();
        
        while( m_seek_container.numChildren > 0 ){
            m_seek_container.removeChildAt( 0 );
        }
        
        m_last_engine_timer_seek = engine.getTimer();
        m_seek_container.x = -40;
        m_seek_container.y = 15;
        m_seek_container.addChild( getRwSlate() );

        if( m_seek_time - SEEK_DELTA < 0 ){
            m_seek_time = 0;
        }else{
            m_seek_time -= SEEK_DELTA;
        }
        Logger.log( 'SB seek_time = ' + m_seek_time );
        var offset = m_seek_time / m_total_video_length;
        m_cursor_time_indicator_container.x = 1188 * ( offset === undefined ? 0 : offset ) - 114 / 2;
        m_cursor_time_indicator_container.x += 3;
        
        updateCursorText();
    }
    this.getSeekTime = function(){
        return m_seek_time;
    }
    this.setPauseStatus = function( status ){
        return;
        // m_last_timeline_activity = engine.getTimer();
        // if( status ){
        //     if( !m_time_container.contains( m_pause_container ) ){
        //         m_time_container.addChild( m_pause_container );
        //     }
        // }else{
        //     if( m_time_container.contains( m_pause_container ) ){
        //         m_time_container.removeChild( m_pause_container );
        //     }
        // }
    }
    this.setVisible = function( value ){
        if( value ){
            m_last_timeline_activity = engine.getTimer();
            
            m_last_engine_timer_seek = -1;
            
            while( m_seek_container.numChildren > 0){
                Logger.log( 'removing seek child' );
                m_seek_container.removeChildAt( 0 );
            }            
            if( !m_root_node.contains( m_master_container ) )
                m_root_node.addChild( m_master_container );
        }else{
            if( m_root_node.contains( m_master_container ) )
                m_root_node.removeChild( m_master_container );
        }
    }
    this.isVisible = function(){return m_root_node.contains( m_master_container );}

    function getBlackSlate(){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getBLACK( 1 ) );
        tmp_slate.width = 1920;
        tmp_slate.height = 100;
        
        tmp_container.addChild( tmp_slate );
        
        return tmp_container;        
    }
    function getNavigationBlackSlate(){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getBLACK( 1 ) );
        tmp_slate.width = 1920;
        tmp_slate.height = 125;
        
        tmp_container.y = 100;
        tmp_container.x = 0;
        tmp_container.addChild( tmp_slate );
        
        return tmp_container;        
    }    
    function updateCursorText(){
        var visible = false;
        var offset = m_seek_time / m_total_video_length;
        
        if( m_time_container.contains( m_cursor_time_text_container ) ){
            m_time_container.removeChild( m_cursor_time_text_container );
            visible = true;
        }
        
        m_cursor_time_text_container = null;
        UtilLibraryInstance.garbageCollect();
        
        m_cursor_time_text_container = getCursorTimeTextContainer();
        m_cursor_time_text_container.x = 1188 * ( offset === undefined ? 0 : offset ) - 114 / 2 + m_cursor_time_text_container.width / 4;
        m_cursor_time_text_container.y = -107+25+7;        
        
        if( visible ){
            m_time_container.addChild( m_cursor_time_text_container );
        }
    }
    function updateTimeContainer(){
        var visible = false;
        
        if( m_master_container.contains( m_time_position_container ) ){
            m_master_container.removeChild( m_time_position_container );
            visible = true;
        }
        
        m_time_position_container = null;
        UtilLibraryInstance.garbageCollect();
        
        m_time_position_container = getTimePositionContainer();
        m_time_position_container.x = 120;
        m_time_position_container.y = 39;
        
        if( visible ){
            m_master_container.addChild( m_time_position_container );
        }
    }
    function initWidget(){
        This.setTime( m_current_time );
    }
    function addFiledBackgroundContainer(){
    }
    function getBackgroundSlate(){
        var slate = engine.createSlate();
        slate.width = 1188;
        slate.height = 25;
        slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/timeline/bar.png" ).shader.texture;
        
        m_root_node.width = slate.width;
        m_root_node.height = slate.height;
        
        return slate;
    }
    function getFilledBackgroundContainer(){
        var container = engine.createContainer();
        
        container.width = 1188;
        container.height = 25;
        container.clipRect.height = 25;
        
        var slate = engine.createSlate();
        slate.width = 1188;
        slate.height = 25;
        slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/timeline/filled_bar.png" ).shader.texture;
        
        container.addChild( slate );
        return container;
    }
    function getCursorTimeIndicatorContainer(){
        var container = engine.createContainer();
        
        var slate = engine.createSlate();
        slate.width = 114;
        slate.height = 107;
        slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/timeline/current_time_indicator.png" ).shader.texture;
        
        container.addChild( slate );
        return container;
    }
    function getCursorTimeTextContainer(){
        var ct = secondsToTime( m_seek_time );
        var ct_t = strpad( ct.h ) + ':' + strpad( ct.m ) + ':' + strpad( ct.s );
        var tblock = engine.createTextBlock( ct_t, FontLibraryInstance.getFont_CURRENTTIMETIMELINE(), 400 );
        var container = engine.createContainer();
        
        container.addChild( tblock );
        container.width = tblock.naturalWidth;
        container.height = tblock.naturalHeight;
        
        return container;
    }
    function getTimePositionContainer(){
        var text;
        var ct = secondsToTime( m_current_time );
        text = strpad( ct.h ) + ':' + strpad( ct.m ) + ':' + strpad( ct.s );
        ct = secondsToTime( m_total_video_length );
        text += " / " + strpad( ct.h ) + ':' + strpad( ct.m ) + ':' + strpad( ct.s );
        
        var tblock = engine.createTextBlock( text, FontLibraryInstance.getFont_CURRENTTIMETIMELINE(), 400 );
        var container = engine.createContainer();
        
        container.addChild( tblock );
        container.width = tblock.naturalWidth;
        container.height = tblock.naturalHeight;
        
        return container;
    }
    function getRwSlate(){
        var slate = engine.createSlate();
        slate.width = AssetLoaderInstance.getImage( "Artwork/timeline/rw.png" ).width;
        slate.height = AssetLoaderInstance.getImage( "Artwork/timeline/rw.png" ).height;
        slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/timeline/rw.png" ).shader.texture;
        
        return slate;
    }
    function getFwSlate(){
        var slate = engine.createSlate();
        slate.width = AssetLoaderInstance.getImage( "Artwork/timeline/fw.png" ).width;
        slate.height = AssetLoaderInstance.getImage( "Artwork/timeline/fw.png" ).height;
        slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/timeline/fw.png" ).shader.texture;
        
        return slate;
    }
    function getAdBreakSlate(){
        var slate = engine.createSlate();
        slate.width = AssetLoaderInstance.getImage( "Artwork/timeline/adbreak.png" ).width;
        slate.height = AssetLoaderInstance.getImage( "Artwork/timeline/adbreak.png" ).height;
        slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/timeline/adbreak.png" ).shader.texture;
        
        return slate;
    }    
    // function getPauseSlate(){
    //     var slate = engine.createSlate();
    //     slate.width = AssetLoaderInstance.getImage( "Artwork/pauseButton.png" ).width;
    //     slate.height = AssetLoaderInstance.getImage( "Artwork/pauseButton.png" ).height;
    //     slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
    //     slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/pauseButton.png" ).shader.texture;
        
    //     return slate;
    // }
    function secondsToTime(secs)
    {
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        var obj = {
                "h": hours,
                "m": minutes,
                "s": seconds
        };
        return obj;
    }
    function strpad( str ){
        var t = "" + str;
        if( t.length == 1 ){
            t = "0" + str;
        }
        return t;
    }
    
    m_cursor_time_indicator_container   = getCursorTimeIndicatorContainer();
    m_cursor_time_text_container        = getCursorTimeTextContainer();
    m_filled_container                  = getFilledBackgroundContainer();
    m_time_position_container           = getTimePositionContainer();  
    
    m_time_container.width = 1188;
    m_time_container.height = 25;
    m_time_container.addChild( getBackgroundSlate() );
    m_time_container.addChild( m_filled_container );
    
    m_time_container.x = ( 1920 / 2 ) - ( m_time_container.width / 2 );
    m_time_container.y = 40;
    
    m_time_position_container.x = 120;
    m_time_position_container.y = 35;
    
    m_cursor_time_indicator_container.y = -107 + 25;
    m_cursor_time_text_container.y = -107+25+7;
    
    // m_pause_container.addChild( getPauseSlate() );
    // m_pause_container.x = 1220;
    // m_pause_container.y = -18;
    
    m_navigation_control_widget.getDisplayNode().x = 385;
    m_navigation_control_widget.getDisplayNode().y = 140;    
    
    m_master_container.addChild( getBlackSlate() );
    m_master_container.addChild( m_time_container );
    m_master_container.addChild( m_time_position_container );
    m_master_container.addChild( getNavigationBlackSlate() );
    m_master_container.addChild( m_navigation_control_widget.getDisplayNode() );
         
    m_cursor_time_indicator_container.addChild( m_seek_container );
    
    m_root_node.addChild( m_master_container );
    
    if( m_total_video_length > 0 ){
        initWidget();
    }
};

TimelineWidget.SEEK_DIRECTION = {
    NONE: 1,
    RW: 2,
    FW: 3
}
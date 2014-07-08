/**
 * Scrollbar Widget
 */
var ScrollbarWidget = function( ScrollbarWidget_SIZE ) {
    var m_root_node = engine.createContainer();
    var m_master_container = engine.createContainer();
    var m_offset    = 0;
    var m_enabled_slate = getEnabledSlate();
    var m_disabled_slate = getDisabledSlate();
    var m_is_focussed = false;
    var m_is_visible = true;
    var m_size = ScrollbarWidget_SIZE;
    
    var This = this;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ScrollbarWidget update() ' + engine_timer );
        
    };
    
    this.setOffset = function( offset ){
        m_offset = offset;
        positionSlates();
    }
    
    this.setVisible = function( is_visible ){
        m_is_visible = is_visible;
        
        if ( is_visible ){
            if ( !m_root_node.contains( m_master_container ) ) m_root_node.addChild( m_master_container );
        } else{
            if ( m_root_node.contains( m_master_container ) ) m_root_node.removeChild( m_master_container );
        }
    }
    
    this.refreshWidget = function( ScrollbarWidget_SIZE ) {
        m_size = ScrollbarWidget_SIZE;
        initWidget();
    };
    
    this.setFocus = function( value ){
        if ( value ){
            if ( m_master_container.contains( m_disabled_slate) ) m_master_container.removeChild( m_disabled_slate );
            if ( !m_master_container.contains( m_enabled_slate) ) m_master_container.addChild( m_enabled_slate );
            m_is_focussed = true;
        }else{
            if ( m_master_container.contains( m_enabled_slate) ) m_master_container.removeChild( m_enabled_slate );
            if ( !m_master_container.contains( m_disabled_slate) ) m_master_container.addChild( m_disabled_slate );
            m_is_focussed = false;
        }
    }
    
    this.getFocus = function(){ return m_is_focussed;}
    this.getVisibility = function(){ return m_is_visible;}
    
    this.getDisplayNode = function(){return m_root_node;};
    
    function initWidget(){
        var bg_slate;
        while ( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
        
        bg_slate = getBackgroundSlate();
        m_master_container.addChild( bg_slate );
        
        m_master_container.width = m_root_node.width = bg_slate.width;
        m_master_container.height = m_root_node.height = bg_slate.height;
        
        if ( m_is_focussed ){
            This.setFocus( true );
        }else{
            This.setFocus( false );
        }

        if ( m_is_visible ){
            This.setVisible( true );
        }else{
            This.setVisible( false );
        }

        positionSlates();
    }
    
    function positionSlates(){
        m_enabled_slate.y = ( m_master_container.height - m_enabled_slate.height ) * m_offset;
        m_disabled_slate.y = m_enabled_slate.y;
    }
    
    function getBackgroundSlate(){
        var slate = engine.createSlate();
        var image;
        

        switch( m_size ){
            case ScrollbarWidget.SIZE.SHORT:
                image = AssetLoaderInstance.getImage( "Artwork/scrollbar_short.png" );
                break;
            case ScrollbarWidget.SIZE.LONG:
                image = AssetLoaderInstance.getImage( "Artwork/scrollbar_long.png" );
                break;
            case ScrollbarWidget.SIZE.VERY_LONG:
                image = AssetLoaderInstance.getImage( "Artwork/scrollbar_long.png" );
                break;
                
        }
        Logger.log( 'image.height = ' + image.height );
        Logger.log( 'image.width = ' + image.width );
        if( m_size == ScrollbarWidget.SIZE.VERY_LONG ){
            slate.width = image.width;
            slate.height = 880;
        }else{
            slate.width = image.width;
            slate.height = image.height;
        }
        slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slate.shader.texture = image.shader.texture;
        
        return slate;
    }
    
    function getEnabledSlate(){
        var slate = engine.createSlate();
        slate.width = 14;
        slate.height = 97;
        slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/scrollbar_indicator_enabled.png" ).shader.texture;
        
        return slate;
    }

    function getDisabledSlate(){
        var slate = engine.createSlate();
        slate.width = 14;
        slate.height = 97;
        slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/scrollbar_indicator_disabled.png" ).shader.texture;
        
        return slate;
    }

    if ( ScrollbarWidget_SIZE ){
        initWidget();
    }
};

ScrollbarWidget.SIZE = {
    SHORT: 1,
    LONG: 2,
    VERY_LONG: 3
}
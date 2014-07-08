/**
 */
var PlaylistMenuButtonWidget = function( caption, default_active ) {
    var m_root_node = engine.createContainer();
    var m_caption = caption;
    var m_default_active = default_active;
    var m_selected_container;
    var m_disabled_container;
    var m_inactive_container;
    var m_text_container = engine.createContainer();
    var This = this;
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'PlaylistMenuButtonWidget update() ' + engine_timer );
    };
    
    this.refreshWidget = function( caption, default_active ){
        m_caption = caption;
        m_default_active = default_active;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    this.getCaption = function(){return m_caption;};
    
    this.isActive = function(){return m_root_node.contains( m_selected_container )}
    
    this.setActive = function(){
        if ( !m_root_node.contains( m_selected_container ) ){
            m_root_node.addChildAt( m_selected_container, 0 );
        }
        if ( m_root_node.contains( m_disabled_container ) ){
            m_root_node.removeChild( m_disabled_container );
        }
        if ( m_root_node.contains( m_inactive_container ) ){
            m_root_node.removeChild( m_inactive_container );
        }
    }
    this.setInactive = function(){
        if ( !m_root_node.contains( m_inactive_container ) ){
            m_root_node.addChildAt( m_inactive_container, 0 );
        }
        if ( m_root_node.contains( m_selected_container ) ){
            m_root_node.removeChild( m_selected_container );
        }
        if ( m_root_node.contains( m_disabled_container ) ){
            m_root_node.removeChild( m_disabled_container );
        }
    }
    this.setDisabled = function(){
        if ( !m_root_node.contains( m_disabled_container ) ){
            m_root_node.addChildAt( m_disabled_container, 0 );
        }        
        if ( m_root_node.contains( m_selected_container ) ){
            m_root_node.removeChild( m_selected_container );
        }
        if ( m_root_node.contains( m_inactive_container ) ){
            m_root_node.removeChild( m_inactive_container );
        }
    }
    function initWidget(){
        var tmp_container = engine.createContainer();
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        tmp_container.width = 1920;
        tmp_container.height = 100;

        while ( m_text_container.numChildren > 0 ){
            m_text_container.removeChildAt( 0 );
        }
        
        m_root_node.addChild( m_text_container );
        
        var tblock = engine.createTextBlock( m_caption, FontLibraryInstance.getFont_PLAYLISTMENUBUTTON(), 500 );
        tblock.x = 260/2 - ( tblock.naturalWidth / 2 );
        tblock.y = (62/2 - tblock.naturalHeight / 2) - 3;
        m_text_container.addChild( tblock );
        
        if ( m_default_active ){
            This.setActive();
        }else{
            This.setInactive();
        }
    }
    
    function getCellSelectionContainer( ){
        var tmp_container = engine.createContainer();
        var button_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_small_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        
        button_slate.width = 260;
        button_slate.height = 62;
        
        tmp_container.addChild( button_slate );
        
        return tmp_container;
    }
    
    function getCellDisabledContainer(){
        var tmp_container = engine.createContainer();
        var button_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_small_lightgray.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        
        button_slate.width = 260;
        button_slate.height = 62;
        
        tmp_container.addChild( button_slate );
        
        return tmp_container;
    }
    function getCellInactiveContainer(){
        var tmp_container = engine.createContainer();
        var button_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_small_gray.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        
        button_slate.width = 260;
        button_slate.height = 62;
        
        tmp_container.addChild( button_slate );
        
        return tmp_container;
    }
    m_selected_container = getCellSelectionContainer();
    m_disabled_container = getCellDisabledContainer();
    m_inactive_container = getCellInactiveContainer();
    if ( caption ){
        initWidget();
    }

};
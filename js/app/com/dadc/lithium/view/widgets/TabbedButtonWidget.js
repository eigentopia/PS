var TabbedButtonWidget = function( caption ) {
    var m_root_node = engine.createContainer();
    var m_caption = caption;
    var m_selected_container;
    var m_disabled_container;
    var m_inactive_container;
    var This = this;
    
    this.refreshWidget = function( caption ){
        m_caption = caption;
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    this.update = function( engine_timer ){
    }
    this.isActive = function(){
        return m_root_node.contains( m_selected_container );
    }
    this.setActive = function(){
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        m_root_node.addChild( m_selected_container );
        m_root_node.addChild( getActiveTextContainer() );
    }
    this.setInactive = function(){
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        m_root_node.addChild( m_inactive_container );
        m_root_node.addChild( getInactiveTextContainer() );
    }
    this.setDisabled = function(){
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        m_root_node.addChild( m_disabled_container );
        m_root_node.addChild( getActiveTextContainer() );
    }
    this.getWidth = function(){
        return m_selected_container.width;
    }
    this.getHeight = function(){
        return m_selected_container.height;
    }

    function initWidget(){
        m_caption = HTMLUtilities.removeHTMLTags( m_caption );
        var tblock = engine.createTextBlock( m_caption, FontLibraryInstance.getFont_TABBUTTON(), 500 );
        
        tblock.x = m_selected_container.width/2 - tblock.naturalWidth/2;
        tblock.y = m_selected_container.height/2 - tblock.naturalHeight/2;
        m_root_node.addChild( tblock );
        This.setDisabled();
    }
    
    function getDisabledContainer(){
        var tmp_slate = engine.createSlate();
        
        tmp_slate.shader            = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture    = AssetLoaderInstance.getImage( "Artwork/buttons/tab_button_gray.png" ).shader.texture;
        tmp_slate.width             = AssetLoaderInstance.getImage( "Artwork/buttons/tab_button_gray.png" ).width;
        tmp_slate.height            = AssetLoaderInstance.getImage( "Artwork/buttons/tab_button_gray.png" ).height;
        
        return tmp_slate;
    }
    
    function getSelectedContainer(){
        var tmp_slate = engine.createSlate();
        
        tmp_slate.shader            = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture    = AssetLoaderInstance.getImage( "Artwork/buttons/tab_button_orange.png" ).shader.texture;
        tmp_slate.width             = AssetLoaderInstance.getImage( "Artwork/buttons/tab_button_orange.png" ).width;
        tmp_slate.height            = AssetLoaderInstance.getImage( "Artwork/buttons/tab_button_orange.png" ).height;
        
        return tmp_slate;
    }
    
    function getInactiveContainer(){
        var tmp_slate = engine.createSlate();
        
        tmp_slate.shader            = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture    = AssetLoaderInstance.getImage( "Artwork/buttons/tab_button_lightgray.png" ).shader.texture;
        tmp_slate.width             = AssetLoaderInstance.getImage( "Artwork/buttons/tab_button_lightgray.png" ).width;
        tmp_slate.height            = AssetLoaderInstance.getImage( "Artwork/buttons/tab_button_lightgray.png" ).height;
        
        return tmp_slate;
    }    
    function getActiveTextContainer(){
        var tblock = engine.createTextBlock( m_caption, FontLibraryInstance.getFont_TABBUTTON(), 500 );
        tblock.x = m_selected_container.width/2 - tblock.naturalWidth/2;
        tblock.y = m_selected_container.height/2 - tblock.naturalHeight/2;
        
        return tblock;

    }
    function getInactiveTextContainer(){
        var tblock = engine.createTextBlock( m_caption, FontLibraryInstance.getFont_TABBUTTONINACTIVE(), 500 );
        tblock.x = m_selected_container.width/2 - tblock.naturalWidth/2;
        tblock.y = m_selected_container.height/2 - tblock.naturalHeight/2;
        
        return tblock;
    }
    
    m_selected_container = getSelectedContainer();
    m_disabled_container = getDisabledContainer();
    m_inactive_container = getInactiveContainer();    
    
    if ( caption ){
        initWidget();
    }
};
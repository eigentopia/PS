include( "js/app/com/dadc/lithium/view/widgets/VideoProgressWidget.js" );

/**
 */
var ShowDetailsMenuItemWidget = function( text, media_obj, media_id ) {
    var m_root_node     = engine.createContainer();
    var m_text          = text;
    var m_media_obj     = media_obj;
    var m_media_id      = media_id;
    var m_selected_container;
    var m_disabled_container;
    var m_inactive_container;
    var m_video_progress_widget = new VideoProgressWidget( null );
    var This = this;
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ShowDetailsMenuItemWidget update() ' + engine_timer );
    };
    
    this.refreshWidget = function( text, media_obj, media_id ){
        m_text          = text;
        m_media_obj     = media_obj;
        m_media_id      = media_id;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    this.getMediaID = function(){return m_media_id;};
    this.getText = function(){return m_text;};
    this.setText = function( text ){m_text = text;};
    this.isActive = function(){
        return m_root_node.contains( m_selected_container );
    }
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
        if ( m_root_node.contains( m_selected_container ) ){
            m_root_node.removeChild( m_selected_container );
        }
        if ( m_root_node.contains( m_disabled_container ) ){
            m_root_node.removeChild( m_disabled_container );
        }
        if ( !m_root_node.contains( m_inactive_container ) ){
            m_root_node.addChildAt( m_inactive_container, 0 );
        }
    }
    this.setDisabled = function(){
        if ( m_root_node.contains( m_selected_container ) ){
            m_root_node.removeChild( m_selected_container );
        }
        if ( m_root_node.contains( m_inactive_container ) ){
            m_root_node.removeChild( m_inactive_container );
        }
        if ( !m_root_node.contains( m_disabled_container ) ){
            m_root_node.addChildAt( m_disabled_container, 0 );
        }        
    }
    this.setIndex = function( index ){
        
    }
    this.refreshVideoProgressWidget = function(){
        m_video_progress_widget.refreshWidget( m_media_obj.getDurationInSeconds(), VideoProgressManagerInstance.getProgress( m_media_id ) );
    }

    function initWidget(){
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        var tmp_container = engine.createContainer();
        tmp_container.width = 1920;
        tmp_container.height = 100;

        var tblock = engine.createTextBlock( m_text, FontLibraryInstance.getFont_EPISODEMENU(), 900 );
        tblock.x = 20;
        tblock.y = 22;
        tmp_container.addChild( tblock );
        
        m_root_node.addChild( tmp_container );
        
        m_video_progress_widget.refreshWidget( m_media_obj.getDurationInSeconds(), VideoProgressManagerInstance.getProgress( m_media_id ) );
        m_video_progress_widget.getDisplayNode().x = 20;
        m_video_progress_widget.getDisplayNode().y = 70;
        m_root_node.addChild( m_video_progress_widget.getDisplayNode() );
        
        This.setDisabled();
    }
    
    function getCellSelectionContainer( ){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();
        var button_container = engine.createContainer();
        
        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getWHITE( 1 ) );
        tmp_slate.height = 100;
        tmp_slate.width = 1920;
        
        tmp_container.addChild( tmp_slate );
        
        var button_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_small_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        
        button_slate.width = 260;
        button_slate.height = 62;
        
        button_container.x = 950;
        button_container.y = 20;
        button_container.addChild( button_slate );
        tmp_container.addChild( button_container );
        
        
        var tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.WATCHNOW ), FontLibraryInstance.getFont_EPISODEMENUBUTTON(), 500 );
        tblock.x = button_slate.width/2 - tblock.naturalWidth/2;
        tblock.y = button_slate.height/2 - tblock.naturalHeight/2;
        Logger.log( 'tblock.x = ' + tblock.x );
        Logger.log( 'tblock.y = ' + tblock.y );
        button_container.addChild( tblock );
        
        return tmp_container;
    }
    
    function getCellDisabledContainer(){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getGRAY( 1 ) );
        tmp_slate.height = 100;
        tmp_slate.width = 1920;
        
        tmp_container.addChild( tmp_slate );

        return tmp_container;
    }
    function getCellInactiveContainer( ){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();
        var button_container = engine.createContainer();
        
        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getGRAY( 1 ) );
        tmp_slate.height = 100;
        tmp_slate.width = 1920;
        
        tmp_container.addChild( tmp_slate );
        
        var button_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_small_gray.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        
        button_slate.width = 260;
        button_slate.height = 62;
        
        button_container.x = 950;
        button_container.y = 20;
        button_container.addChild( button_slate );
        tmp_container.addChild( button_container );
        
        
        var tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.WATCHNOW ), FontLibraryInstance.getFont_EPISODEMENUBUTTON(), 500 );
        tblock.x = button_slate.width/2 - tblock.naturalWidth/2;
        tblock.y = button_slate.height/2 - tblock.naturalHeight/2;
        Logger.log( 'tblock.x = ' + tblock.x );
        Logger.log( 'tblock.y = ' + tblock.y );
        button_container.addChild( tblock );
        
        return tmp_container;
    }
    m_selected_container = getCellSelectionContainer();
    m_disabled_container = getCellDisabledContainer();
    m_inactive_container = getCellInactiveContainer();
    if ( text ){
        initWidget();
    }

};
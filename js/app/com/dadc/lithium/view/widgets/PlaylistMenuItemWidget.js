include( "js/app/com/dadc/lithium/view/widgets/VideoProgressWidget.js" );

/**
 */
var PlaylistMenuItemWidget = function( text, button_widgets, callback_func, args, PlaylistItemObj, render_on_start ) {
    var m_text              = text;
    var m_render_on_start   = render_on_start;
    var m_button_widgets    = button_widgets;
    var m_callback_func     = callback_func;
    var m_buttons_container = null;
    var m_root_node         = null;
    var m_video_progress_widget;
    var m_playlist_item_obj = PlaylistItemObj;
    var m_active_button     = 0;
    var m_args              = args;
    var m_selected_container;
    var m_disabled_container;
    var This = this;
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'PlaylistMenuItemWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( text, button_widgets, callback_func, args, PlaylistItemObj, render_on_start  ){
        m_text              = text;
        m_button_widgets    = button_widgets;
        m_callback_func     = callback_func;
        m_args              = args;
        m_playlist_item_obj = PlaylistItemObj;
        m_render_on_start   = render_on_start;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    this.getText = function(){return m_text;};
    this.getArgs = function(){return m_args;};
    this.setText = function( text ){m_text = text;};
    this.getSelectedButtonIndex = function(){
        return m_active_button;
    }
    this.isRendered = function(){return m_root_node != null;}
    
    this.setActive = function(){
        if ( !m_root_node.contains( m_selected_container ) ){
            m_root_node.addChildAt( m_selected_container, 0 );
        }
        if ( ! m_root_node.contains( m_buttons_container ) ){
            m_root_node.addChild( m_buttons_container );
        }
        if ( m_root_node.contains( m_disabled_container ) ){
            m_root_node.removeChild( m_disabled_container );
        }
    }
    this.setInactive = function(){
        if ( m_root_node.contains( m_selected_container ) ){
            m_root_node.removeChild( m_selected_container );
        }
        if ( m_root_node.contains( m_buttons_container ) ){
            m_root_node.removeChild( m_buttons_container );
        }
        if ( !m_root_node.contains( m_disabled_container ) ){
            m_root_node.addChildAt( m_disabled_container, 0 );
        }
    }
    this.setIndex = function( index ){
        
    }
    this.setButtonsInactive = function(){
        for( var i in m_button_widgets ){
            m_button_widgets[ i ].setInactive();
        }        
    }
    this.setCurrentButtonDisabled = function(){
        m_button_widgets[ m_active_button ].setDisabled();
    }
    this.setCurrentButtonActive = function(){
        m_button_widgets[ m_active_button ].setActive();
    }
    this.removeButtonsContainer = function(){
        if ( m_root_node.contains( m_buttons_container ) ){
            m_root_node.removeChild( m_buttons_container );
        }
    }
    this.addButtonsContainer = function(){
        if ( !m_root_node.contains( m_buttons_container ) ){
            m_root_node.addChild( m_buttons_container );
        }
    }
    this.navLeft = function(){
        if ( m_active_button > 0 ){
            this.setButtonsInactive();
            m_button_widgets[ m_active_button - 1 ].setActive();
            m_active_button--;
            return true;
        }else{
            return false;
        }
    }
    this.navRight = function(){
        if ( m_active_button < m_button_widgets.length - 1 ){
            this.setButtonsInactive();
            m_button_widgets[ m_active_button + 1 ].setActive();
            m_active_button++;
            return true;
        }else{
            return false;
        }
    }
    this.clear = function(){
        if( m_root_node ){
            while ( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
        }
        if( m_buttons_container ){
            while ( m_buttons_container.numChildren > 0 ){
                m_buttons_container.removeChildAt( 0 );
            }
        }
        m_root_node = null;
        m_video_progress_widget = null;
        m_selected_container = null;
        m_disabled_container = null;
    }
    this.refreshVideoWidget = function(){
        if( m_video_progress_widget && m_playlist_item_obj )
            m_video_progress_widget.refreshWidget( m_playlist_item_obj.getDurationInSeconds(), VideoProgressManagerInstance.getProgress( m_playlist_item_obj.getID() ) )
        
    }
    this.render = function(){
        if( This.isRendered() ) return;
        
        var tmp_container = engine.createContainer();
        var tblock;
        
        m_selected_container = getCellSelectionContainer();
        m_disabled_container = getCellDisabledContainer();
        
        m_buttons_container = engine.createContainer();
        
        //if( m_playlist_item_obj && m_playlist_item_obj !== undefined ){
            tblock = engine.createTextBlock( m_text, FontLibraryInstance.getFont_PLAYLISTMENU(), 660 );
        //}else{
           // tblock = engine.createTextBlock( m_text, FontLibraryInstance.getFont_PLAYLISTMENU(), 900 );
        //}
        if( m_root_node ){
            while ( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
        }
        
        m_root_node = engine.createContainer();
        
        tmp_container.width = 1920;
        tmp_container.height = 100;

        tblock.x = 140;
        tblock.y = 33;
        tmp_container.addChild( tblock );

        for( var i in m_button_widgets ){
            m_buttons_container.addChild( m_button_widgets[ i ].getDisplayNode() );
        }
        
        if( m_playlist_item_obj && m_playlist_item_obj !== undefined ){
            m_video_progress_widget = new VideoProgressWidget( m_playlist_item_obj.getDurationInSeconds(), VideoProgressManagerInstance.getProgress( m_playlist_item_obj.getID() ) );
            m_video_progress_widget.getDisplayNode().x = 140;
            m_video_progress_widget.getDisplayNode().y = 70;
            tmp_container.addChild( m_video_progress_widget.getDisplayNode() );
            tmp_container.y = -10;
        }
        
        m_root_node.addChild( tmp_container );

//        m_active_button = 0;
        This.setInactive();
    }
    function initWidget(){
        if( m_render_on_start ){
            This.render();
        }        

    }
    
    function getCellSelectionContainer( ){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getWHITE( 1 ) );
        tmp_slate.height = 100;
        tmp_slate.width = 1920;
        
        tmp_container.addChild( tmp_slate );
        
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

    if ( text ){
        initWidget();
    }

};
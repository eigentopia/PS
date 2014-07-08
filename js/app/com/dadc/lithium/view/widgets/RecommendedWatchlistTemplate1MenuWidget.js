include( "js/app/com/dadc/lithium/view/widgets/PlaylistMenuItemWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/PlaylistMenuButtonWidget.js" );

/**
 */
var RecommendedWatchlistTemplate1MenuWidget = function( MediaObjs ) {
    var m_root_node                     = engine.createContainer();
    var m_menu_container                = engine.createContainer();
    var m_playlist_menu_item_widgets    = [];
    var m_selected_row                  = -1;
    var m_media_objs                    = MediaObjs;

    var RENDER_THRESHOLD                = 5;
    var RENDER_FWD_THRESHOLD            = 3;

    var This                            = this;

    var ROW_WIDTH                       = 102;
    
    var MENU_OFFSET                     = -113;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'RecommendedWatchlistTemplate1 update() ' + engine_timer );
    };
    
    this.refreshWidget = function( MediaObjs ){
        m_media_objs = MediaObjs;
        
        while ( m_menu_container.numChildren > 0 ){
            m_menu_container.removeChildAt( 0 );
        }
        
        m_menu_container.y = 520;
        m_menu_container.clipRect.y = 0;
        m_playlist_menu_item_widgets = [];
        m_selected_row = -1;
        
        initWidget();
    };
    this.refreshVideoWidgets = function(){
        for( var i in m_playlist_menu_item_widgets ){
            m_playlist_menu_item_widgets[ i ].refreshVideoWidget();
        }
    }
    
    this.setFocus = function(){
        if( m_selected_row >= 0 ) m_playlist_menu_item_widgets[ m_selected_row ].setCurrentButtonActive();
    }
    this.unsetFocus = function(){
        if( m_selected_row >= 0 ) m_playlist_menu_item_widgets[ m_selected_row ].setCurrentButtonDisabled();
    }
    this.getSelectedIndex = function(){return m_selected_row;}
    
    this.getTotalMenuItems = function() {
        return m_playlist_menu_item_widgets.length;
    }
    
    this.getDisplayNode = function(){return m_root_node;};
    
    this.getSelectedArgs = function(){
        return m_playlist_menu_item_widgets[ m_selected_row ].getArgs();
    }
    
    this.getSelectedIndex = function(){return m_selected_row;}
    
    this.getSelectedButtonIndex = function(){
        if( !m_playlist_menu_item_widgets[ m_selected_row ] ){
            Logger.log( '!!!!! getSelectedButtonIndex WILL FAIL ');
        }else{
            return m_playlist_menu_item_widgets[ m_selected_row ].getSelectedButtonIndex();
        }
    }

    this.navUp = function(){
        renderOrClearTiles();
        
        if ( m_selected_row > 0 ){
            // Set to inactive the current selected episode
            m_playlist_menu_item_widgets[ m_selected_row ].setInactive();

            // Set to active the previous episode
            m_playlist_menu_item_widgets[ m_selected_row - 1 ].setActive();
            m_selected_row--;
            scrollIfNeeded();
            return true;
        }else{
            return false;
        }
    }
    
    this.navDown = function(){
        renderOrClearTiles();
        
        if ( m_selected_row < m_playlist_menu_item_widgets.length - 1 ){
            // Set to inactive the current selected episode
            m_playlist_menu_item_widgets[ m_selected_row ].setInactive();

            // Set to active the next episode
            m_playlist_menu_item_widgets[ m_selected_row + 1 ].setActive();
            m_selected_row++;
            scrollIfNeeded();
            return true;
        }else{
            return false;
        }
    }
    
    this.navLeft = function(){
        if( m_playlist_menu_item_widgets[ m_selected_row ] )
            return m_playlist_menu_item_widgets[ m_selected_row ].navLeft();
        else
            return false;
    }    
    this.navRight = function(){
        if( m_playlist_menu_item_widgets[ m_selected_row ] )
            return m_playlist_menu_item_widgets[ m_selected_row ].navRight();
        else
            return false;
    }    
    this.destroy = function(){
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        while( m_menu_container.numChildren > 0 ){
            m_menu_container.removeChildAt( 0 );
        }
        for( var i in m_playlist_menu_item_widgets ){
            m_playlist_menu_item_widgets[ i ].clear();
        }
        m_playlist_menu_item_widgets = null;
    }
    this.getY = function(){ return 520;}
    function renderOrClearTiles(){
        for( var i = 0; i < m_playlist_menu_item_widgets.length; i++ ){
            if( i >= m_selected_row - RENDER_FWD_THRESHOLD - RENDER_THRESHOLD && i <= m_selected_row + RENDER_FWD_THRESHOLD + RENDER_THRESHOLD ){
                Logger.log( 'rendering row ' + i );
                m_playlist_menu_item_widgets[ i ].render();
                if( !m_menu_container.contains( m_playlist_menu_item_widgets[ i ].getDisplayNode() ) ) m_menu_container.addChild( m_playlist_menu_item_widgets[ i ].getDisplayNode() );
                m_playlist_menu_item_widgets[ i ].getDisplayNode().y = i * ROW_WIDTH;
                
            }else{
                Logger.log( 'clearing row ' + i );
                if( m_playlist_menu_item_widgets[ i ].getDisplayNode() && m_menu_container.contains( m_playlist_menu_item_widgets[ i ].getDisplayNode() ) ){
                    m_menu_container.removeChild( m_playlist_menu_item_widgets[ i ].getDisplayNode() );
                }
                m_playlist_menu_item_widgets[ i ].clear();
            }
        }
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

    function scrollIfNeeded(){
        var selected_tile_height    = 102;
        var selected_tile_y         = m_selected_row * selected_tile_height;
        var clip_rect_height        = m_menu_container.clipRect.height;
        var diff                    = selected_tile_y + selected_tile_height - clip_rect_height;

        // Is selected tile visible?
        if( diff > -102 ){
            // Scroll up 'diff' pixels
            m_menu_container.y = 520 - diff - selected_tile_height;
            m_menu_container.clipRect.y = diff + selected_tile_height;
            UtilLibraryInstance.garbageCollect();
        }else{
            m_menu_container.y = 520;
            m_menu_container.clipRect.y = 0;
        }
    }
    
    function initWidget(){
        
        for( var row = 0; row < m_media_objs.getTotalItems(); row++ ){
            var media_obj = m_media_objs.getItem( row );
            var widget;
            var select_button_widget, info_button_widget;
            var text;

            if ( media_obj.getRootChannelID() == 114){
                text = HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( media_obj.getParentChannelName() + ' - ' + Dictionary.getText( Dictionary.TEXT.S_SEASON ) + media_obj.getSeason() + ': ' + Dictionary.getText( Dictionary.TEXT.E_EPISODE ) + media_obj.getEpisode() + ' - ' + media_obj.getTitle() ) );
            }else if ( media_obj.getRootChannelID() == 46 ){
                if( media_obj.getSeason && media_obj.getSeason() != "" ){
                    text = HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( media_obj.getParentChannelName() + ' - ' + Dictionary.getText( Dictionary.TEXT.S_SEASON ) + media_obj.getSeason() + ': ' + Dictionary.getText( Dictionary.TEXT.E_EPISODE ) + media_obj.getEpisode() + ' - ' + media_obj.getTitle() ) );
                }else{
                    text = HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( media_obj.getTitle() ) );
                }
            }else {
                text = HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( media_obj.getTitle() ) );
            }

            select_button_widget = new PlaylistMenuButtonWidget( Dictionary.getText( Dictionary.TEXT.WATCHNOW ), true );
            select_button_widget.getDisplayNode().x = 820;
            select_button_widget.getDisplayNode().y = 18;

            info_button_widget = new PlaylistMenuButtonWidget( Dictionary.getText( Dictionary.TEXT.INFO ), false );
            info_button_widget.getDisplayNode().x = 1090;
            info_button_widget.getDisplayNode().y = 18;
            
            widget = new PlaylistMenuItemWidget( text, [ select_button_widget, info_button_widget ], null, media_obj, media_obj, ( row < RENDER_THRESHOLD ) );

            m_playlist_menu_item_widgets.push( widget );

            if( row < RENDER_THRESHOLD ){
                // Add episode menu widget to our container
                m_menu_container.addChild( widget.getDisplayNode() );
                widget.getDisplayNode().y = ( ( m_menu_container.numChildren - 1 ) * 102 );
            }
        } // for ii
        
        var tmp_container;
        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_playlist_menu_item_widgets.length ) * 102 );
        m_menu_container.addChild( tmp_container );    

        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_playlist_menu_item_widgets.length + 1 ) * 102 );
        m_menu_container.addChild( tmp_container );       

        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_playlist_menu_item_widgets.length + 2 ) * 102 );
        m_menu_container.addChild( tmp_container );       

        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_playlist_menu_item_widgets.length + 3 ) * 102 );
        m_menu_container.addChild( tmp_container );       

        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_playlist_menu_item_widgets.length + 4 ) * 102 );
        m_menu_container.addChild( tmp_container );        
        
        // If we have shows to display, select the first one
        if ( m_playlist_menu_item_widgets.length > 0 ){
            m_selected_row = 0;
            m_playlist_menu_item_widgets[ m_selected_row ].setActive();
        }
    }
    
    m_menu_container.clipRect.x = 0;
    m_menu_container.clipRect.y = 0;
    m_menu_container.clipRect.width = 1920;
    m_menu_container.clipRect.height = 510;
    m_menu_container.x = MENU_OFFSET;
    m_menu_container.y = 520;
    
    m_root_node.addChild( m_menu_container );
    
    if ( MediaObjs ){
        initWidget();
    }

};
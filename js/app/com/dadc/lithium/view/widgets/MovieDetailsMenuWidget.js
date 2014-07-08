include( "js/app/com/dadc/lithium/view/widgets/ShowDetailsMenuItemWidget.js" );

/**
 * Show Details Menu Widget
 */
var MovieDetailsMenuWidget = function( ChannelFolderListObj ) {
    var m_root_node                             = engine.createContainer();
    var m_episode_menu_container                = engine.createContainer();
    var m_channel_folder_list_obj               = ChannelFolderListObj;
    var m_show_details_episodes_menu_widgets    = [];
    
    var m_selected_episode_row                  = -1;
    
    var ROW_WIDTH                           = 100;
    var ROW_SPACING                         = 2;
    

    this.update = function( engine_timer ){};
    
    this.refreshWidget = function( ChannelFolderListObj ){
        m_channel_folder_list_obj = ChannelFolderListObj;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    
    this.getSelectedRowIndex = function(){
        return m_selected_episode_row;
    }
    
    this.navUp = function(){
        if ( m_selected_episode_row > 0 ){

            // Set to inactive the current selected episode
            m_show_details_episodes_menu_widgets[ m_selected_episode_row ].setDisabled();

            // Set to active the previous episode
            m_show_details_episodes_menu_widgets[ m_selected_episode_row - 1 ].setActive();

            m_selected_episode_row--;
            scrollIfNeeded();
            
            return true;
        }else{
            return false;
        }
    }
    
    this.navDown = function(){
        if ( m_selected_episode_row < m_show_details_episodes_menu_widgets.length - 1 ){
            // Set to inactive the current selected episode
            m_show_details_episodes_menu_widgets[ m_selected_episode_row ].setDisabled();

            // Set to active the next episode
            m_show_details_episodes_menu_widgets[ m_selected_episode_row + 1 ].setActive();

            m_selected_episode_row++;
            scrollIfNeeded();
            
            return true;
        }else{
            return false;
        }
    }
    
    this.navRight = function(){
        //console.log("NAV R MovieDetailsMenuWidget row " +m_selected_episode_row)
        //if ( m_selected_episode_row > 0 ){
            // Set to inactive the current selected episode
            var showWidgetRow = m_show_details_episodes_menu_widgets[ m_selected_episode_row ]
            if ( showWidgetRow.navRight()){

                return true;
            }
            else{
                return false;
            }
        //}

        //return false;
    }
    this.navLeft = function(){
        //console.log("NAV L MovieDetailsMenuWidget")
       // if ( m_selected_episode_row > 0 ){
            // Set to inactive the current selected episode
            var showWidgetRow = m_show_details_episodes_menu_widgets[ m_selected_episode_row ]

            if(showWidgetRow.navLeft()){
                return true;
            }
            else{
                return false;
            }
        //}
        //return false
    }
    this.enterPressed = function(doWatchlist){
        //console.log("ENTER MovieDetailsMenuWidget")
       // if ( m_selected_episode_row > 0 ){
            // Set to inactive the current selected episode
            var showWidgetRow = m_show_details_episodes_menu_widgets[ m_selected_episode_row ]
            if(showWidgetRow.enterPressed(doWatchlist) ){
                //ApplicationController.removeFromUserWatchlist("media", showWidgetRow.getMediaID() )
                return true
            }
            else{
                return false;
            }
       // }
        return false
//        this.disableRow( m_selected_episode_row );
    }
    
    this.getSelectedMenuItemIndex = function(){
        return m_selected_episode_row;
    }
    
    this.getMediaIdSelectedRow = function(){
        var media_id = null;
        
        if ( m_selected_episode_row >= 0 &&
             m_show_details_episodes_menu_widgets[ m_selected_episode_row ] &&
             m_show_details_episodes_menu_widgets[ m_selected_episode_row ].getMediaID ){
             
            media_id = m_show_details_episodes_menu_widgets[ m_selected_episode_row ].getMediaID()
        }
        return media_id;
    }
    
    this.setActive = function(){
        if ( m_show_details_episodes_menu_widgets[ m_selected_episode_row ] )
            m_show_details_episodes_menu_widgets[ m_selected_episode_row ].setActive();
    }

    this.setInactive = function(){
        if ( m_show_details_episodes_menu_widgets[ m_selected_episode_row ] )
            m_show_details_episodes_menu_widgets[ m_selected_episode_row ].setInactive();
    }
    
    this.setDisabled = function(){
        if ( m_show_details_episodes_menu_widgets[ m_selected_episode_row ] )
            m_show_details_episodes_menu_widgets[ m_selected_episode_row ].setDisabled();
    }
    
    this.refreshVideoProgressWidgets = function(){
        for( var i in m_show_details_episodes_menu_widgets ){
            m_show_details_episodes_menu_widgets[ i ].refreshVideoProgressWidget();
        }
    }
    this.refreshWatchlistButton = function(){
        for( var i in m_show_details_episodes_menu_widgets ){
            m_show_details_episodes_menu_widgets[ i ].refreshWatchlistButton();
        }
    }
    this.isFocussed = function(){
        var is_focussed = false;
        
        for( var i in m_show_details_episodes_menu_widgets ){
            if( m_show_details_episodes_menu_widgets[ i ].isActive() ){
                is_focussed = true;
                break;
            }
        }
        
        return is_focussed;
        
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
    
    function initWidget(){
        while ( m_episode_menu_container.numChildren > 0 ){
            m_episode_menu_container.removeChildAt( 0 );
        }
        
        // The following for loops will search for media objects in the channel and populate widgets accordingly
        for ( var i = 0; i < m_channel_folder_list_obj.getTotalItems(); i++ ){
            for ( var ii = 0 ; ii < m_channel_folder_list_obj.getItem( i ).getPlaylistList().getTotalItems(); ii++ ){
                var play_list_obj = m_channel_folder_list_obj.getItem( i ).getPlaylistList().getItem( ii );

                // Check for the Locked To Channel attribute
                if ( play_list_obj.getLockedToChannel() ){
                    for ( var iii = 0 ; iii < m_channel_folder_list_obj.getItem( i ).getPlaylistList().getItem( ii ).getMediaList().getTotalItems(); iii++ ){
                        var media_obj = m_channel_folder_list_obj.getItem( i ).getPlaylistList().getItem( ii ).getMediaList().getItem( iii );
                        var media_id = media_obj.getID();
                        var text = "";
                        var widget;

                        if ( media_id ){
                            if ( media_obj.getSeason() ){
                                text += Dictionary.getText( Dictionary.TEXT.S_SEASON ) + media_obj.getSeason();
                                if ( media_obj.getEpisode() ){
                                    text += Dictionary.getText( Dictionary.TEXT.E_EPISODE ) + media_obj.getEpisode();
                                }
                                text += ' - ';
                            }
                            if ( media_obj.getTitle() ){
                                text += media_obj.getTitle();
                            }
                            
                            widget = new ShowDetailsMenuItemWidget( media_obj, media_id );
                            m_show_details_episodes_menu_widgets.push( widget );
                            
                            m_episode_menu_container.addChild( widget.getDisplayNode() );
                            widget.getDisplayNode().y = ( ( m_episode_menu_container.numChildren - 1 ) * 102 );
                            

                            // Add episode menu widget to our container
                            m_episode_menu_container.addChild( widget.getDisplayNode() );
                            widget.getDisplayNode().y = ( ( m_episode_menu_container.numChildren - 1 ) * 102 );

                        }
                    } // for iii
                } // if locked to channel
            } // for ii
        } // for i

        var tmp_container;
        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_show_details_episodes_menu_widgets.length ) * 102 );
        m_episode_menu_container.addChild( tmp_container );

        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_show_details_episodes_menu_widgets.length + 1 ) * 102 );
        m_episode_menu_container.addChild( tmp_container );

        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_show_details_episodes_menu_widgets.length + 2 ) * 102 );
        m_episode_menu_container.addChild( tmp_container );

        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_show_details_episodes_menu_widgets.length + 3 ) * 102 );
        m_episode_menu_container.addChild( tmp_container );

        //
        // If we have shows to display, select the first one
        if ( m_show_details_episodes_menu_widgets.length > 0 ){
            m_selected_episode_row = 0;
            m_show_details_episodes_menu_widgets[ m_selected_episode_row ].setActive();
//            m_root_node.addChild( m_show_detail_text_widgets[ m_selected_episode_row ].getDisplayNode() );
        }
    }
    
    function scrollIfNeeded(){
//        var selected_tile           = m_movie_list_tile_widgets[ m_ix_selected_tile[0] ][ m_ix_selected_tile[1] ];
        var selected_tile_y         = m_selected_episode_row * ( ROW_WIDTH + ROW_SPACING );
        var selected_tile_height    = ROW_WIDTH + ROW_SPACING;
        var clip_rect_height        = m_episode_menu_container.clipRect.height;
        var diff                    = selected_tile_y + selected_tile_height - clip_rect_height;

        // Is selected tile visible?
        if( diff > -( ROW_WIDTH + ROW_SPACING ) ){
            // Scroll up 'diff' pixels
            m_episode_menu_container.y = 720 - diff - ( ROW_WIDTH + ROW_SPACING );
            m_episode_menu_container.clipRect.y = diff + ( ROW_WIDTH + ROW_SPACING );
        }else{
            m_episode_menu_container.y = 720;
            m_episode_menu_container.clipRect.y = 0;
        }
    }        
    
    m_root_node.addChild( m_episode_menu_container );
    m_episode_menu_container.clipRect.x = 0;
    m_episode_menu_container.clipRect.y = 0;
    m_episode_menu_container.clipRect.width = 1920;
    m_episode_menu_container.clipRect.height = 306;
    m_episode_menu_container.y = 720;
    
    if ( ChannelFolderListObj ){
        initWidget();
    }
  

};
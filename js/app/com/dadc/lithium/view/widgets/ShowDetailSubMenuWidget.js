/**
 * Show Detail Sub Menu Widget
 */
var ShowDetailSubMenuWidget = function( ShowDetailsEpisodeMenuWidgetsObjs, menu_captions ) {
    var m_root_node                             = engine.createContainer();
    var m_show_details_episode_menu_widgets_obj = ShowDetailsEpisodeMenuWidgetsObjs;
    var m_menu_captions                         = menu_captions;
    var m_menu_captions_containers              = engine.createContainer();

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ShowDetailSubMenuWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( ShowDetailsEpisodeMenuWidgetsObjs, menu_captions ){
       m_show_details_episode_menu_widgets_obj = ShowDetailsEpisodeMenuWidgetsObjs;
       m_menu_captions = menu_captions;
       initWidget();
    };
    
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    
    this.setActive = function( menu_ix ){
        
    }
    
    function initWidget(){
        var container;
        var tblock;
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        for( var i = 0; i < m_menu_captions.length; i++ ){
            var tmp_container;
            
            tblock = engine.createTextBlock( m_menu_captions[ i ], FontLibraryInstance.getFont_MENUCAPTION, 300 );
            tmp_container.addChild( tblock );
            
            tmp_container.width = tblock.naturalWidth;
            tmp_container.height = tblock.naturalHeight;
            
            m_menu_captions_containers.addChild( tmp_container );
        }
        
    }
    
    function loadImage( url, container ){
        engine.loadImage( url, function( image_node ){
            if ( image_node ){
                Logger.log( 'container.x = ' + container.x );
                image_node.width = 260;
                image_node.height = 390;
                container.addChild( image_node );
            }
        });
    }
    
    if ( m_channel_details_obj ){
        initWidget();
    }

};
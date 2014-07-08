/**
 * Recommended Watchlist Text Widget
 */
var RecommendedWatchlistTextWidget = function( ChannelDetailsObj ) {
    var m_root_node             = engine.createContainer();
    var m_channel_details_obj   = ChannelDetailsObj;
    
    var m_movie_rating_widget;
    
    var ANIMATION_DIRECTION = {
        UP: 1,
        DOWN: 2
    };
    
    var ANIMATION_STEPS = 5;
    var ANIMATION_INTERVAL = .09;
    var ANIMATION_INCREMENT = 3;
    var CLIPRECT_INCREMENT = 5;
    
    var m_animation_scrolling_initial_container = -1;
    var m_animation_direction = -1;
    var m_last_engine_timer = 0;
    var m_animation_enabled = 0;
    var m_animation_final_cliprect_y = -1;
    var m_animation_steps = ANIMATION_STEPS;
    var m_animation_interval = ANIMATION_INTERVAL;
    
    var CAPTION_DISTANCE = 25;

    var m_height;
    
    var m_rating_y_coord;
    
    var m_containers = [];
    
    var MAXIMUM_HEIGHT = 480;
    
    var TEXT_WIDTH = 900 - ( 350 - 30 - 260 );

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'RecommendedWatchlistTextWidget update() ' + engine_timer );
        
        if ( InputManager.isKeyCurrentlyPressed() && InputManager.getCurrentlyPressedKey() + "" == 'Q' ){
            this.scrollDown();
            m_animation_steps += ANIMATION_INCREMENT;
        }

        if ( InputManager.isKeyCurrentlyPressed() && InputManager.getCurrentlyPressedKey() + "" == 'A' ){
            this.scrollUp();
            m_animation_steps += ANIMATION_INCREMENT;
        }

        if ( m_animation_enabled && m_last_engine_timer + m_animation_interval < engine_timer ){
            m_last_engine_timer = engine_timer;
            if ( m_root_node.clipRect.y > m_root_node.height ){
                m_root_node.clipRect.y = m_root_node.height;
                m_root_node.y = -m_root_node.height;
                disableAnimation();
                return;
            }
            if ( m_root_node.clipRect.y < 0 ){
                m_root_node.clipRect.y = 0;
                m_root_node.y = 0;
                disableAnimation();
                return;
            }
            if ( m_animation_direction == ANIMATION_DIRECTION.UP ){
                if ( m_root_node.clipRect.y > m_animation_final_cliprect_y ){
                    m_root_node.clipRect.y -= m_animation_steps;
                    m_root_node.y += m_animation_steps;
                }else{
                    disableAnimation();
                }
            }
            if ( m_animation_direction == ANIMATION_DIRECTION.DOWN ){
                if ( m_root_node.clipRect.y < m_animation_final_cliprect_y ){
                    m_root_node.clipRect.y += m_animation_steps;
                    m_root_node.y -= m_animation_steps;
                }else{
                    disableAnimation();
                }
            }
        }
    };
    
    this.scrollUp = function(){
        m_animation_enabled = 1;
        m_animation_direction = ANIMATION_DIRECTION.UP;
        m_animation_final_cliprect_y = m_root_node.clipRect.y - CLIPRECT_INCREMENT;
    }
    this.scrollDown = function(){
        m_animation_enabled = 1;
        m_animation_direction = ANIMATION_DIRECTION.DOWN;
        m_animation_final_cliprect_y = m_root_node.clipRect.y + CLIPRECT_INCREMENT;
    }
    
    /**
     * We want to call this method when the widget received a focus so we can
     * restart the animation if needed
     */
    this.resetContainerPositionsAndCheckForAnimation = function(){
        Logger.log( 'ShowDetailTextWidget: resetContainerPositionsAndCheckForAnimation' );
        Logger.log( 'm_animation_scrolling_initial_container = ' + m_animation_scrolling_initial_container );

    }
    
    this.refreshWidget = function( ChannelDetailsObj ){
        m_channel_details_obj = ChannelDetailsObj;
        initWidget();
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.getRatingYCoord = function(){
        return m_rating_y_coord;
    }
    this.destroy = function(){
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        m_root_node = null;
        UtilLibraryInstance.garbageCollect();
    }
    
    function disableAnimation(){
        m_animation_enabled = 0;
        m_animation_steps = ANIMATION_STEPS;
    }
    
    function initWidget(){
        var container;
        var next_y = 0;
        var tblock;
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        // Title container
        container = engine.createContainer();
        tblock = engine.createTextBlock( m_channel_details_obj.getName(), FontLibraryInstance.getFont_MOVIEDETAILCHAPTERTITLE(), TEXT_WIDTH );
        container.addChild( tblock );
        container.y = -10;
        m_root_node.addChild( container );
        next_y = next_y + tblock.naturalHeight;
        m_height += tblock.naturalHeight;
        
        m_containers.push( container );

        container = engine.createContainer();
        tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DESCRIPTION ), FontLibraryInstance.getFont_SHOWDETAILSDISABLED(), TEXT_WIDTH  );
        container.addChild( tblock );
        container.y = next_y + 10;
        m_root_node.addChild( container );
        next_y = next_y + tblock.naturalHeight + 5;
        m_height += tblock.naturalHeight;

        m_containers.push( container );

        // Description
        container = engine.createContainer();
        tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( m_channel_details_obj.getDescription() ), FontLibraryInstance.getFont_SHOWDETAILTEXT(), TEXT_WIDTH  );
        container.addChild( tblock );
        container.y = next_y;
        m_root_node.addChild( container );
        next_y = next_y + tblock.naturalHeight;
        m_height += tblock.naturalHeight;

        m_containers.push( container );
        
        m_containers.push( container );

        m_root_node.height = m_height;
        m_root_node.clipRect.height = MAXIMUM_HEIGHT;
        m_root_node.clipRect.width = 900;
    }
    
    if ( m_channel_details_obj ){
        initWidget();
    }
};

RecommendedWatchlistTextWidget.ANIMATION_DIRECTION = {
    UP: 1,
    DOWN: 2
}
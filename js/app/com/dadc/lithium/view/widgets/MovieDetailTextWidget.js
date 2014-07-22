include( "js/app/com/dadc/lithium/view/widgets/ScrollbarWidget.js" );

/**
 * Show Detail Text Widget
 */
var MovieDetailTextWidget = function( ChannelDetailsObj ) {
    var m_root_node             = engine.createContainer();
    var m_master_container      = engine.createContainer();
    var m_channel_details_obj   = ChannelDetailsObj;
    
    var m_movie_rating_widget   = new MovieRatingWidget();
    var m_scrollbar_widget      = new ScrollbarWidget( ScrollbarWidget.SIZE.VERY_LONG );
    
    var ANIMATION_DIRECTION = {
        UP: 1,
        DOWN: 2
    };
    
    var ANIMATION_STEPS = 5;
    var ANIMATION_INTERVAL = .09;
    var ANIMATION_INCREMENT = 3;
    var CLIPRECT_INCREMENT = 15;
    
    var m_animation_scrolling_initial_container = -1;
    var m_animation_direction = -1;
    var m_last_engine_timer = 0;
    var m_animation_enabled = 0;
    var m_animation_final_cliprect_y = -1;
    var m_animation_steps = ANIMATION_STEPS;
    var m_animation_interval = ANIMATION_INTERVAL;
    
    var CAPTION_DISTANCE = 25;
    
    var m_height = 0;
    
    var m_rating_y_coord;
    
    var MAXIMUM_HEIGHT = 900;
    
    var TEXT_WIDTH = 760;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) LoggerConfig.log( 'MovieDetailTextWidget update() ' + engine_timer );
        // if ( m_scrollbar_widget.getFocus() && InputManager.isKeyCurrentlyPressed() && (InputManager.getCurrentlyPressedKey() == engine.keymap.controllerPS3.DOWN) ){
        //     this.scrollDown();
        //     m_animation_steps += ANIMATION_INCREMENT;
        // }

        // if ( m_scrollbar_widget.getFocus() && InputManager.isKeyCurrentlyPressed() && (InputManager.getCurrentlyPressedKey() == engine.keymap.controllerPS3.UP) ){
        //     this.scrollUp();
        //     m_animation_steps += ANIMATION_INCREMENT;
        // }

        if ( m_animation_enabled && m_last_engine_timer + m_animation_interval < engine_timer ){
            m_last_engine_timer = engine_timer;
            if ( m_master_container.clipRect.y > m_master_container.height - m_master_container.clipRect.height ){
                m_master_container.clipRect.y = m_master_container.height - m_master_container.clipRect.height;
                m_master_container.y = -m_master_container.height + m_master_container.clipRect.height;
                disableAnimation();
                return;
            }
            if ( m_master_container.clipRect.y < 0 ){
                m_master_container.clipRect.y = 0;
                m_master_container.y = 0;
                disableAnimation();
                m_scrollbar_widget.setOffset( 0 );
                return;
            }
            if ( m_animation_direction == ANIMATION_DIRECTION.UP ){
                if ( m_master_container.clipRect.y > m_animation_final_cliprect_y ){
                    if( m_master_container.clipRect.y - m_animation_steps < 0 ){
                        m_master_container.clipRect.y = 0;
                        m_master_container.y = 0;
                        disableAnimation();
                        m_scrollbar_widget.setOffset( 0 );
                    }else{
                        m_master_container.clipRect.y -= m_animation_steps;
                        m_master_container.y += m_animation_steps;
                    }
                }else{
                    disableAnimation();
                }
            }
            if ( m_animation_direction == ANIMATION_DIRECTION.DOWN ){
                if ( m_master_container.clipRect.y < m_animation_final_cliprect_y ){
                    m_master_container.clipRect.y += m_animation_steps;
                    m_master_container.y -= m_animation_steps;
                }else{
                    disableAnimation();
                }
            }
            
            updateScrollbar();
        }
    };
    
    this.scrollUp = function(){
        m_animation_enabled = 1;
        m_animation_direction = ANIMATION_DIRECTION.UP;
        m_animation_final_cliprect_y = m_master_container.clipRect.y - CLIPRECT_INCREMENT;
        if( m_animation_final_cliprect_y < 0 ){
            m_master_container.clipRect.y = 0;
            m_master_container.y = 0;
            m_scrollbar_widget.setOffset( 0 );
            disableAnimation();
            m_animation_enabled = 0;
        }
    }
    this.scrollDown = function(){
        m_animation_enabled = 1;
        m_animation_direction = ANIMATION_DIRECTION.DOWN;
        m_animation_final_cliprect_y = m_master_container.clipRect.y + CLIPRECT_INCREMENT;
        
        if( m_animation_final_cliprect_y > m_height - m_master_container.clipRect.height ){
            disableAnimation();
            m_scrollbar_widget.setOffset( 1 );
            m_animation_enabled = 0;
        }
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
        m_height = 0;
        m_master_container.clipRect.y = 0;
        m_master_container.y = 0;
        
        if ( m_channel_details_obj ){
            initWidget();
        }
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.clear = function(){
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }        
    }
    this.getRatingYCoord = function(){
        return m_rating_y_coord;
    }
    this.setScrollbarFocus = function( value ){
        m_scrollbar_widget.setFocus( value );
    }
    this.setScrollbarVisible = function( value ){
        m_scrollbar_widget.setVisible( value );
    }
    
    this.getScrollbarFocus = function(){
        return m_scrollbar_widget.getFocus();
    }
    this.getScrollbarVisibility = function(){
        return m_scrollbar_widget.getVisibility();
    }
    
    function disableAnimation(){
        m_animation_enabled = 0;
        m_animation_steps = ANIMATION_STEPS;
    }
    function updateScrollbar(){
        var offset = Math.abs( m_master_container.y ) / ( m_height - m_master_container.clipRect.height );
        Logger.log( 'offset = ' + offset );
        if( offset > 1 ) offset = 1;
        if( offset < 0 ) offset = 0;
        m_scrollbar_widget.setOffset( offset );
    }
    
    function initWidget(){
        var container;
        var next_y = 0;
        var tblock;
        var text_container = engine.createContainer();
        text_container.y = -12;
        
        while ( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        

        try{
            m_root_node.addChild( m_master_container );
            m_root_node.addChild( m_scrollbar_widget.getDisplayNode() );

            m_master_container.addChild( text_container );

            var detailsObj = m_channel_details_obj.getFeaturedMedia(); 

            if( detailsObj ){
                // Title container
                container = engine.createContainer();
                tblock = engine.createTextBlock( detailsObj.getTitle(), FontLibraryInstance.getFont_MOVIEDETAILCHAPTERTITLE(), TEXT_WIDTH );
                container.addChild( tblock );
                container.y = 5;
                text_container.addChild( container );
                next_y = next_y + tblock.naturalHeight;
                m_height += tblock.naturalHeight;
            }

            // Rating, genre and length container
            container = engine.createContainer();
            var length_text = "";
            var length_in_minutes;
            if ( detailsObj.getDurationInSeconds() && detailsObj.getDurationInSeconds() != "" ){
                length_in_minutes = Math.round( detailsObj.getDurationInSeconds() / 60 );
                length_text = length_in_minutes + " " + Dictionary.getText( Dictionary.TEXT.MIN );
            }
            tblock = engine.createTextBlock( detailsObj.getRating() + " | " + detailsObj.getGenre() + " | " + length_text, FontLibraryInstance.getFont_MOVIEINFOTEXT(), TEXT_WIDTH  );
            container.addChild( tblock );
            container.y = next_y + 5;
            text_container.addChild( container );
            next_y = next_y + tblock.naturalHeight;

            // Title container
            if ( detailsObj.getRightsExpirationDate() && detailsObj.getRightsExpirationDate() != "" ){
                var exp_date = new Date( detailsObj.getRightsExpirationDate() );
                var today = new Date();
                var one_day = 1000*60*60*24;
                var days_diff = Math.ceil( ( exp_date.getTime() - today.getTime() ) / one_day );
                var exp_date_text;
                var exp_font = FontLibraryInstance.getFont_MOVIEINFOTEXT();

                if ( days_diff <= 5 && days_diff >= 0 ){
                    if( days_diff == 1 ){
                        exp_date_text = days_diff + ' ' + Dictionary.getText( Dictionary.TEXT.DAY_LEFT_TO_WATCH );
                    }else{
                        exp_date_text = days_diff + ' ' + Dictionary.getText( Dictionary.TEXT.DAYS_LEFT_TO_WATCH );
                    }
                    exp_font = FontLibraryInstance.getFont_MOVIEINFOTEXTRED();
                } else if ( days_diff >= 90 ){
                    exp_date_text = '';
                } else{

                    //format for country mm/ddyy for us
                    //the right way for everyone else
                    if(StorageManagerInstance.get( 'geocode' ).toUpperCase() == 'US'){
                        exp_date_text = Dictionary.getText( Dictionary.TEXT.EXPIRES ) + ': ' + ( exp_date.getMonth() + 1 ) + "/" + exp_date.getDate() + "/" + exp_date.getFullYear();
                    }
                    else{   
                        exp_date_text = Dictionary.getText( Dictionary.TEXT.EXPIRES ) + ': ' + exp_date.getDate() + "/" + ( exp_date.getMonth() + 1 ) + "/" + exp_date.getFullYear();
                    }
                }

                if(exp_date_text != ''){
                    container = engine.createContainer();
                    tblock = engine.createTextBlock( exp_date_text, exp_font, TEXT_WIDTH );
    
                    container.addChild( tblock );
                    container.y = next_y;
                    text_container.addChild( container );
                    next_y = next_y + tblock.naturalHeight;
                }
            }

            m_rating_y_coord = 10 + next_y;

            next_y = next_y + CAPTION_DISTANCE + 20;

    //        // Description containers
    //        container = engine.createContainer();
    //        tblock = engine.createTextBlock( 'Description', FontLibraryInstance.getFont_SHOWDETAILSDISABLED(), TEXT_WIDTH  );
    //        container.addChild( tblock );
    //        container.y = next_y + 30;
    //        m_master_container.addChild( container );
    //        next_y = next_y + tblock.naturalHeight + CAPTION_DISTANCE;

            // Why It Crackles
            tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.WHY_IT_CRACKLES ), FontLibraryInstance.getFont_BUBBLEWHYITCRACKLES(), 1100 );
            container = engine.createContainer();
            container.addChild( tblock );
            container.y = next_y + 30;
            text_container.addChild( container );
            next_y = next_y + tblock.naturalHeight + CAPTION_DISTANCE;

            container = engine.createContainer();
            tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( detailsObj.getWhyItCrackles() ) ) ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), TEXT_WIDTH  );
            container.addChild( tblock );
            container.y = next_y;
            text_container.addChild( container );
            next_y = next_y + tblock.naturalHeight;

            if( detailsObj.getCast ){
                // Cast containers
                container = engine.createContainer();
                tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.CAST ), FontLibraryInstance.getFont_SHOWDETAILSDISABLED(), TEXT_WIDTH  );
                container.addChild( tblock );
                container.y = next_y + 30;
                text_container.addChild( container );
                next_y = next_y + tblock.naturalHeight + CAPTION_DISTANCE;

                container = engine.createContainer();
                tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( detailsObj.getCast() ), FontLibraryInstance.getFont_SHOWDETAILTEXT(), TEXT_WIDTH  );
                container.addChild( tblock );
                container.y = next_y;
                text_container.addChild( container );
                next_y = next_y + tblock.naturalHeight;

                // Director containers
                container = engine.createContainer();
                tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DIRECTORS ), FontLibraryInstance.getFont_MOVIEDETAILSDISABLED(), TEXT_WIDTH  );
                container.addChild( tblock );
                container.y = next_y + 30;
                text_container.addChild( container );
                next_y = next_y + tblock.naturalHeight + CAPTION_DISTANCE;

                container = engine.createContainer();
                tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( detailsObj.getDirectors() ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), TEXT_WIDTH  );
                container.addChild( tblock );
                container.y = next_y;
                text_container.addChild( container );
                next_y = next_y + tblock.naturalHeight;

                // Director containers
                container = engine.createContainer();
                tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.WRITERS ), FontLibraryInstance.getFont_MOVIEDETAILSDISABLED(), TEXT_WIDTH  );
                container.addChild( tblock );
                container.y = next_y + 30;
                text_container.addChild( container );
                next_y = next_y + tblock.naturalHeight + CAPTION_DISTANCE;

                container = engine.createContainer();
                tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( detailsObj.getWriters() ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), TEXT_WIDTH  );
                container.addChild( tblock );
                container.y = next_y;
                text_container.addChild( container );
                next_y = next_y + tblock.naturalHeight;
            } 

            // Description containers
            container = engine.createContainer();
            tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DESCRIPTION ), FontLibraryInstance.getFont_MOVIEDETAILSDISABLED(), TEXT_WIDTH  );
            container.addChild( tblock );
            container.y = next_y + 30;
            text_container.addChild( container );
            next_y = next_y + tblock.naturalHeight + CAPTION_DISTANCE;

            container = engine.createContainer();
            tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( detailsObj.getDescription() ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), TEXT_WIDTH  );
            container.addChild( tblock );
            container.y = next_y;
            text_container.addChild( container );
            next_y = next_y + tblock.naturalHeight;

            m_height = container.y + tblock.naturalHeight + text_container.y;

            m_master_container.height = m_height;
            m_master_container.clipRect.height = MAXIMUM_HEIGHT;
            m_master_container.clipRect.width = TEXT_WIDTH;

            m_movie_rating_widget.refreshWidget( detailsObj.getUserRating(), false );
            m_movie_rating_widget.getDisplayNode().y = m_rating_y_coord;

            Logger.log( 'm_height = ' + m_height );
            if ( m_height > MAXIMUM_HEIGHT ){
                m_scrollbar_widget.setVisible( true );
                m_scrollbar_widget.setFocus( false );
            }else{
                m_scrollbar_widget.setVisible( false );
            }

            m_master_container.addChild( m_movie_rating_widget.getDisplayNode() );
        }catch( e ){
            Logger.log( '!!!EXCEPTION MovieDetailTextWidget' );
            Logger.logObj( e );
        }
    }
    
    if ( m_channel_details_obj ){
        initWidget();
    }
    
    m_scrollbar_widget.setVisible( false );
    m_scrollbar_widget.getDisplayNode().x = TEXT_WIDTH + 20;
    m_scrollbar_widget.getDisplayNode().y = 0;

};

MovieDetailTextWidget.ANIMATION_DIRECTION = {
    UP: 1,
    DOWN: 2
}
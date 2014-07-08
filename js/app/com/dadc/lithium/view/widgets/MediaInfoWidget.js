include( "js/app/com/dadc/lithium/view/widgets/ScrollbarWidget.js" );


/**
 * Media Info Widget
 */
var MediaInfoWidget = function( MediaDetailsObj ) {
    var m_root_node                         = engine.createContainer();
    var m_master_container                  = engine.createContainer();
    var m_media_details_obj                 = MediaDetailsObj;
    var m_rating_y_coord = 150;
    var m_movie_rating_widget               = new MovieRatingWidget( null );
    var m_scrollbar_widget                  = new ScrollbarWidget( ScrollbarWidget.SIZE.LONG );
    
    var This = this;

    var m_content_container = engine.createContainer();
    var m_picture_container = engine.createContainer();

    var last_y = 0;
    var last_height = 0;
    
    var TEXT_WIDTH = 760;
    
    var CONTENT_Y = 265;
    
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

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MediaInfoWidget update() ' + engine_timer );
        
        if ( m_scrollbar_widget.getFocus() && InputManager.isKeyCurrentlyPressed() && InputManager.getCurrentlyPressedKey() == engine.keymap.controllerPS3.DOWN ){
            this.scrollDown();
            m_animation_steps += ANIMATION_INCREMENT;
        }

        if ( m_scrollbar_widget.getFocus() && InputManager.isKeyCurrentlyPressed() && InputManager.getCurrentlyPressedKey() == engine.keymap.controllerPS3.UP ){
            this.scrollUp();
            m_animation_steps += ANIMATION_INCREMENT;
        }
        if ( m_animation_enabled && m_last_engine_timer + m_animation_interval < engine_timer ){
            
            m_last_engine_timer = engine_timer;
            if ( m_content_container.clipRect.y > m_content_container.height - m_content_container.clipRect.height ){
                m_content_container.clipRect.y = m_content_container.height - m_content_container.clipRect.height;
                m_content_container.y = -m_content_container.height + m_content_container.clipRect.height;
                disableAnimation();
                return;
            }
            if ( m_content_container.clipRect.y < 0 ){
                m_content_container.clipRect.y = 0;
                m_content_container.y = 0;
                disableAnimation();
                m_scrollbar_widget.setOffset( 0 );
                return;
            }
            if ( m_animation_direction == ANIMATION_DIRECTION.UP ){
                if ( m_content_container.clipRect.y > m_animation_final_cliprect_y ){
                    if( m_content_container.clipRect.y - m_animation_steps < 0 ){
                        m_content_container.clipRect.y = 0;
                        m_content_container.y = 0;
                        disableAnimation();
                        m_scrollbar_widget.setOffset( 0 );
                    }else{
                        m_content_container.clipRect.y -= m_animation_steps;
                        m_content_container.y += m_animation_steps;
                    }
                }else{
                    disableAnimation();
                }
            }
            if ( m_animation_direction == ANIMATION_DIRECTION.DOWN ){
                if ( m_content_container.clipRect.y < m_animation_final_cliprect_y ){
                    m_content_container.clipRect.y += m_animation_steps;
                    m_content_container.y -= m_animation_steps;
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
        m_animation_final_cliprect_y = m_content_container.clipRect.y - CLIPRECT_INCREMENT;
        if( m_animation_final_cliprect_y < 0 ){
            m_content_container.clipRect.y = 0;
            m_content_container.y = 0;
            m_scrollbar_widget.setOffset( 0 );
            disableAnimation();
            m_animation_enabled = 0;
        }
    }
    this.scrollDown = function(){
        m_animation_enabled = 1;
        m_animation_direction = ANIMATION_DIRECTION.DOWN;
        m_animation_final_cliprect_y = m_content_container.clipRect.y + CLIPRECT_INCREMENT;
        
        if( m_animation_final_cliprect_y > m_content_container.height - m_content_container.clipRect.height ){
            disableAnimation();
            m_scrollbar_widget.setOffset( 1 );
            m_animation_enabled = 0;
        }
    }
    
    this.refreshWidget = function( MediaDetailsObj ){
        m_media_details_obj = MediaDetailsObj;
       initWidget();
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.clear = function(){
        while ( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }        
    }
    this.getRatingYCoord = function(){
        return m_rating_y_coord;
    }
    this.notifyJSImageUpdated = function( js_image ){
        addImageToContainer( js_image );
    }    
    function disableAnimation(){
        m_animation_enabled = 0;
        m_animation_steps = ANIMATION_STEPS;
    }    
    function updateScrollbar(){
        var offset = Math.abs( m_content_container.clipRect.y ) / ( m_content_container.height - m_content_container.clipRect.height );
        Logger.log( 'offset = ' + offset );
        if( offset > 1 ) offset = 1;
        if( offset < 0 ) offset = 0;
        m_scrollbar_widget.setOffset( offset );
    }    
    
    function initWidget(){
        var container;
        var tblock;
        var length_text = "";
        var length_in_minutes;
        var bg_container;
        var inside_bg_container;
        var text;
        var subcontent_container = engine.createContainer();
 
        while ( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }

        while ( m_content_container.numChildren > 0 ){
            m_content_container.removeChildAt( 0 );
        }
        
        while ( m_picture_container.numChildren > 0 ){
            m_picture_container.removeChildAt( 0 );
        }
        
        bg_container = getBackgroundContainer();
        bg_container.x = -2000;
        bg_container.y = -2000;
        inside_bg_container = getInsideBackgroundContainer();
        
//        m_content_container.x = 900;
//        m_content_container.y = CONTENT_Y;
        
        subcontent_container.x = 900;
        subcontent_container.y = CONTENT_Y;
        
        m_picture_container.x = 600;
        m_picture_container.y = 265;
        
        inside_bg_container.x = 550;
        inside_bg_container.y = 220;
        
        
        m_master_container.addChild( bg_container );
        m_master_container.addChild( inside_bg_container );
        m_master_container.addChild( subcontent_container );
        subcontent_container.addChild( m_content_container );
//        m_master_container.addChild( m_content_container );
        m_master_container.addChild( m_picture_container );
        
        loadImage( m_media_details_obj.getThumbnail_OneSheet185x277() );
        
        // Title container
        if ( m_media_details_obj.getRootChannel() == 'Television' ){
            text = HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( Dictionary.getText( Dictionary.TEXT.S_SEASON ) + m_media_details_obj.getSeason() + ':' + Dictionary.getText( Dictionary.TEXT.E_EPISODE ) + m_media_details_obj.getEpisode() + ' - ' + m_media_details_obj.getTitle() ) );
        } else {
            text = HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( m_media_details_obj.getTitle() ) );
        }
        
        container = engine.createContainer();
        tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( text ), FontLibraryInstance.getFont_MOVIEDETAILCHAPTERTITLE(), TEXT_WIDTH );
        container.addChild( tblock );
        container.y = -12;
        m_content_container.addChild( container );
        last_y = container.y;
        last_height = tblock.naturalHeight;
        
        // Rating, genre and length container
        container = engine.createContainer();
        
        if ( m_media_details_obj.getDurationInSeconds &&
            m_media_details_obj.getDurationInSeconds() &&
            m_media_details_obj.getDurationInSeconds() != "" ){
            length_in_minutes = Math.round( m_media_details_obj.getDurationInSeconds() / 60 );
            length_text = " | " + length_in_minutes + " Min";
        }
        
        var genres;
        var genre_text = null;
        
        if ( m_media_details_obj.getGenre && m_media_details_obj.getGenre() ){
            genres = m_media_details_obj.getGenre().split( ',' );
        
            if ( genres.length > 0 ){
                genre_text = genres[ 0 ];
            }
        }
        
        tblock = engine.createTextBlock(
            [ UtilLibraryInstance.getTextOrNA( ( m_media_details_obj.getRating && m_media_details_obj.getRating() ? m_media_details_obj.getRating() + " | " : "" ) ),
              UtilLibraryInstance.getTextOrNA( ( genre_text ? genre_text : "" ) ),
              UtilLibraryInstance.getTextOrNA( length_text ) ],
            [ FontLibraryInstance.getFont_MOVIEDETAILSLENGTHLINE(),
              FontLibraryInstance.getFont_MOVIEDETAILSRATING(),
              FontLibraryInstance.getFont_MOVIEDETAILSLENGTHLINE() ],
              TEXT_WIDTH );
        
        container.addChild( tblock );
        container.y = last_y + last_height;
        m_content_container.addChild( container );
        last_y = container.y;
        last_height = tblock.naturalHeight;
        if (
            m_media_details_obj.getRightsExpirationDate &&
            m_media_details_obj.getRightsExpirationDate()
            ){
                    
            var exp_date = new Date( m_media_details_obj.getRightsExpirationDate() );

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
                exp_date_text = Dictionary.getText( Dictionary.TEXT.EXPIRES ) + ': ' + exp_date.getDate() + "/" + ( exp_date.getMonth() + 1 ) + "/" + exp_date.getFullYear();
            }
            
            container = engine.createContainer();
            tblock = engine.createTextBlock( exp_date_text, exp_font, TEXT_WIDTH );
            container.addChild( tblock );
            container.y = last_y + last_height;
            m_content_container.addChild( container );
            last_y = container.y;
            if ( exp_date_text != "" ){
                last_height = tblock.naturalHeight;
            }else{
                last_height = 0;
            }
       }
       
       m_rating_y_coord = 10 + last_y + last_height;
       last_y = last_y + 10 + last_height;
       last_height = 10;
       
//       // Why It Crackles
//        tblock = engine.createTextBlock( 'Why It Crackles', FontLibraryInstance.getFont_BUBBLEWHYITCRACKLES(), 1100 );
//        container = engine.createContainer();
//        container.addChild( tblock );
//        container.y = last_y + last_height + 30;
//        m_master_container.addChild( container );
//        last_y = container.y;
//        last_height = tblock.naturalHeight;
//        
//        container = engine.createContainer();
//        tblock = engine.createTextBlock( HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( m_media_details_obj.getWhyItCrackles() ) ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), TEXT_WIDTH  );
//        container.addChild( tblock );
//        
//        container.y = last_y + last_height;
//        m_master_container.addChild( container );
//        last_y = container.y;
//        last_height = tblock.naturalHeight;

        // Cast containers
        tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( Dictionary.getText( Dictionary.TEXT.CAST ) ), FontLibraryInstance.getFont_MOVIEDETAILSDISABLED(), TEXT_WIDTH );
        container = engine.createContainer();
        container.addChild( tblock );
        container.y = last_y + last_height + 30;
        m_content_container.addChild( container );
        last_y = container.y;
        last_height = tblock.naturalHeight;
        
        container = engine.createContainer();
        tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( m_media_details_obj.getCast() ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), TEXT_WIDTH  );
        container.addChild( tblock );
        
        container.y = last_y + last_height - 5;
        m_content_container.addChild( container );
        last_y = container.y;
        last_height = tblock.naturalHeight;
        
        // Director containers
        container = engine.createContainer();
        tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( Dictionary.getText( Dictionary.TEXT.DIRECTORS ) ), FontLibraryInstance.getFont_MOVIEDETAILSDISABLED(), TEXT_WIDTH  );
        container.addChild( tblock );
        container.y = last_y + last_height + 30;
        m_content_container.addChild( container );
        last_y = container.y;
        last_height = tblock.naturalHeight;
        
        container = engine.createContainer();
        if ( m_media_details_obj.getDirectors ){
            tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( m_media_details_obj.getDirectors() ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), TEXT_WIDTH  );
            container.addChild( tblock );
        }
        
        container.y = last_y + last_height - 5;
        m_content_container.addChild( container );
        last_y = container.y;
        last_height = tblock.naturalHeight;

        // Writers containers
        container = engine.createContainer();
        tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( Dictionary.getText( Dictionary.TEXT.WRITERS ) ), FontLibraryInstance.getFont_MOVIEDETAILSDISABLED(), TEXT_WIDTH  );
        container.addChild( tblock );
        container.y = last_y + last_height + 30;
        m_content_container.addChild( container );
        last_y = container.y;
        last_height = tblock.naturalHeight;
        
        if ( m_media_details_obj.getWriters ){
            tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( m_media_details_obj.getWriters() ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), TEXT_WIDTH  );
            
            container = engine.createContainer();
            container.addChild( tblock );
            container.y = last_y + last_height - 5;
            m_content_container.addChild( container );
            last_y = container.y;
            last_height = tblock.naturalHeight;
        }
        

        // Description containers
        if ( m_media_details_obj.getDescription ){
            container = engine.createContainer();
            tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( Dictionary.getText( Dictionary.TEXT.DESCRIPTION ) ), FontLibraryInstance.getFont_MOVIEDETAILSDISABLED(), TEXT_WIDTH  );
            container.addChild( tblock );
            container.y = last_y + last_height + 30;
            m_content_container.addChild( container );
            last_y = container.y;
            last_height = tblock.naturalHeight;
            
            container = engine.createContainer();
            
            tblock = engine.createTextBlock( UtilLibraryInstance.getTextOrNA( m_media_details_obj.getDescription() ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), TEXT_WIDTH );
            container.addChild( tblock );
            container.y = last_y + last_height - 5;
            m_content_container.addChild( container );
            last_y = container.y;
            last_height = tblock.naturalHeight;
        }        
        
        m_content_container.height = last_y + last_height;
        m_content_container.clipRect.width = 1100;
        m_content_container.clipRect.height = 580;
        
        subcontent_container.clipRect.x = 0;
        subcontent_container.clipRect.y = 0;
        subcontent_container.clipRect.width = 1100;
        subcontent_container.clipRect.height = 580;
        m_movie_rating_widget.refreshWidget( m_media_details_obj.getUserRating() );
//        m_movie_rating_widget.getDisplayNode().x = 500;
        m_movie_rating_widget.getDisplayNode().y = m_rating_y_coord;
        m_content_container.addChild( m_movie_rating_widget.getDisplayNode() );
        
//        Logger.log( 'last_y = ' + last_y );
//        Logger.log( 'm_content_container.clipRect.height = ' + m_content_container.clipRect.height );
        if ( m_content_container.height > m_content_container.clipRect.height ){
            m_scrollbar_widget.setVisible( true );
            m_scrollbar_widget.setFocus( true );
        }else{
            m_scrollbar_widget.setVisible( false );
        }        
    }

    function addImageToContainer( js_image ){
        js_image.getRawImage().width = 260;
        js_image.getRawImage().height = 390;
        m_picture_container.addChild( js_image.getRawImage() );
    }
    
    function loadImage( url ){
        var js_image = ImageManagerInstance.requestImage( url );
        
        if ( js_image.getStatus() == ImageManager.IMAGESTATUS.READY ){
            addImageToContainer( js_image );
        }else if ( js_image.getStatus() == ImageManager.IMAGESTATUS.FAILED ){
            // TODO: Handle image failures
        }else{
            js_image.addImageReadyListener( This );
        }
    }

    function getBackgroundContainer(){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getBLACK( .9 ) );
        tmp_slate.height = 5000;
        tmp_slate.width = 5000;
        
        tmp_container.x = -2500;
        tmp_container.y = -2500;
        
        tmp_container.addChild( tmp_slate );
        
        return tmp_container;
    }
    
    function getInsideBackgroundContainer(){
        var tmp_container = engine.createContainer();
        var tmp_slate = engine.createSlate();
        
        tmp_slate = engine.createSlate();
        tmp_slate.width = 1211;
        tmp_slate.height = 689;
        
        tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/media_info_bg.png" ).shader.texture;
        
        tmp_container.addChild( tmp_slate );
        
        return tmp_container;
    }

    if ( m_media_details_obj ){
        initWidget();
    }
    
    m_scrollbar_widget.setVisible( false );
    m_root_node.addChild( m_master_container );
    m_root_node.addChild( m_scrollbar_widget.getDisplayNode() );
    m_scrollbar_widget.getDisplayNode().x = 1720;    
    m_scrollbar_widget.getDisplayNode().y = 265;    
};
include( "js/app/com/dadc/lithium/view/widgets/MovieRatingWidget.js" );

/**
 * Bubble Widget
 */
var BubbleWidget = function( DataObj, tile_col, BubbleWidget_STYLE ) {
    var m_root_node             = engine.createContainer();
    var m_data_obj              = DataObj;
    var m_tile_col              = tile_col;
    var m_style                 = BubbleWidget_STYLE;
    var m_content_container     = engine.createContainer();
    var m_movie_rating_widget   = new MovieRatingWidget( null );
    var m_active_container;
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'BubbleWidget update() ' + engine_timer );

    };


    this.refreshWidget = function( DataObj, tile_col, BubbleWidget_STYLE ){
        m_data_obj  = DataObj;
        m_tile_col  = tile_col;
        m_style     = BubbleWidget_STYLE;

        while ( m_content_container.numChildren > 0 ){
            m_content_container.removeChildAt( 0 );
        }

        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }

        initWidget();
        m_root_node.addChild( m_content_container );

    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };

    this.setActive = function(){
        if ( !m_root_node.contains( m_active_container ) ){
            m_root_node.addChildAt( m_active_container, 0 );
        }
    }

    this.setInactive = function(){
        if ( m_root_node.contains( m_active_container ) ){
            m_root_node.removeChild( m_active_container );
        }
    }
    this.destroy = function(){
        Logger.log( 'BubbleWidget destroy()' );
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        m_movie_rating_widget.destroy();
    }
    function initWidget(){
        var tmp;
        var tmp_slate = engine.createSlate();

        var length_text = "";
        var length_in_minutes;

        var positions;

        var channel_title_container;
        var why_it_crackles_static_container;
        var why_it_crackles_container;
        var rating_genre_container;
        var rating_genre_length_container;
        var channel_description_container;

        try{
            // Channel Title
            if ( m_data_obj.getName ){
                tmp = m_data_obj.getName();
            } else if ( m_data_obj.getTitle ){
                tmp = m_data_obj.getTitle();
            } else{
                tmp = '';
            }

            //Let's insert some season/episode information if it exists for no real good reason
            if(m_data_obj.getSeason() != null && m_data_obj.getEpisode() != null){
                var season = m_data_obj.getSeason()
                var ep = m_data_obj.getEpisode()
                var se = "S"+season+"E"+ep+": ";

                var idx = tmp.indexOf(":");
                //What if the magic string is not there?
                if(idx<0){
                    idx = 0;
                }

                var partOne = tmp.substring(0, idx);
                var partTwo = tmp.substring(idx+1, tmp.length)

                tmp = partOne+": "+se+partTwo;


            }

            channel_title_container = engine.createTextBlock( tmp, FontLibraryInstance.getFont_BUBBLETITLE(), 820 );

            // Channel Description
            if( m_data_obj.getDescription ){
                tmp = HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( m_data_obj.getDescription() ) );
            }

            channel_description_container = engine.createTextBlock( tmp, FontLibraryInstance.getFont_BUBBLEDESCRIPTION(), 1100 );

            // Rating, genre, length
            if ( m_data_obj.getDurationInSeconds && m_data_obj.getDurationInSeconds() && m_data_obj.getDurationInSeconds() != "" ){
                length_in_minutes = Math.round( m_data_obj.getDurationInSeconds() / 60 );
                length_text = " | " + length_in_minutes + " " + Dictionary.getText( Dictionary.TEXT.MIN );
            }

            // if( m_data_obj.getRating && m_data_obj.getGenre ){
            //     var genre_text = strPad( m_data_obj.getGenre(), 27 );
            //     rating_genre_length_container = engine.createTextBlock( m_data_obj.getRating() + " | " + genre_text + length_text, FontLibraryInstance.getFont_BUBBLELENGTH(), 1100 );
            //     rating_genre_container = engine.createTextBlock( m_data_obj.getRating() + " | " + genre_text, FontLibraryInstance.getFont_BUBBLELENGTH(), 1100 );
            // }

            // Static Why It Crackles
            why_it_crackles_static_container = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.WHY_IT_CRACKLES ), FontLibraryInstance.getFont_BUBBLEWHYITCRACKLES(), 1100 );

            if ( m_data_obj.getWhyItCrackles ){
                // Why It Crackles
        		try{
        		    Logger.log("m_data_obj.getWhyItCrackles()= "+ m_data_obj.getWhyItCrackles());
        		    Logger.log("HTMLUtilities.removeHTMLTags( m_data_obj.getWhyItCrackles() )= "+HTMLUtilities.removeHTMLTags( m_data_obj.getWhyItCrackles() ));
        		    Logger.log("HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( m_data_obj.getWhyItCrackles() ) )= "+HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( m_data_obj.getWhyItCrackles() ) ));
        		    Logger.log("UtilLibraryInstance.getTextOrNA( HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( m_data_obj.getWhyItCrackles() ) ) )= "+UtilLibraryInstance.getTextOrNA( HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( m_data_obj.getWhyItCrackles() ) ) ));
        		    var str = UtilLibraryInstance.getTextOrNA( HTMLUtilities.deEnt( HTMLUtilities.removeHTMLTags( m_data_obj.getWhyItCrackles() ) ) );
        		    Logger.log("str= "+str.length);
                    if(str.length<2 || str == "N/A"){
                        str = channel_description_container.text
                    }
        		    why_it_crackles_container = engine.createTextBlock( str, FontLibraryInstance.getFont_BUBBLEDESCRIPTION(), m_root_node.width - 80 );
        		}
        		catch(e){
        		    why_it_crackles_container = engine.createTextBlock( "N/A" );
        		    Logger.log("get text or NA failed");
        		}
            }else{
                why_it_crackles_container = engine.createContainer();
            }

            switch( m_style ){
                case BubbleWidget.STYLE.MOVIES:
                    positions = BubbleWidget.POSITIONS.movies;
                    break;
                case BubbleWidget.STYLE.SHOWS:
                    positions = BubbleWidget.POSITIONS.shows;
                    break;
                case BubbleWidget.STYLE.WATCHLIST:
                    positions = BubbleWidget.POSITIONS.watchlist;
                    break;
            }

            for( var i in positions ){
                switch( positions[ i ].container ){
                    case 'channel_title':
                        m_content_container.addChild( channel_title_container );
                        channel_title_container.x = positions[ i ].x;
                        channel_title_container.y = positions[ i ].y;
                        break;
                    case 'channel_description':
                        m_content_container.addChild( channel_description_container );
                        channel_description_container.x = positions[ i ].x;
                        channel_description_container.y = positions[ i ].y;
                        break;
                    case 'why_it_crackles_static':
                        m_content_container.addChild( why_it_crackles_static_container );
                        why_it_crackles_static_container.x = positions[ i ].x;
                        why_it_crackles_static_container.y = positions[ i ].y;
                        break;
                    case 'why_it_crackles':
                        m_content_container.addChild( why_it_crackles_container );
                        why_it_crackles_container.x = positions[ i ].x;
                        why_it_crackles_container.y = positions[ i ].y;
                        break;
                    // case 'rating_genre_length':
                    //     m_content_container.addChild( rating_genre_length_container );
                    //     if ( positions[ i ].reverse ){
                    //         rating_genre_length_container.x = m_root_node.width - rating_genre_length_container.width -  positions[ i ].x;
                    //     }else{
                    //         rating_genre_length_container.x = positions[ i ].x;
                    //     }
                    //     rating_genre_length_container.y = positions[ i ].y;
                    //     break;
                    // case 'rating_genre':
                    //     m_content_container.addChild( rating_genre_container );
                    //     if ( positions[ i ].reverse ){
                    //         rating_genre_container.x = m_root_node.width - rating_genre_container.width -  positions[ i ].x;
                    //     }else{
                    //         rating_genre_container.x = positions[ i ].x;
                    //     }
                    //     rating_genre_container.y = positions[ i ].y;
                    //     break;
                }
            }

            // User Rating
            // if ( m_data_obj.getUserRating && m_data_obj.getUserRating() >= 0 ){
            //     Logger.log( '### Movie has user rating ' + m_data_obj.getUserRating() + ' ###' );
            //     m_movie_rating_widget.refreshWidget( m_data_obj.getUserRating(), true );
            //     m_content_container.addChild( m_movie_rating_widget.getDisplayNode() );
            //     m_movie_rating_widget.getDisplayNode().x = m_root_node.width - m_movie_rating_widget.getDisplayNode().width - 25;
            //     m_movie_rating_widget.getDisplayNode().y = 23;
            // }else{
            //     Logger.log( '### Movie has NO user rating ###' );
            // }

            tmp_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/tooltip_background_column_" + ( m_tile_col + 1 ) + ".png" ), 0, 0, [1,1,1,1] );
            tmp_slate.width = 1149;
            tmp_slate.height = 298;
            if( m_tile_col == 4 ){
                m_root_node.x = 50;
            }else{
                m_root_node.x = -20;
            }
            m_root_node.addChild( tmp_slate );
        }catch( e ){
            Logger.log( 'BubbleWidget exception' );
            Logger.logObj( e );
        }
    }

    function strPad( str, length ){
        var conc = false;
        if( str.length > length ){
            conc = true;
        }
        while( str.length > length ){
            str = str.substr( 0, str.length - 2 );
        }
        if( conc ) str += ' ...';
        return str;
    }
    function createTextBlockContainer( text, font, width, x, y ){
        var tmp_container = engine.createContainer();
        tmp_container.x = x;
        tmp_container.y = y;
        var tblock = engine.createTextBlock( text, font, width );
        return [ tblock, tmp_container ];
    }

    m_root_node.width = 1149;

    m_content_container.y = 50;

    if( DataObj ){
        initWidget();
        m_root_node.addChild( m_content_container );
    }
};

BubbleWidget.STYLE = {
    MOVIES: 1,
    SHOWS: 2,
    WATCHLIST: 3
};

BubbleWidget.POSITIONS = {
    'movies': [
        { container: 'channel_title', x: 40, y: 10 },
        { container: 'why_it_crackles_static', x: 40, y: 55 },
        { container: 'why_it_crackles', x: 40, y: 100 },
        { container: 'rating_genre_length', x: 40, y: 60, reverse: true },
    ],
    'shows': [
        { container: 'channel_title', x: 40, y: 10 },
        { container: 'why_it_crackles_static', x: 40, y: 55 },
        { container: 'why_it_crackles', x: 40, y: 100 },
        { container: 'rating_genre', x: 40, y: 60, reverse: true  },
    ],
    'watchlist': [
        { container: 'channel_title', x: 40, y: 10 },
        { container: 'channel_description', x: 40, y: 100 },
    ]
};


var BubbleWidgetInstance;
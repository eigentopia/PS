include( "js/app/com/dadc/lithium/parsers/TTMLSubtitle.js" );

/**
 * Subtitle Widget
 */
var SubtitleWidget = function( SubtitlesObj ) {
    var m_root_node             = engine.createContainer();
    var m_subtitle_container    = engine.createContainer();
        m_root_node.addChild( m_subtitle_container );

    var m_subtitles_obj         = SubtitlesObj;
    var m_last_subtitle         = null;

    // BLUETEST
//        var tmp_slate = engine.createSlate();
//        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getBLUE( 1 ) );
//        tmp_slate.height = 1920/2;
//        tmp_slate.width = 1080/2;

        //tmp_container.addChild( tmp_slate );

//        m_subtitle_container.addChild( tmp_slate );


    this.update = function( engine_timer ){
//        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SubtitleWidget update() ' + engine_timer );
    };

    this.subtitlesObjectReady = function(){
        return m_subtitles_obj ? true : false;// !== undefined;
    }

    this.setSubtitlesFailed = function(){
        m_subtitles_obj = null; //<-- setting to NULL, *NOT* undefined
    }

    this.refreshWidget = function( SubtitlesObj ){
        if( SubtitlesObj ){
            m_subtitles_obj = SubtitlesObj;
            initWidget();
        }
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.removeSubtitleFromScreen = function(){
        Logger.log("removing a sub from the screen. children to sound off.")
        while ( m_subtitle_container.numChildren > 0 ){
            Logger.log("removing next child...");
            m_subtitle_container.removeChildAt( 0 );
        }
    }
    this.displaySubtitleBetween = function( start_seconds, end_seconds ){
        Logger.log("displaySubtitleBetween called");
        if( !m_subtitles_obj ){
            Logger.log("there is no subtitle object, returning");
            return;
        }

        var subtitle = m_subtitles_obj.getSubtitleBetween( parseInt( start_seconds ), parseInt( end_seconds ) );

        if( subtitle != m_last_subtitle ){
            Logger.log("subtitle != m_last_subtitle");
            this.removeSubtitleFromScreen();

            if ( subtitle ){
                Logger.log("subtitle is true. will add child");
                m_subtitle_container.addChild( getTextContainer( subtitle.getText() ) );
            }else{
                Logger.log("subtitle is not true, will not add");
            }
        }else{
            Logger.log("subtitle != m_last_subtitle");
        }
    }
    this.displaySubtitleLine = function( SubtitleLineObj ){
        this.removeSubtitleFromScreen();

        if ( SubtitleLineObj ){
            Logger.log("SubtitleLineObj exists, will add");
            m_subtitle_container.addChild( getTextContainer( SubtitleLineObj.getText() ) );
        }else{
            Logger.log("SubtitleLineObj does not exist, will not add");
        }
    }
    function initWidget(){

    }
    function getTextContainer( message ){
        Logger.log("getTextContainer for message: " + message);
        var tblock;
        var messages = message.split( TTMLSubtitle.CONFIG.BREAK_LINES );
        var container = engine.createContainer();

    	// DAN: engine.createTextBlock failed, surrounding with a try-catch in hopes to "skip" the offending subtitle
    	try
    	{
    	    for( var i = 0; i < messages.length; i++ ){
        		var tmp_container = engine.createContainer();
        		//var shader = ShaderCreatorInstance.createGlowShader( 4, RGBLibraryInstance.getBLACK( 1 ), RGBLibraryInstance.getWHITE( 1 ) );

        		tblock = engine.createTextBlock( messages[ i ], FontLibraryInstance.getFont_SUBTITLE(), 1700 );
        	//            tblock.shader = shader;
        		// disabled the glow shader

        		tmp_container.addChild( tblock );

        		tblock.x = 1920 / 2 - tblock.naturalWidth / 2;
        		tblock.y = -( ( messages.length - 1 ) - i ) * 50;

        		container.addChild( tmp_container );
    	    }
    	}
    	catch(e)
    	{
    	    Logger.log("subtitleWidget.getTextContainer() failed...")
    	}

            Logger.log("returning container");
            return container;
        }
};

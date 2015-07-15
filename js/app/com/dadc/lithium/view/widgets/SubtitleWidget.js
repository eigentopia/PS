include( "js/app/com/dadc/lithium/parsers/TTMLSubtitle.js" );

/**
 * Subtitle Widget
 */
var SubtitleWidget = function( SubtitlesObj ) {
    var m_root_node             = engine.createContainer();
    var m_subtitle_container    = engine.createContainer();
    m_root_node.addChild( m_subtitle_container );

    var m_subtitles_obj         = SubtitlesObj;
    var currentSubtitle         = null;

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

    this.displaySubtitleLine = function( SubtitleLineObj ){
        if(SubtitleLineObj){
            Logger.log("Current Subtitle: "+currentSubtitle);
            // if(currentSubtitle != SubtitleLineObj.getText()){
            //     currentSubtitle = SubtitleLineObj.getText()
                this.removeSubtitleFromScreen();
                //if ( SubtitleLineObj ){
                    Logger.log("Subtitle: "+ SubtitleLineObj.getText);
                    m_subtitle_container.addChild( getTextContainer( SubtitleLineObj.getText ) );

                //}else{
                 //   Logger.log("SubtitleLineObj does not exist, will not add");
                //}
            //}
        }else{
             Logger.log("SubtitleLineObj null");
            this.removeSubtitleFromScreen();
        }
    }

    this.displayText =  function(TextInfo){
        this.removeSubtitleFromScreen();
                //if ( SubtitleLineObj ){
                    Logger.log("DISPLAY Subtitle: "+ TextInfo.text);
                    m_subtitle_container.addChild( getTextContainer( TextInfo.text ));

    }

    function initWidget(){

    }
    function getTextContainer( message ){
        Logger.log("getTextContainer for message: " + message);
        var tblock;
        var shadowBlock;
        var messages = message.split( TTMLSubtitle.CONFIG.BREAK_LINES );
        var container = engine.createContainer();

        // DAN: engine.createTextBlock failed, surrounding with a try-catch in hopes to "skip" the offending subtitle
        try
        {
            for( var i = 0; i < messages.length; i++ ){
                var tmp_container = engine.createContainer();
                //var shader = ShaderCreatorInstance.createGlowShader( 4, RGBLibraryInstance.getBLACK( 1 ), RGBLibraryInstance.getWHITE( 1 ) );

                tblock = engine.createTextBlock( messages[ i ], FontLibraryInstance.getFont_SUBTITLE(), 1700 );
                shadowBlock = engine.createTextBlock( messages[ i ], FontLibraryInstance.getFont_SUBTITLESHADOW(), 1080 );
            //            tblock.shader = shader;
                // disabled the glow shader

                tmp_container.addChild( shadowBlock );
                tmp_container.addChild( tblock );

                tblock.x = 1920 / 2 - tblock.naturalWidth / 2;
                tblock.y = -( ( messages.length - 1 ) - i ) * 50;
                shadowBlock.x = tblock.x+1
                shadowBlock.y = tblock.y+1

                container.addChild( tmp_container );
            }
        }
        catch(e)
        {
            Logger.log("subtitleWidget.getTextContainer() failed...")
        }

            Logger.log("returning container");
            return container;
        }};

include( "js/app/com/dadc/lithium/parsers/TTMLSubtitle.js" );

/**
 * Subtitle Widget
 */
var SubtitleWidget = function( SubtitlesObj ) {
    var m_root_node             = engine.createContainer();
    //m_root_node.width = 1920
    var m_subtitle_container    = engine.createContainer();
    m_root_node.addChild( m_subtitle_container );

    var m_subtitles_obj         = SubtitlesObj;
    var currentSubtitle         = null;

    this.update = function( engine_timer ){
//        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SubtitleWidget update() ' + engine_timer );
    };

    this.subtitlesObjectReady = false/// ? true : false;// !== undefined;


    this.setSubtitlesFailed = function(){
        m_subtitles_obj = null; //<-- setting to NULL, *NOT* undefined
    }

    this.refreshWidget = function( SubtitlesObj ){
        if( SubtitlesObj ){
            m_subtitles_obj = SubtitlesObj;
            subtitlesObjectReady = true
           // initWidget();
        }
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.removeSubtitleFromScreen = function(){

                tblock.text = ""
                shadowBlock.text = ""
       // Logger.log("removing a sub from the screen. children to sound off.")
        // while ( m_subtitle_container.numChildren > 0 ){
        //  //   Logger.log("removing next child...");
        //     m_subtitle_container.removeChildAt( 0 );
        // }
    }

    this.displaySubtitleLine = function( SubtitleLineObj ){
        if(SubtitleLineObj){
            //Logger.log("Current Subtitle: "+currentSubtitle);
            // if(currentSubtitle != SubtitleLineObj.getText()){
            //     currentSubtitle = SubtitleLineObj.getText()
                this.removeSubtitleFromScreen();
                //if ( SubtitleLineObj ){
                    //Logger.log("Subtitle: "+ SubtitleLineObj.getText);
                    //m_subtitle_container.addChild( getTextContainer( SubtitleLineObj.getText ) );

                //}else{
                 //   Logger.log("SubtitleLineObj does not exist, will not add");
                //}
            //}
            getTextContainer( SubtitleLineObj.getText )
        }else{
            //Logger.log("SubtitleLineObj null");
            this.removeSubtitleFromScreen();
        }
    }

    this.displayText =  function(TextInfo){
        this.removeSubtitleFromScreen();
                //if ( SubtitleLineObj ){
                    //Logger.log("DISPLAY Subtitle: "+ TextInfo.text);
                    getTextContainer( TextInfo.text );

    }

    function initWidget(){

    }
    
    var tblock = engine.createTextBlock( "", FontLibraryInstance.getFont_SUBTITLE(), 1920  );
    var shadowBlock= engine.createTextBlock( "", FontLibraryInstance.getFont_SUBTITLESHADOW(), 1920 );
    shadowBlock.x = tblock.x+1
    shadowBlock.y = tblock.y+1
    
    var subsContainer = engine.createContainer();
    
    m_subtitle_container.addChild(subsContainer);
    subsContainer.addChild( shadowBlock );
    subsContainer.addChild( tblock );
    function getTextContainer( message ){
        //Logger.log("getTextContainer for message: " + message)
        var parsedMessage = message.replace( /<br>/g, '\n' );
        //var container = engine.createContainer();

        // DAN: engine.createTextBlock failed, surrounding with a try-catch in hopes to "skip" the offending subtitle
        try
        {
            //for( var i = 0; i < messages.length; i++ ){
                //var shader = ShaderCreatorInstance.createGlowShader( 4, RGBLibraryInstance.getBLACK( 1 ), RGBLibraryInstance.getWHITE( 1 ) );

                tblock.text = parsedMessage
                shadowBlock.text = parsedMessage
            //            tblock.shader = shader;
                // disabled the glow shader

                subsContainer.x = 1920 / 2 - tblock.naturalWidth /2
                //m_subtitle_container.addChild(subsContainer);
                //tblock.y = -10

                // shadowBlock.x = tblock.x+1
                // shadowBlock.y = tblock.y+1
                // //container.addChild( tmp_container );
            //}
        }
        catch(e)
        {
            Logger.log("subtitleWidget.getTextContainer() failed...")
        }

            //Logger.log("returning container");
            //return container;
    }

    function displaySub(){
        m_subtitle_container.addChild(subsContainer);
    }
};

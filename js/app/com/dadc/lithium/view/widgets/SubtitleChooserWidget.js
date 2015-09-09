include( "js/app/com/dadc/lithium/view/widgets/SubtitleChooserRowWidget.js" );
include( "js/app/com/dadc/lithium/util/StorageManager.js" );

/**
 * Subtitle Chooser Widget
 */
var SubtitleChooserWidget = function( MediaDetailsObj, currentAV, currentCC ) {
    var m_root_node             = engine.createContainer();
    var m_media_details_obj     = MediaDetailsObj;
    var cc_widgets              = [];
    var audio_widgets           = [];
    var selected_audio = 0;
    var selected_cc = 0;
    var m_total_height          = 0;
    var current_column;

    var chooserHolder           = engine.createContainer();

    var selectedAV = currentAV
    var selectedCC = currentCC

    this.loadingMode = function(){
       while (m_root_node.numChildren >0){
            m_root_node.removeChildAt(0)
       }

        var selector_container = engine.createContainer();
        selector_container.width = 300;
        selector_container.height = 200;
        
        m_root_node.addChild (selector_container)
        
        var bg_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/subtitle_bg.png" ), 14, 14,[ 255/255, 255/255, 255/255, 0.8 ] );
        selector_container.addChild( bg_slate );

        bg_slate.width = 300;
        bg_slate.height = 200;
        // console.log("**********")
        // console.log(chooserHeight , ccRow, mediaRow)
        // console.dir(audio_title)
        selector_container.x = 1920/2 - ( bg_slate.width/2 );
        selector_container.y = 1080/2 - (bg_slate.height/2) 

        var loadingText =  engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.LOADING ), FontLibraryInstance.getFont_ERRORBUTTON(), 300 );
        loadingText.x = selector_container.width/2 - loadingText.naturalWidth/2;
        loadingText.y = selector_container.height/2 -loadingText.naturalHeight/2;
        selector_container.addChild( loadingText );

    }


    // MILAN: SP and PT "select" word is much longer than EN so I added offset for the two of them. 
    // Not sure if this is the best way to do this??? Need to ask Ben about it! 
    // Maybe it's possible to get width of text area or something like that???
    var m_select_lang_offset    = (StorageManagerInstance.get( 'lang' ).toLowerCase() != 'en' ? 60 : 0);  
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SubtitleChooserWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( MediaDetailsObj ){
        if( MediaDetailsObj ){
            m_media_details_obj  = MediaDetailsObj;
            initWidget();
        }
    };
    this.getDisplayNode = function(){
        return m_root_node;
    };
    this.navDown = function(){
        if (current_column == "cc_widgets"){
            if(selected_cc +1 <= cc_widgets.length -1 ){
                cc_widgets[selected_cc].setDisabled();
                selected_cc ++
                cc_widgets[selected_cc].setActive();
            }
        }
        else{ //audio_widgets column
            selected_audio ++
            if(selected_audio > audio_widgets.length -1){
                selected_audio --
            }
            else{
                audio_widgets[selected_audio-1].setDisabled();
                audio_widgets[selected_audio].setActive();
            }

        }
    }
    this.navUp = function(){
        if (current_column == "cc_widgets"){
            if(selected_cc -1 >= 0 ){
                cc_widgets[selected_cc].setDisabled()
                selected_cc --
                cc_widgets[selected_cc].setActive();
            }
        }
        else{ //audio_widgets column
            selected_audio --
            if(selected_audio < 0){
                selected_audio = 0;
            }
            else{
                audio_widgets[selected_audio+1].setDisabled()
                audio_widgets[selected_audio].setActive()
            }
        }
    }
    this.navLeft = function(){
        if (current_column == "cc_widgets"){
            current_column = "audio_widgets"
            audio_widgets[0].setActive();
            cc_widgets[selected_cc].setDisabled();
            selected_cc = 0;
            selected_audio = 0;
        } 
    }
    this.navRight = function(){
        if (current_column == "audio_widgets"){
            current_column = "cc_widgets"
            cc_widgets[0].setActive();
            audio_widgets[selected_audio].setDisabled();
            selected_cc = 0;
            selected_audio = 0;
        }      
    }
    this.enterPressed = function(){
        if (current_column == "audio_widgets"){
            if(audio_widgets[selected_audio].enterPressed()){
                selectedAV.unMark();
                selectedAV = audio_widgets[selected_audio];

            }
        } 
        else{
            if(cc_widgets[selected_cc].enterPressed()){
                if(selectedCC){
                    selectedCC.unMark();
                }
                selectedCC = cc_widgets[selected_cc];

            }
        }
    }   
    
    this.getSelectedFiles = function(){
        var files = {audioVideo:selectedAV.getFilePath(), cc:selectedCC.getFilePath()}
        return files;
    }
    this.getWidth = function(){return AssetLoaderInstance.getImage( "Artwork/subtitle_bg.png" ).width;}
    this.getHeight = function(){return m_total_height;}
    
    function initWidget(){
        var selector_container = engine.createContainer();
        m_root_node.addChild (selector_container)
        
        var bg_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/subtitle_bg.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        selector_container.addChild( bg_slate );
        
        var closed_caption_files = MediaDetailsObj.getClosedCaptionFiles().slice(0);
        var media_files = MediaDetailsObj.getMediaURLs();
        
        m_root_node.addChild( getBackgroundContainer() );

        var audio_title = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.AUDIO ), FontLibraryInstance.getFont_SUBTITLEOPTIONS(), 310 );
        audio_title.x = 70;
        audio_title.y = 35;
        selector_container.addChild( audio_title );

        var subtitle_title = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.SUBTITLES ), FontLibraryInstance.getFont_SUBTITLEOPTIONS(), 310 );
        subtitle_title.x =  400;
        subtitle_title.y = 35;
        selector_container.addChild( subtitle_title );
        
        // Always include
        if( closed_caption_files ){
            closed_caption_files.unshift({
                Locale: 'Off',
                Path: null
            });
            
            var chooser_row
            var ccRow = 0;
            var mediaRow = 0;
            for( var i=0; i<closed_caption_files.length; i++){
                var chooser_container = engine.createContainer();
                var path = closed_caption_files[i].Path

                chooser_row = new SubtitleChooserRowWidget( closed_caption_files[i], 343 );
                
                cc_widgets.push( chooser_row );
                
                chooser_container.addChild( chooser_row.getDisplayNode() );
                chooser_container.x = 359;
                chooser_container.y = 80 + ( chooser_row.getHeight() * ccRow );
                
                ccRow++;
                
                selector_container.addChild( chooser_container );
                if(path == currentCC){
                    chooser_row.setDefault(true);
                    selectedCC = cc_widgets[i]
                }
            }

            for(var m = 0;m<media_files.length;m++){

                var chooser_container = engine.createContainer();
                var path = media_files[m].Path

                chooser_row = new SubtitleChooserRowWidget( media_files[m], 344 );
                audio_widgets.push( chooser_row );
                
                chooser_container.addChild( chooser_row.getDisplayNode() );
                chooser_container.x = 15;
                chooser_container.y = 80 + ( chooser_row.getHeight() * mediaRow );
                
                mediaRow++;
                
                selector_container.addChild( chooser_container ); 
                if(path == currentAV){
                    chooser_row.setDefault(true);
                    selectedAV = audio_widgets[m]
                }               


            }

            var chooserHeight = chooser_row.getHeight() * Math.max(ccRow, mediaRow) + 85;

            bg_slate.width = 740;
            bg_slate.height = chooserHeight + audio_title.naturalHeight;
            // console.log("**********")
            // console.log(chooserHeight , ccRow, mediaRow)
            // console.dir(audio_title)
            selector_container.x = 1920 / 2 - ( bg_slate.width / 2 );
            selector_container.y = 1080 /2 - (bg_slate.height /2) 

            var controlBarY = 900;
            var controlSpacer = 50;

            var img = AssetLoaderInstance.getSlate( "Artwork/controls/Direct_Pad_UpDown_No_Reflection.png", 1 );
            img.x = 1920/2 - 370;
            img.y = 65 + ( controlBarY );
            m_root_node.addChild( img );
            
            var tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.NAVIGATE ), FontLibraryInstance.getFont_SUBTITLEOPTIONSNAVIGATION(), 400 );
            tblock.x = img.x + img.width // - m_select_lang_offset;
            tblock.y = 70 + ( controlBarY);
            m_root_node.addChild( tblock );

            img = AssetLoaderInstance.getSlate( "Artwork/controls/Cross_No_Reflection.png", 1 );
            img.x = tblock.x + tblock.width + controlSpacer;
            img.y = 62 + ( controlBarY);
            m_root_node.addChild( img );

            tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.SELECT ), FontLibraryInstance.getFont_SUBTITLEOPTIONSNAVIGATION(), 400 );
            tblock.x = img.x + img.width //- m_select_lang_offset
            tblock.y = 70 + ( controlBarY );
            m_root_node.addChild( tblock );

            img = AssetLoaderInstance.getSlate( "Artwork/controls/Triangle_No_Reflection.png", 1 );
            img.x = tblock.x + tblock.width + controlSpacer;
            img.y = 62 + ( controlBarY);
            m_root_node.addChild( img );

            tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.CLOSE_SETTINGS ), FontLibraryInstance.getFont_SUBTITLEOPTIONSNAVIGATION(), 400 );
            tblock.x = img.x + img.width //- m_select_lang_offset;
            tblock.y = 70 + ( controlBarY );
            m_root_node.addChild( tblock );

            m_total_height = bg_slate.height;
            
            if( mediaRow > 0 ){
                current_column = "audio_widgets"
                audio_widgets[ 0 ].setActive();
            }
            else if(ccRow > 0){
                current_column = "cc_widgets"
                cc_widgets[ 0 ].setActive();
            }
        }
    }
    
    function getBackgroundContainer(){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getBLACK( .7 ) );
        tmp_slate.height = 1080;
        tmp_slate.width = 1920;

        tmp_container.x = 0;
        tmp_container.y = 0;

        tmp_container.addChild( tmp_slate );

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getBLACK( 1 ) );
        tmp_slate.height = 150;
        tmp_slate.width = 1920;

        tmp_container.x = 0;
        tmp_container.y = 930;


        return tmp_container;
    }
    
    if( MediaDetailsObj ){
        initWidget();
    }
};

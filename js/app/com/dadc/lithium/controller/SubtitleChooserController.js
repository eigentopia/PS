include( "js/app/com/dadc/lithium/view/widgets/SubtitleChooserWidget.js" );

var SubtitleChooserController = function( ParentControllerObj){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var m_is_focussed               = false;
    var m_callback_func             = null;
    var m_subtitle_chooser_widget;
    var mediaDetailsObj;

    
    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'SubtitleChooserController';};
    this.open = function( ){
        if( !m_root_node.contains( m_master_container ) ) m_root_node.addChild( m_master_container );
    };
    this.close = function( ){
        if( m_root_node && m_root_node.contains( m_master_container ) ) m_root_node.removeChild( m_master_container );
    };
    this.setFocus = function(){
        m_is_focussed = true;
    }
    this.unsetFocus = function(){
        m_is_focussed = false;
    }    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SubtitleChooserController update() ' + engine_timer );
    };
    this.destroy = function(){
        Logger.log( 'SubtitleChooserController destroy()' );
        try{
            while( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
            while( m_master_container.numChildren > 0 ){
                m_master_container.removeChildAt( 0 );
            }
        }catch( e ){
            Logger.log( '!!! EXCEPTION SubtitleChooserController destroy() !!!' );
            Logger.logObj( e );
        }finally{
            m_root_node = null;
            m_master_container = null;
            m_parent_controller_obj = null;
        }        
    }
    this.prepareToOpen = function( MediaDetailsObj, currentAV, currentCC){
        //m_callback_func = callback_func;
        mediaDetailsObj = MediaDetailsObj;
        
        //IF NO SUBS, NOTIFY STATUS, THEN CALLBACK. (THIS SEEMS ODD... WHY BOTH?)
        // if( MediaDetailsObj.getClosedCaptionFiles() == null || 
        //     ( MediaDetailsObj.getClosedCaptionFiles() != null && MediaDetailsObj.getClosedCaptionFiles().length == 0 ) ){
        //     // NOTE: LOOKS LIKE THIS WILL OPEN THE SUBTITLE CONTROLLER IMMEDIATELY FROM THE APPCONTROLLER LEVEL
        // console.log("NOTE: LOOKS LIKE THIS WILL OPEN THE SUBTITLE CONTROLLER IMMEDIATELY FROM THE APPCONTROLLER LEVEL")
        //     ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );                    
        //     // NOTE CONT...: THEN THIS WILL CLOSE IT IMMEDIATELY FROM THE APPCONTROLLER LEVEL
        //     m_callback_func( null );
           
        //  // ELSE WE HAVE SUBS! NOTIFY STATUS.
        // }
        // else{

            //Now that this opens only while the player is open, this widget is misnamed
            //It will handle both subtitles and video url
            m_subtitle_chooser_widget = new SubtitleChooserWidget( MediaDetailsObj,currentAV, currentCC );
            m_master_container.addChild( m_subtitle_chooser_widget.getDisplayNode() );
            m_root_node.addChild(m_master_container)
            ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
        // }
        
    };
    this.requestParentAction = function( json_data_args ){};
    this.notifyPreparationStatus = function( controller_id ){};
    this.getUniqueID = function(){return m_unique_id;};
    this.getWidth = function(){
        if( m_subtitle_chooser_widget )
            return m_subtitle_chooser_widget.getWidth();
        else
            return 0;
    }
    this.getHeight = function(){
        if( m_subtitle_chooser_widget )
            return m_subtitle_chooser_widget.getHeight();
        else
            return 0;
    }
    this.navUp = function(){
        if( m_subtitle_chooser_widget ) m_subtitle_chooser_widget.navUp();
    };
    this.navDown = function(){
        if( m_subtitle_chooser_widget ) m_subtitle_chooser_widget.navDown();
    };
    this.navLeft = function(){
        if( m_subtitle_chooser_widget ) m_subtitle_chooser_widget.navLeft();
    };
    this.navRight = function(){
        if( m_subtitle_chooser_widget ) m_subtitle_chooser_widget.navRight();
    };
    this.enterPressed = function(){
        if( m_subtitle_chooser_widget ) m_subtitle_chooser_widget.enterPressed();
        // setTimeout( function(){
        //     if( m_callback_func ) m_callback_func( files.audio, files.cc );
        // }, 500 );
        
    }
    this.circlePressed = function(){

    }
    this.trianglePressed = function(){
        var files = m_subtitle_chooser_widget.getSelectedFiles()
        m_parent_controller_obj.closeSubtitleChooser(files.audioVideo, files.cc);
        // m_parent_controller_obj.requestingParentAction(
        //     {action: ApplicationController.OPERATIONS.CLOSE_SUBTITLE_CHOOSER, MediaDetailsObj:mediaDetailsObj, avFile:files.audioVideo, ccFile:files.cc, calling_controller: this}
        // );
        
    }
};
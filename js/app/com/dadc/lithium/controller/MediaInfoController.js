include( "js/app/com/dadc/lithium/view/widgets/MediaInfoWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/NavigationControlWidget.js" );

var MediaInfoController = function( ParentControllerObj ){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var m_media_id;
    var m_media_info_widget         = null;
    var m_is_focussed               = false;
    var m_http_requests             = [];
    var m_navigation_control_widget;
    
    // Widgets
    
    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'MediaInfoController';};
    this.open = function( ){
        if( !m_root_node.contains( m_master_container ) ) m_root_node.addChild( m_master_container );
    };
    this.close = function( ){
        if( m_root_node.contains( m_master_container ) ) m_root_node.removeChild( m_master_container );
    };
    this.setFocus = function(){
        m_is_focussed = true;
    }
    this.unsetFocus = function(){
        m_is_focussed = false;
    }    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MediaInfoController update() ' + engine_timer );
        if ( m_media_info_widget && m_is_focussed ){
            m_media_info_widget.update( engine_timer );
        }
    };
    this.destroy = function(){
        Logger.log( 'MediaInfoController destroy()' );
        try{
            while( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
            while( m_master_container.numChildren > 0 ){
                m_master_container.removeChildAt( 0 );
            }
            while( m_http_requests.length > 0 ){
                m_http_requests.pop().cancelRequest();
            }
        }catch( e ){
            Logger.log( '!!! EXCEPTION MediaInfoController destroy() !!!' );
            Logger.logObj( e );
        }finally{
            m_root_node = null;
            m_master_container = null;
            m_parent_controller_obj = null;
        }        
    }
    this.prepareToOpen = function( media_id ){
        if ( m_media_info_widget ){
            delete( m_media_info_widget );
        }
        
        m_media_info_widget = new MediaInfoWidget( null );
        m_media_id = media_id;
        
        while ( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
        
        m_navigation_control_widget = new NavigationControlWidget(
            [
                {control: NavigationControlWidget.CONTROLS.CIRCLE_NOREFLECTION, caption: Dictionary.getText( Dictionary.TEXT.BACK )}
            ] );
            
        m_navigation_control_widget.getDisplayNode().x = 560;
        m_navigation_control_widget.getDisplayNode().y = 890;
        
        m_master_container.addChild( m_navigation_control_widget.getDisplayNode() );

       var media_details_request = new MediaDetailsRequest( media_id, StorageManagerInstance.get( 'geocode' ), function( MediaDetailsObj, status ){
            if ( status != 200 ){
                // inform our parent controller our request failed
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
            }else{
                m_http_requests = [];
                m_media_info_widget.refreshWidget( MediaDetailsObj );
                // inform our parent controller our request succeeded
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );                    
            }
        });
        m_http_requests.push( media_details_request );
        media_details_request.startRequest();

        m_master_container.addChild( m_media_info_widget.getDisplayNode() );
        m_master_container.addChild( m_navigation_control_widget.getDisplayNode() );
    };
    this.requestParentAction = function( json_data_args ){};
    this.notifyPreparationStatus = function( controller_id ){};
    this.getUniqueID = function(){return m_unique_id;};
    this.navLeft = function(){
    };
    this.navRight = function(){
    };
    this.navDown = function(){
        m_media_info_widget.scrollDown()
    };
    this.circlePressed = function(){
        if( m_parent_controller_obj )
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.CLOSE_MEDIA_INFO, calling_controller: this}
            );
    }
    
    this.navUp = function(){
        m_media_info_widget.scrollUp()
    };
    
    m_root_node = engine.createContainer();
};
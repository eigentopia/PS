include( "js/app/com/dadc/lithium/view/widgets/LoginWidget.js" );
include( "js/app/com/dadc/lithium/model/Login.js" );
include( "js/app/com/dadc/lithium/util/HTTP.js" );

var LoginController = function( ParentControllerObj ){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var m_is_focused;
    //var keys = Keyboard;
    var self = this;
    self.previousScreen = null;
    
    var geo = StorageManagerInstance.get( 'geocode' );

    // Widgets
    this.openPreviousController = function(){
        m_parent_controller_obj.requestingParentAction({
                action:self.previousScreen.action, 
                calling_controller: this, 
            });
    }

    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'LoginController';};
    this.open = function( nextScreen ){
        if(nextScreen){
            self.previousScreen = nextScreen
        }
        AnalyticsManagerInstance.firePageViewEvent({cc0:'mycrackle', cc1:'login'})
        m_login_widget.init()
        m_root_node.addChild( m_master_container );
    };
    this.close = function( ){
        if ( m_root_node.contains( m_master_container) ) m_root_node.removeChild( m_master_container );
    };
    this.destroy = function(){
        m_root_node                 = engine.createContainer();
        m_master_container          = engine.createContainer();
        //m_login_widget              = new LoginWidget();
        previousScreen = null
    }
    this.setFocus = function(){
        Logger.log("SETTING FCUS")
        m_is_focused = true;
        m_login_widget.setActive();
    }
    this.unsetFocus = function(){
        Logger.log("UNSETTING")
        //m_login_widget.setInactive();
        m_is_focused = false;
    }     
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) {Logger.log( 'LoginController update() ' + engine_timer );}
        
        m_login_widget.update( engine_timer );
    };
    this.prepareToOpen = function(){
        Logger.log("PREP TO OPEN")
        previousScreen = null
        while ( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
        m_master_container.addChild( m_login_widget.getDisplayNode() );
        // inform our parent controller that we are ready to go
        //ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
    };
    this.requestParentAction = function( json_data_args ){};
    this.notifyPreparationStatus = function( controller_id ){};
    this.getUniqueID = function(){return m_unique_id;};
    this.navLeft = function(){
        Logger.log("NAV LEFT MY FOCUS " + m_is_focused)
        if ( m_is_focused ){
            m_login_widget.setInactive();
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
            );
        }
    }
    this.navRight = function(){
        Logger.log("CNT NAV RHGT")
        if(!m_is_focused){
            m_login_widget.setActive();
        }
        //return true;
    };
    
    this.navDown = function(){
    };

    this.navUp = function(){
    };
    
    this.enterPressed = function(){
    };

    this.circlePressed = function(){
        m_login_widget.setInactive();

        
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
        );
    }
    this.showError = function(){

        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
        );
    }

    
    m_root_node = engine.createContainer();
    var m_login_widget              = new LoginWidget(self);
};

// var Keyboard = function(){

//     var keyboardProps = {
//         locale: "",
//         password: false,
//         title:"",
//         type: "",
//         onCancel:function(){
//         },
//         onEnd:function(result){
//         }

//     }

//     geo = StorageManagerInstance.get( 'geocode' );
//     if(geo == "us"){
//         keyboardProps.locale = 'english'   
//     }
//     else{
//         keyboardProps.locale = 'english'
//     }
//     function openKeyboard(title, type, callback){
//         keyboardProps.title = title;
//         if(title == "Password"){
//             keyboardProps.password = true;
//         }
//         else{
//             keyboardProps.password = false;
//         }
//         keyboardProps.type = type;
//         if (callback){
//             Logger.log("HAVE A CALLBACK " + type)
//             keyboardProps.onEnd = function(result){
//                 callback(result)
//             };
//         }

//         engine.showKeyboard(keyboardProps)
//     }

//     return{
//         openKeyboard:openKeyboard
//     }


// }()
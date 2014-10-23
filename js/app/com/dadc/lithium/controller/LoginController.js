include( "js/app/com/dadc/lithium/view/widgets/LoginWidget.js" );
include( "js/app/com/dadc/lithium/model/Login.js" );
include( "js/app/com/dadc/lithium/util/HTTP.js" );

var LoginController = function( ParentControllerObj ){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var m_login_widget              = new LoginWidget();
    var m_is_focused;
    var keys = Keyboard;
    var self = this;
    var previousScreen = null;
    
    var geo = StorageManagerInstance.get( 'geocode' );

    // Widgets
    this.openPreviousController = function(){
        return openPreviousOnLogin;
    }

    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'LoginController';};
    this.open = function( nextScreen ){
        if(nextScreen){
            previousScreen = nextScreen
        }
        AnalyticsManagerInstance.firePageViewEvent({cc0:'mycrackle', cc1:'login'})
        m_root_node.addChild( m_master_container );
    };
    this.close = function( ){
        if ( m_root_node.contains( m_master_container) ) m_root_node.removeChild( m_master_container );
    };
    this.destroy = function(){
        m_root_node                 = engine.createContainer();
        m_master_container          = engine.createContainer();
        //m_login_widget              = new LoginWidget();
        m_login_widget.clearLogin();
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
            //this.navLeft()
        // }
        // else if(m_login_widget.isFocused()){
        //     m_login_widget.clearLogin();
        //     this.navLeft();
        // }
    }
    this.navRight = function(){
        Logger.log("CNT NAV RHGT")
        if(!m_is_focused){
            m_login_widget.setActive();
        }
        //return true;
    };
    
    this.navDown = function(){
        Logger.log("CNT NAV DN")
        if(m_is_focused){
            m_login_widget.navDown()
        }
        //return true;
    };

    this.navUp = function(){
        Logger.log("CNT NAV UP")
        if(m_is_focused){
            m_login_widget.navUp();
        }
       // return true;
    };
    
    this.enterPressed = function(){
        Logger.log("CNT ENTER my focus and widge focus " + m_is_focused + active )
        var active = m_login_widget.getActive();

        if(active == "submitButton"){
            self.startLogin()
        }
        if (active == "emailSlate"){
            keys.openKeyboard('E-mail Address', 'text', function(result){
                Logger.log(result)
                m_login_widget.addEmailText(result)
                emailField = result;
            })

        }
        if (active == "passSlate"){
                keys.openKeyboard('Password', 'text', function(result){
                Logger.log(result)
                var pw = result.split("")
                var pwString = "";
                function addChar(){
                    pwString+="*"
                }
                for(var i = 0; i<pw.length; i++){
                    addChar()
                }
                m_login_widget.addPassText(pwString);
                passwordField = result
            })
            
        }
        if (active == "logOutButton"){
            emailField = ""
            passwordField = ""
            ApplicationController.setUserInfo(null);
            m_login_widget.clearLogin();
            m_login_widget.showLoginScreen()
            AnalyticsManagerInstance.logoutEvent( );
        }
    };

    this.circlePressed = function(){
        m_login_widget.setInactive();

        
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
        );
    }
    var emailField;
    var passwordField;

    this.startLogin = function(){
        Logger.log("STARTING LOGIN");
        var url = ModelConfig.getServerURLRoot() + "login?format=json";
        var moreUserDataUrl= ModelConfig.getServerURLRoot() +"profile/"
        var geoCode = StorageManagerInstance.get( 'geocode' )
        var creds = {"emailAddress":emailField,"password":passwordField,"geoCode":geoCode}

        creds = {"emailAddress":'eigenstates@yahoo.com',"password":'solid5',"geoCode":geoCode}

        var sendbody = {data:JSON.stringify(creds), dataType:'Application/Json'}

        var user = {
                    email:creds.emailAddress, 
                    password:creds.password,
                    userId:null,
                    userAge:null,
                    userGender:null
                    }

        //m_login_widget.unsetFocus();

        //var request = new LoginRequest(emailField, passwordField, function(data, status){
        Http.request(url, "POST", sendbody, null, function(data, status){    
            Logger.log("LOGIN DATA")
            Logger.logObj(data)
            Logger.log(status)

            if(status == 200 && data != null){
                var userData = JSON.parse(data)
                if(userData.status.messageCode == 0){

                    user.userId = userData.userID;
                    
                    Http.request(moreUserDataUrl + userData.userID+"?format=json", "GET", null, null, function(data, status){
                        var moreData = JSON.parse(data)
                        if(moreData && moreData.status.messageCode == 0){
                            user.userAge = moreData.age;
                            user.userGender = moreData.gender;
                        }
                            
                        ApplicationController.setUserInfo(user, function(sucessGettingWatchlist){
                            if(previousScreen){

                                m_parent_controller_obj.requestingParentAction(previousScreen);
                                                            
                            }
                            else{
                                m_login_widget.showLoggedInScreen();
                                m_login_widget.setActive();
                            }
                            AnalyticsManagerInstance.loginEvent(  );
                        });
                    })
                }
                else if(userData.status.messageCode == 105 || userData.status.messageCode == 110){
                    m_parent_controller_obj.requestingParentAction(
                        {action: ApplicationController.OPERATIONS.LOGIN_ERROR, calling_controller: self, message: Dictionary.getText( Dictionary.TEXT.LOGIN_ERROR_BAD_CREDENTIALS)}
                    );
                    m_login_widget.clearLogin();

                }
            }
            else{
                m_parent_controller_obj.requestingParentAction(
                        {action: ApplicationController.OPERATIONS.LOGIN_ERROR, calling_controller: self, message:Dictionary.getText( Dictionary.TEXT.ERROR_OCCURRED )}
                    );
                m_login_widget.clearLogin();
            }
        })
        //request.startRequest();

    }
    
    m_root_node = engine.createContainer();
};

var Keyboard = function(){

    var keyboardProps = {
        locale: "",
        password: false,
        title:"",
        type: "",
        onCancel:function(){
        },
        onEnd:function(result){
        }

    }

    geo = StorageManagerInstance.get( 'geocode' );
    if(geo == "us"){
        keyboardProps.locale = 'english'   
    }
    else{
        keyboardProps.locale = 'english'
    }
    function openKeyboard(title, type, callback){
        keyboardProps.title = title;
        if(title == "Password"){
            keyboardProps.password = true;
        }
        else{
            keyboardProps.password = false;
        }
        keyboardProps.type = type;
        if (callback){
            Logger.log("HAVE A CALLBACK " + type)
            keyboardProps.onEnd = function(result){
                callback(result)
            };
        }

        engine.showKeyboard(keyboardProps)
    }

    return{
        openKeyboard:openKeyboard
    }


}()
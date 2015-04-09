/**
 * Login Widget
 */
include( "js/app/com/dadc/lithium/view/widgets/TabbedButtonWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/TextBoxWidget.js" );

var LoginWidget = function( ) {
    var m_root_node = engine.createContainer();
    var m_master_container = engine.createContainer();
    var submitButton;
    var logOutButton;
    var emailSlate = null;
    var passSlate = null;
    var currentScreen = "login"
    var focus = false;
    var activeField;
    var self = this;
    var user;
    var loginNode = engine.createContainer();
    var logOutNode = engine.createContainer();
    var pollOk = false

    this.refreshWidget = function(){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };

    this.getActive = function(){
        return activeField;
    }
    this.setActive = function(){
        pollOk = true
        pollActivation()
    }
    this.setInactive = function(){
        pollOk = false
    }

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'LoginWidget update() ' + engine_timer );
        
    }


    this.init = function(){
        showStatusScreen()
    }

    var statusScreen = null;
    function showStatusScreen(){
        user = ApplicationController.getUserInfo();
        console.log("LOGIN WIDG")
        console.dir(user)

        var dAuth = StorageManagerInstance.get('deviceAuth');
        var userName = user.name

        CrackleApi.User.sso(function (ssoResponse) {
            if (ssoResponse.ActivationCode) {
                if (ssoResponse.ActivationCode != authCode) {
                    statusScreen =  showActivate()
                    pollActivation()
                    logOutNode.addChild(statusScreen);
                    m_master_container.addChild( logOutNode );
                    m_master_container.width = logOutNode.naturalWidth;
                    m_master_container.height = logOutNode.naturalHeight;
                }
            }
            else if (ssoResponse.CrackleUserId) {

                StorageManagerInstance.set('deviceAuth', 'true')
                if(!user.age || user.age ==''){
                    CrackleApi.User.moreUserInfo(ssoResponse, function(fullData){
                        ApplicationController.setUserInfo(fullData)
                        statusScreen =  showHome()
                        logOutNode.addChild(statusScreen);
                        m_master_container.addChild( logOutNode );
                        m_master_container.width = logOutNode.naturalWidth;
                        m_master_container.height = logOutNode.naturalHeight;
                    })
                }
                else{
                    ApplicationController.setCrackleUser(ssoResponse)
                }
            }
            else if (ssoResponse.error) {
                if (ssoResponse.error != 'authing') {
                    //clearTimeout(pollTimer);
                    if (!done) {
                        showStatusScreen && showStatusScreen( false, ssoResponse.error)
                        done = true;
                    }
                }
            }
        });


    }

    function showHome(){
        if(statusScreen && m_master_container.contains(statusScreen)){
             m_master_container.removeChild(statusScreen);
        }
        var homeScreen = engine.createContainer()

        var logOutInfo = engine.createTextBlock( [Dictionary.getText( Dictionary.TEXT.HELLO ), user.name], 
            [FontLibraryInstance.getFont_DISCLAIMERBUTTON(),FontLibraryInstance.getFont_DISCLAIMERBUTTON()], 500 );
        logOutInfo.x=( 1200 / 2 ) - ( logOutInfo.naturalWidth / 2 );
        logOutInfo.y=150;
        homeScreen.addChild(logOutInfo)

        var deviceActiveText = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DEVICE_ACTIVE), FontLibraryInstance.getFont_DISCLAIMERBUTTON(), 900 );
        deviceActiveText.x=( 1200 / 2 ) - ( deviceActiveText.naturalWidth / 2 );
        deviceActiveText.y=220;
        homeScreen.addChild(deviceActiveText)

        var deactivateText = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DEACTIVATE_HOW), FontLibraryInstance.getFont_DISCLAIMERCENTERTEXT(), 1100 );
        deactivateText.x=( 1200 / 2 ) - ( deactivateText.naturalWidth / 2 );
        deactivateText.y=400;
        homeScreen.addChild(deactivateText)

        return homeScreen

    }
    
    function showActivate(){
        var rootNode = engine.createContainer();

        var nowWithText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.NOW_WITH ),  FontLibraryInstance.AUTHYOU, 1200 )
        nowWithText.x = (1200 - nowWithText.naturalWidth)/2
        nowWithText.y  = (1080)/2 - 550
        rootNode.addChild(nowWithText)

        var activateText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.ACTIVATE ),  FontLibraryInstance.AUTHACTIVATE, 1200 )
        activateText.x = (1200 - activateText.naturalWidth)/2
        activateText.y  = (1080)/2 - 420  
        rootNode.addChild(activateText)

        var loginText = engine.createTextBlock([Dictionary.getText( Dictionary.TEXT.LOGIN_TO ), 'http://crackle.com/activate'],  [FontLibraryInstance.AUTHLOGIN, FontLibraryInstance.AUTHLOGINURL], 1200 )
        loginText.x = (1200 - loginText.naturalWidth)/2
        loginText.y  = (1080)/2 - 320  
        rootNode.addChild(loginText)

        var enterCodeText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.ENTER_CODE ),  FontLibraryInstance.AUTHLOGIN, 1200 )
        enterCodeText.x = (1200 - enterCodeText.naturalWidth)/2
        enterCodeText.y  = (1080)/2 -220 
        rootNode.addChild(enterCodeText)

        var validAccountText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.VALID_ACCOUNT ),  FontLibraryInstance.PLAYNEXTDETAILSALT, 1200 )
        validAccountText.x = (1200 - validAccountText.naturalWidth)/2
        validAccountText.y  = (1080)/2 + 40 
        rootNode.addChild(validAccountText)
        
        return rootNode
    }

    var pollTimer;
    var authCode=""
       
    function pollActivation() {
        var done = false;
        CrackleApi.User.sso(function (ssoResponse) {
            if (ssoResponse.ActivationCode) {
                if (ssoResponse.ActivationCode != authCode) {
                    authCode = ssoResponse.ActivationCode
                    activationText = engine.createTextBlock(ssoResponse.ActivationCode,  FontLibraryInstance.AUTHSCREEN, 1200 )
                    activationText.x = (1200 - activationText.naturalWidth)/2
                    activationText.y  = (1080)/2 - 100
                    m_master_container.addChild(activationText)

                }
                if(pollOk == true){
                    pollTimer = setTimeout(function () {
                        pollActivation()
                
                    }, 3000);
                }
            }
            else if (ssoResponse.CrackleUserId) {
                //clearTimeout(pollTimer);
                if (!done) {
                    //Because CrackleAPI- that's why.
                    CrackleApi.User.moreUserInfo(ssoResponse, function(fullUserData){
                        ApplicationController.setUserInfo(fullUserData, showStatusScreen)
                        StorageManagerInstance.set('deviceAuth', 'true')
                        done = true;
                    })   
                }
            }
            else if (ssoResponse.error) {
                if (ssoResponse.error != 'authing') {
                    //clearTimeout(pollTimer);
                    if (!done) {
                        showStatusScreen && showStatusScreen( false, ssoResponse.error)
                        done = true;
                    }
                }
            }
        });

    }

    m_root_node.addChild( m_master_container );


};
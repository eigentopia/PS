var AuthScreen = (function(){
	var self = {};

	var authCode;

	self.rootNode;
	var codeDrawn = false
	var finishedCallback;
	var activationText;
	var pollTimer
	var background
	var containerWidth = 1600
	var containerHeight = 900
	var padding = 170

	function pollActivation() {
	    var done = false;
        CrackleApi.User.sso(function (ssoResponse) {
            //console.log("GOT something in poll " + JSON.stringify(ssoResponse))
            if (ssoResponse.ActivationCode) {
                if (ssoResponse.ActivationCode != authCode) {
                	authCode = ssoResponse.ActivationCode
					activationText = engine.createTextBlock(ssoResponse.ActivationCode,  FontLibraryInstance.AUTHSCREEN, 1920 )
					activationText.x = (1920 - activationText.naturalWidth)/2
					activationText.y  = (1080)/2 + padding
					self.rootNode.addChild(activationText)

                }
            }
            else if (ssoResponse.CrackleUserId) {
               	clearInterval(pollTimer);
                if (!done) {
                	//Because CrackleAPI- that's why.
                	CrackleApi.User.moreUserInfo(ssoResponse, function(fullUserData){
	                    finishedCallback && finishedCallback(true, fullUserData);
	                    done = true;
                		
                	})
                            
	
                }
            }
            else if (ssoResponse.error) {
                if (ssoResponse.error != 'authing') {
                    clearInterval(pollTimer);
                    if (!done) {
                        finishedCallback && finishedCallback( false, ssoResponse.error)
                        done = true;
                    }
                }
            }
        });

	}

	function drawScreen(){
	 	self.rootNode = engine.createContainer();

		// var background = engine.createSlate()
		// 	background.shader = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/button_small_lightgray.png" ), 14, 14, RGBLibraryInstance.getWHITE( .5 ) );
		// 	background.height = containerHeight
		// 	background.width = containerWidth
		// background = engine.createSlate();
		// background.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(.8) );
		// background.height = containerHeight
		// background.width = containerWidth
		// background.y = (1080- containerHeight) /2
		// background.x = (1920 -containerWidth) /2

		self.rootNode.addChild( AssetLoaderInstance.getImage( "Artwork/activationScreen.png" ) );

		var nowWithText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.NOW_WITH ),  FontLibraryInstance.AUTHYOU, 1920 )
		nowWithText.x = (1920 - nowWithText.naturalWidth)/2
		nowWithText.y  = (1080)/2 - 250
		self.rootNode.addChild(nowWithText)

		var activateText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.ACTIVATE ),  FontLibraryInstance.AUTHACTIVATE, 1920 )
		activateText.x = (1920 - activateText.naturalWidth)/2
		activateText.y  = (1080)/2 - 120  
		self.rootNode.addChild(activateText)

		var loginText = engine.createTextBlock([Dictionary.getText( Dictionary.TEXT.LOGIN_TO ), 'http://crackle.com/activate'],  [FontLibraryInstance.AUTHLOGIN, FontLibraryInstance.AUTHLOGINURL], 1920 )
		loginText.x = 600
		loginText.y  = (1080)/2 - 20  
		self.rootNode.addChild(loginText)

		var enterCodeText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.ENTER_CODE ),  FontLibraryInstance.AUTHLOGIN, 1920 )
		enterCodeText.x = 600
		enterCodeText.y  = (1080)/2 + 80 
		self.rootNode.addChild(enterCodeText)

		var validAccountText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.VALID_ACCOUNT ),  FontLibraryInstance.PLAYNEXTDETAILSALT, 1920 )
		validAccountText.x = (1920 - validAccountText.naturalWidth)/2
		validAccountText.y  = (1080)/2 + 340 
		self.rootNode.addChild(validAccountText)


// NOW_WITH
// ACTIVATE
// LOGIN_TO
// ENTER_CODE
// VALID_ACCOUNT
// 		self.rootNode.addChild(background)
		

	}

	self.startAuth = function(cb){

		finishedCallback = cb
		drawScreen()
		pollActivation()
		pollTimer = setInterval(function () {
			pollActivation()
	    }, 3000);

	}



	return self



}())
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
	var padding = 200

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
		background = engine.createSlate();
			background.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(.8) );
			background.height = containerHeight
			background.width = containerWidth
			background.y = (1080- containerHeight) /2
			background.x = (1920 -containerWidth) /2


		self.rootNode.addChild(background)
		

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
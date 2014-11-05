var ConvivaIntegration = {

	// Prerequisites

	// customerKey: 'd8cfa9b855476b04fa2d1dfa7c9154c09b55f9ca',
	// customerId : 'c3.Sony',

	customerId: 'c3.Sony-Test',
	customerKey: '21bc6e9159598658d20e920b00605bc7ce93eb78',

	// Reference to the current sessionId

	sessionId: null,
	attached: false,
	video:false,

 	// When the user clicks play
	
 	createSession: function(videoObj, vidUrl, mediaInfo) {
 		if(videoObj){
 			ConvivaIntegration.video = true;
 		}
	 	// Begin: Set up metadata
		var media = mediaInfo.data;


	 	var assetName = "["+media.ID +"]"+media.Title ;
	
	 	var tags = { 	adMode 			: "double", 
	 					category 		: media.MediaType,
	 					contentId		: media.ID,
	 					contentType		: media.RootChannel,
	 					crackleDomain	: "ps3-api-crackle.com",
	 					definition		: "Auto",
	 					episodeName		: media.Title,
	 					externalSite	: "PS3",
	 					genre			: media.Genre,
	 					playerVersion	: "2.1",
	 					rating			: media.Rating,
	 					season 			: (media.Season)?media.Season:"",
	 					show			: media.ShowName
	 				};

	 	var convivaMetadata = new Conviva.ConvivaContentInfo( assetName, tags );
	
 		convivaMetadata.defaultReportingCdnName = Conviva.ConvivaContentInfo.CDN_NAME_AKAMAI;

 		convivaMetadata.streamUrl = vidUrl;

 		convivaMetadata.isLive = false;

 		convivaMetadata.playerName = "Crackle Test PlayStation"
 		convivaMetadata.cdnName = Conviva.ConvivaContentInfo.CDN_NAME_AKAMAI

 		convivaMetadata.viewerId = "crackle_tester";

 		console.log("IKDFNOIWHRGOIUWRHGIOUWERHGIOUERNG")
	 	console.dir(convivaMetadata)
	

 		ConvivaIntegration.sessionId = Conviva.LivePass.createSession( videoObj, convivaMetadata );
 	},
 	
 	attachStreamer:function(video){
 		Logger.log("attachStreamer")
 		if(ConvivaIntegration.attached == false){
 			Logger.log("attachStreamer not attached")
 			ConvivaIntegration.attached = true;
 			if(ConvivaIntegration.video == false){ // just played a preroll.
 				Logger.log("attachStreamer ad end")
 				ConvivaIntegration.video = true;
 				Conviva.LivePass.adEnd(ConvivaIntegration.sessionId );
 			}
			Logger.log("attachStreamer video")
			console.dir(video)
			Conviva.LivePass.attachStreamer(ConvivaIntegration.sessionId, video )
		}
 	}, 
 	detachStreamer:function(){
 		Logger.log("detachStreamer")
 		if(ConvivaIntegration.sessionId != null && ConvivaIntegration.attached == true){//block here if in preroll
 			Logger.log("detachStreamer - activate")
 			ConvivaIntegration.attached = false
 			Conviva.LivePass.detachStreamer(ConvivaIntegration.sessionId )
 		}
 	},
 	adStart:function(){
 		Logger.log("AD START- only for prerolls")
 		Conviva.LivePass.adStart(ConvivaIntegration.sessionId )
 	},

 	// When the stream is done with playback

 	cleanUpSession: function() {
		Logger.log("Cleanup")
	 	//if ( ConvivaIntegration.sessionId != null ) {
			Logger.log("Cleanup - activate")
	 			Conviva.LivePass.cleanupSession(ConvivaIntegration.sessionId );
	
	 			ConvivaIntegration.sessionId = null;
	
 		//}
 	}

}

var ConvivaIntegration = {

	// Prerequisites

	// customerKey: 'd8cfa9b855476b04fa2d1dfa7c9154c09b55f9ca',
	// customerId : 'c3.Sony',

	customerId: 'c3.Sony-Test',
	customerKey: '21bc6e9159598658d20e920b00605bc7ce93eb78',

	// Reference to the current sessionId

	sessionId: null,

 	// When the user clicks play
	
 	createSession: function(videoObj, vidUrl, mediaInfo) {

 		// Clean up previous session
	
	 	ConvivaIntegration.cleanUpSession();
	
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
	 					playerVersion	: "2.01",
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

 // When the stream is done with playback

 	cleanUpSession: function() {
	
	 		if ( ConvivaIntegration.sessionId != null ) {
	
	 			Conviva.LivePass.cleanupSession(ConvivaIntegration.sessionId );
	
	 			ConvivaIntegration.sessionId = null;
	
 		}
 	}
}

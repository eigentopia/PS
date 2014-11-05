
var NextVideoWidget = function(MediaObj){
	var rootNode = engine.createContainer();
	var containerWidth = 730
	var containerHeight = 120
	var padding = 10
	var imageWidth = 100
	var pfnText = Dictionary.getText( Dictionary.TEXT.PRESSFORNEXT );
	var self = this

	function getFullTitle(data){
		var title = data.Title;

		if(data.Season && data.Season != ""){
			title = data.ParentChannelName +", S"+data.Season;
			if(data.Episode && data.Episode != ""){ //because yes- we get an empty string sometimes.
				title+="E"+data.Episode
			}
			title +=": "+ data.Title
		}
		return title
	}

	var background = engine.createSlate()
		background.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getLIGHTGRAY(.9) );//ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_small_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( .5 ) );
		background.height = containerHeight
		background.width = containerWidth
	var pressForNextSlate = engine.createSlate();
		pressForNextSlate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(.9) );
		pressForNextSlate.height = 55
		pressForNextSlate.width = containerWidth
		pressForNextSlate.y = 120

	rootNode.addChild(background)
	rootNode.addChild(pressForNextSlate)

	var pfnt = (StorageManagerInstance.get( 'geocode' ) == 'en')? FontLibraryInstance.PLAYNEXTDETAILS:FontLibraryInstance.PLAYNEXTDETAILSALT
	var pressForNextText = engine.createTextBlock( pfnText, pfnt, containerWidth -( imageWidth + padding));
    	pressForNextText.x = (containerWidth/2 - pressForNextText.naturalWidth/2) + imageWidth/2 
        pressForNextText.y = pressForNextSlate.y + (padding + 5);
    
    rootNode.addChild( pressForNextText );
	
	var upNext = Dictionary.getText( Dictionary.TEXT.UPNEXT) + getFullTitle(MediaObj);
	var upNextText = engine.createTextBlock( upNext, FontLibraryInstance.PLAYNEXTDETAILS, containerWidth - (imageWidth + padding*2 ));
	upNextText.y =  (containerHeight/2 - upNextText.naturalHeight/2) 
	upNextText.x =  ((containerWidth+imageWidth)/2 - upNextText.naturalWidth/2)// + imageWidth

	rootNode.addChild(upNextText)

	var mediaObj = MediaObj;
	//100x150 Onesheet

	var itemImgURL = null;
	if (MediaObj.Thumbnail_OneSheet100x150){
		itemImgURL = MediaObj.Thumbnail_OneSheet100x150
	}
	else if(MediaObj.OneSheetImage100x150){
	 	itemImgURL = MediaObj.OneSheetImage100x150;
	}
	else if(MediaObj.OneSheetImage_100_150){
		itemImgURL = MediaObj.OneSheetImage_100_150
	}

	if(itemImgURL != null){
		var oneSheet = engine.loadImage(itemImgURL, function(img){
			if(img){
				img.x = 10
				img.y= 10
				rootNode.addChild(img);
			}
		})
	}

	return rootNode;

}
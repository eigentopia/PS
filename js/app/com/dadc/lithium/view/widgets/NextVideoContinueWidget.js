
var ContinueWidget = function( ) {
    this.rootNode = engine.createContainer();
    var message = Dictionary.getText( Dictionary.TEXT.WANTTOCONTINE );
    var spacing = 60

    var bg_slate = getBackgroundSlate();

    var tblock = engine.createTextBlock( message, FontLibraryInstance.PLAYNEXTDETAILS, 630 );

    this.yesButton = Button(Dictionary.getText( Dictionary.TEXT.YES), true);
    this.noButton = Button(Dictionary.getText( Dictionary.TEXT.NO), false);
    
    tblock.x = ( bg_slate.width / 2 ) - ( tblock.naturalWidth / 2 );
    tblock.y = 10;

    this.yesButton.rootNode.x = (bg_slate.width/2) - ((this.yesButton.rootNode.getChildAt(0).width *2) + spacing) /2
    this.noButton.rootNode.x = this.yesButton.rootNode.x + this.yesButton.rootNode.getChildAt(0).width + spacing
    this.yesButton.rootNode.y = this.noButton.rootNode.y = tblock.y + 65

    this.rootNode.addChild( bg_slate );
    this.rootNode.addChild( tblock );
    this.rootNode.addChild( this.yesButton.rootNode );
    this.rootNode.addChild( this.noButton.rootNode );
    
    function getBackgroundSlate(){
        var tmp_slate = engine.createSlate();
        
        tmp_slate.shader            = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(.9) );
        tmp_slate.width             = 630
        tmp_slate.height            = 150

        return tmp_slate;
    }
    
    function Button(text, state){

        var rootNode = engine.createContainer();
        var selected = state

        var selectedSlate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/subnav_button_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        var notSelectedSlate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/subnav_button_gray.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );  
   
        selectedSlate.width = notSelectedSlate.width = 100
        selectedSlate.height = notSelectedSlate.height = 50

        if(state == true ){
            rootNode.addChild( selectedSlate );
        }
        else{   
            rootNode.addChild( notSelectedSlate );
        }
        
        
        var tblock = engine.createTextBlock( text, FontLibraryInstance.PLAYNEXTDETAILSBUTTON, 200 );
        tblock.x = selectedSlate.width/2 - tblock.naturalWidth/2;
        tblock.y = selectedSlate.height/2 - tblock.naturalHeight/2;
        rootNode.addChild( tblock );
        
        return {
            rootNode:rootNode,
            selected:function (){return selected},
            select: function(state){
                selected = state;
                rootNode.removeChildAt[0]
                var slate;
                if(state == true){
                    slate = selectedSlate
                }
                else{
                    slate = notSelectedSlate; 
                }
                
                rootNode.addChildAt(slate, 1)
            }
        };
    }

    this.navLeft = function(){
        if(this.noButton.selected){
            this.yesButton.select(true);
            this.noButton.select(false);
        }
    }
    this.navRight = function(){
        if(this.yesButton.selected){
            this.yesButton.select(false);
            this.noButton.select(true);            
        }
    }
};

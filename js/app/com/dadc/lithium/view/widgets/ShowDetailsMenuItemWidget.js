include( "js/app/com/dadc/lithium/view/widgets/VideoProgressWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/PlaylistMenuButtonWidget.js" );

/**
 */
var ShowDetailsMenuItemWidget = function( media_obj, render_on_start ) {
    var m_media_obj         = media_obj;
    var m_render_on_start   = render_on_start;
    var m_root_node         = null;
    var watchNowButton      = new PlaylistMenuButtonWidget(Dictionary.getText( Dictionary.TEXT.WATCHNOW ), true);
    var myWatchListButton     = new PlaylistMenuButtonWidget(" ");
    var m_selected_container;
    var m_disabled_container;
    var m_inactive_container;

    var currentButton;

    var m_video_progress_widget;
    var This = this;
    var CELL_HEIGHT = 100;
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ShowDetailsMenuItemWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( media_obj, render_on_start ){
        m_media_obj         = media_obj;
        m_render_on_start   = render_on_start;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    this.getMediaID = function(){return m_media_obj.getID();};

    this.isRendered = function(){return m_root_node != null;}
    this.destroy = function(){
        //console.log("ShowDetailsMenuItemWidget being destroy")
        try{
            while( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
            m_video_progress_widget.destroy();
        }catch( e ){
            Logger.log( '!!! EXCEPTION ShowDetailsMenuItemWidget destroy()' );
            Logger.logObj( e );
        }finally{
            m_media_obj             = null;
            m_root_node             = null;
            m_selected_container    = null;
            m_disabled_container    = null;
            m_inactive_container    = null;
            m_video_progress_widget = null;
            watchNowButton = null
            myWatchListButton = null
            currentButton = null;
        }
    }

    this.navLeft = function(){
        //console.log("NAV L ShowDetailsMenuItemWidget "+myWatchListButton.isActive())
        if(myWatchListButton.isActive()){
            myWatchListButton.setInactive();
            watchNowButton.setActive();
            currentButton = watchNowButton;
            return true;
        }
        else{
            return false;
        }

    }
    this.navRight = function(){
        //console.log("NAV R ShowDetailsMenuItemWidget "+watchNowButton.isActive())
        if(watchNowButton.isActive()){
            watchNowButton.setInactive();
            myWatchListButton.setActive();
            currentButton = myWatchListButton;
            return true;
        }
        else{
            return false;
        }

    }
    this.enterPressed = function(doWatchlist){
        //console.log("ENTER ShowDetailsMenuItemWidget")
        if(myWatchListButton.isActive()){
            doWatchlist(m_media_obj.getID(), "media", function(isAdd){
                var buttonText = Dictionary.getText( Dictionary.TEXT.WATCHLIST ); 
                if(isAdd){
                    buttonText = "+ " + buttonText;
                }
                else{
                    buttonText = "- " + buttonText;
                }
                
                myWatchListButton.refreshWidget(buttonText, true)
            })
            return true;
        }
        
        return false

    }
    this.isActive = function(){
        return m_root_node.contains( m_selected_container );
    }    
    this.setActive = function(){
        if ( !m_root_node.contains( m_selected_container ) ){
            m_root_node.addChildAt( m_selected_container, 0 );
        }
        if ( m_root_node.contains( m_disabled_container ) ){
            m_root_node.removeChild( m_disabled_container );
        }
        if ( m_root_node.contains( m_inactive_container ) ){
            m_root_node.removeChild( m_inactive_container );
        }
        if(currentButton){
            currentButton.setActive();
        }
        else{
            watchNowButton.setActive();
        }
    }
    this.setInactive = function(){
        if ( m_root_node.contains( m_selected_container ) ){
            m_root_node.removeChild( m_selected_container );
        }
        if ( m_root_node.contains( m_disabled_container ) ){
            m_root_node.removeChild( m_disabled_container );
        }
        if ( !m_root_node.contains( m_inactive_container ) ){
            m_root_node.addChildAt( m_inactive_container, 0 );
        }
        
        myWatchListButton.setInactive();
        watchNowButton.setInactive();
        

    }
    this.setDisabled = function(){
        if ( m_root_node.contains( m_selected_container ) ){
            m_root_node.removeChild( m_selected_container );
        }
        if ( m_root_node.contains( m_inactive_container ) ){
            m_root_node.removeChild( m_inactive_container );
        }
        if ( !m_root_node.contains( m_disabled_container ) ){
            m_root_node.addChildAt( m_disabled_container, 0 );
        }
        myWatchListButton.setDisabled();
        watchNowButton.setDisabled();
        currentButton = null;        
    }
    this.setIndex = function( index ){
        m_video_progress_widget = new VideoProgressWidget( null );
    }
    this.refreshVideoProgressWidget = function(){
        if( m_video_progress_widget )
            m_video_progress_widget.refreshWidget( m_media_obj.getDurationInSeconds(), VideoProgressManagerInstance.getProgress( m_media_obj.getID() ) );
    }
    this.refreshWatchlistButton = function(){
        if( myWatchListButton ){
            var watchListText = Dictionary.getText( Dictionary.TEXT.WATCHLIST );
            if(ApplicationController.isInUserWatchlist( m_media_obj.getID())){
                watchListText = "- " + watchListText;
            }
            else{
                watchListText = "+ " + watchListText;
            }
            myWatchListButton.refreshWidget(watchListText)
        }
    }
    this.clear = function(){
        //console.log("ShowDetailsMenuItemWidget being destroy")
        if( m_root_node ){
            while ( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
        }
        
        m_root_node                 = null;
        m_video_progress_widget     = null;
        m_selected_container        = null;
        m_disabled_container        = null;
        m_inactive_container        = null;
        myWatchListButton           = null;
        watchNowButton              = null;
    }
    this.render = function(){
        if( This.isRendered() ) return;
        
        if( !m_selected_container ) m_selected_container = getCellSelectionContainer();
        if( !m_disabled_container ) m_disabled_container = getCellDisabledContainer();
        if( !m_inactive_container ) m_inactive_container = getCellInactiveContainer();
        
        if( m_root_node ){
            while ( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
        }
        
        m_root_node = engine.createContainer();
        
        var text = "";
        
        if ( m_media_obj.getSeason() ){
            text += Dictionary.getText( Dictionary.TEXT.S_SEASON ) + m_media_obj.getSeason();
            if ( m_media_obj.getEpisode() ){
                text += Dictionary.getText( Dictionary.TEXT.E_EPISODE ) + m_media_obj.getEpisode();
            }
            text += ' - ';
        }
        if ( m_media_obj.getTitle() ){
            text += m_media_obj.getTitle();
        }        
        
        var tmp_container = engine.createContainer();
        tmp_container.width = 1920;
        tmp_container.height = CELL_HEIGHT;

        var tblock = engine.createTextBlock( text, FontLibraryInstance.getFont_EPISODEMENU(), 700 );
        tblock.x = 140;
        tblock.y = 22;
        tmp_container.addChild( tblock );
        
        m_root_node.addChild( tmp_container );
        
        m_video_progress_widget = new VideoProgressWidget( m_media_obj.getDurationInSeconds(), VideoProgressManagerInstance.getProgress( m_media_obj.getID() ) );
        m_video_progress_widget.getDisplayNode().x = 140;
        m_video_progress_widget.getDisplayNode().y = 70;
        m_root_node.addChild( m_video_progress_widget.getDisplayNode() );
        
        This.setDisabled();
    }
    function initWidget(){
        if( m_render_on_start ){
            This.render();
        }
    }
    
    function getCellSelectionContainer( ){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();
        
        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getWHITE( 1 ) );
        tmp_slate.height = CELL_HEIGHT;
        tmp_slate.width = 1920;
        
        tmp_container.addChild( tmp_slate );

        watchNowButton.getDisplayNode().x = 870;
        watchNowButton.getDisplayNode().y = 20;
        tmp_container.addChild( watchNowButton.getDisplayNode() );
        
        
        var watchListText = Dictionary.getText( Dictionary.TEXT.WATCHLIST );
        if(ApplicationController.isInUserWatchlist( m_media_obj.getID())){
            watchListText = "- " + watchListText;
        }
        else{
            watchListText = "+ " + watchListText;
        }
        myWatchListButton.refreshWidget(watchListText)

        myWatchListButton.getDisplayNode().x = 1150;
        myWatchListButton.getDisplayNode().y = 20;
        tmp_container.addChild( myWatchListButton.getDisplayNode() );
        
        
        return tmp_container;
    }
    
    function getCellDisabledContainer(){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getGRAY( 1 ) );
        tmp_slate.height = CELL_HEIGHT;
        tmp_slate.width = 1920;
        
        tmp_container.addChild( tmp_slate );

        return tmp_container;
    }
    function getCellInactiveContainer( ){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();
        
        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getGRAY( 1 ) );
        tmp_slate.height = CELL_HEIGHT;
        tmp_slate.width = 1920;
        
        tmp_container.addChild( tmp_slate );
        
        return tmp_container;
    }
    if ( m_media_obj ){
        initWidget();
    }

};
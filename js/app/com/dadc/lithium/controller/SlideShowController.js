
include( "js/app/com/dadc/lithium/view/widgets/SlideShowImageWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/SlideShowPromotionalMessageWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/SlideShowThumbListWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/SlideShowArrowWidget.js" );

include( "js/app/com/dadc/lithium/model/SlideShow.js");

var SlideShowController = function( ParentControllerObj )
{
    var m_unique_id                                 = Controller.reserveUniqueID();
    var m_parent_controller_obj                     = ParentControllerObj;
    var m_root_node                                 = engine.createContainer();
    var m_master_container                          = engine.createContainer();
    var m_slide_show_image_widgets                  = [];
    var m_slide_show_promotional_message_widgets    = [];
    var slide_show_promo_images                     = [];
    var m_slide_show_thumb_list_widget              = new SlideShowThumbListWidget( null );
    var m_ix_selected_thumb                         = null;
    var m_total_slide_show_items                    = 0;
    var m_slide_show_obj;
    var m_is_focussed                               = false;
    var m_slideshow_arrow_widget_prev               = new SlideShowArrowWidget( SlideShowArrowWidget.DIRECTION.PREV, SlideShowArrowWidget.COLOR.GRAY );
    var m_slideshow_arrow_widget_next               = new SlideShowArrowWidget( SlideShowArrowWidget.DIRECTION.NEXT, SlideShowArrowWidget.COLOR.WHITE );

    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'SlideShowController';};
    this.open = function( ){
        m_root_node.addChild( m_master_container );
    };
    this.close = function( ){
        if ( m_root_node.contains( m_master_container) ) m_root_node.removeChild( m_master_container );
    };
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SlideShowController update() ' + engine_timer );
    };
    this.setFocus = function(){
        m_is_focussed = true;
        Logger.log( 'm_ix_selected_thumb = ' + m_ix_selected_thumb );
        if ( m_ix_selected_thumb !== null && m_ix_selected_thumb >= 0 ){
            m_slide_show_thumb_list_widget.selectRow( m_ix_selected_thumb );
        }
    };
    this.unsetFocus = function(){
        m_is_focussed = false;
    };

    this.prepareToOpen = function( ){
        // Request slideshow for all movies - we should get 8 results
        var slide_show_request = new SlideShowRequest( SlideShowRequest.CHANNEL_NAME.HOME, StorageManagerInstance.get( 'geocode' ), function( slide_show_obj, status )
	       {
            if ( status !== 200 ){
                // inform our parent controller our request failed
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
            }else{            
                m_slide_show_obj = slide_show_obj;
                m_total_slide_show_items = slide_show_obj.getItemList().getTotalItems();

                // Refresh the slide show thumb list widget with our slide show object
                m_slide_show_thumb_list_widget.refreshWidget( slide_show_obj );

                // Loop through each movie to create individual widgets
                for ( var i = 0; i < m_total_slide_show_items; i++ ){
                    
                    // Create slide show image widget with the image url
                    m_slide_show_image_widgets[ i ] = new SlideShowImageWidget( slide_show_obj.getItemList().getItem(i).getSlideImage_1510x516(), true );
                    m_slide_show_promotional_message_widgets[ i ] = new SlideShowPromotionalMessageWidget( slide_show_obj.getItemList().getItem(i) );
                    var id = slide_show_obj.m_data.slideList.slideID;
                    var url = 'http://23adc.v.fwmrm.net/ad/g/1?nw=146140&prof=146140:crackle_'+ApplicationController.DEVICE_TYPE+'_test&csid=crackle_ps_app_home&pvrn=23412341234;slide=6122;slid=_fw_form_adsponsorlogo6059&ptgt=s&w=120&h=60'
       
                    //slide_show_promo_images[i] = new SlideShowImageWidget( url, true );

    //                m_slide_show_promotional_message_widgets[ i ].getDisplayNode().x = 60;
                    m_slide_show_promotional_message_widgets[ i ].getDisplayNode().y = 516;
                    //slide_show_promo_images[i].getDisplayNode().y = 516;
                }

                // Initial selection
                if ( m_total_slide_show_items > 0 ){
                    m_ix_selected_thumb = 0;

                    m_master_container.addChild( m_slide_show_image_widgets[ 0 ].getDisplayNode() );
                    m_master_container.addChild( m_slide_show_promotional_message_widgets[ 0 ].getDisplayNode() );
                    //m_master_container.addChild( slide_show_promo_images[ 0 ].getDisplayNode() );
                }
                
                if( m_total_slide_show_items < 5){
                    m_master_container.removeChild( m_slideshow_arrow_widget_prev.getDisplayNode() );
                    m_master_container.removeChild( m_slideshow_arrow_widget_next.getDisplayNode() );
                }

                // inform our parent controller that we are ready to go
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
            }
        });
        slide_show_request.startRequest();
    };
    
    this.requestParentAction = function( json_data_args ){};
    
    this.notifyPreparationStatus = function( controller_id ){};
    
    this.getUniqueID = function(){return m_unique_id;};
    
    this.navLeft = function()
    {
        if ( !m_is_focussed ) return;
        //Logger.log( 'm_ix_selected_thumb = ' + m_ix_selected_thumb );
        if ( m_ix_selected_thumb > 0 ) {
            // Remove from the master container the current slide show image
            m_master_container.removeChild( m_slide_show_image_widgets[ m_ix_selected_thumb ].getDisplayNode() );
            //m_master_container.removeChild( slide_show_promo_images[ m_ix_selected_thumb ].getDisplayNode() );
            m_master_container.removeChild( m_slide_show_promotional_message_widgets[ m_ix_selected_thumb ].getDisplayNode() );
            // Add to the master container the current slide show image
            m_master_container.addChild( m_slide_show_image_widgets[ m_ix_selected_thumb - 1 ].getDisplayNode() );
            m_master_container.addChild( m_slide_show_promotional_message_widgets[ m_ix_selected_thumb - 1 ].getDisplayNode() );
            //m_master_container.addChild( slide_show_promo_images[ m_ix_selected_thumb - 1 ].getDisplayNode());

            m_slide_show_thumb_list_widget.unselectRow( m_ix_selected_thumb );
            m_slide_show_thumb_list_widget.selectRow( m_ix_selected_thumb - 1 );
            m_ix_selected_thumb--;
            
            refreshArrowWidgets();

            m_slide_show_thumb_list_widget.scrollIfNeeded();
    	} 
    	else
    	{
            m_slide_show_thumb_list_widget.unselectRow( 0 );

            // Select menu on the left
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
            );
        }
    };
    
    this.navRight = function()
    {
        if ( !m_is_focussed ) return;
        Logger.log( 'm_ix_selected_thumb = ' + m_ix_selected_thumb );
        if ( m_ix_selected_thumb < m_total_slide_show_items - 1 ){
            // Remove from the master container the current slide show image
            m_master_container.removeChild( m_slide_show_image_widgets[ m_ix_selected_thumb ].getDisplayNode() );
            m_master_container.removeChild( m_slide_show_promotional_message_widgets[ m_ix_selected_thumb ].getDisplayNode() );
            //m_master_container.removeChild( slide_show_promo_images[ m_ix_selected_thumb].getDisplayNode());
            
            // Add to the master container the current slide show image
            m_master_container.addChild( m_slide_show_image_widgets[ m_ix_selected_thumb + 1 ].getDisplayNode() );
            m_master_container.addChild( m_slide_show_promotional_message_widgets[ m_ix_selected_thumb + 1 ].getDisplayNode() );
            //m_master_container.addChild( slide_show_promo_images[ m_ix_selected_thumb + 1 ].getDisplayNode());
            
            m_slide_show_thumb_list_widget.unselectRow( m_ix_selected_thumb );
            m_slide_show_thumb_list_widget.selectRow( m_ix_selected_thumb + 1 );
            m_ix_selected_thumb++;
            
            refreshArrowWidgets();

            m_slide_show_thumb_list_widget.scrollIfNeeded();
        }
    };
    
    this.navDown = function(){ };
    
    this.enterPressed = function()
    {
        var item = m_slide_show_obj.getItemList().getItem( m_ix_selected_thumb )

        AnalyticsManagerInstance.slideshowEvent(item.getTitle(), m_ix_selected_thumb.toString())
        // Check if we have to open the shows or the media details page by
        // checking the RootChannel attribute
        if ( item.getAppNextScreenType() === 'ChannelHome' ){
            if ( item.getRootChannelID &&  
                (item.getRootChannelID() == 114 ||  item.getRootChannelID() == 46)
            ){
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.OPEN_SHOW_DETAILS, channel_id: item.getAppDataID(), calling_controller: this}
                );               
            }else if ( item.getRootChannelID &&  item.getRootChannelID() == 586 ){
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.OPEN_COLLECTION, calling_controller: this, category: BrowseRequest.CHANNEL_NAME.COLLECTIONS, collection_id: item.getAppDataID() }
                );               
            }else{
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.OPEN_MOVIE_DETAILS, channel_id: item.getAppDataID(), media_id:item.getAppDataID(), calling_controller: this}
                );               
            }
        }else if ( item.getAppNextScreenType() === 'VideoDetail' ){
            //because they arbitrarily decided to toss this in
            if ( item.getRootChannelID &&  (item.getRootChannelID() == 114 ||  item.getRootChannelID() == 46)){
                var channelId = item.getParentChannelID()
                var mediaId = item.getAppDataID();
                
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.OPEN_SHOW_DETAILS, channel_id: channelId, media_id:mediaId, calling_controller: this}
                );               
            }
            else{
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.OPEN_MOVIE_DETAILS, channel_id: item.getParentChannelID(), media_id: item.getAppDataID(), calling_controller: this}
                );
            }
        }
    };
    
    this.navUp = function()
    {
        m_slide_show_thumb_list_widget.unselectRow( m_ix_selected_thumb );
        
        // Select menu on the left
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
        );
    };
    
    this.circlePressed = function()
    {
            m_slide_show_thumb_list_widget.unselectRow( m_ix_selected_thumb );

            // Select menu on the left
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
            ); 
    };
    
    function refreshArrowWidgets()
    {
        if ( m_ix_selected_thumb === m_total_slide_show_items - 1 ){
            m_slideshow_arrow_widget_prev.refreshWidget( SlideShowArrowWidget.DIRECTION.PREV, SlideShowArrowWidget.COLOR.WHITE );
            m_slideshow_arrow_widget_next.refreshWidget( SlideShowArrowWidget.DIRECTION.NEXT, SlideShowArrowWidget.COLOR.GRAY );                
        } else if ( m_ix_selected_thumb > 5 ){
            m_slideshow_arrow_widget_prev.refreshWidget( SlideShowArrowWidget.DIRECTION.PREV, SlideShowArrowWidget.COLOR.WHITE );
            m_slideshow_arrow_widget_next.refreshWidget( SlideShowArrowWidget.DIRECTION.NEXT, SlideShowArrowWidget.COLOR.WHITE );                
        } else{
            m_slideshow_arrow_widget_prev.refreshWidget( SlideShowArrowWidget.DIRECTION.PREV, SlideShowArrowWidget.COLOR.GRAY );
            m_slideshow_arrow_widget_next.refreshWidget( SlideShowArrowWidget.DIRECTION.NEXT, SlideShowArrowWidget.COLOR.WHITE );                
        }        
    }

    m_master_container.addChild( m_slide_show_thumb_list_widget.getDisplayNode() );
    m_master_container.addChild( m_slideshow_arrow_widget_prev.getDisplayNode() );
    m_master_container.addChild( m_slideshow_arrow_widget_next.getDisplayNode() );
    m_slide_show_thumb_list_widget.getDisplayNode().x = 40;
    m_slide_show_thumb_list_widget.getDisplayNode().y = 653;
    
    m_slideshow_arrow_widget_prev.getDisplayNode().x = m_slide_show_thumb_list_widget.getDisplayNode().x - 30;
    m_slideshow_arrow_widget_prev.getDisplayNode().y = 776;
    m_slideshow_arrow_widget_next.getDisplayNode().x = m_slide_show_thumb_list_widget.getDisplayNode().width + m_slide_show_thumb_list_widget.getDisplayNode().x + 10;
    m_slideshow_arrow_widget_next.getDisplayNode().y = 776;
};
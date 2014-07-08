include( "js/app/com/dadc/lithium/view/widgets/TabbedButtonWidget.js" );

var TabbedWidget = function( captions ) {
    var m_root_node = engine.createContainer();
    var m_captions = captions;
    var m_selected_index = -1;
    var m_tabbed_widget_buttons = [];
    
    var BUTTON_PADDING = 30;
    this.destroy = function(){
        
    }
    this.refreshWidget = function( captions ){
        m_captions = captions;
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    this.getHeight = function(){
        if( m_tabbed_widget_buttons[ 0 ] )
            return m_tabbed_widget_buttons[ 0 ].getHeight();
        else
            return 0;
    }
    this.update = function( engine_timer ){
    }
    this.navLeft = function(){
        m_selected_index--;
        
        if( m_selected_index >= 0 ){
            m_tabbed_widget_buttons[ m_selected_index + 1 ].setDisabled();
            m_tabbed_widget_buttons[ m_selected_index ].setActive();
            return true;
        }else{
            m_selected_index = 0;
            return false;
        }
    }
    this.navRight = function(){
        m_selected_index++;
        
        if( m_selected_index < m_tabbed_widget_buttons.length ){
            m_tabbed_widget_buttons[ m_selected_index - 1 ].setDisabled();
            m_tabbed_widget_buttons[ m_selected_index ].setActive();
            return true;
        }else{
            m_selected_index = m_tabbed_widget_buttons.length - 1;
            return false;
        }
    }
    this.isFocussed = function(){
        return m_tabbed_widget_buttons[ m_selected_index ].isActive();
    }
    this.setFocus = function(){
        m_tabbed_widget_buttons[ m_selected_index ].setActive();
    }
    this.unsetFocus = function(){
        m_tabbed_widget_buttons[ m_selected_index ].setInactive();
    }
    /**
     * Load image from m_image_url and add it to our root container
     */
    function initWidget(){
        var last_x = 0;
        
        for( var i in m_captions ){
            m_tabbed_widget_buttons.push( new TabbedButtonWidget( m_captions[ i ] ) );
            m_root_node.addChild( m_tabbed_widget_buttons[ m_tabbed_widget_buttons.length - 1 ].getDisplayNode() );
            if( last_x != 0 ){
                m_tabbed_widget_buttons[ m_tabbed_widget_buttons.length - 1 ].getDisplayNode().x = last_x + BUTTON_PADDING;
            }
            last_x = m_tabbed_widget_buttons[ m_tabbed_widget_buttons.length - 1 ].getWidth();
        }
        if( m_tabbed_widget_buttons[ 0 ] ){
            m_tabbed_widget_buttons[ 0 ].setActive();
            m_selected_index = 0;
        }
    }
    
    if ( captions ){
        initWidget();
    }
};
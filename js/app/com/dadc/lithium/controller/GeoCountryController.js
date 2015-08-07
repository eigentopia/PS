include( "js/app/com/dadc/lithium/model/AppConfig.js" );
include( "js/app/com/dadc/lithium/config/LoggerConfig.js" );
include( "js/app/com/dadc/lithium/model/GeoCountry.js" );

var GeoCountryController = function( ParentControllerObj ){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var m_is_invalid_region         = false;
    
    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'GeoCountryController';};
    this.open = function( ){
        m_root_node.addChild( m_master_container );
    };
    this.close = function( ){
        m_root_node.removeChild( m_master_container );
    };
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'GeoCountryController update() ' + engine_timer );
    };
    this.prepareToOpen = function(){
        var geo_country_request = new GeoCountryRequest( onGeoCountryResponse );
        geo_country_request.startRequest();
    };
    this.requestParentAction = function( json_data_args ){};
    this.notifyPreparationStatus = function( controller_id ){};
    this.getUniqueID = function(){return m_unique_id;};
    this.isInvalidRegion = function(){
        return m_is_invalid_region;
    }
    
    function onGeoCountryResponse( GeoCountryObj, status ){
        if ( status != 200 ){
            
            if( LoggerConfig.GeocodeConfig.ALLOWED_COUNTRIES.length > 0 ){
                m_is_invalid_region = true;
                ParentControllerObj.requestingParentAction( {action: ApplicationController.OPERATIONS.INVALID_REGION, calling_controller: this} );
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );
            }else{
                m_is_invalid_region = false;
                // if request failed, use US
                StorageManagerInstance.set( 'geocode', 'US' );
                StorageManagerInstance.set( 'lang', 'en' );

                // inform our parent controller our request failed
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );
            }
        }else{
            StorageManagerInstance.set( 'geocode', GeoCountryObj.getCountryCode() );
            //StorageManagerInstance.set( 'IPADDRESS', GeoCountryObj.getIPAddress() );
            StorageManagerInstance.set( StorageManager.STORAGE_KEYS.IPADDRESS, GeoCountryObj.getIPAddress() );
            
            if( LoggerConfig.GeocodeConfig.hasOwnProperty( 'FAKE_COUNTRY' ) && LoggerConfig.GeocodeConfig.FAKE_COUNTRY ){
                StorageManagerInstance.set( 'geocode', LoggerConfig.GeocodeConfig.FAKE_COUNTRY );
                m_is_invalid_region = false;
                var app_config_request = new AppConfigRequest( onAppConfigResponse );

                app_config_request.startRequest();
            }else{
                if( LoggerConfig.GeocodeConfig.ALLOWED_COUNTRIES.length > 0 &&
                    LoggerConfig.GeocodeConfig.ALLOWED_COUNTRIES.indexOf( GeoCountryObj.getCountryCode() ) < 0  ){
                    m_is_invalid_region = true;
                    ParentControllerObj.requestingParentAction( {action: ApplicationController.OPERATIONS.INVALID_REGION, calling_controller: this} );
                    ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
                }else{
                    m_is_invalid_region = false;
                    var app_config_request = new AppConfigRequest( onAppConfigResponse );

                    app_config_request.startRequest();
                }
            }
        }
    }
    
    function getLanguageByCountry( country ){
        var lang;
        var l_country = country;
        
        if( country ){
            l_country = country.toLowerCase();
        }
        
        Logger.log( 'l_country = ' + l_country );

        switch( l_country ){
            case 'br':
                lang = 'br';
                break;
            case 'us':
                lang = 'en';
                break;
            case 'mx':
                lang = 'es';
                break;
            default:
                lang = null;
                break;
        }
        
        return lang;
        
    }
    function onAppConfigResponse( AppConfigObj, status ){
        try{
            if ( status != 200 ){
                StorageManagerInstance.set( 'api_hostname', 'api.crackle.com' );
                StorageManagerInstance.set( 'lang', 'en' );
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );
            }else{
                if( !AppConfigObj || !AppConfigObj.getSupportedRegionList()){
                    ParentControllerObj.requestingParentAction( {action: ApplicationController.OPERATIONS.INVALID_REGION, calling_controller: this} );
                    return;
                }
                
                var host_name= AppConfigObj.getSupportedRegionList().getApiHostnameByCountryCode( StorageManagerInstance.get( 'geocode' ) );
                
                if( !host_name ){
                    ParentControllerObj.requestingParentAction( {action: ApplicationController.OPERATIONS.INVALID_REGION, calling_controller: this} );
                    return;
                }
                
                Logger.log('Stored Geo ' + StorageManagerInstance.get( 'geocode' ) )
                Logger.log('setting language to ' + AppConfigObj.getSupportedRegionList().getLanguageByCountryCode( StorageManagerInstance.get( 'geocode' ) ) );
                StorageManagerInstance.set( 'api_hostname', AppConfigObj.getSupportedRegionList().getApiHostnameByCountryCode( StorageManagerInstance.get( 'geocode' ) ) );
                if(engine.stats.locale && engine.stats.locale == "fr_FR"){
                    StorageManagerInstance.set( 'lang', 'fr');
                }
                else{
                    StorageManagerInstance.set( 'lang', AppConfigObj.getSupportedRegionList().getLanguageByCountryCode( StorageManagerInstance.get( 'geocode' ) ) );
                }
            }
        }catch( e ){
            StorageManagerInstance.set( 'api_hostname', 'api.crackle.com' );
            ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );
        }
        
        // inform our parent controller that we are ready to go
        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
    }
    
    m_root_node = engine.createContainer();
};
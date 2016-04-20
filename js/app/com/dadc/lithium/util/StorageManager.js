var StorageManager = function( localObj )
{
    var m_local = localObj;
    var self = this;
    var langSet = false;

    function doLang (cb){
        var lang;
         switch (engine.stats.locale){
            case 'fr_FR':
                lang = "FR"
                break;
            case 'es_ES':
            case 'es_LA':
                lang = "ES"
                break;
            case 'pt_BR':
            case 'pt_PT':
                lang = "PT"
                break;
            default:
                lang = "EN"
                break;
        }
        langSet = true;
        self.set('lang', lang)

        cb();
    }
    
    this.get = function( key )
    {
        if(key =="lang" && !langSet){
            doLang(function(){
                if ( m_local.hasOwnProperty( key ) < 0 ){
                    return null;
                }
                else{
                    return m_local[ key ];
                }   
            });
        }
        else{

            if ( m_local.hasOwnProperty( key ) < 0 ){
                return null;
            }
            else{
                return m_local[ key ];
            }

        }
    };
    
    this.set = function( key, value )
    {
        if(!langSet && key == 'lang'){
            langSet = true;
        }

        m_local[ key ] = value;
    };
};

var StorageManagerInstance = new StorageManager( engine.storage.local );

StorageManager.STORAGE_KEYS = 
{
    OMNITURE_UNIQUE_ID: "omnuid_v4",
    IPADDRESS: "IPADDRESS"
};
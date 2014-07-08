// TESTING
include( "js/app/com/dadc/lithium/util/StorageManager.js" );
var OmnitureConfig = function(){

	function getConfig(){
		var profile;
		var geo = StorageManagerInstance.get( 'geocode' );
		switch(geo){
			case 'US':
			case 'CA':
				profile = 'crackleprod'
				break;
			default:
				profile = 'crackleprodlatam'
				break;
		}

		return profile
	}
	return{
		getConfig:getConfig
	}
}()

// OmnitureConfig.CONFIG = {
//     // TEST
// 	OMNITURE_PROFILE: self.profile

//     // PRODUCTION
// //    OMNITURE_PROFILE: 'crackleprodlatam'  

//     //OMNITURE_PROFILE: 'crackleprodlatam'
// }
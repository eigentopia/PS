include( "js/app/com/dadc/lithium/config/LoggerConfig.js" );
var FreewheelConfig = function()
{
    var m_geoLocation = MRMLocation.Null;
    /**
     * get the Geo Location
     * @returns {MRMLocation}
     */
    this.getGeoLocation = function() { Logger.log("getGeoLocation: " + m_geoLocation.value);return m_geoLocation; };
    
    /**
     * set the MRMLocation
     * @param {MRMLocation} mrmLocation
     */
    this.setGeoLocation = function( mrmLocation )
    {
    	Logger.log("FreewheelConfig.setGeoLocation() - set to: " + mrmLocation.countryName);
    	if( typeof mrmLocation !== "undefined" )
    	    m_geoLocation = mrmLocation;
    	else Logger.log("FreewheelConfig.setGeoLocation(" + typeof mrmLocation + ") invalid arg");
    };

    /**
     * create the freewheel url
     * @param {number} media_id
     * @param {FreewheelMediaType} freewheelMediaType
     * @returns {String}
     */
    this.getFreeWheelURL = function( media_id, freewheelMediaType )
    {
    	// local func to create random url values
    	var rand = function randomBetweenRound(min,max)
    	{return Math.round(min+(Math.random()*(max - min)));};
	
    	// was the media type valid?
    	if( typeof freewheelMediaType === "undefined" )
    	{
    	    Logger.log("FreewheelConfig.getFreeWheelURL() - media type not argued, setting to default");
    	    freewheelMediaType = FreewheelMediaType.UNKNOWN;
    	}

	   Logger.log("getFreeWheelURL() - mediaType: " + freewheelMediaType + ", location: " + m_geoLocation.countryName);
	
    	// build the site section value
    	var csid = "crackle_ps_app_" + m_geoLocation.value;
    	csid += (m_geoLocation === MRMLocation.UnitedStates || m_geoLocation === MRMLocation.Null) ? "" : "_";
    	csid += freewheelMediaType;

	   Logger.log("getFreeWheelURL() | CSID: " + csid);

    	// build the url
    	var output =	    LoggerConfig.FREEWHEEL.FREEWHEEL_URL +
    	    "?nw=" +	    LoggerConfig.FREEWHEEL.FREEWHEEL_NETWORK_ID +
    	    "&prof=" +	    LoggerConfig.FREEWHEEL.FREEWHEEL_NETWORK_ID + "%3a" + LoggerConfig.FREEWHEEL.FREEWHEEL_PROFILE +
    	    "&asnw=" +	    LoggerConfig.FREEWHEEL.FREEWHEEL_NETWORK_ID +
    	    "&ssnw=" +	    LoggerConfig.FREEWHEEL.FREEWHEEL_NETWORK_ID +
    	    "&resp=" +	    "smrx" +
    	    "&csid=" +	    csid +
    	    "&caid=" +	    media_id +
    	    "&vprn=" +	    rand(0, 9999999999) +
    	    "&pvrn=" +	    rand(0, 9999999999) +
    	    "&flag=" +     "+vicb+qtcb+slcb+sltp;;";

	   Logger.log("FreewheelConfig.getFreeWheelURL() - url: " + output);

	   return output;
    };
};

// DAN: MRM site sections update
var FreewheelMediaType =
{
    MOVIE:	 "movies",
    SHOW:	 "shows",
    UNKNOWN:	 "home"	    // should not be used - will be used for null-pattern default
};

// DAN: MRM site sections update
var MRMLocation =
{
    Null:		        {countryName: "",		        countryCode: "",	value: ""},
    UnitedStates:       {countryName: "United States",	countryCode: "US",	value: ""},
    Canada:             {countryName: "Canada",		    countryCode: "CA",	value: "ca"},
    Australia:		    {countryName: "Australia",	    countryCode: "AU",	value: "au"},
    UnitedKindom:	    {countryName: "United Kingdom",	countryCode: "UK",	value: "uk"},
    Brazil:		        {countryName: "Brazil",		    countryCode: "BR",	value: "br"},
    Mexico:		        {countryName: "Mexico",		    countryCode: "MX",	value: "mx"},
    Argentina:		    {countryName: "Argentina",	    countryCode: "AR",	value: "ar"},
    Chile:		        {countryName: "Chile",		    countryCode: "CL",	value: "cl"},
    Columbia:		    {countryName: "Columbia",	    countryCode: "CO",	value: "co"},
    DominicanRepublic:	{countryName: "Dominican Republic", countryCode: "DO",	value: "do"},
    Peru:		        {countryName: "Peru",		    countryCode: "PE",	value: "pe"},
    Venezuela:		    {countryName: "Venezuela",	    countryCode: "VE",	value: "ve"},
    Bolivia:		    {countryName: "Bolivia",	    countryCode: "BO",	value: "bo"},
    CostaRica:		    {countryName: "Costa Rica",	    countryCode: "CR",	value: "cr"},
    Ecuador:		    {countryName: "Ecuador",	    countryCode: "EC",	value: "ec"},
    ElSalvador:		    {countryName: "El Salvador",	countryCode: "SV",	value: "sv"},
    Guatemala:		    {countryName: "Guatemala",	    countryCode: "GT",	value: "gt"},
    Honduras:		    {countryName: "Honduras",	    countryCode: "HN",	value: "hn"},
    Nicaragua:		    {countryName: "Nicaragua",	    countryCode: "NI",	value: "ni"},
    Panama:		        {countryName: "Panama",		    countryCode: "PA",	value: "pa"},
    Paraguay:		    {countryName: "Paraguay",	    countryCode: "PY",	value: "py"},
    Uruguay:		    {countryName: "Uruguay",	    countryCode: "UY",	value: "uy"},

    getLocation:	function( countryCode )
    {
    	switch( countryCode )
    	{
    	    case "US": return MRMLocation.UnitedStates; break;
    	    case "CA": return MRMLocation.Canada; break;
    	    case "AU": return MRMLocation.Australia; break;
    	    case "UK": return MRMLocation.UnitedKindom; break;
    	    case "BR": return MRMLocation.Brazil; break;
    	    case "MX": return MRMLocation.Mexico; break;
    	    case "AR": return MRMLocation.Argentina; break;
    	    case "CL": return MRMLocation.Chile; break;
    	    case "CO": return MRMLocation.Columbia; break;
    	    case "DO": return MRMLocation.DominicanRepublic; break;
    	    case "PE": return MRMLocation.Peru; break;
    	    case "VE": return MRMLocation.Venezuela; break;
    	    case "BO": return MRMLocation.Bolivia; break;
    	    case "CR": return MRMLocation.CostaRica; break;
    	    case "EC": return MRMLocation.Ecuador; break;
    	    case "SV": return MRMLocation.ElSalvador; break;
    	    case "GT": return MRMLocation.Guatemala; break;
    	    case "HN": return MRMLocation.Honduras; break;
    	    case "NI": return MRMLocation.Nicaragua; break;
    	    case "PA": return MRMLocation.Panama; break;
    	    case "PY": return MRMLocation.Paraguay; break;
    	    case "UY": return MRMLocation.Uruguay; break;
    	    default: return MRMLocation.Null; break;
    	}
    }
};

FreewheelConfig = new FreewheelConfig();
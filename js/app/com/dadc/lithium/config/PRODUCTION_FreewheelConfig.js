
// UPDATES TO FREEWHEEL URL: THESE ARE THE EXAMPLES CRACKLE SENT US
//
//Here is the correct Freewheel call to use for the PS3 app.
//
//LIVE:
//http://2517d.v.fwmrm.net/ad/g/1?nw=151933&prof=151933:crackle_ps3_live&asnw=151933&ssnw=151933&resp=smrx&csid=[INSERT_SITE_SECTION]&caid=[INSERT_ASSET_ID]&vprn=[RANDOM_NUMBER]&pvrn=[RANDOM_NUMBER]&flag=+exvt+qtcb+slcb+sltp;;
//
//TEST:
//http://23adc.v.fwmrm.net/ad/g/1?nw=146140&prof=146140:crackle_ps3_test&asnw=146140&ssnw=146140&resp=smrx&csid=[INSERT_SITE_SECTION]&caid=[INSERT_ASSET_ID]&vprn=[RANDOM_NUMBER]&pvrn=[RANDOM_NUMBER]&flag=+exvt+qtcb+slcb+sltp;;
//



// Production
var FreewheelConfig = function()
{
    Logger.log("FreewheelConfig - created");

    var m_geoLocation = MRMLocation.Null;
    this.getGeoLocation = function() { Logger.log("getGeoLocation: " + m_geoLocation.value);return m_geoLocation; }
    this.setGeoLocation = function( mrmLocation )
    {
	Logger.log("FreewheelConfig.setGeoLocation() - set to: " + mrmLocation.countryName);
	if( mrmLocation )
	    m_geoLocation = mrmLocation;
    }

    this.getFreeWheelURL = function( media_id, freewheelMediaType )
    {
	var rand = function randomBetweenRound(min,max)
	{return Math.round(min+(Math.random()*(max - min)));}

	Logger.log("getFreeWheelURL() - mediaType: " + freewheelMediaType + ", location: " + m_geoLocation.countryName);

	var csid = "crackle_ps_app_" + m_geoLocation.value;
	csid += (m_geoLocation == MRMLocation.UnitedStates || m_geoLocation == MRMLocation.Null) ? "" : "_";
	csid += freewheelMediaType;

	Logger.log("CSID: " + csid);

	// OLD
//	var output =	    this.CONFIG.FREEWHEEL_URL +
//	    "?prof=" +	    this.CONFIG.FREEWHEEL_NETWORK_ID +
//	    "%3a" +	    this.CONFIG.FREEWHEEL_PROFILE +
//	    "&nw=" +	    this.CONFIG.FREEWHEEL_NETWORK_ID +
//	    "&caid=" +	    media_id +
//	    "&asnw=" +	    this.CONFIG.FREEWHEEL_NETWORK_ID +
//	    "&csid=" +	    csid +
//	    "&ssnw=" +	    this.CONFIG.FREEWHEEL_NETWORK_ID +
//	    "&resp=smrx&flag=+sltp+emcr+vicb;;";

	// DAN: updated Freewheel URL as per client's example (see top of file)
	var output =	    this.CONFIG.FREEWHEEL_URL +
	    "?nw=" +	    this.CONFIG.FREEWHEEL_NETWORK_ID +
	    "&prof=" +	    this.CONFIG.FREEWHEEL_NETWORK_ID + "%3a" + this.CONFIG.FREEWHEEL_PROFILE +
	    "&asnw=" +	    this.CONFIG.FREEWHEEL_NETWORK_ID +
	    "&ssnw=" +	    this.CONFIG.FREEWHEEL_NETWORK_ID +
	    "&resp=" +	    "smrx" +
	    "&csid=" +	    csid +
	    "&caid=" +	    media_id +
	    "&vprn=" +	    rand(0, 9999999999) +
	    "&pvrn=" +	    rand(0, 9999999999) +
	    "&flag=" +	    "+exvt+qtcb+slcb+sltp;;";

	Logger.log("FreewheelConfig.getFreeWheelURL() - url: " + output);

	return output;
    }

    this.CONFIG =
    {
	FREEWHEEL_URL: "http://2517d.v.fwmrm.net/ad/g/1",
	FREEWHEEL_NETWORK_ID: 151933,
	FREEWHEEL_PROFILE: "crackle_"+ApplicationController.PLATFORM+"_live"
    };
}

// DAN: MRM site sections update
var FreewheelMediaType =
{
    MOVIE:	 "movies",
    SHOW:	 "shows",
    UNKNOWN:	 "home"	    // should not be used
}

// DAN: MRM site sections update
var MRMLocation =
{
    Null:		{countryName: "",		    countryCode: "",	value: ""},
    UnitedStates:	{countryName: "United States",	    countryCode: "US",	value: ""},
    Canada:		{countryName: "Canada",		    countryCode: "CA",	value: "ca"},
    Australia:		{countryName: "Australia",	    countryCode: "AU",	value: "au"},
    UnitedKindom:	{countryName: "United Kingdom",	    countryCode: "UK",	value: "uk"},
    Brazil:		{countryName: "Brazil",		    countryCode: "BR",	value: "br"},
    Mexico:		{countryName: "Mexico",		    countryCode: "MX",	value: "mx"},
    Argentina:		{countryName: "Argentina",	    countryCode: "AR",	value: "ar"},
    Chile:		{countryName: "Chile",		    countryCode: "CL",	value: "cl"},
    Columbia:		{countryName: "Columbia",	    countryCode: "CO",	value: "co"},
    DominicanRepublic:	{countryName: "Dominican Republic", countryCode: "DO",	value: "do"},
    Peru:		{countryName: "Peru",		    countryCode: "PE",	value: "pe"},
    Venezuela:		{countryName: "Venezuela",	    countryCode: "VE",	value: "ve"},
    Bolivia:		{countryName: "Bolivia",	    countryCode: "BO",	value: "bo"},
    CostaRica:		{countryName: "Costa Rica",	    countryCode: "CR",	value: "cr"},
    Ecuador:		{countryName: "Ecuador",	    countryCode: "EC",	value: "ec"},
    ElSalvador:		{countryName: "El Salvador",	    countryCode: "SV",	value: "sv"},
    Guatemala:		{countryName: "Guatemala",	    countryCode: "GT",	value: "gt"},
    Honduras:		{countryName: "Honduras",	    countryCode: "HN",	value: "hn"},
    Nicaragua:		{countryName: "Nicaragua",	    countryCode: "NI",	value: "ni"},
    Panama:		{countryName: "Panama",		    countryCode: "PA",	value: "pa"},
    Paraguay:		{countryName: "Paraguay",	    countryCode: "PY",	value: "py"},
    Uruguay:		{countryName: "Uruguay",	    countryCode: "UY",	value: "uy"},
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
}

FreewheelConfig = new FreewheelConfig();
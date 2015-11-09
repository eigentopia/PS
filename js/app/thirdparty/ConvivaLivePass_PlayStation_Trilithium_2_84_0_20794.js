var loadConviva=typeof ConvivaPrivateLoader==='undefined';
if(loadConviva){
var ConvivaPrivateLoader=(typeof ConvivaPrivateLoader!=='undefined')?ConvivaPrivateLoader:(function(){});
(function(){












function registerName(cls,clsname){
if(typeof(ConvivaPrivateModule)!="undefined"){
ConvivaPrivateModule[clsname]=cls;
}else if(typeof(ConvivaPrivateTestingModule)!="undefined"){
ConvivaPrivateTestingModule[clsname]=cls;
}else{

ConvivaPrivateLoader[clsname]=cls;
}
}
registerName(registerName,"registerName");


function __id(x){return x;}
registerName(__id,"__id");



function getConvivaType(className){
if(typeof(ConvivaPrivateModule)!="undefined"&&ConvivaPrivateModule.hasOwnProperty(className)){
return ConvivaPrivateModule[className];
}else if(typeof(ConvivaPrivateTestingModule)!="undefined"&&ConvivaPrivateTestingModule.hasOwnProperty(className)){
return ConvivaPrivateTestingModule[className];
}else if(ConvivaPrivateLoader.hasOwnProperty(className)){
return ConvivaPrivateLoader[className];
}else{
return null;
}
}
registerName(getConvivaType,"getConvivaType");




function importConvivaPrivateProgram(fromWhere,fromWhereName){
var res="";
var p;
for(p in fromWhere){
if(fromWhere.hasOwnProperty(p)){
res+="var "+p+"="+__id(fromWhereName)+"."+p+";"
}
}
return res;
}
registerName(importConvivaPrivateProgram,"importConvivaPrivateProgram");


function STAT_INIT(){
return "STAT_INIT";
}
registerName(STAT_INIT,"STAT_INIT");


function statInit(cls,clsname){
cls.call(STAT_INIT);
registerName(cls,clsname);
}
registerName(statInit,"statInit");


function defPubMeth(obj,name,m){
if(obj!=STAT_INIT){
if(obj[name]==undefined){
obj[name]=m;
}else{

obj["super_"+name]=m;
}
}
}
registerName(defPubMeth,"defPubMeth");


function defPrivMeth(obj,name,m){
if(obj!=STAT_INIT)obj[name]=m;
}
registerName(defPrivMeth,"defPrivMeth");


function defStatMeth(obj,cls,name,m){
if(obj==STAT_INIT)cls[name]=m;
}
registerName(defStatMeth,"defStatMeth");


function defGet(obj,name,m){
if(obj!=STAT_INIT){
if(typeof(Object.defineProperty)!='undefined'){
Object.defineProperty(obj,name,{
configurable:true,
enumerable:true,
get:m
});
}else{
obj.__defineGetter__(name,m);
}
}
}
registerName(defGet,"defGet");

function defSet(obj,name,m){
if(obj!=STAT_INIT){
if(typeof(Object.defineProperty)!='undefined'){
Object.defineProperty(obj,name,{
configurable:true,
set:m
});
}else{
obj.__defineSetter__(name,m);
}
}
}
registerName(defSet,"defSet");

function defStatGet(obj,cls,name,m){
if(obj==STAT_INIT)defGet(cls,name,m);
}
registerName(defStatGet,"defStatGet");

function defStatSet(obj,cls,name,m){
if(obj==STAT_INIT)defSet(cls,name,m);
}
registerName(defStatSet,"defStatSet");

function slIsArray(inObj){

if(inObj.constructor==Array){
return true;
}else if(typeof(inObj.length)=='undefined'){
return false;
}else{
return true;
}
}
registerName(slIsArray,"slIsArray");

function slForEachPropValue(a,f){
var ist=slIsArray(a);
if(slIsArray(a)){
for(var i=0;i<a.length;i++){
f(a[i]);
}
}else{
for(var p in a){
if(a.hasOwnProperty(p))f(a[p]);
}
}
}
registerName(slForEachPropValue,"slForEachPropValue");

function slForEachProp(a,f){
if(slIsArray(a)){
for(var i=0;i<a.length;i++){
f(i);
}
}else{
for(var p in a){
if(a.hasOwnProperty(p))f(p);
}
}
}
registerName(slForEachProp,"slForEachProp");



function declTestClass(obj,name,cls,meta){
if(obj==STAT_INIT)jstest.DeclareTestClass(name,cls,meta);
}
registerName(declTestClass,"declTestClass");





function declTestMethod(obj,clsname,mname,mcode,meta){
if(obj==STAT_INIT){
jstest.DeclareTestMethod(clsname,mname,meta);
}else{
jstest.SetTestMethodClosure(clsname,mname,mcode);
}
}
registerName(declTestMethod,"declTestMethod");


function sluint(){
sluint.two32=0x100000000;

sluint.Cast=function(v){
var vi=parseInt(v);
if(vi>sluint.MaxValue){
vi=vi%sluint.two32;
}else if(vi<0){
vi=(-vi)%sluint.two32;
vi=sluint.two32-vi;
}
return vi;
};

sluint.uintRegex=new RegExp("^[0-9]+$");
sluint.Parse=function(v){
Lang.parseChecker(v,sluint.uintRegex);
return sluint.Cast(v);
}

sluint.MaxValue=sluint.two32-1;
sluint.MinValue=0;
}
statInit(sluint,"sluint");


function slint(){
slint.Cast=function(v){

var vu=sluint.Cast(v);
if(vu>slint.MaxValue){
vu=vu-sluint.two32;
}
return vu;
};

slint.intRegex=new RegExp("^[+-]?[0-9]+$");
slint.Parse=function(v){
Lang.parseChecker(v,slint.intRegex);
return slint.Cast(v);
}

slint.MaxValue=0x7FFFFFFF;
slint.MinValue=-0x80000000;
}
statInit(slint,"slint");

function Int64(){
var _s=this;

if(_s==STAT_INIT)Int64.TWO_TO_32=4294967296.0;










function __constr(){
_s._l=0;
_s._h=0;
};


defStatMeth(_s,Int64,"fromUnsignedInt",__fromUnsignedInt);
function __fromUnsignedInt(i){
var res=new Int64();
res._h=0;
res._l=i;
return res;
};


defStatMeth(_s,Int64,"fromInt",__fromInt);
function __fromInt(i){
var res=new Int64();
if(i>=0){
res._h=0;
res._l=sluint.Cast(i);
}else{
res._h=-1;
res._l=sluint.Cast(i);
}
return res;
};


defStatMeth(_s,Int64,"fromNumber",__fromNumber);
function __fromNumber(n){
var l1=n%Int64.TWO_TO_32;

if(l1<0){
l1=Number(sluint.MaxValue)+1.0+l1;
}
var res=new Int64();
res._l=sluint.Cast(l1+0.5);
res._h=slint.Cast((n-l1)/Int64.TWO_TO_32);

return res;
};



defGet(_s,"asNumber",__asNumber);
function __asNumber(){
return Number(_s._h)*Int64.TWO_TO_32+Number(_s._l);
};


if(_s!=STAT_INIT){
this.toString=function(){
return _s.asNumber.toString();
}
}

if(_s!=STAT_INIT)__constr.apply(this,arguments);

};
statInit(Int64,"Int64");


function UInt64(){

var _s=this;

function __constr(){

Int64.call(_s);
_s._l=0;
_s._h=0;
}


defStatMeth(_s,UInt64,"fromUnsignedInt",__fromUnsignedInt);
function __fromUnsignedInt(i){
var res=new UInt64();
res._h=0;
res._l=i;
return res;
};


defStatMeth(_s,UInt64,"fromNumber",__fromNumber);
function __fromNumber(n){
var res=new UInt64();
res._h=Math.floor(n/Int64.TWO_TO_32);
res._l=n%Int64.TWO_TO_32;
return res;
};


if(_s!=STAT_INIT)__constr.apply(arguments);
};
statInit(UInt64,"UInt64");















function CandidateStream(){
var _s=this;








function _constr(id,bitrate,resource){
_s.id=id;
_s.bitrate=bitrate;
_s.resource=resource;
}




defPubMeth(_s,"Cleanup",__Cleanup);defPubMeth(_s,"Cleanup",__Cleanup);
function __Cleanup(){
_s.id=null;
_s.bitrate=0;
_s.resource=null;
}







if(_s!=STAT_INIT)_s.__auto_id=undefined;
defGet(_s,"id",__get_id);defGet(_s,"id",__get_id);
function __get_id(){return _s.__auto_id;}
defSet(_s,"id",__set_id);defSet(_s,"id",__set_id);
function __set_id(value){_s.__auto_id=value;}








if(_s!=STAT_INIT)_s.__auto_bitrate=undefined;
defGet(_s,"bitrate",__get_bitrate);defGet(_s,"bitrate",__get_bitrate);
function __get_bitrate(){return _s.__auto_bitrate;}
defSet(_s,"bitrate",__set_bitrate);defSet(_s,"bitrate",__set_bitrate);
function __set_bitrate(value){_s.__auto_bitrate=value;}








if(_s!=STAT_INIT)_s.__auto_resource=undefined;
defGet(_s,"resource",__get_resource);defGet(_s,"resource",__get_resource);
function __get_resource(){return _s.__auto_resource;}
defSet(_s,"resource",__set_resource);defSet(_s,"resource",__set_resource);
function __set_resource(value){_s.__auto_resource=value;}
















defPubMeth(_s,"CheckValidity",__CheckValidity);defPubMeth(_s,"CheckValidity",__CheckValidity);
function __CheckValidity(){

if(_s.id!=null&&!((typeof _s.id==="string"))){
return "CandidateStream.id is not a string";
}else if(_s.bitrate!=null&&!((typeof _s.bitrate==="number"))){
return "CandidateStream.bitrate is not an int";
}else if(_s.resource!=null&&!((typeof _s.resource==="string"))){
return "CandidateStream.resource is not a string";
}
return null;
}





defStatMeth(_s,CandidateStream,"ConstructClone",__ConstructClone);defStatMeth(_s,CandidateStream,"ConstructClone",__ConstructClone);
function __ConstructClone(fromObj){
if(fromObj==null)return null;
var res=new CandidateStream("",-1,null);
res.id=NativeLang.GetStringField("id",fromObj);
res.bitrate=slint.Cast(NativeLang.GetField("bitrate",fromObj));
res.resource=NativeLang.GetStringField("resource",fromObj);
return res;
}

if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(CandidateStream,"CandidateStream");


















function ConvivaContentInfo(){
var _s=this;




















if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_AKAMAI="AKAMAI";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_AMAZON="AMAZON";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_ATT="ATT";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_BITGRAVITY="BITGRAVITY";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_BT="BT";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_CDNETWORKS="CDNETWORKS";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_CHINACACHE="CHINACACHE";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_EDGECAST="EDGECAST";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_HIGHWINDS="HIGHWINDS";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_INTERNAP="INTERNAP";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_LEVEL3="LEVEL3";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_LIMELIGHT="LIMELIGHT";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_OCTOSHAPE="OCTOSHAPE";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_SWARMCAST="SWARMCAST";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_VELOCIX="VELOCIX";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_TELEFONICA="TELEFONICA";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_MICROSOFT="MICROSOFT";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_CDNVIDEO="CDNVIDEO";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_QBRICK="QBRICK";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_NGENIX="NGENIX";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_IPONLY="IPONLY";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_TALKTALK="TALKTALK";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_INHOUSE="INHOUSE";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_COMCAST="COMCAST";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_NICE="NICE";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_TELENOR="TELENOR";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_FASTLY="FASTLY";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_TELIA="TELIA";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_CHINANETCENTER="CHINANETCENTER";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_MIRRORIMAGE="MIRRORIMAGE";




if(_s==STAT_INIT)ConvivaContentInfo.CDN_NAME_OTHER="OTHER";




if(_s==STAT_INIT)ConvivaContentInfo.FRAMEWORK_NAME_BRIGHTCOVE="Brightcove";




if(_s==STAT_INIT)ConvivaContentInfo.FRAMEWORK_NAME_KALTURA="Kaltura";




if(_s==STAT_INIT)ConvivaContentInfo.FRAMEWORK_NAME_OOYALA="Ooyala";




if(_s==STAT_INIT)ConvivaContentInfo.FRAMEWORK_NAME_OSMF="OSMF";




if(_s==STAT_INIT)ConvivaContentInfo.FRAMEWORK_NAME_THE_DEVICE_TYPE="thePlatform";




if(_s==STAT_INIT)ConvivaContentInfo.DEVICE_TYPE_CONSOLE="Console";




if(_s==STAT_INIT)ConvivaContentInfo.DEVICE_TYPE_MOBILE="Mobile";




if(_s==STAT_INIT)ConvivaContentInfo.DEVICE_TYPE_PC="PC";




if(_s==STAT_INIT)ConvivaContentInfo.DEVICE_TYPE_SET_TOP_BOX="Settop";




if(_s==STAT_INIT)ConvivaContentInfo.PLUGIN_NAME_KALTURA="ConvivaKalturaPlugin";





if(_s==STAT_INIT)ConvivaContentInfo.NO_RESOURCE="no_resource";













if(_s!=STAT_INIT)_s.assetName=undefined;


if(_s!=STAT_INIT)_s._tags=null;





defGet(_s,"tags",__get_tags);defGet(_s,"tags",__get_tags);
function __get_tags(){return Lang.StringDictionaryToRepr(_s._tags);}
defSet(_s,"tags",__set_tags);defSet(_s,"tags",__set_tags);
function __set_tags(value){_s._tags=Lang.DictionaryFromRepr(value);}







if(_s!=STAT_INIT)_s.defaultReportingBitrateKbps=-1;













if(_s!=STAT_INIT)_s.defaultReportingCdnName=ConvivaContentInfo.CDN_NAME_OTHER;







if(_s!=STAT_INIT)_s.defaultReportingResource=null;
















if(_s!=STAT_INIT)_s.frameworkName=null;









if(_s!=STAT_INIT)_s.frameworkVersion=null;











if(_s!=STAT_INIT)_s.pluginName=null;










if(_s!=STAT_INIT)_s.pluginVersion=null;






if(_s!=STAT_INIT)_s.viewerId=null;










if(_s!=STAT_INIT)_s.deviceId=null;











if(_s!=STAT_INIT)_s.deviceType=null;







if(_s!=STAT_INIT)_s.playerName=null;







if(_s!=STAT_INIT)_s.streamUrl=null;

if(_s!=STAT_INIT)_s._isLive=false;




defGet(_s,"isLive",__get_isLive);defGet(_s,"isLive",__get_isLive);
function __get_isLive(){return _s._isLive;}
defSet(_s,"isLive",__set_isLive);defSet(_s,"isLive",__set_isLive);
function __set_isLive(value){
if(value==="true"){value=true;}
if(value==="false"){value=false;}
if(value!==true&&value!==false){
var utils=Utils.getInstance();
utils.err("Invalid value for ConvivaContentInfo.isLive, expected boolean. Defaulting to false.");
value=false;
}
_s._isLive=value;
}












function _constr(assetName,tags){
_s.assetName=assetName;
_s.tags=tags;
if(_s._tags==null){
_s._tags=new DictionaryCS();
}

}


defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_AKAMAI",ConvivaContentInfo.CDN_NAME_AKAMAI);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_AMAZON",ConvivaContentInfo.CDN_NAME_AMAZON);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_ATT",ConvivaContentInfo.CDN_NAME_ATT);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_BITGRAVITY",ConvivaContentInfo.CDN_NAME_BITGRAVITY);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_BT",ConvivaContentInfo.CDN_NAME_BT);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_CDNETWORKS",ConvivaContentInfo.CDN_NAME_CDNETWORKS);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_CDNVIDEO",ConvivaContentInfo.CDN_NAME_CDNVIDEO);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_CHINACACHE",ConvivaContentInfo.CDN_NAME_CHINACACHE);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_CHINANETCENTER",ConvivaContentInfo.CDN_NAME_CHINANETCENTER);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_COMCAST",ConvivaContentInfo.CDN_NAME_COMCAST);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_EDGECAST",ConvivaContentInfo.CDN_NAME_EDGECAST);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_FASTLY",ConvivaContentInfo.CDN_NAME_FASTLY);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_HIGHWINDS",ConvivaContentInfo.CDN_NAME_HIGHWINDS);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_INHOUSE",ConvivaContentInfo.CDN_NAME_INHOUSE);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_INTERNAP",ConvivaContentInfo.CDN_NAME_INTERNAP);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_IPONLY",ConvivaContentInfo.CDN_NAME_IPONLY);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_LEVEL3",ConvivaContentInfo.CDN_NAME_LEVEL3);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_LIMELIGHT",ConvivaContentInfo.CDN_NAME_LIMELIGHT);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_MICROSOFT",ConvivaContentInfo.CDN_NAME_MICROSOFT);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_MIRRORIMAGE",ConvivaContentInfo.CDN_NAME_MIRRORIMAGE);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_NGENIX",ConvivaContentInfo.CDN_NAME_NGENIX);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_NICE",ConvivaContentInfo.CDN_NAME_NICE);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_OCTOSHAPE",ConvivaContentInfo.CDN_NAME_OCTOSHAPE);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_OTHER",ConvivaContentInfo.CDN_NAME_OTHER);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_QBRICK",ConvivaContentInfo.CDN_NAME_QBRICK);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_SWARMCAST",ConvivaContentInfo.CDN_NAME_SWARMCAST);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_TALKTALK",ConvivaContentInfo.CDN_NAME_TALKTALK);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_TELEFONICA",ConvivaContentInfo.CDN_NAME_TELEFONICA);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_TELENOR",ConvivaContentInfo.CDN_NAME_TELENOR);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_TELIA",ConvivaContentInfo.CDN_NAME_TELIA);
defStatMeth(_s,ConvivaContentInfo,"CDN_NAME_VELOCIX",ConvivaContentInfo.CDN_NAME_VELOCIX);
defStatMeth(_s,ConvivaContentInfo,"DEVICE_TYPE_CONSOLE",ConvivaContentInfo.DEVICE_TYPE_CONSOLE);
defStatMeth(_s,ConvivaContentInfo,"DEVICE_TYPE_MOBILE",ConvivaContentInfo.DEVICE_TYPE_MOBILE);
defStatMeth(_s,ConvivaContentInfo,"DEVICE_TYPE_PC",ConvivaContentInfo.DEVICE_TYPE_PC);
defStatMeth(_s,ConvivaContentInfo,"DEVICE_TYPE_SET_TOP_BOX",ConvivaContentInfo.DEVICE_TYPE_SET_TOP_BOX);
defStatMeth(_s,ConvivaContentInfo,"FRAMEWORK_NAME_BRIGHTCOVE",ConvivaContentInfo.FRAMEWORK_NAME_BRIGHTCOVE);
defStatMeth(_s,ConvivaContentInfo,"FRAMEWORK_NAME_KALTURA",ConvivaContentInfo.FRAMEWORK_NAME_KALTURA);
defStatMeth(_s,ConvivaContentInfo,"FRAMEWORK_NAME_OOYALA",ConvivaContentInfo.FRAMEWORK_NAME_OOYALA);
defStatMeth(_s,ConvivaContentInfo,"FRAMEWORK_NAME_OSMF",ConvivaContentInfo.FRAMEWORK_NAME_OSMF);
defStatMeth(_s,ConvivaContentInfo,"FRAMEWORK_NAME_THE_DEVICE_TYPE",ConvivaContentInfo.FRAMEWORK_NAME_THE_DEVICE_TYPE);
defStatMeth(_s,ConvivaContentInfo,"NO_RESOURCE",ConvivaContentInfo.NO_RESOURCE);
defStatMeth(_s,ConvivaContentInfo,"PLUGIN_NAME_KALTURA",ConvivaContentInfo.PLUGIN_NAME_KALTURA);
if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(ConvivaContentInfo,"ConvivaContentInfo");














































































function ConvivaStreamerProxy(){
var _s=this;

if(_s!=STAT_INIT)_s._notifiers=new ListCS();


if(_s!=STAT_INIT)_s._stream=new StreamInfo(-1,ConvivaContentInfo.CDN_NAME_OTHER,ConvivaContentInfo.NO_RESOURCE,-1,-1,-1);
if(_s!=STAT_INIT)_s._playingState=ConvivaStreamerProxy.UNKNOWN;


if(_s!=STAT_INIT)_s._lastMetadata=null;


if(_s!=STAT_INIT)_s._lastError=null;

if(_s!=STAT_INIT)_s._pendingErrors=new ListCS();



if(_s!=STAT_INIT)_s._displayWidth=-1;


if(_s!=STAT_INIT)_s._displayHeight=-1;


if(_s!=STAT_INIT)_s._availableStreams=null;

if(_s!=STAT_INIT)_s._currentLoadingStatus=null;

if(_s!=STAT_INIT)_s.isProxyInitialized=undefined;






if(_s==STAT_INIT)ConvivaStreamerProxy.REASON_PLAYINGSTATECHANGE="PlayingStateChange";






if(_s==STAT_INIT)ConvivaStreamerProxy.REASON_STREAMINFOCHANGE="StreamInfoChange";





if(_s==STAT_INIT)ConvivaStreamerProxy.REASON_AVAILABLESTREAMINFOCHANGE="AvailableStreamInfoChange";






if(_s==STAT_INIT)ConvivaStreamerProxy.REASON_PROXYINITIALIZED="ProxyInitialized";





if(_s==STAT_INIT)ConvivaStreamerProxy.REASON_METADATACHANGE="MetadataChange";






if(_s==STAT_INIT)ConvivaStreamerProxy.REASON_LOADINGSTATUSCHANGE="LoadingStatusChange";





if(_s==STAT_INIT)ConvivaStreamerProxy.REASON_DOWNLOADSTATECHANGE="DownloadStateChange";






if(_s==STAT_INIT)ConvivaStreamerProxy.REASON_DISPLAYSIZECHANGE="DisplaySizeChange";





if(_s==STAT_INIT)ConvivaStreamerProxy.REASON_ERRORCHANGE="ErrorChange";





if(_s==STAT_INIT)ConvivaStreamerProxy.REASON_LOG="Log";




if(_s==STAT_INIT)ConvivaStreamerProxy.STOPPED="STOPPED";


if(_s==STAT_INIT)ConvivaStreamerProxy.PLAYING="PLAYING";



if(_s==STAT_INIT)ConvivaStreamerProxy.BUFFERING="BUFFERING";


if(_s==STAT_INIT)ConvivaStreamerProxy.PAUSED="PAUSED";




if(_s==STAT_INIT)ConvivaStreamerProxy.NOT_MONITORED="NOT_MONITORED";


if(_s==STAT_INIT)ConvivaStreamerProxy.ERROR="ERROR";


if(_s==STAT_INIT)ConvivaStreamerProxy.UNKNOWN="UNKNOWN";





if(_s==STAT_INIT)ConvivaStreamerProxy.DOWNLOADSTATE_ACTIVE=1;





if(_s==STAT_INIT)ConvivaStreamerProxy.DOWNLOADSTATE_INACTIVE=0;







if(_s==STAT_INIT)ConvivaStreamerProxy.METADATA_DURATION="duration";

if(_s==STAT_INIT)ConvivaStreamerProxy.METADATA_ENCODED_FRAMERATE="framerate";











if(_s==STAT_INIT)ConvivaStreamerProxy.BOOLEAN_TRUE=1;
if(_s==STAT_INIT)ConvivaStreamerProxy.BOOLEAN_FALSE=-1;
if(_s==STAT_INIT)ConvivaStreamerProxy.BOOLEAN_UNAVAILABLE=0;





if(_s==STAT_INIT)ConvivaStreamerProxy.CAPABILITY_VIDEO=1;
if(_s==STAT_INIT)ConvivaStreamerProxy.CAPABILITY_QUALITY_METRICS=2;
if(_s==STAT_INIT)ConvivaStreamerProxy.CAPABILITY_BITRATE_METRICS=4;


if(_s==STAT_INIT)ConvivaStreamerProxy.CAPABILITY_BITRATE_SWITCHING=8;
if(_s==STAT_INIT)ConvivaStreamerProxy.CAPABILITY_CDN_SWITCHING=16;


if(_s==STAT_INIT)ConvivaStreamerProxy.CAPABILITY_SOURCE_HTTP=32;
if(_s==STAT_INIT)ConvivaStreamerProxy.CAPABILITY_SOURCE_CHUNKED=64;
if(_s==STAT_INIT)ConvivaStreamerProxy.CAPABILITY_SOURCE_STREAMING=128;

function _constr(){





}




defPubMeth(_s,"Cleanup",__Cleanup);defPubMeth(_s,"Cleanup",__Cleanup);
function __Cleanup(){
if(_s._notifiers!=null){
_s._notifiers.Clear();
}
}






defPubMeth(_s,"GetCapabilities",__GetCapabilities);defPubMeth(_s,"GetCapabilities",__GetCapabilities);
function __GetCapabilities(){
return 0;
}









defPubMeth(_s,"GetPlayheadTimeMs",__GetPlayheadTimeMs);defPubMeth(_s,"GetPlayheadTimeMs",__GetPlayheadTimeMs);
function __GetPlayheadTimeMs(){
return-1;
}








defPubMeth(_s,"GetIsPHTAccurate",__GetIsPHTAccurate);defPubMeth(_s,"GetIsPHTAccurate",__GetIsPHTAccurate);
function __GetIsPHTAccurate(){
return true;
}










defPubMeth(_s,"GetBufferLengthMs",__GetBufferLengthMs);defPubMeth(_s,"GetBufferLengthMs",__GetBufferLengthMs);
function __GetBufferLengthMs(){
return-1;
}










defPubMeth(_s,"GetVideoBufferLengthMs",__GetVideoBufferLengthMs);defPubMeth(_s,"GetVideoBufferLengthMs",__GetVideoBufferLengthMs);
function __GetVideoBufferLengthMs(){
return-1;
}










defPubMeth(_s,"GetAudioBufferLengthMs",__GetAudioBufferLengthMs);defPubMeth(_s,"GetAudioBufferLengthMs",__GetAudioBufferLengthMs);
function __GetAudioBufferLengthMs(){
return-1;
}

















defPubMeth(_s,"GetStartingBufferLengthMs",__GetStartingBufferLengthMs);defPubMeth(_s,"GetStartingBufferLengthMs",__GetStartingBufferLengthMs);
function __GetStartingBufferLengthMs(){
return-1;
}








defPubMeth(_s,"SetStartingBufferLengthMs",__SetStartingBufferLengthMs);defPubMeth(_s,"SetStartingBufferLengthMs",__SetStartingBufferLengthMs);
function __SetStartingBufferLengthMs(ms){

}







defPubMeth(_s,"GetIsStartingBufferFull",__GetIsStartingBufferFull);defPubMeth(_s,"GetIsStartingBufferFull",__GetIsStartingBufferFull);
function __GetIsStartingBufferFull(){
return false;
}











defPubMeth(_s,"GetRenderedFrameRate",__GetRenderedFrameRate);defPubMeth(_s,"GetRenderedFrameRate",__GetRenderedFrameRate);
function __GetRenderedFrameRate(){
return-1.0;
}








defPubMeth(_s,"GetSourceFrameRate",__GetSourceFrameRate);defPubMeth(_s,"GetSourceFrameRate",__GetSourceFrameRate);
function __GetSourceFrameRate(){
return-1.0;
}








defPubMeth(_s,"GetDroppedFrames",__GetDroppedFrames);defPubMeth(_s,"GetDroppedFrames",__GetDroppedFrames);
function __GetDroppedFrames(){
return-1;
}






defPubMeth(_s,"GetCpuPercent",__GetCpuPercent);defPubMeth(_s,"GetCpuPercent",__GetCpuPercent);
function __GetCpuPercent(){
return-1.0;
}






defPubMeth(_s,"GetMemoryAvailable",__GetMemoryAvailable);defPubMeth(_s,"GetMemoryAvailable",__GetMemoryAvailable);
function __GetMemoryAvailable(){
return-1.0;
}










defPubMeth(_s,"GetCapacityKbps",__GetCapacityKbps);defPubMeth(_s,"GetCapacityKbps",__GetCapacityKbps);
function __GetCapacityKbps(resource){
return-1;
}











defPubMeth(_s,"GetServerAddress",__GetServerAddress);defPubMeth(_s,"GetServerAddress",__GetServerAddress);
function __GetServerAddress(){
return null;
}











defPubMeth(_s,"GetIsLive",__GetIsLive);defPubMeth(_s,"GetIsLive",__GetIsLive);
function __GetIsLive(){
return ConvivaStreamerProxy.BOOLEAN_UNAVAILABLE;
}











defPubMeth(_s,"GetStreamerVersion",__GetStreamerVersion);defPubMeth(_s,"GetStreamerVersion",__GetStreamerVersion);
function __GetStreamerVersion(){
return-1;
}















defPubMeth(_s,"FetchCandidateStreams",__FetchCandidateStreams);defPubMeth(_s,"FetchCandidateStreams",__FetchCandidateStreams);
function __FetchCandidateStreams(resource){

}

















defPubMeth(_s,"Play",__Play);defPubMeth(_s,"Play",__Play);
function __Play(destination){
}










defPubMeth(_s,"GetApiVersion",__GetApiVersion);defPubMeth(_s,"GetApiVersion",__GetApiVersion);
function __GetApiVersion(){
return ConvivaStreamerProxy.API_VERSION;
}
if(_s==STAT_INIT)ConvivaStreamerProxy.API_VERSION=1;




























defPubMeth(_s,"SetMonitoringNotifier",__SetMonitoringNotifier);defPubMeth(_s,"SetMonitoringNotifier",__SetMonitoringNotifier);
function __SetMonitoringNotifier(notifier){

if(notifier==null)return;

var previousNotifiers=_s._notifiers;

var newNotifiers=new ListCS();
newNotifiers.Add(notifier);
_s._notifiers=newNotifiers;


if(_s._notifiers!=null){



if(_s.isProxyInitialized){
notifier(ConvivaStreamerProxy.REASON_PROXYINITIALIZED,null);
}

_s.SetDownloadStateChange(StreamInfo.VIDEO,ConvivaStreamerProxy.DOWNLOADSTATE_ACTIVE);
_s.SetDownloadStateChange(StreamInfo.AUDIO,ConvivaStreamerProxy.DOWNLOADSTATE_ACTIVE);


var newInfo=_s._stream;
_s._stream=new StreamInfo(-1,ConvivaContentInfo.CDN_NAME_OTHER,ConvivaContentInfo.NO_RESOURCE,-1,-1,-1);
_s.SetStream(newInfo);


var newState=_s._playingState;
_s._playingState=ConvivaStreamerProxy.UNKNOWN;
_s.SetPlayingState(newState);


var newMetadata=_s._lastMetadata;
_s._lastMetadata=null;
_s.SetMetadata(newMetadata);


var _for_array_1=_s._pendingErrors.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var strErr=_for_array_1[_for_idx_2];

_s.SetError(strErr);
}

var newStreams=_s._availableStreams;
_s._availableStreams=null;
_s.SetAvailableStreams(newStreams);

var newChunkDownloadStatus=(_s._currentLoadingStatus);
_s._currentLoadingStatus=null;
_s.SetLoadingStatus(newChunkDownloadStatus);

var newDiplayWidth=_s._displayWidth;
var newDisplayHeight=_s._displayWidth;
_s._displayWidth=-1;
_s._displayHeight=-1;
_s.SetDisplaySize(newDiplayWidth,newDisplayHeight);
}

previousNotifiers.Add(notifier);
_s._notifiers=previousNotifiers;
}











defPubMeth(_s,"GetLoadingStatus",__GetLoadingStatus);defPubMeth(_s,"GetLoadingStatus",__GetLoadingStatus);
function __GetLoadingStatus(){
return _s._currentLoadingStatus;
}










defPubMeth(_s,"GetPlayingState",__GetPlayingState);defPubMeth(_s,"GetPlayingState",__GetPlayingState);
function __GetPlayingState(){
return _s._playingState;
}










defPubMeth(_s,"GetBitrateKbps",__GetBitrateKbps);defPubMeth(_s,"GetBitrateKbps",__GetBitrateKbps);
function __GetBitrateKbps(){
return _s._stream.bitrateKbps;
}







defPubMeth(_s,"GetCdnName",__GetCdnName);defPubMeth(_s,"GetCdnName",__GetCdnName);
function __GetCdnName(){
return _s._stream.cdnName;
}










defPubMeth(_s,"GetResource",__GetResource);defPubMeth(_s,"GetResource",__GetResource);
function __GetResource(){
return _s._stream.resource;
}













defPubMeth(_s,"GetStream",__GetStream);defPubMeth(_s,"GetStream",__GetStream);
function __GetStream(){
return _s._stream;
}






defPubMeth(_s,"GetStreams",__GetStreams);defPubMeth(_s,"GetStreams",__GetStreams);
function __GetStreams(){
return null;
}









defPubMeth(_s,"GetLastError",__GetLastError);defPubMeth(_s,"GetLastError",__GetLastError);
function __GetLastError(){
return _s._lastError;
}







defPubMeth(_s,"GetLastMetadata",__GetLastMetadata);defPubMeth(_s,"GetLastMetadata",__GetLastMetadata);
function __GetLastMetadata(){
return _s._lastMetadata;
}









defPubMeth(_s,"GetDisplayWidth",__GetDisplayWidth);defPubMeth(_s,"GetDisplayWidth",__GetDisplayWidth);
function __GetDisplayWidth(){
return _s._displayWidth;
}





defPubMeth(_s,"GetDisplayHeight",__GetDisplayHeight);defPubMeth(_s,"GetDisplayHeight",__GetDisplayHeight);
function __GetDisplayHeight(){
return _s._displayHeight;
}


















defPubMeth(_s,"GetStreamerType",__GetStreamerType);defPubMeth(_s,"GetStreamerType",__GetStreamerType);
function __GetStreamerType(){
return null;
}











defPubMeth(_s,"GetLoadedBytes",__GetLoadedBytes);defPubMeth(_s,"GetLoadedBytes",__GetLoadedBytes);
function __GetLoadedBytes(){
return-1;
}


defPubMeth(_s,"SetDownloadStateChange",__SetDownloadStateChange);defPubMeth(_s,"SetDownloadStateChange",__SetDownloadStateChange);
function __SetDownloadStateChange(type,state){
var downloadStateChange=new ListCS();
downloadStateChange.Add(type);
downloadStateChange.Add(state);
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_DOWNLOADSTATECHANGE,downloadStateChange);
}
}









defPubMeth(_s,"SetStream",__SetStream);defPubMeth(_s,"SetStream",__SetStream);
function __SetStream(updatedStream){

if(updatedStream.bitrateKbps<=-2)updatedStream.bitrateKbps=_s._stream.bitrateKbps;
if(updatedStream.cdnName==null)updatedStream.cdnName=_s._stream.cdnName;
if(updatedStream.resource==null)updatedStream.resource=_s._stream.resource;
if(!_s._stream.equals(updatedStream)){
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_STREAMINFOCHANGE,updatedStream);
}
}
_s._stream=updatedStream;
}












defPubMeth(_s,"SetError",__SetError);defPubMeth(_s,"SetError",__SetError);
function __SetError(error){

_s._lastError=error;

if(_s._notifiers!=null&&_s._notifiers.Count>0){
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_ERRORCHANGE,error);
}
}else{
_s._pendingErrors.Add(error);
}
}

















defPubMeth(_s,"SetMetadata",__SetMetadata);defPubMeth(_s,"SetMetadata",__SetMetadata);
function __SetMetadata(metadata){

_s._lastMetadata=metadata;

if(metadata!=null){
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_METADATACHANGE,metadata);
}
}

}








defPubMeth(_s,"Log",__Log);defPubMeth(_s,"Log",__Log);
function __Log(message){
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_LOG,message);
}

}







defPubMeth(_s,"LogError",__LogError);defPubMeth(_s,"LogError",__LogError);
function __LogError(message){
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_LOG,"ERROR:"+message);
}
}

















defPubMeth(_s,"GetTotalLoadedBytes",__GetTotalLoadedBytes);defPubMeth(_s,"GetTotalLoadedBytes",__GetTotalLoadedBytes);
function __GetTotalLoadedBytes(){
return null;
}










defPubMeth(_s,"SetLoadingStatus",__SetLoadingStatus);defPubMeth(_s,"SetLoadingStatus",__SetLoadingStatus);
function __SetLoadingStatus(loadingStatus){
_s._currentLoadingStatus=loadingStatus;
if(loadingStatus!=null){
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_LOADINGSTATUSCHANGE,loadingStatus);
}
}
}








defPubMeth(_s,"SetPlayingState",__SetPlayingState);defPubMeth(_s,"SetPlayingState",__SetPlayingState);
function __SetPlayingState(newState){

if(newState!=_s._playingState){
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_PLAYINGSTATECHANGE,newState);
}
}
_s._playingState=newState;
}








defPubMeth(_s,"SetBitrateKbps",__SetBitrateKbps);defPubMeth(_s,"SetBitrateKbps",__SetBitrateKbps);
function __SetBitrateKbps(updatedBitrateKbps){
var updatedStream=new StreamInfo(updatedBitrateKbps,null,null,-1,-1,-1);
_s.SetStream(updatedStream);
}









defPubMeth(_s,"SetCdnName",__SetCdnName);defPubMeth(_s,"SetCdnName",__SetCdnName);
function __SetCdnName(updatedCdnName){
var updatedStream=new StreamInfo(-2,updatedCdnName,null,-1,-1,-1);
_s.SetStream(updatedStream);
}









defPubMeth(_s,"SetResource",__SetResource);defPubMeth(_s,"SetResource",__SetResource);
function __SetResource(updatedResource){
var updatedStream=new StreamInfo(-2,null,updatedResource,-1,-1,-1);
_s.SetStream(updatedStream);
}






defPubMeth(_s,"SetDisplaySize",__SetDisplaySize);defPubMeth(_s,"SetDisplaySize",__SetDisplaySize);
function __SetDisplaySize(displayWidth,displayHeight){

if(displayWidth!=-1&&displayHeight!=-1){

_s._displayWidth=displayWidth;
_s._displayHeight=displayHeight;

var displaySize=new ListCS();
displaySize.Add(displayWidth);
displaySize.Add(displayHeight);
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_DISPLAYSIZECHANGE,displaySize);
}
}
}








defPubMeth(_s,"SetAvailableStreams",__SetAvailableStreams);defPubMeth(_s,"SetAvailableStreams",__SetAvailableStreams);
function __SetAvailableStreams(streams){
_s._availableStreams=streams;
if(streams!=null){
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_AVAILABLESTREAMINFOCHANGE,streams);
}
}
}





defPubMeth(_s,"SetProxyInitialized",__SetProxyInitialized);defPubMeth(_s,"SetProxyInitialized",__SetProxyInitialized);
function __SetProxyInitialized(){
if(!_s.isProxyInitialized){
_s.isProxyInitialized=true;
var _for_array_1=_s._notifiers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var notifier=_for_array_1[_for_idx_2];

_s.notifyListeners(notifier,ConvivaStreamerProxy.REASON_PROXYINITIALIZED,null);
}
}
}

defPrivMeth(_s,"notifyListeners",__notifyListeners);
function __notifyListeners(notifier,reason,arg){
try{
notifier(reason,arg);
}catch(e){
notifier(ConvivaStreamerProxy.REASON_LOG,"ConvivaStreamerProxy : uncaught exception "+e);
}
}

defStatMeth(_s,ConvivaStreamerProxy,"API_VERSION",ConvivaStreamerProxy.API_VERSION);
defStatMeth(_s,ConvivaStreamerProxy,"BOOLEAN_FALSE",ConvivaStreamerProxy.BOOLEAN_FALSE);
defStatMeth(_s,ConvivaStreamerProxy,"BOOLEAN_TRUE",ConvivaStreamerProxy.BOOLEAN_TRUE);
defStatMeth(_s,ConvivaStreamerProxy,"BOOLEAN_UNAVAILABLE",ConvivaStreamerProxy.BOOLEAN_UNAVAILABLE);
defStatMeth(_s,ConvivaStreamerProxy,"BUFFERING",ConvivaStreamerProxy.BUFFERING);
defStatMeth(_s,ConvivaStreamerProxy,"CAPABILITY_BITRATE_METRICS",ConvivaStreamerProxy.CAPABILITY_BITRATE_METRICS);
defStatMeth(_s,ConvivaStreamerProxy,"CAPABILITY_BITRATE_SWITCHING",ConvivaStreamerProxy.CAPABILITY_BITRATE_SWITCHING);
defStatMeth(_s,ConvivaStreamerProxy,"CAPABILITY_CDN_SWITCHING",ConvivaStreamerProxy.CAPABILITY_CDN_SWITCHING);
defStatMeth(_s,ConvivaStreamerProxy,"CAPABILITY_QUALITY_METRICS",ConvivaStreamerProxy.CAPABILITY_QUALITY_METRICS);
defStatMeth(_s,ConvivaStreamerProxy,"CAPABILITY_SOURCE_CHUNKED",ConvivaStreamerProxy.CAPABILITY_SOURCE_CHUNKED);
defStatMeth(_s,ConvivaStreamerProxy,"CAPABILITY_SOURCE_HTTP",ConvivaStreamerProxy.CAPABILITY_SOURCE_HTTP);
defStatMeth(_s,ConvivaStreamerProxy,"CAPABILITY_SOURCE_STREAMING",ConvivaStreamerProxy.CAPABILITY_SOURCE_STREAMING);
defStatMeth(_s,ConvivaStreamerProxy,"CAPABILITY_VIDEO",ConvivaStreamerProxy.CAPABILITY_VIDEO);
defStatMeth(_s,ConvivaStreamerProxy,"DOWNLOADSTATE_ACTIVE",ConvivaStreamerProxy.DOWNLOADSTATE_ACTIVE);
defStatMeth(_s,ConvivaStreamerProxy,"DOWNLOADSTATE_INACTIVE",ConvivaStreamerProxy.DOWNLOADSTATE_INACTIVE);
defStatMeth(_s,ConvivaStreamerProxy,"ERROR",ConvivaStreamerProxy.ERROR);
defStatMeth(_s,ConvivaStreamerProxy,"METADATA_DURATION",ConvivaStreamerProxy.METADATA_DURATION);
defStatMeth(_s,ConvivaStreamerProxy,"METADATA_ENCODED_FRAMERATE",ConvivaStreamerProxy.METADATA_ENCODED_FRAMERATE);
defStatMeth(_s,ConvivaStreamerProxy,"NOT_MONITORED",ConvivaStreamerProxy.NOT_MONITORED);
defStatMeth(_s,ConvivaStreamerProxy,"PAUSED",ConvivaStreamerProxy.PAUSED);
defStatMeth(_s,ConvivaStreamerProxy,"PLAYING",ConvivaStreamerProxy.PLAYING);
defStatMeth(_s,ConvivaStreamerProxy,"REASON_AVAILABLESTREAMINFOCHANGE",ConvivaStreamerProxy.REASON_AVAILABLESTREAMINFOCHANGE);
defStatMeth(_s,ConvivaStreamerProxy,"REASON_DISPLAYSIZECHANGE",ConvivaStreamerProxy.REASON_DISPLAYSIZECHANGE);
defStatMeth(_s,ConvivaStreamerProxy,"REASON_DOWNLOADSTATECHANGE",ConvivaStreamerProxy.REASON_DOWNLOADSTATECHANGE);
defStatMeth(_s,ConvivaStreamerProxy,"REASON_ERRORCHANGE",ConvivaStreamerProxy.REASON_ERRORCHANGE);
defStatMeth(_s,ConvivaStreamerProxy,"REASON_LOADINGSTATUSCHANGE",ConvivaStreamerProxy.REASON_LOADINGSTATUSCHANGE);
defStatMeth(_s,ConvivaStreamerProxy,"REASON_LOG",ConvivaStreamerProxy.REASON_LOG);
defStatMeth(_s,ConvivaStreamerProxy,"REASON_METADATACHANGE",ConvivaStreamerProxy.REASON_METADATACHANGE);
defStatMeth(_s,ConvivaStreamerProxy,"REASON_PLAYINGSTATECHANGE",ConvivaStreamerProxy.REASON_PLAYINGSTATECHANGE);
defStatMeth(_s,ConvivaStreamerProxy,"REASON_PROXYINITIALIZED",ConvivaStreamerProxy.REASON_PROXYINITIALIZED);
defStatMeth(_s,ConvivaStreamerProxy,"REASON_STREAMINFOCHANGE",ConvivaStreamerProxy.REASON_STREAMINFOCHANGE);
defStatMeth(_s,ConvivaStreamerProxy,"STOPPED",ConvivaStreamerProxy.STOPPED);
defStatMeth(_s,ConvivaStreamerProxy,"UNKNOWN",ConvivaStreamerProxy.UNKNOWN);
if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(ConvivaStreamerProxy,"ConvivaStreamerProxy");






































function LivePass(){
var _s=this;

if(_s==STAT_INIT)LivePass.READY="READY";



if(_s==STAT_INIT)LivePass.STREAM_SELECTION_SUCC=0;

if(_s==STAT_INIT)LivePass.STREAM_SELECTION_FAILURE=1;

if(_s==STAT_INIT)LivePass.STREAM_SELECTION_TIMEOUT=2;


if(_s==STAT_INIT)LivePass.readyState=false;


if(_s==STAT_INIT)LivePass._settings=null;


if(_s==STAT_INIT)LivePass._utils=null;

if(_s==STAT_INIT)LivePass._sessionFactory=null;


if(_s==STAT_INIT)LivePass._toggleTracesUsed=false;

if(_s==STAT_INIT)LivePass._toggleTracesValue=false;


if(_s==STAT_INIT)LivePass._globalSessionId=-1;







defStatMeth(_s,LivePass,"init",__init);
function __init(customerKey){
if(LivePass.readyState){
LivePass._utils.log("LivePass.init(): already initialized.");
return;
}
if(LivePass._utils==null){


LivePass._utils=Utils.CreateUtils(null);
}
if(customerKey==null||customerKey.length==0){
LivePass._utils.err("LivePass.init(): invalid customerKey: "+customerKey);
return;
}
LivePass._utils.runProtectedSync(
function(){
LivePass._settings=LivePass._utils.getSettings();

if(LivePass._toggleTracesUsed){
LivePass._settings.enableLogging=LivePass._toggleTracesValue;
}
LivePass._settings.clientInstanceId=LivePass._utils.randInt();
LivePass._settings.customerKey=customerKey;
LivePass._utils.log("LivePass.init(): url="+LivePass._settings.gatewayUrl+" customerKey="+LivePass._settings.customerKey);
LivePass._utils.startFetchClientId();
PlayerStates.init();
LivePass._sessionFactory=new SessionFactory();
LivePass.readyState=true;
LivePass._utils.log("LivePass.init(): done.");
},"LivePass.init");
}








defStatMeth(_s,LivePass,"initWithSettings",__initWithSettings);
function __initWithSettings(customerKey,settings){



if(LivePass.readyState){
LivePass._utils.log("LivePass.initWithSettings(): already initialized.");
return;
}
LivePass._utils=Utils.CreateUtils(settings);
LivePass.init(customerKey);
}





defStatMeth(_s,LivePass,"cleanup",__cleanup);
function __cleanup(){
if(LivePass._utils!=null){
LivePass._utils.runProtected(
function(){
LivePass._utils.log("LivePass.cleanup()");
if(LivePass._sessionFactory!=null){
LivePass._sessionFactory.cleanup();
}
LivePass._sessionFactory=null;
LivePass._globalSessionId=-1;
if(LivePass._utils!=null){
LivePass._utils.cleanup();
}
LivePass._utils=null;
LivePass._settings=null;
},"LivePass.cleanup");
}
LivePass.readyState=false;
}








defStatMeth(_s,LivePass,"createSession",__createSession);
function __createSession(streamer,contentInfo){
if(!LivePass.readyState){
LivePass.ping("LivePass.createSession before LivePass.init");
return-1;
}
return LivePass.createSessionWithGlobal(streamer,contentInfo,false);
}







defStatMeth(_s,LivePass,"createSessionWithGlobal",__createSessionWithGlobal);
function __createSessionWithGlobal(streamer,contentInfo,global){

var sid=LivePass._sessionFactory.newSessionId();
LivePass._utils.runProtected(
function(){
var session=LivePass._sessionFactory.makeSession(streamer,contentInfo,sid,global);
},"LivePass.createSession");
return sid;
}






defStatMeth(_s,LivePass,"reportError",__reportError);
function __reportError(sessionId,errorMsg){
if(!LivePass.readyState){
LivePass.ping("LivePass.reportError before LivePass.init");
return;
}
LivePass._utils.runProtected(
function(){
var session=LivePass._sessionFactory.getSession(sessionId);
if(session!=null){

session.reportError(StreamerError.makeUnscopedError(errorMsg,StreamerError.SEVERITY_FATAL));
}
},"LivePass.reportError");
}






defStatMeth(_s,LivePass,"setCurrentStreamInfo",__setCurrentStreamInfo);
function __setCurrentStreamInfo(sessionId,streamInfo){
if(!LivePass.readyState){
LivePass.ping("LivePass.setCurrentStreamInfo before LivePass.init");
return;
}
LivePass._utils.runProtected(
function(){
var session=LivePass._sessionFactory.getSession(sessionId);
if(session!=null){
session.setCurrentStreamInfo(streamInfo);
}
},"LivePass.setCurrentStreamInfo");
}















defStatMeth(_s,LivePass,"setCurrentStreamMetadata",__setCurrentStreamMetadata);
function __setCurrentStreamMetadata(sessionId,metadata){
if(!LivePass.readyState){
LivePass.ping("LivePass.setCurrentStreamMetadata before LivePass.init");
return;
}
LivePass._utils.runProtected(
function(){
var session=LivePass._sessionFactory.getSession(sessionId);
if(session!=null){
session.setCurrentStreamMetadata(metadata);
}
},"LivePass.setCurrentStreamMetadata");
}






defStatMeth(_s,LivePass,"setCdnNameOrResource",__setCdnNameOrResource);
function __setCdnNameOrResource(sessionId,resource){
if(!LivePass.readyState){
LivePass.ping("LivePass.setCdnNameOrResource before LivePass.init");
return;
}
LivePass._utils.runProtected(
function(){
var session=LivePass._sessionFactory.getSession(sessionId);
if(session!=null){
session.setCdnNameOrResource(resource);
}
},"LivePass.setCdnNameOrResource");
}







defStatMeth(_s,LivePass,"detachStreamer",__detachStreamer);
function __detachStreamer(sessionId){
if(!LivePass.readyState){
LivePass.ping("LivePass.detachStreamer before LivePass.init");
return;
}
LivePass._utils.runProtected(
function(){
var session=LivePass._sessionFactory.getSession(sessionId);
if(session!=null){
session.detachStreamer();
}
},"LivePass.detachStreamer");
}







defStatMeth(_s,LivePass,"attachStreamer",__attachStreamer);
function __attachStreamer(sessionId,streamer){
if(!LivePass.readyState){
LivePass.ping("LivePass.attachStreamer before LivePass.init");
return;
}
LivePass._utils.runProtected(
function(){
var session=LivePass._sessionFactory.getSession(sessionId);
if(session!=null){
session.attachStreamer(streamer);
}
},"LivePass.attachStreamer");
}










defStatMeth(_s,LivePass,"sendSessionEvent",__sendSessionEvent);
function __sendSessionEvent(sessionId,eventName,eventAttributes){
if(!LivePass.readyState){
LivePass.ping("LivePass.sendSessionEvent before LivePass.init");
return;
}
var eventAttrDictCS=null;
eventAttrDictCS=Lang.DictionaryFromRepr(eventAttributes);
LivePass._utils.runProtected(
function(){
var session=LivePass._sessionFactory.getSession(sessionId);
if(session!=null){
session.sendCustomEvent(eventName,eventAttrDictCS);
}
},"LivePass.sendSessionEvent");
}









defStatMeth(_s,LivePass,"sendEvent",__sendEvent);
function __sendEvent(eventName,eventAttributes){

if(!LivePass.readyState){
LivePass.ping("LivePass.sendEvent before LivePass.init");
return;
}
LivePass._utils.runProtected(
function(){

if(LivePass._globalSessionId<0){
var cci=new ConvivaContentInfo("",new DictionaryCS());
LivePass._globalSessionId=LivePass.createSessionWithGlobal(null,cci,true);
}
LivePass.sendSessionEvent(LivePass._globalSessionId,eventName,eventAttributes);
},"LivePass.sendEvent"
);

}






defStatMeth(_s,LivePass,"cleanupSession",__cleanupSession);
function __cleanupSession(sessionId){
if(!LivePass.readyState){
LivePass.ping("LivePass.cleanupSession before LivePass.init");
return;
}
LivePass._utils.runProtected(
function(){
LivePass._sessionFactory.cleanupSession(sessionId);
},"Livepass.cleanupSession");
}







defStatMeth(_s,LivePass,"pauseJoinTime",__pauseJoinTime);
function __pauseJoinTime(sessionId){
if(!LivePass.readyState){
LivePass.ping("LivePass.pauseJoinTime before LivePass.init");
return;
}
LivePass.adStart(sessionId);
}






defStatMeth(_s,LivePass,"resumeJoinTime",__resumeJoinTime);
function __resumeJoinTime(sessionId){
if(!LivePass.readyState){
LivePass.ping("LivePass.resumeJoinTime before LivePass.init");
return;
}
LivePass.adEnd(sessionId);
}





defStatMeth(_s,LivePass,"adStart",__adStart);
function __adStart(sessionId){
if(!LivePass.readyState){
LivePass.ping("LivePass.adStart before LivePass.init");
return;
}
LivePass._utils.runProtected(
function(){
var session=LivePass._sessionFactory.getSession(sessionId);
if(session!=null){
session.adStart();
}
},"LivePass.adStart");
}





defStatMeth(_s,LivePass,"adEnd",__adEnd);
function __adEnd(sessionId){
if(!LivePass.readyState){
LivePass.ping("LivePass.adEnd before LivePass.init");
return;
}
LivePass._utils.runProtected(
function(){
var session=LivePass._sessionFactory.getSession(sessionId);
if(session!=null){
session.adEnd();
}
},"LivePass.adEnd");
}





defStatMeth(_s,LivePass,"toggleTraces",__toggleTraces);
function __toggleTraces(b){


LivePass._toggleTracesUsed=true;
if(LivePass._settings!=null){
LivePass._settings.enableLogging=b;
}else{
LivePass._toggleTracesValue=b;
}
}





defStatMeth(_s,LivePass,"ping",__ping);
function __ping(msg){
if(LivePass._utils!=null){
LivePass._utils.ping(msg);
}
}





}
statInit(LivePass,"LivePass");






function PlayerStates(){
var _s=this;

if(_s==STAT_INIT)PlayerStates.stateToInt=null;

if(_s==STAT_INIT)PlayerStates.intToState=null;




if(_s==STAT_INIT)PlayerStates.UNINITIALIZED="UNINITIALIZED";
if(_s==STAT_INIT)PlayerStates.eUninitialized=0;

if(_s==STAT_INIT)PlayerStates.PLAYING="PLAYING";
if(_s==STAT_INIT)PlayerStates.ePlaying=3;
if(_s==STAT_INIT)PlayerStates.STOPPED="STOPPED";
if(_s==STAT_INIT)PlayerStates.eStopped=1;
if(_s==STAT_INIT)PlayerStates.PAUSED="PAUSED";
if(_s==STAT_INIT)PlayerStates.ePaused=12;
if(_s==STAT_INIT)PlayerStates.BUFFERING="BUFFERING";
if(_s==STAT_INIT)PlayerStates.eBuffering=6;
if(_s==STAT_INIT)PlayerStates.NOT_MONITORED="NOT_MONITORED";
if(_s==STAT_INIT)PlayerStates.eNotMonitored=98;
if(_s==STAT_INIT)PlayerStates.UNKNOWN="UNKNOWN";
if(_s==STAT_INIT)PlayerStates.eUnknown=100;

defStatMeth(_s,PlayerStates,"init",__init);
function __init(){
PlayerStates.stateToInt=new DictionaryCS();
PlayerStates.intToState=new DictionaryCS();
PlayerStates.stateToInt.SetValue(PlayerStates.UNINITIALIZED,PlayerStates.eUninitialized);PlayerStates.intToState.SetValue(PlayerStates.eUninitialized,PlayerStates.UNINITIALIZED);
PlayerStates.stateToInt.SetValue(PlayerStates.PLAYING,PlayerStates.ePlaying);PlayerStates.intToState.SetValue(PlayerStates.ePlaying,PlayerStates.PLAYING);
PlayerStates.stateToInt.SetValue(PlayerStates.STOPPED,PlayerStates.eStopped);PlayerStates.intToState.SetValue(PlayerStates.eStopped,PlayerStates.STOPPED);
PlayerStates.stateToInt.SetValue(PlayerStates.PAUSED,PlayerStates.ePaused);PlayerStates.intToState.SetValue(PlayerStates.ePaused,PlayerStates.PAUSED);
PlayerStates.stateToInt.SetValue(PlayerStates.BUFFERING,PlayerStates.eBuffering);PlayerStates.intToState.SetValue(PlayerStates.eBuffering,PlayerStates.BUFFERING);
PlayerStates.stateToInt.SetValue(PlayerStates.NOT_MONITORED,PlayerStates.eNotMonitored);PlayerStates.intToState.SetValue(PlayerStates.eNotMonitored,PlayerStates.NOT_MONITORED);
PlayerStates.stateToInt.SetValue(PlayerStates.UNKNOWN,PlayerStates.eUnknown);PlayerStates.intToState.SetValue(PlayerStates.eUnknown,PlayerStates.UNKNOWN);
}

defStatMeth(_s,PlayerStates,"stringToInt",__stringToInt);
function __stringToInt(stateStr){
if(PlayerStates.stateToInt==null){
PlayerStates.init();
}
if(PlayerStates.stateToInt.ContainsKey(stateStr)){
return PlayerStates.stateToInt.GetValue(stateStr);
}else{
return PlayerStates.eUnknown;
}
}

defStatMeth(_s,PlayerStates,"intToString",__intToString);
function __intToString(stateInt){
if(PlayerStates.intToState==null){
PlayerStates.init();
}
if(PlayerStates.intToState.ContainsKey(stateInt)){
return PlayerStates.intToState.GetValue(stateInt);
}else{
return PlayerStates.UNKNOWN;
}
}

defStatMeth(_s,PlayerStates,"cleanup",__cleanup);
function __cleanup(){
PlayerStates.stateToInt=null;
}














}
statInit(PlayerStates,"PlayerStates");


















function StreamInfo(){
var _s=this;







if(_s==STAT_INIT)StreamInfo.UNKNOWN=-1;


if(_s==STAT_INIT)StreamInfo.AUDIO=0;


if(_s==STAT_INIT)StreamInfo.VIDEO=1;


if(_s==STAT_INIT)StreamInfo.TEXT=2;


if(_s==STAT_INIT)StreamInfo.RESOURCE=3;








if(_s!=STAT_INIT)_s.__auto_type=undefined;
defGet(_s,"type",__get_type);defGet(_s,"type",__get_type);
function __get_type(){return _s.__auto_type;}
defSet(_s,"type",__set_type);defSet(_s,"type",__set_type);
function __set_type(value){_s.__auto_type=value;}






if(_s!=STAT_INIT)_s.__auto_sourceHeightPixels=undefined;
defGet(_s,"sourceHeightPixels",__get_sourceHeightPixels);defGet(_s,"sourceHeightPixels",__get_sourceHeightPixels);
function __get_sourceHeightPixels(){return _s.__auto_sourceHeightPixels;}
defSet(_s,"sourceHeightPixels",__set_sourceHeightPixels);defSet(_s,"sourceHeightPixels",__set_sourceHeightPixels);
function __set_sourceHeightPixels(value){_s.__auto_sourceHeightPixels=value;}






if(_s!=STAT_INIT)_s.__auto_sourceWidthPixels=undefined;
defGet(_s,"sourceWidthPixels",__get_sourceWidthPixels);defGet(_s,"sourceWidthPixels",__get_sourceWidthPixels);
function __get_sourceWidthPixels(){return _s.__auto_sourceWidthPixels;}
defSet(_s,"sourceWidthPixels",__set_sourceWidthPixels);defSet(_s,"sourceWidthPixels",__set_sourceWidthPixels);
function __set_sourceWidthPixels(value){_s.__auto_sourceWidthPixels=value;}







if(_s!=STAT_INIT)_s.__auto_bitrateKbps=undefined;
defGet(_s,"bitrateKbps",__get_bitrateKbps);defGet(_s,"bitrateKbps",__get_bitrateKbps);
function __get_bitrateKbps(){return _s.__auto_bitrateKbps;}
defSet(_s,"bitrateKbps",__set_bitrateKbps);defSet(_s,"bitrateKbps",__set_bitrateKbps);
function __set_bitrateKbps(value){_s.__auto_bitrateKbps=value;}







if(_s!=STAT_INIT)_s.__auto_resource=undefined;
defGet(_s,"resource",__get_resource);defGet(_s,"resource",__get_resource);
function __get_resource(){return _s.__auto_resource;}
defSet(_s,"resource",__set_resource);defSet(_s,"resource",__set_resource);
function __set_resource(value){_s.__auto_resource=value;}







if(_s!=STAT_INIT)_s.__auto_cdnName=undefined;
defGet(_s,"cdnName",__get_cdnName);defGet(_s,"cdnName",__get_cdnName);
function __get_cdnName(){return _s.__auto_cdnName;}
defSet(_s,"cdnName",__set_cdnName);defSet(_s,"cdnName",__set_cdnName);
function __set_cdnName(value){_s.__auto_cdnName=value;}








function _constr(_bitrateKbps,_cdnName,_resource,type,widthPixels,heightPixels){
_s.bitrateKbps=_bitrateKbps;
_s.cdnName=_cdnName;
_s.resource=_resource;
_s.type=type;
_s.sourceHeightPixels=heightPixels;
_s.sourceWidthPixels=widthPixels;
}


defPubMeth(_s,"GetBitrateKbps",__GetBitrateKbps);defPubMeth(_s,"GetBitrateKbps",__GetBitrateKbps);
function __GetBitrateKbps(){
return _s.bitrateKbps;
}


defPubMeth(_s,"GetCdnName",__GetCdnName);defPubMeth(_s,"GetCdnName",__GetCdnName);
function __GetCdnName(){
return _s.cdnName;
}


defPubMeth(_s,"GetResource",__GetResource);defPubMeth(_s,"GetResource",__GetResource);
function __GetResource(){
return _s.resource;
}

defPubMeth(_s,"equals",__equals);defPubMeth(_s,"equals",__equals);
function __equals(other){
if(other==null)return false;

return _s.cdnName==other.cdnName&&_s.resource==other.resource&&_s.bitrateKbps==other.bitrateKbps&&_s.type==other.type
&&_s.sourceHeightPixels==other.sourceHeightPixels&&_s.sourceWidthPixels==other.sourceWidthPixels;
}






defStatMeth(_s,StreamInfo,"ConstructClone",__ConstructClone);defStatMeth(_s,StreamInfo,"ConstructClone",__ConstructClone);
function __ConstructClone(fromObj){
if(fromObj==null)return null;
var res=new StreamInfo(-1,ConvivaContentInfo.CDN_NAME_OTHER,null,-1,-1,-1);
res.type=slint.Cast(NativeLang.GetField("type",fromObj));
res.bitrateKbps=slint.Cast(NativeLang.GetField("bitrateKbps",fromObj));
res.resource=NativeLang.GetStringField("resource",fromObj);
res.cdnName=NativeLang.GetStringField("cdnName",fromObj);
res.sourceHeightPixels=slint.Cast(NativeLang.GetField("sourceHeightPixels",fromObj));
res.sourceWidthPixels=slint.Cast(NativeLang.GetField("sourceWidthPixels",fromObj));
return res;
}

defPubMeth(_s,"ToStr",__ToStr);defPubMeth(_s,"ToStr",__ToStr);
function __ToStr(){
var typeString=null;

switch(_s.type){
case StreamInfo.UNKNOWN:
typeString="UNKNOWN";
break;
case StreamInfo.VIDEO:
typeString="VIDEO";
break;
case StreamInfo.AUDIO:
typeString="AUDIO";
break;
case StreamInfo.TEXT:
typeString="TEXT";
break;
case StreamInfo.RESOURCE:
typeString="RESOURCE";
break;
default:
throw new Error("Unknown stream type "+_s.type);
}

return "type="+typeString+
", bitrateKbps="+_s.bitrateKbps+
", resource="+(_s.resource!=null?_s.resource:"null")+
", cdnName="+(_s.cdnName!=null?_s.cdnName:"null")+
", sourceHeightPixels="+_s.sourceHeightPixels+
", sourceWidthPixels="+_s.sourceWidthPixels;
}
defStatMeth(_s,StreamInfo,"AUDIO",StreamInfo.AUDIO);
defStatMeth(_s,StreamInfo,"RESOURCE",StreamInfo.RESOURCE);
defStatMeth(_s,StreamInfo,"TEXT",StreamInfo.TEXT);
defStatMeth(_s,StreamInfo,"UNKNOWN",StreamInfo.UNKNOWN);
defStatMeth(_s,StreamInfo,"VIDEO",StreamInfo.VIDEO);
if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(StreamInfo,"StreamInfo");
























function StreamSwitch(){
var _s=this;

if(_s==STAT_INIT)StreamSwitch._nextId=0;






if(_s==STAT_INIT)StreamSwitch.PENDING="PENDING";



if(_s==STAT_INIT)StreamSwitch.IN_PROGRESS="IN_PROGRESS";




if(_s==STAT_INIT)StreamSwitch.SUCCEEDED="SUCCEEDED";



if(_s==STAT_INIT)StreamSwitch.FAILED="FAILED";




if(_s==STAT_INIT)StreamSwitch.INTERRUPTED="INTERRUPTED";








defStatMeth(_s,StreamSwitch,"MakeSwitch",__MakeSwitch);defStatMeth(_s,StreamSwitch,"MakeSwitch",__MakeSwitch);
function __MakeSwitch(source,target,status){
return new StreamSwitch(StreamSwitch.GetNextId(false),source,target,-1,null,status);
}














defStatMeth(_s,StreamSwitch,"MakeSwitchToStream",__MakeSwitchToStream);defStatMeth(_s,StreamSwitch,"MakeSwitchToStream",__MakeSwitchToStream);
function __MakeSwitchToStream(target,status){
return new StreamSwitch(StreamSwitch.GetNextId(false),null,target,-1,null,status);
}




defPubMeth(_s,"Cleanup",__Cleanup);defPubMeth(_s,"Cleanup",__Cleanup);
function __Cleanup(){
}









if(_s!=STAT_INIT)_s.__auto_id=undefined;
defGet(_s,"id",__get_id);defGet(_s,"id",__get_id);
function __get_id(){return _s.__auto_id;}
defSet(_s,"id",__set_id);defSet(_s,"id",__set_id);
function __set_id(value){_s.__auto_id=value;}









if(_s!=STAT_INIT)_s.__auto_timeoutMs=undefined;
defGet(_s,"timeoutMs",__get_timeoutMs);defGet(_s,"timeoutMs",__get_timeoutMs);
function __get_timeoutMs(){return _s.__auto_timeoutMs;}
defSet(_s,"timeoutMs",__set_timeoutMs);defSet(_s,"timeoutMs",__set_timeoutMs);
function __set_timeoutMs(value){_s.__auto_timeoutMs=value;}








if(_s!=STAT_INIT)_s.__auto_sourceStream=undefined;
defGet(_s,"sourceStream",__get_sourceStream);defGet(_s,"sourceStream",__get_sourceStream);
function __get_sourceStream(){return _s.__auto_sourceStream;}
defSet(_s,"sourceStream",__set_sourceStream);defSet(_s,"sourceStream",__set_sourceStream);
function __set_sourceStream(value){_s.__auto_sourceStream=value;}















if(_s!=STAT_INIT)_s.__auto_targetStream=undefined;
defGet(_s,"targetStream",__get_targetStream);defGet(_s,"targetStream",__get_targetStream);
function __get_targetStream(){return _s.__auto_targetStream;}
defSet(_s,"targetStream",__set_targetStream);defSet(_s,"targetStream",__set_targetStream);
function __set_targetStream(value){_s.__auto_targetStream=value;}













if(_s!=STAT_INIT)_s.__auto_mode=undefined;
defGet(_s,"mode",__get_mode);defGet(_s,"mode",__get_mode);
function __get_mode(){return _s.__auto_mode;}
defSet(_s,"mode",__set_mode);defSet(_s,"mode",__set_mode);
function __set_mode(value){_s.__auto_mode=value;}









if(_s!=STAT_INIT)_s.__auto_status=undefined;
defGet(_s,"status",__get_status);defGet(_s,"status",__get_status);
function __get_status(){return _s.__auto_status;}
defSet(_s,"status",__set_status);defSet(_s,"status",__set_status);
function __set_status(value){_s.__auto_status=value;}







function _constr(id,sourceStream,targetStream,timeoutMs,mode,status){
_s.id=id;
_s.sourceStream=sourceStream;
_s.targetStream=targetStream;
_s.timeoutMs=timeoutMs;
_s.mode=mode;
_s.status=status;
}










defPubMeth(_s,"CheckValidity",__CheckValidity);defPubMeth(_s,"CheckValidity",__CheckValidity);
function __CheckValidity(){
if(_s.id==null){
return "StreamSwitch.id is null (and must be non-null)";
}

if(_s.id!=null&&!((typeof _s.id==="string"))){
return "StreamSwitch.id is not a string";
}else if(_s.timeoutMs!=null&&!((typeof _s.timeoutMs==="number"))){
return "StreamSwitch.timeoutMs is not an int";
}else if(_s.mode!=null&&!((typeof _s.mode==="string"))){
return "StreamSwitch.mode is not a string";
}else if(_s.status!=null&&!((typeof _s.status==="string"))){
return "StreamSwitch.status is not a string";
}else if(_s.sourceStream!=null&&!(_s.sourceStream instanceof CandidateStream)){
return "StreamSwitch.sourceStream is not a CandidateStream";
}else if(_s.targetStream!=null&&!(_s.targetStream instanceof CandidateStream)){
return "StreamSwitch.targetStream is not a CandidateStream";
}
var sourceStreamError=(_s.sourceStream!=null?_s.sourceStream.CheckValidity():null);
if(sourceStreamError!=null){
return sourceStreamError;
}
var targetStreamError=(_s.targetStream!=null?_s.targetStream.CheckValidity():null);
if(targetStreamError!=null){
return targetStreamError;
}
return null;
}





defStatMeth(_s,StreamSwitch,"ConstructClone",__ConstructClone);defStatMeth(_s,StreamSwitch,"ConstructClone",__ConstructClone);
function __ConstructClone(fromObj){
var res=new StreamSwitch(null,null,null,-1,"","");
res.id=NativeLang.GetStringField("id",fromObj);
res.sourceStream=CandidateStream.ConstructClone(NativeLang.GetField("sourceStream",fromObj));
res.targetStream=CandidateStream.ConstructClone(NativeLang.GetField("targetStream",fromObj));
res.timeoutMs=slint.Cast(NativeLang.GetField("timeoutMs",fromObj));
res.mode=NativeLang.GetStringField("mode",fromObj);
res.status=NativeLang.GetStringField("status",fromObj);
return res;
}



defStatMeth(_s,StreamSwitch,"StaticInit",__StaticInit);defStatMeth(_s,StreamSwitch,"StaticInit",__StaticInit);
function __StaticInit(){
StreamSwitch._nextId=0;
}


defStatMeth(_s,StreamSwitch,"StaticCleanup",__StaticCleanup);defStatMeth(_s,StreamSwitch,"StaticCleanup",__StaticCleanup);
function __StaticCleanup(){
StreamSwitch._nextId=0;
}

defStatMeth(_s,StreamSwitch,"GetNextId",__GetNextId);defStatMeth(_s,StreamSwitch,"GetNextId",__GetNextId);
function __GetNextId(useInternalNamespace){
var id=StreamSwitch._nextId;
StreamSwitch._nextId+=1;
if(useInternalNamespace){
return "c3."+Lang.ToString(id);
}else{
return Lang.ToString(id);
}
}
defStatMeth(_s,StreamSwitch,"FAILED",StreamSwitch.FAILED);
defStatMeth(_s,StreamSwitch,"INTERRUPTED",StreamSwitch.INTERRUPTED);
defStatMeth(_s,StreamSwitch,"IN_PROGRESS",StreamSwitch.IN_PROGRESS);
defStatMeth(_s,StreamSwitch,"PENDING",StreamSwitch.PENDING);
defStatMeth(_s,StreamSwitch,"SUCCEEDED",StreamSwitch.SUCCEEDED);
if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(StreamSwitch,"StreamSwitch");
















function StreamerError(){
var _s=this;




if(_s==STAT_INIT)StreamerError.ERROR_SCOPE_UNKNOWN=0;

if(_s==STAT_INIT)StreamerError.ERROR_SCOPE_STREAM_SEGMENT=1;

if(_s==STAT_INIT)StreamerError.ERROR_SCOPE_STREAM=2;

if(_s==STAT_INIT)StreamerError.ERROR_SCOPE_RESOURCE=3;






if(_s==STAT_INIT)StreamerError.SEVERITY_WARNING=0;



if(_s==STAT_INIT)StreamerError.SEVERITY_FATAL=1;



if(_s!=STAT_INIT)_s.__auto_errorCode=undefined;
defGet(_s,"errorCode",__get_errorCode);defGet(_s,"errorCode",__get_errorCode);
function __get_errorCode(){return _s.__auto_errorCode;}
defSet(_s,"errorCode",__set_errorCode);defSet(_s,"errorCode",__set_errorCode);
function __set_errorCode(value){_s.__auto_errorCode=value;}



if(_s!=STAT_INIT)_s.__auto_severity=undefined;
defGet(_s,"severity",__get_severity);defGet(_s,"severity",__get_severity);
function __get_severity(){return _s.__auto_severity;}
defSet(_s,"severity",__set_severity);defSet(_s,"severity",__set_severity);
function __set_severity(value){_s.__auto_severity=value;}



if(_s!=STAT_INIT)_s.__auto_stream=undefined;
defGet(_s,"stream",__get_stream);defGet(_s,"stream",__get_stream);
function __get_stream(){return _s.__auto_stream;}
defSet(_s,"stream",__set_stream);defSet(_s,"stream",__set_stream);
function __set_stream(value){_s.__auto_stream=value;}



if(_s!=STAT_INIT)_s.__auto_index=undefined;
defGet(_s,"index",__get_index);defGet(_s,"index",__get_index);
function __get_index(){return _s.__auto_index;}
defSet(_s,"index",__set_index);defSet(_s,"index",__set_index);
function __set_index(value){_s.__auto_index=value;}



if(_s!=STAT_INIT)_s.__auto_scope=undefined;
defGet(_s,"scope",__get_scope);defGet(_s,"scope",__get_scope);
function __get_scope(){return _s.__auto_scope;}
defSet(_s,"scope",__set_scope);defSet(_s,"scope",__set_scope);
function __set_scope(value){_s.__auto_scope=value;}







defStatMeth(_s,StreamerError,"makeUnscopedError",__makeUnscopedError);defStatMeth(_s,StreamerError,"makeUnscopedError",__makeUnscopedError);
function __makeUnscopedError(errorCode,severity){
return new StreamerError(errorCode,null,-1,severity,StreamerError.ERROR_SCOPE_UNKNOWN);
}








defStatMeth(_s,StreamerError,"makeStreamError",__makeStreamError);defStatMeth(_s,StreamerError,"makeStreamError",__makeStreamError);
function __makeStreamError(errCode,severity,stream){
return new StreamerError(errCode,stream,-1,severity,StreamerError.ERROR_SCOPE_STREAM);
}








defStatMeth(_s,StreamerError,"makeResourceError",__makeResourceError);defStatMeth(_s,StreamerError,"makeResourceError",__makeResourceError);
function __makeResourceError(errCode,severity,stream){
return new StreamerError(errCode,stream,-1,severity,StreamerError.ERROR_SCOPE_RESOURCE);
}










defStatMeth(_s,StreamerError,"makeStreamSegmentError",__makeStreamSegmentError);defStatMeth(_s,StreamerError,"makeStreamSegmentError",__makeStreamSegmentError);
function __makeStreamSegmentError(errCode,severity,stream,idx){
return new StreamerError(errCode,stream,idx,severity,StreamerError.ERROR_SCOPE_STREAM_SEGMENT);
}

function _constr(_errorCode,_stream,_index,_severity,_scope){
_s.errorCode=_errorCode;

_s.stream=_stream;
_s.index=_index;
_s.severity=_severity;
_s.scope=_scope;
}






defStatMeth(_s,StreamerError,"ConstructClone",__ConstructClone);defStatMeth(_s,StreamerError,"ConstructClone",__ConstructClone);
function __ConstructClone(fromObj){
if(fromObj==null)return null;
var res=new StreamerError("",null,0,0,0);
res.errorCode=NativeLang.GetStringField("errorCode",fromObj);
res.severity=slint.Cast(NativeLang.GetField("severity",fromObj));
res.stream=StreamInfo.ConstructClone(NativeLang.GetField("stream",fromObj));
res.scope=slint.Cast(NativeLang.GetField("scope",fromObj));
res.index=slint.Cast(NativeLang.GetField("index",fromObj));
return res;
}

defPubMeth(_s,"ToStr",__ToStr);defPubMeth(_s,"ToStr",__ToStr);
function __ToStr(){
return "errorCode="+(_s.errorCode!=null?_s.errorCode:"null")+
", index="+_s.index+
", severity="+_s.severity+
", scope="+_s.scope+
", stream=("+_s.stream.ToStr()+")";
}








if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(StreamerError,"StreamerError");











function Monitor(){
var _s=this;


if(_s!=STAT_INIT)_s._sessionId=0;


if(_s!=STAT_INIT)_s._streamer=null;

if(_s!=STAT_INIT)_s._streamerObject=null;

if(_s!=STAT_INIT)_s._eventQueue=null;
if(_s!=STAT_INIT)_s._contentInfo=null;
if(_s!=STAT_INIT)_s._nextHeartbeat=null;
if(_s!=STAT_INIT)_s._utils=null;


if(_s!=STAT_INIT)_s._playingState=ConvivaStreamerProxy.UNKNOWN;
if(_s!=STAT_INIT)_s._streamInfo=null;
if(_s!=STAT_INIT)_s._sessionFlags=1;

if(_s!=STAT_INIT)_s._startTimeMs=0;
if(_s!=STAT_INIT)_s._lastStateUpdateTimeMs=0;


if(_s!=STAT_INIT)_s._pauseJoinTimeStartTimeMs=0;
if(_s!=STAT_INIT)_s._pauseJointTimeTotalMs=0;


if(_s!=STAT_INIT)_s._cumulativeTimePerState=null;






if(_s!=STAT_INIT)_s._joinTimeMs=-1;
if(_s!=STAT_INIT)_s._bufferingEventCount=0;



if(_s!=STAT_INIT)_s._nominalPlayingBitsTotal=0;

if(_s!=STAT_INIT)_s._encodedFps=-1;
if(_s!=STAT_INIT)_s._contentLengthSec=-1;


if(_s!=STAT_INIT)_s._playingFpsObservationCount=0;

if(_s!=STAT_INIT)_s._playingFpsTotal=0;

function _constr(streamer,eventQueue,contentInfo,sessionId){

_s._eventQueue=eventQueue;
_s._utils=Utils.getInstance();
_s._contentInfo=contentInfo;
_s._sessionId=sessionId;
_s._nextHeartbeat=new DictionaryCS();
_s._streamerObject=streamer;

_s._startTimeMs=0;
_s._lastStateUpdateTimeMs=0;

_s._pauseJoinTimeStartTimeMs=0;
_s._pauseJointTimeTotalMs=0;


_s._cumulativeTimePerState=new DictionaryCS();
var _for_array_1=PlayerStates.stateToInt.KeyValuePairs;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var statePair=_for_array_1[_for_idx_2];

_s._cumulativeTimePerState.SetValue(statePair.Value,0);
}

_s._joinTimeMs=-1;
_s._bufferingEventCount=0;

_s._nominalPlayingBitsTotal=0;

_s._encodedFps=-1;
_s._contentLengthSec=-1;
_s._playingFpsObservationCount=0;
_s._playingFpsTotal=0;
}

defPubMeth(_s,"start",__start);
function __start(nowMs){
_s._startTimeMs=nowMs;
_s._lastStateUpdateTimeMs=nowMs;
_s.buildInitialStreamInfo();

_s.attachStreamer(_s._streamerObject);
_s._streamerObject=null;
}


defPubMeth(_s,"attachStreamer",__attachStreamer);
function __attachStreamer(streamerObject){
_s._utils.logSession("Monitor.attachStreamer()",_s._sessionId);
if(_s._streamer!=null){
_s._utils.logSession("Monitor.attachStreamer(): detach current streamer first",_s._sessionId);
return;
}
if(streamerObject==null){
_s._utils.logSession("Monitor.attachStreamer(): received a null streamer",_s._sessionId);
_s.SetPlayingState(ConvivaStreamerProxy.NOT_MONITORED);
return;
}


_s._streamer=Monitor.wrapInConvivaStreamerProxy(streamerObject,_s._sessionId);

_s._sessionFlags=_s._streamer.GetCapabilities();
_s.SetPlayingState(ConvivaStreamerProxy.UNKNOWN);


_s._streamer.SetMonitoringNotifier(_s.notificationFromStreamerProxy);

_s._lastStateUpdateTimeMs=_s._utils.epochTimeMs();
}


defPubMeth(_s,"detachStreamer",__detachStreamer);
function __detachStreamer(){
_s._utils.logSession("Monitor.detachStreamer()",_s._sessionId);
_s.updateMetrics();
if(_s._streamer!=null){
_s._streamer.Cleanup();
_s.SetPlayingState(ConvivaStreamerProxy.NOT_MONITORED);
_s._streamer=null;
}
}


defPubMeth(_s,"pauseJoinTime",__pauseJoinTime);
function __pauseJoinTime(){
_s._utils.logSession("Monitor.pauseJoinTime()",_s._sessionId);
if(_s._pauseJoinTimeStartTimeMs==0){
_s._pauseJoinTimeStartTimeMs=_s._utils.epochTimeMs();

var newState=new DictionaryCS();
var oldState=new DictionaryCS();
newState.SetValue("pj",true);
oldState.SetValue("pj",false);
_s.declareStateChange(newState,oldState);
}

}






defPubMeth(_s,"resumeJoinTime",__resumeJoinTime);
function __resumeJoinTime(addEvent){
_s._utils.logSession("Monitor.resumeJoinTime()",_s._sessionId);
if(_s._pauseJoinTimeStartTimeMs>0){
_s._pauseJointTimeTotalMs+=(_s._utils.epochTimeMs()-_s._pauseJoinTimeStartTimeMs);
if(addEvent){
var newState=new DictionaryCS();
var oldState=new DictionaryCS();
newState.SetValue("pj",false);
oldState.SetValue("pj",true);
_s.declareStateChange(newState,oldState);
}
}
_s._pauseJoinTimeStartTimeMs=0;
}


defGet(_s,"streamer",__get_streamer);
function __get_streamer(){return _s._streamer;}

defPrivMeth(_s,"buildInitialStreamInfo",__buildInitialStreamInfo);
function __buildInitialStreamInfo(){
var initialBitrateKbps=-1;
var initialResource=null;
var initialCdnName=ConvivaContentInfo.CDN_NAME_OTHER;

if(_s._contentInfo!=null){
initialCdnName=_s._contentInfo.defaultReportingCdnName;

if(_s._contentInfo.defaultReportingResource==null||
_s._contentInfo.defaultReportingResource==ConvivaContentInfo.NO_RESOURCE){
initialResource=initialCdnName;
}else{
initialResource=_s._contentInfo.defaultReportingResource;
}
initialBitrateKbps=_s._contentInfo.defaultReportingBitrateKbps;
}

_s._streamInfo=new StreamInfo(initialBitrateKbps,initialCdnName,initialResource,-1,-1,-1);
}



defPrivMeth(_s,"notificationFromStreamerProxy",__notificationFromStreamerProxy);
function __notificationFromStreamerProxy(notificationName,arg){
_s._utils.runProtected(
function(){
switch(notificationName){
case "PlayingStateChange":
var newState=(arg);
_s.OnPlayingStateChange(newState);
break;
case "StreamInfoChange":
var newInfo=(arg);
_s.SetStream(newInfo);
break;
case "ErrorChange":
var newError=(arg);
_s.OnError(newError);
break;
case "MetadataChange":
_s.OnMetadata(arg);
break;
case "Log":
var logMsg=(arg);
_s._utils.logSession(logMsg,_s._sessionId);
break;
}
},"notificationFromStreamerProxy");
}


defPrivMeth(_s,"OnPlayingStateChange",__OnPlayingStateChange);
function __OnPlayingStateChange(newPlayingState){
_s.updateStateCumulativeTime();
if(_s._playingState==newPlayingState){
return;
}

var hasJoined=_s._joinTimeMs>=0;
var newState=new DictionaryCS();
var oldState=new DictionaryCS();
newState.SetValue("ps",PlayerStates.stringToInt(newPlayingState));
oldState.SetValue("ps",PlayerStates.stringToInt(_s._playingState));


if(!hasJoined&&newPlayingState==ConvivaStreamerProxy.PLAYING){

_s._cumulativeTimePerState.SetValue(PlayerStates.eBuffering,0);


if(_s._pauseJoinTimeStartTimeMs>0){
_s.resumeJoinTime(false);
newState.SetValue("pj",false);
oldState.SetValue("pj",true);
}

_s._joinTimeMs=slint.Cast(_s._utils.epochTimeMs()-_s._startTimeMs-_s._pauseJointTimeTotalMs);

if(_s._joinTimeMs<0){
_s._joinTimeMs=0;
}
}
if(hasJoined&&newPlayingState==ConvivaStreamerProxy.BUFFERING){
_s._bufferingEventCount++;
}
_s._utils.logSession("Monitor: change playing state to "+newPlayingState,_s._sessionId);
_s._playingState=newPlayingState;
_s.declareStateChange(newState,oldState);
}


defPrivMeth(_s,"SetPlayingState",__SetPlayingState);
function __SetPlayingState(newState){
if(_s._playingState==newState){
return;
}
_s.OnPlayingStateChange(newState);
}


defPubMeth(_s,"SetStream",__SetStream);
function __SetStream(targetStream){
if(targetStream==null){
return;
}







if(_s._streamer!=null){
if(targetStream.bitrateKbps==_s._streamer.GetBitrateKbps()){

targetStream.bitrateKbps=-2;
}
if(targetStream.cdnName==_s._streamer.GetCdnName()){

targetStream.cdnName=null;
}
if(targetStream.resource==_s._streamer.GetResource()){

targetStream.resource=null;
}
}


if(targetStream.resource==null&&targetStream.cdnName!=null&&_s._streamInfo.cdnName==_s._streamInfo.resource){
targetStream.resource=targetStream.cdnName;
}
if(targetStream.bitrateKbps<=-2)targetStream.bitrateKbps=_s._streamInfo.bitrateKbps;
if(targetStream.cdnName==null)targetStream.cdnName=_s._streamInfo.cdnName;
if(targetStream.resource==null||targetStream.resource==ConvivaContentInfo.NO_RESOURCE)targetStream.resource=_s._streamInfo.resource;
if(!_s._streamInfo.equals(targetStream)){
_s.updateStateCumulativeTime();
_s.enqueueStreamChangeEvent(_s._streamInfo,targetStream);
_s._streamInfo=targetStream;
}
}


defPubMeth(_s,"OnError",__OnError);
function __OnError(e){

_s.declareError(e.errorCode,(e.severity==StreamerError.SEVERITY_FATAL));
}

defPrivMeth(_s,"OnMetadata",__OnMetadata);
function __OnMetadata(metadata){

var metadataDict=Lang.DictionaryFromRepr(metadata);
if(metadataDict.ContainsKey(ConvivaStreamerProxy.METADATA_ENCODED_FRAMERATE)){
_s._encodedFps=slint.Cast(_s._utils.parseNumber(metadataDict.GetValue(ConvivaStreamerProxy.METADATA_ENCODED_FRAMERATE),-1));
_s._utils.logSession("Monitor: received "+ConvivaStreamerProxy.METADATA_ENCODED_FRAMERATE+" metadata: "+_s._encodedFps,_s._sessionId);
}
if(metadataDict.ContainsKey(ConvivaStreamerProxy.METADATA_DURATION)){
_s._contentLengthSec=slint.Cast(_s._utils.parseNumber(metadataDict.GetValue(ConvivaStreamerProxy.METADATA_DURATION),-1));
_s._utils.logSession("Monitor: received "+ConvivaStreamerProxy.METADATA_DURATION+" metadata: "+_s._contentLengthSec,_s._sessionId);
}
}


defPubMeth(_s,"updateHeartbeat",__updateHeartbeat);
function __updateHeartbeat(heartbeat){
_s.updateMetrics();


var playingTime=_s._cumulativeTimePerState.GetValue(PlayerStates.ePlaying);
var hasJoined=(_s._joinTimeMs>=0);
var bufferingTime=0;
if(hasJoined){
bufferingTime=_s._cumulativeTimePerState.GetValue(PlayerStates.eBuffering);

}


var averageBitrateKbps=-1;
if(hasJoined){
averageBitrateKbps=slint.Cast((_s._nominalPlayingBitsTotal+0.0)/playingTime);
}
var averageFps=-1;
if(_s._playingFpsObservationCount>0){
averageFps=slint.Cast((_s._playingFpsTotal+0.0)/_s._playingFpsObservationCount);
}
NativeLang.setDictValue(heartbeat,"ps",PlayerStates.stringToInt(_s._playingState));
NativeLang.setDictValue(heartbeat,"pj",(_s._pauseJoinTimeStartTimeMs>0?true:false));
NativeLang.setDictValue(heartbeat,"sf",_s._sessionFlags);
NativeLang.setDictValue(heartbeat,"tpt",playingTime);
NativeLang.setDictValue(heartbeat,"tbt",bufferingTime);
NativeLang.setDictValue(heartbeat,"tpst",_s._cumulativeTimePerState.GetValue(PlayerStates.ePaused));
NativeLang.setDictValue(heartbeat,"tst",_s._cumulativeTimePerState.GetValue(PlayerStates.eStopped));
NativeLang.setDictValue(heartbeat,"jt",_s._joinTimeMs);
NativeLang.setDictValue(heartbeat,"tbe",_s._bufferingEventCount);
if(_s._contentLengthSec>0){
NativeLang.setDictValue(heartbeat,"cl",_s._contentLengthSec);
}
if(_s._streamInfo.GetBitrateKbps()>0){
NativeLang.setDictValue(heartbeat,"cbr",_s._streamInfo.GetBitrateKbps());
NativeLang.setDictValue(heartbeat,"br",_s._streamInfo.GetBitrateKbps());
}
if(averageBitrateKbps>0){
NativeLang.setDictValue(heartbeat,"abr",averageBitrateKbps);
}
NativeLang.setDictValue(heartbeat,"rs",_s._streamInfo.GetResource());
NativeLang.setDictValue(heartbeat,"cdn",_s._streamInfo.GetCdnName());

if(_s._encodedFps>=0){
NativeLang.setDictValue(heartbeat,"efps",_s._encodedFps);
}
if(averageFps>=0){
NativeLang.setDictValue(heartbeat,"afps",averageFps);
}
}

defPubMeth(_s,"cleanup",__cleanup);
function __cleanup(){
if(_s._streamer!=null){
_s._streamer.Cleanup();
}
_s._streamer=null;
_s._streamerObject=null;
_s._eventQueue=null;
_s._contentInfo=null;
_s._nextHeartbeat=null;
_s._streamInfo=null;
_s._cumulativeTimePerState=null;
_s._utils=null;
}

defPrivMeth(_s,"updateMetrics",__updateMetrics);
function __updateMetrics(){
if(_s._streamer==null)return;
if(_s._playingState==ConvivaStreamerProxy.PLAYING){
var fps=_s._streamer.GetRenderedFrameRate();
if(fps>=0){
_s._playingFpsTotal+=fps;
_s._playingFpsObservationCount++;
}
}
_s.updateStateCumulativeTime();
}

defPrivMeth(_s,"enqueueEvent",__enqueueEvent);
function __enqueueEvent(type,eventData){
_s._eventQueue.enqueueEvent(type,eventData,slint.Cast(_s._utils.epochTimeMs()-_s._startTimeMs));
}

defPrivMeth(_s,"enqueueStreamChangeEvent",__enqueueStreamChangeEvent);
function __enqueueStreamChangeEvent(oldStream,newStream){
var newState=new DictionaryCS();
var oldState=new DictionaryCS();
if(oldStream.GetBitrateKbps()!=newStream.GetBitrateKbps()&&newStream.GetBitrateKbps()>0){
oldState.SetValue("br",oldStream.GetBitrateKbps());
newState.SetValue("br",newStream.GetBitrateKbps());
_s._utils.logSession("Monitor: change bitrate from "+oldState.GetValue("br")+" to "+newState.GetValue("br"),_s._sessionId);
}
if(oldStream.GetCdnName()!=newStream.GetCdnName()){
oldState.SetValue("cdn",oldStream.GetCdnName());
newState.SetValue("cdn",newStream.GetCdnName());
_s._utils.logSession("Monitor: change cdnName from "+oldState.GetValue("cdn")+" to "+newState.GetValue("cdn"),_s._sessionId);
}
if(oldStream.GetResource()!=newStream.GetResource()){
oldState.SetValue("rs",oldStream.GetResource());
newState.SetValue("rs",newStream.GetResource());
_s._utils.logSession("Monitor: change resource from "+oldState.GetValue("rs")+" to "+newState.GetValue("rs"),_s._sessionId);
}
_s.declareStateChange(newState,oldState);
}


defPrivMeth(_s,"updateStateCumulativeTime",__updateStateCumulativeTime);
function __updateStateCumulativeTime(){
var now=_s._utils.epochTimeMs();
var playingStateInt=PlayerStates.stringToInt(_s._playingState);
if(_s._playingState!=ConvivaStreamerProxy.UNKNOWN){
var delta=slint.Cast(now-_s._lastStateUpdateTimeMs);
_s._cumulativeTimePerState.SetValue(playingStateInt,_s._cumulativeTimePerState.GetValue(playingStateInt)+delta);

var bitrateKbps=_s._streamInfo.GetBitrateKbps();
if(_s._playingState==ConvivaStreamerProxy.PLAYING&&bitrateKbps!=-1){
_s._nominalPlayingBitsTotal+=(delta*bitrateKbps);
}
}
_s._lastStateUpdateTimeMs=now;
}

defPrivMeth(_s,"declareError",__declareError);
function __declareError(errorMsg,isFatal){
if(_s._joinTimeMs<0&&isFatal){

_s._joinTimeMs=-2;
}
var data=new DictionaryCS();
data.SetValue("ft",isFatal);
data.SetValue("err",errorMsg);
_s.enqueueEvent("CwsErrorEvent",data);
}

defPrivMeth(_s,"declareStateChange",__declareStateChange);
function __declareStateChange(newState,oldState){

var newStateNative=Lang.StringDictionaryToRepr(newState);
var oldStateNative=Lang.StringDictionaryToRepr(oldState);
var data=new DictionaryCS();
data.SetValue("new",newStateNative);
if(oldState!=null){
data.SetValue("old",oldStateNative);
}
_s.enqueueEvent("CwsStateChangeEvent",data);
}

defStatMeth(_s,Monitor,"wrapInConvivaStreamerProxy",__wrapInConvivaStreamerProxy);
function __wrapInConvivaStreamerProxy(streamer,sessionId){







var realSamsungStreamerProxy=null;
try{
if(streamer.getAttribute&&streamer.getAttribute("classid").indexOf("clsid:SAMSUNG-INFOLINK")>=0){
realSamsungStreamerProxy=new SamsungStreamerProxy(streamer);
realSamsungStreamerProxy.startMonitoring();
}
}catch(e){}
if(realSamsungStreamerProxy){
return realSamsungStreamerProxy;
}else if(streamer.hasOwnProperty('getStreamerType')&&streamer.getStreamerType()=='Samsung'){
return SamsungStreamerProxy.createSamsungStreamerProxy(streamer);
}else if(streamer.setQosData!==undefined&&streamer.licenseResponse!==undefined){
return new PlayStationTouchFactorStreamerProxy();
}else if(streamer.codecs!==undefined&&streamer.maxBufferLength!==undefined){
return new PlayStationLibjscriptStreamerProxy();
}else if(streamer.networkState!==undefined&&streamer.readyState!==undefined){
return new Html5ConvivaStreamerProxy(streamer);
}else if(streamer.currentPTS!==undefined&&streamer.availableAudioStreams!==undefined){
return new PlayStationTrilithiumStreamerProxy(streamer);
}else if(streamer.mediaElementAdapter!==undefined){
return new Xbox1ConvivaStreamerProxy(streamer);
}else if(streamer.MbId!==undefined&&streamer.blockedParams!==undefined){
return new ConvivaOoyalaStreamerProxy(streamer);
}else if(streamer.mb!==undefined&&(streamer.mb.MbId!==undefined&&streamer.mb.blockedParams!==undefined)){
return new ConvivaOoyalaStreamerProxy(streamer.mb);
}else if(streamer.textTrackDisplay!==undefined&&streamer.mediaLoader!==undefined){
return new ConvivaVideoJSStreamerProxy(streamer);
}else{
return streamer;
}
}
if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(Monitor,"Monitor");







function EventQueue(){
var _s=this;


if(_s!=STAT_INIT)_s._events=null;
if(_s!=STAT_INIT)_s._nextSeqNumber=0;

function _constr(){
_s._events=NativeLang.makeList();
}

defPubMeth(_s,"enqueueEvent",__enqueueEvent);
function __enqueueEvent(type,data,timeSinceSessionStart){
data.SetValue("t",type);
data.SetValue("st",timeSinceSessionStart);
data.SetValue("seq",_s._nextSeqNumber);
_s._nextSeqNumber++;
NativeLang.addListValue(_s._events,Lang.StringDictionaryToRepr(data));
}


defPubMeth(_s,"flushEvents",__flushEvents);
function __flushEvents(){
var currentEvents=_s._events;
_s._events=NativeLang.makeList();
return currentEvents;
}
if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(EventQueue,"EventQueue");







function Session(){
var _s=this;

if(_s!=STAT_INIT)_s._contentInfo=null;


if(_s!=STAT_INIT)_s._nativeReprTags=null;
if(_s!=STAT_INIT)_s._utils=null;
if(_s!=STAT_INIT)_s._settings=null;

if(_s!=STAT_INIT)_s._monitor=null;

if(_s!=STAT_INIT)_s._eventQueue=null;

if(_s!=STAT_INIT)_s._clientIdWaiter=null;
if(_s!=STAT_INIT)_s._heartbeatTimer=null;
if(_s!=STAT_INIT)_s._encodeHeartbeatTimer=null;




if(_s==STAT_INIT)Session._sendLogs=false;

if(_s!=STAT_INIT)_s._sessionId=0;

if(_s!=STAT_INIT)_s._startTimeMs=0;
if(_s!=STAT_INIT)_s._heartbeatSequenceNumber=0;

function _constr(streamer,contentInfo,global){
_s._contentInfo=contentInfo;
_s._utils=Utils.getInstance();
_s._settings=_s._utils.getSettings();
_s._sessionId=_s._utils.randInt();

var langTags=Lang.DictionaryFromRepr(_s._contentInfo.tags);
var keysToCorrect=new ListCS();
var _for_array_1=langTags.Keys;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var tkey=_for_array_1[_for_idx_2];

if(langTags.GetValue(tkey)==null){
keysToCorrect.Add(tkey);
}
}
var _for_array_3=keysToCorrect.Values;
for(var _for_idx_4=0;_for_idx_4<_for_array_3.length;_for_idx_4++){
var tkey1=_for_array_3[_for_idx_4];

_s.log("WARNING: correcting null value for tag "+tkey1);
NativeLang.setDictValue(_s._contentInfo.tags,tkey1,"null");
}
_s._nativeReprTags=Lang.StringDictionaryToRepr(_s._contentInfo.tags);

_s._eventQueue=new EventQueue();

if(!global){
_s._monitor=new Monitor(streamer,_s._eventQueue,_s._contentInfo,_s._sessionId);
}
}

defPubMeth(_s,"start",__start);
function __start(){
if(_s._monitor!=null){
_s.log("Session.start(): assetName="+_s._contentInfo.assetName);
}
_s._startTimeMs=_s._utils.epochTimeMs();
if(_s._monitor!=null){
_s._monitor.start(_s._startTimeMs);
}
_s._heartbeatSequenceNumber=0;

if(_s._utils.clientIdLoadingDone==null){

_s.sendHeartbeat();
}else{



_s._clientIdWaiter=_s.onClientIdLoaded;
_s._utils.clientIdLoadingDone.AddHandler(_s._clientIdWaiter);
}
_s._heartbeatTimer=null;
_s.resetHeartbeatTimer();
}

defPubMeth(_s,"cleanup",__cleanup);
function __cleanup(){
_s.log("Session.cleanup()"+_s.sessionTypeTag());
if(_s._heartbeatTimer!=null){
_s._heartbeatTimer.cleanup();
}
_s._heartbeatTimer=null;
_s._utils.logSession("Schedule the last hb before session cleanup"+_s.sessionTypeTag(),_s._sessionId);


if(_s._monitor!=null){
_s.enqueueSessionEndEvent();
}

var urgentHb=_s.makeHeartbeat();
if(urgentHb!=null){
_s.encodeAndPostHeartbeat(urgentHb,
function(){

_s.cleanupAll();
});
}else{

_s.cleanupAll();
}
}

defPrivMeth(_s,"enqueueSessionEndEvent",__enqueueSessionEndEvent);
function __enqueueSessionEndEvent(){
var eventData=new DictionaryCS();
_s._eventQueue.enqueueEvent("CwsSessionEndEvent",eventData,slint.Cast(_s._utils.epochTimeMs()-_s._startTimeMs));
}






defPubMeth(_s,"pauseJoinTime",__pauseJoinTime);
function __pauseJoinTime(){
if(_s._monitor!=null){
_s._monitor.pauseJoinTime();
}
}




defPubMeth(_s,"resumeJoinTime",__resumeJoinTime);
function __resumeJoinTime(){
if(_s._monitor!=null){
_s._monitor.resumeJoinTime(true);
}
}





defPubMeth(_s,"adStart",__adStart);
function __adStart(){


_s.pauseJoinTime();
}




defPubMeth(_s,"adEnd",__adEnd);
function __adEnd(){


_s.resumeJoinTime();
}





defPubMeth(_s,"detachStreamer",__detachStreamer);
function __detachStreamer(){
_s._monitor.detachStreamer();
}




defPubMeth(_s,"attachStreamer",__attachStreamer);
function __attachStreamer(streamer){
_s._monitor.attachStreamer(streamer);
}


defPrivMeth(_s,"resetHeartbeatTimer",__resetHeartbeatTimer);
function __resetHeartbeatTimer(){
if(_s._heartbeatTimer!=null){
_s._heartbeatTimer.cleanup();
}
_s._heartbeatTimer=_s._utils.createTimer(_s.sendHeartbeat,_s._settings.heartbeatIntervalMs,"sendHeartbeat");
}

defPrivMeth(_s,"cleanupAll",__cleanupAll);
function __cleanupAll(){
if(_s._clientIdWaiter!=null){
_s._utils.clientIdLoadingDone.DeleteHandler(_s._clientIdWaiter);
_s._clientIdWaiter=null;
}
if(_s._monitor!=null){
_s._monitor.cleanup();
_s._monitor=null;
}
if(_s._encodeHeartbeatTimer!=null){
_s._encodeHeartbeatTimer.cleanup();
_s._encodeHeartbeatTimer=null;
}
if(_s._eventQueue!=null){
_s._eventQueue.flushEvents();
_s._eventQueue=null;
}
_s._contentInfo=null;
_s._nativeReprTags=null;
_s._settings=null;
_s._utils=null;
}

defPrivMeth(_s,"log",__log);
function __log(message){
_s._utils.logSession(message,_s._sessionId);
}


defPubMeth(_s,"reportError",__reportError);
function __reportError(err){
_s.log("Session.reportError()");
if(_s._monitor!=null){

_s._monitor.OnError(err);
}
}


defPubMeth(_s,"setCurrentStreamInfo",__setCurrentStreamInfo);
function __setCurrentStreamInfo(streamInfo){
_s.log("Session.setCurrentStreamInfo(): bitrate="+streamInfo.bitrateKbps+" cdnName="+streamInfo.cdnName+" resource="+streamInfo.resource);
if(_s._monitor!=null&&_s._monitor.streamer!=null){

_s._monitor.streamer.SetStream(streamInfo);
}
}


defPubMeth(_s,"setCurrentStreamMetadata",__setCurrentStreamMetadata);
function __setCurrentStreamMetadata(metadata){
_s.log("Session.setCurrentStreamMetadata()");
if(_s._monitor!=null&&_s._monitor.streamer!=null){

_s._monitor.streamer.SetMetadata(metadata);
}
}

defPubMeth(_s,"setCdnNameOrResource",__setCdnNameOrResource);
function __setCdnNameOrResource(resource){
_s.log("Session.setCdnNameOrResource()");
if(_s._monitor!=null){
var newStream=new StreamInfo(-2,resource,resource,-1,-1,-1);
_s._monitor.SetStream(newStream);
}
}

defPubMeth(_s,"sendCustomEvent",__sendCustomEvent);
function __sendCustomEvent(name,eventAttrs){
_s.log("Session.sendEvent(): eventName="+name+_s.sessionTypeTag());
var eventData=new DictionaryCS();
eventData.SetValue("name",name);

var eventAttrsNative=Lang.StringDictionaryToRepr(eventAttrs);

eventData.SetValue("attr",eventAttrsNative);
_s._eventQueue.enqueueEvent("CwsCustomEvent",eventData,slint.Cast(_s._utils.epochTimeMs()-_s._startTimeMs));
}

defPrivMeth(_s,"sendHeartbeat",__sendHeartbeat);
function __sendHeartbeat(){
var heartbeat=null;
if(_s._encodeHeartbeatTimer!=null){
_s._encodeHeartbeatTimer.cleanup();
}
_s._encodeHeartbeatTimer=_s._utils.scheduleAction(
function(){
heartbeat=_s.makeHeartbeat();
if(heartbeat!=null){
_s._encodeHeartbeatTimer=_s._utils.scheduleAction(
function(){
_s.encodeAndPostHeartbeat(heartbeat,null);
_s._encodeHeartbeatTimer=null;
},1,"encodeAndSendHeartbeat");
}
},1,"makeHeartbeat");
}







defPrivMeth(_s,"makeHeartbeat",__makeHeartbeat);
function __makeHeartbeat(){
var heartbeat={};
NativeLang.setDictValue(heartbeat,"t","CwsSessionHb");
NativeLang.setDictValue(heartbeat,"cid",_s._settings.customerKey);
NativeLang.setDictValue(heartbeat,"clid",_s._utils.clientId);
NativeLang.setDictValue(heartbeat,"sid",_s._sessionId);
NativeLang.setDictValue(heartbeat,"seq",_s._heartbeatSequenceNumber);
NativeLang.setDictValue(heartbeat,"pver",_s._settings.protocolVersion);
NativeLang.setDictValue(heartbeat,"clv",_s._settings.clientVersion);
NativeLang.setDictValue(heartbeat,"iid",_s._settings.clientInstanceId);
var platformMetadata=Lang.StringDictionaryToRepr(_s._settings.platformApi.getPlatformMetadata());
if(platformMetadata!=null){
NativeLang.setDictValue(heartbeat,"pm",platformMetadata);
}
if(_s._utils.device!=null){
NativeLang.setDictValue(heartbeat,"dv",_s._utils.device);
}
if(_s._utils.deviceVersion!=null){
NativeLang.setDictValue(heartbeat,"dvv",_s._utils.deviceVersion);
}
if(_s._utils.deviceType!=null){
NativeLang.setDictValue(heartbeat,"dvt",_s._utils.deviceType);
}else if(_s._contentInfo.deviceType!=null){
NativeLang.setDictValue(heartbeat,"dvt",_s._contentInfo.deviceType);
}
if(_s._utils.os!=null){
NativeLang.setDictValue(heartbeat,"os",_s._utils.os);
}
if(_s._utils.osVersion!=null){
NativeLang.setDictValue(heartbeat,"osv",_s._utils.osVersion);
}
if(_s._utils.platform!=null){
NativeLang.setDictValue(heartbeat,"pt",_s._utils.platform);
}
if(_s._contentInfo.viewerId!=null){
NativeLang.setDictValue(heartbeat,"vid",_s._contentInfo.viewerId);
}
if(_s._contentInfo.streamUrl!=null){
NativeLang.setDictValue(heartbeat,"url",_s._contentInfo.streamUrl);
}
if(_s._contentInfo.playerName!=null){
NativeLang.setDictValue(heartbeat,"pn",_s._contentInfo.playerName);
}
NativeLang.setDictValue(heartbeat,"tags",_s._nativeReprTags);

if(_s._monitor!=null){
NativeLang.setDictValue(heartbeat,"an",_s._contentInfo.assetName);
NativeLang.setDictValue(heartbeat,"lv",_s._contentInfo.isLive);
_s._monitor.updateHeartbeat(heartbeat);
}else{

NativeLang.setDictValue(heartbeat,"sf",0);
}
var currentEvents=_s._eventQueue.flushEvents();
NativeLang.setDictValue(heartbeat,"evs",currentEvents);


if(_s._monitor==null&&NativeLang.listCount(currentEvents)==0){
return null;
}

if(Session._sendLogs){
NativeLang.setDictValue(heartbeat,"lg",Lang.ListToRepr(_s._utils.getLogs(_s._sessionId)));
}

NativeLang.setDictValue(heartbeat,"st",slint.Cast(_s._utils.epochTimeMs()-_s._startTimeMs));
NativeLang.setDictValue(heartbeat,"cts",(_s._utils.epochTimeMs()/1000.0));
_s._heartbeatSequenceNumber++;
return heartbeat;
}

defPrivMeth(_s,"sessionTypeTag",__sessionTypeTag);
function __sessionTypeTag(){
if(_s._monitor==null)
return " (global session)";
return "";
}




defPrivMeth(_s,"encodeAndPostHeartbeat",__encodeAndPostHeartbeat);
function __encodeAndPostHeartbeat(heartbeat,afterPostCbk){
var jsonHeartbeat=_s._utils.jsonEncode(heartbeat);
var url=_s._settings.gatewayUrl+_s._settings.gatewayPath;
var contentType="application/json";
_s.log("Send HB["+(_s._heartbeatSequenceNumber-1)+"]"+_s.sessionTypeTag());
_s._utils.httpRequest(true,url,jsonHeartbeat,contentType,_s.onHeartbeatResponse);
if(afterPostCbk!=null){
afterPostCbk();
}
}



defPrivMeth(_s,"onHeartbeatResponse",__onHeartbeatResponse);
function __onHeartbeatResponse(isSuccess,jsonResponse){
if(_s._utils!=null){
_s._utils.runProtected(
function(){
if(isSuccess){
var decodedResponse=_s._utils.jsonDecode(jsonResponse);
if(decodedResponse!=null){
if(decodedResponse.ContainsKey("clid")){
_s._utils.setClientIdFromServer(Lang.ToString((decodedResponse.GetValue("clid"))),false);
}
var newSendLogs=(decodedResponse.ContainsKey("slg")&&Boolean(decodedResponse.GetValue("slg")));
if(newSendLogs!=Session._sendLogs){
_s.log("Turning "+(newSendLogs?"on":"off")+" sending of logs");
Session._sendLogs=newSendLogs;
}
if(decodedResponse.ContainsKey("hbi")){
var heartbeatIntervalSec=slint.Cast(decodedResponse.GetValue("hbi"));
if(1000*heartbeatIntervalSec!=_s._settings.heartbeatIntervalMs){
_s.log("Received hbInterval from server "+heartbeatIntervalSec);
_s._settings.heartbeatIntervalMs=1000*heartbeatIntervalSec;
if(_s._heartbeatTimer!=null){
_s.resetHeartbeatTimer();
}
}
}
if(decodedResponse.ContainsKey("gw")){
var gatewayUrl=(decodedResponse.GetValue("gw"));
if(gatewayUrl!=_s._settings.gatewayUrl){
_s.log("Received gatewayUrl from server "+gatewayUrl);
_s._settings.gatewayUrl=gatewayUrl;
}
}
}else{
_s.log("Decoded heartbeat response is null.");
}
}else{
_s.log("Received no response (or a bad response) to heartbeat POST request.");
}
},"onHeartbeatResponse");
}
}

defPrivMeth(_s,"onClientIdLoaded",__onClientIdLoaded);
function __onClientIdLoaded(){

_s._utils.clientIdLoadingDone.DeleteHandler(_s._clientIdWaiter);
_s._clientIdWaiter=null;
_s.sendHeartbeat();
}

defPubMeth(_s,"initialResourceBitrateSelection",__initialResourceBitrateSelection);
function __initialResourceBitrateSelection(){
var proxy=_s._monitor.streamer;
throw new Error("Not implemented");
}

defPubMeth(_s,"midStreamResourceBitrateSelection",__midStreamResourceBitrateSelection);
function __midStreamResourceBitrateSelection(switchTriggers){

throw new Error("Not implemented");
}
if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(Session,"Session");








function SessionFactory(){
var _s=this;
if(_s!=STAT_INIT)_s.lastSessionId=0;

if(_s!=STAT_INIT)_s._utils=null;
if(_s!=STAT_INIT)_s._settings=null;
if(_s!=STAT_INIT)_s._nextSessionId=0;
if(_s!=STAT_INIT)_s._sessionsById=null;

function _constr(){
_s._utils=Utils.getInstance();
_s._settings=_s._utils.getSettings();
_s._nextSessionId=0;
_s._sessionsById=new DictionaryCS();
_s.lastSessionId=0;
}

defPubMeth(_s,"cleanup",__cleanup);
function __cleanup(){
_s._utils=null;
_s._settings=null;
if(_s._sessionsById!=null){
var _for_array_1=_s._sessionsById.KeyValuePairs;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var sessionPair=_for_array_1[_for_idx_2];

var sess=sessionPair.Value;
sess.cleanup();
}
}
_s._sessionsById=null;
_s._nextSessionId=0;
}


defPubMeth(_s,"newSessionId",__newSessionId);
function __newSessionId(){
var sessionId=_s._nextSessionId;
_s._nextSessionId++;
return sessionId;
}

defPubMeth(_s,"makeSession",__makeSession);
function __makeSession(streamer,contentInfo,sessionId,global){
var session=new Session(streamer,contentInfo,global);
_s.addSession(sessionId,session);
_s.lastSessionId=sessionId;
session.start();
return session;
}

defPubMeth(_s,"getSession",__getSession);
function __getSession(sessionId){
if(_s._sessionsById.ContainsKey(sessionId)){
return _s._sessionsById.GetValue(sessionId);
}
if(sessionId==-1){
_s._utils.err("LivePass: invalid sessionId. LivePass not properly initialized yet?");
}else{
_s._utils.err("LivePass: invalid sessionId. Did you cleanup that session previously?");
}
return null;
}

defPubMeth(_s,"addSession",__addSession);
function __addSession(sessionId,session){
_s._sessionsById.SetValue(sessionId,session);
}

defPubMeth(_s,"removeSession",__removeSession);
function __removeSession(sessionId){
_s._sessionsById.Remove(sessionId);
}

defPubMeth(_s,"cleanupSession",__cleanupSession);
function __cleanupSession(sessionId){
var session=_s.getSession(sessionId);
if(session!=null){
_s.removeSession(sessionId);
session.cleanup();
}
}
if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(SessionFactory,"SessionFactory");














function Cleanable(){
var _s=this;


if(_s!=STAT_INIT)_s._cleanupAction=null;


if(_s==STAT_INIT)Cleanable._nextCleanupId=0;
if(_s!=STAT_INIT)_s._id=0;
if(_s!=STAT_INIT)_s._cleanupCollection=null;


function _constr(cleanupCollection){
_s._cleanupCollection=cleanupCollection;
_s._id=Cleanable._nextCleanupId;
Cleanable._nextCleanupId++;
_s._cleanupCollection.SetValue(_s._id,_s);
}

defPubMeth(_s,"setCleanupAction",__setCleanupAction);
function __setCleanupAction(cleanupAction){
_s._cleanupAction=cleanupAction;
}





defPubMeth(_s,"cleanup",__cleanup);
function __cleanup(){
if(_s._cleanupAction!=null){
_s._cleanupAction();
}
_s._cleanupCollection.Remove(_s._id);
}







defStatMeth(_s,Cleanable,"cleanupCollection",__cleanupCollection);
function __cleanupCollection(collection){

Utils.getInstance().log("cleanupCollection");
var toClean=new ListCS();
var _for_array_1=collection.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var o=_for_array_1[_for_idx_2];

toClean.Add(o);
}
var _for_array_3=toClean.Values;
for(var _for_idx_4=0;_for_idx_4<_for_array_3.length;_for_idx_4++){
var o=_for_array_3[_for_idx_4];

o.cleanup();
}
collection.Clear();
}

if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(Cleanable,"Cleanable");









function Eventer(){
var _s=this;
if(_s!=STAT_INIT)_s._handlers=undefined;

function _constr(){
_s._handlers=new ListCS();
}




defPubMeth(_s,"Cleanup",__Cleanup);
function __Cleanup(){
_s._handlers=new ListCS();
}

defPubMeth(_s,"AddHandler",__AddHandler);
function __AddHandler(handler){
_s._handlers.Add(handler);
}

defPubMeth(_s,"DeleteHandler",__DeleteHandler);
function __DeleteHandler(handler){
_s._handlers.Remove(handler);
}

defPubMeth(_s,"DispatchEvent",__DispatchEvent);
function __DispatchEvent(){
var _for_array_1=_s._handlers.Values;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var h=_for_array_1[_for_idx_2];

h();
}
}
if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(Eventer,"Eventer");










function NativeLang(){
var _s=this;





defStatMeth(_s,NativeLang,"setDictValue",__setDictValue);
function __setDictValue(dict,key,value){
dict[key]=value;
}

defStatMeth(_s,NativeLang,"makeList",__makeList);
function __makeList(){
return[];
}

defStatMeth(_s,NativeLang,"listCount",__listCount);
function __listCount(lst){
return lst.length;
}

defStatMeth(_s,NativeLang,"addListValue",__addListValue);
function __addListValue(list,value){
list.push(value);
}

defStatMeth(_s,NativeLang,"removeListValueAt",__removeListValueAt);
function __removeListValueAt(list,idx){
list.splice(idx,1);
}

defStatMeth(_s,NativeLang,"GetField",__GetField);
function __GetField(propName,obj){
return obj[propName];
}

defStatMeth(_s,NativeLang,"GetStringField",__GetStringField);
function __GetStringField(propName,obj){
var o=NativeLang.GetField(propName,obj);
if(o){
return o.toString();
}
return null;
}
}
statInit(NativeLang,"NativeLang");






function Settings(){
var _s=this;

if(_s!=STAT_INIT)_s.heartbeatIntervalMs=20000;

if(_s!=STAT_INIT)_s.customerKey=null;

if(_s!=STAT_INIT)_s.gatewayUrl="https://cws.conviva.com";
if(_s!=STAT_INIT)_s.gatewayPath="/0/wsg";

if(_s!=STAT_INIT)_s.protocolVersion="1.7";


if(_s!=STAT_INIT)_s.clientVersion="2.84.0.20794";


if(_s!=STAT_INIT)_s.clientInstanceId=0;


if(_s!=STAT_INIT)_s.loadDataTimeoutMs=10000;


if(_s!=STAT_INIT)_s.enableLogging=false;


if(_s!=STAT_INIT)_s.platformApi=null;


if(_s!=STAT_INIT)_s.allowUncaughtExceptions=false;

if(_s!=STAT_INIT)_s.pingComponentName="jscws";
if(_s!=STAT_INIT)_s.pingUrl="https://pings.conviva.com/ping.ping";



defPubMeth(_s,"changeSettings",__changeSettings);
function __changeSettings(settings){
if(settings==null)return;
var sobj=Lang.DictionaryFromRepr(settings);
var _for_array_1=sobj.Keys;
for(var _for_idx_2=0;_for_idx_2<_for_array_1.length;_for_idx_2++){
var key=_for_array_1[_for_idx_2];

var v=sobj.GetValue(key);
switch(key){
case "platformApi":
_s.platformApi=(v);
break;
case "gatewayUrl":
_s.gatewayUrl=(sobj.GetValue(key));
break;
case "heartbeatIntervalMs":
_s.heartbeatIntervalMs=slint.Cast(sobj.GetValue(key));
break;
case "enableLogging":
_s.enableLogging=Boolean(sobj.GetValue(key));
break;
case "allowUncaughtExceptions":
_s.allowUncaughtExceptions=Boolean(sobj.GetValue(key));
break;
default:
throw new Error("Unsupported settings: "+key);
}
}
}
}
statInit(Settings,"Settings");










function Utils(){
var _s=this;


if(_s==STAT_INIT)Utils._instance=null;
if(_s!=STAT_INIT)_s._referenceCount=0;


if(_s!=STAT_INIT)_s._settings=null;

if(_s==STAT_INIT)Utils.DEFAULT_CLIENT_ID="0";
























if(_s!=STAT_INIT)_s._loadClientIdTimeout=null;
if(_s!=STAT_INIT)_s.clientId=Utils.DEFAULT_CLIENT_ID;
if(_s!=STAT_INIT)_s.clientIdLoadingDone=null;


if(_s!=STAT_INIT)_s._pingUrl=null;
if(_s!=STAT_INIT)_s._cachedPingUrl=false;
if(_s!=STAT_INIT)_s._isSendingPing=false;

if(_s!=STAT_INIT)_s.protocolVersion=null;


if(_s!=STAT_INIT)_s.device=null;
if(_s!=STAT_INIT)_s.os=null;
if(_s!=STAT_INIT)_s.osVersion=null;
if(_s!=STAT_INIT)_s.deviceVersion=null;
if(_s!=STAT_INIT)_s.deviceType=null;
if(_s!=STAT_INIT)_s.platform=null;


if(_s!=STAT_INIT)_s._cleanables=null;



if(_s==STAT_INIT)Utils.MAX_SIZE_LOGBUFFER=32;
if(_s==STAT_INIT)Utils.logBuffer=new ListCS();



function _constr(settings){
_s._settings=settings;
_s._referenceCount=1;
_s._pingUrl=null;
_s._isSendingPing=false;
_s.protocolVersion=_s._settings.protocolVersion;

_s._cleanables=new DictionaryCS();


if(_s._settings.platformApi==null){
if(typeof PlayStationWebmafApi!=="undefined"){
_s._settings.platformApi=new PlayStationWebmafApi();
}else if(typeof PlayStationTouchFactorApi!=="undefined"){
_s._settings.platformApi=new PlayStationTouchFactorApi();
}else if(typeof PlayStationLibjscriptApi!=="undefined"){
_s._settings.platformApi=new PlayStationLibjscriptApi();
}else if(typeof Html5PlatformApi!=="undefined"){
_s._settings.platformApi=new Html5PlatformApi();
}else if(typeof PlayStationTrilithiumApi!=="undefined"){
_s._settings.platformApi=new PlayStationTrilithiumApi();
}else if(typeof Xbox1PlatformApi!=="undefined"){
_s._settings.platformApi=new Xbox1PlatformApi();
}

}
if(_s._settings.platformApi==null){
throw new Error("PlatformApi is null");
}


_s.device=_s._settings.platformApi.getDevice();
_s.deviceVersion=_s._settings.platformApi.getDeviceVersion();
_s.deviceType=_s._settings.platformApi.getDeviceType();
_s.os=_s._settings.platformApi.getOS();
_s.osVersion=_s._settings.platformApi.getOSVersion();


_s.platform="Js";

}







defStatMeth(_s,Utils,"CreateUtils",__CreateUtils);
function __CreateUtils(settings){
if(Utils._instance==null){
var s=new Settings();
s.changeSettings(settings);
Utils._instance=new Utils(s);
Utils._instance._start();
}else{
Utils._instance.getSettings().changeSettings(settings);
Utils._instance._referenceCount++;
}
return Utils._instance;
}






defStatMeth(_s,Utils,"getInstance",__getInstance);
function __getInstance(){
if(Utils._instance==null){
throw new Error("CreateUtils module has not been called");
}
return Utils._instance;
}

defPubMeth(_s,"getPlatformApi",__getPlatformApi);
function __getPlatformApi(){
return _s._settings.platformApi;
}

defPubMeth(_s,"getSettings",__getSettings);
function __getSettings(){
return _s._settings;
}

defPrivMeth(_s,"_start",___start);
function ___start(){

}


defPubMeth(_s,"cleanup",__cleanup);
function __cleanup(){
_s._referenceCount--;
if(_s._referenceCount>0){
return;
}
if(_s.clientIdLoadingDone!=null){
_s.clientIdLoadingDone.Cleanup();
_s.clientIdLoadingDone=null;
}
if(_s._cleanables!=null){
Cleanable.cleanupCollection(_s._cleanables);
_s._cleanables=null;
}
if(_s._settings!=null&&_s._settings.platformApi!=null){
_s._settings.platformApi.cleanup();
}
_s._settings=null;
Utils._instance=null;
}

defPubMeth(_s,"logNoBuffer",__logNoBuffer);
function __logNoBuffer(msg){
var timeMsec=_s.epochTimeMs();
var theTime=undefined;
theTime=(timeMsec/1000.0).toFixed(3).toString();

msg="["+theTime+"] "+msg;

var isError=Lang.StringContains(msg,"ERROR:");

if(_s._settings.enableLogging){
if(isError){
_s._settings.platformApi.consoleErr(msg);
}else{
_s._settings.platformApi.consoleLog(msg);
}
}
return msg;
}





defPubMeth(_s,"log",__log);
function __log(msg){
msg=_s.logNoBuffer(msg);

if(Utils.logBuffer.Count>=Utils.MAX_SIZE_LOGBUFFER){
Utils.logBuffer.RemoveAt(0);
}
Utils.logBuffer.Add(msg);
}

defPubMeth(_s,"logSession",__logSession);
function __logSession(msg,sessionId){
_s.log("sid="+sessionId+" "+msg);
}

defPubMeth(_s,"err",__err);
function __err(message){
_s.log("ERROR: "+message);
}





defPubMeth(_s,"getLogs",__getLogs);
function __getLogs(sessionId){

var res=Utils.logBuffer;
Utils.logBuffer=new ListCS();
return res;
}



defPubMeth(_s,"assert",__assert);
function __assert(condition,msg){
if(!condition){
throw new Error("Assertion failure: "+msg);
}
}









defPubMeth(_s,"runProtected",__runProtected);
function __runProtected(func,message){
_s.runProtectedSync(func,message);
}






defPubMeth(_s,"runProtectedSync",__runProtectedSync);
function __runProtectedSync(func,message){
var allowUncaughtExceptions=_s._settings.allowUncaughtExceptions;

if(allowUncaughtExceptions){
func();
}else{
try{
func();
}catch(e){
_s.onUncaughtException(message,e);
}
}
}


defPrivMeth(_s,"onUncaughtException",__onUncaughtException);
function __onUncaughtException(msg,e){
try{
_s.ping("Uncaught exception: "+msg+": "+Lang.ToString(e));
}catch(eping){
_s.err("Caught exception while sending ping: "+Lang.ToString(eping));
}
}

defPubMeth(_s,"ping",__ping);
function __ping(msg){
if(_s._isSendingPing){
return;
}
_s._isSendingPing=true;
_s.initPing();
var pingUrl=_s._pingUrl+"&d="+_s.urlEncodeString(Lang.ToString(msg));
_s.err("Ping: "+pingUrl);
_s.httpRequest(false,pingUrl,null,null,null);
_s._isSendingPing=false;

}

defPrivMeth(_s,"initPing",__initPing);
function __initPing(){


if(!_s._cachedPingUrl){

var componentName="jscws";

var metadataSchema=null;

try{
var platformMetadata=Lang.DictionaryFromRepr(_s._settings.platformApi.getPlatformMetadata());
if(platformMetadata!=null&&platformMetadata.ContainsKey("sch")){
metadataSchema=platformMetadata.GetValue("sch");
}
}catch(e){
}

_s._pingUrl=_s._settings.pingUrl+"?"
+"comp="+componentName
+"&clv="+_s._settings.clientVersion
+"&cid="+_s._settings.customerKey
+"&uuid="+_s.clientId;

if(metadataSchema!=null){
_s._pingUrl+="&sch="+metadataSchema;
}

if(_s.clientId!=Utils.DEFAULT_CLIENT_ID&&metadataSchema!=null){
_s._cachedPingUrl=true;
}
}
}

defPrivMeth(_s,"urlEncodeString",__urlEncodeString);
function __urlEncodeString(rawString){
return escape(rawString);
}





defPubMeth(_s,"epochTimeMs",__epochTimeMs);
function __epochTimeMs(){
return _s._settings.platformApi.epochTimeMs();
}








defPubMeth(_s,"createTimer",__createTimer);
function __createTimer(timerAction,intervalMs,actionName){
var cleanable=new Cleanable(_s._cleanables);
var wrappedAction=null;
wrappedAction=(
function(){
_s.runProtected(timerAction,actionName);
});
cleanable.setCleanupAction(_s._settings.platformApi.createTimer(wrappedAction,intervalMs,actionName));
return cleanable;
}








defPubMeth(_s,"scheduleAction",__scheduleAction);
function __scheduleAction(action,delayMs,actionName){
var cleanable=new Cleanable(_s._cleanables);
var actionHappened=false;
var wrappedAction=null;
wrappedAction=(
function(){
if(cleanable!=null){
cleanable.cleanup();
}
action();
actionHappened=true;
});
cleanable.setCleanupAction(_s._settings.platformApi.createTimer(wrappedAction,delayMs,actionName));





if(actionHappened){
cleanable.cleanup();
}
return cleanable;
}


defPubMeth(_s,"parseInt",__parseInt);
function __parseInt(decimalInt,defaultResult){
var result=defaultResult;
try{
result=slint.Parse(decimalInt);
}catch(e){
}
return result;
}

defPubMeth(_s,"parseNumber",__parseNumber);
function __parseNumber(numberStr,defaultResult){
var result=defaultResult;
try{
result=Lang.parseDouble(numberStr);
}catch(e){
}
return result;
}

defPubMeth(_s,"startFetchClientId",__startFetchClientId);
function __startFetchClientId(){

_s.clientId=Utils.DEFAULT_CLIENT_ID;
_s.clientIdLoadingDone=new Eventer();

_s._loadClientIdTimeout=_s.scheduleAction(
function(){
_s.log("Timeout in reading clientId. Using "+Utils.DEFAULT_CLIENT_ID+".");
_s.ping("Timeout in reading clientId. IGNORE waited "+_s._settings.loadDataTimeoutMs+"ms.");
if(_s.clientIdLoadingDone!=null){
_s.clientIdLoadingDone.DispatchEvent();
}
_s._loadClientIdTimeout=null;
},
_s._settings.loadDataTimeoutMs,
"utils.readClientId timeout callback");

var onLoad=undefined;
onLoad=(
function(fSuccess,loadedData){
_s.runProtected(
function(){
if(_s._loadClientIdTimeout!=null){
_s._loadClientIdTimeout.cleanup();
_s._loadClientIdTimeout=null;
}
var result=null;
if(fSuccess){
try{
result=_s.jsonDecode(loadedData);
}catch(e){
result=null;
}
}
var loadedClientId=null;
if(fSuccess&&result!=null&&result.ContainsKey("clId")){
loadedClientId=result.GetValue("clId");
}
if(loadedClientId!=null&&loadedClientId!=Utils.DEFAULT_CLIENT_ID&&loadedClientId!="null"){
_s.clientId=loadedClientId;
_s.log("Setting the client id to "+loadedClientId+" (from local storage)");
}else{
_s.log("Failed to load the client id from local storage");
}
if(_s.clientIdLoadingDone!=null){
_s.clientIdLoadingDone.DispatchEvent();
_s.clientIdLoadingDone=null;
}
},
"utils.fetchClientId onLoad");
});
_s._settings.platformApi.loadLocalData(onLoad);
}




defPubMeth(_s,"setClientIdFromServer",__setClientIdFromServer);
function __setClientIdFromServer(newClientId,fromStorage){

if(_s._loadClientIdTimeout!=null){
_s._loadClientIdTimeout.cleanup();
_s._loadClientIdTimeout=null;
}
_s.clientIdLoadingDone=null;
if(_s.clientId!=newClientId){
_s.clientId=newClientId;
_s.log("Setting the client id to "+newClientId+" (from server)");
_s.writeClientId();
}
}



defPrivMeth(_s,"writeClientId",__writeClientId);
function __writeClientId(){
var dataToSave=new DictionaryCS();
dataToSave.SetValue("clId",_s.clientId);
var onSaved=undefined;
onSaved=(
function(fSuccess){
_s.runProtected(
function(){
if(!fSuccess){
_s.err("An error occurred while saving the clientId.");
}
},"utils.writeClientId onSaved");
});
var dataObject=Lang.StringDictionaryToRepr(dataToSave);
var dataStr=_s.jsonEncode(dataObject);
_s._settings.platformApi.saveLocalData(dataStr,onSaved);
}




defPubMeth(_s,"randInt",__randInt);
function __randInt(){
return Math.floor(Math.random()*64000);
}














defPubMeth(_s,"httpRequest",__httpRequest);
function __httpRequest(isPOST,url,data,contentType,callback){
var cleanable=new Cleanable(_s._cleanables);
cleanable.setCleanupAction(_s._settings.platformApi.httpRequest(isPOST,url,data,contentType,
function(isSuccess,response){

cleanable.cleanup();
if(callback!=null){
callback(isSuccess,response);
}
}));
return cleanable;
}















defPubMeth(_s,"jsonEncode",__jsonEncode);
function __jsonEncode(obj){
var res=null;
_s.runProtectedSync(
function(){
res=_s._settings.platformApi.jsonEncode(obj);
},
"utils.jsonEncode");
return res;
}


defPubMeth(_s,"jsonDecode",__jsonDecode);
function __jsonDecode(json){
var res=null;
_s.runProtectedSync(
function(){
var decodedJson=_s._settings.platformApi.jsonDecode(json);
res=Lang.DictionaryFromRepr(decodedJson);
},
"utils.jsonDecode");
return res;
}



if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(Utils,"Utils");





function Lang(){
Lang.StringIndexOf=function(s1,s2){
return s1.indexOf(s2);
};

Lang.StringStartsWith=function(s1,s2){
return(0==s1.indexOf(s2));
};

Lang.StringContains=function(s1,s2){
return(0<=s1.indexOf(s2));
};

Lang.StringGetChar=function(s,where){
if(where<0||where>=s.length){
throw new Error("ArgumentOutOfRange");
}
return s[where];
};

Lang.StringSubstring=function(str,startIndex,count){
if(startIndex<0||startIndex>=str.length||(count!=undefined&&(count<0||startIndex+count>str.length))){
throw new Error("ArgumentOutOfRange");
}
if(count==undefined){
return str.substr(startIndex);
}else{
return str.substr(startIndex,count);
}
};

Lang.StringSplit=function(s1,sep){
var res=s1.split(sep);
return ArrayCS.FromRepr(res);
};

Lang.StringEnumerator=function(s){
return s.split("");
};

Lang.StringCompareTo=function(str1,str2){
if(str1==null){
if(str2==null)return 0;
return-1;
}
if(str2==null)return 1;

if(str1<str2)return-1;
if(str1==str2)return 0;
return 1;
};

Lang.StringTrim=function(s){
return s.replace(/^\s*/,"").replace(/\s*$/,"");
};

Lang.StringReplace=function(str1,strsearch,strreplace){
if(strsearch==null||strsearch==""||strreplace==null){
throw new Error("InvalidArgument");
}

var searchIdx=str1.indexOf(strsearch);
if(searchIdx>=0){
var searchLen=strsearch.length;

return str1.substr(0,searchIdx)+strreplace+Lang.StringReplace(str1.substr(searchIdx+searchLen),strsearch,strreplace);
}else{
return str1;
}
};

Lang.StringLastIndexOf=function(str1,strsearch){
if(strsearch==null||strsearch==""){
throw new Error("InvalidArgument");
}
return str1.lastIndexOf(strsearch);
}

Lang.ListFromRepr=function(a){
return ListCS.FromRepr(a);
};


Lang.ArrayFromRepr=function(repr){
return ArrayCS.FromRepr(repr);
};




Lang.ArrayToRepr=function(a){
if(a==null)return null;
return a.ToRepr();
};

Lang.ListFromRepr=function(repr){
return ListCS.FromRepr(repr);
};


Lang.ListToRepr=function(l){
if(l==null)return null;
return l.ToRepr();
};


Lang.DictionaryFromRepr=function(repr){
var tmp=DictionaryCS.FromRepr(repr);

return tmp;
};


Lang.StringDictionaryToRepr=function(dict){
if(dict==null)return null;
if(dict.hasOwnProperty("ToObject")){
return dict.ToObject();
}else{
return dict;
}
};

Lang.DictionaryCopyToObject=function(dict,obj){
if(dict==null)return;
dict.CopyToObject(obj);
};





Lang.StringFromRepr=function(s){
return s;
}


Lang.StringToXml=function(str){
try{
if(window.DOMParser){
var xmlobject=(new DOMParser()).parseFromString(str,"text/xml");
return xmlobject.documentElement;
}else{

var xmlobject=new ActiveXObject("Microsoft.XMLDOM");
xmlobject.async="false";
xmlobject.loadXML(str);
return xmlobject.documentElement;
}
}catch(e){
return null;
}
};

Lang.XmlToString=function(oXML){
try{
if(window.XMLSerializer){
return(new XMLSerializer()).serializeToString(oXML);
}else{
return oXML.xml;
}
}catch(e){
return null;
}
};

Lang.ToString=function(o){

if(typeof(o.ToString)=="function"){
return o.ToString();
}else{
return o.toString();
}
}

Lang.StringToLower=function(s){
return s.toLowerCase();
}

Lang.StringToInt=function(s){
return parseInt(s);
}

Lang.AsDouble=function(v){
if(v instanceof Int64){
return v.asNumber;
}else if(v instanceof UInt64){
return v.asNumber;
}else{
return Number(v);
}
}


Lang.doubleRegex=new RegExp("^([+-]?[0-9]*\\.?[0-9]+)((e|E)[+-]?[0-9]+)?$");
Lang.parseDouble=function(v){


Lang.parseChecker(v,Lang.doubleRegex,"double");
return parseFloat(v);
}

Lang.parseChecker=function(s,pattern,what){
if(!pattern.test(s)){
throw new Error("Invalid string for "+what+": "+s);
}
}
}
statInit(Lang,"Lang");





function ArrayCS(){
var _s=this;

if(_s!=STAT_INIT)_s.arr=undefined;
function _constr(size){
if(size==undefined)size=0;
_s.arr=new Array(size);
}

defStatMeth(_s,ArrayCS,"Create",__Create);
function __Create(){
var res=new ArrayCS();
var l=[];


for(var i=0;i<arguments.length;i++){
l.push(arguments[i]);
}
res.arr=l;
return res;
}

defStatMeth(_s,ArrayCS,"FromRepr",__FromRepr);
function __FromRepr(a){
if(a==null)return null;
var res=new ArrayCS();
res.arr=a;
return res;
}

defPubMeth(_s,"ToRepr",__ToRepr);
function __ToRepr(){
return _s.arr;
}


defGet(_s,"Length",__Length);
function __Length(){
return _s.arr.length;
}


defPubMeth(_s,"GetValue",__GetValue);
function __GetValue(idx){
if(idx>=_s.arr.length){
throw new Error("Index out of bounds: "+idx+" (length "+_s.arr.length+")");
}else if(idx<0){
throw new Error("Index out of bounds: "+idx);
}
return _s.arr[idx];
}

defPubMeth(_s,"SetValue",__SetValue);
function __SetValue(idx,v){
if(idx>=_s.arr.length){
throw new Error("Index out of bounds: "+idx+" (length "+_s.arr.length+")");
}else if(idx<0){
throw new Error("Index out of bounds: "+idx);
}
_s.arr[idx]=v;
}

defGet(_s,"Values",__Values);
function __Values(){
return _s.arr;
}

if(_s!=STAT_INIT)_constr.apply(this,arguments);

}
statInit(ArrayCS,"ArrayCS");





function ListCS(){
var _s=this;

if(_s!=STAT_INIT)_s.arr=undefined;
function _constr(){

if(arguments.length>1){
Ping.Send("Error: Instantiate ListCS with too many arguments");
}else if(arguments.length==0){
ArrayCS.call(_s,0);
}else if(arguments[0]instanceof Number){
ArrayCS.call(_s,arguments[0]);
}else if(arguments[0]instanceof Array){
ArrayCS.call(_s,arguments[0].length);
_s.arr=arguments[0];
}else if(arguments[0]instanceof ArrayCS){
ArrayCS.call(_s,arguments[0].length);
_s.arr=arguments[0].arr;
}else{
Ping.Send("Error: Instantiate ListCS with inappropriate arguments");
}
}

defStatMeth(_s,ListCS,"Create",__Create);
function __Create(a){
var res=new ListCS();
for(var i=0;i<arguments.length;i++){
res.arr.push(arguments[i]);
}
return res;
}

defStatMeth(_s,ListCS,"FromRepr",__FromRepr);
function __FromRepr(a){
if(a==null){
return a;
}
if(a instanceof ListCS){
return a;
}
var res=new ListCS();
res.arr=a;
return res;
}

defPubMeth(_s,"ToRepr",__ToRepr);
function __ToRepr(){
return _s.arr;
}

defGet(_s,"Count",__Count);
function __Count(){
return _s.arr.length;
}

defGet(_s,"Values",__Values);
function __Values(){
return _s.arr;
}

defPubMeth(_s,"Add",__Add);
function __Add(e){
_s.arr.push(e);
}

defPubMeth(_s,"Clear",__Clear);
function __Clear(e){
_s.arr.length=0;
}

defPubMeth(_s,"IndexOf",__IndexOf);
function __IndexOf(e){
var startIndex=arguments[1];
if(startIndex==null){
startIndex=0;
}else if(startIndex<0||startIndex>=_s.arr.length){
throw new Error("Starting index out of bound");
}

for(var i=startIndex;i<_s.arr.length;i++){
if(_s.arr[i]==e)return i;
}
return-1;
}

defPubMeth(_s,"Contains",__Contains);
function __Contains(e){
return _s.IndexOf(e)>=0;
}

defPubMeth(_s,"Insert",__Insert);
function __Insert(idx,e){
_s.arr.splice(idx,0,e);
}

defPubMeth(_s,"Remove",__Remove);
function __Remove(e){
var idx=_s.IndexOf(e);
if(idx<0)return false;
_s.RemoveAt(idx);
return true;
}

defPubMeth(_s,"RemoveRange",__RemoveRange);
function __RemoveRange(where,count){
_s.arr.splice(where,count);
}

defPubMeth(_s,"RemoveAt",__RemoveAt);
function __RemoveAt(where){
_s.arr.splice(where,1);
}

defPubMeth(_s,"GetRange",__GetRange);
function __GetRange(startidx,len){
var res=new ListCS();
res.arr=_s.arr.slice(startidx,startidx+len);
return res;
}

defPubMeth(_s,"Sort",__Sort);
function __Sort(){
_s.arr.sort.apply(_s.arr,arguments);
}

defPubMeth(_s,"ToArray",__ToArray);
function __ToArray(){
return ArrayCS.FromRepr(_s.arr.slice());
}

if(_s!=STAT_INIT)_constr.apply(this,arguments);

}
statInit(ListCS,"ListCS");





function DictionaryCS(){
var _s=this;

if(_s!=STAT_INIT)_s.obj=undefined;
function _constr(size){
_s.obj={};
}

defStatMeth(_s,DictionaryCS,"FromRepr",__FromRepr);
function __FromRepr(o){
if(o==null)return null;
if(o instanceof DictionaryCS){
return o;
}
if(o.hasOwnProperty("ToObject")){
o=o.ToObject();
}
var res=new DictionaryCS();

slForEachProp(o,function(k){
res.obj[k]=o[k];
});
return res;
}

defPubMeth(_s,"ToObject",__ToObject);
function __ToObject(){
return _s.obj;
}


defStatMeth(_s,DictionaryCS,"Create",__Create);
function __Create(){
var res=new DictionaryCS();
for(var i=0;i+1<arguments.length;i+=2){
res.obj[arguments[i]]=arguments[i+1];
}
return res;
};


defPubMeth(_s,"CopyToObject",__CopyToObject);
function __CopyToObject(obj){
slForEachProp(_s.obj,function(k){
obj[k]=_s.obj[k];
});
}

defPubMeth(_s,"GetValue",__GetValue);
function __GetValue(key){
return _s.obj[key];
}

defPubMeth(_s,"SetValue",__SetValue);
function __SetValue(key,v){
_s.obj[key]=v;
}


defPubMeth(_s,"Clear",__Clear);
function __Clear(){
slForEachProp(_s.obj,function(p){
delete _s.obj[p];
});
}


defPubMeth(_s,"ContainsKey",__ContainsKey);
function __ContainsKey(key){
return(_s.obj[key]!==undefined);
}

defPubMeth(_s,"Contains",__Contains);
function __Contains(key){
return ContainsKey(key);
}


defGet(_s,"Keys",__Keys);
function __Keys(){
var res=new Array();
slForEachProp(_s.obj,function(p){
res.push(p);
});
return res;
}


defGet(_s,"Values",__Values);
function __Values(){
var res=new Array();
slForEachProp(_s.obj,function(p){
res.push(_s.obj[p]);
});
return res;
}


defGet(_s,"KeyValuePairs",__KeyValuePairs);
function __KeyValuePairs(){
var res=new Array();
slForEachProp(_s.obj,function(p){
res.push(new KeyValuePairCS(p,_s.obj[p]));
});
return res;
}


defGet(_s,"Count",__Count);
function __Count(){
var res=0;
slForEachProp(_s.obj,function(p){
res++;
});
return res;
}



defPubMeth(_s,"Add",__SetValue);


defPubMeth(_s,"Remove",__Remove);
function __Remove(key){
if(_s.ContainsKey(key)){
delete _s.obj[key];
return true;
}else
return false;
}

if(_s!=STAT_INIT)_constr.apply(this,arguments);

}
statInit(DictionaryCS,"DictionaryCS");





function KeyValuePairCS(){
var _s=this;

if(_s!=STAT_INIT)_s.key=undefined;
if(_s!=STAT_INIT)_s.val=undefined;
function _constr(key,val){
_s.key=key;
_s.val=val;
}


defGet(_s,"Key",__Key);
function __Key(){
return _s.key;
}

defGet(_s,"Value",__Value);
function __Value(){
return _s.val;
}
if(_s!=STAT_INIT)_constr.apply(this,arguments);

}
statInit(KeyValuePairCS,"KeyValuePairCS");





function PlayStationTrilithiumApi(){
var _s=this;

var _convivaKey="convivaPersistent";
var _persistentData=null;


var _intervals={};
var _intervalsCount=0;


function _constr(){
_s._httpClientObject=engine.createHttpClient();
}

this.cleanup=function(){
_s._httpClientObject=null;
}

this.saveLocalData=function(data,callback){
try{
engine.storage.local[_convivaKey]=data;
}catch(e){

callback(false);
return;
}
callback(true);
}

this.loadLocalData=function(callback){
try{
var data=engine.storage.local[_convivaKey];
callback(true,data);
}catch(e){

callback(false,"");
}
}

this.deleteLocalData=function(){
try{
engine.storage.local[_convivaKey]=null;
}catch(e){
}
}

this.httpRequest=function(isPOST,url,data,contentType,callback){

if(typeof(data)!=="string"){
data=_s.jsonEncode(data,null);
}

var httpRequestObject=_s._httpClientObject.createRequest((isPOST?"POST":"GET"),url);
if(isPOST){
httpRequestObject.sendBody(data);
Utils.getInstance().logNoBuffer(data);
}
httpRequestObject.onComplete=function(response,status){
Utils.getInstance().runProtected(function(){
if(status<=0){








callback(false,null);
}else{


if(response){
var responseString=response.toString('string');
if(typeof responseString=='undefined'){
callback(false,null);
}else{
Utils.getInstance().logNoBuffer(responseString);
callback(true,responseString);
}
}else{
callback(false,null);
}
}
},"httpRequest.onComplete");
}

httpRequestObject.start();
return function(){httpRequestObject.cancel();};
}


this.epochTimeMs=function(){
return(new Date()).getTime();
}

this.setInterval=function(func,time){
var intervalId=_intervalsCount?++_intervalsCount:_intervalsCount=1;
_intervals[intervalId]=function(){
if(_intervals[intervalId].active){
func();
setTimeout(_intervals[intervalId],time);
}
}
_intervals[intervalId].active=true;
setTimeout(_intervals[intervalId],time);
return intervalId;
}

this.clearInterval=function(intervalId){
_intervals[intervalId].active=false;
}

this.createTimer=function(timerAction,intervalMs,actionName){
var timerId=_s.setInterval(timerAction,intervalMs);
return(function(){
if(timerId!=-1){
_s.clearInterval(timerId);
timerId=-1;
}});
}

this.jsonEncode=function(obj){
var jsonString=null;
jsonString=JSON.stringify(obj);
return jsonString;
}

this.jsonDecode=function(json){
var parsedJson=null;

try{
parsedJson=JSON.parse(json);
}catch(e){
if(Math.random()<0.01){
Utils.getInstance().ping("JSON parse error. IGNORE Payload: "+json);
}
}
return parsedJson;
}

this.consoleLog=function(message){
if(typeof console!='undefined'&&console.log){
console.log(message);
}
}

this.consoleErr=function(message){
if(typeof console!='undefined'&&console.error){
console.error(message);
}
}


this.getDevice=function(){return null;}
this.getDeviceVersion=function(){return null;}
this.getDeviceType=function(){return null;}
this.getOS=function(){return null;}
this.getOSVersion=function(){return null;}

this.getPlatformMetadata=function(){


var res={'sch':'playstation.trilithium.1'};










try{
res['dp']=engine.stats.device.platform;
}catch(e){
}

try{
res['ver']=engine.stats.version.join(".");
}catch(e){
}

try{
res['did']=engine.stats.device.id;
}catch(e){
}
return res;
}

if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
registerName(PlayStationTrilithiumApi,"PlayStationTrilithiumApi");




function PlayStationTrilithiumStreamerProxy(){
var _s=this;


if(_s!=STAT_INIT){
_s._duration=-1;
_s._capabilities=ConvivaStreamerProxy.CAPABILITY_VIDEO;
_s._savedListeners={};
_s._ended=false;
}


if(_s==STAT_INIT){
PlayStationTrilithiumStreamerProxy.VideoListeners={
ON_BITRATE_CHANGE:'onBitrateChange',
ON_ERROR:'onError',
ON_ENDED:'onEnded'
};
PlayStationTrilithiumStreamerProxy.ErrorCodes={
"80000001":"ERROR",
"80000002":"ERROR_INVALID_CONFIG",
"80000003":"ERROR_INVALID_PARAMS",
"80000004":"ERROR_INIT_FAILED",
"80000005":"ERROR_OUT_OF_MEMORY",
"80000100":"ERROR_NO_CONNECTION",
"80000104":"ERROR_ALREADY_IN_USE",
"80000105":"ERROR_VIDEO_DECODER_FAILED",
"80000106":"ERROR_AUDIO_DECODER_FAILED"
}
}

function _constr(video){

ConvivaStreamerProxy.call(_s);

_s.Log('PlayStationTrilithiumStreamerProxy._constr()');

_s.video=video;










_s._PHTChanged=false;

_s._capabilities=ConvivaStreamerProxy.CAPABILITY_VIDEO
+ConvivaStreamerProxy.CAPABILITY_QUALITY_METRICS
+ConvivaStreamerProxy.CAPABILITY_BITRATE_METRICS;

_s.SetPlayingState(ConvivaStreamerProxy.UNKNOWN);
_s._ended=false;

_s._setAllEventListeners();
_s._startPolling();
}

defPubMeth(_s,"Cleanup",__Cleanup);defPubMeth(_s,"Cleanup",__Cleanup);
function __Cleanup(){

_s.Log('PlayStationTrilithiumStreamerProxy.Cleanup()');

_s._stopPolling();
_s._removeAllEventListeners();

_s.video=null;

_s.super_Cleanup();

}

defPubMeth(_s,"GetCapabilities",__GetCapabilities);defPubMeth(_s,"GetCapabilities",__GetCapabilities);
function __GetCapabilities(){

return _s._capabilities;
}





this.GetDuration=function(){
return _s._duration;
}


this.SetDuration=function(duration){
if(isFinite(duration)&&duration>0){
var durationSec=duration;
if(_s.GetDuration()!=durationSec){
_s._duration=durationSec;
var meta={};
meta[ConvivaStreamerProxy.METADATA_DURATION]=_s._duration;
_s.SetMetadata(meta);
}
}
}


this.SetBitrate=function(bitrate){
if(isFinite(bitrate)&&bitrate>0){
var bitrateKbps=bitrate;
if(_s.GetBitrateKbps()!=bitrateKbps){
_s.SetBitrateKbps(bitrateKbps);
}
}
}


this._declareError=function(errMsg){
_s.Log("PlayStationTrilithiumStreamerProxy._declareError: "+errMsg);
_s.SetError(StreamerError.makeUnscopedError(errMsg,StreamerError.SEVERITY_FATAL));
}

this._poll=function(){
Utils.getInstance().runProtected(function(){
if(!_s._polling)return;

if(_s.video){
_s.SetDuration(_s.video.duration);
}

if(_s.video){
var currentPHT=_s.video.currentTime;


if(_s.video.paused){
if(_s.GetPlayingState()!=ConvivaStreamerProxy.PAUSED){
_s.SetPlayingState(ConvivaStreamerProxy.PAUSED);
}
}else if(_s._PHTChanged==true&&currentPHT>_s._lastPHT){



if(_s.GetPlayingState()!=ConvivaStreamerProxy.PLAYING){
_s.SetPlayingState(ConvivaStreamerProxy.PLAYING);

_s._ended=false;
}
}else if(_s._PHTChanged==true&&currentPHT==_s._lastPHT&&_s.GetPlayingState()!=ConvivaStreamerProxy.STOPPED&&_s._ended==false){


if(_s.GetPlayingState()!=ConvivaStreamerProxy.PAUSED){
_s.SetPlayingState(ConvivaStreamerProxy.BUFFERING);
}
}

if(currentPHT!=_s._lastPHT){
_s._PHTChanged=true;
_s._lastPHT=currentPHT;
}
}
},"PlayStationTrilithiumStreamerProxy._poll");
}

this._startPolling=function(){
_s.Log("PlayStationTrilithiumStreamerProxy._startPolling");
_s._polling=true;
_s._cancelTimer=Utils.getInstance()._settings.platformApi.createTimer(_s._poll,200,"PlayStationTrilithiumStreamerProxy._poll");

_s.onBitrateChange();
}

this._stopPolling=function(){
_s.Log("PlayStationTrilithiumStreamerProxy._stopPolling");
if(_s._polling&&typeof _s._cancelTimer==='function'){
_s._cancelTimer();
}
_s._polling=false;
}

this._overrideEventListener=function(target,eventListener,convivaListener){
_s._savedListeners[eventListener]=target[eventListener];
var wrappedListener=function(){
convivaListener.apply(_s,arguments);
if(typeof _s._savedListeners[eventListener]==="function"){
_s._savedListeners[eventListener].apply(target,arguments);
}
};
target[eventListener]=wrappedListener;
}

this._restoreEventListener=function(target,eventListener){
target[eventListener]=_s._savedListeners[eventListener];
_s._savedListeners[eventListener]=null;
}

this._setAllEventListeners=function(){
_s.Log("PlayStationTrilithiumStreamerProxy._setAllEventListeners()");

if(_s.video){
_s._overrideEventListener(_s.video,PlayStationTrilithiumStreamerProxy.VideoListeners.ON_ERROR,_s.onError);
_s._overrideEventListener(_s.video,PlayStationTrilithiumStreamerProxy.VideoListeners.ON_BITRATE_CHANGE,_s.onBitrateChange);
_s._overrideEventListener(_s.video,PlayStationTrilithiumStreamerProxy.VideoListeners.ON_ENDED,_s.onEnded);

}
}

this._removeAllEventListeners=function(){
_s.Log("PlayStationTrilithiumStreamerProxy._removeAllEventListeners()");

if(_s.video){
_s._restoreEventListener(_s.video,PlayStationTrilithiumStreamerProxy.VideoListeners.ON_ERROR);
_s._restoreEventListener(_s.video,PlayStationTrilithiumStreamerProxy.VideoListeners.ON_BITRATE_CHANGE);
_s._restoreEventListener(_s.video,PlayStationTrilithiumStreamerProxy.VideoListeners.ON_ENDED);
}

_s._savedListeners={};
}

this.onBitrateChange=function(){
Utils.getInstance().runProtected(function(){
_s.Log("PlayStationTrilithiumStreamerProxy.onBitrateChange");
if(_s.video){

_s.SetBitrate(_s.video.currentBitrate);
}
},"PlayStationTrilithiumStreamerProxy.onBitrateChange");
}

this.onError=function(errorCode){
Utils.getInstance().runProtected(function(){
_s.Log("PlayStationTrilithiumStreamerProxy.onError");
var reportedError="Trilithium "+_s._convertErrorCodeToMsg(errorCode)+" ("+errorCode+")";
_s._declareError(reportedError);
},"PlayStationTrilithiumStreamerProxy.onError");
}

this.onEnded=function(){
Utils.getInstance().runProtected(function(){
_s.Log("PlayStationTrilithiumStreamerProxy.onEnded");
_s.SetPlayingState(ConvivaStreamerProxy.STOPPED);
_s._ended=true;
if(_s.video){

_s._lastPHT=_s.video.currentTime;
}
},"PlayStationTrilithiumStreamerProxy.onError");
}

this._convertErrorCodeToMsg=function(errorCode){
return PlayStationTrilithiumStreamerProxy.ErrorCodes[errorCode]||'ERROR_UNKNOWN';
}

if(_s!=STAT_INIT)_constr.apply(_s,arguments);
}
statInit(PlayStationTrilithiumStreamerProxy,"PlayStationTrilithiumStreamerProxy");
})();
var Conviva=(typeof Conviva!=='undefined')?Conviva:(function(){});
Conviva.LivePass=ConvivaPrivateLoader.LivePass;Conviva.ConvivaContentInfo=ConvivaPrivateLoader.ConvivaContentInfo;Conviva.StreamerError=ConvivaPrivateLoader.StreamerError;Conviva.ConvivaStreamerProxy=ConvivaPrivateLoader.ConvivaStreamerProxy;Conviva.Settings=ConvivaPrivateLoader.Settings;Conviva.StreamInfo=ConvivaPrivateLoader.StreamInfo;Conviva.Utils=ConvivaPrivateLoader.Utils;Conviva.PlayStationTrilithiumStreamerProxy=ConvivaPrivateLoader.PlayStationTrilithiumStreamerProxy;Conviva.PlayStationTrilithiumApi=ConvivaPrivateLoader.PlayStationTrilithiumApi;
}


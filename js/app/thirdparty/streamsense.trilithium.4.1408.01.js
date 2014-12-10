/* Copyright (c) 2014 comScore, Inc.
 * All rights reserved.
 * By using this software, you are agreeing to be bound by the
 * terms of this policies: http://www.comscore.com/About_comScore/Privacy_Policy
 */
var ns_ = ns_ || {};

ns_.StreamSense = ns_.StreamSense || (function() {
var
	httpGet = function (url, callback) {},
	httpPost = function (url, data, callback) {};

function setHttpGet (f) {

	httpGet = f;
}

function setHttpPost (f) {

	httpPost = f;
}
setHttpGet(
	function (url, callback) {
		var ngine = engine.createHttpClient();
        var req = ngine.createRequest("GET", url, null);
        req.start();
		callback && setTimeout(callback, 0);
	}
);

setHttpPost(
	function (url, data, callback) {
	    callback && setTimeout(callback, 0);
	}
);
var _tmp = (function() {
    var window = {
            esc: encodeURIComponent || escape
        }
        , document = {
          location: {
            href: ''
          }
          , title: ''
          , URL: ''
          , referrer: ''
          , cookie: ''
        };

    /**
     * Allow the player to send a page view event.
     * @public
     * @param {String} [pixelUrl] if specified, overwrites all other pixelUrl
     * values
     * @param {Object} [labels]
     */
    function viewNotify(pixelUrl, labels) {
        var
            baseUrl = pixelUrl || '' // TODO empty?
            , _utils = Utils
            , undef = 'undefined'
            , comScore = window.comScore ||
                window.sitestat || function (u) {
                    var cN = "comScore=",    // cookie name
                        d = document,           // shortcut
                        cookie = d.cookie,      // shortcut
                        ux = "",                // ux values from cookie
                        indexOf = "indexOf",    // shortcut
                        substring = "substring", // shortcut
                        length = 'length',       // shortcut
                        limit = 2048,           // URL limit
                        last,                   // lastIndexOf &
                        ns_ = "&ns_",
                        ampersand = "&",
                        i,
                        c,
                        j,
                        l;

                if (cookie[indexOf](cN)+1) {
                        for (j = 0, c = cookie.split(";"), l = c[length]; j < l; j++) {
                            i = c[j][indexOf](cN);
                            (i+1) && (ux = ampersand + unescape(c[j][substring](i + cN[length])));
                        }
                    }

                    u += ns_ + "_t=" + (+new Date)
                    + ns_ + "c=" + (d.characterSet || d.defaultCharset || "")
                    + ux

                    if (u[length] > limit && u[indexOf](ampersand) > 0) {
                        last = u[substring](0, limit - 8).lastIndexOf(ampersand);

                        u = (u[substring](0, last)
                            + ns_ + "cut="
                            + window.esc(u[substring](last + 1)))[substring](0, limit);
                    }

                    httpGet(u);

                    if (typeof ns_p === undef) {
                    	ns_p = { src: u };
                    }
                    ns_p.lastMeasurement = u; // TODO Testing, need to remove it?
                }

        if (typeof labels !== undef) {
            var l = [];
            for (var label in labels) {
                if (labels.hasOwnProperty(label)) {
                    l.push(window.esc(label) + '=' + window.esc(labels[label]));
                }
            }
            if ( !/[\?\&]$/.test(baseUrl) ) baseUrl += '&';
            baseUrl += l.join('&');
        }
        return comScore(baseUrl);
    }

    function prepareUrl(pixelURL, labels) {
        var u
            , limit = 2048
            , d = document
            , l = []
            , orderedLabels = StreamSenseConstants.LABELS_ORDER
            , pixelUrlSplit  = pixelURL.split('?')
            , pixelUrlBase   = pixelUrlSplit[0]
            , pixelUrlParams = pixelUrlSplit[1]
            , pixelUrlPairs  = pixelUrlParams.split('&')

        for (var i=0,n=pixelUrlPairs.length; i<n; i++) {
            var kv = pixelUrlPairs[i].split('='),
                k = unescape(kv[0]),
                v = unescape(kv[1]);
            if (k) labels[k] = v;
        }

        var seen = {};
        for (var i=0,n=orderedLabels.length; i<n; i++) {
            var label = orderedLabels[i];
            if (labels.hasOwnProperty(label)) {
                seen[label] = true;
                l.push(window.esc(label) + '=' + window.esc(labels[label]));
            }
        }

        for (var label in labels) {
            if (seen[label]) continue;
            if (labels.hasOwnProperty(label)) {
                l.push(window.esc(label) + '=' + window.esc(labels[label]));
            }
        }

        u = pixelUrlBase + '?' + l.join('&');

        u = u
            + (u.indexOf("&c8=") < 0 ? "&c8=" + window.esc(d.title) : "")
            + (u.indexOf("&c7=") < 0 ? "&c7=" + window.esc(d.URL) : "")
            + (u.indexOf("&c9=") < 0 ? "&c9=" + window.esc(d.referrer) : "");

        if (u.length > limit && u.indexOf('&') > 0) {
            last = u.substr(0, limit - 8).lastIndexOf('&');

            u = (u.substring(0, last)
                + "&ns_cut="
                + window.esc(u.substring(last + 1))).substr(0, limit);
        }
        return u;
    }

    return {
        prepareUrl: prepareUrl,
        viewNotify: viewNotify
    }
})();

var prepareUrl = _tmp.prepareUrl;
var viewNotify = _tmp.viewNotify;

var Utils = (function() {
/**
 * Utility function, singleton because it has no instance data.
 * @constructor
 */

var Utils = {

    /**
    * Generate unique ID composed by time (milliseconds) plus the number of IDs
    * generated so far..
    * @function
    * @return {String}
    */
    uid: (function () {
        var
            /**
            * Number of unique generated IDs.
            * @private
            * @type Number
            */
            counter = 1;
        return function () {
            return +new Date() + '_' + counter++;
        }
    }()),

    /**
	* Filters the object with the provided function.
	* @param {Function} condition Function which will be used to filter the object, should return true if the item should be included in the returned object
	* @param {Object} obj Object that will be filtered. The provided object won't be modified.
	* @returns {Object} Returns the object which will contain only the values that pass the provided condition.
	*/
    filter: function(condition, obj) {
		var ret = {};
		for (var j in obj) {
            if (obj.hasOwnProperty(j) && condition(obj[j])) {
                ret[j] = obj[j];
            }
        }
		return ret;
	},

    /**
    * Extend toExtend with all the own properties of o1..N. If a property with the same
    * name already exists in toExtend, the value will be replaced with the value of
    * the oX property. toExtend will be EXTENDED and returned. The function doesn't
    * follow the property tree. WARNING the first argument will be MODIFIED.
    * @param {Object} toExtend object to be extended and returned
    * @param {Object} o1..N source of the properties obj1 will be extended with
    * @returns {Object|null} toExtend extended with o1..n properties
    */
    extend: function (toExtend /** o1, ... */) {
        var
            argsLength = arguments.length
            , obj

        toExtend = toExtend || {};

        for (var i = 1; i < argsLength; i++) {
            obj = arguments[i];
            if (!obj) {
                continue; //-->
            }
            for (var j in obj) {
                if (obj.hasOwnProperty(j)) {
                    toExtend[j] = obj[j];
                }
            }
        }

        return toExtend;
    },

    getString: function(value, defaultValue) {
        var ret = String(value);
        return (value == null) ? (defaultValue || "na") : ret;
    },

    getLong: function(value, defaultValue) {
        var ret = Number(value);
        return (value == null || isNaN(ret)) ? (defaultValue || 0) : ret;
    },

    getInteger: function(value, defaultValue) {
        var ret = Number(value);
        return (value == null || isNaN(ret)) ? (defaultValue || 0) : ret;
    },

    getBoolean: function(value, defaultValue) {
        var ret = String(value).toLowerCase() == 'true';
        return (value == null) ? (defaultValue || false) : ret;
    },

    isNotEmpty: function(str) {
    	return str != null && str.length > 0;
    },

    indexOf: function(value, array) {
        var r = -1;
        Utils.forEach(array, function(item, key){
            if (item == value)
                r = key;
        });
        return r;
    },

    forEach: function(array, iterator, context) {
        try {
            if (typeof(iterator) == 'function') {
                context = typeof(context) != "undefined" ? context : null;
                if (typeof array['length']!='number' || typeof array[0]=='undefined') {
                    var hasProto = typeof(array.__proto__) != 'undefined';
                    for (var i in array) {
                        if ((!hasProto || (hasProto && typeof(array.__proto__[i]) == 'undefined')) && typeof array[i] != 'function')
                        iterator.call(context, array[i], i);
                    }
                }
                else {
                    for (var i=0,l=array.length; i<l; i++) {
                        iterator.call(context, array[i], i);
                    }
                }
            }
        } catch (e) {}
    },

    regionMatches: function(to, toffset, other, ooffset, len) {
        if (toffset < 0 || ooffset < 0 || toffset + len > to.length || ooffset + len > other.length) return false;

        while (--len >= 0) {
            var c1 = to.charAt(toffset++);
            var c2 = other.charAt(ooffset++);
            if (c1 != c2) return false;
        }
        return true;
    },

    size: function(object) {

        var size = 0, key;
        for (var key in object) {
            if (object.hasOwnProperty(key)) size++;
        }
        return size;
    },

    log: function(message, enabled) {

        if (typeof enabled != 'undefined' && enabled){

            var date = new Date();
            var timestamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            console.log(timestamp, message);
        }
    },

    /**
     * Returns true if the value passed as parameter is boolean true or 'true', '1' or 'on'
     * @param value
     * @returns {boolean}
     */
    isTrue: function(value) {

        if (typeof value == 'undefined') {

            return false;
        }
        else if (typeof value === 'string') {

            value = value.toLowerCase();
            return value === 'true' || value === '1' || value === 'on';
        }
        else if (value) {

            return true;
        }
        else {

            return false;
        }
    },

    toString: function(object) {

        if (typeof  object == 'undefined') {

            return 'undefined';
        }
        else if (typeof object === 'string') {

            return object;
        }
        else if( Object.prototype.toString.call( object ) === '[object Array]' ) {

            return object.join(",");
        }
        else if (Utils.size(object) > 0){

            var result = "";
            for (var key in object) {
                if (object.hasOwnProperty(key)) {

                    result += key + ":" + object[key] + ";";
                }
            }
            return result;
        }
        else {

            return object.toString();
        }
    },

    /**
     * Convenience function to check if a value is defined and has a value
     * @param value
     * @returns {boolean|*}
     */
    exists: function(value) {

        return typeof value != 'undefined' && value != null;
    },

    /**
     * Iterates over the arguments passed as parameter and returns first argument greater than 0
     * @returns First argument greater than 0
     */
    firstGreaterThan0: function() {

        for (var i = 0, j = arguments.length; i < j; i++){

            var arg = arguments[i];
            if (arg > 0)
                return arg;
        }
        return 0;
    },

    /**
     * Creates a new object and copies the properties of the given object to this newly created object
     * @param obj The object to be cloned
     */
    cloneObject: function(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
};

    Utils.filterMap = function(map, keepKeys) {
        for (var keyName in map) {
            if (Utils.indexOf(keyName, keepKeys) == -1) {
                delete map[keyName];
            }
        }
    }

    Utils.getKeys = function(obj, filter) {
	    var name,
	        result = [];

	    for (name in obj) {
	        if ((!filter || filter.test(name)) && obj.hasOwnProperty(name)) {
	            result[result.length] = name;
	        }
	    }
	    return result;
	}

    Utils.getBrowserName = function() {
        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var nameOffset, verOffset, ix;

        if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            browserName = "Opera";
        }
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            browserName = "Microsoft Internet Explorer";
        }
        else if ((verOffset = nAgt.indexOf("Android")) != -1) {
            browserName = "Android";
        }
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browserName = "Chrome";
        }
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            browserName = "Safari";
        }
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            browserName = "Firefox";
        }
        else if ((verOffset = nAgt.indexOf("Windows NT")) != -1) {
            browserName = "Microsoft Internet Explorer"
        }
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
            (verOffset = nAgt.lastIndexOf('/'))) {
            browserName = nAgt.substring(nameOffset, verOffset);
            if (browserName.toLowerCase() == browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }

        return browserName;
    }

    Utils.getBrowserFullVersion = function () {
        var nAgt = navigator.userAgent;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            fullVersion = nAgt.substring(verOffset + 5);
        }
        else if ((verOffset = nAgt.indexOf("Android")) != -1) {
            fullVersion = nAgt.substring(verOffset + 8);
        }
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            fullVersion = nAgt.substring(verOffset + 7);
        }
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            fullVersion = nAgt.substring(verOffset + 8);
        }
        else if ((verOffset = nAgt.indexOf("Windows NT")) != -1) {
            verOffset = nAgt.indexOf("rv:");
            fullVersion = nAgt.substring(verOffset + 3);
        }
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
            (verOffset = nAgt.lastIndexOf('/'))) {
            fullVersion = nAgt.substring(verOffset + 1);
        }
        if ((ix = fullVersion.indexOf(";")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(" ")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(")")) != -1)
            fullVersion = fullVersion.substring(0, ix);

        majorVersion = parseInt('' + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = '' + parseFloat(navigator.appVersion);
        }

        return fullVersion;
    }

    return Utils;
})();
var StreamSenseEventType = (function() {
    var stringMap = [ "play", "pause", "end", "buffer", "keep-alive", "hb", "custom", "ad_play", "ad_pause", "ad_end", "ad_click" ];
    return {
        PLAY: 0,
        PAUSE: 1,
        END: 2,
        BUFFER: 3,
        KEEP_ALIVE: 4,
        HEART_BEAT: 5,
        CUSTOM: 6,
        AD_PLAY: 7,
        AD_PAUSE: 8,
        AD_END: 9,
        AD_CLICK: 10,
        toString: function(eventType) {
            return stringMap[eventType];
        }
    };
})();

var State = (function() {
    var eventTypeMap = [StreamSenseEventType.END, StreamSenseEventType.PLAY, StreamSenseEventType.PAUSE, StreamSenseEventType.BUFFER];

    return {
        IDLE: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        toEventType: function(state) {
            return eventTypeMap[state];
        }
    };
})();

var AdEvents = {
    ADPLAY: StreamSenseEventType.AD_PLAY,
    ADPAUSE: StreamSenseEventType.AD_PAUSE,
    ADEND: StreamSenseEventType.AD_END,
    ADCLICK: StreamSenseEventType.AD_CLICK
};
var StreamSenseConstants = {

    STREAMSENSE_VERSION: '4.1408.01',

    DEFAULT_PLAYERNAME: "streamsense",
    DEFAULT_HEARTBEAT_INTERVAL: [
        { playingtime: 60000, interval: 10000 },
        { playingtime: null, interval: 60000 }
    ],
    DEFAULT_KEEP_ALIVE_INTERVAL: 1200000,
    DEFAULT_PAUSED_ON_BUFFERING_INTERVAL: 500,
    C1_VALUE: "19",
    C10_VALUE: "js",
    NS_AP_C12M_VALUE: "1",
    NS_NC_VALUE: "1",
    PAGE_NAME_LABEL: "name",
    LABELS_ORDER: [
        "c1", "c2", "ns_site", "ns_vsite",
        "ns_ap_an", "ns_ap_pn", "ns_ap_pv", "c12", "name", "ns_ak", "ns_ap_ec", "ns_ap_ev", "ns_ap_device",
        "ns_ap_id", "ns_ap_csf", "ns_ap_bi", "ns_ap_pfm", "ns_ap_pfv", "ns_ap_ver", "ns_ap_sv",
        "ns_type", "ns_radio", "ns_nc", "ns_ap_ui", "ns_ap_gs",
        "ns_st_sv", "ns_st_pv", "ns_st_it", "ns_st_id", "ns_st_ec", "ns_st_sp", "ns_st_sq", "ns_st_cn",
        "ns_st_ev", "ns_st_po", "ns_st_cl", "ns_st_el", "ns_st_pb", "ns_st_hc", "ns_st_mp", "ns_st_mv", "ns_st_pn",
        "ns_st_tp", "ns_st_pt", "ns_st_pa", "ns_st_ad", "ns_st_li", "ns_st_ci",
        "ns_ap_jb", "ns_ap_res", "ns_ap_c12m", "ns_ap_install", "ns_ap_updated", "ns_ap_lastrun",
        "ns_ap_cs", "ns_ap_runs", "ns_ap_usage", "ns_ap_fg", "ns_ap_ft", "ns_ap_dft", "ns_ap_bt", "ns_ap_dbt",
        "ns_ap_dit", "ns_ap_as", "ns_ap_das", "ns_ap_it", "ns_ap_uc", "ns_ap_aus", "ns_ap_daus", "ns_ap_us",
        "ns_ap_dus", "ns_ap_ut", "ns_ap_oc", "ns_ap_uxc", "ns_ap_uxs", "ns_ap_lang", "ns_ap_miss", "ns_ts",
        "ns_st_ca", "ns_st_cp", "ns_st_er", "ns_st_pe", "ns_st_ui", "ns_st_bc", "ns_st_bt",
        "ns_st_bp", "ns_st_pc", "ns_st_pp", "ns_st_br", "ns_st_ub", "ns_st_vo", "ns_st_ws", "ns_st_pl", "ns_st_pr",
        "ns_st_ep", "ns_st_ty", "ns_st_cs", "ns_st_ge", "ns_st_st", "ns_st_dt", "ns_st_ct",
        "ns_st_de", "ns_st_pu", "ns_st_cu", "ns_st_fee",
        "c3", "c4", "c5", "c6", "c10", "c11", "c12", "c13", "c14", "c15", "c16", "c7", "c8", "c9"
    ]
};
var Clip = (function() {
    var Clip = function() {
        var self = this
            , pauses = 0
            , starts = 0
            , bufferingTime = 0
            , bufferingTimestamp = 0
            , playbackTime = 0
            , playbackTimestamp = 0
            , clipId
            , _labels

        function store(key, labels) {
            var value = labels[key];
            if (value != null) {
                _labels[key] = value;
            }
        }

        Utils.extend(this, {
            reset: function(keepLabels) {

                if (keepLabels != null && keepLabels.length > 0) {
                    Utils.filterMap(_labels, keepLabels);
                } else {
                    _labels = {};
                }

                if (!_labels.hasOwnProperty("ns_st_cl"))
                    _labels["ns_st_cl"] = "0";

                if (!_labels.hasOwnProperty("ns_st_pn"))
                    _labels["ns_st_pn"] = "1";

                if (!_labels.hasOwnProperty("ns_st_tp"))
                    _labels["ns_st_tp"] = "1";

                self.setPauses(0);
                self.setStarts(0);
                self.setBufferingTime(0);
                self.setBufferingTimestamp(-1);
                self.setPlaybackTime(0);
                self.setPlaybackTimestamp(-1);
            },

            setLabels: function(newLabels, state) {
                if (newLabels != null) {
                    Utils.extend(_labels, newLabels);
                }
                self.setRegisters(_labels, state);
            },

            getLabels: function() {
                return _labels;
            },

            setLabel: function(label, value) {
                var map = {};
                map[label] = value;

                self.setLabels(map, null);
            },

            getLabel: function(label) {
                return _labels[label];
            },

            getClipId: function() {
                if (typeof clipId == 'undefined' || clipId == null) {

                    self.setClipId("1");
                }
                return clipId;
            },

            setClipId: function(cid) {
                clipId = cid;
            },

            setRegisters: function(labels, state) {
                var value = labels["ns_st_cn"];
                if (value != null) {
                    self.setClipId(value);
                    delete labels["ns_st_cn"];
                }

                value = labels["ns_st_bt"];
                if (value != null) {
                    bufferingTime = Number(value);
                    delete labels["ns_st_bt"]
                }

                store("ns_st_cl", labels);
                store("ns_st_pn", labels);
                store("ns_st_tp", labels);
                store("ns_st_ub", labels);
                store("ns_st_br", labels);

                if (state == State.PLAYING || state == null) {
                    value = labels["ns_st_sq"];
                    if (value != null) {
                        starts = Number(value);
                        delete labels["ns_st_sq"];
                    }
                }

                if (state != State.BUFFERING) {
                    value = labels["ns_st_pt"];
                    if (value != null) {
                        playbackTime = Number(value);
                        delete labels["ns_st_pt"];
                    }
                }

                if (state == State.PAUSED || state == State.IDLE || state == null) {
                    value = labels["ns_st_pc"];
                    if (value != null) {
                        pauses = Number(value);
                        delete labels["ns_st_pc"];
                    }
                }
            },

            createLabels: function(eventType, initialLabels) {
                var labelMap = initialLabels || {};
                labelMap["ns_st_cn"] = self.getClipId();
                labelMap["ns_st_bt"] = String(self.getBufferingTime());

                if (eventType == StreamSenseEventType.PLAY || eventType == null) {
                    labelMap["ns_st_sq"] = String(starts);
                }
                if (eventType == StreamSenseEventType.PAUSE || eventType == StreamSenseEventType.END || eventType == StreamSenseEventType.KEEP_ALIVE || eventType == StreamSenseEventType.HEART_BEAT || eventType == null) {
                    labelMap["ns_st_pt"] = String(self.getPlaybackTime());
                    labelMap["ns_st_pc"] = String(pauses);
                }

                Utils.extend(labelMap, self.getLabels());
                return labelMap;
            },

            incrementPauses: function() {
                pauses++;
            },

            incrementStarts: function() {
                starts++;
            },

            getBufferingTime: function() {
                var ret = bufferingTime;

                if (bufferingTimestamp >= 0) {
                    ret += +new Date() - bufferingTimestamp;
                }
                return ret;
            },

            setBufferingTime: function(bt) {
                bufferingTime = bt;
            },

            getPlaybackTime: function() {
                var ret = playbackTime;

                if (playbackTimestamp >= 0) {
                    ret += +new Date() - playbackTimestamp;
                }
                return ret;
            },

            setPlaybackTime: function(pt) {
                playbackTime = pt;
            },

            getPlaybackTimestamp: function() {
                return playbackTimestamp;
            },

            setPlaybackTimestamp: function(pt) {
                playbackTimestamp = pt;
            },

            getBufferingTimestamp: function() {
                return bufferingTimestamp;
            },

            setBufferingTimestamp: function(bt) {
                bufferingTimestamp = bt;
            },

            getPauses: function() {
                return pauses;
            },

            setPauses: function(p) {
                pauses = p;
            },

            getStarts: function() {
                return starts;
            },

            setStarts: function(s) {
                starts = s;
            }
        });

        _labels = {};
        self.reset();
    }

    return Clip;
})();
var Playlist = (function() {
    var Playlist = function() {
        var self = this
            , clip = null
            , playlistId
            , starts = 0
            , pauses = 0
            , rebufferCount = 0
            , bufferingTime = 0
            , playbackTime = 0
            , _labels
            , playlistCounter = 0
            , firstPlayOccurred = false

        Utils.extend(this, {
            reset: function(keepLabels) {
                if (keepLabels != null && keepLabels.length > 0) {
                    Utils.filterMap(_labels, keepLabels);
                } else {
                    _labels = {};
                }

                self.setPlaylistId(+new Date() + "_" + playlistCounter);
                self.setBufferingTime(0);
                self.setPlaybackTime(0);
                self.setPauses(0);
                self.setStarts(0);
                self.setRebufferCount(0);
                firstPlayOccurred = false;
            },

            setLabels: function(newLabels, state) {
                if (newLabels != null) {
                    Utils.extend(_labels, newLabels);
                }
                self.setRegisters(_labels, state);
            },

            getLabels: function() {
                return _labels;
            },

            setLabel: function(label, value) {
                var map = {};
                map[label] =  value;
                self.setLabels(map, null);
            },

            getLabel: function(label) {
                return _labels[label];
            },

            getClip: function() {
                return clip;
            },

            getPlaylistId: function() {
                return playlistId;
            },

            setPlaylistId: function(pid) {
                playlistId = pid;
            },

            setRegisters: function(labels, state) {

                var value = labels["ns_st_sp"];
                if (value != null) {
                    starts = Number(value);
                    delete labels["ns_st_sp"];
                }

                value = labels["ns_st_bc"];
                if (value != null) {
                    rebufferCount = Number(value);
                    delete labels["ns_st_bc"];
                }

                value = labels["ns_st_bp"];
                if (value != null) {
                    bufferingTime = Number(value);
                    delete labels["ns_st_bp"];
                }

                value = labels["ns_st_id"];
                if (value != null) {
                    playlistId = value;
                    delete labels["ns_st_id"];
                }


                if (state != State.BUFFERING) {
                    value = labels["ns_st_pa"];
                    if (value != null) {
                        playbackTime = Number(value);
                        delete labels["ns_st_pa"];
                    }
                }

                if (state == State.PAUSED || state == State.IDLE || state == null) {
                    value = labels["ns_st_pp"];
                    if (value != null) {
                        pauses = Number(value);
                        delete labels["ns_st_pp"];
                    }
                }
            },

            createLabels: function(eventType, initialLabels) {
                var labelMap = initialLabels || {};
                labelMap["ns_st_bp"] = String(self.getBufferingTime());
                labelMap["ns_st_sp"] = String(starts);
                labelMap["ns_st_id"] = String(playlistId);

                if (rebufferCount > 0) {
                    labelMap["ns_st_bc"] = String(rebufferCount);
                }

                if (eventType == StreamSenseEventType.PAUSE || eventType == StreamSenseEventType.END || eventType == StreamSenseEventType.KEEP_ALIVE || eventType == StreamSenseEventType.HEART_BEAT || eventType == null) {
                    labelMap["ns_st_pa"] = String(self.getPlaybackTime());
                    labelMap["ns_st_pp"] = String(pauses);
                }

                if (eventType == StreamSenseEventType.PLAY || eventType == null) {
                    if (!self.didFirstPlayOccurred()) {
                        labelMap["ns_st_pb"] = "1";
                        self.setFirstPlayOccurred(true);
                    }
                }

                Utils.extend(labelMap, self.getLabels());
                return labelMap;
            },

            incrementStarts: function() {
                starts++;
            },

            incrementPauses: function() {
                pauses++;
                clip.incrementPauses();
            },

            setPlaylistCounter: function(pc) {
                playlistCounter = pc;
            },

            incrementPlaylistCounter: function() {
                playlistCounter++;
            },

            addPlaybackTime: function(now) {
                if (clip.getPlaybackTimestamp() >= 0) {
                    var diff = now - clip.getPlaybackTimestamp();
                    clip.setPlaybackTimestamp(-1); // setting the timestamp to avoid adding time offset calculated in getter method
                    clip.setPlaybackTime(clip.getPlaybackTime() + diff);
                    self.setPlaybackTime(self.getPlaybackTime() + diff);
                }
            },

            addBufferingTime: function(now) {
                if (clip.getBufferingTimestamp() >= 0) {
                    var diff = now - clip.getBufferingTimestamp();
                    clip.setBufferingTimestamp(-1); // setting the timestamp to avoid adding time offset calculated in getter method
                    clip.setBufferingTime(clip.getBufferingTime() + diff);
                    self.setBufferingTime(self.getBufferingTime() + diff);
                }
            },

            getBufferingTime: function() {
                var ret = bufferingTime;
                if (clip.getBufferingTimestamp() >= 0) {
                    ret += +new Date() - clip.getBufferingTimestamp();
                }
                return ret;
            },

            setBufferingTime: function(bt) {
                bufferingTime = bt;
            },

            getPlaybackTime: function() {
                var ret = playbackTime;
                if (clip.getPlaybackTimestamp() >= 0) {
                    ret += +new Date() - clip.getPlaybackTimestamp();
                }

                return ret;
            },

            setPlaybackTime: function(pt) {
                playbackTime = pt;
            },

            getStarts: function() {
                return starts;
            },

            setStarts: function(s) {
                starts = s;
            },

            getPauses: function() {
                return pauses;
            },

            setPauses: function(p) {
                pauses = p;
            },

            getRebufferCount: function() {
                return rebufferCount;
            },

            incrementRebufferCount: function() {
                rebufferCount++;
            },

            setRebufferCount: function(rc) {
                rebufferCount = rc;
            },

            didFirstPlayOccurred: function() {
                return firstPlayOccurred;
            },

            setFirstPlayOccurred: function(fpo) {
                firstPlayOccurred = fpo;
            }
        });

        clip = new Clip();
        _labels = {};
        self.reset();
    }

    return Playlist;
})();
var StreamSense = (function () {
    var StreamSense = function (aLabels, aPixelURL) {
        var self = this
            , PAUSE_PLAY_SWITCH_DELAY = 500
            , persistentLabelMap
            , pixelURL = null
            , lastStateChangeTimestamp = 0
            , lastKnownPosition = 0
            , delayedTransitionTimer // Timer used when pause play switch is enabled to help enforce the throttling feature
            , previousState
            , currentState
            , nextEventCount = 0
            , playlist = null
            , core
            , sdkPersistentLabelsSharing = true
            , pausedOnBufferingTimer
            , pauseOnBufferingEnabled = true
            , keepAliveTimer
            , heartBeatTimer
            , heartbeatIntervals = StreamSenseConstants.DEFAULT_HEARTBEAT_INTERVAL
            , keepAliveInterval = StreamSenseConstants.DEFAULT_KEEP_ALIVE_INTERVAL
            , pauseOnBufferingInterval = StreamSenseConstants.DEFAULT_PAUSED_ON_BUFFERING_INTERVAL
            , nextHeartBeatInterval = 0
            , heartBeatCount = 0
            , nextHeartBeatTimestamp = 0
            , pausePlaySwitchDelayEnabled = false //TODO: should change the following to enabled by default when this feature becomes stable
            , lastStateWithMeasurement
            , mediaPlayerName
            , mediaPlayerVersion
            , measurementSnapshot
            , listenerList
            , exports = {};

        function getHeartBeatInterval(playbackTime) {
            var res = 0;
            if (heartbeatIntervals != null) {
                for (var i = 0; i < heartbeatIntervals.length; i++) {
                    var obj = heartbeatIntervals[i];
                    var playingTime = obj.playingtime;
                    if (!playingTime || playbackTime < playingTime) {
                        res = obj.interval;
                        break;
                    }
                }
            }
            return res;
        }

        function resumeHeartBeatTimer() {

            releaseHeartBeatTimer();

            var interval = getHeartBeatInterval(playlist.getClip().getPlaybackTime());

            if (interval > 0) {
                var delay = nextHeartBeatInterval > 0 ? nextHeartBeatInterval : interval;
                heartBeatTimer = setTimeout(dispatchHeartBeatEvent, delay);
            }

            nextHeartBeatInterval = 0;
        }

        function pauseHeartBeatTimer() {
            releaseHeartBeatTimer();
            var interval = getHeartBeatInterval(playlist.getClip().getPlaybackTime());
            nextHeartBeatInterval = interval - (playlist.getClip().getPlaybackTime() % interval);
            if (heartBeatTimer != null) {
                releaseHeartBeatTimer();
            }
        }

        function resetHeartBeatTimer() {
            nextHeartBeatInterval = 0;
            nextHeartBeatTimestamp = 0;
            heartBeatCount = 0;
        }

        function dispatchHeartBeatEvent() {
            heartBeatCount++;

            var eventLabelMap = createMeasurementLabels(StreamSenseEventType.HEART_BEAT, null);
            dispatch(eventLabelMap);

            nextHeartBeatInterval = 0;
            resumeHeartBeatTimer();
        }

        function releaseHeartBeatTimer() {
            if (heartBeatTimer != null) {
                clearTimeout(heartBeatTimer);
                heartBeatTimer = null;
            }
        }

        function startKeepAliveTimer() {

            stopKeepAliveTimer();

            keepAliveTimer = setTimeout(dispatchKeepAlive, keepAliveInterval);
        }

        function dispatchKeepAlive() {
            var eventLabelMap = createMeasurementLabels(StreamSenseEventType.KEEP_ALIVE, null);

            dispatch(eventLabelMap);
            nextEventCount++;
            startKeepAliveTimer();
        }

        function stopKeepAliveTimer() {
            if (keepAliveTimer != null) {
                clearTimeout(keepAliveTimer);
                keepAliveTimer = null;
            }
        }

        function startPausedOnBufferingTimer() {
            stopPausedOnBufferingTimer();

            if (self.isPauseOnBufferingEnabled() && willCauseMeasurement(State.PAUSED)) {
                pausedOnBufferingTimer = setTimeout(dispatchPausedOnBufferingEvent, pauseOnBufferingInterval)
            }
        }

        function dispatchPausedOnBufferingEvent() {
            if (lastStateWithMeasurement == State.PLAYING) {

                playlist.incrementRebufferCount();
                playlist.incrementPauses();

                var labels = createMeasurementLabels(StreamSenseEventType.PAUSE, null);

                dispatch(labels);
                nextEventCount++;
                lastStateWithMeasurement = State.PAUSED;
            }
        }

        function stopPausedOnBufferingTimer() {
            if (pausedOnBufferingTimer != null) {
                clearTimeout(pausedOnBufferingTimer);
                pausedOnBufferingTimer = null;
            }
        }

        function isPlayOrPause(state) {
            return state == State.PLAYING || state == State.PAUSED;
        }

        function stopDelayedTransitionTimer() {
            if (delayedTransitionTimer) {
                clearInterval(delayedTransitionTimer);
                delayedTransitionTimer = null;
            }
        }

        function eventTypeToState(event) {
            if (event == StreamSenseEventType.PLAY) {
                return State.PLAYING;
            } else if (event == StreamSenseEventType.PAUSE) {
                return State.PAUSED;
            } else if (event == StreamSenseEventType.BUFFER) {
                return State.BUFFERING;
            } else if (event == StreamSenseEventType.END) {
                return State.IDLE;
            }

            return null;
        }

        function transitionTo(newState, eventLabelMap, delay) {
            stopDelayedTransitionTimer();

            if (delay) {


                delayedTransitionTimer = setInterval(function () {
                    transitionTo(newState, eventLabelMap);
                }, delay);
            } else if (canTransitionTo(newState)) {
                var oldState = getState();
                var oldStateChangeTimestamp = lastStateChangeTimestamp;
                var eventTime = getTime(eventLabelMap);
                var delta = (oldStateChangeTimestamp >= 0) ? eventTime - oldStateChangeTimestamp : 0;

                onExit(getState(), eventLabelMap);
                onEnter(newState, eventLabelMap);
                setPreviousState(getState());
                setState(newState);

                for (var i = 0, len = listenerList.length; i < len; i++) {
                    listenerList[i](oldState, newState, eventLabelMap, delta);
                }

                setRegisters(eventLabelMap);
                playlist.setRegisters(eventLabelMap, newState);
                playlist.getClip().setRegisters(eventLabelMap, newState);

                var dispatchLabels = createMeasurementLabels(State.toEventType(newState), eventLabelMap);
                Utils.extend(dispatchLabels, eventLabelMap);

                if (willCauseMeasurement(currentState)) {
                    dispatch(dispatchLabels);
                    lastStateWithMeasurement = currentState;
                    nextEventCount++;
                }
            }
        }

        function setRegisters(labels) {

            var value = labels["ns_st_mp"];
            if (value != null) {
                mediaPlayerName = value;
                delete labels["ns_st_mp"];
            }

            value = labels["ns_st_mv"];
            if (value != null) {
                mediaPlayerVersion = value;
                delete labels["ns_st_mv"];
            }

            value = labels["ns_st_ec"];
            if (value != null) {
                nextEventCount = Number(value);
                delete labels["ns_st_ec"];
            }
        }

        function dispatch(eventLabelMap, snapshot) {
            if (snapshot === undefined) {
                snapshot = true;
            }
            if (snapshot) {
                makeMeasurementSnapshot(eventLabelMap);
            }

            var pixelURL = self.getPixelURL();
            if (core) {
                if (!isNotProperlyInitialized()) {
                    var ApplicationMeasurement = exports.am, EventType = exports.et;
                    var m = ApplicationMeasurement.newApplicationMeasurement(core, EventType.HIDDEN, eventLabelMap, pixelURL);
                    core.getQueue().offer(m);
                }
            } else if (pixelURL) {
                httpGet(prepareUrl(pixelURL, eventLabelMap));
            }
        }

        function isNotProperlyInitialized() {
            var appContext = core.getAppContext();
            var salt = core.getSalt();
            var pixelURL = core.getPixelURL();
            return appContext == null || salt == null || salt.length == 0 || pixelURL == null || pixelURL.length == 0;
        }

        function makeMeasurementSnapshot(labels) {
            measurementSnapshot = createMeasurementLabels(null);
            Utils.extend(measurementSnapshot, labels);
        }

        function onExit(oldState, eventLabelMap) {
            var eventTime = getTime(eventLabelMap);

            if (oldState == State.PLAYING) {
                playlist.addPlaybackTime(eventTime);
                pauseHeartBeatTimer();
                stopKeepAliveTimer();
            } else if (oldState == State.BUFFERING) {
                playlist.addBufferingTime(eventTime);
                stopPausedOnBufferingTimer();
            }
            else if (oldState == State.IDLE) {

                var clipLabelsKeyArray = Utils.getKeys(playlist.getClip().getLabels());
                playlist.getClip().reset(clipLabelsKeyArray);
            }
        }

        function onEnter(newState, eventLabelMap) {
            var eventTime = getTime(eventLabelMap);

            var playerPosition = getPlayerPosition(eventLabelMap);
            lastKnownPosition = playerPosition;

            if (newState == State.PLAYING) {
                resumeHeartBeatTimer();
                startKeepAliveTimer();
                playlist.getClip().setPlaybackTimestamp(eventTime);

                if (willCauseMeasurement(newState)) {
                    playlist.getClip().incrementStarts();
                    if (playlist.getStarts() < 1) {

                        playlist.setStarts(1);
                    }
                }
            } else if (newState == State.PAUSED) {
                if (willCauseMeasurement(newState)) {
                    playlist.incrementPauses();
                }
            } else if (newState == State.BUFFERING) {
                playlist.getClip().setBufferingTimestamp(eventTime);
                if (pauseOnBufferingEnabled) {
                    startPausedOnBufferingTimer();
                }
            } else if (newState == State.IDLE) {

                resetHeartBeatTimer();
            }
        }

        function willCauseMeasurement(state) {

            if (state == State.PAUSED && (lastStateWithMeasurement == State.IDLE || lastStateWithMeasurement == null)) {
                return false;
            } else {
                return state != State.BUFFERING && lastStateWithMeasurement != state;
            }
        }

        function getPlayerPosition(labelMap) {

            var playerPosition = -1;
            if (labelMap.hasOwnProperty("ns_st_po")) {
                playerPosition = Utils.getInteger(labelMap["ns_st_po"]);
            }
            return playerPosition;
        }

        function getTime(labelMap) {
            var time = -1;
            if (labelMap.hasOwnProperty("ns_ts")) {
                time = Number(labelMap["ns_ts"]);
            }
            return time;
        }

        function canTransitionTo(newState) {
            return (newState != null) && (getState() != newState);
        }

        function setState(newState) {
            currentState = newState;
            lastStateChangeTimestamp = +new Date();
        }

        function getState() {
            return currentState;
        }

        function setPreviousState(newState) {
            previousState = newState;
        }

        function getPreviousState() {
            return previousState;
        }

        function createMeasurementLabels() {
            var eventType, initialLabels;
            if (arguments.length == 1) {
                eventType = State.toEventType(currentState);
                initialLabels = arguments[0];
            } else {
                eventType = arguments[0];
                initialLabels = arguments[1];
            }
            var labelMap = {};

            if (typeof document != 'undefined') {
                var d = document;
                labelMap.c7 = d.URL;
                labelMap.c8 = d.title;
                labelMap.c9 = d.referrer;
            }

            if (initialLabels != null) {
                Utils.extend(labelMap, initialLabels);
            }

            if (!labelMap.hasOwnProperty("ns_ts")) {
                labelMap["ns_ts"] = String(+new Date());
            }

            if (eventType != null && !labelMap.hasOwnProperty("ns_st_ev")) {
                labelMap["ns_st_ev"] = StreamSenseEventType.toString(eventType);
            }

            if (self.isPersistentLabelsShared() && core) {
                Utils.extend(labelMap, core.getLabels());
            }

            Utils.extend(labelMap, self.getLabels());

            createLabels(eventType, labelMap);

            playlist.createLabels(eventType, labelMap);

            playlist.getClip().createLabels(eventType, labelMap);

            if (!labelMap.hasOwnProperty("ns_st_mp")) {

                labelMap["ns_st_mp"] = mediaPlayerName;
            }

            if (!labelMap.hasOwnProperty("ns_st_mv")) {

                labelMap["ns_st_mv"] = mediaPlayerVersion;
            }

            if (!labelMap.hasOwnProperty("ns_st_ub")) {

                labelMap["ns_st_ub"] = "0";
            }

            if (!labelMap.hasOwnProperty("ns_st_br")) {
                labelMap["ns_st_br"] = "0";
            }

            if (!labelMap.hasOwnProperty("ns_st_pn")) {
                labelMap["ns_st_pn"] = "1";
            }

            if (!labelMap.hasOwnProperty("ns_st_tp")) {
                labelMap["ns_st_tp"] = "1";
            }

            if (!labelMap.hasOwnProperty("ns_st_it")) {
                labelMap["ns_st_it"] = "c";
            }

            labelMap["ns_st_sv"] = StreamSenseConstants.STREAMSENSE_VERSION;

            labelMap["ns_type"] = "hidden"; // EventType.HIDDEN;

            return labelMap;
        }

        function createLabels(eventType, initialLabels) {
            var labelMap = initialLabels || {};

            labelMap["ns_st_ec"] = String(nextEventCount);
            if (!labelMap.hasOwnProperty("ns_st_po")) {
                var currentPosition = lastKnownPosition;
                var eventTime = getTime(labelMap);
                if (eventType == StreamSenseEventType.PLAY || eventType == StreamSenseEventType.KEEP_ALIVE || eventType == StreamSenseEventType.HEART_BEAT || (eventType == null && currentState == State.PLAYING)) {
                    currentPosition += eventTime - playlist.getClip().getPlaybackTimestamp();
                }
                labelMap["ns_st_po"] = Utils.getInteger(currentPosition);
            }

            if (eventType == StreamSenseEventType.HEART_BEAT) {
                labelMap["ns_st_hc"] = String(heartBeatCount);
            }

            return labelMap;
        }

        function fixEventTime(eventLabelMap) {
            var time = getTime(eventLabelMap);

            if (time < 0) {
                eventLabelMap["ns_ts"] = String(+new Date());
            }
        }

        Utils.extend(this, {
            reset: function (keepLabels) {
                playlist.reset(keepLabels);
                playlist.setPlaylistCounter(0);
                playlist.setPlaylistId(+new Date() + "_1");
                playlist.getClip().reset(keepLabels);

                if (keepLabels != null && !keepLabels.isEmpty()) {
                    Utils.filterMap(persistentLabelMap, keepLabels);
                } else {
                    persistentLabelMap = {};
                }

                nextEventCount = 1;
                heartBeatCount = 0;
                pauseHeartBeatTimer();
                resetHeartBeatTimer();
                stopKeepAliveTimer();
                stopPausedOnBufferingTimer();
                stopDelayedTransitionTimer();
                currentState = State.IDLE;
                previousState = null;
                lastStateChangeTimestamp = -1;
                lastStateWithMeasurement = null;
                mediaPlayerName = StreamSenseConstants.DEFAULT_PLAYERNAME;
                mediaPlayerVersion = StreamSenseConstants.STREAMSENSE_VERSION;
                measurementSnapshot = null;
            },

            setPauseOnBufferingInterval: function (interval) {
                pauseOnBufferingInterval = interval;
            },

            getPauseOnBufferingInterval: function () {
                return pauseOnBufferingInterval;
            },

            setKeepAliveInterval: function (interval) {
                keepAliveInterval = interval;
            },

            getKeepAliveInterval: function () {
                return keepAliveInterval;
            },

            setHeartbeatIntervals: function (intervals) {
                heartbeatIntervals = intervals;
            },

            notify: function () {
                var newState
                    , eventType
                    , eventLabelMap
                    , position

                eventType = arguments[0];
                if (arguments.length == 3) {
                    eventLabelMap = arguments[1];
                    position = arguments[2];
                } else {
                    eventLabelMap = {};
                    position = arguments[1];
                }

                newState = eventTypeToState(eventType);

                var dispatchLabels = Utils.extend({}, eventLabelMap);
                fixEventTime(dispatchLabels);

                if (!dispatchLabels.hasOwnProperty("ns_st_po")) {
                    dispatchLabels["ns_st_po"] = Utils.getInteger(position).toString();
                }

                if (eventType == StreamSenseEventType.PLAY || eventType == StreamSenseEventType.PAUSE || eventType == StreamSenseEventType.BUFFER
                    || eventType == StreamSenseEventType.END) {
                    if (self.isPausePlaySwitchDelayEnabled() && isPlayOrPause(currentState) && isPlayOrPause(newState)
                        && !(currentState == State.PLAYING && newState == State.PAUSED && !delayedTransitionTimer)) {
                        transitionTo(newState, dispatchLabels, PAUSE_PLAY_SWITCH_DELAY);
                    } else {
                        transitionTo(newState, dispatchLabels);
                    }
                } else {
                    var labels = createMeasurementLabels(eventType, dispatchLabels);
                    Utils.extend(labels, dispatchLabels);
                    dispatch(labels, false);
                    nextEventCount++;
                }
            },

            getLabels: function () {
                return persistentLabelMap;
            },

            getState: function () {
                return currentState;
            },

            setLabels: function (labelMap) {
                if (labelMap != null) {
                    if (persistentLabelMap == null) {
                        persistentLabelMap = labelMap;
                    } else {
                        Utils.extend(persistentLabelMap, labelMap);
                    }
                }
            },

            getLabel: function (name) {
                return persistentLabelMap[name];
            },

            setLabel: function (name, value) {
                if (value == null) {
                    delete persistentLabelMap[name];
                } else {
                    persistentLabelMap[name] = value;
                }
            },

            setPixelURL: function (value) {
                if (value == null || value.length == 0) {
                    return null;
                }

                var decode = decodeURIComponent || unescape;

                var questionMarkIdx = value.indexOf('?');
                if (questionMarkIdx >= 0) {
                    if (questionMarkIdx < value.length - 1) {
                        var labels = value.substring(questionMarkIdx + 1).split("&");
                        for (var i = 0, len = labels.length; i < len; i++) {
                            var label = labels[i];
                            var pair = label.split("=");
                            if (pair.length == 2) {
                                self.setLabel(pair[0], decode(pair[1]));
                            } else if (pair.length == 1) {
                                self.setLabel(StreamSenseConstants.PAGE_NAME_LABEL, decode(pair[0]));
                            }
                        }
                        value = value.substring(0, questionMarkIdx + 1);
                    }
                } else {
                    value = value + '?';
                }
                pixelURL = value;

                return pixelURL;
            },

            getPixelURL: function () {
                if (pixelURL) {
                    return pixelURL;
                } else if (typeof ns_p !== 'undefined' && typeof ns_p.src === 'string') {
                    return (pixelURL = ns_p.src.replace(/&amp;/, '&').replace(/&ns__t=\d+/, ''));
                } else if (typeof ns_pixelUrl === 'string') {
                    return (pixelURL = ns_pixelUrl.replace(/&amp;/, '&').replace(/&ns__t=\d+/, ''));
                }

                return null;
            },

            isPersistentLabelsShared: function () {
                return sdkPersistentLabelsSharing;
            },

            setPersistentLabelsShared: function (flag) {
                sdkPersistentLabelsSharing = flag;
            },

            isPauseOnBufferingEnabled: function () {
                return pauseOnBufferingEnabled;
            },

            setPauseOnBufferingEnabled: function (flag) {
                pauseOnBufferingEnabled = flag;
            },

            isPausePlaySwitchDelayEnabled: function () {
                return pausePlaySwitchDelayEnabled;
            },

            setPausePlaySwitchDelayEnabled: function (flag) {
                pausePlaySwitchDelayEnabled = flag;
            },

            setPausePlaySwitchDelay: function (value) {
                if (value && value > 0)
                    PAUSE_PLAY_SWITCH_DELAY = value;
            },

            getPausePlaySwitchDelay: function () {
                return PAUSE_PLAY_SWITCH_DELAY;
            },

            setClip: function (labels, loop) {
                var result = false;
                if (currentState == State.IDLE) {
                    playlist.getClip().reset();
                    playlist.getClip().setLabels(labels, null);
                    if (loop) {
                        playlist.incrementStarts();
                    }
                    result = true;
                }
                return result;
            },

            setPlaylist: function (labels) {
                var result = false;
                if (currentState == State.IDLE) {
                    playlist.incrementPlaylistCounter();
                    playlist.reset();
                    playlist.getClip().reset();
                    playlist.setLabels(labels, null);
                    result = true;
                }
                return result;
            },

            importState: function (labels) {
                reset();
                var rest = Utils.extend({}, labels);
                playlist.setRegisters(rest, null);
                playlist.getClip().setRegisters(rest, null);
                setRegisters(rest);
                nextEventCount++;
            },

            exportState: function () {
                return measurementSnapshot;
            },

            getVersion: function () {
                return StreamSenseConstants.STREAMSENSE_VERSION;
            },

            addListener: function (listener) {
                listenerList.push(listener);
            },

            removeListener: function (listener) {
                listenerList.splice(Utils.indexOf(listener, listenerList), 1);
            },

            getClip: function () {
                return playlist.getClip();
            },

            getPlaylist: function () {
                return playlist;
            },

            setHttpGet: setHttpGet,
            setHttpPost: setHttpPost

        });

        if ('streamsense.trilithium.js' == 'streamsense.test.js') {
            Utils.extend(this, {
                dispatch: dispatch,
                sendHeartBeatMeasurement: dispatchHeartBeatEvent,
                sendKeepAliveMeasurement: dispatchKeepAlive
            });
        }

/**
 * The advertisement events API. Ad events can also be passed to the
 * notify() method and they will be redirected here.
 * @public
 * @param {ns_.StreamSense.AdEvent} adEvent
 * @param {Object} [eventLabels]
 * @param {Number} [playheadPosition]
 */
function adNotify(adEvent, eventLabels, playheadPosition) {
    eventLabels = eventLabels || {};
    eventLabels.ns_st_ad = 1;

    if (adEvent >= StreamSenseEventType.AD_PLAY && adEvent <= StreamSenseEventType.AD_CLICK) {
        self.notify(adEvent, eventLabels, playheadPosition);
    }
}

/**
 * Custom events notification API.
 * @public
 * @param {Object} [eventLabels]
 * @param {Number} [playheadPosition]
 */
function customNotify(eventLabels, playheadPosition) {
    self.notify(StreamSenseEventType.CUSTOM, eventLabels, playheadPosition);
}

Utils.extend(this, {
    adNotify: adNotify,
    customNotify: customNotify,
    viewNotify: function(pixelUrl, labels) {
        pixelUrl = pixelUrl || self.getPixelURL();
        if (pixelUrl) {
            viewNotify(pixelUrl, labels) // defined in streamsense.dom.js and streamsense.nondom.js
        }
    }
});


        if (ns_.comScore) {
            exports = ns_.comScore.exports;
            core = exports.c();
        }
        persistentLabelMap = {};
        nextEventCount = 1;
        currentState = State.IDLE;
        playlist = new Playlist();
        pausedOnBufferingTimer = null;
        pauseOnBufferingEnabled = true;
        heartBeatTimer = null;
        heartBeatCount = 0;
        resetHeartBeatTimer();
        keepAliveTimer = null;
        delayedTransitionTimer = null;
        pausePlaySwitchDelayEnabled = false;
        lastStateWithMeasurement = null;
        lastKnownPosition = 0;
        listenerList = [];
        self.reset();

        aLabels && self.setLabels(aLabels);
        aPixelURL && self.setPixelURL(aPixelURL);
    };

/*
 * The static API for the Stream Sense Puppet is not exactly static. The
 * anonymous function is used to wrap instance data held by this API.
 */
(function(constructor) {
    var
        /**
         * All puppet instances.
         * @private
         */
        _instances = {}
        /**
         * Non-reusable index.
         * @private
         */
        , _lastIndex = -1
        /**
         * Active puppet index, all calls are redirected to this instance.
         * @private
         */
        , _activeIndex = -1


    /**
     * Get the active instance or create one if it doesn't exist.
     * @param {String|Object} [pixelUrl|labels]
     * @param {Obect} [labels]
     * @returns {ns_.StreamSense}
     */
    function _activeInstance (pixelUrl, labels) {
        return _instances[_activeIndex] || newInstance(pixelUrl, labels);
    }

    /**
     * Set the active index to the first available instance and update the
     * class value.
     * @returns {Number} active index
     */

    function _updateActiveIndex() {
        _activeIndex = -1;

        for (var i = 0; i <= _lastIndex; i++) {
            if (_instances.hasOwnProperty(i)) {
                _activeIndex = i;
                break; //-->
            }
        }

        ns_.StreamSense.activeIndex = _activeIndex;

        return _activeIndex;
    }

    /**
     * Create a new puppet instance.
     * @memberOf ns_.StreamSense
     * @param {String|Object} [pixelUrl|labels]
     * @param {Obect} [labels]
     * @returns {ns_.StreamSense}
     */
    function newInstance(pixelUrl, labels) {
        pixelUrl = pixelUrl || null;
        labels = labels || null;

        if (pixelUrl && typeof pixelUrl == 'object') {
            labels = pixelUrl;
            pixelUrl = null;
        }

        _instances[++_lastIndex] = new ns_.StreamSense(labels, pixelUrl);
        _updateActiveIndex();

        return _instances[_lastIndex];
    }

    /**
     * Remove the puppet instance from the instances list. If no arguments are
     * mentioned, the active puppet will be removed. If a numeric
     * argument is specified, the instance with the given index is removed. If
     * a ns_StreamSense argument is specified, that specific instance
     * will be removed.
     * @param {empty|Number|ns_.StreamSense}
     * @returns {false|ns_.StreamSense} false if the operation didn't
     * succeed
     */
    function destroyInstance (/** empty|index|puppet */) {
        var
            instance = false
            , index = _activeIndex // default to current instance


        if (typeof arguments[0] === 'number' && isFinite(arguments[0])) {
            index = arguments[0];
        } else if (arguments[0] instanceof ns_.StreamSense) {
            for (var i in _instances) {
                if (_instances[i] === arguments[0]) {
                    index = i;
                    break; //-->
                }
            }
        }

        if (_instances.hasOwnProperty(index)) {
            instance = _instances[index];
            delete _instances[index];
            instance.reset(); // end session
            _updateActiveIndex();
        }

        return instance;
    }

    /**
     * Create a new playlist instance for the current puppet instance.
     * @memberOf ns_.StreamSense
     * @param {Object} labels
     * @returns {ns_.StreamSense#Playlist}
     */
    function newPlaylist (labels) {
        labels = labels || {};
        _activeInstance().setPlaylist(labels);
        return _activeInstance().getPlaylist();
    }

    /**
     * Create a new clip instance for the current puppet. If the puppet is not
     * created it will be.
     * @memberOf ns_.StreamSense
     * @param {Object} [labels]
     * @param {Number} [clipNumber]
     * @param {Boolean} isLoop
     * @returns {ns_.StreamSense#Clip}
     */
    function newClip (labels, clipNumber, isLoop) {
        labels = labels || {};
        if (typeof clipNumber === 'number') {
            labels.ns_st_cn = clipNumber;
        }

        _activeInstance().setClip(labels, isLoop);

        return _activeInstance().getClip();
    }

    /**
     * Main API for player and ad events notifications.
     * @memberOf ns_.StreamSense
     * @param {ns_.StreamSense.PlayerEvents|ns_.StreamSense.AdEvents} event
     * @param {Object} [labels]
     * @param {Number} [playheadPosition]
     * @returns {ns_.StreamSense.PlayerStates}
     */
    function notify(event, labels, playheadPosition) {
        if (typeof event === 'undefined') {
            return false; //-->
        }

        playheadPosition = playheadPosition || null;
        labels = labels || {};

        return _activeInstance().notify(event, labels, playheadPosition);
    }

    /**
     * Set puppet labels.
     * @memberOf ns_.StreamSense
     * @param {Object} labels
     */
    function setLabels(labels) {
        if (typeof labels != 'undefined') {
            _activeInstance().setLabels(labels);
        }
    }

    /**
     * Get puppet custom labels.
     * @memberOf ns_.StreamSense
     * @returns {Object}
     */
    function getLabels() {
        return _activeInstance().getLabels();
    }

    /**
     * Set playlist labels. Custom labels are not persisted, they
     * need to be sent with each event.
     * @memberOf ns_.StreamSense
     * @param {Object} labels
     */
    function setPlaylistLabels (labels) {
        if (typeof labels != 'undefined') {
            _activeInstance().getPlaylist().setLabels(labels);
        }
    }

    /**
     * Get playlist custom labels.
     * @memberOf ns_.StreamSense
     * @returns {Object}
     */
    function getPlaylistLabels() {
        return _activeInstance().getPlaylist().getLabels();
    }

    /**
     * Set clip labels. Custom labels are not persisted, they
     * need to be sent with each event.
     * @memberOf ns_.StreamSense
     * @param {Object} labels
     */
    function setClipLabels (labels) {
        if (typeof labels != 'undefined') {
            _activeInstance().getClip().setLabels(labels);
        }
    }

    /**
     * Get clip custom labels.
     * @memberOf ns_.StreamSense
     * @returns {Object}
     */
    function getClipLabels() {
        return _activeInstance().getClip().getLabels();
    }

    /**
     * Reset the Puppet counters. Not including playlist and clip.
     * @memberOf ns_.StreamSense
     * @param {Object} [skipLabels] counters not to be reset.
     * @returns {ns_.StreamSense} self
     */
    function resetInstance (skipLabels) {
        return _activeInstance().reset(skipLabels || {});
    }

    /**
     * Reset the playlist counters. Not including clip.
     * @memberOf ns_.StreamSense
     * @param {Object} [skipLabels] counters not to be reset.
     * @returns {ns_.StreamSense#Playlist} self
     */
    function resetPlaylist (skipLabels) {
        return _activeInstance().getPlaylist().reset(skipLabels || {});
    }

    /**
     * Reset the clip counters.
     * @memberOf ns_.StreamSense
     * @param {Object} [skipLabels] counters not to be reset.
     * @returns {ns_.StreamSense#Clip} self
     */
    function resetClip (skipLabels) {
        return _activeInstance().getClip().reset(skipLabels || {});
    }

    /**
     * Send a page view event.
     * @memberOf ns_.StreamSense
     * @param {Object} [labels]
     * TODO Custom pixelUrl?
     */
    function viewEvent (labels) {
        labels = labels || {};
        return _activeInstance().viewNotify(null, labels);
    }

    /**
     * Send a custom event. This doesn't affect the puppet state.
     * @memberOf ns_.StreamSense
     * @param {Object} labels
     * @param {Number} [playheadPosition]
     */
    function customEvent (labels, playheadPosition) {
        if (arguments.length > 2) { // for backward compatibility
          labels = arguments[1];
          playheadPosition = arguments[2];
        }
        labels = labels || {};
        if (typeof playheadPosition == 'number') {
            labels.ns_st_po = playheadPosition;
        }
        return _activeInstance().customNotify(labels, playheadPosition);
    }

    /**
     * Exports the current puppet state.
     * @public
     * @returns {Object} Snapshot of the state.
     */
    function exportState() {
      return _activeInstance().exportState();
    }

    /**
     * Imports a puppet state from the provided object.
     * @public
     * @param {Object} [state] Object containing labels snapshot.
     * @param {Number} [playheadPosition]
     */
    function importState(state) {
      _activeInstance().importState(state);
    }

    Utils.extend(constructor, {
        activeIndex: _activeIndex,
        newInstance: newInstance,
        'new': newInstance,
        destroyInstance: destroyInstance,
        destroy: destroyInstance, // alias
        newPlaylist: newPlaylist,
        newClip: newClip,
        notify: notify,
        setLabels: setLabels,
        getLabels: getLabels,
        setPlaylistLabels: setPlaylistLabels,
        getPlaylistLabels: getPlaylistLabels,
        setClipLabels: setClipLabels,
        getClipLabels: getClipLabels,
        resetInstance: resetInstance,
        resetPlaylist: resetPlaylist,
        resetClip: resetClip,
        viewEvent: viewEvent,
        customEvent: customEvent,
        exportState: exportState,
        importState: importState
    });
})(StreamSense);

    return StreamSense;
})();

StreamSense.AdEvents = AdEvents;
StreamSense.PlayerEvents = StreamSenseEventType;

    ns_.StreamingTag = ns_.StreamingTag || (function () {
var StreamingTag = (function () {
    var StreamingTag = function (settings) {
        var self = this
            , _clipNumber = 0
            , _lastPlayTimestamp = 0
            , _lastCalculatedPosition = 0
            , _lastMetadata = null
            , _lastMediaWasContent = false
            , _streamSense = new StreamSense();

        function _init() {
            if (Utils.exists(settings) && Utils.exists(settings['customerC2'])) {

                var prefix = settings['secure'] ? 'https://sb' // force https
                    : 'http' + (document.location.href.charAt(4) == 's' ? 's://sb' : '://b');

                _streamSense.setPixelURL(prefix + '.scorecardresearch.com/p?c1=2');
                _streamSense.setLabel('c2', settings['customerC2']);
                _streamSense.setLabel('ns_st_it', 'r');
            }
        }

        function _initializeMetadata(metadata) {

            if (!Utils.exists(metadata))
                metadata = {};
            if (!Utils.exists(metadata['ns_st_ci']))
                metadata["ns_st_ci"] = "0";
            if (!Utils.exists(metadata['c3']))
                metadata["c3"] = "*null";
            if (!Utils.exists(metadata['c4']))
                metadata["c4"] = "*null";
            if (!Utils.exists(metadata['c6']))
                metadata["c6"] = "*null";
            return metadata;
        }

        function _positionUntil(timestamp) {
            if ((_lastPlayTimestamp > 0) && (timestamp >= _lastPlayTimestamp))  {
                _lastCalculatedPosition += timestamp - _lastPlayTimestamp;
            }
            else {
                _lastCalculatedPosition = 0;
            }
            return _lastCalculatedPosition;
        }

        function _notifyEndIfNeeded(now) {

            if (_streamSense.getState() != State.IDLE && _streamSense.getState() != State.PAUSED) {
                _streamSense.notify(StreamSenseEventType.END, _positionUntil(now));
            }
            else if (_streamSense.getState() == State.PAUSED) {
                _streamSense.notify(StreamSenseEventType.END, _lastCalculatedPosition);
            }
        }

        function isLastMetadataSameAs(metadata) {

            return _isLabelEqualsInBothMaps("ns_st_ci", _lastMetadata, metadata) &&
                _isLabelEqualsInBothMaps("c3", _lastMetadata, metadata) &&
                _isLabelEqualsInBothMaps("c4", _lastMetadata, metadata) &&
                _isLabelEqualsInBothMaps("c6", _lastMetadata, metadata);
        }

        function _isLabelEqualsInBothMaps(label, map1, map2) {

            if (Utils.exists(label) && Utils.exists(map1) && Utils.exists(map2)) {

                var str1 = map1[label];
                var str2 = map2[label];
                return (Utils.exists(str1) && Utils.exists(str2) && str1 === str2)
            }
            return false;
        }

        function _sendPlayForNewContent(now, metadata) {

            _notifyEndIfNeeded(now);
            _clipNumber++;
            _streamSense.setClip({
                'ns_st_cn': _clipNumber,
                'ns_st_pn': '1',
                'ns_st_ct': 'vc',
                'ns_st_tp': '0'
            });
            _streamSense.getClip().setLabels(metadata);
            _lastMetadata = metadata;
            _lastPlayTimestamp = now;
            _lastCalculatedPosition = 0;
            _streamSense.notify(StreamSenseEventType.PLAY, _lastCalculatedPosition);
        }

        Utils.extend(this, {
            playAdvertisement: function () {

                var now = +new Date();

                _notifyEndIfNeeded(now);

                _clipNumber++;

                var metadata = _initializeMetadata(null);
                metadata['ns_st_cn'] = _clipNumber;
                metadata['ns_st_pn'] = '1';
                metadata['ns_st_ct'] = 'va';
                metadata['ns_st_tp'] = '1';
                metadata['ns_st_ad'] = '1';
                _streamSense.setClip(metadata);

                _lastCalculatedPosition = 0;
                _streamSense.notify(StreamSenseEventType.PLAY, _lastCalculatedPosition);
                _lastPlayTimestamp = now;
                _lastMediaWasContent = false;
            },

            playContentPart: function (metadata) {

                var now = +new Date();
                metadata = _initializeMetadata(metadata);

                if (_lastMediaWasContent) {

                    if (!isLastMetadataSameAs(metadata)) {

                        _sendPlayForNewContent(now, metadata);
                    }
                    else {
                        _streamSense.getClip().setLabels(metadata);
                        if (_streamSense.getState() != State.PLAYING) {
                            _lastPlayTimestamp = now;
                            _streamSense.notify(StreamSenseEventType.PLAY, _lastCalculatedPosition);
                        }
                    }
                }
                else {

                    _sendPlayForNewContent(now, metadata);
                }

                _lastMediaWasContent = true;
            },

            stop: function () {
                var now = +new Date();
                _streamSense.notify(StreamSenseEventType.PAUSE, _positionUntil(now));
            }
        });
        _init();
    };

    (function (constructor) {
    })(StreamingTag);

    return StreamingTag;
})();

        return StreamingTag;
    })();

	return StreamSense;
})();

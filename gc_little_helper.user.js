// ==UserScript==
// @name           GC little helper
// @namespace      http://www.amshove.net
// @version        10.2
// @include        http://www.geocaching.com/*
// @include        https://www.geocaching.com/*
// @include        http://maps.google.tld/*
// @include        http://www.google.tld/maps*
// @include        https://maps.google.tld/*
// @include        https://www.google.tld/maps*
// @exclude        http://www.geocaching.com/seek/sendtogps.aspx*
// @resource jscolor http://www.amshove.net/greasemonkey/js/jscolor/jscolor.js
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @description    Some little things to make life easy (on www.geocaching.com).
// @copyright      Torsten Amshove <torsten@amshove.net>
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_log
// @grant          GM_addStyle
// @grant          GM_listValues
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_registerMenuCommand
// ==/UserScript==

var operaHelperInitComplete = false;
var operaHelperDomLoaded = false;
var chromeUserData = {};
var userInfo = userInfo||window.userInfo||null;  
var isLoggedIn = isLoggedIn||window.isLoggedIn||null;
var userDefinedCoords = userDefinedCoords||window.userDefinedCoords||null;
var userToken = userToken||window.userToken||null;

if(typeof opera == "object"){
	window.addEventListener('DOMContentLoaded',function(){		
		operaHelperDomLoaded=true;
		if(operaHelperInitComplete){			
			main();
		}
	}, true);
}

if(typeof(chrome) != "undefined"){		
	unsafeWindow = window;

	uneval = JSON.stringify;
	
	if (typeof(GM_getValue) == "undefined" || (GM_getValue.toString && GM_getValue.toString().indexOf("not supported") != -1) ) {
		GM_getValue = function(key, defaultValue){
			var result = localStorage.getItem(key);
			if (!result || result == "undefined"){
			    return defaultValue;
			}
			else{
				var type = result[0];				
				switch (type) {
				    case 'b':
					result = result.substring(1);
					return result == 'true';
				    case 'n':
					result = result.substring(1);
					return Number(result);
				    case 's':
					result = result.substring(1);
					return String(result);
				    default:
					return result;
				}
			}			
		}
	}
	
	if (typeof(GM_setValue) == "undefined" || (GM_setValue.toString && GM_setValue.toString().indexOf("not supported") != -1)) {
		GM_setValue = function(key, value){
			var type = (typeof value)[0];
			var data = ((type == 'b' || type == 'n' || type == 's')?type:"") + value;
			localStorage.setItem(key, data);
		}
	}
    
        if (typeof(GM_addStyle) == "undefined" || (GM_addStyle.toString && GM_addStyle.toString().indexOf("not supported") != -1)) {
		GM_addStyle = function(style){
            var sheet = document.createElement('style');
            sheet.innerHTML = style;
            document.body.appendChild(sheet);
}
	}
    
    if(typeof(GM_xmlhttpRequest) == "undefined" || (GM_xmlhttpRequest.toString && GM_xmlhttpRequest.toString().indexOf("not supported") != -1)) {
        GM_xmlhttpRequest = function(requestData){
            var httpReq = new window.XMLHttpRequest();
            if (requestData["onreadystatechange"]) {
                httpReq.onreadystatechange = function(data) { 	               
                    requestData["onreadystatechange"](this);
                }     
            }
            
            if (requestData["onload"]) {
                httpReq.onload = function(data) { 
                    if (this.status == 200) {
                        requestData["onload"](this);
                    }
                }                     
            }   
            
            if (requestData["onerror"]) {
                httpReq.onload = function(data) { 	               
                    requestData["onerror"](this);
                }                     
            }   
            
            httpReq.open(requestData.method, requestData.url);

            if (requestData.headers) {
                for (var header in requestData.headers) {
                    if(header == "User-Agent" || header == "Origin" ||header == "Cookie" ||header == "Cookie2" ||header == "Referer"){
                        continue;
                    }
                    httpReq.setRequestHeader(header, requestData.headers[header]);
                }
            }
            
            httpReq.send(typeof requestData.data == 'undefined' ? null : requestData.data);              
        }
    }
}

/**
 * create a bookmark to a page in the geocaching.com name space
 * @param {String} title
 * @param {String} href
 * @returns {Object} bookmark
 */
function bookmark(title, href) {
  var bm = new Object();
  bookmarks[bookmarks.length] = bm;
  bm['href'] = href;
  bm['title'] = title;
  return bm;
}

/**
 * create a bookmark to an external site
 * @param {String} title
 * @param {String} href
 */
function externalBookmark(title, href) {
  var bm = bookmark(title, href);
  bm['rel'] = "external";
  bm['target'] = "_blank";
}

/**
 * create a bookmark to a profile sub site
 * @param {String} title
 * @param {String} id
 */
function profileBookmark(title, id) {
  var bm = bookmark(title, "#");
  bm['id'] = id;
  bm['name'] = id;
}

/**
 * check if the current document location matches the the given path
 * @param {String} path partial or full path to a geocaching.com web page
 * @returns {Boolean} true if the current page matches the path
 */
function isLocation(path) {
  path = path.toLowerCase();
  if (path.indexOf("http") != 0) {
    if (path.charAt(0) != '/') {
      path = "/" + path;
    }
    path = "http://www.geocaching.com" + path;
  }
  return document.location.href.toLowerCase().indexOf(path) == 0;
}

// define bookmarks
var bookmarks = new Array();

bookmark("Watchlist", "/my/watchlist.aspx");
bookmark("Geocaches", "/my/geocaches.aspx");
bookmark("My Geocaches", "/my/owned.aspx");
bookmark("Trackable Items", "/my/travelbugs.aspx");
bookmark("Trackables Inventory", "/my/inventory.aspx");
bookmark("Trackables Collection", "/my/collection.aspx");
bookmark("Benchmarks", "/my/benchmarks.aspx");
bookmark("Member Features", "/my/subscription.aspx");
bookmark("Friends", "/my/myfriends.aspx");
bookmark("Account Details", "/account/default.aspx");
bookmark("Public Profile", "/profile/");
bookmark("Search", "/seek/nearest.aspx");
bookmark("Routes", "/my/userroutes.aspx#find");
bookmark("Upload Field Notes", "/my/uploadfieldnotes.aspx");
bookmark("Pocket Queries", "/pocket/default.aspx");
bookmark("Saved GPX", "/pocket/saved.aspx");
bookmark("Bookmarks", "/bookmarks/default.aspx");
bookmark("Notifications", "/notify/default.aspx");
profileBookmark("Find Player", "lnk_findplayer");
bookmark("E-Mail", "/email/default.aspx");
bookmark("Statbar", "/my/statbar.aspx");
bookmark("Guidelines", "/about/guidelines.aspx");
bookmark("GClhConfig", "/my/default.aspx#GClhShowConfig");
externalBookmark("Forum", "http://forums.groundspeak.com/");
externalBookmark("Blog", "http://blog.geocaching.com/");
externalBookmark("Feedback", "http://feedback.geocaching.com/");
externalBookmark("Geoclub", "http://www.geoclub.de/");
profileBookmark("Profile Geocaches", "lnk_profilegeocaches");
profileBookmark("Profile Trackables", "lnk_profiletrackables");
profileBookmark("Profile Gallery", "lnk_profilegallery");
profileBookmark("Profile Bookmarks", "lnk_profilebookmarks");
bookmark("My Profile", "/my/");
profileBookmark("Nearest List", "lnk_nearestlist");
profileBookmark("Nearest Map", "lnk_nearestmap");
profileBookmark("Nearest List (w/o Founds)", "lnk_nearestlist_wo");
profileBookmark("My Trackables", "lnk_my_trackables");

// New Bookmarks under custom_Bookmarks ..

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// Set defaults
var scriptName = "gc_little_helper";
var scriptVersion = "10.2";

var anzCustom = 10;
var anzTemplates = 10;

var bookmarks_def = new Array(16,18,13,14,17,12);

// Compatibility to Google Chrome - http://devign.me/greasemonkey-gm_getvaluegm_setvalue-functions-for-google-chrome/
var browser = "firefox";
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
  this.GM_getValue=function (key,def) {
    return localStorage[key] || def;
  };
  this.GM_setValue=function (key,value) {
    return localStorage[key]=value;
  };
}

if(typeof(chrome) != "undefined"){
	if(!this.uneval){
	  this.uneval = function (value) {  };	 
	}
	browser = "chrome";
}

if(typeof(opera) != "undefined"){
  //this.eval = function (value) { return JSON.parse(value); };
  this.uneval = function (value) { return JSON.stringify(value); };
  browser = "opera";
}

// Check for Scriptish bug in Fennec browser (http://www.geoclub.de/viewtopic.php?f=117&t=62130&p=983614#p983614)
this.GM_setValue("browser", browser);
var test_browser = this.GM_getValue("browser");
if (!test_browser) {
  //console.log("Scriptish GM_getValue bug detected");
  var GM_getValue_Orig = this.GM_getValue;
  this.GM_getValue=function (key,def) {
    return GM_getValue_Orig("scriptvals.GClittlehelper@httpwww.amshove.net."+key,def);
  }
}

// Logging function
function gclh_log(log){
  var txt = "GClh_LOG - "+document.location.href+": "+log;
  if(typeof(console) != "undefined"){
    console.info(txt);
  }
  else if(typeof(GM_log) != "undefined"){
    GM_log(txt);
  }
}

// Error-Logging function
function gclh_error(modul,err){
  var txt = "GClh_ERROR - "+modul+" - "+document.location.href+": "+err.message+"\nStacktrace:\n"+err.stack+(err.stacktrace?("\n"+err.stacktrace):"");
  if(typeof(console) != "undefined"){
    console.error(txt);
  }
  if(typeof(GM_log) != "undefined"){
    GM_log(txt);
  }
}


// Settings: Submit Log on F2
settings_submit_log_button = GM_getValue("settings_submit_log_button",true);
// Settings: Log Inline
settings_log_inline = GM_getValue("settings_log_inline",true);
settings_log_inline_tb = GM_getValue("settings_log_inline_tb",false);
settings_log_inline_pmo4basic = GM_getValue("settings_log_inline_pmo4basic",false);
// Settings: Show Bookmarks
settings_bookmarks_show = GM_getValue("settings_bookmarks_show",true);
// Settings: Bookmarks on Top
settings_bookmarks_on_top = GM_getValue("settings_bookmarks_on_top",true);
settings_bookmarks_top_menu = GM_getValue("settings_bookmarks_top_menu","true");
settings_bookmarks_search = GM_getValue("settings_bookmarks_search","true");
settings_bookmarks_search_default = GM_getValue("settings_bookmarks_search_default","");
// Settings: Redirect to Map
settings_redirect_to_map = GM_getValue("settings_redirect_to_map",false);
// Settings: Hide Facebook
settings_hide_facebook = GM_getValue("settings_hide_facebook",false);
// Settings: Hide SocialShare
settings_hide_socialshare = GM_getValue("settings_hide_socialshare",false);
// Settings: Hideable Souvenirs
settings_hideable_souvenirs = GM_getValue("settings_hideable_souvenirs",true);
// Settings: Hide Disclaimer
settings_hide_disclaimer = GM_getValue("settings_hide_disclaimer",true);
// Settings: Hide Cache Notes
settings_hide_cache_notes = GM_getValue("settings_hide_cache_notes",false);
// Settings: Hide Cache Notes if empty
settings_hide_empty_cache_notes = GM_getValue("settings_hide_empty_cache_notes",true);
settings_breaks_in_cache_notes = GM_getValue("settings_breaks_in_cache_notes",true);
// Settings: Show all Logs
settings_show_all_logs = GM_getValue("settings_show_all_logs",true);
settings_show_all_logs_count = GM_getValue("settings_show_all_logs_count","5");
// Settings: Decrypt Hint
settings_decrypt_hint = GM_getValue("settings_decrypt_hint",false);
// Settings: Show Smilies & BBCode
settings_show_bbcode = GM_getValue("settings_show_bbcode",true);
// Settings: Show datepicker
settings_show_datepicker = GM_getValue("settings_show_datepicker",true);
// Settings: Show mail-Link
settings_show_mail = GM_getValue("settings_show_mail",true);
// Settings: Show Coord-Link in Mail
settings_show_mail_coordslink = GM_getValue("settings_show_mail_coordslink",false);
// Settings: Show EventDay
settings_show_eventday = GM_getValue("settings_show_eventday",true);
settings_date_format = GM_getValue("settings_date_format","MM/dd/yyyy");
// Settings: Show google-maps Link
settings_show_google_maps = GM_getValue("settings_show_google_maps",true);
// Settings: Show Log It Icon
settings_show_log_it = GM_getValue("settings_show_log_it",true);
// Settings: Show Profile-Link on display of Caches found or created by user
settings_show_nearestuser_profil_link = GM_getValue("settings_show_nearestuser_profil_link",true);
// Settings: Show Homezone
settings_show_homezone = GM_getValue("settings_show_homezone",true);
settings_homezone_radius = GM_getValue("settings_homezone_radius","10");
settings_homezone_color = GM_getValue("settings_homezone_color","#0000FF");
// Settings: Hill Shadow
settings_show_hillshadow = GM_getValue("settings_show_hillshadow",false);
settings_map_layers = GM_getValue("settings_map_layers","").split("###");
// Settings: default Map
map_url = "http://www.geocaching.com/map/default.aspx";
// Settings: default Log Type
settings_default_logtype = GM_getValue("settings_default_logtype","-1");
settings_default_logtype_event = GM_getValue("settings_default_logtype_event",settings_default_logtype);
// Settings: default TB-Log Type
settings_default_tb_logtype = GM_getValue("settings_default_tb_logtype","-1");
// Settings: Bookmarklist
settings_bookmarks_list = eval(GM_getValue("settings_bookmarks_list",uneval(bookmarks_def)));
if(settings_bookmarks_list.length == 0){
    settings_bookmarks_list = bookmarks_def;
}
settings_bookmarks_list_beta = eval(GM_getValue("settings_bookmarks_list_beta",uneval(bookmarks_def)));
if(settings_bookmarks_list_beta.length == 0){
    settings_bookmarks_list_beta = bookmarks_def;
}

// Settinks: Dynamic Map
settings_hide_advert_link = GM_getValue('settings_hide_advert_link',true);
settings_hide_line_breaks = GM_getValue('settings_hide_line_breaks',true);
settings_hide_spoilerwarning = GM_getValue('settings_hide_spoilerwarning',true);
settings_hide_hint = GM_getValue('settings_hide_hint',true);
settings_strike_archived = GM_getValue('settings_strike_archived',true);
settings_highlight_usercoords = GM_getValue('settings_highlight_usercoords',true);
settings_map_hide_found = GM_getValue('settings_map_hide_found', false);
settings_map_hide_hidden = GM_getValue('settings_map_hide_hidden', false);
settings_map_hide_2 = GM_getValue('settings_map_hide_2', false);
settings_map_hide_9 = GM_getValue('settings_map_hide_9', false);
settings_map_hide_5 = GM_getValue('settings_map_hide_5', false);
settings_map_hide_3 = GM_getValue('settings_map_hide_3', false);
settings_map_hide_6 = GM_getValue('settings_map_hide_6', false);
settings_map_hide_453 = GM_getValue('settings_map_hide_453', false);
settings_map_hide_13 = GM_getValue('settings_map_hide_13', false);
settings_map_hide_1304 = GM_getValue('settings_map_hide_1304', false);
settings_map_hide_4 = GM_getValue('settings_map_hide_4', false);
settings_map_hide_11 = GM_getValue('settings_map_hide_11', false);
settings_map_hide_137 = GM_getValue('settings_map_hide_137', false);
settings_map_hide_8 = GM_getValue('settings_map_hide_8', false);
settings_map_hide_1858 = GM_getValue('settings_map_hide_1858', false);
settings_show_fav_percentage = GM_getValue('settings_show_fav_percentage', false);
settings_show_vip_list = GM_getValue('settings_show_vip_list', true);
settings_show_owner_vip_list = GM_getValue('settings_show_owner_vip_list', true);
settings_autovisit = GM_getValue("settings_autovisit","true");
settings_show_thumbnails = GM_getValue("settings_show_thumbnails",true);
settings_imgcaption_on_top = GM_getValue("settings_imgcaption_on_top",false);
settings_hide_avatar = GM_getValue("settings_hide_avatar",false);
settings_show_big_gallery = GM_getValue("settings_show_big_gallery",false);
settings_automatic_friend_reset = GM_getValue("settings_automatic_friend_reset",true);
settings_show_long_vip = GM_getValue("settings_show_long_vip",false);
settings_load_logs_with_gclh = GM_getValue("settings_load_logs_with_gclh",true);
settings_configsync_enabled = GM_getValue("settings_configsync_enabled",false);
settings_map_add_layer = GM_getValue("settings_map_add_layer",true);
settings_map_default_layer = GM_getValue("settings_map_default_layer","MapQuest OSM");
settings_hide_map_header = GM_getValue("settings_hide_map_header",false);
settings_spoiler_strings = GM_getValue("settings_spoiler_strings","spoiler|hinweis|hint");
settings_replace_log_by_last_log = GM_getValue("settings_replace_log_by_last_log",false);
settings_hide_top_button = GM_getValue("settings_hide_top_button",false);
settings_show_real_owner = GM_getValue("settings_show_real_owner",false);
settings_hide_visits_in_profile = GM_getValue("settings_hide_visits_in_profile",false);
settings_log_signature_on_fieldnotes = GM_getValue("settings_log_signature_on_fieldnotes",true);
settings_map_hide_sidebar = GM_getValue("settings_map_hide_sidebar",false);
settings_hover_image_max_size = GM_getValue("settings_hover_image_max_size",600);
settings_vip_show_nofound = GM_getValue("settings_vip_show_nofound",false);
settings_use_gclh_layercontrol = GM_getValue("settings_use_gclh_layercontrol",true);

// Settings: Custom Bookmarks
var num = bookmarks.length;
for(var i=0; i<anzCustom; i++){
  bookmarks[num] = Object();
  
  if(typeof(GM_getValue("settings_custom_bookmark["+i+"]")) != "undefined" && GM_getValue("settings_custom_bookmark["+i+"]") != ""){
    bookmarks[num]['href'] = GM_getValue("settings_custom_bookmark["+i+"]");
  }else{
    bookmarks[num]['href'] = "#";
  }
  
  if(typeof(GM_getValue("settings_bookmarks_title["+num+"]")) != "undefined" && GM_getValue("settings_bookmarks_title["+num+"]") != ""){
    bookmarks[num]['title'] = GM_getValue("settings_bookmarks_title["+num+"]");
  }else{
    bookmarks[num]['title'] = "Custom"+i;
    GM_setValue("settings_bookmarks_title["+num+"]",bookmarks[num]['title']);
  }
  
  if(typeof(GM_getValue("settings_custom_bookmark_target["+i+"]")) != "undefined" && GM_getValue("settings_custom_bookmark_target["+i+"]") != ""){
    bookmarks[num]['target'] = GM_getValue("settings_custom_bookmark_target["+i+"]");
    bookmarks[num]['rel'] = "external";
  }else{
    bookmarks[num]['target'] = "";
  }
  
  bookmarks[num]['custom'] = true;
  num++;
}

// Some more Bookmarks ..
profileBookmark("Profile Souvenirs", "lnk_profilesouvenirs");
bookmark("Profile Statistics", "/my/statistics.aspx");
bookmark("Field Notes", "/my/fieldnotes.aspx");

// Settings: Custom Bookmark-title
var bookmarks_orig_title = new Array();
for(var i=0; i<bookmarks.length; i++){
  if(typeof(GM_getValue("settings_bookmarks_title["+i+"]")) != "undefined" && GM_getValue("settings_bookmarks_title["+i+"]") != ""){
    bookmarks_orig_title[i] = bookmarks[i]['title']; // Needed for configuration
    bookmarks[i]['title'] = GM_getValue("settings_bookmarks_title["+i+"]");
  }
}

var global_log_it_icon = "data:image/png;base64,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";
var global_mail_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAYAAAC9vt6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oHHg0gKjtwF3IAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABdElEQVQoz4WRMaviUBSEv5s8H8RO0Eq00SiCRMQigoiCYC2I/hhbwd8g1lpZWFioECwl2IqIwT5iGdDCK94tlhf27cK+gWmGYZg5R9i2rUzTpFAooOs6AEIINE1DCPEPv/T3+81yuURMJhNlmiYAtVqNSCTCT7her6zXa6SUaFJKms0m8XicxWLB5XIJjUqpkAD3+53tdovruvT7faSUfHyZi8UiyWQSx3HwfZ96vY4QIgy73W5sNhssy6LRaIRztT+rxWIxer0eUkpms1moe57HfD6n0+lQKpXQdT1s9fH3PqUUmUwG13UZjUaUy2V2ux2WZRGNRlFKfWv2LSAIAlzXJQgCBoMBz+eTw+HAcDjE8zym0ynVapVsNhtOCAOOxyOn04l8Pk+73Qbg8/OTSqWCUopcLkcikWC/33M+n2m1Wr9fPh6PVTqdxjAMbNvGMIwf3+j7Po7j8Hg8EJZlqW63SyqVQtO08Dj/gxCC1+vFarXiF7aOl1qte6kYAAAAAElFTkSuQmCC";

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
if(typeof opera == "object"){
	operaHelperInitComplete=true;
	if(operaHelperDomLoaded){			
		main();
	}
}
else{
  main();
}

// Wrapper, um zu pruefen auf welche Seite der Link zeigt - um zu vermeiden, die URL-Abfrage mehrfach im Quelltext wiederholen zu muessen
function is_link(name,url){
  switch(name){
    case "cache_listing":
      if(url.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/geocache\//)) return true;
      else return false;
     break;
    default:
      return false;
  }
}

// Wrapper fuer die aktuelle Seite (siehe is_link)
function is_page(name){
  return is_link(name,document.location.href);
}

function main(){
try{
 if(userToken == null){
    //Get Userdata from site context and add them to the extension context     
    var userData =  $('#aspnetForm script:not([src])').filter(function(){
        return this.innerHTML.indexOf("ccConversions") != -1;
    }).html();

    if(userData != null){
	    if(typeof userData != "undefined"){
	        userData = userData.replace('{ID: ', '{"ID": ');
	        
	        //var regex = /([a-zA-Z0-9]+)( = )(((["'][^"']*["'])|([^;]))+)(;)/g;
	        var regex = /([a-zA-Z0-9öÖäÄüÜß]+)([ ]?=[ ]?)(((({.+})(;)))|(((\[.+\])(;)))|(((".+")(;)))|((('.+')(;)))|(([^'"{\[].+)(;)))/g;
	        
	        var match;
	        while(match = regex.exec(userData)){
                    if(match[1] == "eventCacheData") continue;   // Workaround fuer event-Listings (da ist ne Funktion in dem Script-Element)
	            var data = (match[6] || match[10] || match[14] || match[18] || match[21]).trim();
	
	            /*if(match[1].trim()=="initalLogs"){
	                continue;
	            }*/
	            
	            if(data.charAt(0) == '"' || data.charAt(0) == "'"){
	                data = data.slice(1,data.length-1);
	            }
	            
	            data = data.trim();
	            
	            if(data.charAt(0) == '{' || data.charAt(0) == '['){
	                data = JSON.parse(data);
	            }
	            
	            chromeUserData[match[1].replace('"','').replace("'","").trim()] = data;   
	        }
	    }
	    
	    if(chromeUserData["userInfo"]){
	        userInfo = chromeUserData["userInfo"];
	    }
	    if(chromeUserData["isLoggedIn"]){
	        isLoggedIn = chromeUserData["isLoggedIn"];
	    }
	    if(chromeUserData["userDefinedCoords"]){
	        userDefinedCoords = chromeUserData["userDefinedCoords"];
	    }
	    if(chromeUserData["userToken"]){
	        userToken = chromeUserData["userToken"];
	    }
	}
 }
}catch(e){ gclh_error("Error parsing userdata from page.",e); }

// Link on Google Maps
if(document.location.href.match(/^(http|https):\/\/maps\.google\./) || document.location.href.match(/^(http|https):\/\/www\.google\.[a-zA-Z.]*\/maps/)){
  if(settings_show_google_maps){
    var ref_link = document.getElementById("link");
    if(ref_link){
      function open_gc(){
        var matches = ref_link.href.match(/&ll=([-0-9]*\.[0-9]*),([-0-9]*\.[0-9]*)/);
        var zoom = ref_link.href.match(/z=([0-9]*)/);
        if (matches != null && zoom != null) {
          var gc_map_url = map_url + "?lat=" + matches[1] + "&lng=" + matches[2] + "&z=" + zoom[1];
          window.open(gc_map_url);
        }
        else {
          alert("This map has no geographical coordinates in its link. Just zoom or drag the map, afterwards this will work fine.");
        }
      }
    
      var box = ref_link.parentNode;
      
      var gcImage = document.createElement("img");
      gcImage.setAttribute("src","http://www.geocaching.com/images/about/logos/geocaching/Logo_Geocaching_color_notext_32.png");
      gcImage.setAttribute("title", "Show area at geocaching.com");
      gcImage.setAttribute("alt", "Show area at geocaching.com");

      var link = document.createElement("a");
      link.setAttribute("title","Show area at geocaching.com");
      link.setAttribute("href","#");
      link.setAttribute("id","gc_com_lnk");

      link.appendChild(gcImage);
      box.appendChild(link);
      
      document.getElementById('gc_com_lnk').addEventListener("click", open_gc, false);
    }
  }
}else if((document.location.href.match(/^(http|https):\/\/maps\.google\./) || document.location.href.match(/^(http|https):\/\/www\.google\.[a-zA-Z.]*\/maps/)) && document.location.href.match(/preview#!/)){
    if(settings_show_google_maps){        
        function open_gc(){
            //new url : /!2d(-?[0-9]+.[0-9]+)/ and /!3d(-?[0-9]+.[0-9]+)/
            var lat = document.URL.match(/!3d(-?[0-9]+.[0-9]+)/);
            var lng = document.URL.match(/!2d(-?[0-9]+.[0-9]+)/);
            var zoom = 12; //don't know how to decode
            if (lat != null && lng != null && zoom != null) {
              var gc_map_url = map_url + "?lat=" + lat[1] + "&lng=" + lng[1] + "&z=" + zoom;
              window.open(gc_map_url);
            }
            else {
              alert("This map has no geographical coordinates in its link.");
            }
        }        

        var gcImage = document.createElement("img");
        gcImage.setAttribute("src","http://www.geocaching.com/images/about/logos/geocaching/Logo_Geocaching_color_notext_32.png");
        gcImage.setAttribute("title", "Show area at geocaching.com");
        gcImage.setAttribute("alt", "Show area at geocaching.com");

        var link = document.createElement("a");
        link.setAttribute("title","Show area at geocaching.com");
        link.setAttribute("href","#");
        link.setAttribute("id","gc_com_lnk");
        link.setAttribute("style", "position:absolute;top:3px;right:-40px;")

        link.appendChild(gcImage);
        
        document.getElementsByClassName("searchbutton")[0].appendChild(link);

        document.getElementById('gc_com_lnk').addEventListener("click", open_gc, false);
        
    }
}else{
//Required for jquery plugins under opera
if(typeof $ == "undefined"){
  $ = unsafeWindow.$;
}
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Helper
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Run after Redirect
if(GM_getValue("run_after_redirect") != ""){
  try{
    eval("unsafeWindow."+GM_getValue("run_after_redirect"));
  }catch(e){ gclh_error("Run after Redirect",e); }
  GM_setValue("run_after_redirect","");
}

function getElementsByClass(classname){
  var result = new Array();
  var all_elements = document.getElementsByTagName("*");

  for(var i=0; i<all_elements.length;i++){
    if(all_elements[i].className == classname){
      result.push(all_elements[i]);
    }
  }

  return result;
}

function in_array(search,arr){
  for(var i=0; i<arr.length;i++) if(arr[i] == search) return true;
  return false;
}

function caseInsensitiveSort(a, b){  // http://www.codingforums.com/showthread.php?t=10477
  var ret = 0;
  a = a.toLowerCase();b = b.toLowerCase();
  if(a > b) 
    ret = 1;
  if(a < b) 
    ret = -1; 
  return ret;
}

function urlencode(s) {
  s = s.replace(/&amp;/g,"&");
  s = encodeURIComponent(s);  //Kodiert alle außer den folgenden Zeichen: A bis Z und a bis z und - _ . ! ~ * ' ( )
  s = s.replace(/~/g,"%7e");
  s = s.replace(/'/g,"%27");
  s = s.replace(/%26amp%3b/g,"%26");
  s = s.replace(/ /g,"+");
  //GC.com codiert - _ . ! * ( ) selbst nicht, daher wird dies hier auch nicht extra behandel
  return s;
}

function urldecode(s) {
  s = s.replace(/\+/g," ");
  s = s.replace(/%7e/g,"~");
  s = s.replace(/%27/g,"'");
  s = decodeURIComponent(s);
  return s;
}

function html_to_str(s) {
  s = s.replace(/\&amp;/g,"&");
  s = s.replace(/\&nbsp;/g," ");
  return s;
}

function trim(s) {
  var whitespace = ' \n ';
  for (var i = 0; i < whitespace.length; i++) {
    while (s.substring(0, 1) == whitespace.charAt(i)) {
      s = s.substring(1, s.length);
    }
    while (s.substring(s.length - 1, s.length) == whitespace.charAt(i)) {
      s = s.substring(0, s.length - 1);
    }
  }

  if(s.substring(s.length-6,s.length) == "&nbsp;") s = s.substring(0,s.length-6);

  return s;
}

// Show Update-Banner
if(parseFloat(GM_getValue("new_version",scriptVersion)) > scriptVersion){
  var banner = "";
  banner = "<div align='center' style='background-color: #FF8888;'>There is an update available for <b>GC little helper</b> - you can update <a href='http://www.amshove.net/greasemonkey/updates.php' target='_blank'>here</a></div>";
  document.getElementsByTagName("body")[0].innerHTML = banner+document.getElementsByTagName("body")[0].innerHTML;
}

// Helper: from N/S/E/W Deg Min.Sec to Dec
function toDec(coords){
  var match = coords.match(/([0-9]+)°([0-9]+)\.([0-9]+)′(N|S), ([0-9]+)°([0-9]+)\.([0-9]+)′(W|E)/);

  if(match){
    var dec1 = parseInt(match[1],10) + (parseFloat(match[2]+"."+match[3])/60);
    if(match[4] == "S") dec1 = dec1 * -1;
    dec1 = Math.round(dec1*10000000)/10000000;

    var dec2 = parseInt(match[5],10) + (parseFloat(match[6]+"."+match[7])/60);
    if(match[8] == "W") dec2 = dec2 * -1;
    dec2 = Math.round(dec2*10000000)/10000000;

    return new Array(dec1,dec2);
  }
  else{
      match = coords.match(/(N|S) ([0-9]+) ([0-9]+)\.([0-9]+) (E|W) ([0-9]+) ([0-9]+)\.([0-9]+)/);

      if(match){
        var dec1 = parseInt(match[2],10) + (parseFloat(match[3]+"."+match[4])/60);
        if(match[1] == "S") dec1 = dec1 * -1;
        dec1 = Math.round(dec1*10000000)/10000000;

        var dec2 = parseInt(match[6],10) + (parseFloat(match[7]+"."+match[8])/60);
        if(match[5] == "W") dec2 = dec2 * -1;
        dec2 = Math.round(dec2*10000000)/10000000;

        return new Array(dec1,dec2);
       }
        else{
            match = coords.match(/(N|S) ([0-9]+) ([0-9]+) ([0-9]+)\.([0-9]+) (E|W) ([0-9]+) ([0-9]+) ([0-9]+)\.([0-9]+)/);

            if(match){
                var dec1 = parseInt(match[2],10) + (parseFloat(match[3])/60) + (parseFloat(match[4]+"."+match[5])/3600);
                if(match[1] == "S") dec1 = dec1 * -1;
                dec1 = Math.round(dec1*10000000)/10000000;

                var dec2 = parseInt(match[7],10) + (parseFloat(match[8])/60) + (parseFloat(match[9]+"."+match[10])/3600);
                if(match[6] == "W") dec2 = dec2 * -1;
                dec2 = Math.round(dec2*10000000)/10000000;

                return new Array(dec1,dec2);
            } 
            else{
                match = coords.match(/(N|S) ([0-9]+) ([0-9]+) ([0-9]+\..[0-9].) (E|W) ([0-9]+) ([0-9]+) ([0-9]+\..[0-9].)/);

                if(match){
                    var dec1 = parseInt(match[2],10) + (parseFloat(match[3])/60) + (parseFloat(match[4])/3600);
                    if(match[1] == "S") dec1 = dec1 * -1;
                    dec1 = Math.round(dec1*10000000)/10000000;

                    var dec2 = parseInt(match[6],10) + (parseFloat(match[7])/60) + (parseFloat(match[8])/3600);
                    if(match[5] == "W") dec2 = dec2 * -1;
                    dec2 = Math.round(dec2*10000000)/10000000;

                    return new Array(dec1,dec2);
                }else{
                    return false;
                }
        }
        }        
  }
}

// Helper: from Deg to DMS
function DegtoDMS(coords){
  var match = coords.match(/^(N|S) ([0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9]) (E|W) ([0-9][0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9])$/);
  if(!match) return "";

  var lat1 = parseInt(match[2],10);
  var lat2 = parseInt(match[3],10);
  var lat3 = parseFloat("0."+match[4])*60;
  lat3 = Math.round(lat3*10000)/10000;

  var lng1 = parseInt(match[6],10); 
  var lng2 = parseInt(match[7],10);
  var lng3 = parseFloat("0."+match[8])*60;
  lng3 = Math.round(lng3*10000)/10000;

  return match[1]+" "+lat1+"° "+lat2+"' "+lat3+"\" "+match[5]+" "+lng1+"° "+lng2+"' "+lng3+"\"";
}

// Helper: from Dec to Deg
function DectoDeg(lat,lng){
  lat = lat/10000000;
  var pre = "";
  if(lat > 0) pre = "N";
  else{ pre = "S"; lat = lat * -1; }
  var tmp1 = parseInt(lat);
  var tmp2 = (lat-tmp1)*60;
  tmp1 = String(tmp1);
  if(tmp1.length == 1) tmp1 = "0"+tmp1;
  tmp2 = Math.round(tmp2*10000)/10000;
  tmp2 = String(tmp2);
  if(tmp2.length == 3) tmp2 = tmp2+"000";
  else if(tmp2.length == 4) tmp2 = tmp2+"00";
  else if(tmp2.length == 5) tmp2 = tmp2+"0";
  var new_lat = pre+" "+tmp1+"° "+tmp2;

  lng = lng/10000000;
  var pre = "";
  if(lng > 0) pre = "E";
  else{ pre = "W"; lng = lng * -1; }
  var tmp1 = parseInt(lng);
  var tmp2 = (lng-tmp1)*60;
  tmp1 = String(tmp1);
  if(tmp1.length == 2) tmp1 = "0"+tmp1;
  else if(tmp1.length == 1) tmp1 = "00"+tmp1;
  tmp2 = Math.round(tmp2*10000)/10000;
  tmp2 = String(tmp2);
  if(tmp2.length == 3) tmp2 = tmp2+"000";
  else if(tmp2.length == 4) tmp2 = tmp2+"00";
  else if(tmp2.length == 5) tmp2 = tmp2+"0";
  var new_lng = pre+" "+tmp1+"° "+tmp2;

  return new_lat+" "+new_lng;
}

/**
 * check whether the user has set his home coordinates
 * @returns {Boolean}
 */
function homeCoordinatesSet() {
  if(typeof(GM_getValue("home_lat")) == "undefined" || typeof(GM_getValue("home_lng")) == "undefined"){
    if (window.confirm("To use this link, you have to set your home coordinates.")) {
      document.location.href = "http://www.geocaching.com/account/ManageLocations.aspx";
    }
    return false;
  }
  return true;
}

// Helper
function addLinkEvent(name,fkt){
  if(document.getElementsByName(name).length > 0){
    var links = document.getElementsByName(name);
    for(var i = 0; i < links.length; i++){
      links[i].addEventListener("click", fkt, false);
    }
  }else if(document.getElementById(name)){
    document.getElementById(name).addEventListener("click", fkt, false);
  }
}

// Close the Overlays (Find Player and GClh-Configuration)
function btnClose(){
  if(document.getElementById('bg_shadow')) document.getElementById('bg_shadow').style.display = "none";
  if(document.getElementById('settings_overlay')) document.getElementById('settings_overlay').style.display = "none";
  if(document.getElementById('sync_settings_overlay')) document.getElementById('sync_settings_overlay').style.display = "none";
  if(document.getElementById('findplayer_overlay')) document.getElementById('findplayer_overlay').style.display = "none";
}

// Function to get the Finds out of the login-Text-Box
function get_my_finds(){
  var finds = "";
  if(getElementsByClass('SignedInText')[0]){
    finds = parseInt(getElementsByClass('SignedInText')[0].getElementsByTagName("strong")[1].innerHTML.replace(/[,.]/,''));
  }
  return finds;
}

// Sucht den Original Usernamen des Owners aus dem Listing
function get_real_owner(){
  if(document.getElementById("ctl00_ContentBody_bottomSection")){
    var links = document.getElementById("ctl00_ContentBody_bottomSection").getElementsByTagName("a");
    for(var i=0; i<links.length; i++){
      var match = links[i].href.match(/\/seek\/nearest\.aspx\?u\=(.*)$/);
      if(match){
        return urldecode(match[1]);
      }
    }
    return false;
  }else return false;
}

// Versteckt den Header in der Map-Ansicht
function hide_map_header(){
  var header = document.getElementsByTagName("header");
  if(header[0].style.display != "none"){  // Header verstecken
    header[0].style.display = "none";
    // Move Map to Top
    document.getElementById("map_canvas").style.top = 0;
    // Move Sidebar to Top
    document.getElementById("searchtabs").parentNode.style.top = 0;
    // Move "Leaflet About" to Bottom
    var map = document.getElementById("map_canvas");
    var divs = map.getElementsByTagName("div");
    for(var i=0; i<divs.length; i++){
      if(divs[i].className.match(/leaflet-bottom/)){
        divs[i].setAttribute("style","bottom: 0px !important;");
      }
    }
  }else{ // Header zeigen
    header[0].style.display = "block";
    // Move Map to Top
    document.getElementById("map_canvas").style.top = "56px";
    // Move Sidebar to Top
    document.getElementById("searchtabs").parentNode.style.top = "56px";
    // Move "Leaflet About" to Bottom
    var map = document.getElementById("map_canvas");
    var divs = map.getElementsByTagName("div");
    for(var i=0; i<divs.length; i++){
      if(divs[i].className.match(/leaflet-bottom/)){
        divs[i].setAttribute("style","bottom: 56px !important;");
      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// Last Log-Text speichern fuer TB-Log-Template
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx/) && document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog")){
    function send_log(e){
      GM_setValue("last_logtext",document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').value);
    }
    document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog").addEventListener('click', send_log, true);
  }
}catch(e){ gclh_error("Last-Log-Text speichern",e); }

// F2 zum Log abschicken
/**
 * @name f2_logging
 * @description You can use the Key "F2" to commit your log entry
 * @class
 */
try{
  if(settings_submit_log_button && (document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|PLogGuid)\=/)) && document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog")){
    function keydown(e){
      if(e.keyCode == 113){
        document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog").click();
      }
    }
    window.addEventListener('keydown', keydown, true);
  }
}catch(e){ gclh_error("F2 logging",e); }

// F2 zum PQ speichern
try{
  if(settings_submit_log_button && (document.location.href.match(/^http:\/\/www\.geocaching\.com\/pocket\/gcquery\.aspx/)) && document.getElementById("ctl00_ContentBody_btnSubmit")){
    function keydown(e){
      if(e.keyCode == 113){
        document.getElementById("ctl00_ContentBody_btnSubmit").click();
      }
    }
    window.addEventListener('keydown', keydown, true);
  }
}catch(e){ gclh_error("F2 save PQ",e); }

// F2 Bookmark speichern
try{
  if(settings_submit_log_button && ((document.location.href.match(/^http:\/\/www\.geocaching\.com\/bookmarks\/mark\.aspx/)) || (document.location.href.match(/^http:\/\/www\.geocaching\.com\/pocket\/bmquery\.aspx/))) && document.getElementById("ctl00_ContentBody_Bookmark_btnSubmit")){
    function keydown(e){
      if(e.keyCode == 113){
        document.getElementById("ctl00_ContentBody_Bookmark_btnSubmit").click();
      }
    }
    window.addEventListener('keydown', keydown, true);
  }
}catch(e){ gclh_error("F2 save Bookmark",e); }

// Map on create pocketQuery-page
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/pocket\/gcquery\.aspx/) && document.getElementById("ctl00_ContentBody_rbOriginWpt").checked){  
    $('.LatLongTable').after('<img style="position:absolute;top: 40px; left: 300px;height:350px;width:450px;" id="gclh_map">').parent().css("style","relative");
    $('.LatLongTable input').change(function(){
        var coordType =  document.getElementsByName("ctl00$ContentBody$LatLong")[0].value;
        var northSouth = $($('#ctl00_ContentBody_LatLong\\:_selectNorthSouth')[0].selectedOptions[0]).text().replace('.','');
        var westEast = $($('#ctl00_ContentBody_LatLong\\:_selectEastWest')[0].selectedOptions[0]).text().replace('.','');
        var lat = "";
        var lng = "";
        switch(coordType){
            case "2": //DMS
                lat = northSouth+ " " + $('#ctl00_ContentBody_LatLong__inputLatDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLatMins')[0].value + ' ' + $('#ctl00_ContentBody_LatLong__inputLatSecs')[0].value;
                lng = westEast+ " " + $('#ctl00_ContentBody_LatLong__inputLongDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLongMins')[0].value + ' ' + $('#ctl00_ContentBody_LatLong__inputLongSecs')[0].value;
                var converted = toDec(lat +" "+lng);
                lat = converted[0];
                lng = converted[1];
                break;
            case "1": //MinDec
                lat = northSouth+ " " + $('#ctl00_ContentBody_LatLong__inputLatDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLatMins')[0].value;
                lng = westEast+ " " + $('#ctl00_ContentBody_LatLong__inputLongDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLongMins')[0].value;
                var converted = toDec(lat +" "+lng);
                lat = converted[0];
                lng = converted[1];
                break;
            case "0": //DegDec
                lat = (northSouth=="S"?"-":"")+$('#ctl00_ContentBody_LatLong__inputLatDegs')[0].value;
                lng = (westEast=="W"?"-":"")+$('#ctl00_ContentBody_LatLong__inputLongDegs')[0].value;
                break;
        }
        $('#gclh_map').attr("src",'http://staticmap.openstreetmap.de/staticmap.php?center='+lat+','+lng+'&zoom=15&size=450x350&markers='+lat+','+lng+',ol-marker');
    });
    $('.LatLongTable input').change();
  }
}catch(e){ gclh_error("map on create pocketQuery page",e); }

// Name for PocketQuery from Bookmark
try{
  if((document.location.href.match(/^http:\/\/www\.geocaching\.com\/pocket\/bmquery\.aspx/)) && document.getElementById("ctl00_ContentBody_lnkListName")){
    document.getElementById('ctl00_ContentBody_tbName').value = document.getElementById("ctl00_ContentBody_lnkListName").innerHTML;
    document.getElementById('ctl00_ContentBody_rbRunOption_2').checked = true;
    document.getElementById('ctl00_ContentBody_cbIncludePQNameInFileName').checked = true;
  }
}catch(e){ gclh_error("PQ-Name from Bookmark",e); }



// Bookmark-Liste im Profil
try{
  if(settings_bookmarks_show && document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\//) && document.getElementById("ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel")){
    var side = document.getElementById("ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel");
  
    var header = document.createElement("h3");
    header.setAttribute("class","WidgetHeader");
    header.appendChild(document.createTextNode(" Linklist"));
  
    var div = document.createElement("div");
    div.setAttribute("class","WidgetBody ProfileWidget");
  
    var ul = document.createElement("ul");
  
    for(var i=0; i < settings_bookmarks_list.length; i++){
      var x = settings_bookmarks_list[i];
      if(typeof(x) == "undefined" || x=="") continue;
      var a = document.createElement("a");
  
      for(attr in bookmarks[x]){
        if(attr != "custom") a.setAttribute(attr,bookmarks[x][attr]);
      }
  
      a.appendChild(document.createTextNode(bookmarks[x]['title']));
  
      var li = document.createElement("li");
      li.appendChild(a);
  
      ul.appendChild(li);
    }
  
    div.appendChild(ul);
    side.appendChild(header);
    side.appendChild(div);
  }
}catch(e){ gclh_error("Linklist in Profile",e); }

// Bookmarks on top
try{
  if(settings_bookmarks_on_top && document.getElementsByClassName("Menu").length > 0){
    var nav_list = document.getElementsByClassName("Menu")[0];
    
    GM_addStyle('ul.Menu > li{ padding:0 0 0 0.75em !important; }  ');
      
    var menu = document.createElement("li");
    
    var headline = document.createElement("a");
  
    if(settings_bookmarks_top_menu){   // Navi vertikal
      headline.setAttribute("href","#");
      headline.setAttribute("title","Linklist");
      headline.setAttribute("class","Dropdown");
      headline.setAttribute("accesskey","7");
      headline.innerHTML = "Linklist";
      menu.appendChild(headline);
      
      var submenu = document.createElement("ul");
      submenu.setAttribute("class","SubMenu");
//      submenu.setAttribute("style","visibility: hidden;");
      menu.appendChild(submenu);
    
      for(var i=0; i < settings_bookmarks_list.length; i++){
        var x = settings_bookmarks_list[i];
        if(typeof(x) == "undefined"  || x=="") continue;
    
        var sublink = document.createElement("li");
        var hyperlink = document.createElement("a");
        
        for(attr in bookmarks[x]){
          if(attr != "custom") hyperlink.setAttribute(attr,bookmarks[x][attr]);
        }
        hyperlink.appendChild(document.createTextNode(bookmarks[x]['title']));
    
        sublink.appendChild(hyperlink);
        submenu.appendChild(sublink);
      }
      nav_list.appendChild(menu);
    }else{                             // Navi horizontal
      for(var i=0; i < settings_bookmarks_list.length; i++){
        var x = settings_bookmarks_list[i];
        if(typeof(x) == "undefined"  || x=="") continue;
  
        var sublink = document.createElement("li");
        var hyperlink = document.createElement("a");
   
        for(attr in bookmarks[x]){
          if(attr != "custom") hyperlink.setAttribute(attr,bookmarks[x][attr]);
        }
        hyperlink.appendChild(document.createTextNode(bookmarks[x]['title']));
  
        sublink.appendChild(hyperlink);
        nav_list.appendChild(sublink);
      }
    }
  
    // Search field
    if(settings_bookmarks_search){
      var code = "function gclh_search(){";
      code += "  var search = document.getElementById('navi_search').value;";
      code += "  if(search.match(/^GC[A-Z0-9]{1,10}\\b/i) || search.match(/^TB[A-Z0-9]{1,10}\\b/i)) document.location.href = 'http://coord.info/'+search;";
      code += "  else if(search.match(/^[A-Z0-9]{6}\\b$/i)) document.location.href = '/track/details.aspx?tracker='+search;";
      code += "  else document.location.href = '/default.aspx?navi_search='+search;";
      code += "}";
  
      var script = document.createElement("script");
      script.innerHTML = code;
      document.getElementsByTagName("body")[0].appendChild(script);
  
      var searchfield = "<input onKeyDown='if(event.keyCode==13) { gclh_search(); return false; }' type='text' size='6' name='navi_search' id='navi_search' style='margin-top: 2px; padding: 1px; font-weight: bold; font-family: sans-serif; border: 2px solid #778555; border-radius: 7px 7px 7px 7px; -moz-border-radius: 7px; -khtml-border-radius: 7px; background-color:#d8cd9d' value='"+settings_bookmarks_search_default+"'>";
      var nav_list = document.getElementById('Navigation').childNodes[1];
      nav_list.innerHTML += searchfield;
    }
  
    //Chrome menu hover fix / Language selector fix
    if(browser == "chrome"){
        injectPageScriptFunction(function(){        
			$('ul.Menu').children().hover(function () {                    
					$(this).addClass('hover');
					$('ul:first', this).css('visibility', 'visible');
				}, 
				function () {
					$(this).removeClass('hover');
					$('ul:first', this).css('visibility', 'hidden');
				}
			);
            
            //Language selector fix
            $('.LanguageSelector script').remove().appendTo('.LanguageSelector');
        }, "()");
    }
    
  // menu      - <li class="">
  // headline  -   <a href="#" title="Shop" accesskey="6" id="ctl00_hlNavShop">Shop ?</a>
  // submenu   -   <ul class="SubMenu" style="visibility: hidden;">
  // sublink   -     <li class="">
  // hyperlink -       <a href="http://shop.groundspeak.com/" rel="external" title="Shop Geocaching" accesskey="j" id="ctl00_hlSubNavShop">Shop Geocaching</a></li>
  // sublink   -     <li class="">
  // hyperlink -       <a href="../about/buying.aspx" title="Guide to Buying a GPS Device" accesskey="k" id="ctl00_hlSubNavGPSGuide">Guide to Buying a GPS Device</a></li>
  // submenu   -   </ul>
  // menu      - </li>  
  }
}catch(e){ gclh_error("Linklist on top",e); }

// Bookmarks on top - Beta Map
try{
  if(settings_bookmarks_on_top && document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\//)){
//    var header = getElementsByClass("ui-block-b")[0];
    var header = document.getElementsByTagName("header")[0];
    if(header){
      var div = document.createElement("div");
      div.style.float = 'left';
      div.appendChild(document.createElement("br"));
  
      for(var i=0; i < settings_bookmarks_list_beta.length; i++){
        var x = settings_bookmarks_list_beta[i];
        if(typeof(x) == "undefined") continue;
    
        var hyperlink = document.createElement("a");
        hyperlink.style.color = '#000000';
        hyperlink.style.fontWeight = 'normal';
    
        for(attr in bookmarks[x]){
          if(attr != "custom") hyperlink.setAttribute(attr,bookmarks[x][attr]);
        }
        hyperlink.target = '_blank';
        hyperlink.appendChild(document.createTextNode(bookmarks[x]['title']));
    
        div.appendChild(hyperlink);
        if (i != (settings_bookmarks_list_beta.length-1)) {
          div.appendChild(document.createTextNode(' | '));
        }
      }
  
      header.childNodes[3].appendChild(div);
    }
  }
}catch(e){ gclh_error("Linklist on top (MAP)",e); }

// Remove gc.com Links in Navigation
try{
  if(document.getElementsByClassName("Menu").length > 0){
    var liste = document.getElementsByClassName("Menu")[0];
    if(GM_getValue('remove_navi_learn') && document.getElementById('ctl00_hlNavLearn')) liste.removeChild(document.getElementById('ctl00_hlNavLearn').parentNode);
    if(GM_getValue('remove_navi_partnering') && document.getElementById('ctl00_hlNavPartnering')) liste.removeChild(document.getElementById('ctl00_hlNavPartnering').parentNode);
    if(GM_getValue('remove_navi_play') && document.getElementById('ctl00_hlNavPlay')) liste.removeChild(document.getElementById('ctl00_hlNavPlay').parentNode);
    if(GM_getValue('remove_navi_profile') && document.getElementById('ctl00_hlNavProfile')) liste.removeChild(document.getElementById('ctl00_hlNavProfile').parentNode);
//    if(GM_getValue('remove_navi_join') && document.getElementById('ctl00_hlNavJoin')) liste.removeChild(document.getElementById('ctl00_hlNavJoin').parentNode);
    if(GM_getValue('remove_navi_community') && document.getElementById('ctl00_hlNavCommunity')) liste.removeChild(document.getElementById('ctl00_hlNavCommunity').parentNode);
    if(GM_getValue('remove_navi_videos') && document.getElementById('ctl00_hlNavVideos')) liste.removeChild(document.getElementById('ctl00_hlNavVideos').parentNode);
//    if(GM_getValue('remove_navi_resources') && document.getElementById('ctl00_hlNavResources')) liste.removeChild(document.getElementById('ctl00_hlNavResources').parentNode);
    if(GM_getValue('remove_navi_shop') && document.getElementById('ctl00_hlNavShop')) liste.removeChild(document.getElementById('ctl00_hlNavShop').parentNode);
    if(GM_getValue('remove_navi_social') && document.getElementById('ctl00_hlNavFollowUs')) liste.removeChild(document.getElementById('ctl00_hlNavFollowUs').parentNode);
//    if(GM_getValue('remove_navi_social', true)) document.getElementById("Navigation").removeChild(document.getElementById("Navigation").childNodes[3]);
  }
}catch(e){ gclh_error("Remove gc.com links",e); }

// Redirect to Map
if(settings_redirect_to_map && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)){
  if(!document.location.href.match(/&disable_redirect/) && !document.location.href.match(/key=/) && !document.location.href.match(/ul=/) && document.getElementById('ctl00_ContentBody_LocationPanel1_lnkMapIt')){
    document.getElementById('ctl00_ContentBody_LocationPanel1_lnkMapIt').click();
  }
}

// Hide Facebook
try{
  if(settings_hide_facebook){
    if(document.getElementById('ctl00_uxSignIn')){
      document.getElementById('ctl00_uxSignIn').parentNode.style.display = "none";
    }
    if(document.location.href.match(/^https?:\/\/www\.geocaching\.com\/login(.*)/) && document.getElementById("ctl00_ContentBody_LoginPanel")){
      var loginpanelfb = getElementsByClass("LoginWithFacebook")[0];
      loginpanelfb.parentNode.removeChild(loginpanelfb);
    }
  }
}catch(e){ gclh_error("Hide Facebook",e); }

// Hide Socialshare
try{
  if(settings_hide_socialshare && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx?(.*)/) && document.getElementById('sharing_container')){
    var socialshare = document.getElementById('sharing_container');
    socialshare.style.display = "none";
  }
}catch(e){ gclh_error("Hide SocialShare",e); }

//Add chosen plugin
function addChosenPlugin(){
    var chosenSprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAlCAYAAAAN8srVAAACTUlEQVR42u3Wv2sTcRiA8VPBxUKwEAxU3NxPIoFAl1bIkkmwYKAKRbqbRSWQCGJ+rMUibjo4FARBl0AgUIh/QXFxFIpKJHAQKA56r0/hDbyEK5VrDH2hBx+ud+Ga9+G+uSQQkVOv0+lMZNBFHoFRwABZb0F9CCITVdRjQd9b0CoOTNSGiRkidBWkljGGINb9CCECd0FqE7GJqkxeMxccK8UbJzppUPGIO5SfR9DCjINsTIR1RDbKXvAakuB9yqAsvuLaDIN6Jqag5/IaIxjYCxaxDzFGyKUMegdBb4ZBGfQmMUaIXeSmLyhDjHspl9wdiPHgJEGlUumf2UGml96HlJ+hRQwhRoSleQfZgfawlDJoB5KgO4OgDLrIT4UUMEA2xdNpro/t6aA+BJGJKuqxoJ9ikLmzQas4MFEbJmYIHz99GNRaxhiCWPcjhAjcBalNxCaqgsBrUPGIO5T3GGRjIqwjslHegnompqDn8hojGHgLyqA3iTFC7CLnLOh4Z0Gn3FnQf2O3ZrN5iZ9aVw81Go3zQfLmI4iIx/gBUXvtdnvNXZDGbEMI2Gf/BFsQPXffVRADr+jgn1hylwPdOL6Bn7w2brVaV9wEMfALBheGDu3QGvVQ79RtT0FvGDyu1WoXE4JWNKjiack916HXEoJecT7GLTdBLLXrDPwbEX+Xq9XqucPHNzFVzv3B93q9fsHbU+4uhAhh/wXfIMaWqyBdXjfxluE/63fQM/Yt8/je9hQ0vdnQpybqJRZcB2nUI4J+QVB2H6RRHzUoTPo/fwGr9gNcek8bXAAAAABJRU5ErkJggg==';
    var chosenSprite2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAABKCAMAAABgpuGuAAAAzFBMVEX///8AAACIiIiIiIiIiIhGRkZGRkZGRkaIiIiHh4eHh4eGhoaAgICGhoaHh4dGRkaHh4eHh4eIiIiHh4eIiIiHh4eIiIiHh4eHh4eHh4eHh4eHh4eAgICHh4eHh4eAgICFhYWIiIiHh4eHh4eHh4eIiIiEhISIiIiIiIiIiIiIiIiHh4d0dHSGhoaHh4eDg4NVVVWDg4OHh4eIiIiAgICHh4eHh4eAgICIiIiHh4eIiIiHh4eIiIiHh4eGhoaHh4eHh4eIiIiIiIhGRkYymc+gAAAAQnRSTlMAAP7wMDDwYGCg/VAQcIDz4CDz0PxAz7D1wPv5CGChFEX64t2QHh2N3Jaa2wsTgiEDKYjYDGaZBO8Rqd+LREqM5n7NGqdwAAACCUlEQVR4Xu3V127jMBCFYZ2h5KJiW5a7UzbJ9t57Hb3/O60Ik+JFsMLCwrkI4P+KV/oAYjSMOAEjE8MVm1HECiNVL8VGlSY1jpW8w5OMeil2RxIUe6k9kCA4YD7nOhG8RHYiWCk4YEKI5wdnHuPuQPyr4w8Df7xhm0xgI/2wASpVSwsdvYJm2jbrgraqWwsdvVSXAVp2QJk2ZQCOfiaw9s4a/4bymYVmOXD0w4fSzaIpO6CJ2nTyH1Cfj6BUV9kHwuFa0AFtPbTtBS0ttOyAMm3L+kB2HtbogG79Ap0Bw0ECVzIYBgilMaWH+odhXTeSc+p62LFeetU4VvKOlTgNai8l7kiCEi+1BxIEB0ynXCeCl8hOBCsFB0wIyfTgTBPcEYh/dfxh4I83/4flryD+UmU9E4Q6Hj5Cp06dOoWmvKhURFZFjjYGlBlVC4l+zpjQuahIulikljrnQZmqXN18ePDwz+O9qGQsKDcqm/tnaHrxdCNichJUiOwf4dDrJzvRggStJH32HK6za9GKBKlKgbaXqQgNSl8F6N6CCb3pgFhX95Z3dZXKu/dwXV6nsiJBhcrVx09u6C6I450bkc3FpXW+fN2I7nPaChKV3bfvP37++r0TVR3zlqqKpIelqrYx85kQm+o+SKSHb2WhqsjHTiJBITiJDQWJDAWpIkNBIkJBIkOhSnUShf4C9DyJBLzMYSsAAAAASUVORK5CYII=';
    var jQuery=jQuery||window.jQuery||$;
    /* Chosen v1.0.0 | (c) 2011-2013 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */
    !function(){var a,AbstractChosen,Chosen,SelectParser,b,c={}.hasOwnProperty,d=function(a,b){function d(){this.constructor=a}for(var e in b)c.call(b,e)&&(a[e]=b[e]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a};SelectParser=function(){function SelectParser(){this.options_index=0,this.parsed=[]}return SelectParser.prototype.add_node=function(a){return"OPTGROUP"===a.nodeName.toUpperCase()?this.add_group(a):this.add_option(a)},SelectParser.prototype.add_group=function(a){var b,c,d,e,f,g;for(b=this.parsed.length,this.parsed.push({array_index:b,group:!0,label:this.escapeExpression(a.label),children:0,disabled:a.disabled}),f=a.childNodes,g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(this.add_option(c,b,a.disabled));return g},SelectParser.prototype.add_option=function(a,b,c){return"OPTION"===a.nodeName.toUpperCase()?(""!==a.text?(null!=b&&(this.parsed[b].children+=1),this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:a.value,text:a.text,html:a.innerHTML,selected:a.selected,disabled:c===!0?c:a.disabled,group_array_index:b,classes:a.className,style:a.style.cssText})):this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0}),this.options_index+=1):void 0},SelectParser.prototype.escapeExpression=function(a){var b,c;return null==a||a===!1?"":/[\&\<\>\"\'\`]/.test(a)?(b={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},c=/&(?!\w+;)|[\<\>\"\'\`]/g,a.replace(c,function(a){return b[a]||"&amp;"})):a},SelectParser}(),SelectParser.select_to_array=function(a){var b,c,d,e,f;for(c=new SelectParser,f=a.childNodes,d=0,e=f.length;e>d;d++)b=f[d],c.add_node(b);return c.parsed},AbstractChosen=function(){function AbstractChosen(a,b){this.form_field=a,this.options=null!=b?b:{},AbstractChosen.browser_is_supported()&&(this.is_multiple=this.form_field.multiple,this.set_default_text(),this.set_default_values(),this.setup(),this.set_up_html(),this.register_observers())}return AbstractChosen.prototype.set_default_values=function(){var a=this;return this.click_test_action=function(b){return a.test_active_click(b)},this.activate_action=function(b){return a.activate_field(b)},this.active_field=!1,this.mouse_on_container=!1,this.results_showing=!1,this.result_highlighted=null,this.result_single_selected=null,this.allow_single_deselect=null!=this.options.allow_single_deselect&&null!=this.form_field.options[0]&&""===this.form_field.options[0].text?this.options.allow_single_deselect:!1,this.disable_search_threshold=this.options.disable_search_threshold||0,this.disable_search=this.options.disable_search||!1,this.enable_split_word_search=null!=this.options.enable_split_word_search?this.options.enable_split_word_search:!0,this.group_search=null!=this.options.group_search?this.options.group_search:!0,this.search_contains=this.options.search_contains||!1,this.single_backstroke_delete=null!=this.options.single_backstroke_delete?this.options.single_backstroke_delete:!0,this.max_selected_options=this.options.max_selected_options||1/0,this.inherit_select_classes=this.options.inherit_select_classes||!1,this.display_selected_options=null!=this.options.display_selected_options?this.options.display_selected_options:!0,this.display_disabled_options=null!=this.options.display_disabled_options?this.options.display_disabled_options:!0},AbstractChosen.prototype.set_default_text=function(){return this.default_text=this.form_field.getAttribute("data-placeholder")?this.form_field.getAttribute("data-placeholder"):this.is_multiple?this.options.placeholder_text_multiple||this.options.placeholder_text||AbstractChosen.default_multiple_text:this.options.placeholder_text_single||this.options.placeholder_text||AbstractChosen.default_single_text,this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||AbstractChosen.default_no_result_text},AbstractChosen.prototype.mouse_enter=function(){return this.mouse_on_container=!0},AbstractChosen.prototype.mouse_leave=function(){return this.mouse_on_container=!1},AbstractChosen.prototype.input_focus=function(){var a=this;if(this.is_multiple){if(!this.active_field)return setTimeout(function(){return a.container_mousedown()},50)}else if(!this.active_field)return this.activate_field()},AbstractChosen.prototype.input_blur=function(){var a=this;return this.mouse_on_container?void 0:(this.active_field=!1,setTimeout(function(){return a.blur_test()},100))},AbstractChosen.prototype.results_option_build=function(a){var b,c,d,e,f;for(b="",f=this.results_data,d=0,e=f.length;e>d;d++)c=f[d],b+=c.group?this.result_add_group(c):this.result_add_option(c),(null!=a?a.first:void 0)&&(c.selected&&this.is_multiple?this.choice_build(c):c.selected&&!this.is_multiple&&this.single_set_selected_text(c.text));return b},AbstractChosen.prototype.result_add_option=function(a){var b,c;return a.search_match?this.include_option_in_results(a)?(b=[],a.disabled||a.selected&&this.is_multiple||b.push("active-result"),!a.disabled||a.selected&&this.is_multiple||b.push("disabled-result"),a.selected&&b.push("result-selected"),null!=a.group_array_index&&b.push("group-option"),""!==a.classes&&b.push(a.classes),c=""!==a.style.cssText?' style="'+a.style+'"':"",'<li class="'+b.join(" ")+'"'+c+' data-option-array-index="'+a.array_index+'">'+a.search_text+"</li>"):"":""},AbstractChosen.prototype.result_add_group=function(a){return a.search_match||a.group_match?a.active_options>0?'<li class="group-result">'+a.search_text+"</li>":"":""},AbstractChosen.prototype.results_update_field=function(){return this.set_default_text(),this.is_multiple||this.results_reset_cleanup(),this.result_clear_highlight(),this.result_single_selected=null,this.results_build(),this.results_showing?this.winnow_results():void 0},AbstractChosen.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()},AbstractChosen.prototype.results_search=function(){return this.results_showing?this.winnow_results():this.results_show()},AbstractChosen.prototype.winnow_results=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m;for(this.no_results_clear(),e=0,g=this.get_search_text(),a=g.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),d=this.search_contains?"":"^",c=new RegExp(d+a,"i"),j=new RegExp(a,"i"),m=this.results_data,k=0,l=m.length;l>k;k++)b=m[k],b.search_match=!1,f=null,this.include_option_in_results(b)&&(b.group&&(b.group_match=!1,b.active_options=0),null!=b.group_array_index&&this.results_data[b.group_array_index]&&(f=this.results_data[b.group_array_index],0===f.active_options&&f.search_match&&(e+=1),f.active_options+=1),(!b.group||this.group_search)&&(b.search_text=b.group?b.label:b.html,b.search_match=this.search_string_match(b.search_text,c),b.search_match&&!b.group&&(e+=1),b.search_match?(g.length&&(h=b.search_text.search(j),i=b.search_text.substr(0,h+g.length)+"</em>"+b.search_text.substr(h+g.length),b.search_text=i.substr(0,h)+"<em>"+i.substr(h)),null!=f&&(f.group_match=!0)):null!=b.group_array_index&&this.results_data[b.group_array_index].search_match&&(b.search_match=!0)));return this.result_clear_highlight(),1>e&&g.length?(this.update_results_content(""),this.no_results(g)):(this.update_results_content(this.results_option_build()),this.winnow_results_set_highlight())},AbstractChosen.prototype.search_string_match=function(a,b){var c,d,e,f;if(b.test(a))return!0;if(this.enable_split_word_search&&(a.indexOf(" ")>=0||0===a.indexOf("["))&&(d=a.replace(/\[|\]/g,"").split(" "),d.length))for(e=0,f=d.length;f>e;e++)if(c=d[e],b.test(c))return!0},AbstractChosen.prototype.choices_count=function(){var a,b,c,d;if(null!=this.selected_option_count)return this.selected_option_count;for(this.selected_option_count=0,d=this.form_field.options,b=0,c=d.length;c>b;b++)a=d[b],a.selected&&(this.selected_option_count+=1);return this.selected_option_count},AbstractChosen.prototype.choices_click=function(a){return a.preventDefault(),this.results_showing||this.is_disabled?void 0:this.results_show()},AbstractChosen.prototype.keyup_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),b){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices_count()>0)return this.keydown_backstroke();if(!this.pending_backstroke)return this.result_clear_highlight(),this.results_search();break;case 13:if(a.preventDefault(),this.results_showing)return this.result_select(a);break;case 27:return this.results_showing&&this.results_hide(),!0;case 9:case 38:case 40:case 16:case 91:case 17:break;default:return this.results_search()}},AbstractChosen.prototype.container_width=function(){return null!=this.options.width?this.options.width:""+this.form_field.offsetWidth+"px"},AbstractChosen.prototype.include_option_in_results=function(a){return this.is_multiple&&!this.display_selected_options&&a.selected?!1:!this.display_disabled_options&&a.disabled?!1:a.empty?!1:!0},AbstractChosen.browser_is_supported=function(){return"Microsoft Internet Explorer"===window.navigator.appName?document.documentMode>=8:/iP(od|hone)/i.test(window.navigator.userAgent)?!1:/Android/i.test(window.navigator.userAgent)&&/Mobile/i.test(window.navigator.userAgent)?!1:!0},AbstractChosen.default_multiple_text="Select Some Options",AbstractChosen.default_single_text="Select an Option",AbstractChosen.default_no_result_text="No results match",AbstractChosen}(),a=jQuery,a.fn.extend({chosen:function(b){return AbstractChosen.browser_is_supported()?this.each(function(){var c,d;c=a(this),d=c.data("chosen"),"destroy"===b&&d?d.destroy():d||c.data("chosen",new Chosen(this,b))}):this}}),Chosen=function(c){function Chosen(){return b=Chosen.__super__.constructor.apply(this,arguments)}return d(Chosen,c),Chosen.prototype.setup=function(){return this.form_field_jq=a(this.form_field),this.current_selectedIndex=this.form_field.selectedIndex,this.is_rtl=this.form_field_jq.hasClass("chosen-rtl")},Chosen.prototype.set_up_html=function(){var b,c;return b=["chosen-container"],b.push("chosen-container-"+(this.is_multiple?"multi":"single")),this.inherit_select_classes&&this.form_field.className&&b.push(this.form_field.className),this.is_rtl&&b.push("chosen-rtl"),c={"class":b.join(" "),style:"width: "+this.container_width()+";",title:this.form_field.title},this.form_field.id.length&&(c.id=this.form_field.id.replace(/[^\w]/g,"_")+"_chosen"),this.container=a("<div />",c),this.is_multiple?this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="'+this.default_text+'" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>'):this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>'+this.default_text+'</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'),this.form_field_jq.hide().after(this.container),this.dropdown=this.container.find("div.chosen-drop").first(),this.search_field=this.container.find("input").first(),this.search_results=this.container.find("ul.chosen-results").first(),this.search_field_scale(),this.search_no_results=this.container.find("li.no-results").first(),this.is_multiple?(this.search_choices=this.container.find("ul.chosen-choices").first(),this.search_container=this.container.find("li.search-field").first()):(this.search_container=this.container.find("div.chosen-search").first(),this.selected_item=this.container.find(".chosen-single").first()),this.results_build(),this.set_tab_index(),this.set_label_behavior(),this.form_field_jq.trigger("chosen:ready",{chosen:this})},Chosen.prototype.register_observers=function(){var a=this;return this.container.bind("mousedown.chosen",function(b){a.container_mousedown(b)}),this.container.bind("mouseup.chosen",function(b){a.container_mouseup(b)}),this.container.bind("mouseenter.chosen",function(b){a.mouse_enter(b)}),this.container.bind("mouseleave.chosen",function(b){a.mouse_leave(b)}),this.search_results.bind("mouseup.chosen",function(b){a.search_results_mouseup(b)}),this.search_results.bind("mouseover.chosen",function(b){a.search_results_mouseover(b)}),this.search_results.bind("mouseout.chosen",function(b){a.search_results_mouseout(b)}),this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen",function(b){a.search_results_mousewheel(b)}),this.form_field_jq.bind("chosen:updated.chosen",function(b){a.results_update_field(b)}),this.form_field_jq.bind("chosen:activate.chosen",function(b){a.activate_field(b)}),this.form_field_jq.bind("chosen:open.chosen",function(b){a.container_mousedown(b)}),this.search_field.bind("blur.chosen",function(b){a.input_blur(b)}),this.search_field.bind("keyup.chosen",function(b){a.keyup_checker(b)}),this.search_field.bind("keydown.chosen",function(b){a.keydown_checker(b)}),this.search_field.bind("focus.chosen",function(b){a.input_focus(b)}),this.is_multiple?this.search_choices.bind("click.chosen",function(b){a.choices_click(b)}):this.container.bind("click.chosen",function(a){a.preventDefault()})},Chosen.prototype.destroy=function(){return a(document).unbind("click.chosen",this.click_test_action),this.search_field[0].tabIndex&&(this.form_field_jq[0].tabIndex=this.search_field[0].tabIndex),this.container.remove(),this.form_field_jq.removeData("chosen"),this.form_field_jq.show()},Chosen.prototype.search_field_disabled=function(){return this.is_disabled=this.form_field_jq[0].disabled,this.is_disabled?(this.container.addClass("chosen-disabled"),this.search_field[0].disabled=!0,this.is_multiple||this.selected_item.unbind("focus.chosen",this.activate_action),this.close_field()):(this.container.removeClass("chosen-disabled"),this.search_field[0].disabled=!1,this.is_multiple?void 0:this.selected_item.bind("focus.chosen",this.activate_action))},Chosen.prototype.container_mousedown=function(b){return this.is_disabled||(b&&"mousedown"===b.type&&!this.results_showing&&b.preventDefault(),null!=b&&a(b.target).hasClass("search-choice-close"))?void 0:(this.active_field?this.is_multiple||!b||a(b.target)[0]!==this.selected_item[0]&&!a(b.target).parents("a.chosen-single").length||(b.preventDefault(),this.results_toggle()):(this.is_multiple&&this.search_field.val(""),a(document).bind("click.chosen",this.click_test_action),this.results_show()),this.activate_field())},Chosen.prototype.container_mouseup=function(a){return"ABBR"!==a.target.nodeName||this.is_disabled?void 0:this.results_reset(a)},Chosen.prototype.search_results_mousewheel=function(a){var b,c,d;return b=-(null!=(c=a.originalEvent)?c.wheelDelta:void 0)||(null!=(d=a.originialEvent)?d.detail:void 0),null!=b?(a.preventDefault(),"DOMMouseScroll"===a.type&&(b=40*b),this.search_results.scrollTop(b+this.search_results.scrollTop())):void 0},Chosen.prototype.blur_test=function(){return!this.active_field&&this.container.hasClass("chosen-container-active")?this.close_field():void 0},Chosen.prototype.close_field=function(){return a(document).unbind("click.chosen",this.click_test_action),this.active_field=!1,this.results_hide(),this.container.removeClass("chosen-container-active"),this.clear_backstroke(),this.show_search_field_default(),this.search_field_scale()},Chosen.prototype.activate_field=function(){return this.container.addClass("chosen-container-active"),this.active_field=!0,this.search_field.val(this.search_field.val()),this.search_field.focus()},Chosen.prototype.test_active_click=function(b){return this.container.is(a(b.target).closest(".chosen-container"))?this.active_field=!0:this.close_field()},Chosen.prototype.results_build=function(){return this.parsing=!0,this.selected_option_count=null,this.results_data=SelectParser.select_to_array(this.form_field),this.is_multiple?this.search_choices.find("li.search-choice").remove():this.is_multiple||(this.single_set_selected_text(),this.disable_search||this.form_field.options.length<=this.disable_search_threshold?(this.search_field[0].readOnly=!0,this.container.addClass("chosen-container-single-nosearch")):(this.search_field[0].readOnly=!1,this.container.removeClass("chosen-container-single-nosearch"))),this.update_results_content(this.results_option_build({first:!0})),this.search_field_disabled(),this.show_search_field_default(),this.search_field_scale(),this.parsing=!1},Chosen.prototype.result_do_highlight=function(a){var b,c,d,e,f;if(a.length){if(this.result_clear_highlight(),this.result_highlight=a,this.result_highlight.addClass("highlighted"),d=parseInt(this.search_results.css("maxHeight"),10),f=this.search_results.scrollTop(),e=d+f,c=this.result_highlight.position().top+this.search_results.scrollTop(),b=c+this.result_highlight.outerHeight(),b>=e)return this.search_results.scrollTop(b-d>0?b-d:0);if(f>c)return this.search_results.scrollTop(c)}},Chosen.prototype.result_clear_highlight=function(){return this.result_highlight&&this.result_highlight.removeClass("highlighted"),this.result_highlight=null},Chosen.prototype.results_show=function(){return this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.container.addClass("chosen-with-drop"),this.form_field_jq.trigger("chosen:showing_dropdown",{chosen:this}),this.results_showing=!0,this.search_field.focus(),this.search_field.val(this.search_field.val()),this.winnow_results())},Chosen.prototype.update_results_content=function(a){return this.search_results.html(a)},Chosen.prototype.results_hide=function(){return this.results_showing&&(this.result_clear_highlight(),this.container.removeClass("chosen-with-drop"),this.form_field_jq.trigger("chosen:hiding_dropdown",{chosen:this})),this.results_showing=!1},Chosen.prototype.set_tab_index=function(){var a;return this.form_field.tabIndex?(a=this.form_field.tabIndex,this.form_field.tabIndex=-1,this.search_field[0].tabIndex=a):void 0},Chosen.prototype.set_label_behavior=function(){var b=this;return this.form_field_label=this.form_field_jq.parents("label"),!this.form_field_label.length&&this.form_field.id.length&&(this.form_field_label=a("label[for='"+this.form_field.id+"']")),this.form_field_label.length>0?this.form_field_label.bind("click.chosen",function(a){return b.is_multiple?b.container_mousedown(a):b.activate_field()}):void 0},Chosen.prototype.show_search_field_default=function(){return this.is_multiple&&this.choices_count()<1&&!this.active_field?(this.search_field.val(this.default_text),this.search_field.addClass("default")):(this.search_field.val(""),this.search_field.removeClass("default"))},Chosen.prototype.search_results_mouseup=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c.length?(this.result_highlight=c,this.result_select(b),this.search_field.focus()):void 0},Chosen.prototype.search_results_mouseover=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c?this.result_do_highlight(c):void 0},Chosen.prototype.search_results_mouseout=function(b){return a(b.target).hasClass("active-result")?this.result_clear_highlight():void 0},Chosen.prototype.choice_build=function(b){var c,d,e=this;return c=a("<li />",{"class":"search-choice"}).html("<span>"+b.html+"</span>"),b.disabled?c.addClass("search-choice-disabled"):(d=a("<a />",{"class":"search-choice-close","data-option-array-index":b.array_index}),d.bind("click.chosen",function(a){return e.choice_destroy_link_click(a)}),c.append(d)),this.search_container.before(c)},Chosen.prototype.choice_destroy_link_click=function(b){return b.preventDefault(),b.stopPropagation(),this.is_disabled?void 0:this.choice_destroy(a(b.target))},Chosen.prototype.choice_destroy=function(a){return this.result_deselect(a[0].getAttribute("data-option-array-index"))?(this.show_search_field_default(),this.is_multiple&&this.choices_count()>0&&this.search_field.val().length<1&&this.results_hide(),a.parents("li").first().remove(),this.search_field_scale()):void 0},Chosen.prototype.results_reset=function(){return this.form_field.options[0].selected=!0,this.selected_option_count=null,this.single_set_selected_text(),this.show_search_field_default(),this.results_reset_cleanup(),this.form_field_jq.trigger("change"),this.active_field?this.results_hide():void 0},Chosen.prototype.results_reset_cleanup=function(){return this.current_selectedIndex=this.form_field.selectedIndex,this.selected_item.find("abbr").remove()},Chosen.prototype.result_select=function(a){var b,c,d;return this.result_highlight?(b=this.result_highlight,this.result_clear_highlight(),this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.is_multiple?b.removeClass("active-result"):(this.result_single_selected&&(this.result_single_selected.removeClass("result-selected"),d=this.result_single_selected[0].getAttribute("data-option-array-index"),this.results_data[d].selected=!1),this.result_single_selected=b),b.addClass("result-selected"),c=this.results_data[b[0].getAttribute("data-option-array-index")],c.selected=!0,this.form_field.options[c.options_index].selected=!0,this.selected_option_count=null,this.is_multiple?this.choice_build(c):this.single_set_selected_text(c.text),(a.metaKey||a.ctrlKey)&&this.is_multiple||this.results_hide(),this.search_field.val(""),(this.is_multiple||this.form_field.selectedIndex!==this.current_selectedIndex)&&this.form_field_jq.trigger("change",{selected:this.form_field.options[c.options_index].value}),this.current_selectedIndex=this.form_field.selectedIndex,this.search_field_scale())):void 0},Chosen.prototype.single_set_selected_text=function(a){return null==a&&(a=this.default_text),a===this.default_text?this.selected_item.addClass("chosen-default"):(this.single_deselect_control_build(),this.selected_item.removeClass("chosen-default")),this.selected_item.find("span").text(a)},Chosen.prototype.result_deselect=function(a){var b;return b=this.results_data[a],this.form_field.options[b.options_index].disabled?!1:(b.selected=!1,this.form_field.options[b.options_index].selected=!1,this.selected_option_count=null,this.result_clear_highlight(),this.results_showing&&this.winnow_results(),this.form_field_jq.trigger("change",{deselected:this.form_field.options[b.options_index].value}),this.search_field_scale(),!0)},Chosen.prototype.single_deselect_control_build=function(){return this.allow_single_deselect?(this.selected_item.find("abbr").length||this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>'),this.selected_item.addClass("chosen-single-with-deselect")):void 0},Chosen.prototype.get_search_text=function(){return this.search_field.val()===this.default_text?"":a("<div/>").text(a.trim(this.search_field.val())).html()},Chosen.prototype.winnow_results_set_highlight=function(){var a,b;return b=this.is_multiple?[]:this.search_results.find(".result-selected.active-result"),a=b.length?b.first():this.search_results.find(".active-result").first(),null!=a?this.result_do_highlight(a):void 0},Chosen.prototype.no_results=function(b){var c;return c=a('<li class="no-results">'+this.results_none_found+' "<span></span>"</li>'),c.find("span").first().html(b),this.search_results.append(c)},Chosen.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()},Chosen.prototype.keydown_arrow=function(){var a;return this.results_showing&&this.result_highlight?(a=this.result_highlight.nextAll("li.active-result").first())?this.result_do_highlight(a):void 0:this.results_show()},Chosen.prototype.keyup_arrow=function(){var a;return this.results_showing||this.is_multiple?this.result_highlight?(a=this.result_highlight.prevAll("li.active-result"),a.length?this.result_do_highlight(a.first()):(this.choices_count()>0&&this.results_hide(),this.result_clear_highlight())):void 0:this.results_show()},Chosen.prototype.keydown_backstroke=function(){var a;return this.pending_backstroke?(this.choice_destroy(this.pending_backstroke.find("a").first()),this.clear_backstroke()):(a=this.search_container.siblings("li.search-choice").last(),a.length&&!a.hasClass("search-choice-disabled")?(this.pending_backstroke=a,this.single_backstroke_delete?this.keydown_backstroke():this.pending_backstroke.addClass("search-choice-focus")):void 0)},Chosen.prototype.clear_backstroke=function(){return this.pending_backstroke&&this.pending_backstroke.removeClass("search-choice-focus"),this.pending_backstroke=null},Chosen.prototype.keydown_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),8!==b&&this.pending_backstroke&&this.clear_backstroke(),b){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:this.results_showing&&!this.is_multiple&&this.result_select(a),this.mouse_on_container=!1;break;case 13:a.preventDefault();break;case 38:a.preventDefault(),this.keyup_arrow();break;case 40:a.preventDefault(),this.keydown_arrow()}},Chosen.prototype.search_field_scale=function(){var b,c,d,e,f,g,h,i,j;if(this.is_multiple){for(d=0,h=0,f="position:absolute; left: -1000px; top: -1000px; display:none;",g=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"],i=0,j=g.length;j>i;i++)e=g[i],f+=e+":"+this.search_field.css(e)+";";return b=a("<div />",{style:f}),b.text(this.search_field.val()),a("body").append(b),h=b.width()+25,b.remove(),c=this.container.outerWidth(),h>c-10&&(h=c-10),this.search_field.css({width:h+"px"})}},Chosen}(AbstractChosen)}.call(this);
    /* Chosen v1.0.0 | (c) 2011-2013 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */
    GM_addStyle(".chosen-container{position:relative;display:inline-block;vertical-align:middle;font-size:13px;zoom:1;*display:inline;-webkit-user-select:none;-moz-user-select:none;user-select:none}.chosen-container .chosen-drop{position:absolute;top:100%;left:-9999px;z-index:1010;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;border:1px solid #aaa;border-top:0;background:#fff;box-shadow:0 4px 5px rgba(0,0,0,.15)}.chosen-container.chosen-with-drop .chosen-drop{left:0}.chosen-container a{cursor:pointer}.chosen-container-single .chosen-single{position:relative;display:block;overflow:hidden;padding:0 0 0 8px;height:23px;border:1px solid #aaa;border-radius:5px;background-color:#fff;background:-webkit-gradient(linear,50% 0,50% 100%,color-stop(20%,#fff),color-stop(50%,#f6f6f6),color-stop(52%,#eee),color-stop(100%,#f4f4f4));background:-webkit-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background:-moz-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background:-o-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background:linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-clip:padding-box;box-shadow:0 0 3px #fff inset,0 1px 1px rgba(0,0,0,.1);color:#444;text-decoration:none;white-space:nowrap;line-height:24px}.chosen-container-single .chosen-default{color:#999}.chosen-container-single .chosen-single span{display:block;overflow:hidden;margin-right:26px;text-overflow:ellipsis;white-space:nowrap}.chosen-container-single .chosen-single-with-deselect span{margin-right:38px}.chosen-container-single .chosen-single abbr{position:absolute;top:6px;right:26px;display:block;width:12px;height:12px;background:url('"+chosenSprite+"') -42px 1px no-repeat;font-size:1px}.chosen-container-single .chosen-single abbr:hover{background-position:-42px -10px}.chosen-container-single.chosen-disabled .chosen-single abbr:hover{background-position:-42px -10px}.chosen-container-single .chosen-single div{position:absolute;top:0;right:0;display:block;width:18px;height:100%}.chosen-container-single .chosen-single div b{display:block;width:100%;height:100%;background:url('"+chosenSprite+"') no-repeat 0 2px}.chosen-container-single .chosen-search{position:relative;z-index:1010;margin:0;padding:3px 4px;white-space:nowrap}.chosen-container-single .chosen-search input[type=text]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin:1px 0;padding:4px 20px 4px 5px;width:100%;height:auto;outline:0;border:1px solid #aaa;background:#fff url('"+chosenSprite+"') no-repeat 100% -20px;background:url('"+chosenSprite+"') no-repeat 100% -20px,-webkit-gradient(linear,50% 0,50% 100%,color-stop(1%,#eee),color-stop(15%,#fff));background:url('"+chosenSprite+"') no-repeat 100% -20px,-webkit-linear-gradient(#eee 1%,#fff 15%);background:url('"+chosenSprite+"') no-repeat 100% -20px,-moz-linear-gradient(#eee 1%,#fff 15%);background:url('"+chosenSprite+"') no-repeat 100% -20px,-o-linear-gradient(#eee 1%,#fff 15%);background:url('"+chosenSprite+"') no-repeat 100% -20px,linear-gradient(#eee 1%,#fff 15%);font-size:1em;font-family:sans-serif;line-height:normal;border-radius:0}.chosen-container-single .chosen-drop{margin-top:-1px;border-radius:0 0 4px 4px;background-clip:padding-box}.chosen-container-single.chosen-container-single-nosearch .chosen-search{position:absolute;left:-9999px}.chosen-container .chosen-results{position:relative;overflow-x:hidden;overflow-y:auto;margin:0 4px 4px 0;padding:0 0 0 4px;max-height:240px;-webkit-overflow-scrolling:touch}.chosen-container .chosen-results li{display:none;margin:0;padding:5px 6px;list-style:none;line-height:15px}.chosen-container .chosen-results li.active-result{display:list-item;cursor:pointer}.chosen-container .chosen-results li.disabled-result{display:list-item;color:#ccc;cursor:default}.chosen-container .chosen-results li.highlighted{background-color:#3875d7;background-image:-webkit-gradient(linear,50% 0,50% 100%,color-stop(20%,#3875d7),color-stop(90%,#2a62bc));background-image:-webkit-linear-gradient(#3875d7 20%,#2a62bc 90%);background-image:-moz-linear-gradient(#3875d7 20%,#2a62bc 90%);background-image:-o-linear-gradient(#3875d7 20%,#2a62bc 90%);background-image:linear-gradient(#3875d7 20%,#2a62bc 90%);color:#fff}.chosen-container .chosen-results li.no-results{display:list-item;background:#f4f4f4}.chosen-container .chosen-results li.group-result{display:list-item;font-weight:700;cursor:default}.chosen-container .chosen-results li.group-option{padding-left:15px}.chosen-container .chosen-results li em{font-style:normal;text-decoration:underline}.chosen-container-multi .chosen-choices{position:relative;overflow:hidden;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0;width:100%;height:auto!important;height:1%;border:1px solid #aaa;background-color:#fff;background-image:-webkit-gradient(linear,50% 0,50% 100%,color-stop(1%,#eee),color-stop(15%,#fff));background-image:-webkit-linear-gradient(#eee 1%,#fff 15%);background-image:-moz-linear-gradient(#eee 1%,#fff 15%);background-image:-o-linear-gradient(#eee 1%,#fff 15%);background-image:linear-gradient(#eee 1%,#fff 15%);cursor:text}.chosen-container-multi .chosen-choices li{float:left;list-style:none}.chosen-container-multi .chosen-choices li.search-field{margin:0;padding:0;white-space:nowrap}.chosen-container-multi .chosen-choices li.search-field input[type=text]{margin:1px 0;padding:5px;height:15px;outline:0;border:0!important;background:transparent!important;box-shadow:none;color:#666;font-size:100%;font-family:sans-serif;line-height:normal;border-radius:0}.chosen-container-multi .chosen-choices li.search-field .default{color:#999}.chosen-container-multi .chosen-choices li.search-choice{position:relative;margin:3px 0 3px 5px;padding:3px 20px 3px 5px;border:1px solid #aaa;border-radius:3px;background-color:#e4e4e4;background-image:-webkit-gradient(linear,50% 0,50% 100%,color-stop(20%,#f4f4f4),color-stop(50%,#f0f0f0),color-stop(52%,#e8e8e8),color-stop(100%,#eee));background-image:-webkit-linear-gradient(#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-image:-moz-linear-gradient(#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-image:-o-linear-gradient(#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-image:linear-gradient(#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-clip:padding-box;box-shadow:0 0 2px #fff inset,0 1px 0 rgba(0,0,0,.05);color:#333;line-height:13px;cursor:default}.chosen-container-multi .chosen-choices li.search-choice .search-choice-close{position:absolute;top:4px;right:3px;display:block;width:12px;height:12px;background:url('"+chosenSprite+"') -42px 1px no-repeat;font-size:1px}.chosen-container-multi .chosen-choices li.search-choice .search-choice-close:hover{background-position:-42px -10px}.chosen-container-multi .chosen-choices li.search-choice-disabled{padding-right:5px;border:1px solid #ccc;background-color:#e4e4e4;background-image:-webkit-gradient(linear,50% 0,50% 100%,color-stop(20%,#f4f4f4),color-stop(50%,#f0f0f0),color-stop(52%,#e8e8e8),color-stop(100%,#eee));background-image:-webkit-linear-gradient(top,#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-image:-moz-linear-gradient(top,#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-image:-o-linear-gradient(top,#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-image:linear-gradient(top,#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);color:#666}.chosen-container-multi .chosen-choices li.search-choice-focus{background:#d4d4d4}.chosen-container-multi .chosen-choices li.search-choice-focus .search-choice-close{background-position:-42px -10px}.chosen-container-multi .chosen-results{margin:0;padding:0}.chosen-container-multi .chosen-drop .result-selected{display:list-item;color:#ccc;cursor:default}.chosen-container-active .chosen-single{border:1px solid #5897fb;box-shadow:0 0 5px rgba(0,0,0,.3)}.chosen-container-active.chosen-with-drop .chosen-single{border:1px solid #aaa;-moz-border-radius-bottomright:0;border-bottom-right-radius:0;-moz-border-radius-bottomleft:0;border-bottom-left-radius:0;background-image:-webkit-gradient(linear,50% 0,50% 100%,color-stop(20%,#eee),color-stop(80%,#fff));background-image:-webkit-linear-gradient(#eee 20%,#fff 80%);background-image:-moz-linear-gradient(#eee 20%,#fff 80%);background-image:-o-linear-gradient(#eee 20%,#fff 80%);background-image:linear-gradient(#eee 20%,#fff 80%);box-shadow:0 1px 0 #fff inset}.chosen-container-active.chosen-with-drop .chosen-single div{border-left:0;background:transparent}.chosen-container-active.chosen-with-drop .chosen-single div b{background-position:-18px 2px}.chosen-container-active .chosen-choices{border:1px solid #5897fb;box-shadow:0 0 5px rgba(0,0,0,.3)}.chosen-container-active .chosen-choices li.search-field input[type=text]{color:#111!important}.chosen-disabled{opacity:.5!important;cursor:default}.chosen-disabled .chosen-single{cursor:default}.chosen-disabled .chosen-choices .search-choice .search-choice-close{cursor:default}.chosen-rtl{text-align:right}.chosen-rtl .chosen-single{overflow:visible;padding:0 8px 0 0}.chosen-rtl .chosen-single span{margin-right:0;margin-left:26px;direction:rtl}.chosen-rtl .chosen-single-with-deselect span{margin-left:38px}.chosen-rtl .chosen-single div{right:auto;left:3px}.chosen-rtl .chosen-single abbr{right:auto;left:26px}.chosen-rtl .chosen-choices li{float:right}.chosen-rtl .chosen-choices li.search-field input[type=text]{direction:rtl}.chosen-rtl .chosen-choices li.search-choice{margin:3px 5px 3px 0;padding:3px 5px 3px 19px}.chosen-rtl .chosen-choices li.search-choice .search-choice-close{right:auto;left:4px}.chosen-rtl.chosen-container-single-nosearch .chosen-search,.chosen-rtl .chosen-drop{left:9999px}.chosen-rtl.chosen-container-single .chosen-results{margin:0 0 4px 4px;padding:0 4px 0 0}.chosen-rtl .chosen-results li.group-option{padding-right:15px;padding-left:0}.chosen-rtl.chosen-container-active.chosen-with-drop .chosen-single div{border-right:0}.chosen-rtl .chosen-search input[type=text]{padding:4px 5px 4px 20px;background:#fff url('"+chosenSprite+"') no-repeat -30px -20px;background:url('"+chosenSprite+"') no-repeat -30px -20px,-webkit-gradient(linear,50% 0,50% 100%,color-stop(1%,#eee),color-stop(15%,#fff));background:url('"+chosenSprite+"') no-repeat -30px -20px,-webkit-linear-gradient(#eee 1%,#fff 15%);background:url('"+chosenSprite+"') no-repeat -30px -20px,-moz-linear-gradient(#eee 1%,#fff 15%);background:url('"+chosenSprite+"') no-repeat -30px -20px,-o-linear-gradient(#eee 1%,#fff 15%);background:url('"+chosenSprite+"') no-repeat -30px -20px,linear-gradient(#eee 1%,#fff 15%);direction:rtl}.chosen-rtl.chosen-container-single .chosen-single div b{background-position:6px 2px}.chosen-rtl.chosen-container-single.chosen-with-drop .chosen-single div b{background-position:-12px 2px}@media only screen and (-webkit-min-device-pixel-ratio:2),only screen and (min-resolution:144dpi){.chosen-rtl .chosen-search input[type=text],.chosen-container-single .chosen-single abbr,.chosen-container-single .chosen-single div b,.chosen-container-single .chosen-search input[type=text],.chosen-container-multi .chosen-choices .search-choice .search-choice-close,.chosen-container .chosen-results-scroll-down span,.chosen-container .chosen-results-scroll-up span{background-image:url('"+chosenSprite2+"')!important;background-size:52px 37px!important;background-repeat:no-repeat!important}}");
}

//Hideable souvenirs
try{
  if(settings_hideable_souvenirs && (document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/souvenirs\.aspx/) || (document.location.href.match(/^http:\/\/www\.geocaching\.com\/profile\//) && $('.ProfileSouvenirsList').length > 0) ) ){
    var souvenirIgnoreList = JSON.parse(GM_getValue("HiddenSouvenirs", "{ }"));
    $('.ProfileSouvenirsList').children().css("position", "relative").append("<a title='Remove this souvenir' href='#' class='souvenirHideButton' style='position:absolute;top:0px;right:5px;height:22px;width:22px;'> <img style='height:22px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADZBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMi4yLWMwNjMgNTMuMzUyNjI0LCAyMDA4LzA3LzMwLTE4OjA1OjQxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIKICAgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cDovL2Jsb2cuYWRkaWN0ZWR0b2NvZmZlZS5kZSIKICAgcGhvdG9zaG9wOkF1dGhvcnNQb3NpdGlvbj0iIj4KICAgPGRjOnJpZ2h0cz4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+wqkgICAgICAgICAgICYjeEE7IDIwMDkgYnkgT2xpdmVyIFR3YXJkb3dza2k8L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpyaWdodHM+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5PbGl2ZXIgVHdhcmRvd3NraTwvcmRmOmxpPgogICAgPC9yZGY6U2VxPgogICA8L2RjOmNyZWF0b3I+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCIvPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wUmlnaHRzOlVzYWdlVGVybXM+CiAgICA8cmRmOkFsdD4KICAgICA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiLz4KICAgIDwvcmRmOkFsdD4KICAgPC94bXBSaWdodHM6VXNhZ2VUZXJtcz4KICAgPElwdGM0eG1wQ29yZTpDcmVhdG9yQ29udGFjdEluZm8KICAgIElwdGM0eG1wQ29yZTpDaUFkckV4dGFkcj0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ2l0eT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyUmVnaW9uPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lBZHJQY29kZT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ3RyeT0iIgogICAgSXB0YzR4bXBDb3JlOkNpVGVsV29yaz0iIgogICAgSXB0YzR4bXBDb3JlOkNpRW1haWxXb3JrPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lVcmxXb3JrPSIiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgiL5zQAABAwSURBVHjaYvz//z8DNsACYzz18fzPyMbK8P/XbwbpLdsZGUE6QIJcIiIM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' /> </a>").hover(
        function () {
            $(this).find('.souvenirHideButton').show();
        },
        function () {
            $(this).find('.souvenirHideButton').hide();
        }
    ).each(function(i,e){
        var text = $(e).text().trim();
        if(souvenirIgnoreList[text]){
            $(e).hide();
        }
        
        $(e).find('.souvenirHideButton').click(function(){
            $(e).hide();
            souvenirIgnoreList[text] = true;            
            GM_setValue("HiddenSouvenirs", JSON.stringify(souvenirIgnoreList));
            $("#souvenirIgnoreList").append('<option selected value="'+text+'">'+text+'</option>').trigger("chosen:updated");
        }).hide();
    });
    
    $('#ctl00_divContentMain p').last().after('<div><a href="#" id="showSouvenirIgnoreList">Edit hidden souvenirs</a> <div id="souvenirIgnoreListContainer" style="display:none;"><p style="margin:0px;">Hidden souvenirs:</p><select style="height:68px;" title="Deselect and reload the page for making an souvenir visible again." id="souvenirIgnoreList" multiple="multiple" /></div></div>');
    
    $("#showSouvenirIgnoreList").click(function(){
        $("#souvenirIgnoreListContainer").fadeToggle();
    });
    
    for(name in souvenirIgnoreList){
        $("#souvenirIgnoreList").append('<option selected value="'+name+'">'+name+'</option>');
    }
    
    $( "#souvenirIgnoreList" ).change(function () {
        souvenirIgnoreList = {};
        $( "#souvenirIgnoreList option:selected" ).each(function() {
            souvenirIgnoreList[$(this).text()] = true;
        });  
        GM_setValue("HiddenSouvenirs", JSON.stringify(souvenirIgnoreList));
    })    
    
    addChosenPlugin();
    
    $( "#souvenirIgnoreList" ).chosen({disable_search: true});    
    $('#souvenirIgnoreList_chosen').width("700px");
    $('.chosen-drop').hide();
    $('.search-field').hide();
  }
}catch(e){ gclh_error("Hide souvenirs",e); }

// Hide Disclaimer
try{
  if(settings_hide_disclaimer && is_page("cache_listing")){
    var disc = getElementsByClass('DisclaimerWidget')[0];
    if(disc){
      disc.parentNode.removeChild(disc);
    }else{
      var disc = getElementsByClass('Note Disclaimer')[0]; // New Listing design
      if(disc){
        disc.parentNode.removeChild(disc);
      }
    }
  }
  if(settings_hide_disclaimer && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)){
    var disc = getElementsByClass('TermsWidget no-print')[0];
    if(disc){
      disc.parentNode.removeChild(disc);
    }
  }
}catch(e){ gclh_error("Hide Disclaimer",e); }

// Hide on print-page
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)){
    document.getElementById("pnlDisplay").removeChild(document.getElementById("Footer"));
  }
}catch(e){ gclh_error("Hide on print-page",e); }

//remove paragraph containing the link to the advertisement instructions (not the advertisements itself!)
try{
  if (settings_hide_advert_link) {
    var links = document.getElementsByTagName('a');
    for(var i=0; i<links.length; i++){
      if(links[i].href.indexOf('advertising.aspx') > 0) {
        var del = links[i];
        while (del.parentNode != null && (del.parentNode.nodeName != 'P')) {
          del = del.parentNode;
        }
        if(del.parentNode) {
          del.parentNode.removeChild(del);
        }
        break;
      }
    }
  }
}catch(e){ gclh_error("Hide Advert-Link",e); }

// Hide Linebreaks
try{
  if (settings_hide_line_breaks) {
    //remove line break after "Print" label
    var printHeader = document.getElementById('ctl00_ContentBody_uxPrintHeader');
    if (printHeader) {
      var br = printHeader.parentElement.nextElementSibling;
      if (br && br.nodeName == 'BR') {
        br.parentNode.removeChild(br);
      }
    }
  }
}catch(e){ gclh_error("Hide Linebreaks",e); }

// Improve calendar-Link in Events
try{
  if(is_page("cache_listing") && document.getElementById("calLinks")){
    function calendar_link(){
      var div = document.getElementById("calLinks");
      var links = div.getElementsByTagName("a");
      for(var i=0; i<links.length; i++){
        if(links[i].title == "Google"){
          var link = links[i].href.split("&");
          var new_link = link[0]+"&"+link[1]+"&"+link[2];

          var loc = link[4].split("(");

          new_link += "&"+loc[0].substr(0,loc[0].length-3)+"&details="+loc[1].substr(0,loc[1].length-1)+"&"+link[5];

          links[i].href = new_link;
        }
      }
    }
    window.addEventListener("load",calendar_link,false); // Div wird erst nachtraeglich gefuellt, deswegen auf load warten
  }
}catch(e){ gclh_error("improve calendar-link",e); }

// remove "Warning! Spoilers may be included in the descriptions or links."
try{
  if ( settings_hide_spoilerwarning && is_page("cache_listing")){
    var findCounts = document.getElementById('ctl00_ContentBody_lblFindCounts');
    if (findCounts) {
      var para = findCounts.nextSibling.nextSibling.nextSibling.nextSibling;
      if (para && para.nodeName == 'P') {
        para.innerHTML = "&nbsp;";
        para.style.height = "0";
        para.className = para.className + ' Clear';
        //get more space for links, when spoiler is hidden
        document.getElementById('ctl00_ContentBody_uxLogbookLink').parentNode.style.width="100%";
      }
    }
  }
}catch(e){ gclh_error("Hide spoilerwarning",e); }

// Hide Cache Notes
try{
  if(settings_hide_cache_notes && is_page("cache_listing")){
    var disc = getElementsByClass('NotesWidget')[0];
    if(disc){
      disc.parentNode.removeChild(disc);
    }else{
      var disc = getElementsByClass('Note PersonalCacheNote')[0]; // New Listing design
      if(disc){
        disc.parentNode.removeChild(disc);
      }
    }
  }
}catch(e){ gclh_error("Hide Cache Notes (COMPLETE)",e); }

// Hide/Show Cache Notes
try{
  if(settings_hide_empty_cache_notes && !settings_hide_cache_notes && is_page("cache_listing")){
    var box = getElementsByClass('NotesWidget')[0];
    if(!box) box = getElementsByClass('Note PersonalCacheNote')[0]; // New Listing design
    if(box){
      var code = 
        "function hide_notes() {" +
        "  if(document.getElementById('box_notes').style.display == 'none') {" +
        "    document.getElementById('box_notes').style.display = 'block';" +
        "  } else {" +
        "    document.getElementById('box_notes').style.display = 'none';" +
        "  }" +
        "}";
    
      var script = document.createElement("script");
      script.innerHTML = code;
      document.getElementsByTagName("body")[0].appendChild(script);
  
      box.setAttribute("id","box_notes");
      var link = document.createElement("font");
      link.innerHTML = "<a href='javascript:void(0);' onClick='hide_notes();'>Show/Hide Cache Notes</a>";
      link.setAttribute("style","font-size: 10px;");
      box.parentNode.insertBefore(link,box.nextSibling);
//      getElementsByClass("UserSuppliedContent")[0].innerHTML = "<font style='font-size: 10px;'><a href='#' onClick='hide_notes();'>Show/Hide Cache Notes</a></font><br><br>"+getElementsByClass("UserSuppliedContent")[0].innerHTML;
    
      function hide_on_load() {
        var notes = getElementsByClass('NotesWidget')[0];
        if(!notes) notes = getElementsByClass('Note PersonalCacheNote')[0]; // New Listing design
        var notesText = document.getElementById("cache_note").innerHTML;
        if (notesText != null && (notesText == "Click to enter a note" || notesText == "Klicken zum Eingeben einer Notiz")) {
          notes.style.display = "none";
        }
      }
    
      window.addEventListener("load", hide_on_load, false);
    }
  }
}catch(e){ gclh_error("Hide Cache Notes",e); }

// Show breaks in Cache Notes
try{
  if(settings_breaks_in_cache_notes && !settings_hide_cache_notes && is_page("cache_listing")){
    if(browser == "chrome"){
	    //Chrome selects an other element as FireFox and so the inline editor deletes the wrong element.
	    //NOT a nice hack - but it fixes the savenote bug (but no breaks after saving)	   
        injectPageScriptFunction(function(){   
		    $("#cache_note").attr("id","cache_note1"); 
		    var content = $("#cache_note1")[0].innerHTML.replace(/^[\n ]*/,"");
		    $("#cache_note1")[0].innerHTML = "";
		    $("#cache_note1").append("<pre id='cache_note'>"+content+"</pre>");
        }, "()");
    }
    else if(document.getElementById("cache_note")){
	    document.getElementById("cache_note").id = "cache_note_old";
	    document.getElementById("cache_note_old").innerHTML = "<pre id='cache_note'>"+document.getElementById("cache_note_old").innerHTML.replace(/^[\n ]*/,"")+"</pre>";
    }
  }
}catch(e){ gclh_error("Show breaks in Cache Notes",e); }

// Hide Hint
try{
  if (settings_hide_hint && is_page("cache_listing")) {
    //replace hint by a link which shows the hint dynamically
    var hint = document.getElementById('div_hint');
    if (hint) {
      var para = hint.previousSibling; // Neues Listing-Layout
      if(para.nodeName != "P") para = hint.previousSibling.previousSibling; // Altes Layout

      if (para && para.nodeName == 'P') {
        if (trim(hint.innerHTML).length > 0) {
          var label = para.getElementsByTagName('strong')[0];
          var code = 
            "function hide_hint() {" +
            "  var hint = document.getElementById('div_hint');" +
            "  if(hint.style.display == 'none') {" +
            "    hint.style.display = 'block';" +
            "  } else {" +
            "    hint.style.display = 'none';" +
            "  }" +
            "    hint.innerHTML = convertROTStringWithBrackets(hint.innerHTML);" +
            "  return false;" +
            "}";
          
          var script = document.createElement("script");
          script.innerHTML = code;
          document.getElementsByTagName("body")[0].appendChild(script);
          var link = document.createElement('a');
          link.setAttribute('href','javascript:void(0);');
          var text = document.createTextNode(""+label.innerHTML);
          link.appendChild(text);
          link.setAttribute('onclick', 'hide_hint();');
          para.previousSibling.previousSibling.appendChild(link);
          para.style.display = 'none';
        }
        hint.style.display = 'none';
        
        // remove hint description
        var decryptKey = document.getElementById('dk');
        if (decryptKey) {
          decryptKey.parentNode.removeChild(decryptKey);
        }      
      }
    }
  }
}catch(e){ gclh_error("Hide Hint",e); }

//show disabled/archived caches with strikeout in title
try{
  if(settings_strike_archived && is_page("cache_listing")){
    var warnings = getElementsByClass('OldWarning');
    if (warnings[0]) {
      var cacheTitle = document.getElementById('ctl00_ContentBody_CacheName');
      if (cacheTitle) {
        var parent = cacheTitle.parentNode;
        if (parent) {
          parent.removeChild(cacheTitle);
          var strike = document.createElement('strike');
          parent.appendChild(strike);
          strike.appendChild(cacheTitle);
        }
      }
    }
  }
}catch(e){ gclh_error("Strike Archived",e); }

//Highlight Usercoords
try{
  if(settings_highlight_usercoords && is_page("cache_listing")){
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = ".myLatLon{ color: #FF0000; }";
    head.appendChild(style);
  }
}catch(e){ gclh_error("Highlight Usercoords",e); }

// Decrypt Hint
try{
  if(settings_decrypt_hint && !settings_hide_hint && is_page("cache_listing")){
    if (document.getElementById('ctl00_ContentBody_EncryptionKey')) {
        if(browser == "chrome"){
            injectPageScript("(function(){ dht(); })()");                
        }
        else{                
      		unsafeWindow.dht(document.getElementById("ctl00_ContentBody_lnkDH"));
        }  
  
      // remove hint description
      var decryptKey = document.getElementById('dk');
      if (decryptKey) {
        decryptKey.parentNode.removeChild(decryptKey);
      }
    }
  }
  if(settings_decrypt_hint && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)){
    if(document.getElementById('uxDecryptedHint')) document.getElementById('uxDecryptedHint').style.display = 'none';
    if(document.getElementById('uxEncryptedHint')) document.getElementById('uxEncryptedHint').style.display = '';
  }
}catch(e){ gclh_error("Decrypt Hint",e); }

// BBCode helper
var bbcode = "";
bbcode += "<a title='Bold' href='javascript:void(0);' onClick='gclh_insert(\"[b]\",\"[/b]\"); return false;' style='color: #000000; text-decoration: none;'><img border='0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADCSURBVCjPY/jPgB8yUEtBeUL5+ZL/Be+z61PXJ7yPnB8sgGFCcX3m/6z9IFbE/JD/XucxFOTWp/5PBivwr/f77/gfQ0F6ffz/aKACXwG3+27/LeZjKEioj/wffN+n3vW8y3+z/Vh8EVEf/N8LLGEy3+K/2nl5ATQF/vW+/x3BCrQF1P7r/hcvQFPgVg+0GWq0zH/N/wL1aAps6x3+64M9J12g8p//PZcCigKbBJP1uvvV9sv3S/YL7+ft51SgelzghgBKWvx6E5D1XwAAAABJRU5ErkJggg=='></a>&nbsp;";
bbcode += "<a title='Italic' href='javascript:void(0);' onClick='gclh_insert(\"[i]\",\"[/i]\"); return false;' style='color: #000000; text-decoration: none;'><img border='0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABxSURBVCjPY/jPgB8yUFtBdkPqh4T/kR+CD+A0Ie5B5P/ABJwmxBiE//f/gMeKkAlB/90W4FHg88Dzv20ATgVeBq7/bT7g8YXjBJf/RgvwKLB4YPFfKwCnAjMH0/8a/3EGlEmD7gG1A/IHJDfQOC4wIQALYP87Y6unEgAAAABJRU5ErkJggg=='></a>&nbsp;";
bbcode += "<a title='Strike' href='javascript:void(0);' onClick='gclh_insert(\"[s]\",\"[/s]\"); return false;' style='color: #000000; text-decoration: none;'><img border='0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACfSURBVCjPY/jPgB8yUFNBiWDBzOy01PKEmZG7sSrIe5dVDqIjygP/Y1GQm5b2P7kDwvbAZkK6S8L/6P8hM32N/zPYu2C1InJ36P/A/x7/bc+YoSooLy3/D4Px/23+SyC5G8kEf0EIbZSmfdfov9wZDCvc0uzLYWyZ/2J3MRTYppn/14eaIvKOvxxDgUma7ju1M/LlkmnC5bwdNIoL7BAAWzr8P9A5d4gAAAAASUVORK5CYII='></a>&nbsp;";
bbcode += "<a title='Underline' href='javascript:void(0);' onClick='gclh_insert(\"[u]\",\"[/u]\"); return false;' style='color: #000000; text-decoration: none;'><img border='0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACjSURBVCjPY/jPgB8yEKmgPKH8ffn/0n4IL3F99P+QAjQTyveX/IexIwWCz2NYUbw/7z/CYK/9GApy92cgKXDEVJC+PxFJgQWmgoT9kUgK9DEVROwPRFKghqnAv9/7v2MAhK3iINePocBNwf69xXlDhf8Myg4y58UUsISkmYL+fI39ivul+0UMSA/q/wza/1X+y/0X/y/0n+c/+3/m/6SbgAsCAM8i/W7eee6fAAAAAElFTkSuQmCC'></a>&nbsp;";
bbcode += "<a title='Link' href='javascript:void(0);' onClick='gclh_insert(\"[url=\"+prompt(\"URL\",\"http://\")+\"]\",\"[/url]\"); return false;'><img border='0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADpSURBVCjPY/jPgB8y0EmBHXdWaeu7ef9rHuaY50jU3J33v/VdVqkdN1SBEZtP18T/L/7f/X/wf+O96kM3f9z9f+T/xP8+XUZsYAWGfsUfrr6L2Ob9J/X/pP+V/1P/e/+J2LbiYfEHQz+ICV1N3yen+3PZf977/9z/Q//X/rf/7M81Ob3pu1EXWIFuZvr7aSVBOx1/uf0PBEK3/46/gnZOK0l/r5sJVqCp6Xu99/2qt+v+T/9f+L8CSK77v+pt73vf65qaYAVqzPYGXvdTvmR/z/4ZHhfunP0p+3vKF6/79gZqzPQLSYoUAABKPQ+kpVV/igAAAABJRU5ErkJggg=='></a>&nbsp;";
bbcode += "<a title='Quote' href='javascript:void(0);' onClick='gclh_insert(\"[quote]\",\"[/quote]\"); return false;'><img border='0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEXSURBVDjLY/j//z8DJZhhmBpg2POQn2wDDDof8HvOe3osYtXzDzCxuM2vP3gvfn4MJIfXAP22e0Ies58eK9r2+r//3Kf3YOIhq17eK9v95j9ITrv2jhBWA/Ra7kVEr375vXDrq/9+s57eUy+4IY0kJx2w6Nk9kFzE0uffgXIRKAboNtxlC1/+/GPljjdABc9+q+ZcM0Z3qmb5LWOQXOmml/8DZz7+qJB0hQ3FBerFNyNC5z/9nrXqxX+Pvgf35OMuSSPJSXtPfXQPJBc089F3oFwE1jBQTLkiZNtw51jq4qf/XVvuwsPAa9Kjexkrnv8HyclFXxTCGwsyERf4LctvHvPuvAePBf8pDz/Y1N45BpIbKUmZFAwAR3nW32nUrY0AAAAASUVORK5CYII='></a>&nbsp;";
bbcode += "&nbsp;";
bbcode += "&nbsp;";
bbcode += "<a title='Left' href='javascript:void(0);' onClick='gclh_insert(\"[left]\",\"[/left]\"); return false;'><img border='0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABjSURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSYU/Ifphej8xbCLEaaAOBNS/yPbjIC3iHZD5P9faHqvk+gGbzQTYD76TLQbbP//hOqE6f5AvBsIRhYAysRMHy5Vf6kAAAAASUVORK5CYII='></a>&nbsp;";
bbcode += "<a title='Center' href='javascript:void(0);' onClick='gclh_insert(\"[center]\",\"[/center]\"); return false;'><img border='0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAB8SURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSYwMORk/54C0w2FOcemgmSIMyH1P7LNCHiLBDcEZ/+agqwXaFbOIxLc4P0f1e7fUPiZGDcw/AdD02z9/5r/Vf7L/Zf8L/Kf/z/3f/ZsiAwjxbEJAKUIVgAswNGVAAAAAElFTkSuQmCC'></a>&nbsp;";
bbcode += "<a title='Right' href='javascript:void(0);' onClick='gclh_insert(\"[right]\",\"[/right]\"); return false;'><img border='0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABjSURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSZAQNL/31CdMHiGaBNS/yPbjIC3SHSD+3+EXoh5z4k2wfs/qt2/ofAziW7Q+v8brhsSrn+IMYFgZAEAE0hMH/VkcbsAAAAASUVORK5CYII='></a>&nbsp;";
bbcode += "&nbsp;";
bbcode += "&nbsp;";
bbcode += "<select style='font-size: 10px;' onChange='gclh_insert(\"[font=\"+this.value+\"]\",\"\"); return false;'>";
bbcode += "  <option style='font-family: Arial;'>Arial</option>";
bbcode += "  <option style='font-family: Arial Black;'>Arial Black</option>";
bbcode += "  <option style='font-family: Comic Sans MS;'>Comic Sans MS</option>";
bbcode += "  <option style='font-family: Impact;'>Impact</option>";
bbcode += "  <option style='font-family: Lucida Console;'>Lucida Console</option>";
bbcode += "  <option style='font-family: Tahoma;'>Tahoma</option>";
bbcode += "  <option style='font-family: Verdana;'>Verdana</option>";
bbcode += "</select>&nbsp;";
bbcode += "<select style='font-size: 10px;' onChange='gclh_insert(\"[\"+ this.value +\"]\",\"[/\"+ this.value +\"]\"); return false;'>";
bbcode += "  <option style='background-color: black; color: white;'>black</option>";
bbcode += "  <option style='background-color: blue; color: white;'>blue</option>";
bbcode += "  <option style='background-color: gold;'>gold</option>";
bbcode += "  <option style='background-color: green; color: white;'>green</option>";
bbcode += "  <option style='background-color: maroon; color: white;'>maroon</option>";
bbcode += "  <option style='background-color: navy; color: white;'>navy</option>";
bbcode += "  <option style='background-color: orange;'>orange</option>";
bbcode += "  <option style='background-color: pink;'>pink</option>";
bbcode += "  <option style='background-color: purple; color: white;'>purple</option>";
bbcode += "  <option style='background-color: red;'>red</option>";
bbcode += "  <option style='background-color: teal; color: white;'>teal</option>";
bbcode += "  <option style='background-color: white;'>white</option>";
bbcode += "  <option style='background-color: yellow;'>yellow</option>";
bbcode += "</select>";

// BBCode helper function
function gclh_add_insert_fkt(id){
  var code = "function gclh_insert(aTag,eTag){"; // http://aktuell.de.selfhtml.org/artikel/javascript/bbcode/
  code += "  var input = document.getElementById('"+id+"');";
  code += "  if(typeof input.selectionStart != 'undefined'){";
  code += "    var start = input.selectionStart;";
  code += "    var end = input.selectionEnd;";
  code += "    var insText = input.value.substring(start, end);";
  code += "    input.value = input.value.substr(0, start) + aTag + insText + eTag + input.value.substr(end);";
  code += "    /* Anpassen der Cursorposition */";
  code += "    var pos;";
  code += "    if (insText.length == 0) {";
  code += "      pos = start + aTag.length;";
  code += "    } else {";
  code += "      pos = start + aTag.length + insText.length + eTag.length;";
  code += "    }";
  code += "    input.selectionStart = pos;";
  code += "    input.selectionEnd = pos;";
  code += "  }";
  code += "  input.focus();";
  code += "}";

  var script = document.createElement("script");
  script.innerHTML = code;
  document.getElementsByTagName("body")[0].appendChild(script);
}

// Show Smilies & BBCode --- http://www.cachewiki.de/wiki/Formatierung
try{
  if(settings_show_bbcode && (document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|LUID|PLogGuid)\=/)) && document.getElementById('litDescrCharCount')){
    // Get finds to replace #found# variable
    finds = get_my_finds();
    if(getElementsByClass('SignedInProfileLink')[0]){
      var me = getElementsByClass('SignedInProfileLink')[0].innerHTML;
    }
  
    gclh_add_insert_fkt("ctl00_ContentBody_LogBookPanel1_uxLogInfo");
  
    var code = "function gclh_insert_from_div(id){";
    code += "  var finds = '"+finds+"';";
    code += "  var me = '"+me+"';";
    code += "  var settings_replace_log_by_last_log = "+settings_replace_log_by_last_log+";";
    code += "  var owner = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;";
    code += "  var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');";
    code += "  var inhalt = document.getElementById(id).innerHTML;";
    code += "  inhalt = inhalt.replace(/\\&amp\\;/g,'&');";
    code += "  if(finds){";
    code += "    inhalt = inhalt.replace(/#found_no#/g,finds);";
    code += "    finds++;";
    code += "    inhalt = inhalt.replace(/#found#/g,finds);";
    code += "  }";
    code += "  if(me){";
    code += "    inhalt = inhalt.replace(/#me#/g,me);";
    code += "  }";
    code += "  if(owner){";
    code += "    inhalt = inhalt.replace(/#owner#/g,owner);";
    code += "  }";
    code += "  if(id.match(/last_log/) && settings_replace_log_by_last_log){";
    code += "    input.value = inhalt;";
    code += "  }else{";
    code += "    if(typeof input.selectionStart != 'undefined' && inhalt){";
    code += "      var start = input.selectionStart;";
    code += "      var end = input.selectionEnd;";
    code += "      var insText = input.value.substring(start, end);";
    code += "      input.value = input.value.substr(0, start) + inhalt + input.value.substr(end);";
    code += "      /* Anpassen der Cursorposition */";
    code += "      var pos;";
    code += "      pos = start + inhalt.length;";
    code += "      input.selectionStart = pos;";
    code += "      input.selectionEnd = pos;";
    code += "    }";
    code += "  }";
    code += "  input.focus();";
    code += "}";
  
    var script = document.createElement("script");
    script.innerHTML = code;
    document.getElementsByTagName("body")[0].appendChild(script);
  
    var box = document.getElementById('litDescrCharCount');
    var liste = "<br><p style='margin: 5px;'>";
    liste += "<a href='#' onClick='gclh_insert(\"[:)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[:D]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_big.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[8D]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_cool.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[:I]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_blush.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[:P]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_tongue.gif' border='0'></a>";
    liste += "</p><p style='margin: 5px;'>";
    liste += "<a href='#' onClick='gclh_insert(\"[}:)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_evil.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[;)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_wink.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[:o)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_clown.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[B)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_blackeye.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[8]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_8ball.gif' border='0'></a>";
    liste += "</p><p style='margin: 5px;'>";
    liste += "<a href='#' onClick='gclh_insert(\"[:(]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_sad.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[8)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_shy.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[:O]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_shock.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[:(!]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_angry.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[xx(]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_dead.gif' border='0'></a>";
    liste += "</p><p style='margin: 5px;'>";
    liste += "<a href='#' onClick='gclh_insert(\"[|)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_sleepy.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[:X]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_kisses.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[^]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_approve.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[V]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_dissapprove.gif' border='0'></a>&nbsp;&nbsp;";
    liste += "<a href='#' onClick='gclh_insert(\"[?]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_question.gif' border='0'></a>";
    liste += "</p><br>";
    liste += "Templates:<br>";
    for(var i = 0; i < anzTemplates; i++){
      if(GM_getValue("settings_log_template_name["+i+"]","") != ""){
        liste += "<div id='gclh_template["+i+"]' style='display: none;'>"+GM_getValue("settings_log_template["+i+"]","")+"</div>";
        liste += "<a href='#' onClick='gclh_insert_from_div(\"gclh_template["+i+"]\"); return false;' style='color: #000000; text-decoration: none; font-weight: normal;'> - "+GM_getValue("settings_log_template_name["+i+"]","")+"</a><br>";
      }
    }
    if(GM_getValue("last_logtext","") != ""){
      liste += "<div id='gclh_template[last_log]' style='display: none;'>"+GM_getValue("last_logtext","")+"</div>";
      liste += "<a href='#' onClick='gclh_insert_from_div(\"gclh_template[last_log]\"); return false;' style='color: #000000; text-decoration: none; font-weight: normal;'> - [Last Cache-Log]</a><br>";
    }
    box.innerHTML = liste;
  
    // BBCode
    var bbc_dt = document.createElement("dt");
    var bbc_dd = document.createElement("dd");
    bbc_dt.innerHTML = "BBCode:";
    bbc_dd.innerHTML = bbcode;
    box.parentNode.parentNode.insertBefore(bbc_dt,box.parentNode);
    box.parentNode.parentNode.insertBefore(bbc_dd,box.parentNode);
  }
}catch(e){ gclh_error("Show Smilies & BBCode",e); }

// Show BBCode in Listing-Editor
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/hide\/report\.aspx/) && document.getElementById("chkIsHtml") && !document.getElementById("chkIsHtml").checked){
    gclh_add_insert_fkt("tbLongDesc");
  
    var textarea = document.getElementById("tbLongDesc");
    var bbc_dd = document.createElement("dd");
    bbc_dd.innerHTML = bbcode;
    textarea.parentNode.insertBefore(bbc_dd,textarea);
  }
}catch(e){ gclh_error("Show BBCode (Listing-Editor)",e); }

//Maxlength of Logtext and unsaved warning
try{
  if((document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|LUID|PLogGuid)\=/)) && document.getElementById('litDescrCharCount')){
    var changed = false;

    function limitLogText(limitField) {
      changed = true; // Logtext hat sich geaendert - Warnung beim Seite verlassen
      // aus gc.com Funktion "checkLogInfoLength"
      var editor = $('#ctl00_ContentBody_LogBookPanel1_uxLogInfo');
      var limitNum = parseInt($('#ctl00_ContentBody_LogBookPanel1_uxLogInfo').attr("CKEMaxLength"));
      var length = editor.val().replace(/\n/g, "\r\n").length;
      var diff = length - editor.val().length;
      if (length > limitNum) {
        limitField.value = limitField.value.substring(0, (limitNum - diff));
        counterelement.innerHTML = '<font color="red">' + length + '/' + limitNum  + '</font>';
        limitField.scrollTop = limitField.scrollHeight;
        limitField.selectionStart = 4000;
        limitField.selectionEnd = 4000;
      }else{
        counterelement.innerHTML = length + '/' + limitNum;
      }
    }

    // Meldung bei ungespeichertem Log
    window.onbeforeunload = function (){
      if(changed){
        return "You have changed a log and haven't saved it yet - Do you want to leave this page and lose your changes?"; // Text wird nicht angezeigt bei FF sondern deren default
      }
    }
    document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog").addEventListener("click",function(){ changed = false; },false); // Damit die Meldung nicht beim Submit kommt
  
    var logfield = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');
    logfield.addEventListener("keyup", function(){ limitLogText(logfield); }, false);
    logfield.addEventListener("change", function(){ limitLogText(logfield); }, false);
  
    var counterpos = document.getElementById('litDescrCharCount').parentNode;
    var counterspan = document.createElement('p');
    counterspan.id = "logtextcounter";
    counterspan.innerHTML = "<b>Loglength:</b><br />";
    var counterelement = document.createElement('span');
    counterelement.innerHTML = "0/4000";
    counterspan.appendChild(counterelement);
    counterpos.appendChild(counterspan);
  }
}catch(e){ gclh_error("Maxlength of Logtext and unsaved warning",e); }

// Show Eventday beside Date
try{
  if(settings_show_eventday && is_page("cache_listing") && document.getElementById('cacheDetails') && document.getElementById('cacheDetails').getElementsByTagName("img")[0].src.match(/.*\/images\/WptTypes\/(6|453|13).gif/)){ //Event, MegaEvent, Cito
    if(document.getElementById('cacheDetails').getElementsByTagName("span")){
      var spanelem = document.getElementById("ctl00_ContentBody_mcd2");
      var datetxt = spanelem.innerHTML.substr(spanelem.innerHTML.indexOf(":") + 2).replace( /^\s+|\s+$/g, '' );
      var month_names = new Object();
      month_names["Jan"] = 1; 
      month_names["Feb"] = 2; 
      month_names["Mrz"] = 3; 
      month_names["Mar"] = 3; 
      month_names["Apr"] = 4; 
      month_names["May"] = 5; 
      month_names["Jun"] = 6; 
      month_names["Jul"] = 7; 
      month_names["Aug"] = 8; 
      month_names["Sep"] = 9; 
      month_names["Oct"] = 10; 
      month_names["Nov"] = 11; 
      month_names["Dec"] = 12;
      // settings_date_format:
      //   yyyy-MM-dd
      //   yyyy/MM/dd
      //   MM/dd/yyyy
      //   dd/MM/yyyy
      //   dd/MMM/yyyy
      //   MMM/dd/yyyy
      //   dd MMM yy
      var day = 0;
      var month = 0;
      var year = 0;
      switch(settings_date_format){
        case "yyyy-MM-dd":
          var match = datetxt.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/);
          if(match){
            day = match[3];
            month = match[2];
            year = match[1];
          }
        break;
        case "yyyy/MM/dd":
          var match = datetxt.match(/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/);
          if(match){
            day = match[3];
            month = match[2];
            year = match[1];
          }
        break;
        case "MM/dd/yyyy":
          var match = datetxt.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/);
          if(match){
            day = match[2];
            month = match[1];
            year = match[3];
          }
        break;
        case "dd/MM/yyyy":
          var match = datetxt.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/);
          if(match){
            day = match[1];
            month = match[2];
            year = match[3];
          }
        break;
        case "dd/MMM/yyyy":
          var match = datetxt.match(/([0-9]{2})\/([A-Za-z]{3})\/([0-9]{4})/);
          if(match){
            day = match[1];
            month = month_names[match[2]];
            year = match[3];
          }
        break;
        case "MMM/dd/yyyy":
          var match = datetxt.match(/([A-Za-z]{3})\/([0-9]{2})\/([0-9]{4})/);
          if(match){
            day = match[2];
            month = month_names[match[1]];
            year = match[3];
          }
        break;
        case "dd MMM yy":
          var match = datetxt.match(/([0-9]{2}) ([A-Za-z]{3}) ([0-9]{2})/);
          if(match){
            day = match[1];
            month = month_names[match[2]];
            year = parseInt(match[3])+2000;
          }
        break;
      }
      
      if(month != 0) month--;
      var d=new Date(year,month,day);
  //alert(uneval(match)+"-"+day+"."+month+"."+year+"-"+d+"-"+d.getDay());
      if(d != "Invalid Date" && !(day == 0 && month == 0 && year == 0)){
        var weekday=new Array(7);
        weekday[0]="Sunday";
        weekday[1]="Monday";
        weekday[2]="Tuesday";
        weekday[3]="Wednesday";
        weekday[4]="Thursday";
        weekday[5]="Friday";
        weekday[6]="Saturday";
        var text = " (" + weekday[d.getDay()] + ") ";
      }else var text = " (date format mismatch - see settings) ";
      var text_elem = document.createTextNode(text);
      spanelem.insertBefore(text_elem,spanelem.childNodes[1]);
    }
  }
}catch(e){ gclh_error("Show DoW on Events",e); }

// Show Datepicker beside Date on Log-Page
try{
  if(settings_show_datepicker && document.location.href.match(/^http:\/\/www\.geocaching\.com\/(seek\/log|track\/log)\.aspx(\?)(id|ID|LUID|wid|WID)\=[a-zA-Z0-9-]*.*/)){  
    var dpinput = document.createElement("input");
    dpinput.id="selectedPicker";
    dpinput.type="hidden";
    if(document.getElementById("ctl00_ContentBody_LogBookPanel1_DateTimeLogged")){
      document.getElementById("ctl00_ContentBody_LogBookPanel1_DateTimeLogged").parentNode.appendChild(dpinput);
  
      // Update three select controls to match a datepicker selection    
      var code = 'function updateSelected(date) {';
      code += '  var dateform = $.datepicker.parseDate("m/d/yy", date);';
      code += '  $("#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Month option[value=\'" + (dateform.getMonth() + 1) + "\']").attr("selected",true);';
      code += '  $("#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Day option[value=\'" + dateform.getDate() + "\']").attr("selected",true);';
      code += '  $("#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Year option[value=\'" + dateform.getFullYear() + "\']").attr("selected",true);';
      //Function of GC.com, do not know what it really does, but let us just trigger it
      code += '  ChangeOptionDays("ctl00_ContentBody_LogBookPanel1_DateTimeLogged","yyyy-MM-dd");';
      code += '}';
      // Update datepicker from three select controls
      code += '$("#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Month,#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Day,#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Year").change(function() {';
      code += '  $( "#selectedPicker" ).val($("#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Month").val() + "/" + $("#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Day").val() + "/" + $("#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Year").val());';
      code += '});';
      //initialize datepicker
      code += 'function initDatPick(){';
      code += '  $( "#selectedPicker" ).val($("#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Month").val() + "/" + $("#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Day").val() + "/" + $("#ctl00_ContentBody_LogBookPanel1_DateTimeLogged_Year").val());';
      code += '  $( "#selectedPicker" ).datepicker({';
      code += '    onSelect: updateSelected,';
      code += '    showOn: "button",';
      code += '    buttonImage: "data:image/png;base64,R0lGODlhEAAPAPQAAIyq7zlx3lqK5zFpznOe7/729fvh3/3y8e1lXt1jXO5tZe9zbLxeWfB6c6lbV/GDffKIgvKNh/OYkvSblvSinfWrp3dTUfawq/e1sf3r6v/8/P/9/f///////wAAAAAAACH5BAEAAB0ALAAAAAAQAA8AAAWK4GWJpDWN6KU8nNK+bsIxs3FdVUVRUhQ9wMUCgbhkjshbbkkpKnWSqC84rHA4kmsWu9lICgWHlQO5lsldSMEgrkAaknccQBAE4mKtfkPQaAIZFw4TZmZdAhoHAxkYg25wchABAQMDeIRYHF5gEkcSBo2YEGlgEEcQoI4SDRWrrayrFxCDDrW2t7ghADs=",';
      code += '    buttonImageOnly: true';
      code += '   });';
      code += '};';
      
      var script = document.createElement("script");
      script.innerHTML = code;
      document.getElementsByTagName("body")[0].appendChild(script);
      unsafeWindow.initDatPick();
    }
  }
}catch(e){ gclh_error("DatePicker on Logging",e); }

// Show eMail-Link beside Username
try{
  if(settings_show_mail && (is_page("cache_listing") || document.location.href.match(/^http:\/\/www\.geocaching\.com\/(seek\/log|track\/details|track\/log)\.aspx(\?|\?pf\=\&)(guid|wp|tracker|id|LUID|ID|PLogGuid)\=[a-zA-Z0-9-]*/))){
    var links = document.getElementsByTagName('a');

    // Name des Caches herausfinden
    if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?.*/)){
      var name = ""; 
      var image = true;
      for(var i=0; i<links.length; i++){
        if(is_link("cache_listing",links[i].href)){
          if(image){
            image = false;  // First hit is an Image
          }else{
            if(links[i].getElementsByTagName('span')[0] !== undefined){
              name = links[i].getElementsByTagName('span')[0].innerHTML;
            }else{
              name = links[i].innerHTML
            }
          }
        }
      }
    }else if(document.getElementById('ctl00_ContentBody_CacheName')){
      var name = document.getElementById('ctl00_ContentBody_CacheName').innerHTML;
      if(document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode')){
        name += " ( ";
        if(settings_show_mail_coordslink)name += "http://coord.info/";
        name += document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').innerHTML+" )";
      }
    }else if(document.getElementById('ctl00_ContentBody_lbHeading') && !document.location.href.match(/^http:\/\/www\.geocaching\.com\/(seek|track)\/log\.aspx\?.*/)){
      var name = document.getElementById('ctl00_ContentBody_lbHeading').innerHTML;
      if(document.getElementById('ctl00_ContentBody_BugDetails_BugTBNum') && document.getElementById('ctl00_ContentBody_BugDetails_BugTBNum').getElementsByTagName('strong')){
        var tbnr = document.getElementById('ctl00_ContentBody_BugDetails_BugTBNum').getElementsByTagName('strong')[0]; 
        if(tbnr != ""){
          name += " ( ";
          if(settings_show_mail_coordslink)name += "http://coord.info/";
          name += tbnr.innerHTML + " )";
        }
      }
    }else if(document.getElementById('ctl00_ContentBody_LogBookPanel1_lbLogText')){
      var name = "";
      try {
        name = document.getElementById('ctl00_ContentBody_LogBookPanel1_lbLogText').childNodes[4].innerHTML;
      } catch(e) {}
    }else var name = ""; 
  
    // Link hinzufuegen
    for(var i=0; i<links.length; i++){
      if(links[i].href.match(/http:\/\/www\.geocaching\.com\/profile\/\?guid=/) && links[i].parentNode.className != "logOwnerStats" && !links[i].childNodes[0].src){
        var guid = links[i].href.match(/http:\/\/www\.geocaching\.com\/profile\/\?guid=(.*)/);
        guid = guid[1];

        var username = links[i].innerHTML;
  
        var mail_link = document.createElement("a");
        var mail_img = document.createElement("img");
        mail_img.setAttribute("border","0");
        mail_img.setAttribute("title","Send a mail to this user");
        mail_img.setAttribute("src",global_mail_icon);
        mail_link.appendChild(mail_img);
        mail_link.setAttribute("href","http://www.geocaching.com/email/?guid="+guid+"&text=Hi "+username+",%0A%0A"+name);
  
//        links[i].parentNode.appendChild(document.createTextNode("   "));
//        links[i].parentNode.appendChild(mail_link);
        links[i].parentNode.insertBefore(mail_link,links[i].nextSibling);
        links[i].parentNode.insertBefore(document.createTextNode("   "),links[i].nextSibling);
      }
    }
    
    var global_cache_name = name;
  }
}catch(e){ gclh_error("Show Mail-Icon",e); }

// Switch title-color to red, if cache is archived & rename the gallery-link to prevent destroying the layout on to many images
try{
  if(is_page("cache_listing")){
  
    if(document.getElementById("ctl00_ContentBody_uxGalleryImagesLink")) document.getElementById("ctl00_ContentBody_uxGalleryImagesLink").innerHTML = document.getElementById("ctl00_ContentBody_uxGalleryImagesLink").innerHTML.replace("View the ","");
  
    var warnings = getElementsByClass("OldWarning");
    for(var i=0; i<warnings.length; i++){
      if(warnings[i].innerHTML.match(/(archived|archiviert)/)){
        if(document.getElementById("ctl00_ContentBody_CacheName")) document.getElementById("ctl00_ContentBody_CacheName").parentNode.style.color = '#8C0B0B';
        break;
      }
    }
  }
}catch(e){ gclh_error("Switch title-color",e); }

// Improve EMail-Site
try{
  if(settings_show_mail && document.location.href.match(/^http:\/\/www\.geocaching\.com\/email\//) && document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage")){
    // Prevent deleting content
    document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage").setAttribute("onfocus","");
  
    // Default settings
    document.getElementById("ctl00_ContentBody_SendMessagePanel1_chkSendAddress").checked = GM_getValue("email_sendaddress","checked");
    document.getElementById("ctl00_ContentBody_SendMessagePanel1_chkEmailCopy").checked = GM_getValue("email_mailcopy","checked");
  
    function chgDefaultSendaddress(){
      GM_setValue("email_sendaddress",document.getElementById("ctl00_ContentBody_SendMessagePanel1_chkSendAddress").checked);
    }
  
    function chgDefaultMailcopy(){
      GM_setValue("email_mailcopy",document.getElementById("ctl00_ContentBody_SendMessagePanel1_chkEmailCopy").checked);
    }
  
    document.getElementById('ctl00_ContentBody_SendMessagePanel1_chkSendAddress').addEventListener("click", chgDefaultSendaddress, false);
    document.getElementById('ctl00_ContentBody_SendMessagePanel1_chkEmailCopy').addEventListener("click", chgDefaultMailcopy, false);
    
    // Grab Text from URL
    var matches = document.location.href.match(/&text=(.*)/);
    if(matches) document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage").innerHTML = decodeURIComponent(matches[1]);
    
    // Add Mail-Signature
    if(typeof(GM_getValue("settings_mail_signature")) != "undefined" && GM_getValue("settings_mail_signature") != ""){
      var me = "#me#";
      if(getElementsByClass("SignedInProfileLink")[0]) me = getElementsByClass("SignedInProfileLink")[0].innerHTML;
      document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage").innerHTML += "\n\n"+GM_getValue("settings_mail_signature").replace(/#me#/g,me);
    }
  }
}catch(e){ gclh_error("Improve E-Mail-Site",e); }

// Default Log Type && Log Signature
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|PLogGuid|wp)\=/) && document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType')){
    if(!document.location.href.match(/\&LogType\=/) && !document.location.href.match(/PLogGuid/)){
      var cache_type = document.getElementById("ctl00_ContentBody_LogBookPanel1_WaypointLink").nextSibling.childNodes[0].title;
      var select_val = "-1";

      if(cache_type.match(/event/i)) select_val = settings_default_logtype_event;
      else select_val = settings_default_logtype;

      var select = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
      var childs = select.children;
  
      if(select.value == "-1"){
        for(var i=0; i<childs.length; i++){
          if(childs[i].value == select_val){
	    	select.selectedIndex=i;
          }
        }
      }
    }
  
    // Signature
//    if(document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML == ""){
    if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?PLogGuid\=/)){
      if(settings_log_signature_on_fieldnotes) document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML += GM_getValue("settings_log_signature","");
    }else{
      document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML += GM_getValue("settings_log_signature","");
    }
//    }
  
    // Set Cursor to Pos1
    function gclh_setFocus(){
      var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');
      if(input){
        try {
          input.selectionStart = 0;
          input.selectionEnd = 0;
          input.focus();
        }
        catch (e) {
          // TODO: according to Google this exception occurs if the text field is not visible,
          // but I have no clue what exactly is wrong here 
        }
      }
    }
    window.addEventListener("load", gclh_setFocus, false);
  
    // Replace #found# variable
    if(getElementsByClass('SignedInText')[0]){
      var finds = get_my_finds();
      var me = getElementsByClass('SignedInProfileLink')[0].innerHTML;
      var owner = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
      document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found_no#/g,finds);
      finds++;
      document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found#/g,finds);
      document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#me#/g,me);
      document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#owner#/g,owner);
    }
  }
}catch(e){ gclh_error("Default Log-Type & Signature (CACHE)",e); }

// Default TB Log Type && Log Signature
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/log\.aspx/)){
    if(settings_default_tb_logtype != "-1" && !document.location.href.match(/\&LogType\=/)){
      var select = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
      var childs = select.children;
  
      for(var i=0; i<childs.length; i++){
        if(childs[i].value == settings_default_tb_logtype){
          select.selectedIndex=i;
        }
      }
    }
  
    // Signature
    if(document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo') && document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML == "") document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = GM_getValue("settings_tb_signature","");
  
    // Set Cursor to Pos1
    function gclh_setFocus(){
      var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');
      if(input){
        try {
          input.selectionStart = 0;
          input.selectionEnd = 0;
          input.focus();
        } catch (e) {
          // TODO: according to Google this exception occurs if the text field is not visible,
          // but I have no clue what exactly is wrong here 
        }
      }
    }
    window.addEventListener("load", gclh_setFocus, false);
  
    // Replace #found# variable
    if(getElementsByClass('SignedInText')[0] && document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo')){
      var finds = get_my_finds();
      var me = getElementsByClass('SignedInProfileLink')[0].innerHTML;
      var owner = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
      document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found_no#/g,finds);
      finds++;
      document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found#/g,finds);
      document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#me#/g,me);
      document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#owner#/g,owner);
    }
  }
}catch(e){ gclh_error("Default Log-Type und Signature (TB)",e); }

// Show Coin-series in TB-Listing
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/details\.aspx/)){
    var dl = getElementsByClass('BugDetailsList')[0];
  
    if(dl){
      if(document.getElementById("ctl00_ContentBody_BugTypeImage") && document.getElementById("ctl00_ContentBody_BugTypeImage").alt){
        dl.innerHTML += "<dt>Series:</dt><dd>"+document.getElementById("ctl00_ContentBody_BugTypeImage").alt+"</dd>";
      }
    }
  }
}catch(e){ gclh_error("Show Coin Series",e); }

// Improve Friendlist
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/myfriends\.aspx/)){
    var friends = getElementsByClass("FriendText");
    var day = new Date().getDate();
    var last_check = parseInt(GM_getValue("friends_founds_last","0"),10);
  
    if(settings_automatic_friend_reset && last_check != day){
      for(var i=0; i<friends.length; i++){
        var friend = friends[i];
        var name = friend.getElementsByTagName("a")[0];
  
       //Founds
        if(GM_getValue("friends_founds_new_"+name.innerHTML)){
          GM_setValue("friends_founds_"+name.innerHTML,GM_getValue("friends_founds_new_"+name.innerHTML));
        }
        
        //Hides
        if(GM_getValue("friends_hides_new_"+name.innerHTML)){
          GM_setValue("friends_hides_"+name.innerHTML,GM_getValue("friends_hides_new_"+name.innerHTML));
        }
      }  
      GM_setValue("friends_founds_last",day);
    }
    
    for(var i=0; i<friends.length; i++){
      var friend = friends[i];
      var name = friend.getElementsByTagName("a")[0];
      var add = "";
      
      //founds
      var founds = parseInt(trim(friend.getElementsByTagName("dd")[4].innerHTML).replace(/[,.]*/g,""));
      if(isNaN(founds))founds = 0;
      var last_founds = GM_getValue("friends_founds_"+name.innerHTML);
  
      if(typeof(last_founds) == "undefined") last_founds = founds;
      if((founds - last_founds) > 0) add = " <font color='#00AA00'><b>(+"+(founds - last_founds)+")</b></font>";
      GM_setValue("friends_founds_new_"+name.innerHTML,""+founds);
      if(founds == 0){
        friend.getElementsByTagName("dd")[4].innerHTML = founds+"&nbsp;";
      }else{
        friend.getElementsByTagName("dd")[4].innerHTML = "<a href='/seek/nearest.aspx?ul="+urlencode(name.innerHTML)+"&disable_redirect'>"+founds+"</a>&nbsp;"+add;
      }
      
      
      //hides
      add = "";
      var hides = parseInt(trim(friend.getElementsByTagName("dd")[5].innerHTML).replace(/[,.]*/g,""));
      if(isNaN(hides))hides = 0;
      var last_hides = GM_getValue("friends_hides_"+name.innerHTML);
      
      if(typeof(last_hides) == "undefined") last_hides = hides;
      if((hides - last_hides) > 0) add = " <font color='#00AA00'><b>(+"+(hides - last_hides)+")</b></font>";
      GM_setValue("friends_hides_new_"+name.innerHTML,""+hides);
      if(hides == 0){
        friend.getElementsByTagName("dd")[5].innerHTML = hides+"&nbsp;";
      }else{
        friend.getElementsByTagName("dd")[5].innerHTML = "<a href='/seek/nearest.aspx?u="+urlencode(name.innerHTML)+"&disable_redirect'>"+hides+"</a>&nbsp;"+add;
      }
      
      
      //Location
      var friendlocation = trim(friend.getElementsByTagName("dd")[3].getElementsByTagName("span")[0].innerHTML);
      if(friendlocation != "" && friendlocation.length > 3){
         friend.getElementsByTagName("dd")[3].getElementsByTagName("span")[0].innerHTML = "<a href='http://maps.google.de/?q="+(friendlocation.replace(/&/g,""))+"' target='_blank'>"+friendlocation+"</a>";
      }
      
  
      //bottom line
      friend.getElementsByTagName("p")[0].innerHTML = "<a name='lnk_profilegallery2' href='"+name.href+"'>Gallery</a> | "+friend.getElementsByTagName("p")[0].innerHTML;
    }
  
    function gclh_reset_counter(){
      var friends = getElementsByClass("FriendText");
    
      for(var i=0; i<friends.length; i++){
        var friend = friends[i];
        var name = friend.getElementsByTagName("a")[0];
        var founds = 0;
        var hides = 0;
  
        founds = GM_getValue("friends_founds_new_"+name.innerHTML,0);
        GM_setValue("friends_founds_"+name.innerHTML,founds);
        if(founds == 0) friend.getElementsByTagName("dd")[4].innerHTML = "0&nbsp;";
        else friend.getElementsByTagName("dd")[4].innerHTML = "<a href='/seek/nearest.aspx?ul="+urlencode(name.innerHTML)+"&disable_redirect'>"+founds+"</a>";
  
        hides = GM_getValue("friends_hides_new_"+name.innerHTML,0);
        GM_setValue("friends_hides_"+name.innerHTML,hides);
        if(hides == 0) friend.getElementsByTagName("dd")[5].innerHTML = "0&nbsp;";
        else friend.getElementsByTagName("dd")[5].innerHTML = "<a href='/seek/nearest.aspx?u="+urlencode(name.innerHTML)+"&disable_redirect'>"+hides+"</a>&nbsp;";
      }
    }
  
    var button = document.createElement("input");
    button.setAttribute("type","button");
    button.setAttribute("value","Reset counter");
    button.addEventListener("click", gclh_reset_counter, false);
  
    document.getElementById('ctl00_ContentBody_FindUserPanel1_GetUsers').parentNode.insertBefore(button,document.getElementById('ctl00_ContentBody_FindUserPanel1_GetUsers').nextSibling);
  }
}catch(e){ gclh_error("Improve Friendlist",e); }

// Show Google-Maps Link on Cache Page
try{
  if(settings_show_google_maps && is_page("cache_listing") && document.getElementById("ctl00_ContentBody_uxViewLargerMap") && document.getElementById("uxLatLon") && document.getElementById("ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode")){
    var ref_link = document.getElementById("ctl00_ContentBody_uxViewLargerMap");
    var box = ref_link.parentNode;
      
    box.appendChild(document.createElement("br"));
    
    var link = document.createElement("a");
    link.setAttribute("class","lnk");
    link.setAttribute("target","_blank");
    link.setAttribute("title","Show area at Google Maps");
    link.setAttribute("href","http://maps.google.com/maps?q="+document.getElementById("uxLatLon").innerHTML+" ("+document.getElementById("ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode").innerHTML+")");
    
    var img = document.createElement("img");
    img.setAttribute("src","/images/silk/map_go.png");
    link.appendChild(img);
    
    link.appendChild(document.createTextNode(" "));
    
    var span = document.createElement("span");
    span.appendChild(document.createTextNode("Show area on Google Maps"));
    link.appendChild(span);
    
    box.appendChild(link);
  }
}catch(e){ gclh_error("Show google maps link",e); }

// Show "Log It"-Button
try{
  if(settings_show_log_it && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)){
    var links = document.getElementsByTagName("a");
    
    for(var i=0; i<links.length; i++){
      if(links[i].href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?.*/) && links[i].innerHTML.match(/^<span>/)){
        links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>","<a title='Log it' href='"+links[i].href.replace("cache_details","log")+"'><img src='/images/stockholm/16x16/add_comment.gif'></a><br>");
      }else if(links[i].href.match(/^http:\/\/www\.geocaching\.com\/geocache\/.*/) && links[i].innerHTML.match(/^<span>/)){
        var match = links[i].href.match(/^http:\/\/www\.geocaching\.com\/geocache\/([^_]*)/);
        links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>","<a title='Log it' href='http://www.geocaching.com/seek/log.aspx?wp="+match[1]+"'><img src='/images/stockholm/16x16/add_comment.gif'></a><br>");
      }
    }
  }
}catch(e){ gclh_error("Log It Button",e); }

//Show Profile-Link on display of Caches found or created by user
try{
  if(settings_show_nearestuser_profil_link && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/nearest\.aspx/) && document.location.href.match(/(ul|u)=/)){
    if(document.getElementById("ctl00_ContentBody_LocationPanel1_OriginLabel")){
      var textelement = document.getElementById("ctl00_ContentBody_LocationPanel1_OriginLabel");
      textelement.innerHTML += " (";
      var linkelement = document.createElement("a");
      var urluser = document.location.href.match(/(ul|u)=(.*)/);
      linkelement.href = "/profile/?u=" + urluser[2].replace("&sc=n", "");
      linkelement.innerHTML = "Profil";
      textelement.appendChild(linkelement);
      textelement.innerHTML += ")";
    }
  }
}catch(e){ gclh_error("Show Profile Link",e); }

// Improve Bookmark-List
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/bookmarks\/view\.aspx\?guid=/)){
    var box = document.getElementById("ctl00_ContentBody_lbHeading").parentNode.parentNode.parentNode;
    var matches = document.location.href.match(/guid=([a-zA-Z0-9-]*)/);
    var uuid = matches[1];
    
    box.childNodes[3].innerHTML += "<br><a title=\"Download as kml\" href='http://www.geocaching.com/kml/bmkml.aspx?bmguid="+uuid+"'>Download as kml</a><br><a title=\"Show in google maps\" href='http://maps.google.com/?q=http://www.geocaching.com/kml/bmkml.aspx?bmguid="+uuid+"' target='_blank'>Show in google maps</a>";
  }
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/bookmarks\/default\.aspx/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/lists\.aspx/)){
    var links = document.getElementsByTagName("a");
    
    for(var i=0; i<links.length; i++){
      if(links[i].title == "Download Google Earth KML"){
  
        var matches = links[i].href.match(/guid=([a-zA-Z0-9-]*)/);
        links[i].parentNode.innerHTML += "<br><a title='Show in google maps' href='http://maps.google.com/?q=http://www.geocaching.com/kml/bmkml.aspx?bmguid="+matches[1]+"' target='_blank'>Show in google maps</a>";
      }
    }
  }
}catch(e){ gclh_error("Improve Bookmark-List",e); }

// Improve "My Profile"
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/my/)){
    var code = "function hide_box(i){";
    code += "  if(document.getElementById('box_'+i).style.display == 'none'){";
    code += "    document.getElementById('box_'+i).style.display = 'block';";
    code += "    document.getElementById('lnk_'+i).src = 'http://www.geocaching.com/images/minus.gif';";
    code += "    document.getElementById('lnk_'+i).title = 'hide';";
    code += "  }else{";
    code += "    document.getElementById('box_'+i).style.display = 'none';";
    code += "    document.getElementById('lnk_'+i).src = 'http://www.geocaching.com/images/plus.gif';";
    code += "    document.getElementById('lnk_'+i).title = 'show';";
    code += "  }";
    code += "}";
  
    if(GM_getValue("show_box[0]","" == "none")) GM_setValue("show_box[0]","block"); // Bugfix: First Box was hidden because of the temporary "+" beside Linklist
    
    var script = document.createElement("script");
    script.innerHTML = code;
    document.getElementsByTagName("body")[0].appendChild(script);
  
    var boxes = getElementsByClass("WidgetHeader");
    function saveStates(){
      for(var i=1; i<boxes.length; i++){
        var box = boxes[i].parentNode.childNodes[3];
      
        if(boxes[i].innerHTML.match(/Bookmarks/)) continue;
      
        if(typeof(box) == "undefined") continue;
        
        var show = box.style.display;
        if(typeof(show) == "undefined" || show != "none") show = "block";
        
        GM_setValue("show_box["+i+"]",show);
      }
    }
    
    for(var i=1; i<boxes.length; i++){
      var box = boxes[i].parentNode.childNodes[3];
      if(typeof(box) != "undefined"){
        if(boxes[i].innerHTML.match(/Bookmarks/)) continue;
      
        box.setAttribute("id","box_"+i);
       
        if(typeof(GM_getValue("show_box["+i+"]")) != "undefined") box.style.display = GM_getValue("show_box["+i+"]");
      
        if(box.style.display == "none")
          boxes[i].innerHTML = "<img id='lnk_"+i+"' src='http://www.geocaching.com/images/plus.gif' onClick='hide_box(\""+i+"\");' title='show'> "+boxes[i].innerHTML;
        else
          boxes[i].innerHTML = "<img id='lnk_"+i+"' src='http://www.geocaching.com/images/minus.gif' onClick='hide_box(\""+i+"\");' title='hide'> "+boxes[i].innerHTML;
        
        document.getElementById("lnk_"+i).addEventListener("click",saveStates,false);
      }
    }
  }
}catch(e){ gclh_error("Improve MyProfile",e); }

// Hide Map Header
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\//)){
    if(settings_hide_map_header){
      // ... by default
      hide_map_header();
    }

    // ... with button in sidebar
    var sidebar = document.getElementById("searchtabs");
    var link = document.createElement("a");

    link.appendChild(document.createTextNode("Hide/Show Header"));
    link.href = "#";
    link.addEventListener("click",hide_map_header,false);

    sidebar.setAttribute("style","height: 58px !important"); // default: 56px
    sidebar.appendChild(link);
  }
}catch(e){ gclh_error("Hide Map Header",e); }

// Map-Layers
var all_map_layers = new Object();
// gc.com Default-Layers
all_map_layers["OpenStreetMap Default"] = {tileUrl:"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'};
all_map_layers["OpenStreetMap German Style"] = {tileUrl:"http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'};
all_map_layers["OpenStreetMap Black and White"] = {tileUrl:"http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png",attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'};

all_map_layers["Thunderforest OpenCycleMap"] = {tileUrl:"http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'};
all_map_layers["Thunderforest Transport"] = {tileUrl:"http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png",attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'};
all_map_layers["Thunderforest Landscape"] = {tileUrl:"http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png",attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'};

all_map_layers["MapQuest OSM"] = {tileUrl:"http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg",attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data {attribution.OpenStreetMap}',subdomains: "1234"};
all_map_layers["MapQuest Aerial"] = {tileUrl:"http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg",attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; ' + "Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency",subdomains: "1234"};

all_map_layers["Stamen Toner"] = {tileUrl:"http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png",attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + "Map data {attribution.OpenStreetMap}",subdomains: "abcd",minZoom: 0,maxZoom: 20};
all_map_layers["Stamen Terrain"] = {tileUrl:"http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png",attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + "Map data {attribution.OpenStreetMap}",subdomains: "abcd",minZoom: 4,maxZoom: 18};
all_map_layers["Stamen Watercolor"] = {tileUrl:"http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png",attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + "Map data {attribution.OpenStreetMap}",subdomains: "abcd",minZoom: 3,maxZoom: 16};

all_map_layers["Esri WorldStreetMap"] = {tileUrl:"http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",attribution: "Tiles &copy; Esri"};
all_map_layers["Esri DeLorme"] = {tileUrl:"http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}",attribution: "Tiles &copy; Esri &mdash; Copyright: \u00a92012 DeLorme",maxZoom: 11};
all_map_layers["Esri WorldTopoMap"] = {tileUrl:"http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"};
all_map_layers["Esri WorldImagery"] = {tileUrl:"http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"};
all_map_layers["Esri OceanBasemap"] = {tileUrl:"http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",attribution: "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",maxZoom: 11};
all_map_layers["Esri NatGeoWorldMap"] = {tileUrl:"http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",attribution: "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC"};

// GClh additional Layers
all_map_layers["OpenStreetMap Hike and Bike"] = {tileUrl:"http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png",attribution:'Map and map data \u00a9 2012 <a href="http://www.openstreetmap.org" target=\'_blank\'>OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.',tileSize:256,minZoom:0,maxZoom:20};
all_map_layers["Google Maps"] = {tileUrl:"http://mt.google.com/vt?x={x}&y={y}&z={z}",attribution:"Google Maps",tileSize:256,minZoom:0,maxZoom:20};
all_map_layers["Google Maps Satellite"] = {tileUrl:"http://mt0.google.com/vt/lyrs=s@130&hl=en&x={x}&y={y}&z={z}",attribution:"Google Maps",tileSize:256,minZoom:0,maxZoom:20};
all_map_layers["Google Maps Hybrid"] = {tileUrl:"http://mt0.google.com/vt/lyrs=s,m@110&hl=en&x={x}&y={y}&z={z}",attribution:"Google Maps",tileSize:256,minZoom:0,maxZoom:20};

// Map-Overlays
var map_overlays = new Object();
map_overlays["Hillshadow"] = {tileUrl:"http://toolserver.org/~cmarqu/hill/{z}/{x}/{y}.png",attribution:'hillshadow \u00a9 <a href="http://toolserver.org/" target=\'_blank\'>toolserver.org</a>',tileSize:256,minZoom:0,maxZoom:17};
map_overlays["Public Transport Lines"] = {tileUrl:"http://openptmap.org/tiles/{z}/{x}/{y}.png",attribution:'Public Transport Lines\u00a9 <a href="http://openptmap.org/" target=\'_blank\'>OpenPTMap</a>',tileSize:256,minZoom:0,maxZoom:17};

// Add additional Layers to Map & Select Default-Layer, add Hill-Shadow, add Homezone
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\//)){
    // Auswahl nur bestimmter Layer
    var map_layers = new Object();
    if(settings_map_layers == "" || settings_map_layers.length < 1) map_layers = all_map_layers;
    else{
      for(var i=0; i<settings_map_layers.length; i++) map_layers[settings_map_layers[i]] = all_map_layers[settings_map_layers[i]];
    }

    function addLayer(){  
        injectPageScriptFunction(function(map_layers, map_overlays,  settings_map_default_layer, settings_show_hillshadow){
            window["GCLittleHelper_MapLayerHelper"] = function(map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow){
                if(!window.MapSettings.Map){
                            setTimeout(function(){ window["GCLittleHelper_MapLayerHelper"](map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow)}, 10);
                }
                else{
                    var layerControl = new window.L.Control.Layers();
                    var layerToAdd = null;
                    var defaultLayer = null;
                    var hillshadowLayer = null;
                    for(name in map_layers){
                        layerToAdd = new L.tileLayer(map_layers[name].tileUrl,map_layers[name]);
                        layerControl.addBaseLayer(layerToAdd, name);
                        if(name == settings_map_default_layer){
                            defaultLayer=layerToAdd;
                        }
                        else if(defaultLayer == null){
                            defaultLayer=layerToAdd;
                        }
                    }         
                    for(name in map_overlays){
                        layerToAdd = new L.tileLayer(map_overlays[name].tileUrl,map_overlays[name])
                        layerControl.addOverlay(layerToAdd, name);
                        if(name == "hillshadow"){
                            hillshadowLayer=layerToAdd;
                    	}
                    }
                    
                    window.MapSettings.Map.addControl(layerControl);
                    $(".leaflet-control-layers-base").first().find("input").attr('checked', false);
                    $(".leaflet-control-layers").first().remove(); 
                    for(layerId in window.MapSettings.Map._layers){
                        if(window.MapSettings.Map._layers[layerId]._url.indexOf("http://otile{s}.mqcdn.com/tiles/")!= -1){
                            window.MapSettings.Map.removeLayer(window.MapSettings.Map._layers[layerId]);
                            break;
                        }
                    }
                    window.MapSettings.Map.addLayer(defaultLayer);
                    if(settings_show_hillshadow){
                      $(".leaflet-control-layers-overlays").find("input").first().click();
                    }
                    
                }
            };
                
            window["GCLittleHelper_MapLayerHelper"](map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow);
        }, "("+JSON.stringify(map_layers)+","+JSON.stringify(map_overlays)+",'"+settings_map_default_layer+"',"+settings_show_hillshadow+")");
    }
    if(settings_use_gclh_layercontrol) setTimeout(addLayer,1000); // 1 Sekunde warten, um Layercontrol von GC Map Enhancements zu ueberschreiben
    

    //Function called when map is loaded
    function gclh_map_loaded(){
      if(settings_map_hide_sidebar){
        var links = document.getElementsByTagName("a");
        if(document.getElementById("searchtabs").parentNode.style.left != "-355px")
          for(var i=0; i<links.length; i++){
            if(links[i].className.match(/ToggleSidebar/)){
              links[i].click();
              break;
            }
          }
      }
      
        function addHomeZoneMap(unsafeWindow, home_lat, home_lng, settings_homezone_radius, settings_homezone_color){
            if(unsafeWindow=="none"){
                unsafeWindow = window;
            }
            
            if(typeof home_lat == "undefined" || typeof home_lng == "undefined" || home_lat == null || home_lng == null){
                return;
            }
            
            var latlng = new unsafeWindow.L.LatLng((home_lat/10000000), (home_lng/10000000));
        var options = {
                       color:       settings_homezone_color,
                       weight:       1,
                       opacity:     0.2,
                       fillOpacity: 0.1,
                       clickable:   false
                      };
        var circle = new unsafeWindow.L.Circle(latlng, settings_homezone_radius*1000,options);
        unsafeWindow.MapSettings.Map.addLayer(circle);
      }
      
        // Show Homezone-Circle on Map
        if(settings_show_homezone){
            if(browser == "chrome"){
                injectPageScriptFunction(addHomeZoneMap, "('"+ "none" + "', " + GM_getValue("home_lat") + ", " + GM_getValue("home_lng") + ", " + settings_homezone_radius + ", '" + settings_homezone_color+"')");                
            }
            else{                
                addHomeZoneMap(unsafeWindow, GM_getValue("home_lat"), GM_getValue("home_lng"), settings_homezone_radius, settings_homezone_color);
            }
        }
    }
    window.addEventListener("load",gclh_map_loaded,false);
  }
}catch(e){ gclh_error("Add Layers & Homezone to map",e); }

// Hide found/hidden Caches on Map
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\//) && !document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\/default.aspx\?pq/)){ // Nicht bei PQ-Anzeige
    function hideFoundCaches(){
      var button = unsafeWindow.document.getElementById("m_myCaches").childNodes[1];
      if(button){
        button.click();
      }
    }
    if (settings_map_hide_found) {
      window.addEventListener("load", hideFoundCaches, false);
    }
  
    function hideHiddenCaches(){
      var button = unsafeWindow.document.getElementById("m_myCaches").childNodes[3];
      if(button){
        button.click();
      }
    }
    if (settings_map_hide_hidden) {
      window.addEventListener("load", hideHiddenCaches, false);
    }

    // Apply Cache Type Filter
    function hideCacheTypes(){
      if(settings_map_hide_2    && document.getElementById("Legend2"))    document.getElementById("Legend2").click();
      if(settings_map_hide_9    && document.getElementById("Legend9"))    document.getElementById("Legend9").click();
      if(settings_map_hide_5    && document.getElementById("Legend5"))    document.getElementById("Legend5").click();
      if(settings_map_hide_3    && document.getElementById("Legend3"))    document.getElementById("Legend3").click();
      if(settings_map_hide_6    && document.getElementById("Legend6"))    document.getElementById("Legend6").click();
      if(settings_map_hide_453  && document.getElementById("Legend453"))  document.getElementById("Legend453").click();
      if(settings_map_hide_13   && document.getElementById("Legend13"))   document.getElementById("Legend13").click();
      if(settings_map_hide_1304 && document.getElementById("Legend1304")) document.getElementById("Legend1304").click();
      if(settings_map_hide_4    && document.getElementById("Legend4"))    document.getElementById("Legend4").click();
      if(settings_map_hide_11   && document.getElementById("Legend11"))   document.getElementById("Legend11").click();
      if(settings_map_hide_137  && document.getElementById("Legend137"))  document.getElementById("Legend137").click();
      if(settings_map_hide_8    && document.getElementById("Legend8"))    document.getElementById("Legend8").click();
      if(settings_map_hide_1858 && document.getElementById("Legend1858")) document.getElementById("Legend1858").click();
    }
    window.addEventListener("load", hideCacheTypes, false);
  }
}catch(e){ gclh_error("Hide found/hidden Caches / Cache Types on Map",e); }

//Display Google-Maps warning (once)
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\//)) {
   if(typeof(L) == "undefined" && typeof(unsafeWindow.L) == "undefined" && $(".leaflet-container").length == 0){
    if( !GM_getValue("gclhWasGoogleAlertShown", false)){
        function showGMapInfo(){
          if(typeof $  == "undefined"){
            $ = unsafeWindow.$;
          }
          
          if(typeof $.fancybox != "undefined"){
            $.fancybox({
              width: 780,
              height: 362,
              autoScale: false,
              padding: 0,
              margin: 0,
              href: "http://img43.imageshack.us/img43/8825/gcmapleaflet.png",
              scrolling: 'no',
              title:"GC Little Helper only supports the Leaflet-Map (you are using the Google-Map)",
              type: "image"
            });
          }
          }
        setTimeout(function () {
            if(browser == "chrome"){
                injectPageScriptFunction(showGMapInfo,"()");
            }
            else{
                showGMapInfo();
            }
            GM_setValue("gclhWasGoogleAlertShown", true);
        },750);
      }			
    }
  }
}catch(e){ gclh_error("Display Google-Maps warning",e); }

// Aplly Search-field in Navigation
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/default\.aspx\?navi_search=/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/\?navi_search=/)){
    var matches = document.location.href.match(/\?navi_search=(.*)/);
    if(matches) document.getElementById("tbSearch").value = urldecode(matches[1]).replace(/%20/g," ");
  
    function click_search(){
      document.getElementById("ibSearch").click();
    }
  
    window.addEventListener("load", click_search, false);
  }
}catch(e){ gclh_error("Apply the Search",e); }

// Count Fav-points
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/favorites\.aspx/)){
    var table = getElementsByClass("Table BottomSpacing")[0];
    if(table){
      var imgs = table.getElementsByTagName("img");
      var stats = new Object();
      var count = 0;
      if(imgs){
        for(var i=0; i<imgs.length; i++){
          if(imgs[i].src){
            if(!stats[imgs[i].src]) stats[imgs[i].src] = 0;
            stats[imgs[i].src]++;
            count++;
          }
        }
      }


      var tr = document.createElement("tr");

      var td = document.createElement("td");
      td.style.backgroundColor = "#DFE1D2";
      tr.appendChild(td);

      var td = document.createElement("td");
      td.style.backgroundColor = "#DFE1D2";
      tr.appendChild(td);

      var td = document.createElement("td");
      for(src in stats){
        var img = document.createElement("img");
        img.src = src;
        td.appendChild(img);
        td.appendChild(document.createTextNode(" "+stats[src]+"  "));
      }
      td.style.backgroundColor = "#DFE1D2";
      tr.appendChild(td);

      var td = document.createElement("td");
      td.appendChild(document.createTextNode("Sum: "+count));
      td.style.backgroundColor = "#DFE1D2";
      tr.appendChild(td);

      table.appendChild(tr);
    }
  }
}catch(e){ gclh_error("Count Fav-Points",e); }

// Improve Fieldnotes
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/fieldnotes\.aspx/)){
    function gclh_select_all(){
      var state = document.getElementById("gclh_all").checked;
      var all = document.getElementsByTagName("input");
      for(var i=0; i<all.length; i++){
        if(all[i].id.match(/ctl00_ContentBody_LogList/)){
          all[i].checked = state;
        }
      }
    }
    
    //Mark duplicate field notes
    var existingNotes = {};
    var link = null;
    var date = null;
    var type = null;
    $('.Table tr').each(function(i, e){
        link = $(e).find('td a[href*="cache_details.aspx?guid"]');
        if(link.length > 0){
            date = $($(e).find('td')[2]).text();
            type = $($(e).find('td')[3]).text();
            if(existingNotes[link[0].href + date + type]){
                $(existingNotes[link[0].href + date + type]).find('td').css("background-color", "#FE9C9C" );
                $(e).find('td').css("background-color", "#FE9C9C" );
            }
            else{
                existingNotes[link[0].href + date + type] = e;
            }
        }
    });
  
    var table = getElementsByClass("Table")[0];
    if(table){
      var stats = new Object();
      var types = new Object();
      var count = 0;
      var imgs = table.getElementsByTagName("img");
      for(var i=0; i<imgs.length; i++){
        if(imgs[i].src.match(/images\/logtypes/)){
          count++;
          if(!stats[imgs[i].src]) stats[imgs[i].src] = 0;
          stats[imgs[i].src]++;
        }else{
          if(!types[imgs[i].src]) types[imgs[i].src] = 0;
          types[imgs[i].src]++;
        }
      }
  
      // Select All - on Top
      var a = document.createElement("a");
      a.href = "javascript:void(0);";
      var img = document.createElement("img");
      img.width = 16;
      img.height = 16;
      img.src = "/images/silk/tick.png";
      img.alt = "Click to Check/Uncheck all Items";
      a.addEventListener("click", function(){ document.getElementById("gclh_all").click(); }, false);
      a.appendChild(img);
      table.childNodes[1].childNodes[1].childNodes[1].appendChild(a);
  
      // Summenzeile
      var tr = document.createElement("tr");
  
      var td = document.createElement("td");
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.title = "Select All";
      checkbox.id = "gclh_all";
      checkbox.addEventListener("click", gclh_select_all, false);
      td.appendChild(checkbox);
      td.style.backgroundColor = "#DFE1D2";
      tr.appendChild(td);
  
      var td = document.createElement("td");
      for(src in types){
        var img = document.createElement("img");
        img.src = src;
        td.appendChild(img);
        td.appendChild(document.createTextNode(" "+types[src]+"  "));
      }
      td.style.backgroundColor = "#DFE1D2";
      tr.appendChild(td);
  
      var td = document.createElement("td");
      td.style.verticalAlign = "top";
      var b = document.createElement("b");
      b.appendChild(document.createTextNode("Statistics"));
      td.appendChild(b);
      td.style.backgroundColor = "#DFE1D2";
      tr.appendChild(td);
  
      var td = document.createElement("td");
      for(src in stats){
        var img = document.createElement("img");
        img.src = src;
        td.appendChild(img);
        td.appendChild(document.createTextNode(" "+stats[src]+"  "));
      }
      td.style.backgroundColor = "#DFE1D2";
      tr.appendChild(td);
  
      var td = document.createElement("td");
      td.appendChild(document.createTextNode("Sum: "+count));
      td.style.backgroundColor = "#DFE1D2";
      tr.appendChild(td);
  
      table.appendChild(tr);
    }
  }
}catch(e){ gclh_error("Improve Fieldnotes",e); }

// Edit-Link to own Caches in Profile
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/(default\.aspx|owned\.aspx)$/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/$/)){
    var links = document.getElementsByTagName("a");
    
    for(var i = 0; i < links.length; i++){
      if(links[i].href.match(/\/seek\/cache_details\.aspx\?/)){
        var headline = links[i].parentNode.parentNode.parentNode.childNodes[1].innerHTML;
        if(headline){
          var match = links[i].href.match(/\/seek\/cache_details\.aspx\?guid=(.*)/);
          if(match[1]) links[i].parentNode.innerHTML += " <a href='/hide/report.aspx?guid="+match[1]+"'><img src='/images/stockholm/16x16/page_white_edit.gif'></a>";
        }
      }
    }
  }

  // Image-Link at own caches
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/owned\.aspx/)){
    var links = document.getElementsByTagName("a");
  
    for(var i = 0; i < links.length; i++){
      if(links[i].href.match(/\/seek\/cache_details\.aspx\?/)){
        var headline = links[i].parentNode.parentNode.parentNode.childNodes[1].innerHTML;
        if(headline){
          var match = links[i].href.match(/\/seek\/cache_details\.aspx\?guid=(.*)/);
          if(match[1]) links[i].parentNode.innerHTML += " <a href='/seek/gallery.aspx?guid="+match[1]+"'><img src='/images/stockholm/16x16/photos.gif'></a>";
        }
      }
    }
  }
}catch(e){ gclh_error("Additinal Links to own Caches in Profile",e); }

// Hide TBs/Coins in Profile
try{
  if(settings_hide_visits_in_profile && document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\//)){
    var tables = getElementsByClass("Table WordWrap");
    if(tables && tables[0]){
      var trs = tables[0].getElementsByTagName("tr");
      for(var i=0; i<trs.length; i++){
        if(trs[i].innerHTML.match(/logtypes\/75\.png/)){
          trs[i].parentNode.removeChild(trs[i]);
        }
      }
    }
  }
}catch(e){ gclh_error("Hide TBs/Coins in Profile",e); }

// Post log from Listing (inline)
try{
  if(settings_log_inline && is_page("cache_listing") && document.getElementById("ctl00_ContentBody_MapLinks_MapLinks")){
    var links = document.getElementsByTagName('a');
  
    var menu = false;
    var watch = false;
    var gallery = false;
    for(var i = 0; i < links.length; i++){
      if(links[i].href.match(/log\.aspx\?ID/) && !menu){
        menu = links[i];
      }else if(links[i].href.match(/gallery\.aspx/) && !gallery && links[i].parentNode.tagName.toLowerCase() == "li"){
        gallery = links[i];
      }else if(links[i].href.match(/watchlist\.aspx/) && !watch){
        watch = links[i];
      }
    }

    var head = document.getElementById("ctl00_ContentBody_MapLinks_MapLinks").parentNode.parentNode.nextSibling;
    
    function hide_iframe(){
      var frame = document.getElementById('gclhFrame');
      if(frame.style.display == "") frame.style.display = "none";
      else frame.style.display = "";
    }
  
    if(head && menu){
      var match = menu.href.match(/\?ID=(.*)/);
      if(match && match[1]){
        var iframe = document.createElement("iframe");
        iframe.setAttribute("id","gclhFrame");
        iframe.setAttribute("width","100%");
        iframe.setAttribute("height","600px");
        iframe.setAttribute("style","border: 0px; overflow: auto; display: none;");
        iframe.setAttribute("src","http://www.geocaching.com/seek/log.aspx?ID="+match[1]+"&gclh=small");
  
        var a = document.createElement("a");
        a.setAttribute("href","#gclhLogIt");
        a.setAttribute("name","gclhLogIt");
        var img = document.createElement("img");
        img.setAttribute("src",global_log_it_icon);
        img.setAttribute("border","0");
        a.appendChild(img);
        a.addEventListener("click", hide_iframe, false);
  
        head.parentNode.insertBefore(a,head);
        head.parentNode.insertBefore(iframe,head);
      }
  
      var a = document.createElement("a");
      a.setAttribute("href","#gclhLogIt");
      a.setAttribute("class","lnk");
      a.setAttribute("style","padding:0px;");
      a.innerHTML = "<img src='/images/stockholm/16x16/comment_add.gif'> <span style='padding-left:4px;'>Log your visit (inline)</span>";
      a.addEventListener("click", hide_iframe, false);
  
      var li = document.createElement('li');
      li.appendChild(a);
  
      var link = false;
      if(gallery) link = gallery;
      else link = watch;
      
      if(link) link.parentNode.parentNode.insertBefore(li,link.parentNode);
    }
  }
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(.*)\&gclh\=small/)){ // Hide everything to be smart for the iframe :)
    if(document.getElementsByTagName('html')[0]) document.getElementsByTagName('html')[0].style.backgroundColor = "#FFFFFF";
  
    if(document.getElementsByTagName("header")[0]) document.getElementsByTagName("header")[0].style.display = "none";

    if(document.getElementById("Navigation")) document.getElementById("Navigation").style.display = "none";
     
    if(document.getElementById('ctl00_divBreadcrumbs')) document.getElementById('ctl00_divBreadcrumbs').style.display = "none";
  
    if(getElementsByClass('BottomSpacing')[0]) getElementsByClass('BottomSpacing')[0].style.display = "none";
    if(getElementsByClass('BottomSpacing')[1]) getElementsByClass('BottomSpacing')[1].style.display = "none";
  
    if(document.getElementById('divAdvancedOptions')) document.getElementById('divAdvancedOptions').style.display = "none";
    if(!settings_log_inline_tb && document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel')) document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel').style.display = "none";
  
    if(document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel')) document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel').style.display = "none";
    if(document.getElementById('ctl00_ContentBody_uxVistOtherListingGC')) document.getElementById('ctl00_ContentBody_uxVistOtherListingGC').style.display = "none";
    if(document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton')) document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton').style.display = "none";
  
    if(document.getElementById('ctl00_divContentSide')) document.getElementById('ctl00_divContentSide').style.display = "none";
  
    if(document.getElementById('UtilityNav')) document.getElementById('UtilityNav').style.display = "none";
  
    if(document.getElementsByTagName("footer")[0]) document.getElementsByTagName("footer")[0].style.display = "none";
  
    if(getElementsByClass('container')[1]) getElementsByClass('container')[1].style.display = "inline";
  
    var links = document.getElementsByTagName("a");
    for(var i=0; i<links.length; i++){
      links[i].setAttribute("target","_blank");
    }
  }
}catch(e){ gclh_error("Inline Logging",e); }

// Post log from PMO-Listing as Basic Member(inline)
try{
  if(settings_log_inline_pmo4basic && is_page("cache_listing") && document.getElementById("ctl00_ContentBody_memberComparePanel")){
      function hide_iframe(){
	      var frame = document.getElementById('gclhFrame');
	      if(frame.style.display == "") frame.style.display = "none";
	      else frame.style.display = "";
	}
	
	var idParameter = document.URL.match(/wp=[a-zA-Z0-9]*|guid=[a-zA-Z0-9-]*|id=[0-9]*/)[0];
        if(!idParameter | idParameter == "") idParameter = "wp="+document.URL.match(/\/geocache\/([^_]*)/)[1];
	
        var iframe = document.createElement("iframe");
        iframe.setAttribute("id","gclhFrame");
        iframe.setAttribute("width","100%");
        iframe.setAttribute("height","600px");
        iframe.setAttribute("style","border: 0px; overflow: auto; display: none;");
        iframe.setAttribute("src","http://www.geocaching.com/seek/log.aspx?"+idParameter+"&gclh=small");
  
        var a = document.createElement("a");
        a.setAttribute("href","#gclhLogIt");
        a.setAttribute("name","gclhLogIt");
        var img = document.createElement("img");
        img.setAttribute("src",global_log_it_icon);
        img.setAttribute("border","0");
        a.appendChild(img);
        a.addEventListener("click", hide_iframe, false);
	
	var banner = document.getElementById("ctl00_ContentBody_memberComparePanel");
	
        banner.parentNode.insertBefore(a,banner);
        banner.parentNode.insertBefore(iframe,banner);     
    }
    else if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(ID|guid|wp)\=[a-zA-Z0-9-]*\&gclh\=small/)){ // Hide everything to be smart for the iframe :)
    if(document.getElementsByTagName('html')[0]) document.getElementsByTagName('html')[0].style.backgroundColor = "#FFFFFF";
  
    if(document.getElementsByTagName("header")[0]) document.getElementsByTagName("header")[0].style.display = "none";
     
    if(document.getElementById('ctl00_divBreadcrumbs')) document.getElementById('ctl00_divBreadcrumbs').style.display = "none";
  
    if(getElementsByClass('BottomSpacing')[0]) getElementsByClass('BottomSpacing')[0].style.display = "none";
    if(getElementsByClass('BottomSpacing')[1]) getElementsByClass('BottomSpacing')[1].style.display = "none";
  
    if(document.getElementById('divAdvancedOptions')) document.getElementById('divAdvancedOptions').style.display = "none";
    if(!settings_log_inline_tb && document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel')) document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel').style.display = "none";
  
    if(document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel')) document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel').style.display = "none";
    if(document.getElementById('ctl00_ContentBody_uxVistOtherListingGC')) document.getElementById('ctl00_ContentBody_uxVistOtherListingGC').style.display = "none";
    if(document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton')) document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton').style.display = "none";
  
    if(document.getElementById('ctl00_divContentSide')) document.getElementById('ctl00_divContentSide').style.display = "none";
  
    if(document.getElementById('UtilityNav')) document.getElementById('UtilityNav').style.display = "none";
  
    if(document.getElementsByTagName("footer")[0]) document.getElementsByTagName("footer")[0].style.display = "none";
  
    if(getElementsByClass('container')[1]) getElementsByClass('container')[1].style.display = "inline";
  
    var links = document.getElementsByTagName("a");
    for(var i=0; i<links.length; i++){
      links[i].setAttribute("target","_blank");
    }
  }
    
}catch(e){ gclh_error("Inline PMO Logging",e); }

// New Width
try{
  if(GM_getValue("settings_new_width") > 0 && GM_getValue("settings_new_width") != 950){
    var width = GM_getValue("settings_new_width");
    var css = ".container { width: "+width+"px; }";
    css += "#Content .container { width: "+width+"px; }";
    css += ".span-24 { width: "+width+"px; }";
    css += ".span-20 { width: "+(width-160)+"px; }";
    css += ".span-16 { width: "+(width-330)+"px; }";
//    css += ".span-17 { width: "+(width-280)+"px; }";
    css += ".span-17 { width: "+(width-330)+"px; }";
    css += ".span-19 { width: "+(width-200)+"px; }";
    css += ".home-hero { background: url(\"/images/home/home-hero.jpg\") no-repeat scroll left 0 transparent; color: #FFFFFF; margin: 38px 0 30px; }";
  
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }
}catch(e){ gclh_error("New Width",e); }

// Show Favourite percentage
try{
  if(settings_show_fav_percentage && is_page("cache_listing")){
    function gclh_load_score(){
      unsafeWindow.showFavoriteScore();
  
      setTimeout(function(){
        var fav = getElementsByClass('favorite-container')[0];
        if(fav){
          var score = document.getElementById('uxFavoriteScore').innerHTML.match(/<strong>(.*)<\/strong>/);
          if(score && score[1]){
            var val = getElementsByClass("favorite-value");
            if(val[0] && document.location.href.match("cache_details")){
              fav.innerHTML = "<span class='favorite-value'> "+val[0].innerHTML+"</span><br>&nbsp;&nbsp;&nbsp;&nbsp;"+score[1]+" &nbsp;&nbsp;&nbsp;&nbsp;<img id='imgFavoriteArrow' src='/images/arrow-down.png' alt='Expand' title='Expand'>";
            }else if(val[0] && document.location.href.match(/\/geocache\//)){ // New Listing-Design
              fav.innerHTML = fav.innerHTML.replace(/Favorites/,"");
              fav.innerHTML += score[1];
            }
          }
        }
      },2000);
    }
    if(getElementsByClass('favorite-container')[0]) window.addEventListener("load", gclh_load_score, false);
  }
}catch(e){ gclh_error("Show Favourite percentage",e); }

// Show amount of different Coins in public profile
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/profile\//) && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkCollectibles') && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkCollectibles').className == "Active"){

    function gclh_coin_stats(table_id){
      var table = document.getElementById(table_id).getElementsByTagName("table");
      table = table[0];
      var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
      var sums = new Object();
      sums["tbs"] = 0;
      sums["coins"] = 0;
      sums["patches"] = 0;
      sums["signal"] = 0;
      sums["unknown"] = 0;
      var diff = new Object();
      diff["tbs"] = 0;
      diff["coins"] = 0;
      diff["patches"] = 0;
      diff["signal"] = 0;
      diff["unknown"] = 0;

      for(var i=0; i<(rows.length-1); i++){
        if(rows[i].innerHTML.match(/travel bug/i)){
          diff["tbs"]++;
          sums["tbs"] += parseInt(rows[i].childNodes[5].innerHTML,10);
        }else if(rows[i].innerHTML.match(/geocoin/i)){
          diff["coins"]++;
          sums["coins"] += parseInt(rows[i].childNodes[5].innerHTML,10);
        }else if(rows[i].innerHTML.match(/geopatch/i)){
          diff["patches"]++;
          sums["patches"] += parseInt(rows[i].childNodes[5].innerHTML,10);
        }else if(rows[i].innerHTML.match(/signal/i)){
          diff["signal"]++;
          sums["signal"] += parseInt(rows[i].childNodes[5].innerHTML,10);
        }else{
          diff["unknown"]++;
          sums["unknown"] += parseInt(rows[i].childNodes[5].innerHTML,10);
        }
      }

      var tfoot = table.getElementsByTagName("tfoot")[0];
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      var new_table = "";
      td.colSpan = 3;

      new_table += "<table>"; 
      new_table += "  <tr>"; 
      new_table += "    <td></td>"; 
      new_table += "    <td><b>Sum</b></td>"; 
      new_table += "    <td><b>Different</b></td>"; 
      new_table += "  </tr>"; 
      new_table += "  <tr>"; 
      new_table += "    <td><b>Travel Bugs:</b></td>"; 
      new_table += "    <td style='text-align: center;'>"+sums["tbs"]+"</td>"; 
      new_table += "    <td style='text-align: center;'>"+diff["tbs"]+"</td>"; 
      new_table += "  </tr>"; 
      new_table += "  <tr>"; 
      new_table += "    <td><b>Geocoins:</b></td>"; 
      new_table += "    <td style='text-align: center;'>"+sums["coins"]+"</td>"; 
      new_table += "    <td style='text-align: center;'>"+diff["coins"]+"</td>"; 
      new_table += "  </tr>"; 
      new_table += "  <tr>"; 
      new_table += "    <td><b>Geopatches:</b></td>"; 
      new_table += "    <td style='text-align: center;'>"+sums["patches"]+"</td>"; 
      new_table += "    <td style='text-align: center;'>"+diff["patches"]+"</td>"; 
      new_table += "  </tr>"; 
      new_table += "  <tr>"; 
      new_table += "    <td><b>Signal Tags:</b></td>"; 
      new_table += "    <td style='text-align: center;'>"+sums["signal"]+"</td>"; 
      new_table += "    <td style='text-align: center;'>"+diff["signal"]+"</td>"; 
      new_table += "  </tr>"; 
      if(sums["unknown"] > 0 || diff["unknown"] > 0){
        new_table += "  <tr>"; 
        new_table += "    <td><b>Unknown:</b></td>"; 
        new_table += "    <td style='text-align: center;'>"+sums["unknown"]+"</td>"; 
        new_table += "    <td style='text-align: center;'>"+diff["unknown"]+"</td>"; 
        new_table += "  </tr>"; 
        new_table += "</table>"; 
      }

      td.innerHTML = new_table;

      tr.appendChild(td);
      tfoot.appendChild(tr);
    }

    gclh_coin_stats("ctl00_ContentBody_ProfilePanel1_dlCollectibles");
    gclh_coin_stats("ctl00_ContentBody_ProfilePanel1_dlCollectiblesOwned");
  }
}catch(e){ gclh_error("Show Coin-Sums",e); }

// Auto-Visit
try{
  if(settings_autovisit && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx/) && !document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?LUID=/) && !document.getElementById('ctl00_ContentBody_LogBookPanel1_CoordInfoLinkControl1_uxCoordInfoCode')){
    function gclh_autovisit_save(){
      var match = this.value.match(/([0-9]*)/);
      if(!this.checked){
        GM_setValue("autovisit_"+match[1],false);
      }else{
        GM_setValue("autovisit_"+match[1],true);
      }
    }
  
    // Add new option
    var selects = document.getElementsByTagName("select");
    for (var i=0; i < selects.length; i++){
      if(selects[i].id.match(/ctl00_ContentBody_LogBookPanel1_uxTrackables_repTravelBugs_ctl[0-9]*_ddlAction/)){
        var val = selects[i].childNodes[1].value;
        var autovisit = document.createElement("input");
        autovisit.setAttribute("type","checkbox");
        autovisit.setAttribute("id",selects[i].id+"_auto");
        autovisit.setAttribute("value",val);
        if(GM_getValue("autovisit_"+val,false)){
          autovisit.setAttribute("checked","checked");
          selects[i].selectedIndex = 2;
        }
        autovisit.addEventListener("click", gclh_autovisit_save, false);
  
        selects[i].parentNode.appendChild(autovisit);
        selects[i].parentNode.appendChild(document.createTextNode(" AutoVisit"));
      }
    }
  
    // Select AutoVisit
    function gclh_autovisit(){
      var logtype = document.getElementById("ctl00_ContentBody_LogBookPanel1_ddLogType").value;
      if(logtype == 2 || logtype == 10 || logtype == 11){
        var selects = document.getElementsByTagName("select");
        for (var i=0; i < selects.length; i++){
          if(selects[i].id.match(/ctl00_ContentBody_LogBookPanel1_uxTrackables_repTravelBugs_ctl[0-9]*_ddlAction/)){
            var val = selects[i].childNodes[1].value;
            if(GM_getValue("autovisit_"+val,false)){
              var logoptions = selects[i].getElementsByTagName("option");
              for(var k = 0; k < logoptions.length; k++){
                if(logoptions[k].value == val + "_Visited"){
                  selects[i].selectedIndex = k;
                  break;
                }
              }
              document.getElementById("ctl00_ContentBody_LogBookPanel1_uxTrackables_hdnSelectedActions").value += val+"_Visited,";
            }
          }
        }
      }else{
        var selects = document.getElementsByTagName("select");
        for (var i=0; i < selects.length; i++){
          if(selects[i].id.match(/ctl00_ContentBody_LogBookPanel1_uxTrackables_repTravelBugs_ctl[0-9]*_ddlAction/) && selects[i].value.match(/_Visited/)){
            selects[i].selectedIndex = 0;
          }
        }
      }
      if(unsafeWindow.setSelectedActions){
	     unsafeWindow.setSelectedActions();
      }
    }
  
    if(document.getElementById("ctl00_ContentBody_LogBookPanel1_ddLogType")){
      window.addEventListener("load", gclh_autovisit, false);
      document.getElementById("ctl00_ContentBody_LogBookPanel1_ddLogType").addEventListener("click", gclh_autovisit, false);
    }
  }
}catch(e){ gclh_error("Autovisit",e); }

// Show Real Owner
try{
  if(is_page("cache_listing") && document.getElementById("ctl00_ContentBody_mcd1")){
    var real_owner = get_real_owner();
    var owner_link = false;
    var links = document.getElementById("ctl00_ContentBody_mcd1").getElementsByTagName("a");
    for(var i=0; i<links.length; i++){
      if(links[i].href.match(/\/profile\/\?guid\=/)){
        owner_link = links[i];
        break;
      }
    }

    if(owner_link && real_owner){
      var pseudo = owner_link.innerHTML;
      if(settings_show_real_owner){
        owner_link.innerHTML = real_owner;
        owner_link.title = pseudo;
      }else{
        owner_link.innerHTML = pseudo;
        owner_link.title = real_owner;
      }
    }
  }
}catch(e){ gclh_error("Show Real Owner",e); }

// VIP
try{
  if(settings_show_vip_list && getElementsByClass("SignedInProfileLink")[0] && (is_page("cache_listing") || document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\//) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/myfriends\.aspx/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/profile\//))){
    var img_vip_off = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAYAAAC9vt6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sHDhEzBX83tZcAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAsElEQVQoz6WSsQ2DUAxEz4gdfkdBQQUlDAU9E0ALHQWLsMAfA8o/BNVLkYCS0ETkGstn6+kk2yShPxRLEtxjmJmio8nzXN57SZL3XkVRnEtHNTNlWaZ5nj9AAHRdR9M0ANR1Td/38Iz2UZdlIUmS0zsB67rinGPfd5xzbNt2AUgiTVOmaboCAMqypG1bqqo6ve8E77oAhmEgiiLGcbwHCCEQxzEhhJ8B9hrcPqP9+0gPbh/tf/c8szwAAAAASUVORK5CYII=";
    var img_vip_on = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAYAAAC9vt6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sHDhE0Aq4StvMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAzklEQVQoz6WSwQvBcBTHP7/lanFT3DdzV9yw+RNc8E/s6A/YSa6KUrs4u4omB6KUKJoc5a+Q5rRlOCz7Xl7feu/zXu89AXjEUAKgszb/KrbKPSTfDJo2t8MdgNvhzrBlB0l+tMo9+o0R+8kxgASAgqFynrsAnGYumqF+deysTepmhZW9/QZouoLrXHk+nlwWVzRd+TnytOtQahfDOwBI51LImSTLwQo5I5POpn5O8Cnp3WiGyma8o1BXIi8yDKgpCEmQr0YHCMCLc0YR95Fe0bc6eQ97MqYAAAAASUVORK5CYII=";
    var vips = GM_getValue("vips",false);
    if(!vips) vips = new Array();
    else vips = eval(vips);
    var myself = getElementsByClass("SignedInProfileLink")[0].innerHTML;
    var gclh_build_vip_list = function(){};
  
    // Add to VIP - image
    function gclh_add_vip(){
//      var user = trim(this.name);     // Es gibt wirklich User mit Leerzeichen am Ende ...
      var user = this.name;
  
      vips.push(user);
      vips.sort(caseInsensitiveSort);
      GM_setValue("vips",uneval(vips));
  
      var icons = document.getElementsByName(user);
      for(var i=0; i<icons.length; i++){
        var img = icons[i].childNodes[0];
        img.setAttribute("src",img_vip_on);
        img.setAttribute("title","Remove User "+user+" from VIP-List");
  
        icons[i].removeEventListener("click",gclh_add_vip,false);
        icons[i].addEventListener("click",gclh_del_vip,false);
      }
  
      gclh_build_vip_list();
    }
  
    function gclh_del_vip(){
      var vips_new = new Array();
//      var user = trim(this.name);     // Es gibt wirklich User mit Leerzeichen am Ende ...
      var user = this.name;
  
      for(var i=0; i<vips.length; i++){
        if(vips[i] != user) vips_new.push(vips[i]);
      }
      vips = vips_new;
      GM_setValue("vips",uneval(vips));
  
      var icons = document.getElementsByName(user);
      for(var i=0; i<icons.length; i++){
        var img = icons[i].childNodes[0];
        img.setAttribute("src",img_vip_off);
        img.setAttribute("title","Add User "+user+" to VIP-List");
  
        icons[i].removeEventListener("click",gclh_del_vip,false);
        icons[i].addEventListener("click",gclh_add_vip,false);
      }
  
      gclh_build_vip_list();
    }
  
    // Listing
    if(is_page("cache_listing")){
      var all_users = new Array();
      var log_infos = new Object();
      var log_infos_long = new Array();
      var index = 0;
      var links = document.getElementsByTagName('a');
      var owner = "";
      var owner_name = "";
      if(document.getElementById('ctl00_ContentBody_mcd1')){
        // ka, warum zwei Variablen - vllt. hab ich schonmal versucht das Freitext-Owner-Problem mit der GUID zu umgehen?!
        owner = get_real_owner();
        if(!owner) owner = urldecode(document.getElementById('ctl00_ContentBody_mcd1').childNodes[1].innerHTML);
        owner_name = owner;
      }
  
      for(var i=0; i<links.length; i++){
        if(links[i].href.match(/http:\/\/www\.geocaching\.com\/profile\/\?guid=/) && links[i].parentNode.className != "logOwnerStats" && !links[i].childNodes[0].src){
          if(links[i].id) links[i].name = links[i].id; // To be able to jump to this location
    
          var matches = links[i].href.match(/http:\/\/www\.geocaching\.com\/profile\/\?guid=([a-zA-Z0-9]*)/);
//          var user = trim(links[i].innerHTML);     // Es gibt wirklich User mit Leerzeichen am Ende ...
          var user = links[i].innerHTML;
    
          if(links[i].parentNode.id == "ctl00_ContentBody_mcd1"){
            user = owner;
          }
    
          // Icon
          var link = document.createElement("a");
          var img = document.createElement("img");
          img.setAttribute("border","0");
          link.appendChild(img);
          link.setAttribute("href","javascript:void(0);");
          link.setAttribute("name",user);
    
          if(in_array(user,vips)){
            img.setAttribute("src",img_vip_on);
            img.setAttribute("title","Remove User "+user+" from VIP-List");
            link.addEventListener("click",gclh_del_vip,false);
          }else{
            img.setAttribute("src",img_vip_off);
            img.setAttribute("title","Add User "+user+" to VIP-List");
            link.addEventListener("click",gclh_add_vip,false);
          } 
    
//          links[i].parentNode.appendChild(document.createTextNode("   "));
//          links[i].parentNode.appendChild(link);
          links[i].parentNode.insertBefore(link,links[i].nextSibling);
          links[i].parentNode.insertBefore(document.createTextNode("   "),links[i].nextSibling);
        }
      }
    
      // Show VIP List
      var map = document.getElementById("map_preview_canvas");
      var box = document.createElement("div");
      var headline = document.createElement("h3");
      var body = document.createElement("div");
      box.setAttribute("class","CacheDetailNavigationWidget NoPrint");
      headline.setAttribute("class","WidgetHeader");
      body.setAttribute("class","WidgetBody");
      body.setAttribute("id","gclh_vip_list");
      headline.innerHTML = "<img width=\"16\" height=\"16\" title=\"VIP-List\" alt=\"VIP-List\" src=\"http://www.geocaching.com/images/icons/icon_attended.gif\"> VIP-List";
      box.appendChild(headline);
      box.appendChild(body);
      box.innerHTML = "<br>"+box.innerHTML;
      map.parentNode.insertBefore(box,map);
      map.parentNode.insertBefore(document.createElement("p"),map);

      // Show VIP List "not found"
      if(settings_vip_show_nofound){
        var box2 = document.createElement("div");
        var headline2 = document.createElement("h3");
        var body2 = document.createElement("div");
        box2.setAttribute("class","CacheDetailNavigationWidget NoPrint");
        headline2.setAttribute("class","WidgetHeader");
        body2.setAttribute("class","WidgetBody");
        body2.setAttribute("id","gclh_vip_list_nofound");
        headline2.innerHTML = "<img width=\"16\" height=\"16\" title=\"VIP-List\" alt=\"VIP-List\" src=\"http://www.geocaching.com/images/icons/icon_attended.gif\"> VIP-List \"not found\"";
        box2.appendChild(headline2);
        box2.appendChild(body2);
        box2.innerHTML = box2.innerHTML;
        map.parentNode.insertBefore(box2,map);
        map.parentNode.insertBefore(document.createElement("p"),map);
      }
  
      var css = "a.gclh_log:hover { " +
        "  text-decoration:underline;" +
        "  position: relative;" +
        "}" +
        "a.gclh_log span {" +
        "  display: none;" +
        "  position: absolute;" +
        "  top:-310px;" +
        "  left:-705px;" +
        "  width: 700px;" +
        "  padding: 2px;" +
        "  text-decoration:none;" +
        "  text-align:left;" +
        "  vertical-align:top;" +
        "  color: #000000;" +
        "}" +
        "a.gclh_log:hover span { " +
        "  display: block;" +
        "  top: 10px;" +
        "  border: 1px solid #8c9e65;" +
        "  background-color:#dfe1d2;" +
        "  z-index:10000;" +
        "}";
      GM_addStyle(css);
    
      gclh_build_vip_list = function(){
        var show_owner = settings_show_owner_vip_list;
        var list = document.getElementById("gclh_vip_list");
        list.innerHTML = "";

        // Liste "not found"-VIPs
        var list_nofound = false;
        if(document.getElementById("gclh_vip_list_nofound")){
          list_nofound = document.getElementById("gclh_vip_list_nofound");
          list_nofound.innerHTML = "";
        }
        users_found = new Array();
  
        function gclh_build_long_list(){
          for(var i=0; i<log_infos_long.length; i++){
            var user = log_infos_long[i]["user"];
            if(in_array(user,vips) || user == owner_name){
              if(!log_infos_long[i]["date"]) continue;

              if(log_infos_long[i]["icon"].match(/\/(2|10)\.png$/)) users_found.push(user); // fuer not found liste
  
              var span = document.createElement("span");
              var profile = document.createElement("a");
              profile.setAttribute("href","http://www.geocaching.com/profile/?u="+urlencode(user));
              profile.innerHTML = user;
              if(owner_name && owner_name == user){
                profile.style.color = '#8C0B0B';
              }else if(user == myself){
                profile.style.color = '#778555';
              }
              span.appendChild(profile);
  
              // VIP-Link
              var link = document.createElement("a");
              var img = document.createElement("img");
              img.setAttribute("border","0");
              link.appendChild(img);
              link.setAttribute("href","javascript:void(0);");
              link.setAttribute("name",user);
    
              if(owner_name && owner_name == user && !in_array(user,vips)){
                img.setAttribute("src",img_vip_off);
                img.setAttribute("title","Add User "+user+" to VIP-List");
                link.addEventListener("click",gclh_add_vip,false);
              }else{
                img.setAttribute("src",img_vip_on);
                img.setAttribute("title","Remove User "+user+" from VIP-List");
                link.addEventListener("click",gclh_del_vip,false);
              }
    
              // Log-Date and Link
              var log_text = document.createElement("span");
              log_text.innerHTML = "<img src='"+log_infos_long[i]["icon"]+"'> <b>"+user+" - "+log_infos_long[i]["date"]+"</b><br/>"+log_infos_long[i]["log"];
              var log_img = document.createElement("img");
              var log_link = document.createElement("a");
              log_link.setAttribute("href","#"+log_infos_long[i]["id"]);
              log_link.className = "gclh_log";
              log_link.addEventListener("click",function(){document.getElementById("gclh_load_all_logs").click();},false);
              log_img.setAttribute("src",log_infos_long[i]["icon"]);
              log_img.setAttribute("border","0");
              log_link.appendChild(document.createTextNode(log_infos_long[i]["date"]));
              log_link.appendChild(log_text);
  
              list.appendChild(log_img);
              list.appendChild(document.createTextNode("   "));
              list.appendChild(log_link);
              list.appendChild(document.createTextNode("   "));
              list.appendChild(span);
              list.appendChild(document.createTextNode("   "));
              list.appendChild(link);
  
              list.appendChild(document.createElement("br"));
            }
          }
        }
    
        function gclh_build_list(user){
          if(!show_owner && owner_name && owner_name == user) return true;
          if(in_array(user,all_users) || (owner_name == user)){
            var span = document.createElement("span");
            var profile = document.createElement("a");
            profile.setAttribute("href","http://www.geocaching.com/profile/?u="+urlencode(user));
            profile.innerHTML = user;
            if(show_owner && owner_name && owner_name == user){
              span.appendChild(document.createTextNode("Owner: "));
              show_owner = false;
            }else if(user == myself){
              span.appendChild(document.createTextNode("Me: "));
            }
            span.appendChild(profile);
    
            // VIP-Link
            var link = document.createElement("a");
            var img = document.createElement("img");
            img.setAttribute("border","0");
            link.appendChild(img);
            link.setAttribute("href","javascript:void(0);");
            link.setAttribute("name",user);
  
            if(owner_name && owner_name == user && !in_array(user,vips)){
              img.setAttribute("src",img_vip_off);
              img.setAttribute("title","Add User "+user+" to VIP-List");
              link.addEventListener("click",gclh_add_vip,false);
            }else{
              img.setAttribute("src",img_vip_on);
              img.setAttribute("title","Remove User "+user+" from VIP-List");
              link.addEventListener("click",gclh_del_vip,false);
            }
    
            list.appendChild(span);
            list.appendChild(document.createTextNode("   "));
            list.appendChild(link);
    
            // Log-Links
            for(var x=0; x<log_infos[user].length; x++){
              if(log_infos[user][x] && log_infos[user][x]["icon"] && log_infos[user][x]["id"]){
                if(log_infos[user][x]["icon"].match(/\/(2|10)\.png$/)) users_found.push(user); // fuer not found liste

                var image = document.createElement("img");
                var log_text = document.createElement("span");
                log_text.innerHTML = "<img src='"+log_infos[user][x]["icon"]+"'> <b>"+user+" - "+log_infos[user][x]["date"]+"</b><br/>"+log_infos[user][x]["log"];
                image.setAttribute("src",log_infos[user][x]["icon"]);
                image.setAttribute("border","0");
    
                if(log_infos[user][x]["date"]){
                  image.setAttribute("title",log_infos[user][x]["date"]);
                  image.setAttribute("alt",log_infos[user][x]["date"]);
                }
    
                var a = document.createElement("a");
                a.setAttribute("href","#"+log_infos[user][x]["id"]);
                a.className = "gclh_log";
                a.addEventListener("click",function(){document.getElementById("gclh_load_all_logs").click();},false);
                a.appendChild(image); 
                a.appendChild(log_text);
               
                list.appendChild(document.createTextNode(" "));
                list.appendChild(a);
              }
            }
    
            list.appendChild(document.createElement("br"));
          }
        }
    
        owner_name = html_to_str(owner_name);
        if(settings_show_long_vip){
          gclh_build_long_list();
        }else{
          if(!log_infos[owner_name]){
            log_infos[owner_name] = new Array();
          }
          gclh_build_list(owner_name);
          for(var i=0; i<vips.length; i++){
            gclh_build_list(vips[i]);
          }
        }

        // "Not found"-Liste erstellen
        if(document.getElementById("gclh_vip_list_nofound")){
          for(var i=0; i<vips.length; i++){
            var user = vips[i];
            if(in_array(user,users_found)) continue;

            var span = document.createElement("span");
            var profile = document.createElement("a");
            profile.setAttribute("href","http://www.geocaching.com/profile/?u="+urlencode(user));
            profile.innerHTML = user;
            if(owner_name && owner_name == user){
              continue;
            }else if(user == myself){
              continue;
            }
            span.appendChild(profile);

            // VIP-Link
            var link = document.createElement("a");
            var img = document.createElement("img");
            img.setAttribute("border","0");
            link.appendChild(img);
            link.setAttribute("href","javascript:void(0);");
            link.setAttribute("name",user);

            img.setAttribute("src",img_vip_on);
            img.setAttribute("title","Remove User "+user+" from VIP-List");
            link.addEventListener("click",gclh_del_vip,false);

            list_nofound.appendChild(span);
            list_nofound.appendChild(document.createTextNode("   "));
            list_nofound.appendChild(link);            

            list_nofound.appendChild(document.createElement("br"));
          }
        }
      }
//      gclh_build_vip_list();
    // Listing (All-VIP-List)
    }else if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\//) && document.getElementById("ctl00_ContentBody_uxBanManWidget")){
      var widget = document.createElement("div");
      var headline = document.createElement("h3");
      var box = document.createElement("div");
  
      widget.setAttribute("class","YourProfileWidget");
      headline.setAttribute("class","WidgetHeader");
      headline.appendChild(document.createTextNode("All my VIPs"));
      box.setAttribute("id","box_vips");
      box.setAttribute("class","WidgetBody");
  
      widget.appendChild(headline);
      widget.appendChild(box);
      document.getElementById("ctl00_ContentBody_uxBanManWidget").parentNode.insertBefore(widget,document.getElementById("ctl00_ContentBody_uxBanManWidget"));
  
      gclh_build_vip_list = function(){
        var box = document.getElementById("box_vips");
        if(!box) return false;
        box.innerHTML = "";
  
        for(var i=0; i<vips.length; i++){
          var user = vips[i];
          var span = document.createElement("span");
          var profile = document.createElement("a");
          profile.setAttribute("href","http://www.geocaching.com/profile/?u="+urlencode(user));
          profile.innerHTML = user;
          span.appendChild(profile);
    
          // VIP-Link
          var link = document.createElement("a");
          var img = document.createElement("img");
          img.setAttribute("border","0");
          link.appendChild(img);
          link.setAttribute("href","javascript:void(0);");
          link.setAttribute("name",user);
          img.setAttribute("src",img_vip_on);
          img.setAttribute("title","Remove User "+user+" from VIP-List");
          link.addEventListener("click",gclh_del_vip,false);
    
          box.appendChild(span);
          box.appendChild(document.createTextNode("   "));
          box.appendChild(link);
          box.appendChild(document.createElement("br"));
        }
      }
      gclh_build_vip_list();
    }else if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/myfriends\.aspx/)){
    // Friendlist - VIP-Icon
      gclh_build_vip_list = function(){} // There is no list to show, but ths function will be called from gclh_del_vip/gclh_add_vip
      var links = document.getElementsByTagName('a');
      for(var i=0; i<links.length; i++){
        if(links[i].href.match(/http:\/\/www\.geocaching\.com\/profile\/\?guid=/) && links[i].id){
          // VIP-Link
//          var user = trim(links[i].innerHTML).replace(/&amp;/,'&');     // Es gibt wirklich User mit Leerzeichen am Ende ...
          var user = links[i].innerHTML.replace(/&amp;/,'&');
          var link = document.createElement("a");
          var img = document.createElement("img");
          img.setAttribute("border","0");
          link.appendChild(img);
          link.setAttribute("href","javascript:void(0);");
          link.setAttribute("name",user);
  
          if(in_array(user,vips)){
            img.setAttribute("src",img_vip_on);
            img.setAttribute("title","Remove User "+user+" from VIP-List");
            link.addEventListener("click",gclh_del_vip,false);
          }else{
            img.setAttribute("src",img_vip_off);
            img.setAttribute("title","Add User "+user+" to VIP-List");
            link.addEventListener("click",gclh_add_vip,false);
          }
  
//          links[i].parentNode.appendChild(document.createTextNode("   "));
//          links[i].parentNode.appendChild(link);
          links[i].parentNode.insertBefore(link,links[i].nextSibling);
          links[i].parentNode.insertBefore(document.createTextNode("   "),links[i].nextSibling);
        }
      }
    }else if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/profile\//) && document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName")){
    // Public Profile - VIP-Icon
      gclh_build_vip_list = function(){} // There is no list to show, but ths function will be called from gclh_del_vip/gclh_add_vip
//      var user = trim(document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").innerHTML).replace(/&amp;/,'&');     // Es gibt wirklich User mit Leerzeichen am Ende ...
      var user = document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").innerHTML.replace(/&amp;/,'&');
      var link = document.createElement("a");
      var img = document.createElement("img");
      img.setAttribute("border","0");
      link.appendChild(img);
      link.setAttribute("href","javascript:void(0);");
      link.setAttribute("name",user);
  
      if(in_array(user,vips)){
        img.setAttribute("src",img_vip_on);
        img.setAttribute("title","Remove User "+user+" from VIP-List");
        link.addEventListener("click",gclh_del_vip,false);
      }else{
        img.setAttribute("src",img_vip_off);
        img.setAttribute("title","Add User "+user+" to VIP-List");
        link.addEventListener("click",gclh_add_vip,false);
      }
  
      document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").appendChild(document.createTextNode("   "));
      document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").appendChild(link);
    }
  }
}catch(e){ gclh_error("VIP",e); }

// Show Bookmark-It Icon
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/nearest\.aspx?/)){
    var links = document.getElementsByTagName("a");
  
    for(var i=0; i<links.length; i++){
      if(links[i].href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?.*/) && links[i].innerHTML.match(/^<span>/)){
        var wpt = 2;
        try{
          var match = links[i].parentNode.previousSibling.childNodes[1].childNodes[0].src.match(/([0-9]*)\.gif/);
          if(match[1]) wpt = match[1];
        }catch(e) { }
        links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>","&nbsp;<a title='Bookmark it' href='"+links[i].href.replace("seek\/cache_details","bookmarks\/mark")+"&WptTypeID="+wpt+"'><img src='/images/stockholm/16x16/book_open_mark.gif'></a><br>");
      }
    }  
  }
}catch(e){ gclh_error("Bookmark It",e); }

// Highlight related web page link
try{
  if(is_page("cache_listing") && document.getElementById("ctl00_ContentBody_uxCacheUrl")){
    var lnk = document.getElementById("ctl00_ContentBody_uxCacheUrl");
  
    var html = "<fieldset class=\"DisclaimerWidget\">";
    html += "  <legend class=\"warning\">Please note</legend>";
    html += "  <p class=\"NoBottomSpacing\">";
    html += lnk.parentNode.innerHTML;
    html += "  </p>";
    html += "</fieldset>";
  
    lnk.parentNode.innerHTML = html;
  }
}catch(e){ gclh_error("Highlight Related Web page",e); }

// Show thumbnails
try{
  if(settings_show_thumbnails && (is_page("cache_listing") || document.location.href.match(/^http:\/\/www\.geocaching\.com\/(seek\/gallery\.aspx?|profile\/)/))){
    function placeToolTip(element, stop){
        $('a.gclh_thumb:hover span').position({my:"top left", at:"bottom left", of:"a.gclh_thumb:hover", collision:"flipfit flipfit"});
        if(! stop){
            $('a.gclh_thumb:hover span img').load(function() {
                placeToolTip(element, true);
            });
        }
    }
    
    var links = document.getElementsByTagName("a");
    
    var css = "a.gclh_thumb:hover { " + 
      "  text-decoration:underline;" +
      "  position: relative;" +
      "}" +
      "a.gclh_thumb span {" +
      "  visibility: hidden;" +
      "  position: absolute;" +
      "  top:-310px;" +
      "  left:0px;" +
      "  padding: 2px;" +
      "  text-decoration:none;" +
      "  text-align:left;" +
      "  vertical-align:top;" +
      "}" +
      "a.gclh_thumb:hover span { " +
      "  visibility: visible;" +
      //"  top: 10px;" + 
      "  z-index: 100;"+
      "  border: 1px solid #8c9e65;" +
      "  background-color:#dfe1d2;" +
      "}" +
      ".gclh_max {" +
      "  max-height: "+settings_hover_image_max_size+"px;" +
      "  max-width:  "+settings_hover_image_max_size+"px;" +
      "}";
  
    GM_addStyle(css);
  
    if(is_page("cache_listing")){
        if(browser == "chrome"){
            $("#tmpl_CacheLogImagesTitle").template("tmplCacheLogImagesTitle");
            $("#tmpl_CacheLogImages").template("tmplCacheLogImages");
            $("#tmpl_CacheLogRow").template("tmplCacheLogRow");
        }
        
      var newImageTmpl = "<!-- .gclh_vip -->" +
      "          <a class='tb_images lnk gclh_thumb' onmouseover='placeToolTip(this);' rel='tb_images[grp${LogID}]' href='http://img.geocaching.com/cache/log/${FileName}' title='${Descr}'>" +
      "              <img title='${Name}' alt='${Name}' src='http://img.geocaching.com/cache/log/thumb/${FileName}'>";
      if(settings_imgcaption_on_top){
        newImageTmpl += "<span>${Name} <img class='gclh_max' src='http://img.geocaching.com/cache/log/${FileName}'></span>";
      }else{
        newImageTmpl += "<span><img class='gclh_max' src='http://img.geocaching.com/cache/log/${FileName}'> ${Name}</span>";
      }
      newImageTmpl += "          </a>&nbsp;&nbsp;" +
      "";
  
      var code = "function gclh_updateTmpl() { " +
      "  delete $.template['tmplCacheLogImages'];" +
      "  $.template(\"tmplCacheLogImages\",\""+newImageTmpl+"\");" +
      "}"+
      "gclh_updateTmpl();";
  
      var script = document.createElement("script");
      script.innerHTML = code;
      document.getElementsByTagName("body")[0].appendChild(script);
  
    }

    var regexp = new RegExp(settings_spoiler_strings,"i");
    for(var i=0; i<links.length; i++){
      if(is_page("cache_listing") && links[i].href.match(/^http:\/\/img\.geocaching\.com\/cache/) && !links[i].innerHTML.match(regexp)){
        var span = document.createElement("span");
        var thumb = document.createElement("img");
        var thumb_link = links[i].href;

        if(thumb_link.match(/cache\/log/)){
          thumb_link = thumb_link.replace(/cache\/log/,"cache/log/thumb");
        }else{
          thumb.style.height = "100px";
          thumb.style.border = "1px solid black";
        }
        thumb.src = thumb_link;
        thumb.title = links[i].innerHTML;
        thumb.alt = links[i].innerHTML;

        links[i].className = links[i].className+" gclh_thumb";
        links[i].onmouseover=placeToolTip;

        var big_img = document.createElement("img");
        big_img.src = links[i].href;
        big_img.className = "gclh_max";

        span.appendChild(big_img);

        var name = links[i].innerHTML;
        links[i].innerHTML = "";
        links[i].appendChild(thumb);
        links[i].innerHTML += "<br>"+name;

        links[i].appendChild(span);

//        var thumb = links[i].childNodes[0];
//        var span = links[i].childNodes[1];
//        if(!thumb || !span || !thumb.style) continue;
//alert(links[i].innerHTML);
//        if(links[i].href.match(/cache\/log/)){
//          thumb.src = links[i].href.replace(/cache\/log/,"cache/log/thumb");
//        }else{
//          thumb.src = links[i].href;
//          thumb.style.height = "100px";
//          thumb.style.border = "1px solid black";
//        }
//        thumb.title = span.innerHTML;
//        thumb.alt = span.innerHTML;
//        
//        links[i].className = links[i].className+" gclh_thumb";
//        links[i].href = links[i].href.replace(/cache\/display/,"cache");
//        links[i].onmouseover=placeToolTip;
//  
//        var big_img = document.createElement("img");
//        big_img.src = links[i].href;
//        big_img.className = "gclh_max";
//  
//        if(settings_imgcaption_on_top){
//          span.appendChild(big_img);
//        }else{
//          span.insertBefore(big_img,span.childNodes[0]);
//        }
//  
//        links[i].parentNode.removeChild(links[i].nextSibling);
      }else if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/(seek\/gallery\.aspx?|profile\/)/) && links[i].href.match(/^http:\/\/img\.geocaching\.com\/(cache|track)\//) && links[i].childNodes[1] && links[i].childNodes[1].tagName == 'IMG'){
        var thumb = links[i].childNodes[1];
        var span = document.createElement('span');
        var img = document.createElement('img');
  
        img.src = thumb.src.replace(/thumb\//,"");
        img.className = "gclh_max";

        if(settings_imgcaption_on_top){
          span.appendChild(document.createTextNode(thumb.parentNode.parentNode.childNodes[7].childNodes[0].innerHTML));
          span.appendChild(img);
        }else{
          span.appendChild(img);
          span.appendChild(document.createTextNode(thumb.parentNode.parentNode.childNodes[7].childNodes[0].innerHTML));
        }
        
        links[i].className = links[i].className+" gclh_thumb";
        links[i].onmouseover=placeToolTip;
  
        links[i].appendChild(span);
      }
    }
  }
}catch(e){ gclh_error("Show Thumbnails",e); }

// Show gallery-Images in 2 instead of 4 cols
try{
  if(settings_show_big_gallery && document.location.href.match(/^http:\/\/www\.geocaching\.com\/(seek\/gallery\.aspx?|profile\/)/)){
    var links = document.getElementsByTagName("a");
    var tds = new Array();
    // Make images bigger
    for(var i=0; i<links.length; i++){
      if(links[i].href.match(/^http:\/\/img\.geocaching\.com\/(cache|track)\//) && links[i].childNodes[1] && links[i].childNodes[1].tagName == 'IMG'){
        var thumb = links[i].childNodes[1];
        thumb.style.width = "300px";
        thumb.style.height = "auto";
        thumb.src = thumb.src.replace(/thumb\//,"");
        tds.push(thumb.parentNode.parentNode);
      }
    }
  
    // Change from 4 Cols to 2
    if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/gallery\.aspx?/) && tds.length > 1 && document.getElementById("ctl00_ContentBody_GalleryItems_DataListGallery")){
      var tbody = document.createElement("tbody");
      var tr = document.createElement("tr");
      var x = 0;
      for(var i=0; i<tds.length; i++){
        if(x == 0){
          tr.appendChild(tds[i]);
          x++;
        }else{
          tr.appendChild(tds[i]);
          tbody.appendChild(tr);
          tr = document.createElement("tr");
          x = 0;
        }
      }
      if(x != 0){ //einzelnes Bild uebrig
        tr.appendChild(document.createElement("td"));
        tbody.appendChild(tr);
      }
      document.getElementById("ctl00_ContentBody_GalleryItems_DataListGallery").removeChild(document.getElementById("ctl00_ContentBody_GalleryItems_DataListGallery").firstChild);
      document.getElementById("ctl00_ContentBody_GalleryItems_DataListGallery").appendChild(tbody);
    }else if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/profile\//) && tds.length > 1 && document.getElementById("ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery")){
      var tbody = document.createElement("tbody");
      var tr = document.createElement("tr");
      var x = 0;
      for(var i=0; i<tds.length; i++){
        if(x == 0){
          tr.appendChild(tds[i]);
          x++;
        }else{
          tr.appendChild(tds[i]);
          tbody.appendChild(tr);
          tr = document.createElement("tr");
          x = 0;
        }
      }
      if(x != 0){ //einzelnes Bild uebrig
        tr.appendChild(document.createElement("td"));
        tbody.appendChild(tr);
      }
      document.getElementById("ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery").removeChild(document.getElementById("ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery").firstChild);
      document.getElementById("ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery").appendChild(tbody);
    }
  }
}catch(e){ gclh_error("Show Bigger Images",e); }

// Log-Template definieren
if(is_page("cache_listing")){
  var new_tmpl = '<tr class="log-row" data-encoded="${IsEncoded}" >' +
    '        <td>' +
    '            <div class="FloatLeft LogDisplayLeft" >' +
    '                <p class="logOwnerProfileName">' +
    '                    <strong><a id="${LogID}" name="${LogID}" href="/profile/?guid=${AccountGuid}">${UserName}</a>';

  if(settings_show_mail) new_tmpl += ' <a href="http://www.geocaching.com/email/?guid=${AccountGuid}&text=Hi ${UserName},%0A%0A'+global_cache_name+'"><img border=0 title="Send a mail to this user" src="'+global_mail_icon+'"></a>';
  if(settings_show_vip_list) new_tmpl += ' <a href="javascript:void(0);" name="${UserName}" class="gclh_vip"><img class="gclh_vip" border=0></a>';

  new_tmpl += '&nbsp;&nbsp;<a title="Top" href="#gclh_top" style="color: #000000; text-decoration: none;">↑</a>';
  
  new_tmpl += '          </strong></p>' +
    '                <p class="logOwnerBadge">' + 
    '                    {{if creator}}<img title="${creator.GroupTitle}" src="${creator.GroupImageUrl}" align="absmiddle" style="vertical-align:middle">${creator.GroupTitle}{{/if}}' +
    '                </p>' +
    '                <p class="logOwnerAvatar">' +
    '                    <a href="/profile/?guid=${AccountGuid}">';

  if(!settings_hide_avatar){
    new_tmpl += '            {{if AvatarImage}}' +
    '                        <img width="48" height="48" src="http://img.geocaching.com/user/avatar/${AvatarImage}">' +
    '                        {{else}}' +
    '                        <img width="48" height="48" src="/images/default_avatar.jpg">' +
    '                        {{/if}}';
  }

  new_tmpl += '          </a></p>' +
    '                <p class="logOwnerStats">' +
    '                    {{if GeocacheFindCount > 0 }}' +
    '                      <img title="Caches Found" src="/images/icons/icon_smile.png"> ${GeocacheFindCount}' +
    '                    {{/if}}' +
    '                </p>' +
    '            </div>' +
    '            <div class="FloatLeft LogDisplayRight">' +
    '                <div class="HalfLeft LogType">' +
    '                    <strong>' +
    '                        <img title="${LogType}" alt="${LogType}" src="/images/logtypes/${LogTypeImage}">&nbsp;${LogType}</strong></div>' +
    '                <div class="HalfRight AlignRight">' +
    '                    <span class="minorDetails LogDate">${Visited}</span></div>' +
    '                <div class="Clear LogContent">' +
    '                    {{if LatLonString.length > 0}}' +
    '                    <strong>${LatLonString}</strong>' +
    '                    {{/if}}' +
    '                    <p class="LogText">{{html LogText}}</p>' +
    '                    {{if Images.length > 0}}' +
    '                        <table cellspacing="0" cellpadding="3" class="LogImagesTable">';
  if(settings_show_thumbnails) new_tmpl += '<tr><td>';
  new_tmpl += '              {{tmpl(Images) "tmplCacheLogImages"}}';
  if(settings_show_thumbnails) new_tmpl += '</td></tr>';
  new_tmpl +=  '             </table>' +
    '                    {{/if}}' +
    '                    <div class="AlignRight">' +
    '                        <small><a title="View Log" href="/seek/log.aspx?LUID=${LogGuid}" target="_blank">' +
    '                            {{if ("'+(userInfo==null?0:userInfo.ID)+'"==AccountID)}}' +
    '                               View / Edit Log / Images' +
    '                            {{else}}' +
    '                               View Log' +
    '                            {{/if}}' +
    '                        </a></small>&nbsp;' +
    '                        {{if ("'+(userInfo==null?0:userInfo.ID)+'"==AccountID)}}' +
    '                        <small><a title="Upload Image" href="/seek/upload.aspx?LID=${LogID}" target="_blank">Upload Image</a></small>' +
    '                        {{/if}}' +
    '                    </div>' +
    '                </div>' +
    '            </div>' +
    '        </td>' +
    '    </tr>';
}

//Hide greenToTopButton
if(settings_hide_top_button){
    $("#topScroll").attr("id","_topScroll").hide();
}   

// Overwrite Log-Template and Log-Load-Function
try{
  if(settings_load_logs_with_gclh && is_page("cache_listing") && !document.getElementById("ctl00_divNotSignedIn") && document.getElementById('tmpl_CacheLogRow')){
    // to Top Link
    var a = document.createElement("a");
    a.setAttribute("href","#");
    a.setAttribute("name","gclh_top");
    document.getElementsByTagName("body")[0].insertBefore(a,document.getElementsByTagName("body")[0].childNodes[0]);
  
    var new_tmpl_block = document.createElement("script");
    new_tmpl_block.type = "text/x-jquery-tmpl";
    new_tmpl_block.innerHTML = new_tmpl;
    new_tmpl_block.setAttribute("id","tmpl_CacheLogRow_gclh");
    document.getElementsByTagName("body")[0].appendChild(new_tmpl_block);
      
    //Override the standart templates (for pre-LogLoad use)
    document.getElementById('tmpl_CacheLogRow').innerHTML = new_tmpl;
    var elem = unsafeWindow.$('#tmpl_CacheLogRow')[0];
    unsafeWindow.$.removeData(elem, "tmpl");
    unsafeWindow.$("#tmpl_CacheLogRow").template("tmplCacheLogRow");
    
    if(browser == "chrome"){
        injectPageScriptFunction(function(){
            var elem = window.$('#tmpl_CacheLogRow')[0];
            window.$.removeData(elem, "tmpl");
            window.$("#tmpl_CacheLogRow").template("tmplCacheLogRow");
        }, "()"); 
    }
      
    //Reinit initalLogs
    var tbody = (document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
    if(tbody.length > 0 ){
        tbody = tbody[0];
        if(tbody.children.length > 0 ){
            var initialLogData = chromeUserData.initalLogs || unsafeWindow.initalLogs || initalLogs;
            var inclAvatars = chromeUserData.includeAvatars ||  unsafeWindow.includeAvatars || includeAvatars;
            var newInitalLogs = $("#tmpl_CacheLogRow").tmpl(initialLogData.data, {
                includeAvatars: inclAvatars
            });
            
            unsafeWindow.$(newInitalLogs).find("a.tb_images").each(function() {
                var $this = unsafeWindow.$(this);
                $this.fancybox({
                    'type': 'image',
                    'titlePosition': 'inside',
                    'padding': 10,
                    titleFormat: function() {
                        return $this.data('title');
                    }
                });
            });
            
            for(var j =0; j<newInitalLogs.length && j<tbody.children.length;j++){
                unsafeWindow.$(tbody.children[j]).replaceWith(newInitalLogs[j]);
            }
            
            gclh_add_vip_icon();
        }
    }    
    
    function loadListener(e) {       
        gclh_add_vip_icon();        
    }
    
    (document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).addEventListener('DOMNodeInserted', loadListener);
    
    function disablePageAutoScroll(){
        var unsafeWindow = (typeof(unsafeWindow)=="undefined"?window:unsafeWindow);
        unsafeWindow.currentPageIdx = 2;
        unsafeWindow.totalPages = 1;
        unsafeWindow.isBusy = true;
        unsafeWindow.initalLogs = initalLogs = {"status":"success", "data": [], "pageInfo": { "idx":2, "size": 0, "totalRows": 1, "totalPages": 1, "rows": 1 } };        
    }
    
    /*// get userToken
    var userToken = unsafeWindow.userToken;
    if(!userToken){ // Umgehung fuer Chrome
      var scripts = document.getElementsByTagName("script");
      for(var i=0; i<scripts.length; i++){
        var match = scripts[i].innerHTML.match(/userToken = \'([A-Za-z0-9]*)\'/);
        if(match){
          userToken = match[1];
          break;
        }
      }
    }*/
  
    // Helper: Add VIP-Icon
    function gclh_add_vip_icon(){
     var elements = (document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).getElementsByTagName("a");
     for(var i = 0; i < elements.length; i++){
        if(elements[i].className == "gclh_vip"){
          var link = elements[i];
          var img = link.childNodes[0];
          var user = link.name;
  
          if(in_array(user,vips)){
            img.src = img_vip_on;
            img.title = "Remove User "+user+" from VIP-List";
            link.addEventListener("click",gclh_del_vip,false);
          }else{
            img.src = img_vip_off;
            img.title = "Add User "+user+" to VIP-List";
            link.addEventListener("click",gclh_add_vip,false);
          }
        }
      }
    }
    
    // Rebuild function - but with full control :)
    function gclh_dynamic_load(logs,num){
      var isBusy = false;
      var gclh_currentPageIdx = 1, gclh_totalPages = 1;
      var logInitialLoaded = false;
	    
      unsafeWindow.$(window).endlessScroll({
        fireOnce: true,
        fireDelay: 500,
        bottomPixels: (($(document).height() - $("#cache_logs_container").offset().top) + 50),
        ceaseFire: function(){
          // stop the scrolling if the last page is reached.
          return (gclh_totalPages < gclh_currentPageIdx);
        },
        callback: function() {
          if (!isBusy && !document.getElementById("gclh_all_logs_marker")) {
            isBusy = true;
            $("#pnlLazyLoad").show();
            
            for(var i=0; i<10; i++){
              if(logs[num]){
                var newBody = unsafeWindow.$(document.createElement("TBODY"));
                unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[num]).appendTo(newBody);
                newBody.find("a.tb_images").fancybox({'type': 'image', 'titlePosition': 'inside'});
                unsafeWindow.$(document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).append(newBody.children());
              }
              num++; // num kommt vom vorherigen laden "aller" logs
            }
  
            gclh_add_vip_icon();
            if(!settings_hide_top_button) $("#topScroll").fadeIn();
                  
            $("#pnlLazyLoad").hide();
            isBusy = false;
          }
        }
      });
    }
  
    // Load all Logs-Link
    function gclh_load_all_link(logs){
      function gclh_load_all_logs(){
        if(logs){
          var tbodys = (document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
          for(var i=0; i<tbodys.length; i++){
            (document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).removeChild(tbodys[i]);
          }
  
          for(var i=0; i<logs.length; i++){
            if(logs[i]){
              var newBody = unsafeWindow.$(document.createElement("TBODY"));
              unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[i]).appendTo(newBody);
              newBody.find("a.tb_images").fancybox({'type': 'image', 'titlePosition': 'inside'});
              unsafeWindow.$(document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).append(newBody.children());
            }
          }
  
          gclh_add_vip_icon();
  
          // Marker to disable dynamic log-load
          var marker = document.createElement("a");
          marker.setAttribute("id","gclh_all_logs_marker");
          document.getElementsByTagName("body")[0].appendChild(marker);
        }
      }
    
      var load_all = document.createElement("a");
      load_all.appendChild(document.createTextNode("Show all logs"));
      load_all.setAttribute("href","javascript:void(0);");
      load_all.setAttribute("id","gclh_load_all_logs");
      document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.appendChild(document.createTextNode(" | "));
      document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.appendChild(load_all);

// prevent line-break error
      document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.style.margin = "0";
      var para = document.getElementById('ctl00_ContentBody_lblFindCounts').nextSibling.nextSibling.nextSibling.nextSibling;
      if (para && para.nodeName == 'P'){
        para.className = para.className + ' Clear';
      }

      load_all.addEventListener("click",gclh_load_all_logs,false);
    }
  
    // Filter Log-Types
    function gclh_filter_logs(logs){
      function gclh_filter_logs(){
        if(!this.childNodes[0]) return false;
        var log_type = this.childNodes[0].title;
        if(!log_type) return false;
        if(!logs) return false;
  
        var tbodys = (document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
        for(var i=0; i<tbodys.length; i++){
          (document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).removeChild(tbodys[i]);
        }
   
        for(var i=0; i<logs.length; i++){
          if(logs[i] && logs[i].LogType == log_type){
            var newBody = unsafeWindow.$(document.createElement("TBODY"));
            unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[i]).appendTo(newBody);
            newBody.find("a.tb_images").fancybox({'type': 'image', 'titlePosition': 'inside'});
            unsafeWindow.$(document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).append(newBody.children());
          }
        }
   
        gclh_add_vip_icon();
   
        // Marker to disable dynamic log-load
        var marker = document.createElement("a");
        marker.setAttribute("id","gclh_all_logs_marker");
        document.getElementsByTagName("body")[0].appendChild(marker);
      }
   
      if(!document.getElementById("ctl00_ContentBody_lblFindCounts").childNodes[0]) return false;
      var legend = document.getElementById("ctl00_ContentBody_lblFindCounts").childNodes[0];
      var new_legend = document.createElement("p");
      new_legend.className = "LogTotals";
  
      for(var i=0; i<legend.childNodes.length; i++){
        if(legend.childNodes[i].tagName == "IMG"){
          var link = document.createElement("a");
          link.setAttribute("href","javascript:void(0);");
          link.style.textDecoration = 'none';
          link.addEventListener("click",gclh_filter_logs,false);
        
          link.appendChild(legend.childNodes[i].cloneNode(true));
          i++;
          link.appendChild(legend.childNodes[i].cloneNode(true));
          new_legend.appendChild(link);
        }
      } 
      document.getElementById('ctl00_ContentBody_lblFindCounts').replaceChild(new_legend,legend);
    }
  
    function gclh_search_logs(logs){
      function gclh_search(e){
        if(e.keyCode != 13) return false;
        if(!logs) return false;
        var search_text = this.value;
        if(!search_text) return false;
  
        var regexp = new RegExp("("+search_text+")","i");
  
        var tbodys = (document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
        for(var i=0; i<tbodys.length; i++){
          (document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).removeChild(tbodys[i]);
        }
  
        for(var i=0; i<logs.length; i++){
          if(logs[i] && (logs[i].UserName.match(regexp) || logs[i].LogText.match(regexp))){
            var newBody = unsafeWindow.$(document.createElement("TBODY"));
            unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[i]).appendTo(newBody);
            newBody.find("a.tb_images").fancybox({'type': 'image', 'titlePosition': 'inside'});
            unsafeWindow.$(document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).append(newBody.children());
          }
        }
  
        gclh_add_vip_icon();
  
        // Marker to disable dynamic log-load
        var marker = document.createElement("a");
        marker.setAttribute("id","gclh_all_logs_marker");
        document.getElementsByTagName("body")[0].appendChild(marker);
      }
  
      if(!document.getElementById("ctl00_ContentBody_lblFindCounts").childNodes[0]) return false;
      var form = document.createElement("form");
      var search = document.createElement("input");
      form.setAttribute("action","javascript:void(0);");
      form.appendChild(search);
      form.style.display = "inline";
      search.setAttribute("type","text");
      search.setAttribute("size","10");
      search.addEventListener("keyup",gclh_search,false);
      document.getElementById('ctl00_ContentBody_lblFindCounts').childNodes[0].appendChild(document.createTextNode("Search in logtext: "));
      document.getElementById('ctl00_ContentBody_lblFindCounts').childNodes[0].appendChild(form);
    }
    
    // Load "num" Logs
    function gclh_load_logs(num){
      var data = new Array(); 
      var requestCount = 1;
      var logs = new Array();
      var numPages = 1;
      var curIdx = 1;
  
      if(document.getElementById("gclh_vip_list")){
        var span_loading = document.createElement("span");
        span_loading.innerHTML = '<img src="/images/loading2.gif" class="StatusIcon" alt="Loading" />Loading Cache Logs...';
        document.getElementById("gclh_vip_list").appendChild(span_loading);
      }
      if(document.getElementById("gclh_vip_list_nofound")){
        var span_loading = document.createElement("span");
        span_loading.innerHTML = '<img src="/images/loading2.gif" class="StatusIcon" alt="Loading" />Loading Cache Logs...';
        document.getElementById("gclh_vip_list_nofound").appendChild(span_loading);
      }
      
      function gclh_load_helper(count){

          var url = "http://www.geocaching.com/seek/geocache.logbook?tkn="+userToken+"&idx="+curIdx+"&num=100&decrypt=false";
          //$("#pnlLazyLoad").show();

          GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response){

              requestCount--;
              var dataElement = JSON.parse(response.responseText);
              data[dataElement.pageInfo.idx] = dataElement;
              gclh_log("Loading Logs Status: "+response.statusText+" - idx: "+dataElement.pageInfo.idx);
              
              if(numPages == 1){
                numPages = data[count].pageInfo.totalPages;
                for(curIdx=2; curIdx<=numPages; curIdx++){
                    requestCount++;     
                    gclh_load_helper(curIdx);
                };
              }
  
              if(requestCount<=0){
                gclh_load_dataHelper();
              }              
            }
          });
      }
      
    function gclh_load_dataHelper(){
        // disable scroll Function on Page
        if(browser == "chrome"){
            injectPageScriptFunction(disablePageAutoScroll, "()"); 
        }
        else{
            disablePageAutoScroll();
        }
        
        (document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).removeEventListener('DOMNodeInserted', loadListener);
        
        // Hide initial Logs
        var tbodys = document.getElementById("cache_logs_table").getElementsByTagName("tbody");
        if(tbodys.length > 0){
            var shownLogs = tbodys[0].children.length;
            if(shownLogs > 0 && num < shownLogs){
                num = shownLogs;
            }
        }
        
        var tableContent = unsafeWindow.$("#cache_logs_table").after('<table id="cache_logs_table2" class="LogsTable NoBottomSpacing"> </table>').hide().children().remove()  ; 
        unsafeWindow.$(tableContent).find('tbody').children().remove();
        unsafeWindow.$('#cache_logs_table2').append(tableContent);     
    
        //$("#pnlLazyLoad").hide();
        for(var z = 1; z <= numPages; z++){
            var json = data[z];  
              
              logs = logs.concat(json.data);
              
              
              for(var i = 0; i < json.data.length; i++){
                var user = json.data[i].UserName;
                              
                if(settings_show_vip_list){
                  all_users.push(user);
                
                  if(!log_infos[user]) log_infos[user] = new Array();
                  log_infos[user][index] = new Object();
                  log_infos[user][index]["icon"] = "/images/logtypes/"+json.data[i].LogTypeImage;
                  log_infos[user][index]["id"] = json.data[i].LogID;
                  log_infos[user][index]["date"] = json.data[i].Visited;
                  log_infos[user][index]["log"] = json.data[i].LogText;
                  log_infos_long[index] = new Object();
                  log_infos_long[index]["user"] = user;
                  log_infos_long[index]["icon"] = "/images/logtypes/"+json.data[i].LogTypeImage;
                  log_infos_long[index]["id"] = json.data[i].LogID;
                  log_infos_long[index]["date"] = json.data[i].Visited;
                  log_infos_long[index]["log"] = json.data[i].LogText;
                  index++;
                }
              }
              
        }
        
                // Add Links
                gclh_load_all_link(logs); // Load all Logs
                gclh_filter_logs(logs); // Filter Logs
                gclh_search_logs(logs); // Search Field
  
                if(num == 0){
                  var newBody = unsafeWindow.$(document.createElement("TBODY"));
                  unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs).appendTo(newBody);
                  newBody.find("a.tb_images").fancybox({'type': 'image', 'titlePosition': 'inside'});
                  unsafeWindow.$(document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).append(newBody.children());
                }else{
                  for(var i=0; i<num; i++){
                    if(logs[i]){
                      var newBody = unsafeWindow.$(document.createElement("TBODY"));
                      unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[i]).appendTo(newBody);
                      newBody.find("a.tb_images").fancybox({'type': 'image', 'titlePosition': 'inside'});
                      unsafeWindow.$(document.getElementById("cache_logs_table2")||document.getElementById("cache_logs_table")).append(newBody.children());
                    }
                  }
                  gclh_dynamic_load(logs,num);
                }
  
                if(settings_show_vip_list){
                  gclh_build_vip_list();
                  
                gclh_add_vip_icon();
                }
        }
      
    gclh_load_helper(1);
    }
    
    if(settings_show_all_logs) gclh_load_logs(settings_show_all_logs_count);
    else gclh_load_logs(5);
  }
}catch(e){ gclh_error("Replace Log-Loading function",e); }

// Show other Coord-Formats in Listing
try{
  if(is_page("cache_listing") && document.getElementById('uxLatLon')){
    var box = document.getElementById('ctl00_ContentBody_LocationSubPanel'); //.childNodes[0];
    box.innerHTML = box.innerHTML.replace("<br>","");
    var coords = document.getElementById('uxLatLon').innerHTML;
    var dec = toDec(coords);
    var lat = dec[0];
    var lng = dec[1];
    if(lat < 0) lat = "S "+(lat*-1);
    else lat = "N "+lat;
    if(lng < 0) lng = "W "+(lng*-1);
    else lng = "E "+lng;
    box.innerHTML += " - Dec: "+lat+" "+lng;
  
    var dms = DegtoDMS(coords);
    box.innerHTML += " - DMS: "+dms;

    box.innerHTML = "<font style='font-size: 10px;'>"+box.innerHTML+"</font><br>";
  }
  // ... and on print-page
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)){
    var box = getElementsByClass("UTM Meta")[0];
    var coords = getElementsByClass("LatLong Meta")[0];
    if(box && coords){
      var match = coords.innerHTML.match(/((N|S) [0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9] (E|W) [0-9][0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9])/);
      if(match && match[1]){
        coords = match[1];
        var dec = toDec(coords);
        var lat = dec[0];
        var lng = dec[1];
        if(lat < 0) lat = "S "+(lat*-1);
        else lat = "N "+lat;
        if(lng < 0) lng = "W "+(lng*-1);
        else lng = "E "+lng;
        box.innerHTML += "<br>Dec: "+lat+" "+lng;
  
        var dms = DegtoDMS(coords);
        box.innerHTML += "<br>DMS: "+dms;
      }
    }
  }
}catch(e){ gclh_error("Show other coord-formats",e); }

// Show Map-It button at Listing
try{
  if(is_page("cache_listing") && document.getElementById('uxLatLon')){
    var coords = toDec(document.getElementById("uxLatLon").innerHTML);
    var link;
    if(document.getElementById("uxLatLonLink") != null){ //If server deliver userDefinedCoords.status="fail", then link will be null
	link = document.getElementById("uxLatLonLink").parentNode;
    }
    else{
	link = document.getElementById("uxLatLon").parentNode;    
    }    
    var a = document.createElement("a");
    var small = document.createElement("small");
    a.setAttribute("href",map_url+"?ll="+coords[0]+","+coords[1]);
    a.appendChild(document.createTextNode("Map this Location"));
    small.appendChild(document.createTextNode(" - "));
    small.appendChild(a);
    link.appendChild(small);
  }
}catch(e){ gclh_error("Map It Button",e); }

//// Show Route-It button at Listing
//try{
//  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx/) && document.getElementById('uxLatLon') && GM_getValue("home_lat")){
//    var coords = toDec(document.getElementById("uxLatLon").innerHTML);
//    var link;
//     if(document.getElementById("uxLatLonLink") != null){ //If server deliver userDefinedCoords.status="fail", then link will be null
//	link = document.getElementById("uxLatLonLink").parentNode;
//    }
//    else{
//	link = document.getElementById("uxLatLon").parentNode;    
//    }
//    var a = document.createElement("a");
//    var small = document.createElement("small");
//    var name = "";
//    if(document.getElementById("ctl00_ContentBody_CacheName")) name = "+("+trim(document.getElementById("ctl00_ContentBody_CacheName").innerHTML)+")";
//    a.setAttribute("href","http://maps.google.com/?saddr="+(GM_getValue("home_lat")/10000000)+","+(GM_getValue("home_lng")/10000000)+"+(HomeCoords)&daddr="+coords[0]+","+coords[1]+name);
//    a.setAttribute("target","_blank");
//    a.appendChild(document.createTextNode("Route to this Location"));
//    small.appendChild(document.createTextNode(" - "));
//    small.appendChild(a);
//    link.appendChild(small);
//  }
//}catch(e){ gclh_error("Route It Button",e); }

// Transfer TB-Tracking Number to Log-Field
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/details\.aspx\?tracker=/)){
    var matches = document.location.href.match(/tracker=([a-zA-Z0-9]*)/);
    if(matches && !matches[1].match(/^TB/i)) GM_setValue("last_tracking_nr",matches[1]);
  }
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/log\.aspx/) && document.getElementById('ctl00_ContentBody_LogBookPanel1_tbCode')){
    if(GM_getValue("last_tracking_nr","") != ""){
      document.getElementById('ctl00_ContentBody_LogBookPanel1_tbCode').value = GM_getValue("last_tracking_nr");
      GM_setValue("last_tracking_nr","");
    }
  }
}catch(e){ gclh_error("Transfer Tracking-Nr",e); }

// Fix decrypted Hint linefeeds
try{
  if(document.getElementById('div_hint')){
    function gclh_repair_hint(){
      document.getElementById('div_hint').innerHTML = document.getElementById('div_hint').innerHTML.replace(/<c>/g,"<p>");
      document.getElementById('div_hint').innerHTML = document.getElementById('div_hint').innerHTML.replace(/<\/c>/g,"</p>");
    }
    gclh_repair_hint();
    document.getElementById('ctl00_ContentBody_lnkDH').addEventListener("click", gclh_repair_hint, false);
  }
}catch(e){ gclh_error("Fix decrypted Hint linefeed",e); }

// Improve Search Lists color
try{
  var css = "table.Table tr.TertiaryRow td, .TertiaryRow, table.Table tr td.TertiaryRow { background-color: #c2e0c3; }";
  var head = document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}catch(e){ gclh_error("Improve Search List colors",e); }

// Hide Navi on SignIn-Overlay
try{
  function hide_navi(){
    var navi = document.getElementById('Navigation');
    if(navi.style.display == "") navi.style.display = "none";
    else navi.style.display = "";
  }
  if(document.getElementById('hlSignIn')) document.getElementById('hlSignIn').addEventListener("click",hide_navi,false);
  if(document.getElementById('ctl00_hlSignInClose')) document.getElementById('ctl00_hlSignInClose').addEventListener("click",hide_navi,false);
}catch(e){ gclh_error("Hide Navi on SignIn-Overlay",e); }

// Save HomeCoords for special bookmarks - From Manage Home Location
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/account\/ManageLocations\.aspx/)){
    function setCoordsHelper(){
      if(document.getElementById("LatLng")){
        var search_value = document.getElementById("LatLng").innerHTML;

        if(search_value.match(/([0-9]+)°([0-9]+)\.([0-9]+)′(N|S), ([0-9]+)°([0-9]+)\.([0-9]+)′(W|E)/) || search_value.match(/^(N|S) ([0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9]) (E|W) ([0-9][0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9])$/)){
          var latlng = toDec(search_value);
    
          if(GM_getValue("home_lat",0) != parseInt(latlng[0]*10000000)) GM_setValue("home_lat",parseInt(latlng[0]*10000000)); // * 10000000 because GM don't know float
          if(GM_getValue("home_lng",0) != parseInt(latlng[1]*10000000)) GM_setValue("home_lng",parseInt(latlng[1]*10000000));
        }
      }
    }
  
    window.addEventListener("load", setCoordsHelper, false); // On first hit, the search-field is filled after loading - so we have to wait
  }

  // Save HomeCoords - From Account Details
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/account\/default\.aspx/)){
    var link = document.getElementById('ctl00_ContentBody_uxMapLocations_ctl01_uxMapLocation');
  
    if(link){
      var match = link.innerHTML.match(/((N|S) [0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9] (E|W) [0-9][0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9])/);
      if(match[1]){
        var latlng = toDec(match[1]);
  
        if(GM_getValue("home_lat",0) != parseInt(latlng[0]*10000000)) GM_setValue("home_lat",parseInt(latlng[0]*10000000)); // * 10000000 because GM don't know float
        if(GM_getValue("home_lng",0) != parseInt(latlng[1]*10000000)) GM_setValue("home_lng",parseInt(latlng[1]*10000000));
      }
    }
  }
}catch(e){ gclh_error("Save Homecoords",e); }

// Save uid for special bookmarks - From My Profile
try{
  if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\//)){
    var links = document.getElementsByTagName("a");
  
    for(var i=0; i<links.length; i++){
      if(links[i].href.match(/\/track\/search\.aspx\?o=1\&uid=/)){
        var uid = links[i].href.match(/\/track\/search\.aspx\?o=1\&uid=(.*)/);
        uid = uid[1];
  
        if(GM_getValue["uid"] != uid) GM_setValue("uid",uid);
      }
    }
  }
}catch(e){ gclh_error("Save uid",e); }

// count cache matrix on statistics page or profile page
try{
  if (isLocation("my/statistics.aspx") || isLocation("profile/?guid")) {
    var table = document.getElementById('ctl00_ContentBody_StatsDifficultyTerrainControl1_uxDifficultyTerrainTable');
    if (null == table) {
      // on the profile page the ID is different than on the statistics page
      table = document.getElementById("ctl00_ContentBody_ProfilePanel1_StatsDifficultyTerrainControl1_uxDifficultyTerrainTable");
    }
    if (table) {
      var zeros = 0;
      var cells = table.getElementsByTagName('td');
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (cell.className == 'stats_cellzero') {
          zeros++;
        }
      }
      var foundMatrix = (9*9)-zeros; 
      var link = document.getElementById('uxDifficultyTerrainHelp');
      if (link) {
        var headline = link.previousSibling;
        if (headline) {
          headline.nodeValue += (' (' + foundMatrix + '/' + (9*9) + ')'); 
        }
      }
    }
  }
}catch(e){ gclh_error("Count Cache Matrix",e); }


// add mailto-link to profilpage
try{
  if ((isLocation("/profile/?guid=") || isLocation("/profile/default.aspx?guid=") || isLocation("/profile/?u=") || isLocation("/profile/default.aspx?u=") || isLocation("/profile/?id=") || isLocation("/profile/default.aspx?id=")) && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkEmailUser')) {
  	var messagelink = document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkEmailUser');
    var messagelinktext = messagelink.innerHTML;
    if(messagelinktext.match(/^.+@.+\..+$/)){
    	var mailtolink = document.createElement('a');
    	mailtolink.href= "mailto:" + messagelinktext + '?subject=[GC]';
    	mailtolink.appendChild(document.createTextNode("(@)"));
    	var messagelinkparent = messagelink.parentNode;
    	messagelinkparent.appendChild(document.createTextNode(" "));
    	messagelinkparent.appendChild(mailtolink);
    }
  }
}catch(e){ gclh_error("add mailto-link to profilepage",e); }

// Special Links
try{
  // Redirect to Neares List/Map
  function linkToNearesList(){
    if (homeCoordinatesSet()) {
      document.location.href = "http://www.geocaching.com/seek/nearest.aspx?lat="+(GM_getValue("home_lat")/10000000)+"&lng="+(GM_getValue("home_lng")/10000000)+"&dist=25&disable_redirect";
    }
  }
  addLinkEvent('lnk_nearestlist',linkToNearesList);
  
  function linkToNearesMap(){
    if (homeCoordinatesSet()) {
      document.location.href = map_url+"?lat="+(GM_getValue("home_lat")/10000000)+"&lng="+(GM_getValue("home_lng")/10000000);
    }
  }
  addLinkEvent('lnk_nearestmap',linkToNearesMap);
  
  // Redirect to Neares List without Founds
  function linkToNearesListWo(){
    if (homeCoordinatesSet()) {
      document.location.href = "http://www.geocaching.com/seek/nearest.aspx?lat="+(GM_getValue("home_lat")/10000000)+"&lng="+(GM_getValue("home_lng")/10000000)+"&dist=25&f=1&disable_redirect";
    }
  }
  addLinkEvent('lnk_nearestlist_wo',linkToNearesListWo);
  
  // Redirect to My Trackables
  function linkToMyTrackables(){
    if(typeof(GM_getValue("uid")) == "undefined"){
      if(window.confirm("To use this Link, the script has to know your uid. Just load the \"My Profile\" site and the script will save it automatically.")) document.location.href = "http://www.geocaching.com/my/";
    }else{
      document.location.href = "http://www.geocaching.com/track/search.aspx?o=1&uid="+GM_getValue("uid");
    }
  }
  addLinkEvent('lnk_my_trackables',linkToMyTrackables);
  
  // Redirect + JS-Exec
  function linkToGeocaches(){
    GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkUserStats','')");
    document.location.href = "/profile/default.aspx";
  }
  addLinkEvent('lnk_profilegeocaches',linkToGeocaches);
  
  function linkToTrackables(){
    GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkCollectibles','')");
    document.location.href = "/profile/default.aspx";
  }
  addLinkEvent('lnk_profiletrackables',linkToTrackables);
  
  function linkToGallery(){
    GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkGallery','')");
    document.location.href = "/profile/default.aspx";
  }
  addLinkEvent('lnk_profilegallery',linkToGallery);
  addLinkEvent('lnk_profilegallery2',linkToGallery);
  
  function linkToBookmarks(){
    GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkLists','')");
    document.location.href = "/profile/default.aspx";
  }
  addLinkEvent('lnk_profilebookmarks',linkToBookmarks);
  
  function linkToSouvenirs(){
    GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkSouvenirs','')");
    document.location.href = "/profile/default.aspx";
  }
  addLinkEvent('lnk_profilesouvenirs',linkToSouvenirs);
  
  function linkToStatistics(){
    GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkStatistics','')");
    document.location.href = "/profile/default.aspx";
  }
  addLinkEvent('lnk_profilestatistics',linkToStatistics);

  // Create and hide the "Find Player" Form
  function createFindPlayerForm(){
    if(document.getElementById('bg_shadow')){
      // If shadow-box already created, just show it
      if(document.getElementById('bg_shadow').style.display == "none"){
        document.getElementById('bg_shadow').style.display = "";
      }
    }else{
      var html = "";
      // Seite abdunkeln
      html += "<div id='bg_shadow' style='width: 100%; height: 100%; background-color: #000000; position:fixed; top: 0; left: 0; opacity: 0.5; filter: alpha(opacity=50);'></div>";
      document.getElementsByTagName('body')[0].innerHTML += html;
  
      document.getElementById('bg_shadow').addEventListener("click", btnClose, false);
    }
  
    if(document.getElementById('findplayer_overlay') && document.getElementById('findplayer_overlay').style.display == "none"){
      // If menu already created, just show it
      document.getElementById('findplayer_overlay').style.display = "";
    }else{
      var html = "";
      html += "<style>";
      html += "#findplayer_overlay {";
      html += "  background-color: #d8cd9d; ";
      html += "  width:350px;";
      html += "  border: 2px solid #778555; ";
      html += "  overflow: auto; ";
      html += "  padding:10px; ";
      html += "  position: absolute; ";
      html += "  left:30%; ";
      html += "  top:60px; ";
      html += "  z-index:101; ";
      html += "  -moz-border-radius:30px; ";
      html += "  -khtml-border-radius:30px; ";
      html += "  border-radius: 30px;";
      html += "  overflow: auto;";
      html += "}";
      html += ".gclh_form {";
      html += "  background-color: #d8cd9d;";
      html += "  border: 2px solid #778555;";
      html += "  -moz-border-radius: 7px;";
      html += "  -khtml-border-radius: 7px;";
      html += "  border-radius: 7px;";
      html += "  padding-left: 5px;";
      html += "  padding-right: 5px;";
      html += "}";
      html += "</style>";
      // Overlay erstellen
      html += "<div id='findplayer_overlay' align='center'>";
      html += "<h3 style='margin:5px;'>Find Player</h3>";
      html += "<form action=\"/find/default.aspx\" method=\"post\" name=\"aspnetForm\" "+(document.location.href.match(/http:\/\/www\.geocaching\.com\/map/) ? "target='_blank'" : "")+">";
      html += "<input class='gclh_form' type='hidden' name='__VIEWSTATE' value=''>";
      html += "<input class='gclh_form' id='findplayer_field' class=\"Text\" type=\"text\" maxlength=\"100\" name=\"ctl00$ContentBody$FindUserPanel1$txtUsername\"/>";
      html += "<input class='gclh_form' type=\"submit\" value=\"Go\" name=\"ctl00$ContentBody$FindUserPanel1$GetUsers\"/><input class='gclh_form' id='btn_close1' type='button' value='close'>";
      html += "</form>";
      html += "</div>";
      document.getElementsByTagName('body')[0].innerHTML += html;
  
      document.getElementById("findplayer_field").focus();
  
      document.getElementById('btn_close1').addEventListener("click", btnClose, false);
    }
  }
  addLinkEvent('lnk_findplayer',createFindPlayerForm);
}catch(e){ gclh_error("Apply Special Links",e); }

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Config-Page
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

function checkbox(setting_id, label) {
  return "<input type='checkbox' "+(eval(setting_id) ? "checked='checked'" : "" )+" id='" + setting_id + "'> " + label;
}

function show_help(text){
  return " <a class='gclh_info' href='javascript:void(0);'><b>?</b><span class='gclh_span'>"+text+"</span></a>";
}

function create_config_css(){
  var css = document.createElement("style");
  var html = "";
  html += ".settings_overlay {";
  html += "  background-color: #d8cd9d; ";
  html += "  width:600px;";
  html += "  border: 2px solid #778555; ";
  html += "  overflow: auto; ";
  html += "  padding:10px; ";
  html += "  position: absolute; ";
  html += "  left:30%; ";
  html += "  top:10px; ";
  html += "  z-index:101; ";
  html += "  -moz-border-radius:30px; ";
  html += "  -khtml-border-radius:30px; ";
  html += "  border-radius: 30px;";
  html += "  overflow: auto;";
  html += "}";
  html += "";
  html += ".gclh_headline {";
  html += "  height: 21px; ";
  html += "  margin:5px; ";
  html += "  background-color: #778555; ";
  html += "  color: #FFFFFF;";
  html += "  -moz-border-radius:30px; ";
  html += "  -khtml-border-radius:30px; ";
  html += "  border-radius: 30px;";
  html += "  text-align: center;";
  html += "}";
  html += "";
  html += ".gclh_headline2 {";
  html += "  margin: 5px;";
  html += "}";
  html += "";
  html += ".gclh_content {";
  html += "  padding: 10px;";
  html += "  font-family: Verdana;";
  html += "  font-size: 14px;";
  html += "}";
  html += "";
  html += ".gclh_form {";
  html += "  background-color: #d8cd9d;";
  html += "  border: 2px solid #778555;";
  html += "  -moz-border-radius: 7px;";
  html += "  -khtml-border-radius: 7px;";
  html += "  border-radius: 7px;";
  html += "  padding-left: 5px;";
  html += "  padding-right: 5px;";
  html += "}";
  html += ".gclh_ref {";
  html += "  color: #000000;";
  html += "  text-decoration: none;";
  html += "  border-bottom: dotted 1px black;";
  html += "}";
  html += "";
  html += ".gclh_small {";
  html += "  font-size: 10px;";
  html += "}";
  html += "";
  // Highlight
  html += "a.gclh_info {";
  html += "  color: #000000;";
  html += "  text-decoration: none;";
  html += "}";
  html += "";
  html += "a.gclh_info:hover {";
  html += "  position: relative;";
  html += "}";
  html += "";
  html += "a.gclh_info span {";
  html += "  visibility: hidden;";
  html += "  position: absolute; top:-310px; left:0px;";
  html += "  padding: 2px;";
  html += "  text-decoration: none;";
  html += "  text-align: left;";
  html += "  vertical-align: top;";
  html += "  font-size: 12px;";
  html += "}";
  html += "";
  html += "a.gclh_info:hover span {";
  html += "  width: 250px;";
  html += "  visibility: visible;";
  html += "  top: 10px;";
  html += "  left: -125px;";
  html += "  font-weight: normal;";
  html += "  border: 1px solid #000000;";
  html += "  background-color: #d8cd9d;";
  html += "}";
  css.innerHTML = html;
  document.getElementsByTagName('body')[0].appendChild(css);
}

// Configuration Menu
function gclh_showConfig(){
  // the configuration is always displayed at the top, so scroll away from logs or other lower stuff
  window.scroll(0, 0);

  if(document.getElementById('bg_shadow')){
    // If shadow-box already created, just show it
    if(document.getElementById('bg_shadow').style.display == "none"){
      document.getElementById('bg_shadow').style.display = "";
    }
  }else{
    // Seite abdunkeln
    var shadow = document.createElement("div");
    shadow.setAttribute("id","bg_shadow");
    shadow.setAttribute("style","width: 100%; height: 100%; background-color: #000000; position:fixed; top: 0; left: 0; opacity: 0.5; filter: alpha(opacity=50);");
    document.getElementsByTagName('body')[0].appendChild(shadow);
    document.getElementById('bg_shadow').addEventListener("click", btnClose, false);
  }

  if(document.getElementById('settings_overlay') && document.getElementById('settings_overlay').style.display == "none"){
    // If menu already created, just show it
    document.getElementById('settings_overlay').style.display = "";
  }else{
    create_config_css();

    var div = document.createElement("div");
    div.setAttribute("id","settings_overlay");
    div.setAttribute("class","settings_overlay");
    var html = "";  
    html += "<h3 class='gclh_headline'>GC little helper <font class='gclh_small'>v"+scriptVersion+"</font></h3>";
    html += "<div class='gclh_content'>";
    html += "<font class='gclh_small'><a href='http://www.amshove.net/bugtracker/wiki/gclittlehelper%3AGermanHelp' target='_blank'>Hier</a> gibt es eine deutsche Anleitung zu den Einstellungen.</font>";
    html += "<br><br>";
    html += "<h4 class='gclh_headline2'>Global</h4>";
    html += "Home-Coords: <input class='gclh_form' type='text' id='settings_home_lat_lng' value='"+DectoDeg(GM_getValue("home_lat"),GM_getValue("home_lng"))+"'>"+show_help("The Home-Coords are filled automatically if you update your Home-Coords on gc.com. If it doesn\'t work you can insert them here. These Coords are used for some special Links (Nearest List, Nearest Map, ..) and for the homezone-circle on the map.")+"<br>";
    html += checkbox('settings_bookmarks_on_top', "Show <a class='gclh_ref' href='#gclh_linklist' id='gclh_linklist_link_1'>Linklist</a> on top") + show_help("Show the Linklist on the top of the page - beside the other Links of gc.com. You can configure the Links at the end of this configuration-page.") + "<br/>";
    html += checkbox('settings_bookmarks_show', "Show <a class='gclh_ref' href='#gclh_linklist' id='gclh_linklist_link_2'>Linklist</a> in profile") + show_help("Show the Linklist at the side in your profile. You can configure the Links at the end of this configuration-page.") + "<br/>";
    html += checkbox('settings_hide_advert_link', 'Hide link to advertisement instructions') + "<br/>";
    html += checkbox('settings_hide_line_breaks', 'Hide superfluous line breaks') + "<br/>";
    html += "Page-Width: <input class='gclh_form' type='text' size='3' id='settings_new_width' value='"+GM_getValue("settings_new_width",950)+"'> px" + show_help("With this option you can expand the small layout. The default-value of gc.com is 950 px.") + "<br>";
    html += checkbox('settings_automatic_friend_reset', 'Reset Difference-Counter on Friendlist automatically') + show_help("If you enable this option, the difference-counter at Friendlist will automatically reset if you have seen the difference and if the day changed.") + "<br/>";
    html += checkbox('settings_show_big_gallery', 'Show bigger Images in Gallery') + "<br/>";
    html += checkbox('settings_hide_facebook', 'Hide Facebook-Login') + "<br/>";
    html += checkbox('settings_hide_socialshare', 'Hide SocialShare-Box after Log') + "<br/>";
    html += checkbox('settings_hideable_souvenirs', 'Make Souvenirs hideable') + "<br/>";
    html += checkbox('settings_hide_visits_in_profile', 'Hide TB/Coin-Visits in Profile') + "<br/>";
    html += "";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'>Nearest List</h4>";
    html += checkbox('settings_redirect_to_map', 'Redirect to Map') + show_help("If you enable this option, you will be automatically redirected from nearest list to map.") + "<br/>";
    html += checkbox('settings_show_log_it', 'Show Log-It Icon') + show_help("The Log-It Icon is displayed beside cachetitels in nearest lists. If you click it, you will be redirected directly to the log-form.") + "<br/>";
    html += checkbox('settings_show_nearestuser_profil_link', 'Show Profil-Link on search for created / found by caches') + show_help("This option adds an Link to the User-Profile when searching for caches created or found by a certain user") + "<br/>";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'>Maps</h4>";
    html += checkbox('settings_show_homezone', 'Show Homezone') + " - Radius: <input class='gclh_form' type='text' size='2' id='settings_homezone_radius' value='"+settings_homezone_radius+"'> km"+show_help("This option draws a circle of X kilometers around your home-coordinates on the map.")+"<br>";
    html += "Homezone-Color: <input class='gclh_form' type='text' size='5' id='settings_homezone_color' value='"+settings_homezone_color+"'>"+show_help("Here you can change the color of your homezone-circle.")+"<br>";
    html += checkbox('settings_map_hide_found', 'Hide found caches by default') + show_help("This is a Premium-Feature - it enables automatically the option to hide your found caches on map.") + "<br/>";
    html += checkbox('settings_map_hide_hidden', 'Hide own caches by default') + show_help("This is a Premium-Feature - it enables automatically the option to hide your caches on map.") + "<br/>";
    html += "Hide Cache Types by default: "+show_help("This is a Premium-Feature - it enables automatically the option to hide the specific cache type.")+"<br/>";
    html += " &nbsp; "+checkbox('settings_map_hide_2',"<img src='http://www.geocaching.com/images/WptTypes/sm/2.gif'>")+" &nbsp; "+checkbox('settings_map_hide_9',"<img src='http://www.geocaching.com/images/WptTypes/sm/9.gif'>")+" &nbsp; "+checkbox('settings_map_hide_5',"<img src='http://www.geocaching.com/images/WptTypes/sm/5.gif'>")+"<br/>";
    html += " &nbsp; "+checkbox('settings_map_hide_3',"<img src='http://www.geocaching.com/images/WptTypes/sm/3.gif'>")+"<br/>";
    html += " &nbsp; "+checkbox('settings_map_hide_6',"<img src='http://www.geocaching.com/images/WptTypes/sm/6.gif'>")+" &nbsp; "+checkbox('settings_map_hide_453',"<img src='http://www.geocaching.com/images/WptTypes/sm/453.gif'>")+" &nbsp; "+checkbox('settings_map_hide_13',"<img src='http://www.geocaching.com/images/WptTypes/sm/13.gif'>")+" &nbsp; "+checkbox('settings_map_hide_1304',"<img src='http://www.geocaching.com/images/WptTypes/sm/1304.gif'>")+"<br/>";
    html += " &nbsp; "+checkbox('settings_map_hide_4',"<img src='http://www.geocaching.com/images/WptTypes/sm/4.gif'>")+" &nbsp; "+checkbox('settings_map_hide_11',"<img src='http://www.geocaching.com/images/WptTypes/sm/11.gif'>")+" &nbsp; "+checkbox('settings_map_hide_137',"<img src='http://www.geocaching.com/images/WptTypes/sm/137.gif'>")+"<br/>";
    html += " &nbsp; "+checkbox('settings_map_hide_8',"<img src='http://www.geocaching.com/images/WptTypes/sm/8.gif'>")+" &nbsp; "+checkbox('settings_map_hide_1858',"<img src='http://www.geocaching.com/images/WptTypes/sm/1858.gif'>")+"<br/>";
    html += "Available Layers in Map: <font class='gclh_small'>(multiselect with Strg)</font><br><select class='gclh_form' id='settings_map_layers' multiple='multiple'>";
    for(name in all_map_layers){
      html += "  <option value='"+name+"' "+(settings_map_layers.indexOf(name) != -1 ? "selected='selected'" : "")+">"+name+"</option>";
    }
    html += "</select>"+show_help("Here you can select the maps which should be available to select with the map. With this option you can reduce the long list to the layers you really need. If none is select, all will be displayed. Option 'Replace Layercontrol by GClh' must be enabled.") +"<br>";   
    html += "Default Layer: <select class='gclh_form' id='settings_map_default_layer'>";
    html += "  <option value='false' "+(settings_map_default_layer == 'false' ? "selected='selected'" : "")+">-- no default --</option>";
    for(name in all_map_layers){
      html += "  <option value='"+name+"' "+(settings_map_default_layer == name ? "selected='selected'" : "")+">"+name+"</option>";
    }
    html += "</select>"+show_help("Here you can select the map source you want to use as default in the map. Option 'Replace Layercontrol by GClh' must be enabled.") +"<br>";
    html += checkbox('settings_show_hillshadow', 'Show Hillshadow by Default') + show_help("If you want 3D-like-Shadow to be displayed by default, activate this function. Option 'Replace Layercontrol by GClh' must be enabled.") + "<br/>";
    html += checkbox('settings_use_gclh_layercontrol', 'Replace Layercontrol by GClh') + show_help("If you use other scripts like 'Geocaching Map Enhancements' GClh will overwrite its layercontrol. With this option you can disable GClh layers to use the layers from gc.com or GME.") + "<br/>";
    html += checkbox('settings_map_hide_sidebar', 'Hide sidebar by default') + show_help("If you want to hide the sidebar on the map, just select this option.") + "<br/>";
    html += checkbox('settings_hide_map_header', 'Hide Header by default') + show_help("If you want to hide the header of the map, just select this option.") + "<br/>";
    html += "";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'>Listing</h4>";
    html += checkbox('settings_log_inline', 'Log Cache from Listing (inline)') + show_help("With the inline-Log you can open a log-form inside the listing, without loading a new page.") + "<br/> &nbsp; " + checkbox('settings_log_inline_tb', 'Show TB-List') + show_help("With this option you can select, if the TB-List should be shown in inline-Logs.") + "<br/> &nbsp; " + checkbox('settings_log_inline_pmo4basic', 'Show also for PMO-Caches (for Basic-Members)') + show_help("With this option you can select, if inline-Logs should appear for Premium-Member-Only-Caches althought you are a basic member (logging of PMO-Caches by basic members is allowed by Groundspeak).") + "<br/>";
    html += checkbox('settings_breaks_in_cache_notes', 'Show linebreaks in Cache Notes') + show_help("This is a Premium-Feature - the cache notes are displayed in a flat line by default. This option displays the notes with all breaks as they were saved.")+"<br/>";
    html += checkbox('settings_hide_empty_cache_notes', 'Hide Cache Notes if empty') + show_help("This is a Premium-Feature - you can hide the cache notes if they are empty. There will be a link to show them to add a note.") +"<br/>";
    html += checkbox('settings_hide_cache_notes', 'Hide Cache-Notes completely') + show_help("This is a Premium-Feature - you can hide the cache notes completely, if you don't want to use them.") + "<br/>";
    html += checkbox('settings_hide_disclaimer', 'Hide Disclaimer') + "<br/>";
    html += checkbox('settings_hide_spoilerwarning', 'Hide spoiler warning') + "<br/>";
    html += checkbox('settings_hide_top_button', 'Hide green Top-Button') + show_help("Hides the green \"To Top\"-Button, which appears if you are reading logs.") + "<br/>";
    html += checkbox('settings_show_all_logs', 'Show ') + " <input class='gclh_form' type='text' size='2' id='settings_show_all_logs_count' value='"+settings_show_all_logs_count+"'> logs (0 = all)"+show_help("With this option you can choose how many logs should be shown if you load the listing - if you type 0, all logs are shown by default.")+"<br>";
    html += checkbox('settings_hide_hint', 'Hide hint behind a link') + show_help("This option hides the hint behind a link - you have to click it to display the hints (already decrypted).")+ "<br/>";
    html += checkbox('settings_decrypt_hint', 'Decrypt Hint') + "<br/>";
    html += checkbox('settings_show_eventday', 'Show weekday of an event') + show_help("With this option the day of the week will be displayed next to the date.") + " Date Format: <select class='gclh_form' id='settings_date_format'>";
    html += "  <option "+(settings_date_format == "yyyy-MM-dd" ? "selected='selected'" : "")+" value='yyyy-MM-dd'> 2012-01-21</option>";
    html += "  <option "+(settings_date_format == "yyyy/MM/dd" ? "selected='selected'" : "")+" value='yyyy/MM/dd'> 2012/01/21</option>";
    html += "  <option "+(settings_date_format == "MM/dd/yyyy" ? "selected='selected'" : "")+" value='MM/dd/yyyy'> 01/21/2012</option>";
    html += "  <option "+(settings_date_format == "dd/MM/yyyy" ? "selected='selected'" : "")+" value='dd/MM/yyyy'> 21/01/2012</option>";
    html += "  <option "+(settings_date_format == "dd/MMM/yyyy" ? "selected='selected'" : "")+" value='dd/MMM/yyyy'> 21/Jan/2012</option>";
    html += "  <option "+(settings_date_format == "MMM/dd/yyyy" ? "selected='selected'" : "")+" value='MMM/dd/yyyy'> Jan/21/2012</option>";
    html += "  <option "+(settings_date_format == "dd MMM yy" ? "selected='selected'" : "")+" value='dd MMM yy'> 21 Jan 12</option>";
    html += "</select>"+show_help("If you have changed the date format on gc.com, you have to change it here to. Instead the Day of Week may be wrong.")+"<br/>";
    html += checkbox('settings_show_datepicker', 'Show datepicker') + show_help("With this option a calender icon is shown next to the Date on the logpage. After a click on this icon a calender is shown to select the logdate.") + "<br/>";
    html += checkbox('settings_show_mail', 'Show Mail Link beside Usernames') + show_help("With this option there will be an small mail-Icon beside every username. With this Icon you get directly to the mail-page to mail to this user. If you click it when you are in a Listing, the cachename and GCID will be inserted into the mail-form - you don't have to remember it :) ") + "<br/>";
    html += checkbox('settings_show_mail_coordslink', 'Show Coord-Link in Mail') + show_help("This option requires \"Show Mail Link beside Usernames\". With this option the GC/TB-Code in the Mail is displayed as coord.info-link") + "<br/>";
    html += checkbox('settings_show_google_maps', 'Show Link to and from google maps') + show_help("This option makes two thing. First it shows a Link at the top of the second map in the listing. With this Link you get directly to google maps in the area, where the cache is. Second it adds an gc.com-Icon to google-maps to jump from google-maps to gc.com-maps to the same location.") + "<br/>";
    html += checkbox('settings_strike_archived', 'Strike through title of archived/disabled caches') + "<br/>";
    html += checkbox('settings_highlight_usercoords', 'Highlight coordinates which are changed by the user with red textcolor') + "<br/>";
    html += checkbox('settings_show_fav_percentage', 'Show percentage of favourite points') + show_help("This option loads the favourite-stats of a cache in the backround and display the percentage under the amount of favs a cache got.") + "<br/>";
    html += checkbox('settings_show_vip_list', 'Show VIP-List') + show_help("The VIP-List is a list, displayed at the side on a cache-listing. You can add any user to your VIP-List by clicking the little VIP-Icon beside the username. If it is green, this person is a VIP. The VIP-List only shows VIPs and the logs of VIPs, wich already posted a log to this cache. With this option you are able to see wich of your VIPs already found this cache. The Owner is automatically a VIP for the cache, so you can see, what happened with the cache (disable, maint, enable, ..). On your profile-page there is an overview of all your VIPs.") + "<br/>";
    html += "&nbsp; "+checkbox('settings_show_owner_vip_list', 'Show Owner in VIP-List') + "<br/>";
    html += "&nbsp; "+checkbox('settings_show_long_vip', 'Show long VIP-List (one row per log)') + show_help("This is another type of displaying the VIP-List. If you disable this option you get the short list - one row per VIP and the Logs as Icons beside the VIP. If you enable this option, there is a row for every log.")+ "<br/>";
    html += "&nbsp; "+checkbox('settings_vip_show_nofound', 'Show a list of VIPs who have not found the cache') + show_help("This option enables an additional VIP-List with VIPs who have not found the cache.")+"<br>";
    html += checkbox('settings_show_thumbnails', 'Show Thumbnails of Images') + show_help("With this option the images in logs are displayed as thumbnails to have a preview. If you hover over a Thumbnail, you can see the big one. This also works in gallerys. The max size option prevents the hovered images from leaving the browser window.") + "&nbsp; Max size of big image: <input class='gclh_form' size=2 type='text' id='settings_hover_image_max_size' value='"+settings_hover_image_max_size+"'>px <br/>";
    html += "Spoiler-Filter: <input class='gclh_form' type='text' id='settings_spoiler_strings' value='"+settings_spoiler_strings+"'> "+show_help("If one of these words is found in the caption of the image, there will be no thumbnail. It is to prevent seeing spoilers as thumbnails. Words have to be divided by |")+"<br/>";
    html += "&nbsp; "+checkbox('settings_imgcaption_on_top','Show Caption on Top')+"<br/>";
    html += checkbox('settings_hide_avatar', 'Hide Avatars in Listing') + show_help("This option hides the avatars in logs. This prevents loading the hundreds of images. You have to change the option here, because GClh overrides the log-load-logic of gc.com, so the avatar-option of gc.com doesn't work with GClh.") + "<br/>";
    html += checkbox('settings_load_logs_with_gclh', 'Load Logs with GClh') + show_help("This option should be enabled. You just should disable it, if you have problems with loading the logs. If it is disabled, there are no VIP-, Mail-, Top-Icons at Logs, also the VIP-List, Hide Avatars, Log-filter, Log-Search, .. won't work.") + "<br/>";
    html += checkbox('settings_show_real_owner', 'Show real Owner-Name') + show_help("If the option is enabled, GClh will replace the pseudonym a owner took to publish the cache with the real owner name.") + "<br/>";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'>Logging</h4>";
    html += checkbox('settings_submit_log_button', 'Submit Log Text/PQ/Bookmark on F2') + show_help("With this option you are able to submit your log by pressing F2 istead of scrolling to the bottom and move the mouse to the button. This feature also works to save PocketQueries or Bookmarks.") +"<br/>";
    html += checkbox('settings_show_bbcode', 'Show Smilies and BBCode') + show_help("This option displays Smilies and BBCode-Options beside the log-form. If you click on a Smilie or BBCode, it is inserted into your log.") + "<br/>";
    html += checkbox('settings_autovisit', 'Enable AutoVisit-Feature for TBs/Coins') + show_help("With this option you are able to select TBs/Coins which should be automatically set to \"visited\" on every log. You can select \"AutoVisit\" for each TB/Coin in the List on the bottom of the log-form.") + "<br/>";
    html += checkbox('settings_replace_log_by_last_log', 'Replace Log by Last-Log Template') + show_help("If you enable this option, the \"Last-Log\"-Template will replace the whole Log. If you disable it, it will be appended to the log.") + "<br/>";
    html += "Log-Templates: <font class='gclh_small'>(BBCodes have to be enabled - #found# will be replaced with founds+1 - #found_no# will be replaced with founds - #me# with your username - #owner# with the name of the owner)</font>"+show_help("Log-Templates are pre-defined texts like \"!!! I got the FTF !!!\". All your templates are shown beside the log-form. You just have to click to a Template and it will be placed in your log. Also you are able to use variables. #found# will be replaced with your amount of found caches and will be added with 1 - #found_no# is the same without the +1 and #me# with your username (useful for different accounts at one computer) - #owner# with the name of the owner. The BBCode-Option has to be enabled. Note: You have to set a title and a text - click to the edit-icon beside the template to edit the text.")+"<br>";
    for(var i = 0; i < anzTemplates; i++){
      html += "&nbsp;&nbsp;<input class='gclh_form' type='text' size='15' id='settings_log_template_name["+i+"]' value='"+GM_getValue('settings_log_template_name['+i+']','')+"'> ";
      html += "<a onClick=\"if(document.getElementById(\'settings_log_template_div["+i+"]\').style.display == \'\') document.getElementById(\'settings_log_template_div["+i+"]\').style.display = \'none\'; else document.getElementById(\'settings_log_template_div["+i+"]\').style.display = \'\'; return false;\" href='#'><img src='http://www.geocaching.com/images/stockholm/16x16/page_white_edit.gif' border='0'></a><br>";
      html += "<div id='settings_log_template_div["+i+"]' style='display: none;'>&nbsp;&nbsp;&nbsp;&nbsp;<textarea class='gclh_form' rows='6' cols='30' id='settings_log_template["+i+"]'>&zwnj;"+GM_getValue("settings_log_template["+i+"]","")+"</textarea></div>";
    }
    html += "Default Log-Type: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <select class='gclh_form' id='settings_default_logtype'>";
    html += "  <option value=\"-1\" "+(settings_default_logtype == "-1" ? "selected=\"selected\"" : "")+">- Select Type of Log -</option>";
    html += "  <option value=\"2\" "+(settings_default_logtype == "2" ? "selected=\"selected\"" : "")+">Found it</option>";
    html += "  <option value=\"3\" "+(settings_default_logtype == "3" ? "selected=\"selected\"" : "")+">Didn't find it</option>";
    html += "  <option value=\"4\" "+(settings_default_logtype == "4" ? "selected=\"selected\"" : "")+">Write note</option>";
    html += "  <option value=\"7\" "+(settings_default_logtype == "7" ? "selected=\"selected\"" : "")+">Needs Archived</option>";
    html += "  <option value=\"45\" "+(settings_default_logtype == "45" ? "selected=\"selected\"" : "")+">Needs Maintenance</option>";
    html += "</select>"+show_help("If you set this option, the selected value will be selected automatically, if you open a log-page.")+"<br>";
    html += "Default Event-Log-Type: <select class='gclh_form' id='settings_default_logtype_event'>";
    html += "  <option value=\"-1\" "+(settings_default_logtype_event == "-1" ? "selected=\"selected\"" : "")+">- Select Type of Log -</option>";
    html += "  <option value=\"4\" "+(settings_default_logtype_event == "4" ? "selected=\"selected\"" : "")+">Write note</option>";
    html += "  <option value=\"7\" "+(settings_default_logtype_event == "7" ? "selected=\"selected\"" : "")+">Needs Archived</option>";
    html += "  <option value=\"9\" "+(settings_default_logtype_event == "9" ? "selected=\"selected\"" : "")+">Will Attend</option>";
    html += "  <option value=\"10\" "+(settings_default_logtype_event == "10" ? "selected=\"selected\"" : "")+">Attended</option>";
    html += "</select>"+show_help("If you set this option, the selected value will be selected automatically, if you open a log-page of an event.")+"<br>";
    html += "Default TB-Log-Type: &nbsp; &nbsp; &nbsp;<select class='gclh_form' id='settings_default_tb_logtype'>";
    html += "  <option value=\"-1\" "+(settings_default_tb_logtype == "-1" ? "selected=\"selected\"" : "")+">- Select Type of Log -</option>";
    html += "  <option value=\"13\" "+(settings_default_tb_logtype == "13" ? "selected=\"selected\"" : "")+">Retrieve from ..</option>";
    html += "  <option value=\"19\" "+(settings_default_tb_logtype == "19" ? "selected=\"selected\"" : "")+">Grab it from ..</option>";
    html += "  <option value=\"4\" "+(settings_default_tb_logtype == "4" ? "selected=\"selected\"" : "")+">Write note</option>";
    html += "  <option value=\"48\" "+(settings_default_tb_logtype == "48" ? "selected=\"selected\"" : "")+">Discovered It</option>";
    html += "</select>"+show_help("If you set this option, the selected value will be selected automatically, if you open a log-page.")+"<br>";
    html += "Cache-Signature:"+show_help("The Signature will automatically be inserted into your logs. Also you are able to use variables. #found# will be replaced with your amount of found caches and will be added with 1 - #found_no# is the same without the +1 and #me# with your username (useful for different accounts at one computer) - #owner# with the name of the owner.")+" <font class='gclh_small'>(#found# will be replaced with founds+1 - #found_no# will be replaced with founds - #me# with your username - #owner# with the name of the owner)</font><br>";
    html += "<textarea class='gclh_form' rows='8' cols='40' id='settings_log_signature'>&zwnj;"+GM_getValue("settings_log_signature","")+"</textarea><br>";
    html += checkbox('settings_log_signature_on_fieldnotes', 'Add Log-Signature on FieldNotes-Logs') + show_help('If this option is disabled, the Log-Signature will not be used by Logs out of FieldNotes - you can use it, if you already have an signature in your FieldNotes.')+"<br>";
    html += "TB-Signature:"+show_help("The Signature will automatically be inserted into your TB-logs. Also you are able to use variables. #found# will be replaced with your amount of found caches and will be added with 1 - #found_no# is the same without the +1 and #me# with your username (useful for different accounts at one computer) - #owner# with the name of the owner.")+" <font class='gclh_small'>(#found# will be replaced with founds+1 - #found_no# will be replaced with founds - #me# with your username - #owner# with the name of the owner)</font><br>";
    html += "<textarea class='gclh_form' rows='8' cols='40' id='settings_tb_signature'>&zwnj;"+GM_getValue("settings_tb_signature","")+"</textarea><br>";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'>Mail-Form</h4>";
    html += "Signature: &nbsp; &nbsp; &nbsp; "+show_help("The Signature will automatically be inserted into your mails. #me# will be replaced with your username.")+"<br>";
    html += "<textarea class='gclh_form' rows='8' cols='40' id='settings_mail_signature'>&zwnj;"+GM_getValue("settings_mail_signature","")+"</textarea><br>";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'><a name='gclh_linklist'></a>Linklist / Navigation"+show_help("In this section you can configure your personal linklist which is shown on the top of the page and/or in your profile - you can activate it on top of this configuration-page.")+" <a class='gclh_small' href='#gclh_linklist' id='gclh_show_linklist_btn'>show</a></h4>";
    html += "<div id='gclh_settings_linklist' style='display: none;'>";
    html += "Remove from Navigation:"+show_help("Here you can select, which of the original gc.com links should be removed to make room for your linklist.")+"<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_learn') ? "checked='checked'" : "" )+" id='remove_navi_learn'> Learn<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_partnering') ? "checked='checked'" : "" )+" id='remove_navi_partnering'> Partnering<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_play') ? "checked='checked'" : "" )+" id='remove_navi_play'> Play<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_profile') ? "checked='checked'" : "" )+" id='remove_navi_profile'> Your Profile<br>";
//    html += "<input type='checkbox' "+(GM_getValue('remove_navi_join') ? "checked='checked'" : "" )+" id='remove_navi_join'> Join<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_community') ? "checked='checked'" : "" )+" id='remove_navi_community'> Community<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_videos') ? "checked='checked'" : "" )+" id='remove_navi_videos'> Videos<br>";
//    html += "<input type='checkbox' "+(GM_getValue('remove_navi_resources') ? "checked='checked'" : "" )+" id='remove_navi_resources'> Resources<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_shop') ? "checked='checked'" : "" )+" id='remove_navi_shop'> Shop<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_social',true) ? "checked='checked'" : "" )+" id='remove_navi_social'> Follow Us<br>";
    html += "<br>";
    html += "<input type='checkbox' "+(settings_bookmarks_search ? "checked='checked'" : "" )+" id='settings_bookmarks_search'> Show Searchfield - Default Value: <input class='gclh_form' type='text' id='settings_bookmarks_search_default' value='"+settings_bookmarks_search_default+"' size='4'>"+show_help("If you enable this option, then there will be a searchfield on the top of the page beside the links. In this field you can search for GCIDs, TBIDs, Tracking-Numbers, Coordinates, ... - also you can define a default-value if you want (like GC...).")+"<br>";
    html += "<input type='checkbox' "+(settings_bookmarks_top_menu ? "checked='checked'" : "" )+" id='settings_bookmarks_top_menu'> Show Linklist as Drop-Down"+show_help("If you enable this option, your linklist will be shown as a drop-down list beside the other links. If you disable it, the linklist will be shown like all other links on the top of the page - side by side.")+"<br>";
    html += "<br>";
    html += "<div style='float:right; width:197px;margin-left:10px;' div>";
    
    var firstCust = 0;    
    for(var j=0;j<bookmarks.length;j++){
	if(bookmarks[j].custom){
		firstCust = j;
		break;
	}
    }
    
    html += "   <p style='margin-top:5px;margin-bottom:5px;font-family: Verdana;font-size: 14px;font-style: normal;font-weight: bold;'>Linklist top</p>";
    html += "   <table class='gclh_form' style='width:100%;'>";
    html += "     <tbody id='gclh_LinkListTop'>";   
    
    var order = eval(GM_getValue("settings_bookmarks_list","[]"));
    if(order.length == 0){    
	html += "        <tr class='gclh_LinkListPlaceHolder'>";    
	html += "          <td style='padding: 4px 2px;' >Drop here...</td>";
	html += "        </tr>";    
    }
    else{
	for(var i=0;i<order.length;i++){
                if(typeof(order[i]) == "undefined") continue;
                if(typeof(bookmarks[order[i]]) == "undefined") continue;
		var  text = (typeof(bookmarks_orig_title[order[i]]) != "undefined" && bookmarks_orig_title[order[i]] != "" ? bookmarks_orig_title[order[i]] : bookmarks[order[i]]['title']);
		if(bookmarks[order[i]].custom){
			text="Custom" + (order[i]-firstCust);
		}	
		html += "<tr class='gclh_LinkListInlist' id='gclh_LinkListTop_"+order[i]+"' name='"+ text  +"'> <td style='padding: 4px 2px;' ><img style='height:12px;margin-right:5px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAXCAQAAACo/wdSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA82lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjardA/SgNBHMXx70TULloE67mAgmu15eQPi2ARYopsqkxmBw1hd4fZn3/2Bh7B43iDFIIXUVJbqARLwU/1eM2DB+rZDPujzjGUlcRsYvJZPteHGw7YAwDrmmDG4yuAqq48vynYvqEAXk/NsD/ib/ZdiAK8AEnhGwd8AKsHCQJqAfSW6yCgBOitp5MBqCegK/5RAAZ1aOPq5lb0eZqm2hT10uvrthFfNvqycnUMdbTiC+B7A+Aoi7bVmS1Lq5OzhH83y+f6K71PUYA62ey6HXcX73/+7FzAJ0sbODDOTdGSAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEsSURBVHjapNKrS4NhFAbw376NwUAQ1rwgiIJgcrjo/gLFNIs3lrSYlgxLgphsgrgiODStCA4Ei0EM8olNEARBsAriYEkw7OK34SX4hBPO87znOee8J7asCzNe3UcTQRdddCm0+L2g36ldcSnHDqR6BVNC8x3xmmvjUUE70aAVOw8CKYetktv2QEm5Y5kMFBTwZk7JGBi2blUDRfmmxa2MGgbBACqyHts9lOU86cW9jCoJFfu+R92CdKDuN7wG/sC/BfGEgqTyD/Smp0DKgaOvz+kg7cyOeNNiRWgC77TitNBss4eaG0wK5d2CO2uujeLCRWyZpF0b4MUQno2ALVs+Yq2TyzvUF12QJefRMauykVu8kWnS0T08yKqAPTnP7XQiUrZh1ZW6k+i0nwMAV0JH/Qo6+gQAAAAASUVORK5CYII=' />" + text  +"</td> <td style='width:24px;'><img class='gclh_LinkListDelIcon' style='height:22px;'src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADZBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMi4yLWMwNjMgNTMuMzUyNjI0LCAyMDA4LzA3LzMwLTE4OjA1OjQxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIKICAgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cDovL2Jsb2cuYWRkaWN0ZWR0b2NvZmZlZS5kZSIKICAgcGhvdG9zaG9wOkF1dGhvcnNQb3NpdGlvbj0iIj4KICAgPGRjOnJpZ2h0cz4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+wqkgICAgICAgICAgICYjeEE7IDIwMDkgYnkgT2xpdmVyIFR3YXJkb3dza2k8L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpyaWdodHM+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5PbGl2ZXIgVHdhcmRvd3NraTwvcmRmOmxpPgogICAgPC9yZGY6U2VxPgogICA8L2RjOmNyZWF0b3I+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCIvPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wUmlnaHRzOlVzYWdlVGVybXM+CiAgICA8cmRmOkFsdD4KICAgICA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiLz4KICAgIDwvcmRmOkFsdD4KICAgPC94bXBSaWdodHM6VXNhZ2VUZXJtcz4KICAgPElwdGM0eG1wQ29yZTpDcmVhdG9yQ29udGFjdEluZm8KICAgIElwdGM0eG1wQ29yZTpDaUFkckV4dGFkcj0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ2l0eT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyUmVnaW9uPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lBZHJQY29kZT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ3RyeT0iIgogICAgSXB0YzR4bXBDb3JlOkNpVGVsV29yaz0iIgogICAgSXB0YzR4bXBDb3JlOkNpRW1haWxXb3JrPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lVcmxXb3JrPSIiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgiL5zQAABAwSURBVHjaYvz//z8DNsACYzz18fzPyMbK8P/XbwbpLdsZGUE6QIJcIiIM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' /></td> </tr>";		
	}		
    }
  
    html += "     </tbody>";
    html += "   </table>";
    
    html += "   <p style='margin-top:5px;margin-bottom:5px;font-family: Verdana;font-size: 14px;font-style: normal;font-weight: bold;'>Linklist Map</p>";
    html += "   <table class='gclh_form' style='width:100%;'>";
    html += "     <tbody id='gclh_LinkListMap'>";   
    
    var order = eval(GM_getValue("settings_bookmarks_list_beta","[]"));
    if(order.length == 0){    
	html += "        <tr class='gclh_LinkListPlaceHolder'>";    
	html += "          <td style='padding: 4px 2px;' >Drop here...</td>";
	html += "        </tr>";    
    }
    else{
	
	for(var i=0;i<order.length;i++){
                if(typeof(order[i]) == "undefined") continue;
                if(typeof(bookmarks[order[i]]) == "undefined") continue;
		var  text = (typeof(bookmarks_orig_title[order[i]]) != "undefined" && bookmarks_orig_title[order[i]] != "" ? bookmarks_orig_title[order[i]] : bookmarks[order[i]]['title']);
		if(bookmarks[order[i]].custom){
			text="Custom" + (order[i]-firstCust);
		}	
		html += "<tr class='gclh_LinkListInlist' id='gclh_LinkListMap_"+order[i]+"' name='"+ text  +"'> <td style='padding: 4px 2px;' ><img style='height:12px;margin-right:5px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAXCAQAAACo/wdSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA82lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjardA/SgNBHMXx70TULloE67mAgmu15eQPi2ARYopsqkxmBw1hd4fZn3/2Bh7B43iDFIIXUVJbqARLwU/1eM2DB+rZDPujzjGUlcRsYvJZPteHGw7YAwDrmmDG4yuAqq48vynYvqEAXk/NsD/ib/ZdiAK8AEnhGwd8AKsHCQJqAfSW6yCgBOitp5MBqCegK/5RAAZ1aOPq5lb0eZqm2hT10uvrthFfNvqycnUMdbTiC+B7A+Aoi7bVmS1Lq5OzhH83y+f6K71PUYA62ey6HXcX73/+7FzAJ0sbODDOTdGSAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEsSURBVHjapNKrS4NhFAbw376NwUAQ1rwgiIJgcrjo/gLFNIs3lrSYlgxLgphsgrgiODStCA4Ei0EM8olNEARBsAriYEkw7OK34SX4hBPO87znOee8J7asCzNe3UcTQRdddCm0+L2g36ldcSnHDqR6BVNC8x3xmmvjUUE70aAVOw8CKYetktv2QEm5Y5kMFBTwZk7JGBi2blUDRfmmxa2MGgbBACqyHts9lOU86cW9jCoJFfu+R92CdKDuN7wG/sC/BfGEgqTyD/Smp0DKgaOvz+kg7cyOeNNiRWgC77TitNBss4eaG0wK5d2CO2uujeLCRWyZpF0b4MUQno2ALVs+Yq2TyzvUF12QJefRMauykVu8kWnS0T08yKqAPTnP7XQiUrZh1ZW6k+i0nwMAV0JH/Qo6+gQAAAAASUVORK5CYII=' />" + text  +"</td> <td style='width:24px;'><img class='gclh_LinkListDelIcon' style='height:22px;'src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADZBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMi4yLWMwNjMgNTMuMzUyNjI0LCAyMDA4LzA3LzMwLTE4OjA1OjQxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIKICAgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cDovL2Jsb2cuYWRkaWN0ZWR0b2NvZmZlZS5kZSIKICAgcGhvdG9zaG9wOkF1dGhvcnNQb3NpdGlvbj0iIj4KICAgPGRjOnJpZ2h0cz4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+wqkgICAgICAgICAgICYjeEE7IDIwMDkgYnkgT2xpdmVyIFR3YXJkb3dza2k8L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpyaWdodHM+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5PbGl2ZXIgVHdhcmRvd3NraTwvcmRmOmxpPgogICAgPC9yZGY6U2VxPgogICA8L2RjOmNyZWF0b3I+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCIvPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wUmlnaHRzOlVzYWdlVGVybXM+CiAgICA8cmRmOkFsdD4KICAgICA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiLz4KICAgIDwvcmRmOkFsdD4KICAgPC94bXBSaWdodHM6VXNhZ2VUZXJtcz4KICAgPElwdGM0eG1wQ29yZTpDcmVhdG9yQ29udGFjdEluZm8KICAgIElwdGM0eG1wQ29yZTpDaUFkckV4dGFkcj0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ2l0eT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyUmVnaW9uPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lBZHJQY29kZT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ3RyeT0iIgogICAgSXB0YzR4bXBDb3JlOkNpVGVsV29yaz0iIgogICAgSXB0YzR4bXBDb3JlOkNpRW1haWxXb3JrPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lVcmxXb3JrPSIiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgiL5zQAABAwSURBVHjaYvz//z8DNsACYzz18fzPyMbK8P/XbwbpLdsZGUE6QIJcIiIM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' /></td> </tr>";		
	}		
    }
  
    html += "     </tbody>";
    html += "   </table>";
    
    html += "</div>";
    html += "<table>";
    html += " <thead>";
    html += "  <tr>";
    html += "    <td align='center'>"+show_help("Here you can choose the links you want in your linklist. Also you are able to select a custome name for the link (like PQ for PockerQuery).<br>If there is a text-field, then it is a custom-link. In this text-field you can type any URL you want to be added to the linklis. The checkbox behind defines, if the Link should be opened in a new window.")+"</td>";
    html += "  </tr>";
    html += " </thead>";
    html += " <tbody>";

    // Create reverse-Array
    var sort = new Array();
    for(var i=0; i<settings_bookmarks_list.length; i++){
      sort[settings_bookmarks_list[i]] = i;
    }
    var sort_beta = new Array();
    for(var i=0; i<settings_bookmarks_list_beta.length; i++){
      sort_beta[settings_bookmarks_list_beta[i]] = i;
    }

    // Create the Bookmark-Options
    var cust = 0;
    for(var i=0; i<bookmarks.length; i++){
      var options = "";
      for(var x=0; x<bookmarks.length; x++){
        options += "<option value='"+x+"' "+(sort[i] == x ? "selected='selected'" : "" )+">"+x+"</option>";
      }

      html += "  <tr>";
      html += "    <td style='padding: 4px 2px;' align='left' class='gclh_LinkListElement' id='gclh_LinkListElement_"+i+"' >";
      html += "<img style='height:12px;margin-right:5px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAtCAQAAACKL8qfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA82lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjardA/SgNBHMXx70TULloE67mAgmu15eQPi2ARYopsqkxmBw1hd4fZn3/2Bh7B43iDFIIXUVJbqARLwU/1eM2DB+rZDPujzjGUlcRsYvJZPteHGw7YAwDrmmDG4yuAqq48vynYvqEAXk/NsD/ib/ZdiAK8AEnhGwd8AKsHCQJqAfSW6yCgBOitp5MBqCegK/5RAAZ1aOPq5lb0eZqm2hT10uvrthFfNvqycnUMdbTiC+B7A+Aoi7bVmS1Lq5OzhH83y+f6K71PUYA62ey6HXcX73/+7FzAJ0sbODDOTdGSAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAFESURBVHja7JbBR0RRFMZ/975piFZDiogYHi0eebxVDKVFJGJ280Srp/6A/oOIaVlDpX0UbYdhaFPEWw0xGiI9ZjXE8BieWkxp0+beU7R43+auvp9zr3O+e1QIUKGKTxETZcTc0AIVQoNdbHVG5HhbHGEvnyfHO2EBiSY0JWRyNV0hoqepkwkAGQeamB2GloAhEfcqBJhlDZ9JI/uImCb9cV8Ipd7FCE2O+F+IX+iLwue5zKKxN6VNMkZMc8mKVQEp+xyrEK6oCu6x6njznIueYkYLYw/Kmmd5ar1wLULUNRDRtLSn7NEuAAPWqRBQNk6tFkmeWjniz1MLXKYMvQn9b8QmDeYsCnhgm64KIeAOx3bUWXI8OMW1fogSrxoMJ/SHXQthbiUaOBRsWwkXGrilxpsV4JENBl+tVSQw/M9GxHQAPgYA/ixGIgPoxNsAAAAASUVORK5CYII=' />";
      if(typeof(bookmarks[i]['custom']) != "undefined" && bookmarks[i]['custom'] == true){
        html += "<input style='padding-left: 2px; padding-right: 2px;' class='gclh_form' type='text' id='settings_custom_bookmark["+cust+"]' value='"+bookmarks[i]['href']+"' size='15'> ";
        html += "<input type='checkbox' title='Open in new Window' "+(bookmarks[i]['target'] == "_blank" ? "checked='checked'" : "" )+" id='settings_custom_bookmark_target["+cust+"]'>";
        cust++;
      }else{
        html += "<a class='gclh_ref' ";
        for(attr in bookmarks[i]){
          html += attr+"='"+bookmarks[i][attr]+"' ";
        }
        html += ">"+(typeof(bookmarks_orig_title[i]) != "undefined" && bookmarks_orig_title[i] != "" ? bookmarks_orig_title[i] : bookmarks[i]['title'])+"</a>";
      }
      html += "</td>";
      html += "    <td align='left' style='padding: 4px 2px;'>  <input style='padding-left: 2px; padding-right: 2px;'  class='gclh_form' id='bookmarks_name["+i+"]' type='text' size='15' value='"+(typeof(GM_getValue("settings_bookmarks_title["+i+"]")) != "undefined" ? GM_getValue("settings_bookmarks_title["+i+"]") : "")+"'></td>"; 
      html += "  </tr>";
    } 
    html += " </tbody>";
    html += "</table>";
    html += "</div>";
    html += "<br>";
    html += "";
    html += "<br>";
    html += "<input style='padding-left: 2px; padding-right: 2px;' class='gclh_form' type='button' value='save' id='btn_save'> <input class='gclh_form' type='button' value='close' id='btn_close2'> <div width='400px' align='right' class='gclh_small' style='float: right;'>GC little helper by <a href='http://www.amshove.net/' target='_blank'>Torsten Amshove</a></div>";    html += "</div>";
    div.innerHTML = html;

    document.getElementsByTagName('body')[0].appendChild(div);
    
    $(".gclh_LinkListDelIcon").click(function () {
		var row =  this.parentNode.parentNode;
		var tablebody = row.parentNode;
		$(row).remove();
		if(tablebody.children.length == 0){
			$('<tr class="gclh_LinkListPlaceHolder"><td>Drop here...</td></tr>').appendTo( tablebody ); 
		}
    });
    
    $( ".gclh_LinkListElement").draggable({          
            revert: "invalid", 
            helper: "clone",
	    start: function(event, ui) { $(ui.helper).addClass("gclh_form"); },
	    stop: function(event, ui) { $(ui.helper).removeClass("gclh_form"); }
    });
    
    $( "#gclh_LinkListTop" ).droppable({              
            accept: function(d) { 
                if(!d.hasClass("gclh_LinkListInlist") &&  d.hasClass("gclh_LinkListElement")){ 
		    var text = d.text();
		    if(text == "" || text == " "){
			text="Custom" + d[0].children[1].id.replace("settings_custom_bookmark[","").replace("]","");
		    }	
                    if($(this).find('tr[name="'+  text  +'"]').length == 0){
			return true;
		    }
                }      
            },                
            drop: function( event, ui ) {
                $( this ).find( ".gclh_LinkListPlaceHolder" ).remove();
                var id =  ui.draggable[0].id.replace("gclh_LinkListElement_","");
		var text = ui.draggable.text();
		if(text == "" || text == " "){
		    text="Custom" + ui.draggable[0].children[1].id.replace("settings_custom_bookmark[","").replace("]","");
		}
		var row = $( "<tr class='gclh_LinkListInlist' id='gclh_LinkListTop_"+id+"' name='"+ text  +"'></tr>" ).html("<td style='padding: 4px 2px;' ><img style='height:12px;margin-right:5px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAXCAQAAACo/wdSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA82lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjardA/SgNBHMXx70TULloE67mAgmu15eQPi2ARYopsqkxmBw1hd4fZn3/2Bh7B43iDFIIXUVJbqARLwU/1eM2DB+rZDPujzjGUlcRsYvJZPteHGw7YAwDrmmDG4yuAqq48vynYvqEAXk/NsD/ib/ZdiAK8AEnhGwd8AKsHCQJqAfSW6yCgBOitp5MBqCegK/5RAAZ1aOPq5lb0eZqm2hT10uvrthFfNvqycnUMdbTiC+B7A+Aoi7bVmS1Lq5OzhH83y+f6K71PUYA62ey6HXcX73/+7FzAJ0sbODDOTdGSAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEsSURBVHjapNKrS4NhFAbw376NwUAQ1rwgiIJgcrjo/gLFNIs3lrSYlgxLgphsgrgiODStCA4Ei0EM8olNEARBsAriYEkw7OK34SX4hBPO87znOee8J7asCzNe3UcTQRdddCm0+L2g36ldcSnHDqR6BVNC8x3xmmvjUUE70aAVOw8CKYetktv2QEm5Y5kMFBTwZk7JGBi2blUDRfmmxa2MGgbBACqyHts9lOU86cW9jCoJFfu+R92CdKDuN7wG/sC/BfGEgqTyD/Smp0DKgaOvz+kg7cyOeNNiRWgC77TitNBss4eaG0wK5d2CO2uujeLCRWyZpF0b4MUQno2ALVs+Yq2TyzvUF12QJefRMauykVu8kWnS0T08yKqAPTnP7XQiUrZh1ZW6k+i0nwMAV0JH/Qo6+gQAAAAASUVORK5CYII=' />" + text  +'</td> <td style="width:24px;"><img class="gclh_LinkListDelIcon" style="height:22px;"src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADZBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMi4yLWMwNjMgNTMuMzUyNjI0LCAyMDA4LzA3LzMwLTE4OjA1OjQxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIKICAgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cDovL2Jsb2cuYWRkaWN0ZWR0b2NvZmZlZS5kZSIKICAgcGhvdG9zaG9wOkF1dGhvcnNQb3NpdGlvbj0iIj4KICAgPGRjOnJpZ2h0cz4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+wqkgICAgICAgICAgICYjeEE7IDIwMDkgYnkgT2xpdmVyIFR3YXJkb3dza2k8L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpyaWdodHM+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5PbGl2ZXIgVHdhcmRvd3NraTwvcmRmOmxpPgogICAgPC9yZGY6U2VxPgogICA8L2RjOmNyZWF0b3I+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCIvPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wUmlnaHRzOlVzYWdlVGVybXM+CiAgICA8cmRmOkFsdD4KICAgICA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiLz4KICAgIDwvcmRmOkFsdD4KICAgPC94bXBSaWdodHM6VXNhZ2VUZXJtcz4KICAgPElwdGM0eG1wQ29yZTpDcmVhdG9yQ29udGFjdEluZm8KICAgIElwdGM0eG1wQ29yZTpDaUFkckV4dGFkcj0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ2l0eT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyUmVnaW9uPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lBZHJQY29kZT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ3RyeT0iIgogICAgSXB0YzR4bXBDb3JlOkNpVGVsV29yaz0iIgogICAgSXB0YzR4bXBDb3JlOkNpRW1haWxXb3JrPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lVcmxXb3JrPSIiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgiL5zQAABAwSURBVHjaYvz//z8DNsACYzz18fzPyMbK8P/XbwbpLdsZGUE6QIJcIiIM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" /></td>' );
                row.find(".gclh_LinkListDelIcon").click(function () {
                    var row =  this.parentNode.parentNode;
                    var tablebody = row.parentNode;
                    $(row).remove();
                    if(tablebody.children.length == 0){
                           $('<tr class="gclh_LinkListPlaceHolder"><td>Drop here...</td></tr>').appendTo( tablebody ); 
                    }
                });
                $(row).appendTo( this );               
            }
        }).sortable({
            items: "tr:not(.gclh_LinkListPlaceHolder)"           
        });
	
	$( "#gclh_LinkListMap" ).droppable({              
            accept: function(d) { 
                if(!d.hasClass("gclh_LinkListInlist") &&  d.hasClass("gclh_LinkListElement")){ 
		    var text = d.text();
		    if(text == "" || text == " "){
			text="Custom" + d[0].children[1].id.replace("settings_custom_bookmark[","").replace("]","");
		    }	
                    if($(this).find('tr[name="'+  text  +'"]').length == 0){
			return true;
		    }
                }      
            },                
            drop: function( event, ui ) {
                $( this ).find( ".gclh_LinkListPlaceHolder" ).remove();
                var id =  ui.draggable[0].id.replace("gclh_LinkListElement_","");
		var text = ui.draggable.text();
		if(text == "" || text == " "){
		    text="Custom" + ui.draggable[0].children[1].id.replace("settings_custom_bookmark[","").replace("]","");
		}
		var row = $( "<tr class='gclh_LinkListInlist' id='gclh_LinkListMap_"+id+"' name='"+ text  +"'></tr>" ).html("<td style='padding: 4px 2px;' ><img style='height:12px;margin-right:5px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAXCAQAAACo/wdSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA82lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjardA/SgNBHMXx70TULloE67mAgmu15eQPi2ARYopsqkxmBw1hd4fZn3/2Bh7B43iDFIIXUVJbqARLwU/1eM2DB+rZDPujzjGUlcRsYvJZPteHGw7YAwDrmmDG4yuAqq48vynYvqEAXk/NsD/ib/ZdiAK8AEnhGwd8AKsHCQJqAfSW6yCgBOitp5MBqCegK/5RAAZ1aOPq5lb0eZqm2hT10uvrthFfNvqycnUMdbTiC+B7A+Aoi7bVmS1Lq5OzhH83y+f6K71PUYA62ey6HXcX73/+7FzAJ0sbODDOTdGSAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEsSURBVHjapNKrS4NhFAbw376NwUAQ1rwgiIJgcrjo/gLFNIs3lrSYlgxLgphsgrgiODStCA4Ei0EM8olNEARBsAriYEkw7OK34SX4hBPO87znOee8J7asCzNe3UcTQRdddCm0+L2g36ldcSnHDqR6BVNC8x3xmmvjUUE70aAVOw8CKYetktv2QEm5Y5kMFBTwZk7JGBi2blUDRfmmxa2MGgbBACqyHts9lOU86cW9jCoJFfu+R92CdKDuN7wG/sC/BfGEgqTyD/Smp0DKgaOvz+kg7cyOeNNiRWgC77TitNBss4eaG0wK5d2CO2uujeLCRWyZpF0b4MUQno2ALVs+Yq2TyzvUF12QJefRMauykVu8kWnS0T08yKqAPTnP7XQiUrZh1ZW6k+i0nwMAV0JH/Qo6+gQAAAAASUVORK5CYII=' />" + text  +'</td> <td style="width:24px;"><img class="gclh_LinkListDelIcon" style="height:22px;"src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADZBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMi4yLWMwNjMgNTMuMzUyNjI0LCAyMDA4LzA3LzMwLTE4OjA1OjQxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIKICAgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cDovL2Jsb2cuYWRkaWN0ZWR0b2NvZmZlZS5kZSIKICAgcGhvdG9zaG9wOkF1dGhvcnNQb3NpdGlvbj0iIj4KICAgPGRjOnJpZ2h0cz4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+wqkgICAgICAgICAgICYjeEE7IDIwMDkgYnkgT2xpdmVyIFR3YXJkb3dza2k8L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpyaWdodHM+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5PbGl2ZXIgVHdhcmRvd3NraTwvcmRmOmxpPgogICAgPC9yZGY6U2VxPgogICA8L2RjOmNyZWF0b3I+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCIvPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wUmlnaHRzOlVzYWdlVGVybXM+CiAgICA8cmRmOkFsdD4KICAgICA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiLz4KICAgIDwvcmRmOkFsdD4KICAgPC94bXBSaWdodHM6VXNhZ2VUZXJtcz4KICAgPElwdGM0eG1wQ29yZTpDcmVhdG9yQ29udGFjdEluZm8KICAgIElwdGM0eG1wQ29yZTpDaUFkckV4dGFkcj0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ2l0eT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyUmVnaW9uPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lBZHJQY29kZT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ3RyeT0iIgogICAgSXB0YzR4bXBDb3JlOkNpVGVsV29yaz0iIgogICAgSXB0YzR4bXBDb3JlOkNpRW1haWxXb3JrPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lVcmxXb3JrPSIiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgiL5zQAABAwSURBVHjaYvz//z8DNsACYzz18fzPyMbK8P/XbwbpLdsZGUE6QIJcIiIM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" /></td>' );
                row.find(".gclh_LinkListDelIcon").click(function () {
                    var row =  this.parentNode.parentNode;
                    var tablebody = row.parentNode;
                    $(row).remove();
                    if(tablebody.children.length == 0){
                           $('<tr class="gclh_LinkListPlaceHolder"><td>Drop here...</td></tr>').appendTo( tablebody ); 
                    }
                });
                $(row).appendTo( this );               
            }
        }).sortable({
            items: "tr:not(.gclh_LinkListPlaceHolder)"           
        });
    
    if(typeof opera == "object" || typeof(chrome) != "undefined")
    {
	    var homezonepic = new jscolor.color(document.getElementById("settings_homezone_color"), {required:true, adjust:true, hash:true, caps:true, pickerMode:'HSV', pickerPosition:'right'});
    }
    else
    {
	    var code = GM_getResourceText("jscolor");
	    code += 'var homezonepic = new jscolor.color(document.getElementById("settings_homezone_color"), {required:true, adjust:true, hash:true, caps:true, pickerMode:\'HSV\', pickerPosition:\'right\'});'
	    var script = document.createElement("script");
	    script.innerHTML = code;
	    document.getElementsByTagName("body")[0].appendChild(script);
	}


    function gclh_show_linklist(){
      var linklist = document.getElementById('gclh_settings_linklist');
      var lnk = document.getElementById('gclh_show_linklist_btn');

      if(linklist.style.display == 'none'){
        linklist.style.display = '';
        lnk.innerHTML = "hide";
      }else{
        linklist.style.display = 'none';
        lnk.innerHTML = "show";
      }
    }
    document.getElementById('gclh_show_linklist_btn').addEventListener("click",gclh_show_linklist,false);
    document.getElementById('gclh_linklist_link_1').addEventListener("click",gclh_show_linklist,false);
    document.getElementById('gclh_linklist_link_2').addEventListener("click",gclh_show_linklist,false);

    // Give the buttons an function
    document.getElementById('btn_close2').addEventListener("click", btnClose, false);
    document.getElementById('btn_save').addEventListener("click", btnSave, false);
  }

  // Save Button
  function btnSave(){
    var value = document.getElementById("settings_home_lat_lng").value;
    if(value.match(/^(N|S) [0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9] (E|W) [0-9][0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9]$/)){
      var latlng = toDec(value);
      if(GM_getValue("home_lat",0) != parseInt(latlng[0]*10000000)) GM_setValue("home_lat",parseInt(latlng[0]*10000000)); // * 10000000 because GM don't know float
      if(GM_getValue("home_lng",0) != parseInt(latlng[1]*10000000)) GM_setValue("home_lng",parseInt(latlng[1]*10000000));
    }
    GM_setValue("settings_bookmarks_search_default",document.getElementById('settings_bookmarks_search_default').value);
    GM_setValue("settings_show_all_logs_count",document.getElementById('settings_show_all_logs_count').value);
    GM_setValue("settings_homezone_radius",document.getElementById('settings_homezone_radius').value);
    GM_setValue("settings_homezone_color",document.getElementById('settings_homezone_color').value);
//    GM_setValue("map_width",document.getElementById('map_width').value);
    GM_setValue("settings_new_width",document.getElementById('settings_new_width').value);
    GM_setValue("settings_date_format",document.getElementById('settings_date_format').value);
    GM_setValue("settings_default_logtype",document.getElementById('settings_default_logtype').value);
    GM_setValue("settings_default_logtype_event",document.getElementById('settings_default_logtype_event').value);
    GM_setValue("settings_default_tb_logtype",document.getElementById('settings_default_tb_logtype').value);
    GM_setValue("settings_mail_signature",document.getElementById('settings_mail_signature').value.replace(/‌/g,"")); // Fix: Entfernt das Steuerzeichen
    GM_setValue("settings_log_signature",document.getElementById('settings_log_signature').value.replace(/‌/g,""));
    GM_setValue("settings_tb_signature",document.getElementById('settings_tb_signature').value.replace(/‌/g,""));
    GM_setValue("settings_map_default_layer",document.getElementById('settings_map_default_layer').value);
    GM_setValue("settings_hover_image_max_size",document.getElementById('settings_hover_image_max_size').value);
    GM_setValue("settings_spoiler_strings",document.getElementById('settings_spoiler_strings').value);

    
    var new_map_layers = document.getElementById('settings_map_layers');
    var new_settings_map_layers = new Array();
    for(var i=0; i<new_map_layers.options.length; i++){
      if(new_map_layers.options[i].selected) new_settings_map_layers.push(new_map_layers.options[i].value);
    }
    GM_setValue('settings_map_layers',new_settings_map_layers.join("###"));

    var checkboxes = new Array(
      'settings_submit_log_button',
      'settings_log_inline',
      'settings_log_inline_pmo4basic',
      'settings_log_inline_tb',
      'settings_bookmarks_show',
      'settings_bookmarks_on_top',
      'settings_bookmarks_search',
      'settings_redirect_to_map',
      'settings_hide_facebook',
      'settings_hide_socialshare',
      'settings_hideable_souvenirs',  
//      'settings_hide_feedback',
      'settings_hide_disclaimer',
      'settings_hide_cache_notes',
      'settings_hide_empty_cache_notes',
      'settings_breaks_in_cache_notes',
      'settings_show_all_logs',
      'settings_decrypt_hint',
      'settings_show_bbcode',
      'settings_show_eventday',
      'settings_show_datepicker',
      'settings_show_mail',
      'settings_show_mail_coordslink',
      'settings_show_google_maps',
      'settings_show_log_it',
      'settings_show_nearestuser_profil_link',
//      'settings_dynamic_map',
      'settings_show_homezone',
      'settings_show_hillshadow',
//      'settings_old_map',
      'remove_navi_learn',
      'remove_navi_partnering',
      'remove_navi_play',
      'remove_navi_profile',
//      'remove_navi_join',
      'remove_navi_community',
      'remove_navi_videos',
//      'remove_navi_resources',
      'remove_navi_shop',
      'remove_navi_social',
      'settings_bookmarks_top_menu',
      'settings_hide_advert_link',
      'settings_hide_line_breaks',
      'settings_hide_spoilerwarning',
      'settings_hide_top_button',
      'settings_hide_hint',
      'settings_strike_archived',
      'settings_highlight_usercoords',
      'settings_map_hide_found',
      'settings_map_hide_hidden',
      'settings_map_hide_2',
      'settings_map_hide_9',
      'settings_map_hide_5',
      'settings_map_hide_3',
      'settings_map_hide_6',
      'settings_map_hide_453',
      'settings_map_hide_13',
      'settings_map_hide_1304',
      'settings_map_hide_4',
      'settings_map_hide_11',
      'settings_map_hide_137',
      'settings_map_hide_8',
      'settings_map_hide_1858',
//      'settings_map_add_layer',
      'settings_show_fav_percentage',
      'settings_show_vip_list',
      'settings_show_owner_vip_list',
      'settings_autovisit',
      'settings_show_thumbnails',
      'settings_imgcaption_on_top',
      'settings_hide_avatar',
      'settings_show_big_gallery',
      'settings_automatic_friend_reset',
      'settings_show_long_vip',
      'settings_load_logs_with_gclh',
      'settings_hide_map_header',
      'settings_replace_log_by_last_log',
      'settings_show_real_owner',
      'settings_hide_visits_in_profile',
      'settings_log_signature_on_fieldnotes',
      'settings_vip_show_nofound',
      'settings_use_gclh_layercontrol',
      'settings_map_hide_sidebar'
//      'settings_hide_recentlyviewed'
    );
    for (var i = 0; i < checkboxes.length; i++) {
      GM_setValue(checkboxes[i], document.getElementById(checkboxes[i]).checked);
    }

    // Save Log-Templates
    for(var i = 0; i < anzTemplates; i++){
      var name = document.getElementById('settings_log_template_name['+i+']');
      var text = document.getElementById('settings_log_template['+i+']');
      if(name && text){
        GM_setValue('settings_log_template_name['+i+']',name.value);
        GM_setValue('settings_log_template['+i+']',text.value.replace(/‌/g,"")); // Fix: Entfernt das Steuerzeichen
      }
    }

    // Create the settings_bookmarks_list Array (gclh_LinkListTop)
    var queue = $("#gclh_LinkListTop tr:not(.gclh_LinkListPlaceHolder)");
    var tmp = new Array();
    for(var i=0; i<queue.length; i++){
	tmp[i] = queue[i].id.replace("gclh_LinkListTop_", "");
    }
    GM_setValue("settings_bookmarks_list",uneval(tmp));
    
    // Create the settings_bookmarks_list_beta Array (gclh_LinkListMap)
    var queue = $("#gclh_LinkListMap tr:not(.gclh_LinkListPlaceHolder)");
    var tmp = new Array();
    for(var i=0; i<queue.length; i++){
	tmp[i] = queue[i].id.replace("gclh_LinkListMap_", "");
    }
    GM_setValue("settings_bookmarks_list_beta",uneval(tmp));
    
    for(var i=0; i<bookmarks.length; i++){
	if(document.getElementById('bookmarks_name['+i+']') && document.getElementById('bookmarks_name['+i+']') != ""){ // Set custom name
          GM_setValue("settings_bookmarks_title["+i+"]",document.getElementById('bookmarks_name['+i+']').value);
        }
    }
    
    // Save custom-Link URLs
    for(var i=0; i<anzCustom; i++){
      GM_setValue("settings_custom_bookmark["+i+"]",document.getElementById("settings_custom_bookmark["+i+"]").value);
      if(document.getElementById('settings_custom_bookmark_target['+i+']').checked) GM_setValue('settings_custom_bookmark_target['+i+']',"_blank");
      else GM_setValue('settings_custom_bookmark_target['+i+']',"");
    }
	if(document.location.href.indexOf("#")==-1 || document.location.href.indexOf("#") == document.location.href.length -1){
		$('html, body').animate({ scrollTop: 0 }, 0);
		document.location.reload(true);
	}
	else{
		document.location.replace(document.location.href.slice(0,document.location.href.indexOf("#")));
	}
  }
}

// Show Config-Links
try{
  if(this.GM_registerMenuCommand && !document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\//)) GM_registerMenuCommand("little helper config", gclh_showConfig); // Hide on Beta-Map

  if((document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/[#a-zA-Z-_]*$/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/default\.aspx/)) && document.getElementById('ctl00_ContentBody_WidgetMiniProfile1_logOutLink')){
    var lnk = " | <a href='#' id='gclh_config_lnk'>GClh Config</a>";
    document.getElementById('ctl00_ContentBody_WidgetMiniProfile1_logOutLink').parentNode.innerHTML += lnk;
    document.getElementById('gclh_config_lnk').addEventListener("click", gclh_showConfig, false);
    if(document.location.href.match(/#GClhShowConfig/)){	  
	setTimeout(gclh_showConfig,5);
    }
  }
}catch(e){ gclh_error("Show GClh-Config Links",e); }

// Hide Avatars option - must be placed here, because it has a link to the gclh_config page
try{
  if(settings_load_logs_with_gclh && document.location.href.match(/^http:\/\/www\.geocaching\.com\/account\/ManagePreferences\.aspx/) && document.getElementById("ctl00_ContentBody_uxShowCacheLogAvatars")){
    var avatar_checkbox = document.getElementById("ctl00_ContentBody_uxShowCacheLogAvatars");
    var hinweis = document.createElement("font");
    var link = document.createElement("a");
    link.setAttribute("href","javascript:void(0);");
    link.appendChild(document.createTextNode("here"));
    link.addEventListener("click", gclh_showConfig, false);
    hinweis.setAttribute("color","#FF0000");
    hinweis.appendChild(document.createTextNode("You are using \"GC little helper\" - you have to change this option "));
    hinweis.appendChild(link);
    avatar_checkbox.checked = !settings_hide_avatar;
    avatar_checkbox.disabled = "disabled";
    avatar_checkbox.parentNode.appendChild(document.createElement("br"));
    avatar_checkbox.parentNode.appendChild(hinweis);
  }
}catch(e){ gclh_error("Hide gc.com Avatar-Option",e); }

// Check for Updates
function checkVersion(){
  var url = "http://www.amshove.net/greasemonkey/updates.php";
  var time = new Date().getTime();
  var next_check = 24 * 60 * 60 * 1000; // Milliseconds
  var last_check = parseInt(GM_getValue("update_last_check"),10);
  var token = GM_getValue("token","");
  if(token == "") GM_setValue("token",""+Math.random());

  if(!last_check) last_check = 0;

  if((last_check + next_check) < time){
    if(GM_xmlhttpRequest) GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      headers: {'User-Agent' : 'GM ' + scriptName + ' v' + scriptVersion + ' ' + last_check + ' ' + token},
      onload: function(result) {
        var version = result.responseText.match(/^([a-zA-Z0-9-_.]*)=([0-9.]*)/);
        var changelog = result.responseText.match(/changelog=((.*\n*)*)/);

        GM_setValue("new_version",version[2]);

        if(version[1] == scriptName && version[2] != scriptVersion){
          var text = "Version "+version[2]+" of "+scriptName+" greasemonkey script is available.\n"+
                  "You are currently using version "+scriptVersion+".\n\n"+
                  "Click OK to upgrade.\n";
          if(changelog) text += "\n\nChangelog:\n"+changelog[1];
          if(window.confirm(text)) GM_openInTab(url);
        }
      }
    });
    GM_setValue('update_last_check', time.toString());
  }
}

try{
  checkVersion();
}catch(e){ gclh_error("Check for Updates",e); }

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Config Sync
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
if(settings_configsync_enabled){
  var sync_url = "http://localhost/GClh_web/";
  var browserID = GM_getValue("token");
  var configID = GM_getValue("settings_configsync_configid",0);

  // Sync: Helper
  function sync_changeConfigID(new_ConfigID){
    configID = new_ConfigID;
//    GM_setValue("settings_configsync_configid",ConfigID);
    if(document.getElementById('configID_text')) document.getElementById('configID_text').innerHTML = configID;
    if(document.getElementById('work_with_text')) document.getElementById('work_with_text').style.color = '';
    if(document.getElementById('btn_uploadConfig')) document.getElementById('btn_uploadConfig').disabled = '';
    if(document.getElementById('btn_downloadConfig')) document.getElementById('btn_downloadConfig').disabled = '';
  }
  function encode64(inp){ // http://mrfoo.de/archiv/434-Base64-in-Javascript.html
    var key="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var chr1,chr2,chr3,enc3,enc4,i=0,out="";
    while(i<inp.length){
      chr1=inp.charCodeAt(i++);if(chr1>127) chr1=88;
      chr2=inp.charCodeAt(i++);if(chr2>127) chr2=88;
      chr3=inp.charCodeAt(i++);if(chr3>127) chr3=88;
      if(isNaN(chr3)) {enc4=64;chr3=0;} else enc4=chr3&63;
      if(isNaN(chr2)) {enc3=64;chr2=0;} else enc3=((chr2<<2)|(chr3>>6))&63;
      out+=key.charAt((chr1>>2)&63)+key.charAt(((chr1<<4)|(chr2>>4))&63)+key.charAt(enc3)+key.charAt(enc4);
    }
//    return encodeURIComponent(out);
    return out;
  }

  // Sync: Create new Config
  function sync_createConfig(){

  }

  // Sync: Assign existing Config
  function sync_assignConfig(){
    if(document.getElementById('assign_configID')) sync_changeConfigID(document.getElementById('assign_configID').value);
  }

  // Sync: Upload Config
  function sync_uploadConfig(){
    if(!configID) return false;

    var vals = new Array;
    var allVals = GM_listValues();
    var val;
    for (var valName in allVals) {
      val=allVals[valName];
      var value = GM_getValue(val);

      if(typeof(value) != "boolean"){
        if(!value.substr || value.substr(0,1) != "[") value = "\""+encode64(value)+"\"";
        else{
          var arr = eval(value);
          var new_arr = new Array();
          for(var i=0; i<arr.length; i++){
            if(arr[i]) new_arr.push(encode64(arr[i]));
          }
          value = uneval(new_arr);
        }
      }else{
        if(value) value = "true";
        else value = "false";
        value = "\""+encode64(value)+"\"";
      }

      vals.push("\""+encode64(val)+"\" : "+value);
    }

//alert(uneval(vals));
//alert(encode64("{"+vals.join(",")+"}"));
    GM_xmlhttpRequest({
      method: "POST",
      headers: {'User-Agent' : 'GM ' + scriptName + ' v' + scriptVersion + ' ' + browserID},
      url: sync_url+"uploadConfig.php",
      data: "configID="+configID+"&json="+encode64("{"+vals.join(",")+"}"),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) {
        alert("uploaded: "+uneval(response)); // TODO
      }
    });
  }

  // Sync: Download Config
  function sync_downloadConfig(){
    if(!configID) return false;

  }

  // Sync: Configuration Menu
  function gclh_sync_showConfig(){
    // the configuration is always displayed at the top, so scroll away from logs or other lower stuff
    scroll(0, 0);
  
    if(document.getElementById('bg_shadow')){
      // If shadow-box already created, just show it
      if(document.getElementById('bg_shadow').style.display == "none"){
        document.getElementById('bg_shadow').style.display = "";
      }
    }else{
      // Seite abdunkeln
      var shadow = document.createElement("div");
      shadow.setAttribute("id","bg_shadow");
      shadow.setAttribute("style","width: 100%; height: 100%; background-color: #000000; position:fixed; top: 0; left: 0; opacity: 0.5; filter: alpha(opacity=50);");
      document.getElementsByTagName('body')[0].appendChild(shadow);
      document.getElementById('bg_shadow').addEventListener("click", btnClose, false);
    }
  
    if(document.getElementById('sync_settings_overlay') && document.getElementById('sync_settings_overlay').style.display == "none"){
      // If menu already created, just show it
      document.getElementById('sync_settings_overlay').style.display = "";
    }else{
      create_config_css();
  
      var div = document.createElement("div");
      div.setAttribute("id","sync_settings_overlay");
      div.setAttribute("class","settings_overlay");
      var html = "";
      html += "<h3 class='gclh_headline'>GC little helper - Configuration Sync</h3>";
      html += "<div class='gclh_content'>";
//      html += "<font class='gclh_small'><a href='http://www.amshove.net/bugtracker/wiki/gclittlehelper%3AGermanHelp' target='_blank'>Hier</a> gibt es eine deutsche Anleitung zu den Einstellungen.</font>";
      html += "<table border=0>";
      html += "  <tr><td class='gclh_small'>";
      html += "<b>BrowserID:</b> "+browserID;
      html += "  </td><td class='gclh_small'>";
      html += "<b>ConfigID:</b> <font id='configID_text'>"+(configID ? configID : "&lt;no config set&gt;")+"</font>";
      html += "  </td></tr>";
      html += "</table>";

      html += "<h4 class='gclh_headline2'>Configure Config-Sync</h4>";
      html += "<font class='gclh_small'>For syncing the configuration you have to know, there is a local copy of your configuration on every browser/PC you use. Also there is a configuration on the server. With this sync-Process you are able to upload your local config to the server and download it with another browser/pc to the local settings. With this function you are able to use the same configuration on multiple PCs.<br>";
      html += "Every configuration on the Server has a <b>ConfigID</b>. If the ConfigID above is empty, there is no Server-Configuration assigned to this browser. Then you have to create one or use an existing one. If you create a new config, all your settings will be uploaded to the server and you get an ConfigID for this Server-Configuration. On the second (or third, or ..) browser/PC you have to use the <b>\"Use existing ConfigID\"</b>-Option. You just have to type the ConfigID of your first browser to the text-field and apply with the button <b>assign Config</b>.<br></font>";
      html += "<br>";
      html += "<input class='gclh_form' type='button' value='create new Config' id='btn_createConfig'>";
      html += "<br><br>";
      html += "Use existing ConfigID:<br>";
      html += "<input class='gclh_form' type='text' value='' id='assign_configID' size='20'>";
      html += "<input class='gclh_form' type='button' value='assign Config' id='btn_assignConfig'>";

      html += "<br><br>";
      html += "<h4 class='gclh_headline2'>Work with Config-Sync</h4>";
      html += "<font id='work_with_text' class='gclh_small' "+(configID ? "" : "style='color: #999999'")+">After you have assigned a valid ConfigID to this browser, you are now able to <b>upload Config</b> to the server or to <b>download Config</b> from the server. If you upload it, all configuration-items on the server will be overwritten by your actual local config. If you download the config from the server, all your local configuration-items will be overwritten by the config, saved on the server.<br></font>";
      html += "<br>";
      html += "<input class='gclh_form' type='button' value='upload Config' id='btn_uploadConfig' "+(configID ? "" : "disabled")+"> ";
      html += "<input class='gclh_form' type='button' value='download Config' id='btn_downloadConfig' "+(configID ? "" : "disabled")+">";

      html += "<br>";
      html += "";
      html += "<br>";
//      html += "<input class='gclh_form' type='button' value='save' id='btn_save'> ";
      html += "<input class='gclh_form' type='button' value='close' id='btn_close3'>";
//      html += " <div width='400px' align='right' class='gclh_small' style='float: right;'>GC little helper by <a href='http://www.amshove.net/' target='_blank'>Torsten Amshove</a></div>";
      html += "</div>";
      div.innerHTML = html;
  
      document.getElementsByTagName('body')[0].appendChild(div);
      document.getElementById('btn_createConfig').addEventListener("click", sync_createConfig, false);
      document.getElementById('btn_assignConfig').addEventListener("click", sync_assignConfig, false);
      document.getElementById('btn_uploadConfig').addEventListener("click", sync_uploadConfig, false);
      document.getElementById('btn_downloadConfig').addEventListener("click", sync_downloadConfig, false);
      document.getElementById('btn_close3').addEventListener("click", btnClose, false);
    }
  }
  if(this.GM_registerMenuCommand && !document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\//)) GM_registerMenuCommand("little helper config sync", gclh_sync_showConfig); // Hide on Beta-Map
} // Config Sync

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

} // Google Maps site
} // Function "main" 

//Helperfunctions to inject functions into site context
function injectPageScript(scriptContent){
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.innerHTML = scriptContent;
    var pageHead = document.getElementsByTagName("head")[0];
    pageHead.appendChild(script);
}

function injectPageScriptFunction(funct, functCall){
    injectPageScript("("+funct.toString()+")"+functCall+";");    
}

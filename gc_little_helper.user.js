// ==UserScript==
// @name           GC little helper
// @namespace      http://www.amshove.net
// @include        http://www.geocaching.com/*
// @description    Some little things to make life easy (on www.geocaching.com).
// ==/UserScript==
//
// Author:         Torsten Amshove <torsten@amshove.net>
// Version:        1.0             - 24.06.2010
// Changelog:      1.0             - Bookmark-Liste fuer Profilseite und Header
//                                 - F2-Shortcut fuer den Log-Button
//                                 - Automatische Weiterleitung zur Kartenansicht
//                                 - Alle Logs Anzeigen


////////////////////////////////////////////////////////////////////////////

var bookmarks = new Array();

bookmarks[0] = new Object();
bookmarks[0]['href'] = "/bookmarks/default.aspx";
bookmarks[0]['title'] = "Bookmarks";

bookmarks[1] = new Object();
bookmarks[1]['href'] = "/my/uploadfieldnotes.aspx";
bookmarks[1]['title'] = "Field Notes";

bookmarks[2] = new Object();
bookmarks[2]['href'] = "/pocket/default.aspx";
bookmarks[2]['title'] = "Pocket Queries";

bookmarks[3] = new Object();
bookmarks[3]['href'] = "/find/default.aspx";
bookmarks[3]['title'] = "Find Player";

bookmarks[4] = new Object();
bookmarks[4]['href'] = "/notify/default.aspx";
bookmarks[4]['title'] = "Notifications";

bookmarks[5] = new Object();
bookmarks[5]['href'] = "/my/userroutes.aspx#find";
bookmarks[5]['title'] = "Routes";

////////////////////////////////////////////////////////////////////////////

// Set defaults
var scriptName = "gc_little_helper";
var scriptVersion = "1.0";

if(GM_getValue("init") != "no"){
  GM_setValue("settings_submit_log_button",true);
  GM_setValue("settings_bookmarks",true);
  GM_setValue("settings_bookmarks_on_top",true);
  GM_setValue("settings_redirect_to_map",true);
  GM_setValue("settings_show_all_logs",false);
  GM_setValue("init","no");
}

// Settings: Submit Log on F2
settings_submit_log_button = GM_getValue("settings_submit_log_button");
if(settings_submit_log_button) GM_registerMenuCommand("Submit Log on F2:   true", settingsSubmitButton);
else GM_registerMenuCommand("Submit Log on F2:   false", settingsSubmitButton);

function settingsSubmitButton(){
  if(settings_submit_log_button) settings_submit_log_button = false;
  else settings_submit_log_button = true;
  GM_setValue("settings_submit_log_button",settings_submit_log_button);
  document.location.reload(true);
}

// Settings: Show Bookmarks
settings_bookmarks = GM_getValue("settings_bookmarks");
if(settings_bookmarks) GM_registerMenuCommand("Show Bookmarks:    true", settingsBookmarks);
else GM_registerMenuCommand("Show Bookmarks:    false", settingsBookmarks);

function settingsBookmarks(){
  if(settings_bookmarks) settings_bookmarks = false;
  else settings_bookmarks = true;
  GM_setValue("settings_bookmarks",settings_bookmarks);
  document.location.reload(true);
}

// Settings: Bookmarks on Top
settings_bookmarks_on_top = GM_getValue("settings_bookmarks_on_top");
if(settings_bookmarks_on_top) GM_registerMenuCommand("Bookmarks on top:  true", settingsBookmarksOnTop);
else GM_registerMenuCommand("Bookmarks on top:  false", settingsBookmarksOnTop);

function settingsBookmarksOnTop(){
  if(settings_bookmarks_on_top) settings_bookmarks_on_top = false;
  else settings_bookmarks_on_top = true;
  GM_setValue("settings_bookmarks_on_top",settings_bookmarks_on_top);
  document.location.reload(true);
}

// Settings: Redirect to Map
settings_redirect_to_map = GM_getValue("settings_redirect_to_map");
if(settings_redirect_to_map) GM_registerMenuCommand("Redirect to Map:     true", settingsRedirectToMap);
else GM_registerMenuCommand("Redirect to Map:     false", settingsRedirectToMap);

function settingsRedirectToMap(){
  if(settings_redirect_to_map) settings_redirect_to_map = false;
  else settings_redirect_to_map = true;
  GM_setValue("settings_redirect_to_map",settings_redirect_to_map);
  document.location.reload(true);
}

// Settings: Show all Logs
settings_show_all_logs = GM_getValue("settings_show_all_logs");
if(settings_show_all_logs) GM_registerMenuCommand("Show all Logs:         true", settingsShowAllLogs);
else GM_registerMenuCommand("Show all Logs:         false", settingsShowAllLogs);

function settingsShowAllLogs(){
  if(settings_show_all_logs) settings_show_all_logs = false;
  else settings_show_all_logs = true;
  GM_setValue("settings_show_all_logs",settings_show_all_logs);
  document.location.reload(true);
}
////////////////////////////////////////////////////////////////////////////

// F2 zum Log abschicken
if(settings_submit_log_button && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|ID)\=/)){
  function keydown(e){
    if(e.keyCode == 113){
      document.getElementById("ctl00_ContentBody_LogBookPanel1_LogButton").click();
    }
  }

  window.addEventListener('keydown', keydown, true);
}

// Bookmark-Liste im Profil
if(settings_bookmarks && document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/$/)){
  var side = document.getElementById("ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel");

  var header = document.createElement("h3");
  header.setAttribute("class","WidgetHeader");
  header.appendChild(document.createTextNode(" Bookmarks"));

  var div = document.createElement("div");
  div.setAttribute("class","WidgetBody ProfileWidget");

  var ul = document.createElement("ul");

  for(var i=0; i < bookmarks.length; i++){
    var a = document.createElement("a");

    for(attr in bookmarks[i]){
      a.setAttribute(attr,bookmarks[i][attr]);
    }

    a.appendChild(document.createTextNode(bookmarks[i]['title']));

    var li = document.createElement("li");
    li.appendChild(a);

    ul.appendChild(li);
  }

  div.appendChild(ul);
  side.appendChild(header);
  side.appendChild(div);
}

// Bookmarks on top
if(settings_bookmarks_on_top){
  var head = document.getElementById("hd");
  var p = document.createElement("p");
  p.setAttribute("class","HalfRight");
  p.setAttribute("style","width: 100%; text-align: right; font-size: 85%; color: #CDD8E8;");

  for(var i=0; i < bookmarks.length; i++){
    var a = document.createElement("a");

    for(attr in bookmarks[i]){
      a.setAttribute(attr,bookmarks[i][attr]);
    }

    a.appendChild(document.createTextNode(bookmarks[i]['title']));

    p.appendChild(a);

    if(i != bookmarks.length-1) p.appendChild(document.createTextNode(" | "));
  }
  head.appendChild(p);
}

// Redirect to Map
if(settings_redirect_to_map && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)){
  var latlng = document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?lat=([0-9.]*)\&lng\=([0-9.]*)/);

  document.location.href = "http://www.geocaching.com/map/default.aspx?lat="+latlng[1]+"&lng="+latlng[2];
}

// Show all Logs
if(settings_show_all_logs && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?guid\=[a-zA-Z0-9-]*$/)){
  document.location.href = document.location.href+"&log=y";
}

// Check for Updates
function checkVersion(){
  var url = "http://www.amshove.net/greasemonkey/updates.php";
  var time = new Date().getTime();
  var next_check = 24 * 60 * 60 * 1000; // Milliseconds
  var last_check = parseInt(GM_getValue("update_last_check"));

  if(!last_check) last_check = 0;

  if((last_check + next_check) < time){
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      headers: {'User-Agent' : 'GM ' + scriptName + ' v' + scriptVersion + ' ' + last_check},
      onload: function(result) {
        var version = result.responseText.match(/^([a-zA-Z0-9-_.]*)=([0-9.]*)$/);

        if(version[1] == scriptName && version[2] != scriptVersion){
          if(window.confirm("Version "+version[2]+" of "+scriptName+" greasemonkey script is available.\n"+
                  "You are currently using version "+scriptVersion+".\n\n"+
                  "Click OK for upgrade.\n")) GM_openInTab(url);
        }
      }
    });
    GM_setValue('update_last_check', time.toString());
  }
}

checkVersion();

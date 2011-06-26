// ==UserScript==
// @name           GC little helper
// @namespace      http://www.amshove.net
// @include        http://www.geocaching.com/*
// @include        http://maps.google.de/*
// @include        http://maps.google.com/*
// @include        http://www.google.de/maps*
// @include        http://www.google.com/maps*
// @description    Some little things to make life easy (on www.geocaching.com).
// ==/UserScript==
//
// Author:         Torsten Amshove <torsten@amshove.net>
// Version:        4.6             - 12.06.2010
// Changelog:
//                                 - Fix: illegal character in signature/template for leading newlines (configuration has to be saved again to fix it!)
//                                 - New: hide hint behind a link
//                                 - New: remove spoiler warning
//                                 - New: remove link to advertisement instructions
//                                 - New: remove unneeded line breaks
//                                 - Fix: scroll to top when opening config dialog
//                                 - Some improvements to autoupdate
//                 4.6             - Fix: Click on grey background to close configuration
//                                 - Fix: newlines as first character of signatures and templates
//                                 - New Variable: #found_no# = founds (without +1)
//                                 - Added #found# Variable to Templates an TB-Signature
//                                 - Set cursor to first character in Log-fields
//                                 - Allow GCVote in inline logs
//                                 - Fix: do not redirect to map from links of friend list
//                                 - Append GCcode to Cache-Name on mail links
//                                 - Hide Config-Link in beta map, because it doesn't work fine
//                                 - BugFix: First box in sidebar was hidden
//                                 - Changed some default-settings
//                 4.5             - Show other Coordinate-Formats in Listing and on print-page
//                                 - Show amount of different Coins found in public profile
//                                 - Now the HomeCoords are also parsed from http://www.geocaching.com/account/default.aspx
//                                 - Fix: Insert template doesn't replace text now
//                                 - Fix: Redirect to Map
//                                 - Fix: Inline-Log does work on Pages without Gallery now
//                 4.4             - Added Log-Templates
//                                 - Fix: Default Log-Type should not override Field-Note-Log-Type
//                                 - Added some Code to support Google Chrome (not tested and not supported yet) - thanks to Bart
//                                 - Added Signal-Smilies
//                                 - Decrypt Hint on print-page
//                                 - Fix: Now it also works if there is a ?pf= in Listing-Link (Decrypted Log)
//                                 - Show TB-List in inline-Logs
//                                 - Removed: Insert Home-Coords in Searchfield - gc.com fixed it
//                                 - Save Home-Coords in Configuration
//                                 - Default-Value for Searchfield in Navigation
//                                 - Added Config-Link to Profile-Page
//                                 - Hide Linklist-Settings in Configuration (let it show with a link)
//                                 - New Design for Config and Find Player
//                 4.3             - Transfer TB-Tracking Number to Log-Field
//                                 - Repair gc.com-Bug: Linebreaks in decrypted hints
//                                 - Change background of found-caches to green (instead of grey)
//                                 - Log your visit (inline) Link in top menu
//                                 - styl-changes to search field (thanks to shen)
//                                 - Custom width for global page
//                                 - Hide Disclaimer on print-page
//                                 - Show Coin-Series-Name in TB-Listing
//                                 - Fix: Set Focus to textbox after clicking a Smiley or BBcode
//                                 - Fix: Log-Signature and Field Notes
//                 4.2             - Added: Smilies & BBCode on Log-Page
//                                 - Fix: overwrite of Log-Type on edit-Log
//                                 - Improve searchfield in linklist: Search direct by GC-ID, TB-ID or Tracking-Number
//                                 - Highlighted "founds since last load" on Friendlist
//                                 - Fix: Save target option of custom Bookmarks
//                 4.1             - Friendlist: Show amount of caches found since last load of the Friendlist
//                                 - Fix: Default-Log-Type doesn't override &LogType=
//                                 - Post log from Listing (inline)
//                                 - Fix: Hide Navigation on SignIn overlay
//                                 - Fix: Remove gc.com Links if logged out
//                                 - Fix: On auto-decrypt hint the decrypt link now changes to "encrypt"
//                                 - Choose wich Links are shown in Beta Map
//                                 - Fix: Show Log-Signature also on log.aspx?wp=xxx
//                                 - Removed leading line breaks from Log Signature
//                 4.0             - Update links to use beta-Map (disable via "default old map" in settings)
//                                 - Fix: Signature removes Log on edit
//                 3.9             - Edit button to own caches on profile page
//                                 - Set old map as Default
//                                 - Log-Signature-Variable: #found# (will be replaced with finds+1)
//                                 - Log & TB Signature
//                                 - Fix: get Cachetitle for Mail form log-page
//                                 - Searchfield in Linklist
//                                 - Linklist in beta map
//                 3.8             - Enable dynamic map
//                                 - Show Linklist as flat Navigation
//                                 - Remove links from Navigation
//                 3.7             - Insert Home-Coords into search-field
//                                 - Custom Map-width
//                                 - Fix: Homezone on Beta Map
//                                 - New Links: Profile Souvenirs & Statistics
//                 3.6             - Fix: Bookmark-List on Top -> now in Navigation
//                                 - Fix: Feedback-Link
//                                 - Rename: Bookmarks -> Linklist
//                                 - Fix: Bookmarks in Profile
//                                 - Fix: Google-Maps & KML-Link in Bookmark-Lists
//                                 - Fix: Hide Cache Notes
//                                 - Fix: Hide Disclaimer
//                                 - Removed: Hide L&F-Banner
//                 3.5             - BugFix: Saving Home-Coords (thanks to Birnbaum2001)
//                                 - Fill Homezone on Map (and remove "clickable")
//                 3.4             - Show Homezone on Map
//                 3.3             - Show Mail-Icon on log-Page
//                                 - Bugfix: Some JS not working on page "Your Profile"
//                 3.2             - Added "Log It" Icon to Nearest List
//                 3.1             - Bugfix: Mail-Icon was not displayed on pages with URL?id=..
//                 3.0             - Added www.google.de/maps
//                 2.9             - gc.com-update-fix: Link on found-counter at friendlist
//                 2.8             - Bugfix: Style problems in "Your Account Details"-Page
//                 2.7             - Bugfix: Problem with "Hide Cache Notes if empty"-Option for not-PM
//                 2.6             - Added feature to hide Cache Notes if there are no notes (Hide/Show Link appears)
//                                 - Added feature to hide Cache Notes completely
//                                 - Added feature to hide the L&F-Banner on top of the Logs (Listing)
//                                 - Fix: Added F2 to Submit-Feature also to Trackable-Page
//                 2.5             - Added feature to prevent "show all logs" if there are to many logs
//                                 - Added an signature for mails
//                                 - Fix: Shanged Feedback-Bookmark to new URL
//                                 - Fix: new Feedback-button can be hidden again
//                 2.4             - Bugfix: Disabled redirect also with bookmark "Nearest List (w/o Founds)"
//                 2.3             - Disabled redirect to map, if link "Neares List" is used
//                                 - Bugfix: Wrong cachename in mail-text if there are more than one open tab
//                 2.2             - Added feature to hide the boxes on the "My Profile"-Sidebar
//                 2.1             - Added feature to add custom bookmarks
//                                 - Added "Show in google maps"-Link to Bookmark-Overview-Page
//                 2.0             - Added links to bookmark-lists: "Download as kml" and "Show in google maps"
//                                 - Bugfix: Wrong coordinates from google maps
//                 1.9             - Added a Link to Google Maps on Cache-Page a Link on Google Maps to geocaching.com
//                                 - Replaced the Mail-Link with an Icon
//                                 - Removed: "Hide Facebook Button" - gc.com removed it
//                                 - "Show all Logs" now replaces the links, to prevent the redirect
//                                 - Bugfix: Gallery-Link on Friend-List
//                 1.8             - Add Links to Friendlist: Gallery, Hidden Caches
//                                 - Add Link to Found-List on Found-Counter at Friend-List
//                                 - Compatible to GCTidy Link (Thanks to tenrapid)
//                 1.7             - Bugfix: Mail-Link, hide disclaimer, decrypt hint (fixed the URL matching)
//                                 - Added My Trackabels-Bookmark
//                 1.6             - Bookmark hinzugefuegt: Neares-List ohne Funde
//                                 - TB-Log-Typ erweitert um "retrieved .."
//                                 - Konfigurierbar: Bookmarks links oder rechts
//                                 - Konfigurierbar: Bookmarks farbe und groesse
//                                 - Direkter E-Mail Link (+ einfuegen des Namens) in Cache-Listing und TB-Listing aufgenommen
//                                 - Merkt sich den Status der Checkboxen vom Mail-Formular
//                                 - Moeglichkeit, den Disclaimer im Listing auszublenden
//                                 - Moeglichkeit, den Hint automatisch zu entschluesseln
//                 1.5             - Bugfix: Home-Koordinaten berechnung gefixt
//                                 - Kleine vorlaufiger Fix: GCTidy-Link
//                 1.4             - Bugfix: Breite der "Du bist angemeldet als .." Zeile an deutsche Uebersetzung angepasst
//                 1.3             - Bugfix: Zeichensatzproblem bei Grad-Zeichen in RegEx
//                 1.2             - Bookmarks in einer Zeile
//                                 - Weitere Bookmarks hinzugefuegt (Tabs im oeffentlichen Profil, My Profile, Nearest List, Map)
//                                 - "Configuration" umbenannt in "little helper config"
//                                 - Default-Log-Type fuer Trackables
//                                 - Bookmarks umbenennen / Kuerzel geben
//                 1.1             - Konfigurations-Menue hinzugefuegt
//                                 - Bookmarks konfigurierbar und sortierbar gemacht
//                                 - Bookmark-Links erweitert
//                                 - Find Player-Menue
//                                 - Hide Facebook-Button
//                                 - Hide Feedback-Button
//                                 - Default Log Type
//                 1.0             - Bookmark-Liste fuer Profilseite und Header
//                                 - F2-Shortcut fuer den Log-Button
//                                 - Automatische Weiterleitung zur Kartenansicht
//                                 - Alle Logs Anzeigen


////////////////////////////////////////////////////////////////////////////
  
var bookmarks = new Array();

bookmarks[0] = new Object();
bookmarks[0]['href'] = "/my/watchlist.aspx";
bookmarks[0]['title'] = "Watchlist";

bookmarks[1] = new Object();
bookmarks[1]['href'] = "/my/geocaches.aspx";
bookmarks[1]['title'] = "Geocaches";

bookmarks[2] = new Object();
bookmarks[2]['href'] = "/my/owned.aspx";
bookmarks[2]['title'] = "My Geocaches";

bookmarks[3] = new Object();
bookmarks[3]['href'] = "/my/travelbugs.aspx";
bookmarks[3]['title'] = "Trackable Items";

bookmarks[4] = new Object();
bookmarks[4]['href'] = "/my/inventory.aspx";
bookmarks[4]['title'] = "Trackables Inventory";

bookmarks[5] = new Object();
bookmarks[5]['href'] = "/my/collection.aspx";
bookmarks[5]['title'] = "Trackables Collection";

bookmarks[6] = new Object();
bookmarks[6]['href'] = "/my/benchmarks.aspx";
bookmarks[6]['title'] = "Benchmarks";

bookmarks[7] = new Object();
bookmarks[7]['href'] = "/my/subscription.aspx";
bookmarks[7]['title'] = "Member Features";

bookmarks[8] = new Object();
bookmarks[8]['href'] = "/my/myfriends.aspx";
bookmarks[8]['title'] = "Friends";

bookmarks[9] = new Object();
bookmarks[9]['href'] = "/account/default.aspx";
bookmarks[9]['title'] = "Account Details";

bookmarks[10] = new Object();
bookmarks[10]['href'] = "/profile/";
bookmarks[10]['title'] = "Public Profile";

bookmarks[11] = new Object();
bookmarks[11]['href'] = "/seek/nearest.aspx";
bookmarks[11]['title'] = "Search";

bookmarks[12] = new Object();
bookmarks[12]['href'] = "/my/userroutes.aspx#find";
bookmarks[12]['title'] = "Routes";

bookmarks[13] = new Object();
bookmarks[13]['href'] = "/my/uploadfieldnotes.aspx";
bookmarks[13]['title'] = "Field Notes";

bookmarks[14] = new Object();
bookmarks[14]['href'] = "/pocket/default.aspx";
bookmarks[14]['title'] = "Pocket Queries";

bookmarks[15] = new Object();
bookmarks[15]['href'] = "/pocket/saved.aspx";
bookmarks[15]['title'] = "Saved GPX";

bookmarks[16] = new Object();
bookmarks[16]['href'] = "/bookmarks/default.aspx";
bookmarks[16]['title'] = "Bookmarks";

bookmarks[17] = new Object();
bookmarks[17]['href'] = "/notify/default.aspx";
bookmarks[17]['title'] = "Notifications";

bookmarks[18] = new Object();
bookmarks[18]['href'] = "#";
bookmarks[18]['id'] = "lnk_findplayer";
bookmarks[18]['title'] = "Find Player";

bookmarks[19] = new Object();
bookmarks[19]['href'] = "/email/default.aspx";
bookmarks[19]['title'] = "E-Mail";

bookmarks[20] = new Object();
bookmarks[20]['href'] = "/my/statbar.aspx";
bookmarks[20]['title'] = "Statbar";

bookmarks[21] = new Object();
bookmarks[21]['href'] = "/about/guidelines.aspx";
bookmarks[21]['title'] = "Guidelines";

bookmarks[22] = new Object();
bookmarks[22]['href'] = "http://forums.groundspeak.com/";
bookmarks[22]['title'] = "Forum";
bookmarks[22]['rel'] = "external";
bookmarks[22]['target'] = "_blank";

bookmarks[23] = new Object();
bookmarks[23]['href'] = "http://blog.geocaching.com/";
bookmarks[23]['title'] = "Blog";
bookmarks[23]['rel'] = "external";
bookmarks[23]['target'] = "_blank";

bookmarks[24] = new Object();
bookmarks[24]['href'] = "http://feedback.geocaching.com/";
bookmarks[24]['title'] = "Feedback";
bookmarks[24]['rel'] = "external";
bookmarks[24]['target'] = "_blank";

bookmarks[25] = new Object();
bookmarks[25]['href'] = "http://www.geoclub.de/";
bookmarks[25]['title'] = "Geoclub";
bookmarks[25]['rel'] = "external";
bookmarks[25]['target'] = "_blank";

bookmarks[26] = new Object();
bookmarks[26]['href'] = "#";
bookmarks[26]['title'] = "Profile Geocaches";
bookmarks[26]['id'] = "lnk_profilegeocaches";

bookmarks[27] = new Object();
bookmarks[27]['href'] = "#";
bookmarks[27]['title'] = "Profile Trackables";
bookmarks[27]['id'] = "lnk_profiletrackables";

bookmarks[28] = new Object();
bookmarks[28]['href'] = "#";
bookmarks[28]['title'] = "Profile Gallery";
bookmarks[28]['id'] = "lnk_profilegallery";

bookmarks[29] = new Object();
bookmarks[29]['href'] = "#";
bookmarks[29]['title'] = "Profile Bookmarks";
bookmarks[29]['id'] = "lnk_profilebookmarks";

bookmarks[30] = new Object();
bookmarks[30]['href'] = "/my/";
bookmarks[30]['title'] = "My Profile";

bookmarks[31] = new Object();
bookmarks[31]['href'] = "#";
bookmarks[31]['title'] = "Nearest List";
bookmarks[31]['id'] = "lnk_nearestlist";

bookmarks[32] = new Object();
bookmarks[32]['href'] = "#";
bookmarks[32]['title'] = "Nearest Map";
bookmarks[32]['id'] = "lnk_nearestmap";

bookmarks[33] = new Object();
bookmarks[33]['href'] = "#";
bookmarks[33]['title'] = "Nearest List (w/o Founds)";
bookmarks[33]['id'] = "lnk_nearestlist_wo";

bookmarks[34] = new Object();
bookmarks[34]['href'] = "#";
bookmarks[34]['title'] = "My Trackables";
bookmarks[34]['id'] = "lnk_my_trackables";

// New Bookmarks under custom_Bookmarks ..

////////////////////////////////////////////////////////////////////////////

// Set defaults
var scriptName = "gc_little_helper";
var scriptVersion = "4.6";

var anzCustom = 10;
var anzTemplates = 5;

var bookmarks_def = new Array(16,18,13,14,17,12);

// Compatibility to Google Chrome - http://devign.me/greasemonkey-gm_getvaluegm_setvalue-functions-for-google-chrome/
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
  this.GM_getValue=function (key,def) {
    return localStorage[key] || def;
  };
  this.GM_setValue=function (key,value) {
    return localStorage[key]=value;
  };
}

// Settings: Submit Log on F2
settings_submit_log_button = GM_getValue("settings_submit_log_button",true);
// Settings: Log Inline
settings_log_inline = GM_getValue("settings_log_inline",true);
settings_log_inline_tb = GM_getValue("settings_log_inline_tb",false);
// Settings: Show Bookmarks
settings_bookmarks_show = GM_getValue("settings_bookmarks_show",true);
// Settings: Bookmarks on Top
settings_bookmarks_on_top = GM_getValue("settings_bookmarks_on_top",true);
settings_bookmarks_top_menu = GM_getValue("settings_bookmarks_top_menu","true");
settings_bookmarks_search = GM_getValue("settings_bookmarks_search","true");
settings_bookmarks_search_default = GM_getValue("settings_bookmarks_search_default","");
// Settings: Redirect to Map
settings_redirect_to_map = GM_getValue("settings_redirect_to_map",false);
// Settings: Hide Feedback Button
settings_hide_feedback = GM_getValue("settings_hide_feedback",false);
// Settings: Hide Disclaimer
settings_hide_disclaimer = GM_getValue("settings_hide_disclaimer",true);
// Settings: Hide Cache Notes
settings_hide_cache_notes = GM_getValue("settings_hide_cache_notes",false);
// Settings: Hide Cache Notes if empty
settings_hide_empty_cache_notes = GM_getValue("settings_hide_empty_cache_notes",true);
// Settings: Show all Logs
settings_show_all_logs = GM_getValue("settings_show_all_logs",false);
settings_show_all_logs_count = GM_getValue("settings_show_all_logs_count","0");
// Settings: Decrypt Hint
settings_decrypt_hint = GM_getValue("settings_decrypt_hint",false);
// Settings: Show Smilies & BBCode
settings_show_bbcode = GM_getValue("settings_show_bbcode",true);
// Settings: Show mail-Link
settings_show_mail = GM_getValue("settings_show_mail",true);
// Settings: Show google-maps Link
settings_show_google_maps = GM_getValue("settings_show_google_maps",true);
// Settings: Show Log It Icon
settings_show_log_it = GM_getValue("settings_show_log_it",true);
// Settings: Show Homezone
settings_show_homezone = GM_getValue("settings_show_homezone",true);
settings_homezone_radius = GM_getValue("settings_homezone_radius","10");
// Settings: default Map
settings_old_map = GM_getValue("settings_old_map",false);
if(settings_old_map) map_url = "http://www.geocaching.com/map/default.aspx";
else map_url = "http://www.geocaching.com/map/beta/default.aspx";
// Settings: default Log Type
settings_default_logtype = GM_getValue("settings_default_logtype","-1");
// Settings: default TB-Log Type
settings_default_tb_logtype = GM_getValue("settings_default_tb_logtype","-1");
// Settings: Bookmarklist
settings_bookmarks_list = eval(GM_getValue("settings_bookmarks_list",uneval(bookmarks_def)));
settings_bookmarks_list_beta = eval(GM_getValue("settings_bookmarks_list_beta",uneval(bookmarks_def)));
// Settinks: Dynamic Map
settings_dynamic_map = GM_getValue("settings_dynamic_map",true);
settings_hide_advert_link = GM_getValue('settings_hide_advert_link',true);
settings_hide_line_breaks = GM_getValue('settings_hide_line_breaks',true);
settings_hide_spoilerwarning = GM_getValue('settings_hide_spoilerwarning',true);
settings_hide_hint = GM_getValue('settings_hide_hint',true);


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
bookmarks[num] = new Object();
bookmarks[num]['href'] = "#";
bookmarks[num]['title'] = "Profile Souvenirs";
bookmarks[num]['id'] = "lnk_profilesouvenirs";

num++;
bookmarks[num] = new Object();
bookmarks[num]['href'] = "#";
bookmarks[num]['title'] = "Profile Statistics";
bookmarks[num]['id'] = "lnk_profilestatistics";

// Settings: Custom Bookmark-title
var bookmarks_orig_title = new Array();
for(var i=0; i<bookmarks.length; i++){
  if(typeof(GM_getValue("settings_bookmarks_title["+i+"]")) != "undefined" && GM_getValue("settings_bookmarks_title["+i+"]") != ""){
    bookmarks_orig_title[i] = bookmarks[i]['title']; // Needed for configuration
    bookmarks[i]['title'] = GM_getValue("settings_bookmarks_title["+i+"]");
  }
}

////////////////////////////////////////////////////////////////////////////

// Link on Google Maps
if(document.location.href.match(/^http:\/\/maps\.google\.(de|com)/) || document.location.href.match(/^http:\/\/www\.google\.(de|com)\/maps/)){
  if(settings_show_google_maps){
    var ref_link = document.getElementById("link");
    if(ref_link){
      function open_gc(){
        var matches = document.getElementById("link").href.match(/&ll=([-0-9]*\.[0-9]*),([-0-9]*\.[0-9]*)/);
        var zoom = document.getElementById("link").href.match(/z=([0-9]*)/);
        window.open(map_url+"?lat="+matches[1]+"&lng="+matches[2]+"&zm="+zoom[1]);
      }
    
      var box = ref_link.parentNode;
      
      box.appendChild(document.createTextNode(" "));
      
      var divider = document.createElement("img");
      divider.setAttribute("class","bar-icon-divider bar-divider");
      divider.setAttribute("src","http://maps.gstatic.com/intl/de_de/mapfiles/transparent.png");
      box.appendChild(divider);
      
      box.appendChild(document.createTextNode(" "));
      
      var link = document.createElement("a");
      link.setAttribute("title","Show area at geocaching.com");
      link.setAttribute("href","#");
      link.setAttribute("id","gc_com_lnk");
      
      var span = document.createElement("span");
      span.setAttribute("class","link-text");
      span.appendChild(document.createTextNode("gc.com"));
      link.appendChild(span);
      
      box.appendChild(link);
      
      document.getElementById('gc_com_lnk').addEventListener("click", open_gc, false);
    }
  }
}else{
  
////////////////////////////////////////////////////////////////////////////
// Helper
// Run after Redirect
if(GM_getValue("run_after_redirect") != ""){
  try{
    eval("unsafeWindow."+GM_getValue("run_after_redirect"));
  }catch(e){}
  GM_setValue("run_after_redirect","no");
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

// F2 zum Log abschicken
if(settings_submit_log_button && (document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|PLogGuid)\=/))){
  function keydown(e){
    if(e.keyCode == 113){
      document.getElementById("ctl00_ContentBody_LogBookPanel1_LogButton").click();
    }
  }

  window.addEventListener('keydown', keydown, true);
}

// Bookmark-Liste im Profil
if(settings_bookmarks_show && (document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/$/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/default\.aspx$/))){
  var side = document.getElementById("ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel");

  var header = document.createElement("h3");
  header.setAttribute("class","WidgetHeader");
  header.appendChild(document.createTextNode(" Linklist"));

  var div = document.createElement("div");
  div.setAttribute("class","WidgetBody ProfileWidget");

  var ul = document.createElement("ul");

  for(var i=0; i < settings_bookmarks_list.length; i++){
    var x = settings_bookmarks_list[i];
    if(typeof(x) == "undefined") continue;
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

// Bookmarks on top
if(settings_bookmarks_on_top && document.getElementById('Navigation')){
  var nav_list = document.getElementById('Navigation').childNodes[1];
  
  var menu = document.createElement("li");
  
  var headline = document.createElement("a");

  if(settings_bookmarks_top_menu){   // Navi vertikal
    headline.setAttribute("href","#");
    headline.setAttribute("title","Linklist");
    headline.setAttribute("accesskey","7");
    headline.innerHTML = "Linklist ▼";
    menu.appendChild(headline);
    
    var submenu = document.createElement("ul");
    submenu.setAttribute("class","SubMenu");
    submenu.setAttribute("style","visibility: hidden;");
    menu.appendChild(submenu);
  
    for(var i=0; i < settings_bookmarks_list.length; i++){
      var x = settings_bookmarks_list[i];
      if(typeof(x) == "undefined") continue;
  
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
      if(typeof(x) == "undefined") continue;

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

    var searchfield = "<form style='display: inline;' action='/default.aspx' method='GET' onSubmit='gclh_search(); return false;'><input type='text' size='6' name='navi_search' id='navi_search' style='margin-top: 2px; padding: 1px; font-weight: bold; font-family: sans-serif; border: 2px solid #778555; border-radius: 7px 7px 7px 7px; -moz-border-radius: 7px; -khtml-border-radius: 7px; background-color:#d8cd9d' value='"+settings_bookmarks_search_default+"'></form>";
    var nav_list = document.getElementById('Navigation').childNodes[1];
    nav_list.innerHTML += searchfield;
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

// Bookmarks on top - Beta Map
if(settings_bookmarks_on_top && document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\/beta/) && document.getElementById('maps-hd')){
  var header = document.getElementById('maps-hd');
  var navi = header.childNodes[3].childNodes[1];
  var strong = navi.childNodes[1];
  //navi.removeChild(navi.childNodes[1]);

  for(var i=0; i < settings_bookmarks_list_beta.length; i++){
    var x = settings_bookmarks_list_beta[i];
    if(typeof(x) == "undefined") continue;

    var hyperlink = document.createElement("a");

    for(attr in bookmarks[x]){
      if(attr != "custom") hyperlink.setAttribute(attr,bookmarks[x][attr]);
    }
    hyperlink.appendChild(document.createTextNode(bookmarks[x]['title']));

    navi.insertBefore(hyperlink, strong);
    if(i != (settings_bookmarks_list_beta.length-1)) navi.insertBefore(document.createTextNode(' | '), strong);
  }
  navi.removeChild(strong);
}

// Remove gc.com Links in Navigation
if(document.getElementById('Navigation')){
  var liste = document.getElementById('Navigation').childNodes[1];
  if(GM_getValue('remove_navi_play') && document.getElementById('ctl00_hlNavPlay')) liste.removeChild(document.getElementById('ctl00_hlNavPlay').parentNode);
  if(GM_getValue('remove_navi_profile') && document.getElementById('ctl00_hlNavProfile')) liste.removeChild(document.getElementById('ctl00_hlNavProfile').parentNode);
  if(GM_getValue('remove_navi_join') && document.getElementById('ctl00_hlNavJoin')) liste.removeChild(document.getElementById('ctl00_hlNavJoin').parentNode);
  if(GM_getValue('remove_navi_community') && document.getElementById('ctl00_hlNavCommunity')) liste.removeChild(document.getElementById('ctl00_hlNavCommunity').parentNode);
  if(GM_getValue('remove_navi_videos') && document.getElementById('ctl00_hlNavVideos')) liste.removeChild(document.getElementById('ctl00_hlNavVideos').parentNode);
  if(GM_getValue('remove_navi_resources') && document.getElementById('ctl00_hlNavResources')) liste.removeChild(document.getElementById('ctl00_hlNavResources').parentNode);
  if(GM_getValue('remove_navi_shop') && document.getElementById('ctl00_hlNavShop')) liste.removeChild(document.getElementById('ctl00_hlNavShop').parentNode);
}

// Redirect to Map
if(settings_redirect_to_map && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)){
//   var lat = document.location.href.match(/lat_h=([0-9.]*)/);
//   var lng = document.location.href.match(/long_h=([0-9.]*)/);
// 
//   if(!lat) var lat = document.location.href.match(/lat=([0-9.]*)/);
//   if(!lng) var lng = document.location.href.match(/lng=([0-9.]*)/);
//
//  if(!document.location.href.match(/&disable_redirect/)) document.location.href = map_url+"?lat="+lat[1]+"&lng="+lng[1];
  if(!document.location.href.match(/&disable_redirect/) && document.getElementById('ctl00_ContentBody_LocationPanel1_lnkMapIt')){
    var match = document.getElementById('ctl00_ContentBody_LocationPanel1_lnkMapIt').href.match(/\.aspx\?(.*)/);
    if(match[1]) document.location.href = map_url+"?"+match[1];
  }
}


// Hide Facebook-Button
//if(settings_hide_facebook && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?(guid|wp)\=[a-zA-Z0-9-]*/)){
/*  var iframes = document.getElementsByTagName('iframe');
  for(var i=0; i<iframes.length; i++){
    if(iframes[i].src.match(/^http:\/\/www\.facebook\.com/)){
      iframes[i].parentNode.removeChild(iframes[i]);
      break;
    }
  }
}*/

// Hide Feedback-Button
if(settings_hide_feedback){
//  var button = document.getElementById('fdbk_tab');
//  if(button){
//    button.parentNode.removeChild(button);
//  }

  function hide_feedback(){
    var button = document.getElementById('uservoice-feedback');
    if(button){
      button.parentNode.removeChild(button);
    }
  }
  
  window.addEventListener("load", hide_feedback, false);
}

// Hide Disclaimer
if(settings_hide_disclaimer && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx(\?|\?pf\=\&)(guid|wp)\=[a-zA-Z0-9-]*/)){
  var disc = getElementsByClass('DisclaimerWidget')[0];
  if(disc){
    disc.parentNode.removeChild(disc);
  }
}
if(settings_hide_disclaimer && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)){
  var disc = getElementsByClass('TermsWidget no-print')[0];
  if(disc){
    disc.parentNode.removeChild(disc);
  }
}

//remove paragraph containing the link to the advertisement instructions (not the advertisements itself!)
if (settings_hide_advert_link) {
  var links = document.getElementsByTagName('a');
  for(var i=0; i<links.length; i++){
    if(links[i].href.indexOf('advertising.aspx') > 0) {
      var del = links[i];
      while (del.parentNode != null && (del.parentNode.nodeName != 'P')) {
        del = del.parentNode;
      }
      del.parentNode.removeChild(del);
      break;
    }
  }
}

if (settings_hide_line_breaks) {
  //remove line break after "Print" label
  var printHeader = document.getElementById('ctl00_ContentBody_uxPrintHeader');
  if (printHeader) {
    var br = printHeader.nextSibling.nextSibling;
    if (br) {
      br.parentNode.removeChild(br);
    }
  }
  // remove line break between "distance from home" and "Bundesland, Land"
  var distFromHome = document.getElementById('ctl00_ContentBody_lblDistFromHome');
  if (distFromHome) {
    var br = distFromHome.nextSibling.nextSibling;
    if (br && br.nodeName == 'BR') {
      br.parentNode.removeChild(br);
    }
  }
}

// remove "Warning! Spoilers may be included in the descriptions or links."
if (settings_hide_spoilerwarning) {
  var findCounts = document.getElementById('ctl00_ContentBody_lblFindCounts');
  if (findCounts) {
    var para = findCounts.nextSibling.nextSibling;
    if (para && para.nodeName == 'P') {
      para.parentNode.removeChild(para);
    }
  }
}

// Hide Cache Notes
if(settings_hide_cache_notes && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx(\?|\?pf\=\&)(guid|wp)\=[a-zA-Z0-9-]*/)){
  var disc = getElementsByClass('NotesWidget')[0];
  if(disc){
    disc.parentNode.removeChild(disc);
  }
}

// Hide/Show Cache Notes
if(settings_hide_empty_cache_notes && !settings_hide_cache_notes && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx(\?|\?pf\=\&)(guid|wp)\=[a-zA-Z0-9-]*/)){
  var box = getElementsByClass('NotesWidget')[0];
  if(box){
    var code = "function hide_notes(){";
    code += "  if(document.getElementById('box_notes').style.display == 'none'){";
    code += "    document.getElementById('box_notes').style.display = 'block';";
    code += "  }else{";
    code += "    document.getElementById('box_notes').style.display = 'none';";
    code += "  }";
    code += "}";
  
    var script = document.createElement("script");
    script.innerHTML = code;
    document.getElementsByTagName("body")[0].appendChild(script);

//    box.style.display = "none";
    box.setAttribute("id","box_notes");

    getElementsByClass("UserSuppliedContent")[0].innerHTML = "<font style='font-size: 10px;'><a href='#' onClick='hide_notes();'>Show/Hide Cache Notes</a></font><br><br>"+getElementsByClass("UserSuppliedContent")[0].innerHTML;
  
    function hide_on_load(){
      var box = getElementsByClass('NotesWidget')[0];
      var text = document.getElementById("cache_note").innerHTML;
      if(text == "Click to enter a note" || text == "Klicken zum Eingeben einer Notiz") box.style.display = "none";
    }
  
    window.addEventListener("load", hide_on_load, false);
  }
}

function trim(s) {
  var whitespace = ' \n';
  for (var i = 0; i < whitespace.length; i++) {
    while (s.substring(0, 1) == whitespace.charAt(i)) {
      s = s.substring(1, s.length);
    }
    while (s.substring(s.length - 1, s.length) == whitespace.charAt(i)) {
      s = s.substring(0, s.length - 1);
    }
  }
  return s;
}

if (settings_hide_hint) {
  //replace hint by a link which shows the hint dynamically
  var hint = document.getElementById('div_hint');
  if (hint) {
    var para = hint.previousSibling.previousSibling;
    if (para && para.nodeName == 'P') {
      if (trim(hint.innerHTML).length > 0) {
        var label = para.getElementsByTagName('strong')[0];
        var code = "function hide_hint(){";
        code += "  var hint = document.getElementById('div_hint');";
        code += "  if(hint.style.display == 'none'){";
        code += "    hint.style.display = 'block';";
        code += "  }else{";
        code += "    hint.style.display = 'none';";
        code += "  }";
        code += "  hint.innerHTML = convertROTStringWithBrackets(hint.innerHTML);";
        code += "  return false;";
        code += "}";
        
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

// Show all Logs
if(settings_show_all_logs && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx(\?|\?pf\=\&)(guid|wp)\=[a-zA-Z0-9-]*$/)){
  if(settings_show_all_logs_count > 0){
    var p = document.getElementsByTagName("p");
    for(var i=0; i<p.length; i++){
      if(p[i].innerHTML.match(/There are [0-9]* additional logs/)){
        var matches = p[i].innerHTML.match(/[0-9]+/);
        if(matches) if(matches[0] < settings_show_all_logs_count-5){
          document.location.href = document.location.href+"&log=y";
        }
        break;
      }
    }
  }else document.location.href = document.location.href+"&log=y";
}
if(settings_show_all_logs && settings_show_all_logs_count < 1){
  function change_cache_link(){
    var links = document.getElementsByTagName('a');
    for(var i=0; i<links.length; i++){
      if(links[i].href.match(/seek\/cache_details\.aspx\?/) && !links[i].href.match(/&log=y/)){
        links[i].href += "&log=y";
      }
    }
  }
  
  window.addEventListener("load", change_cache_link, false);
}

// Decrypt Hint
if(settings_decrypt_hint && !settings_hide_hint && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?(guid|wp)\=[a-zA-Z0-9-]*/)){
  unsafeWindow.dht(document.getElementById("ctl00_ContentBody_lnkDH"));
}
if(settings_decrypt_hint && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)){
  if(document.getElementById('uxDecryptedHint')) document.getElementById('uxDecryptedHint').style.display = 'none';
  if(document.getElementById('uxEncryptedHint')) document.getElementById('uxEncryptedHint').style.display = '';
}

// Show Smilies & BBCode --- http://www.cachewiki.de/wiki/Formatierung
if(settings_show_bbcode && (document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|PLogGuid)\=/)) && document.getElementById('litDescrCharCount')){
  // Get foinds to replace #found# variable
  if(getElementsByClass('SignedInText')[0]){
    var text = getElementsByClass('SignedInText')[0].childNodes[7].innerHTML;
    var finds = parseInt(text.match(/([0-9,]{1,10})/)[1].replace(/,/g,""));
  }

  var code = "function gclh_insert(aTag,eTag){"; // http://aktuell.de.selfhtml.org/artikel/javascript/bbcode/
  code += "  var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');";
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
  code += "function gclh_insert_from_div(id){";
  code += "  var finds = '"+finds+"';";
  code += "  var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');";
  code += "  var inhalt = document.getElementById(id).innerHTML;";
  code += "  if(finds){";
  code += "    inhalt = inhalt.replace(/#found_no#/g,finds);";
  code += "    finds++;";
  code += "    inhalt = inhalt.replace(/#found#/g,finds);";
  code += "  }";
  code += "  if(typeof input.selectionStart != 'undefined' && inhalt){";
  code += "    var start = input.selectionStart;";
  code += "    var end = input.selectionEnd;";
  code += "    var insText = input.value.substring(start, end);";
  code += "    input.value = input.value.substr(0, start) + inhalt + input.value.substr(end);";
  code += "    /* Anpassen der Cursorposition */";
  code += "    var pos;";
  code += "    pos = start + inhalt.length;";
  code += "    input.selectionStart = pos;";
  code += "    input.selectionEnd = pos;";
  code += "  }";
  code += "  input.focus();";
  code += "}";

  var script = document.createElement("script");
  script.innerHTML = code;
  document.getElementsByTagName("body")[0].appendChild(script);

  var box = document.getElementById('litDescrCharCount');
  var liste = "";
  liste += "<a href='#' onClick='gclh_insert(\"[:)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[:D]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_big.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[8D]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_cool.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[:I]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_blush.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[:P]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_tongue.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[}:)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_evil.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[;)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_wink.gif' border='0'></a>";
  liste += "<br>";
  liste += "<a href='#' onClick='gclh_insert(\"[:o)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_clown.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[B)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_blackeye.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[8]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_8ball.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[:(]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_sad.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[8)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_shy.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[:O]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_shock.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[:(!]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_angry.gif' border='0'></a>";
  liste += "<br>";
  liste += "<a href='#' onClick='gclh_insert(\"[xx(]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_dead.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[|)]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_sleepy.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[:X]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_kisses.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[^]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_approve.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[V]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_dissapprove.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[?]\",\"\"); return false;'><img src='http://www.geocaching.com/images/icons/icon_smile_question.gif' border='0'></a>";
  liste += "<br>";
  liste += "<a href='#' onClick='gclh_insert(\":angry:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/mad.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\":grin:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/big_smile.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\":sad:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/sad.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\":shocked:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/shock.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\":smile:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/smile.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\":surprise:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/surprise.gif' border='0'></a>";
  liste += "<br>";
  liste += "<a href='#' onClick='gclh_insert(\":tired:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/tired.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\":yikes:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/ohh.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\":tongue:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/tongue.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\":bad:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/bad_boy_a.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\":back:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/back.gif' border='0'></a>";
  liste += "<a href='#' onClick='gclh_insert(\":cute:\",\"\"); return false;'><img src='http://img.groundspeak.com/forums/emoticons/signal/cute.gif' border='0'></a>";
  liste += "<br>";
  liste += "BBCode:<br>";
  liste += "<a href='#' onClick='gclh_insert(\"[black]\",\"[/black]\"); return false;'><span style='font-size: 8px; background-color: black;'>&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[blue]\",\"[/blue]\"); return false;'><span style='font-size: 8px; background-color: blue;'>&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[red]\",\"[/red]\"); return false;'><span style='font-size: 8px; background-color: red;'>&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[purple]\",\"[/purple]\"); return false;'><span style='font-size: 8px; background-color: purple;'>&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[orange]\",\"[/orange]\"); return false;'><span style='font-size: 8px; background-color: orange;'>&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[yellow]\",\"[/yellow]\"); return false;'><span style='font-size: 8px; background-color: yellow;'>&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[green]\",\"[/green]\"); return false;'><span style='font-size: 8px; background-color: green;'>&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
  liste += "<a href='#' onClick='gclh_insert(\"[white]\",\"[/white]\"); return false;'><span style='font-size: 8px; background-color: white;'>&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
  liste += "<br>";
  liste += "<a href='#' onClick='gclh_insert(\"[b]\",\"[/b]\"); return false;' style='color: #000000; text-decoration: none;'><b>B</b></a>&nbsp;";
  liste += "<a href='#' onClick='gclh_insert(\"[i]\",\"[/i]\"); return false;' style='color: #000000; text-decoration: none;'><i>I</i></a>&nbsp;";
  liste += "<a href='#' onClick='gclh_insert(\"[s]\",\"[/s]\"); return false;' style='color: #000000; text-decoration: none;'><s>S</s></a>&nbsp;";
  liste += "<a href='#' onClick='gclh_insert(\"[u]\",\"[/u]\"); return false;' style='color: #000000; text-decoration: none;'><u>U</u></a>&nbsp;";
  liste += "<br>";
  liste += "Templates:<br>";
  for(var i = 0; i < anzTemplates; i++){
    if(GM_getValue("settings_log_template_name["+i+"]","") != ""){
      liste += "<div id='gclh_template["+i+"]' style='display: none;'>"+GM_getValue("settings_log_template["+i+"]","")+"</div>";
      liste += "<a href='#' onClick='gclh_insert_from_div(\"gclh_template["+i+"]\"); return false;' style='color: #000000; text-decoration: none; font-weight: normal;'> - "+GM_getValue("settings_log_template_name["+i+"]","")+"</a><br>";
    }
  }
  box.innerHTML = liste;
}

// Show eMail-Link beside Username
if(settings_show_mail && document.location.href.match(/^http:\/\/www\.geocaching\.com\/(seek\/cache_details|seek\/log|track\/details)\.aspx(\?|\?pf\=\&)(guid|wp|tracker|id|LUID|ID|PLogGuid)\=[a-zA-Z0-9-]*/)){
  var links = document.getElementsByTagName('a');
  if(document.getElementById('ctl00_ContentBody_CacheName')){
    var name = document.getElementById('ctl00_ContentBody_CacheName').innerHTML;
    if(document.getElementById('ctl00_ContentBody_uxWaypointName')) name += " ("+document.getElementById('ctl00_ContentBody_uxWaypointName').innerHTML+")";
  }else if(document.getElementById('ctl00_ContentBody_lbHeading') && !document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?.*/))  var name = document.getElementById('ctl00_ContentBody_lbHeading').innerHTML;
  else if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?.*/)){
    var name = "";
    var image = true;
    for(var i=0; i<links.length; i++){
      if(links[i].href.match(/http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx/)){
        if(image) image = false;  // First hit is an Image
        else name = links[i].innerHTML;
      }
    }
  }else var name = ""; 

  for(var i=0; i<links.length; i++){
    if(links[i].href.match(/http:\/\/www\.geocaching\.com\/profile\/\?guid=/)){
      var guid = links[i].href.match(/http:\/\/www\.geocaching\.com\/profile\/\?guid=(.*)/);
      guid = guid[1];

      var mail_link = document.createElement("a");
      var mail_img = document.createElement("img");
      mail_img.setAttribute("border","0");
      mail_img.setAttribute("title","Send a mail to this user");
      mail_img.setAttribute("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAYAAAC9vt6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oHHg0gKjtwF3IAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABdElEQVQoz4WRMaviUBSEv5s8H8RO0Eq00SiCRMQigoiCYC2I/hhbwd8g1lpZWFioECwl2IqIwT5iGdDCK94tlhf27cK+gWmGYZg5R9i2rUzTpFAooOs6AEIINE1DCPEPv/T3+81yuURMJhNlmiYAtVqNSCTCT7her6zXa6SUaFJKms0m8XicxWLB5XIJjUqpkAD3+53tdovruvT7faSUfHyZi8UiyWQSx3HwfZ96vY4QIgy73W5sNhssy6LRaIRztT+rxWIxer0eUkpms1moe57HfD6n0+lQKpXQdT1s9fH3PqUUmUwG13UZjUaUy2V2ux2WZRGNRlFKfWv2LSAIAlzXJQgCBoMBz+eTw+HAcDjE8zym0ynVapVsNhtOCAOOxyOn04l8Pk+73Qbg8/OTSqWCUopcLkcikWC/33M+n2m1Wr9fPh6PVTqdxjAMbNvGMIwf3+j7Po7j8Hg8EJZlqW63SyqVQtO08Dj/gxCC1+vFarXiF7aOl1qte6kYAAAAAElFTkSuQmCC");
      mail_link.appendChild(mail_img);
      mail_link.setAttribute("href","http://www.geocaching.com/email/?guid="+guid+"&text="+name);

      links[i].parentNode.appendChild(document.createTextNode("   "));
      links[i].parentNode.appendChild(mail_link);

      //GM_setValue("run_after_redirect","document.getElementById(\"ctl00_ContentBody_SendMessagePanel1_tbMessage\").innerHTML = \""+name+"\";");
    }
  }
}

// Improve EMail-Site
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
  if(typeof(GM_getValue("settings_mail_signature")) != "undefined") document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage").innerHTML += "\n\n"+GM_getValue("settings_mail_signature");
}

// Default Log Type && Log Signature
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|PLogGuid|wp)\=/) && document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType')){
  if(settings_default_logtype != "-1" && !document.location.href.match(/\&LogType\=/) && !document.location.href.match(/PLogGuid/)){
    var select = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
    var childs = select.childNodes;

    for(var i=0; i<childs.length; i++){
      if(childs[i].value == settings_default_logtype){
        childs[i].setAttribute("selected","selected");
      }
    }
  }

  // Signature
  if(document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML == "" || document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?PLogGuid\=/)) document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML += GM_getValue("settings_log_signature","");

  // Set Cursor do Pos1
  function gclh_setForcus(){
    var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');
    if(input){
      input.selectionStart = 0;
      input.selectionEnd = 0;
      input.focus();
    }
  }
  window.addEventListener("load", gclh_setForcus, false);

  // Replace #found# variable
  if(getElementsByClass('SignedInText')[0]){
    var text = getElementsByClass('SignedInText')[0].childNodes[7].innerHTML;
    var finds = parseInt(text.match(/([0-9,]{1,10})/)[1].replace(/,/g,""));
    document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found_no#/g,finds);
    finds++;
    document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found#/g,finds);
  }
}

// Default TB Log Type && Log Signature
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/log\.aspx/)){
  if(settings_default_tb_logtype != "-1" && !document.location.href.match(/\&LogType\=/)){
    var select = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
    var childs = select.childNodes;

    for(var i=0; i<childs.length; i++){
      if(childs[i].value == settings_default_tb_logtype){
        childs[i].setAttribute("selected","selected");
      }
    }
  }

  // Signature
  if(document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo') && document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML == "") document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = GM_getValue("settings_tb_signature","");

  // Set Cursor do Pos1
  function gclh_setForcus(){
    var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');
    if(input){
      input.selectionStart = 0;
      input.selectionEnd = 0;
      input.focus();
    }
  }
  window.addEventListener("load", gclh_setForcus, false);

  // Replace #found# variable
  if(getElementsByClass('SignedInText')[0]){
    var text = getElementsByClass('SignedInText')[0].childNodes[7].innerHTML;
    var finds = parseInt(text.match(/([0-9,]{1,10})/)[1].replace(/,/g,""));
    document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found_no#/g,finds);
    finds++;
    document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found#/g,finds);
  }
}

// Show Coin-series in TB-Listing
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/details\.aspx/)){
  var dl = getElementsByClass('BugDetailsList')[0];

  if(dl){
    var title = document.getElementsByTagName('title')[0].innerHTML;
    if(title){
      var matches = title.match(/\([A-Za-z0-9]*\) ([A-Za-z0-9-_.,\s]*) - /);
      if(matches) dl.innerHTML += "<dt>Series:</dt><dd>"+matches[1]+"</dd>";
    }
  }
}

// Improve Friendlist
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/myfriends\.aspx/)){
  var friends = getElementsByClass("FriendText");
  
  for(var i=0; i<friends.length; i++){
    var friend = friends[i];
    var name = friend.getElementsByTagName("a")[0];
    var add = "";
    var founds = friend.getElementsByTagName("dd")[4].innerHTML;
    var last_founds = GM_getValue("friends_founds_"+name.innerHTML);

    if(typeof(last_founds) == "undefined") last_founds = founds;
    if((founds - last_founds) > 0) add = " <font color='#00AA00'><b>(+"+(founds - last_founds)+")</b></font>";
    GM_setValue("friends_founds_"+name.innerHTML,founds);
    
//    friend.getElementsByTagName("dl")[0].lastChild.innerHTML = "<a href='/seek/nearest.aspx?ul="+name.innerHTML+"'>"+friend.getElementsByTagName("dl")[0].lastChild.innerHTML+"</a>";
    friend.getElementsByTagName("dd")[4].innerHTML = "<a href='/seek/nearest.aspx?ul="+name.innerHTML+"&disable_redirect'>"+founds+"</a>"+add;
    
    friend.getElementsByTagName("p")[0].innerHTML = "<a name='lnk_profilegallery2' href='"+name.href+"'>Gallery</a> | <a href='/seek/nearest.aspx?u="+name.innerHTML+"&disable_redirect'>Hidden Caches</a> | "+friend.getElementsByTagName("p")[0].innerHTML;
  }
}

// Show Google-Maps Link on Cache Page
if(settings_show_google_maps && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?/) && document.getElementById("ctl00_ContentBody_uxViewLargerMap")){
  var ref_link = document.getElementById("ctl00_ContentBody_uxViewLargerMap");
  var box = ref_link.parentNode;
  var matches = ref_link.href.match(/lat=([-0-9]*\.[0-9]*)\&lng=([-0-9]*\.[0-9]*)/);
    
  box.appendChild(document.createElement("br"));
  
  var link = document.createElement("a");
  link.setAttribute("class","lnk");
  link.setAttribute("target","_blank");
  link.setAttribute("title","Show area at Google Maps");
  link.setAttribute("href","http://maps.google.de/?ll="+matches[1]+","+matches[2]);
  
  var img = document.createElement("img");
  img.setAttribute("src","/images/silk/map_go.png");
  link.appendChild(img);
  
  link.appendChild(document.createTextNode(" "));
  
  var span = document.createElement("span");
  span.appendChild(document.createTextNode("Show area on Google Maps"));
  link.appendChild(span);
  
  box.appendChild(link);
}

// Show Google-Maps Link on Map Page
if(settings_show_google_maps && document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\/default\.aspx/)){

/*
  var evObj = document.createEvent('MouseEvents');
  evObj.initEvent('click', true, false );
  document.getElementById("lp").dispatchEvent(evObj);
      
  //document.getElementById("lp").click();
  alert(document.getElementById("leurl").value);
  */
  /*var ref_link = document.getElementById("ctl00_ContentBody_uxViewLargerMap");
  var box = ref_link.parentNode;
  var matches = ref_link.href.match(/lat=([-0-9]*\.[0-9]*)\&lng=([-0-9]*\.[0-9]*)/);
    
  box.appendChild(document.createElement("br"));
  
  var link = document.createElement("a");
  link.setAttribute("class","lnk");
  link.setAttribute("target","_blank");
  link.setAttribute("title","Show area at Google Maps");
  link.setAttribute("href","http://maps.google.de/?ll="+matches[1]+","+matches[2]);
  
  var img = document.createElement("img");
  img.setAttribute("src","/images/silk/map_go.png");
  link.appendChild(img);
  
  link.appendChild(document.createTextNode(" "));
  
  var span = document.createElement("span");
  span.appendChild(document.createTextNode("Show area on Google Maps"));
  link.appendChild(span);
  
  box.appendChild(link);*/
}

// Show "Log It"-Button
if(settings_show_log_it && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)){
  var links = document.getElementsByTagName("a");
  
  for(var i=0; i<links.length; i++){
    if(links[i].href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?.*/) && links[i].innerHTML.match(/^<span>/)){
      links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>","<a title='Log it' href='"+links[i].href.replace("cache_details","log")+"'><img src='/images/stockholm/16x16/add_comment.gif'></a><br>");
    }
  }
}

// Improve Bookmark-List
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

// Improve "My Profile"
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

// Show Homezone-Circle on Map
if(settings_show_homezone && document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\/beta/)){ // BETA map
  var code = "function drawCircle(){ ";
  code += "if(google.maps){";
  code += "  var home_coord = new google.maps.LatLng("+(GM_getValue("home_lat")/10000000)+", "+(GM_getValue("home_lng")/10000000)+");";
  code += "  var circle = new google.maps.Circle({center:home_coord,map:map,radius:"+settings_homezone_radius+"000,strokeColor:'#0000FF',fillColor:'#0000FF',fillOpacity:0.1,clickable:false});";
  code += "}}";
  
  var script = document.createElement("script");
  script.innerHTML = code;
  document.getElementsByTagName("body")[0].appendChild(script);
    
  function drawCircle(){
    unsafeWindow.drawCircle();
  }
  
  window.addEventListener("load", drawCircle, false);
}
if(settings_show_homezone && document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\/default.aspx/)){
  var code = "function drawCircle() {"; // Code from http://www.geocodezip.com/GoogleEx_markerinfowindowCircle.asp
  code += "var point = new GLatLng("+(GM_getValue("home_lat")/10000000)+", "+(GM_getValue("home_lng")/10000000)+");";
  code += "var radius = "+settings_homezone_radius+";";
  code += "  var cColor = '#0000FF';";
  code += "  var cWidth = 5;";
  code += "  var Cradius = radius;   ";
  code += "  var d2r = Math.PI/180; ";
  code += "  var r2d = 180/Math.PI; ";
  code += "  var Clat = (Cradius/3963)*r2d; ";
  code += "  var Clng = Clat/Math.cos(point.lat()*d2r); ";
  code += "  var Cpoints = []; ";
  code += "  for (var i=0; i < 33; i++) { ";
  code += "    var theta = Math.PI * (i/16); ";
  code += "    var CPlng = point.lng() + (Clng * Math.cos(theta)); ";
  code += "    var CPlat = point.lat() + (Clat * Math.sin(theta)); ";
  code += "    var P = new GLatLng(CPlat,CPlng);";
  code += "    Cpoints.push(P); ";
  code += "  }";
  code += "  map.addOverlay(new GPolyline(Cpoints,cColor,cWidth)); ";
  code += "}";
  
  var script = document.createElement("script");
  script.innerHTML = code;
  document.getElementsByTagName("body")[0].appendChild(script);
    
  function drawCircle(){
    unsafeWindow.drawCircle();
  }
  
  window.addEventListener("load", drawCircle, false);
  
  // Draw Homezone Link
  var drawlink = document.createElement("a");
  drawlink.setAttribute("onclick","drawCircle();");
  drawlink.href = "#";
  drawlink.id = "drawlink";
  drawlink.innerHTML = "Draw Homezone";
  document.getElementById('uxMapRefresh').parentNode.insertBefore(drawlink,document.getElementById('uxMapRefresh'));
  var br = document.createElement("br");
  document.getElementById('uxMapRefresh').parentNode.insertBefore(br,document.getElementById('uxMapRefresh'));
}

// Change Map width
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\/default.aspx/) && document.getElementById("Content")){
  var map_width = GM_getValue("map_width","1200");
  if(document.getElementById("Content").childNodes[1]) document.getElementById("Content").childNodes[1].style.width = map_width+"px";
  if(document.getElementById("ctl00_divBreadcrumbs")) document.getElementById("ctl00_divBreadcrumbs").style.width = map_width+"px";
  if(document.getElementById("ctl00_divContentMain")) document.getElementById("ctl00_divContentMain").style.width = map_width+"px";
}

// Aplly Search-field in Navigation
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/default\.aspx\?navi_search=/)){
  var matches = document.location.href.match(/\?navi_search=(.*)/);
  if(matches) document.getElementById("tbSearch").value = decodeURIComponent(matches[1]).replace(/\+/g," ");

  function click_search(){
    document.getElementById("ibSearch").click();
  }

  window.addEventListener("load", click_search, false);
}

// Home-Coords in Search-Field
//if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/$/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/default\.aspx$/)){
//  if(GM_getValue("home_lat") && GM_getValue("home_lng")){
//    var txt = "";
//    var lat = GM_getValue("home_lat")/10000000;
//    var lng = GM_getValue("home_lng")/10000000;
//
///*    if(lat < 0) txt += "S ";
//    else txt += "N ";
//    txt += lat;
//
//    if(lng < 0) txt += " W ";
//    else txt += " E ";
//    txt += lng;*/
//
//    txt = "N "+lat+" E "+lng;
//
//    document.getElementById("tbSearch").value = txt;
//  }
//}

// Dynamic Map
if(settings_dynamic_map && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?/)){
  function load_dynamic(){
    unsafeWindow.loadDynamicMap();
  }

  window.addEventListener("load", load_dynamic, false);
}

// Set default map to old
if(settings_old_map){
  var links = document.getElementsByTagName("a");

  for(var i = 0; i < links.length; i++){
    if(links[i].href.match(/\/map\/beta\/default\.aspx/)){
      var match = links[i].href.match(/\/map\/beta\/default\.aspx(.*)/);
      if(match[1]){
        links[i].href = "/map/default.aspx"+match[1];
      }
    }
  }
}

// Edit-Link to own Caches in Profile
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

// Post log from Listing (inline)
if(settings_log_inline && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx(\?|\?pf\=\&)(guid|wp)\=[a-zA-Z0-9-]*/)){
  var links = document.getElementsByTagName('a');

  var menu = false;
  var watch = false;
  var gallery = false;
  for(var i = 0; i < links.length; i++){
    if(links[i].href.match(/log\.aspx/) && !menu){
      menu = links[i];
    }else if(links[i].href.match(/gallery\.aspx/) && !gallery){
      gallery = links[i];
    }else if(links[i].href.match(/watchlist\.aspx/) && !watch){
      watch = links[i];
    }
  }
  
  var heads = document.getElementsByTagName("h3");
  var head = false;
  for(var i = 0; i < heads.length; i++){
    if(heads[i].className == "clear"){
      head = heads[i];
      break;
    }
  }
  

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
      iframe.setAttribute("src","log.aspx?ID="+match[1]+"&gclh=small");

      var a = document.createElement("a");
      a.setAttribute("href","#gclhLogIt");
      a.setAttribute("name","gclhLogIt");
      a.appendChild(document.createTextNode("Log your visit"));
      a.addEventListener("click", hide_iframe, false);

      head.parentNode.insertBefore(a,head);
      head.parentNode.insertBefore(iframe,head);
    }

    var a = document.createElement("a");
    a.setAttribute("href","#gclhLogIt");
    a.setAttribute("class","lnk");
    a.innerHTML = "<img src='/images/stockholm/16x16/comment_add.gif'> <span>Log your visit (inline)</span>";
    a.addEventListener("click", hide_iframe, false);

    var li = document.createElement('li');
    li.appendChild(a);

    var link = false;
    if(gallery) link = gallery;
    else link = watch;
    
    if(link) link.parentNode.parentNode.insertBefore(li,link.parentNode);
  }
}
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(ID|guid)\=[a-zA-Z0-9-]*\&gclh\=small/)){ // Hide everything to be smart for the iframe :)
  if(document.getElementsByTagName('html')[0]) document.getElementsByTagName('html')[0].style.backgroundColor = "#FFFFFF";

  if(document.getElementsByTagName("header")[0]) document.getElementsByTagName("header")[0].style.display = "none";
   
  if(document.getElementById('ctl00_divBreadcrumbs')) document.getElementById('ctl00_divBreadcrumbs').style.display = "none";

  if(getElementsByClass('BottomSpacing')[0]) getElementsByClass('BottomSpacing')[0].style.display = "none";
  if(getElementsByClass('BottomSpacing')[1]) getElementsByClass('BottomSpacing')[1].style.display = "none";
//  if(document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink')) document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').parentNode.style.display = 'none';
//  if(document.getElementsByTagName("dt")[0]) document.getElementsByTagName("dt")[0].style.display = "none";

  if(document.getElementById('divAdvancedOptions')) document.getElementById('divAdvancedOptions').style.display = "none";
  if(!settings_log_inline_tb && document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel')) document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel').style.display = "none";

  if(document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel')) document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel').style.display = "none";
  if(document.getElementById('ctl00_ContentBody_uxVistOtherListingGC')) document.getElementById('ctl00_ContentBody_uxVistOtherListingGC').style.display = "none";
  if(document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton')) document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton').style.display = "none";

  if(document.getElementById('ctl00_divContentSide')) document.getElementById('ctl00_divContentSide').style.display = "none";

  if(document.getElementById('UtilityNav')) document.getElementById('UtilityNav').style.display = "none";

  if(document.getElementsByTagName("footer")[0]) document.getElementsByTagName("footer")[0].style.display = "none";

  function hide_feedback(){
    var button = document.getElementById('uservoice-feedback');
    if(button){
      button.parentNode.removeChild(button);
    }
  }
  window.addEventListener("load", hide_feedback, false);

  if(getElementsByClass('container')[1]) getElementsByClass('container')[1].style.display = "inline";

  var links = document.getElementsByTagName("a");
  for(var i=0; i<links.length; i++){
    links[i].setAttribute("target","_blank");
  }
}

// New Width
if(GM_getValue("settings_new_width") > 0 && GM_getValue("settings_new_width") != 950){
  var width = GM_getValue("settings_new_width");
  var css = ".container { width: "+width+"px; }";
  css += "#Content .container { width: "+width+"px; }";
  css += ".span-24 { width: "+width+"px; }";
  css += ".span-20 { width: "+(width-160)+"px; }";
  css += ".span-16 { width: "+(width-330)+"px; }";
  css += ".span-17 { width: "+(width-280)+"px; }";
  css += ".span-19 { width: "+(width-200)+"px; }";

  var head = document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

// Show Favourite percentage
if(false){
  var fav = getElementsByClass('favorite-container')[0];
  if(fav){
    var score = document.getElementById('uxFavoriteScore').innerHTML.match(/([0-9]*)/);
alert(uneval(score));
    if(score) fav.innerHTML = "<span class='favorite-value'> 9</span><br>&nbsp;&nbsp;&nbsp;&nbsp;"+score+"% &nbsp;&nbsp;&nbsp;&nbsp;<img id='imgFavoriteArrow' src='/images/arrow-down.png' alt='Expand' title='Expand'>";
  }

  function gclh_load_score(){
    unsafeWindow.showFavoriteScore();
  }
  window.addEventListener("load", gclh_load_score, false);
}

// Show amount of different Coins in public profile
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/profile\//) && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkCollectibles').className == "Active"){
  var tables = getElementsByClass("Table");
  if(tables){
    var table = tables[0];
    var rows = table.getElementsByTagName("tr");
    var last = rows[rows.length-1];
    last.childNodes[1].innerHTML = "<strong>"+(rows.length-2)+"</strong>";

    var table = tables[1];
    var rows = table.getElementsByTagName("tr");
    var last = rows[rows.length-1];
    last.childNodes[1].innerHTML = "<strong>"+(rows.length-2)+"</strong>";
  }
}

// Auto-Visit
/*if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx/){
  var selects = document.getElementsByTagName("select");
  for (var i=0; i < selects.length; i++){
    if(selects[i].id.match(/ctl00_ContentBody_LogBookPanel1_uxTrackables_repTravelBugs_ctl[0-9]*_ddlAction/)){
// blabla

    }
  }
}*/

////////////////////////////////////////////////////////////////////////////

// Helper: from N/S/E/W Deg Min.Sec to Dec
function toDec(coords){
  var match = coords.match(/^(N|S) ([0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9]) (E|W) ([0-9][0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9])$/);

  var dec1 = parseInt(match[2],10) + (parseFloat(match[3]+"."+match[4])/60);
  if(match[1] == "S") dec1 = dec1 * -1;
  dec1 = Math.round(dec1*10000000)/10000000;

  var dec2 = parseInt(match[6],10) + (parseFloat(match[7]+"."+match[8])/60);
  if(match[5] == "W") dec2 = dec2 * -1;
  dec2 = Math.round(dec2*10000000)/10000000;

  return new Array(dec1,dec2);
}

// Helper: from Deg to DMS
function DegtoDMS(coords){
  var match = coords.match(/^(N|S) ([0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9]) (E|W) ([0-9][0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9])$/);

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

// Show other Coord-Formats in Listing
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx/) && document.getElementById('ctl00_ContentBody_LatLon')){
  var box = document.getElementById('ctl00_ContentBody_LocationSubPanel').firstChild;
  var coords = document.getElementById('ctl00_ContentBody_LatLon').innerHTML;
  if(coords.match(/^(N|S) [0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9] (E|W) [0-9][0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9]$/)){
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
  }
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

// Save HomeCoords for special bookmarks - From Index
/* Da stehen keine Koords mehr ...
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/$/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/default\.aspx$/)){
  var search_value = document.getElementById("ctl00_ContentBody_saddress").value;

  if(search_value.match(/^(N|S) [0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9] (E|W) [0-9][0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9]$/)){
    var latlng = toDec(search_value);

    if(GM_getValue("home_lat",0) != parseInt(latlng[0]*10000000)) GM_setValue("home_lat",parseInt(latlng[0]*10000000)); // * 10000000 because GM don't know float
    if(GM_getValue("home_lng",0) != parseInt(latlng[1]*10000000)) GM_setValue("home_lng",parseInt(latlng[1]*10000000));
  }
}*/

// Transfer TB-Tracking Number to Log-Field
// if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/track\/default\.aspx$/)){
//   function gclh_save_tracking(){
//     var tracking = document.getElementById('ctl00_ContentBody_txtTrackingNumber').value;
//     if(tracking && !tracking.match(/^TB/i)) GM_setValue("last_tracking_nr",tracking);
//   }
//   document.getElementById('ctl00_ContentBody_btnLookupCode').addEventListener("click",gclh_save_tracking,false);
//   document.getElementById('ctl00_ContentBody_txtTrackingNumber').addEventListener("keypress",function(e){if(e.which == 13) gclh_save_tracking();},false);
// }
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

// Fix decrypted Hint linefeeds
if(document.getElementById('div_hint')){
  function gclh_repair_hint(){
    document.getElementById('div_hint').innerHTML = document.getElementById('div_hint').innerHTML.replace(/<c>/g,"<p>");
    document.getElementById('div_hint').innerHTML = document.getElementById('div_hint').innerHTML.replace(/<\/c>/g,"</p>");
  }
  gclh_repair_hint();
  document.getElementById('ctl00_ContentBody_lnkDH').addEventListener("click", gclh_repair_hint, false);
}

// Improve Search Lists color
var css = "table.Table tr.TertiaryRow td, .TertiaryRow, table.Table tr td.TertiaryRow { background-color: #c2e0c3; }";
var head = document.getElementsByTagName('head')[0];
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css;
head.appendChild(style);

// Hide Navi on SignIn-Overlay
function hide_navi(){
  var navi = document.getElementById('Navigation');
  if(navi.style.display == "") navi.style.display = "none";
  else navi.style.display = "";
}
if(document.getElementById('hlSignIn')) document.getElementById('hlSignIn').addEventListener("click",hide_navi,false);
if(document.getElementById('ctl00_hlSignInClose')) document.getElementById('ctl00_hlSignInClose').addEventListener("click",hide_navi,false);

// Save HomeCoords for special bookmarks - From Manage Home Location
if(document.location.href.match(/^http:\/\/www\.geocaching\.com\/account\/ManageLocations\.aspx/)){
  function setCoordsHelper(){
    var search_value = document.getElementById("search").value;

    if(search_value.match(/^(N|S) [0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9] (E|W) [0-9][0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9]$/)){
      var latlng = toDec(search_value);

      if(GM_getValue("home_lat",0) != parseInt(latlng[0]*10000000)) GM_setValue("home_lat",parseInt(latlng[0]*10000000)); // * 10000000 because GM don't know float
      if(GM_getValue("home_lng",0) != parseInt(latlng[1]*10000000)) GM_setValue("home_lng",parseInt(latlng[1]*10000000));
    }
  }

  window.addEventListener("load", setCoordsHelper, false); // On first hit, the search-field ist filled after loading - so we have to wait
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

// Save uid for special bookmarks - From My Profile
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

// Redirect to Neares List/Map
function linkToNearesList(){
  if(typeof(GM_getValue("home_lat")) == "undefined" || typeof(GM_getValue("home_lng")) == "undefined"){
    if(window.confirm("To use this Link, you have to set your Home-Coordinates.")) document.location.href = "http://www.geocaching.com/account/ManageLocations.aspx";
  }else{
    document.location.href = "http://www.geocaching.com/seek/nearest.aspx?lat="+(GM_getValue("home_lat")/10000000)+"&lng="+(GM_getValue("home_lng")/10000000)+"&dist=25&disable_redirect";
  }
}
if(document.getElementById('lnk_nearestlist')){
  document.getElementById('lnk_nearestlist').addEventListener("click", linkToNearesList, false);
}

function linkToNearesMap(){
  if(typeof(GM_getValue("home_lat")) == "undefined" || typeof(GM_getValue("home_lng")) == "undefined"){
    if(window.confirm("To use this Link, you have to set your Home-Coordinates.")) document.location.href = "http://www.geocaching.com/account/ManageLocations.aspx";
  }else{
    document.location.href = map_url+"?lat="+(GM_getValue("home_lat")/10000000)+"&lng="+(GM_getValue("home_lng")/10000000);
  }
}
if(document.getElementById('lnk_nearestmap')){
  document.getElementById('lnk_nearestmap').addEventListener("click", linkToNearesMap, false);
}

// Redirect to Neares List without Founds
function linkToNearesListWo(){
  if(typeof(GM_getValue("home_lat")) == "undefined" || typeof(GM_getValue("home_lng")) == "undefined"){
    if(window.confirm("To use this Link, you have to set your Home-Coordinates.")) document.location.href = "http://www.geocaching.com/account/ManageLocations.aspx";
  }else{
    document.location.href = "http://www.geocaching.com/seek/nearest.aspx?lat="+(GM_getValue("home_lat")/10000000)+"&lng="+(GM_getValue("home_lng")/10000000)+"&dist=25&f=1&disable_redirect";
  }
}
if(document.getElementById('lnk_nearestlist_wo')){
  document.getElementById('lnk_nearestlist_wo').addEventListener("click", linkToNearesListWo, false);
}

// Redirect to My Trackables
function linkToMyTrackables(){
  if(typeof(GM_getValue("uid")) == "undefined"){
    if(window.confirm("To use this Link, the script has to know your uid. Just load the \"My Profile\" site and the script will save it automatically.")) document.location.href = "http://www.geocaching.com/my/";
  }else{
    document.location.href = "http://www.geocaching.com/track/search.aspx?o=1&uid="+GM_getValue("uid");
  }
}
if(document.getElementById('lnk_my_trackables')){
  document.getElementById('lnk_my_trackables').addEventListener("click", linkToMyTrackables, false);
}

// Redirect + JS-Exec
function linkToGeocaches(){
  GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkUserStats','')");
  document.location.href = "/profile/default.aspx";
}
if(document.getElementById('lnk_profilegeocaches')){
  document.getElementById('lnk_profilegeocaches').addEventListener("click", linkToGeocaches, false);
}

function linkToTrackables(){
  GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkCollectibles','')");
  document.location.href = "/profile/default.aspx";
}
if(document.getElementById('lnk_profiletrackables')){
  document.getElementById('lnk_profiletrackables').addEventListener("click", linkToTrackables, false);
}

function linkToGallery(){
  GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkGallery','')");
  document.location.href = "/profile/default.aspx";
}
if(document.getElementById('lnk_profilegallery')){
  document.getElementById('lnk_profilegallery').addEventListener("click", linkToGallery, false);
}
var links = document.getElementsByName('lnk_profilegallery2');
for(var i=0; i<links.length; i++){ // Friendlist
  links[i].addEventListener("click", linkToGallery, false);
}

function linkToBookmarks(){
  GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkLists','')");
  document.location.href = "/profile/default.aspx";
}
if(document.getElementById('lnk_profilebookmarks')){
  document.getElementById('lnk_profilebookmarks').addEventListener("click", linkToBookmarks, false);
}

function linkToSouvenirs(){
  GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkSouvenirs','')");
  document.location.href = "/profile/default.aspx";
}
if(document.getElementById('lnk_profilesouvenirs')){
  document.getElementById('lnk_profilesouvenirs').addEventListener("click", linkToSouvenirs, false);
}

function linkToStatistics(){
  GM_setValue("run_after_redirect","__doPostBack('ctl00$ContentBody$ProfilePanel1$lnkStatistics','')");
  document.location.href = "/profile/default.aspx";
}
if(document.getElementById('lnk_profilestatistics')){
  document.getElementById('lnk_profilestatistics').addEventListener("click", linkToStatistics, false);
}

// Close the Overlays
function btnClose(){
  if(document.getElementById('bg_shadow')) document.getElementById('bg_shadow').style.display = "none";
  if(document.getElementById('settings_overlay')) document.getElementById('settings_overlay').style.display = "none";
  if(document.getElementById('findplayer_overlay')) document.getElementById('findplayer_overlay').style.display = "none";
}

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
    html += "<form action=\"/find/default.aspx\" method=\"post\" name=\"aspnetForm\">";
    html += "<input class='gclh_form' type='hidden' name='__VIEWSTATE' value=''>";
    html += "<input class='gclh_form' id='findplayer_field' class=\"Text\" type=\"text\" maxlength=\"100\" name=\"ctl00$ContentBody$FindUserPanel1$txtUsername\"/>";
    html += "<input class='gclh_form' type=\"submit\" value=\"Go\" name=\"ctl00$ContentBody$FindUserPanel1$GetUsers\"/><input class='gclh_form' id='btn_close' type='button' value='close'>";
    html += "</form>";
    html += "</div>";
    document.getElementsByTagName('body')[0].innerHTML += html;

    document.getElementById("findplayer_field").focus();

    document.getElementById('btn_close').addEventListener("click", btnClose, false);
  }
}

if(document.getElementById('lnk_findplayer')){
  document.getElementById('lnk_findplayer').addEventListener("click", createFindPlayerForm, false);
}

function checkbox(setting_id, label) {
  return "<input type='checkbox' "+(eval(setting_id) ? "checked='checked'" : "" )+" id='" + setting_id + "'> " + label;
}

// Configuration Menu
function gclh_showConfig(){
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
//    html += "<div id='bg_shadow' style='width: 100%; height: 100%; background-color: #000000; position:fixed; top: 0; left: 0; opacity: 0.5; filter: alpha(opacity=50);'></div>";
//    document.getElementsByTagName('body')[0].innerHTML += html;
    document.getElementById('bg_shadow').addEventListener("click", btnClose, false);
  }

  if(document.getElementById('settings_overlay') && document.getElementById('settings_overlay').style.display == "none"){
    // If menu already created, just show it
    document.getElementById('settings_overlay').style.display = "";
  }else{
    var css = document.createElement("style");
    var html = "";
//    html += "<style>";
    html += "#settings_overlay {";
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
    html += "";
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
    html += "  border: 1px solid #000000;";
    html += "  background-color: #d8cd9d;";
    html += "}";
//    html += "</style>";
    css.innerHTML = html;
  
    var div = document.createElement("div");
    div.setAttribute("id","settings_overlay");
    var html = "";  
//    html += "<div id='settings_overlay'>";
    html += "<h3 class='gclh_headline'>GC little helper</h3>";
    html += "<div class='gclh_content'>";
    html += "";
    html += "<h4 class='gclh_headline2'>Global</h4>";
    html += "Home-Coords: <input class='gclh_form' type='text' id='settings_home_lat_lng' value='"+DectoDeg(GM_getValue("home_lat"),GM_getValue("home_lng"))+"'> <a class='gclh_info' href='#'><b>?</b><span class='gclh_span'>The Home-Coords are filled automatically if you update your Home-Coords on gc.com. If it doesn\'t work you can insert them here. These Coords are used for some special Links (Nearest List, Nearest Map, ..) and for the homezone-circle on the map.</span></a><br>";
    html += checkbox('settings_bookmarks_on_top', "Show <a class='gclh_ref' href='#gclh_linklist'>Linklist</a> on top") + "<br/>";
    html += checkbox('settings_bookmarks_show', "Show <a class='gclh_ref' href='#gclh_linklist'>Linklist</a> in profile") + "<br/>";
    html += checkbox('settings_hide_feedback', 'Hide Feedback-Button') + "<br/>";
    html += checkbox('settings_hide_advert_link', 'Hide link to advertisement instructions') + "<br/>";
    html += checkbox('settings_hide_line_breaks', 'Hide superfluous line breaks') + "<br/>";
    html += "Page-Width: <input class='gclh_form' type='text' size='3' id='settings_new_width' value='"+GM_getValue("settings_new_width",950)+"'> px<br>";
    html += "";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'>Nearest List</h4>";
    html += checkbox('settings_redirect_to_map', 'Redirect to Map') + "<br/>";
    html += checkbox('settings_show_log_it', 'Show Log-It Icon') + "<br/>";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'>Maps</h4>";
    html += checkbox('settings_show_homezone', 'Show Homezone') + " - Radius: <input class='gclh_form' type='text' size='2' id='settings_homezone_radius' value='"+settings_homezone_radius+"'> km<br>";
    html += checkbox('settings_old_map', 'Set old map as default') + "<br/>";
    html += "Map-Width: <input class='gclh_form' type='text' size='3' id='map_width' value='"+GM_getValue("map_width",1200)+"'> px<br>";
    html += "";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'>Listing</h4>";
    html += checkbox('settings_log_inline', 'Log Cache from Listing (inline)') + " - " + checkbox('settings_log_inline_tb', 'Show TB-List') + "<br/>";
    html += checkbox('settings_hide_empty_cache_notes', 'Hide Cache Notes if empty') + "<br/>";
    html += checkbox('settings_hide_cache_notes', 'Hide Cache-Notes completely') + "<br/>";
    html += checkbox('settings_hide_disclaimer', 'Hide Disclaimer') + "<br/>";
    html += checkbox('settings_hide_spoilerwarning', 'Hide spoiler warning') + "<br/>";
    html += checkbox('settings_show_all_logs', 'Show all Logs - if log-count lower than') + " <input class='gclh_form' type='text' size='2' id='settings_show_all_logs_count' value='"+settings_show_all_logs_count+"'><br>";
    html += checkbox('settings_hide_hint', 'Hide hint behind a link') + "<br/>";
    html += checkbox('settings_decrypt_hint', 'Decrypt Hint') + "<br/>";
    html += checkbox('settings_show_mail', 'Show Mail Link beside Usernames') + "<br/>";
    html += checkbox('settings_show_google_maps', 'Show Link to and from google maps') + "<br/>";
    html += checkbox('settings_dynamic_map', 'Show dynamic map') + "<br/>";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'>Logging</h4>";
    html += checkbox('settings_submit_log_button', 'Submit Log Text on F2') + "<br/>";
    html += checkbox('settings_show_bbcode', 'Show Smilies and BBCode') + "<br/>";
    html += "Log-Templates: <font class='gclh_small'>(BBCodes have to be enabled - #found# will be replaced with founds+1 - #found_no# will be replaced with founds)</font><br>";
    for(var i = 0; i < anzTemplates; i++){
      html += "&nbsp;&nbsp;<input class='gclh_form' type='text' size='15' id='settings_log_template_name["+i+"]' value='"+GM_getValue('settings_log_template_name['+i+']','')+"'> ";
      html += "<a onClick=\"if(document.getElementById(\'settings_log_template_div["+i+"]\').style.display == \'\') document.getElementById(\'settings_log_template_div["+i+"]\').style.display = \'none\'; else document.getElementById(\'settings_log_template_div["+i+"]\').style.display = \'\'; return false;\" href='#'><img src='http://www.geocaching.com/images/stockholm/16x16/page_white_edit.gif' border='0'></a><br>";
      html += "<div id='settings_log_template_div["+i+"]' style='display: none;'>&nbsp;&nbsp;&nbsp;&nbsp;<textarea class='gclh_form' rows='6' cols='30' id='settings_log_template["+i+"]'>&zwnj;"+GM_getValue("settings_log_template["+i+"]","")+"</textarea></div>";
    }
    html += "Default Log-Type: &nbsp; &nbsp; &nbsp;<select class='gclh_form' id='settings_default_logtype'>";
    html += "  <option value=\"-1\" "+(settings_default_logtype == "-1" ? "selected=\"selected\"" : "")+">- Select Type of Log -</option>";
    html += "  <option value=\"2\" "+(settings_default_logtype == "2" ? "selected=\"selected\"" : "")+">Found it</option>";
    html += "  <option value=\"3\" "+(settings_default_logtype == "3" ? "selected=\"selected\"" : "")+">Didn't find it</option>";
    html += "  <option value=\"4\" "+(settings_default_logtype == "4" ? "selected=\"selected\"" : "")+">Write note</option>";
    html += "  <option value=\"7\" "+(settings_default_logtype == "7" ? "selected=\"selected\"" : "")+">Needs Archived</option>";
    html += "  <option value=\"45\" "+(settings_default_logtype == "45" ? "selected=\"selected\"" : "")+">Needs Maintenance</option>";
    html += "</select><br>";
    html += "Default TB-Log-Type: <select class='gclh_form' id='settings_default_tb_logtype'>";
    html += "  <option value=\"-1\" "+(settings_default_tb_logtype == "-1" ? "selected=\"selected\"" : "")+">- Select Type of Log -</option>";
    html += "  <option value=\"13\" "+(settings_default_tb_logtype == "13" ? "selected=\"selected\"" : "")+">Retrieve from ..</option>";
    html += "  <option value=\"19\" "+(settings_default_tb_logtype == "19" ? "selected=\"selected\"" : "")+">Grab it from ..</option>";
    html += "  <option value=\"4\" "+(settings_default_tb_logtype == "4" ? "selected=\"selected\"" : "")+">Write note</option>";
    html += "  <option value=\"48\" "+(settings_default_tb_logtype == "48" ? "selected=\"selected\"" : "")+">Discovered It</option>";
    html += "</select><br>";
    html += "Cache-Signature: <font class='gclh_small'>(#found# will be replaced with founds+1 - #found_no# will be replaced with founds)</font><br>";
    html += "<textarea class='gclh_form' rows='8' cols='40' id='settings_log_signature'>&zwnj;"+GM_getValue("settings_log_signature","")+"</textarea><br>";
    html += "TB-Signature: <font class='gclh_small'>(#found# will be replaced with founds+1 - #found_no# will be replaced with founds)</font><br>";
    html += "<textarea class='gclh_form' rows='8' cols='40' id='settings_tb_signature'>&zwnj;"+GM_getValue("settings_tb_signature","")+"</textarea><br>";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'>Mail-Form</h4>";
    html += "Signature:<br>";
    html += "<textarea class='gclh_form' rows='8' cols='40' id='settings_mail_signature'>&zwnj;"+GM_getValue("settings_mail_signature","")+"</textarea><br>";
    html += "<br>";
    html += "";
    html += "<h4 class='gclh_headline2'><a name='gclh_linklist'></a>Linklist / Navigation <a class='gclh_small' href='#gclh_linklist' id='gclh_show_linklist_btn'>show</a></h4>";
    html += "<div id='gclh_settings_linklist' style='display: none;'>";
    html += "Remove from Navigation:<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_play') ? "checked='checked'" : "" )+" id='remove_navi_play'> Play<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_profile') ? "checked='checked'" : "" )+" id='remove_navi_profile'> Your Profile<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_join') ? "checked='checked'" : "" )+" id='remove_navi_join'> Join<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_community') ? "checked='checked'" : "" )+" id='remove_navi_community'> Community<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_videos') ? "checked='checked'" : "" )+" id='remove_navi_videos'> Videos<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_resources') ? "checked='checked'" : "" )+" id='remove_navi_resources'> Resources<br>";
    html += "<input type='checkbox' "+(GM_getValue('remove_navi_shop') ? "checked='checked'" : "" )+" id='remove_navi_shop'> Shop<br>";
    html += "<br>";
    html += "<input type='checkbox' "+(settings_bookmarks_search ? "checked='checked'" : "" )+" id='settings_bookmarks_search'> Show Searchfield - Default Value: <input class='gclh_form' type='text' id='settings_bookmarks_search_default' value='"+settings_bookmarks_search_default+"' size='4'><br>";
    html += "<input type='checkbox' "+(settings_bookmarks_top_menu ? "checked='checked'" : "" )+" id='settings_bookmarks_top_menu'> Show Linklist as Drop-Down<br>";
    html += "<br>";
    html += "<table>";
    html += "  <tr>";
    html += "    <td colspan='2'><font class='gclh_small'>(Second check to enable on Beta Map)</font></td>";
    html += "    <th>Sort</th>";
    html += "    <th>Custom Name</th>";
    html += "  </tr>";

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
      html += "    <td align='left'><input type='checkbox' "+(typeof(sort[i]) != "undefined" ? "checked='checked'" : "" )+" id='settings_bookmarks_list["+i+"]'><input type='checkbox' "+(typeof(sort_beta[i]) != "undefined" ? "checked='checked'" : "" )+" id='settings_bookmarks_list_beta["+i+"]'></td>";
      html += "    <td align='left'>";
      if(typeof(bookmarks[i]['custom']) != "undefined" && bookmarks[i]['custom'] == true){
        html += "<input class='gclh_form' type='text' id='settings_custom_bookmark["+cust+"]' value='"+bookmarks[i]['href']+"' size='15'> ";
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
      html += "    <td align='left'><select class='gclh_form' id='bookmarks_sort["+i+"]'>"+options+"</select></td>";
      html += "    <td align='left'><input class='gclh_form' id='bookmarks_name["+i+"]' type='text' size='15' value='"+(typeof(GM_getValue("settings_bookmarks_title["+i+"]")) != "undefined" ? GM_getValue("settings_bookmarks_title["+i+"]") : "")+"'></td>"; 
      html += "  </tr>";
    }
    html += "</table>";
    html += "</div>";
    html += "<br>";
    html += "";
    html += "<br>";
    html += "<input class='gclh_form' type='button' value='save' id='btn_save'> <input class='gclh_form' type='button' value='close' id='btn_close'> <div width='400px' align='right' class='gclh_small' style='float: right;'>GC little helper by <a href='http://www.amshove.net/' target='_blank'>Torsten Amshove</a></div>";
    html += "</div>";
//    html += "</div>";
    div.innerHTML = html;

//    document.getElementsByTagName('body')[0].innerHTML += html;
    document.getElementsByTagName('body')[0].appendChild(css);
    document.getElementsByTagName('body')[0].appendChild(div);

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

    // Give the buttons an function
    document.getElementById('btn_close').addEventListener("click", btnClose, false);
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
    GM_setValue("settings_submit_log_button",document.getElementById('settings_submit_log_button').checked);
    GM_setValue("settings_log_inline",document.getElementById('settings_log_inline').checked);
    GM_setValue("settings_log_inline_tb",document.getElementById('settings_log_inline_tb').checked);
    GM_setValue("settings_bookmarks_show",document.getElementById('settings_bookmarks_show').checked);
    GM_setValue("settings_bookmarks_on_top",document.getElementById('settings_bookmarks_on_top').checked);
    GM_setValue("settings_bookmarks_search",document.getElementById('settings_bookmarks_search').checked);
    GM_setValue("settings_bookmarks_search_default",document.getElementById('settings_bookmarks_search_default').value);
    GM_setValue("settings_redirect_to_map",document.getElementById('settings_redirect_to_map').checked);
    GM_setValue("settings_hide_feedback",document.getElementById('settings_hide_feedback').checked);
    GM_setValue("settings_hide_disclaimer",document.getElementById('settings_hide_disclaimer').checked);
    GM_setValue("settings_hide_cache_notes",document.getElementById('settings_hide_cache_notes').checked);
    GM_setValue("settings_hide_empty_cache_notes",document.getElementById('settings_hide_empty_cache_notes').checked);
    GM_setValue("settings_show_all_logs",document.getElementById('settings_show_all_logs').checked);
    GM_setValue("settings_show_all_logs_count",document.getElementById('settings_show_all_logs_count').value);
    GM_setValue("settings_decrypt_hint",document.getElementById('settings_decrypt_hint').checked);
    GM_setValue("settings_show_bbcode",document.getElementById('settings_show_bbcode').checked);
    GM_setValue("settings_show_mail",document.getElementById('settings_show_mail').checked);
    GM_setValue("settings_show_google_maps",document.getElementById('settings_show_google_maps').checked);
    GM_setValue("settings_show_log_it",document.getElementById('settings_show_log_it').checked);
    GM_setValue("settings_dynamic_map",document.getElementById('settings_dynamic_map').checked);
    GM_setValue("settings_show_homezone",document.getElementById('settings_show_homezone').checked);
    GM_setValue("settings_old_map",document.getElementById('settings_old_map').checked);
    GM_setValue("settings_homezone_radius",document.getElementById('settings_homezone_radius').value);
    GM_setValue("map_width",document.getElementById('map_width').value);
    GM_setValue("settings_new_width",document.getElementById('settings_new_width').value);
    GM_setValue("settings_default_logtype",document.getElementById('settings_default_logtype').value);
    GM_setValue("settings_default_tb_logtype",document.getElementById('settings_default_tb_logtype').value);
    GM_setValue("settings_mail_signature",document.getElementById('settings_mail_signature').value.replace(/‌/g,"")); // Fix: Entfernt das Steuerzeichen
    GM_setValue("settings_log_signature",document.getElementById('settings_log_signature').value.replace(/‌/g,""));
    GM_setValue("settings_tb_signature",document.getElementById('settings_tb_signature').value.replace(/‌/g,""));
    GM_setValue("remove_navi_play",document.getElementById('remove_navi_play').checked);
    GM_setValue("remove_navi_profile",document.getElementById('remove_navi_profile').checked);
    GM_setValue("remove_navi_join",document.getElementById('remove_navi_join').checked);
    GM_setValue("remove_navi_community",document.getElementById('remove_navi_community').checked);
    GM_setValue("remove_navi_videos",document.getElementById('remove_navi_videos').checked);
    GM_setValue("remove_navi_resources",document.getElementById('remove_navi_resources').checked);
    GM_setValue("remove_navi_shop",document.getElementById('remove_navi_shop').checked);
    GM_setValue("settings_bookmarks_top_menu",document.getElementById('settings_bookmarks_top_menu').checked);

    var checkboxes = new Array('settings_hide_advert_link', 'settings_hide_line_breaks', 'settings_hide_spoilerwarning', 'settings_hide_hint');
    for (var i = 0; i < checkboxes.length; i++) {
      GM_setValue(checkboxes[i],document.getElementById(checkboxes[i]).checked);
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

    // Create the confusing settings_bookmarks_list Array :)
    var queue = new Array();
    var tmp = new Array();
    for(var i=0; i<bookmarks.length; i++){
      if(document.getElementById('settings_bookmarks_list['+i+']')){ // Avoid errors
        if(document.getElementById('settings_bookmarks_list['+i+']').checked){ // If this Bookmark should be used, go and look at the sort-order
          if(document.getElementById('bookmarks_sort['+i+']')){ // Avoid errors
            if(typeof(tmp[document.getElementById('bookmarks_sort['+i+']').value]) == "undefined"){ // If sort-order not used by now, use it
              tmp[document.getElementById('bookmarks_sort['+i+']').value] = i;
            }else{
              queue.push(i);
              for(var x=0; x<bookmarks.length; x++){ // Find the next free sort-order
                if(typeof(tmp[x]) == "undefined"){
                  tmp[x] = i;
                  break;
                }
              }
            }
          }
        }
      }
      if(document.getElementById('bookmarks_name['+i+']') && document.getElementById('bookmarks_name['+i+']') != ""){ // Set custom name
        GM_setValue("settings_bookmarks_title["+i+"]",document.getElementById('bookmarks_name['+i+']').value);
      }
    }
    GM_setValue("settings_bookmarks_list",uneval(tmp));

    var queue = new Array();
    var tmp = new Array();
    for(var i=0; i<bookmarks.length; i++){
      if(document.getElementById('settings_bookmarks_list_beta['+i+']')){ // Avoid errors
        if(document.getElementById('settings_bookmarks_list_beta['+i+']').checked){ // If this Bookmark should be used, go and look at the sort-order
          if(document.getElementById('bookmarks_sort['+i+']')){ // Avoid errors
            if(typeof(tmp[document.getElementById('bookmarks_sort['+i+']').value]) == "undefined"){ // If sort-order not used by now, use it
              tmp[document.getElementById('bookmarks_sort['+i+']').value] = i;
            }else{
              queue.push(i);
              for(var x=0; x<bookmarks.length; x++){ // Find the next free sort-order
                if(typeof(tmp[x]) == "undefined"){
                  tmp[x] = i;
                  break;
                }
              }
            }
          }
        }
      }
      if(document.getElementById('bookmarks_name['+i+']') && document.getElementById('bookmarks_name['+i+']') != ""){ // Set custom name
        GM_setValue("settings_bookmarks_title["+i+"]",document.getElementById('bookmarks_name['+i+']').value);
      }
    }
    GM_setValue("settings_bookmarks_list_beta",uneval(tmp));
    
    // Save custom-Link URLs
    for(var i=0; i<anzCustom; i++){
      GM_setValue("settings_custom_bookmark["+i+"]",document.getElementById("settings_custom_bookmark["+i+"]").value);
      if(document.getElementById('settings_custom_bookmark_target['+i+']').checked) GM_setValue('settings_custom_bookmark_target['+i+']',"_blank");
      else GM_setValue('settings_custom_bookmark_target['+i+']',"");
    }

    document.location.reload(true);
  }
}
if(this.GM_registerMenuCommand && !document.location.href.match(/^http:\/\/www\.geocaching\.com\/map\/beta/)) GM_registerMenuCommand("little helper config", gclh_showConfig); // Hide on Beta-Map
if((document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/[#a-zA-Z-_]*$/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/default\.aspx/)) && document.getElementById('ctl00_ContentBody_WidgetMiniProfile1_logOutLink')){
  var lnk = " | <a href='#' id='gclh_config_lnk'>GClh Config</a>";
  document.getElementById('ctl00_ContentBody_WidgetMiniProfile1_logOutLink').parentNode.innerHTML += lnk;
  document.getElementById('gclh_config_lnk').addEventListener("click", gclh_showConfig, false);
}

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

        if(version[1] == scriptName && version[2] != scriptVersion){
          var text = "Version "+version[2]+" of "+scriptName+" greasemonkey script is available.\n"+
                  "You are currently using version "+scriptVersion+".\n\n"+
                  "Click OK for upgrade.\n";
          if(changelog) text += "\n\nChangelog:\n"+changelog[1];
          if(window.confirm(text)) GM_openInTab(url);
        }
      }
    });
    GM_setValue('update_last_check', time.toString());
  }
}

checkVersion();
} // Google Maps site

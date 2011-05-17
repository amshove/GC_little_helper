// ==UserScript==
// @name           GC little helper
// @namespace      http://www.amshove.net
// @include        http://www.geocaching.com/*
// @description    Some little things to make life easy (on www.geocaching.com).
// ==/UserScript==
//
// Author:         Torsten Amshove <torsten@amshove.net>
// Version:        1.1             - 02.07.2010
// Changelog:      1.1             - Konfigurations-Menue hinzugefuegt
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
//bookmarks[18]['href'] = "/find/default.aspx";
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
bookmarks[22]['target'] = "_blank";

bookmarks[23] = new Object();
bookmarks[23]['href'] = "http://blog.geocaching.com/";
bookmarks[23]['title'] = "Blog";
bookmarks[23]['target'] = "_blank";

bookmarks[24] = new Object();
bookmarks[24]['href'] = "http://feedback.geocaching.com/geocaching";
bookmarks[24]['title'] = "Feedback";
bookmarks[24]['target'] = "_blank";

bookmarks[25] = new Object();
bookmarks[25]['href'] = "http://www.geoclub.de/";
bookmarks[25]['title'] = "Geoclub";
bookmarks[25]['target'] = "_blank";

////////////////////////////////////////////////////////////////////////////

// Set defaults
var scriptName = "gc_little_helper";
var scriptVersion = "1.1";

var bookmarks_def = new Array(16,18,13,14,17,12);

GM_registerMenuCommand("Configuration", showConfig);
  
// Settings: Submit Log on F2
settings_submit_log_button = GM_getValue("settings_submit_log_button",true);
// Settings: Show Bookmarks
settings_bookmarks_show = GM_getValue("settings_bookmarks_show",true);
// Settings: Bookmarks on Top
settings_bookmarks_on_top = GM_getValue("settings_bookmarks_on_top",true);
// Settings: Redirect to Map
settings_redirect_to_map = GM_getValue("settings_redirect_to_map",true);
// Settings: Hide Facebook Button
settings_hide_facebook = GM_getValue("settings_hide_facebook",true);
// Settings: Hide Feedback Button
settings_hide_feedback = GM_getValue("settings_hide_feedback",false);
// Settings: Show all Logs
settings_show_all_logs = GM_getValue("settings_show_all_logs",false);
// Settings: default Log Type
settings_default_logtype = GM_getValue("settings_default_logtype","-1");
// Settings: Bookmarklist
settings_bookmarks_list = eval(GM_getValue("settings_bookmarks_list",uneval(bookmarks_def)));

////////////////////////////////////////////////////////////////////////////

// F2 zum Log abschicken
if(settings_submit_log_button && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|ID|PLogGuid)\=/)){
  function keydown(e){
    if(e.keyCode == 113){
      document.getElementById("ctl00_ContentBody_LogBookPanel1_LogButton").click();
    }
  }

  window.addEventListener('keydown', keydown, true);
}

// Bookmark-Liste im Profil
if(settings_bookmarks_show && document.location.href.match(/^http:\/\/www\.geocaching\.com\/my\/$/)){
  var side = document.getElementById("ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel");

  var header = document.createElement("h3");
  header.setAttribute("class","WidgetHeader");
  header.appendChild(document.createTextNode(" Bookmarks"));

  var div = document.createElement("div");
  div.setAttribute("class","WidgetBody ProfileWidget");

  var ul = document.createElement("ul");

  for(var i=0; i < settings_bookmarks_list.length; i++){
    var x = settings_bookmarks_list[i];
    if(typeof(x) == "undefined") continue;
    var a = document.createElement("a");

    for(attr in bookmarks[x]){
      a.setAttribute(attr,bookmarks[x][attr]);
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
if(settings_bookmarks_on_top){
  var head = document.getElementById("hd");
  var p = document.createElement("p");
  p.setAttribute("class","HalfRight");
  p.setAttribute("style","width: 100%; text-align: right; font-size: 85%; color: #CDD8E8;");

  var first = true;
  for(var i=0; i < settings_bookmarks_list.length; i++){
    var x = settings_bookmarks_list[i];
    if(typeof(x) == "undefined") continue;
    var a = document.createElement("a");

    for(attr in bookmarks[x]){
      a.setAttribute(attr,bookmarks[x][attr]);
    }

    if(!first) p.appendChild(document.createTextNode(" | "));
    first = false;

    a.appendChild(document.createTextNode(bookmarks[x]['title']));

    p.appendChild(a);
  }
  head.appendChild(p);
}

// Redirect to Map
if(settings_redirect_to_map && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)){
  var latlng = document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?lat=([0-9.]*)\&lng\=([0-9.]*)/);

  document.location.href = "http://www.geocaching.com/map/default.aspx?lat="+latlng[1]+"&lng="+latlng[2];
}

// Hide Facebook-Button
if(settings_hide_facebook && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?(guid|wp)\=[a-zA-Z0-9-]*/)){
  var iframes = document.getElementsByTagName('iframe');
  for(var i=0; i<iframes.length; i++){
    if(iframes[i].src.match(/^http:\/\/www\.facebook\.com/)){
      iframes[i].parentNode.removeChild(iframes[i]);
      break;
    }
  }
}

// Hide Feedback-Button
if(settings_hide_feedback){
  var button = document.getElementById('fdbk_tab');
  if(button){
    button.parentNode.removeChild(button);
  }
}

// Show all Logs
if(settings_show_all_logs && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?(guid|wp)\=[a-zA-Z0-9-]*$/)){
  document.location.href = document.location.href+"&log=y";
}

if(settings_default_logtype != "-1" && document.location.href.match(/^http:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|ID)\=/)){
  var select = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
  var childs = select.childNodes;
  
  for(var i=0; i<childs.length; i++){
    if(childs[i].value == settings_default_logtype){
      childs[i].setAttribute("selected","selected");
    }
  }
}

////////////////////////////////////////////////////////////////////////////

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
    // Overlay erstellen
    html += "<div id='findplayer_overlay' style='background-color:#DDDDDD; width:350px; height:60px; left:35%; outline: 2px solid black; overflow:auto; padding:10px; position:fixed; top:9%; z-index:101;' align='center'>";
    html += "<h3 style='margin:5px;'>Find Player</h3>";
    html += "<form action=\"/find/default.aspx\" method=\"post\" name=\"aspnetForm\">";
    html += "<input type='hidden' name='__VIEWSTATE' value=''>";
    html += "<input id='findplayer_field' class=\"Text\" type=\"text\" maxlength=\"100\" name=\"ctl00$ContentBody$FindUserPanel1$txtUsername\"/>";
    html += "<input class=\"Button\" type=\"submit\" value=\"Go\" name=\"ctl00$ContentBody$FindUserPanel1$GetUsers\"/><input id='btn_close' type='button' value='close'>";
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

// Configuration Menu
function showConfig(){
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
  
  if(document.getElementById('settings_overlay') && document.getElementById('settings_overlay').style.display == "none"){
    // If menu already created, just show it
    document.getElementById('settings_overlay').style.display = "";
  }else{
    var html = "";
    // Overlay erstellen
    html += "<div id='settings_overlay' style='background-color:#DDDDDD; width:350px; height:80%; left:35%; outline: 2px solid black; overflow:auto; padding:10px; position:fixed; top:7.5%; z-index:101;' align='center'>";
    // Inhalt
    html += "<h3 style='margin:5px;'>GC little helper</h3>";
    html += "<br>";
    html += "<table>";
    html += "  <tr>";
    html += "    <td align='left' colspan='3'><b>Options:</b></td>";
    html += "  </tr>";
    html += "  <tr>";
    html += "    <td align='left'><input type='checkbox' "+(settings_submit_log_button ? "checked='checked'" : "" )+" id='settings_submit_log_button'></td>";
    html += "    <td align='left' colspan='2'>Submit Log-Text on F2</td>";
    html += "  </tr>";
    html += "  <tr>";
    html += "    <td align='left'><input type='checkbox' "+(settings_bookmarks_show ? "checked='checked'" : "" )+" id='settings_bookmarks_show'></td>";
    html += "    <td align='left' colspan='2'>Show Bookmark-List in profile</td>";
    html += "  </tr>";
    html += "  <tr>";
    html += "    <td align='left'><input type='checkbox' "+(settings_bookmarks_on_top ? "checked='checked'" : "" )+" id='settings_bookmarks_on_top'></td>";
    html += "    <td align='left' colspan='2'>Show Bookmark-List on top</td>";
    html += "  </tr>";
    html += "  <tr>";
    html += "    <td align='left'><input type='checkbox' "+(settings_redirect_to_map ? "checked='checked'" : "" )+" id='settings_redirect_to_map'></td>";
    html += "    <td align='left' colspan='2'>Redirect from Cache-list to map</td>";
    html += "  </tr>";
    html += "  <tr>";
    html += "    <td align='left'><input type='checkbox' "+(settings_hide_facebook ? "checked='checked'" : "" )+" id='settings_hide_facebook'></td>";
    html += "    <td align='left' colspan='2'>Hide Facebook-Button</td>";
    html += "  </tr>";
    html += "  <tr>";
    html += "    <td align='left'><input type='checkbox' "+(settings_hide_feedback ? "checked='checked'" : "" )+" id='settings_hide_feedback'></td>";
    html += "    <td align='left' colspan='2'>Hide Feedback-Button</td>";
    html += "  </tr>";
    html += "  <tr>";
    html += "    <td align='left'><input type='checkbox' "+(settings_show_all_logs ? "checked='checked'" : "" )+" id='settings_show_all_logs'></td>";
    html += "    <td align='left' colspan='2'>Show all logs of a cache</td>";
    html += "  </tr>"
    html += "  <tr>";
    html += "    <td align='left' colspan='3'><select id='settings_default_logtype'>";
    html += "<option value=\"-1\" "+(settings_default_logtype == "-1" ? "selected=\"selected\"" : "")+">- Select Type of Log -</option>";
    html += "<option value=\"2\" "+(settings_default_logtype == "2" ? "selected=\"selected\"" : "")+">Found it</option>";
    html += "<option value=\"3\" "+(settings_default_logtype == "3" ? "selected=\"selected\"" : "")+">Didn't find it</option>";
    html += "<option value=\"4\" "+(settings_default_logtype == "4" ? "selected=\"selected\"" : "")+">Write note</option>";
    html += "<option value=\"7\" "+(settings_default_logtype == "7" ? "selected=\"selected\"" : "")+">Needs Archived</option>";
    html += "<option value=\"45\" "+(settings_default_logtype == "45" ? "selected=\"selected\"" : "")+">Needs Maintenance</option>";
    html += "</select> Default Log Type</td>";
    html += "  </tr>";
    html += "  <tr>";
    html += "    <td align='left' colspan='3'>&nbsp;</td>";
    html += "  </tr>";
    html += "  <tr>";
    html += "    <td align='left' colspan='2'><b>Bookmarks:</b></td>";
    html += "    <td align='left'>sort</td>";
    html += "  </tr>";
    
    // Create reverse-Array
    var sort = new Array();
    for(var i=0; i<settings_bookmarks_list.length; i++){
      sort[settings_bookmarks_list[i]] = i;
    }
    
    // Create the Bookmark-Options
    for(var i=0; i<bookmarks.length; i++){
      var options = "";
      for(var x=0; x<bookmarks.length; x++){
        options += "<option value='"+x+"' "+(sort[i] == x ? "selected='selected'" : "" )+">"+x+"</option>";
      }
      
      html += "  <tr>";
      html += "    <td align='left'><input type='checkbox' "+(typeof(sort[i]) != "undefined" ? "checked='checked'" : "" )+" id='settings_bookmarks_list["+i+"]'></td>";
      html += "    <td align='left'><a ";
      for(attr in bookmarks[i]){
        html += attr+"='"+bookmarks[i][attr]+"' ";
      }
      html += ">"+bookmarks[i]['title']+"</a></td>";
      html += "    <td align='left'><select id='bookmarks_sort["+i+"]'>"+options+"</select></td>";
      html += "  </tr>";
    }
    
    html += "  <tr>";
    html += "    <td align='left' colspan='3'>&nbsp;</td>";
    html += "  </tr>";
    html += "  <tr>";
    html += "    <td align='center' colspan='3'><input id='btn_save' type='button' value='save'><input id='btn_close' type='button' value='close'></td>";
    html += "  </tr>";
    html += "</table>";
    html += "</div>";
    document.getElementsByTagName('body')[0].innerHTML += html;
    
    // Give the buttons an function
    document.getElementById('btn_close').addEventListener("click", btnClose, false);
    document.getElementById('btn_save').addEventListener("click", btnSave, false);
  }
  
  // Save Button
  function btnSave(){
    GM_setValue("settings_submit_log_button",document.getElementById('settings_submit_log_button').checked);
    GM_setValue("settings_bookmarks_show",document.getElementById('settings_bookmarks_show').checked);
    GM_setValue("settings_bookmarks_on_top",document.getElementById('settings_bookmarks_on_top').checked);
    GM_setValue("settings_redirect_to_map",document.getElementById('settings_redirect_to_map').checked);
    GM_setValue("settings_hide_facebook",document.getElementById('settings_hide_facebook').checked);
    GM_setValue("settings_hide_feedback",document.getElementById('settings_hide_feedback').checked);
    GM_setValue("settings_show_all_logs",document.getElementById('settings_show_all_logs').checked);
    GM_setValue("settings_default_logtype",document.getElementById('settings_default_logtype').value);
    
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
    }
    GM_setValue("settings_bookmarks_list",uneval(tmp));
    
    document.location.reload(true);
  }
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




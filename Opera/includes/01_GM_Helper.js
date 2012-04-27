// ==UserScript==
// @include        http://www.geocaching.com/*
// @include        http://maps.google.de/*
// @include        http://maps.google.com/*
// @include        http://www.google.de/maps*
// @include        http://www.google.com/maps*
// @include        https://maps.google.de/*
// @include        https://maps.google.com/*
// @include        https://www.google.de/maps*
// @include        https://www.google.com/maps*
// ==/UserScript==
 
//Helper script for greasemonkey-scripts with Opera extension
//Copyright (C) 2012  Skywalker90
 
 
var backgroundScript;
var date = new Date();
var callBack = new Array();
var ports = new Object();
var serviceIdMapping = new Object();
 
var unsafeWindow = window;
var DOMParser = window.DOMParser;
var XMLSerializer = window.XMLSerializer;
var navigator = window.navigator;
var XMLHttpRequest = window.XMLHttpRequest;
 
 
//GM_log
GM_log = opera.postError;
 
function GM_setValue(name, value) {
	widget.preferences.setItem(name,value);	
}
 
function GM_getValue(name, defaultValue) {
	var result = widget.preferences.getItem(name);
	return (result != "" && result != null && result != "undefined" && result != "null" )?(result==="true"?true:(result==="false"?false:result)):defaultValue;
}
 
function GM_deleteValue(name) {		
	try {		
		widget.preferences.removeItem(name);		
	}		
	catch (e) { }		
}
 
function GM_listValues() {		
	var keys = new Array();		
	for (i = 0; i < widget.preferences.length; i++) {		
		keys[i] = widget.preferences.key(i);		
	}		
	return keys;		
}
 
function GM_openInTab(url)
{
	postData(ports["openInTab"], serviceIdMapping["openInTab"], url);	
}
 
function GM_addStyle(style)
{
	var sheet = document.createElement('style');
	sheet.innerHTML = style;
	document.body.appendChild(sheet);
}
 
function getRandom(){
	return  date.getTime() * (1 + parseInt( Math.random() * 100));
}
 
function GM_xmlhttpRequest(details) {
	//Add an random id
	details["id"] = getRandom();
	
	//Save the callbacks if required
	if(details["onreadystatechange"] || details["onerror"] || details["onload"])
	{
		callBack[details["id"]] = {onreadystatechange: details["onreadystatechange"] , onerror: details["onerror"], onload: details["onload"]} ;
	}
	
	//Send request to background worker
	postData(ports["xmlhttpRequest"], serviceIdMapping["xmlhttpRequest"], details);	
}
 
function handleGMxmlhttpRequestStatusUpdate(event){
	if(event.data != "")	
	{
		//Got an result/status update
		
		//Are there callbacks?
		var myCallback = callBack[event.data.id];
		if (myCallback)
		{
			var resultData = event.data;			
			
			//Notify the onreadystatechange function, if there is any
			if (myCallback["onreadystatechange"]) {
			    myCallback["onreadystatechange"]({
				status: (resultData.readyState < 4 ? 0 : resultData.status),
				statusText: (resultData.readyState < 4 ? "" : resultData.statusText),
				responseHeaders: (resultData.readyState < 4 ? "" : resultData.getAllResponseHeaders),
				responseText: (resultData.readyState < 4 ? "" : resultData.responseText),				
				readyState: resultData.readyState
			    });
			}
 
			//Request finished
			if (resultData.readyState == 4) {
			    if (resultData.status < 200 || resultData.status >= 300) {
				//An error occured
				//Notify the onerror function, if there is any
				if (myCallback["onerror"]) {
				    myCallback["onerror"]({
					status: (resultData.status),
					statusText: (resultData.statusText),
					responseHeaders: (resultData.getAllResponseHeaders),
					responseText: (resultData.responseText),					
					//API Reference says unsed, but set it
					readyState: resultData.readyState
				    });
				}
			    }
			    else {
				//Everything is ok
				//Notify the onload function, if there is any
				if (myCallback["onload"]) {
				    myCallback["onload"]({
					status: (resultData.status),
					statusText: (resultData.statusText),
					responseHeaders: (resultData.getAllResponseHeaders),
					responseText: (resultData.responseText),					
					//API Reference says unsed, but set it to 4
					readyState: resultData.readyState,
					//Hope this works
					finalUrl: resultData.finalUrl
				    });				   
				}
			    }
			}
		}
 	}
}

function postData(port, id, data){
	var container = {};
	container.id=id;
	container.data=data;
	port.postMessage(JSON.stringify(container));	
}

function init(){	
	opera.extension.onmessage = function(event){		
		if(event.data == "GM_Helper_Background" && !backgroundScript){
			backgroundScript = event.source;
			
			serviceIdMapping["xmlhttpRequest"] = getRandom();
			backgroundScript.postMessage({service: "xmlhttpRequest",
											id: serviceIdMapping["xmlhttpRequest"]});
											
			serviceIdMapping["openInTab"] = getRandom();
			backgroundScript.postMessage({service: "openInTab",
											id: serviceIdMapping["openInTab"]});
		}
		else if(event.data == serviceIdMapping["xmlhttpRequest"]){
			ports["xmlhttpRequest"] = event.ports[0];
			event.ports[0].onmessage = handleGMxmlhttpRequestStatusUpdate;
		}
		else if(event.data == serviceIdMapping["openInTab"]){
			ports["openInTab"] = event.ports[0];
		}			
	};
	
}

init();
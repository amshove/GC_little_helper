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

var ports = new Object();
 
window.addEventListener("load", setupConnection, false);

function setupConnection()
{	
	opera.extension.onconnect = function(event) {			
		event.source.postMessage("GM_Helper_Background");	
	};
 
	opera.extension.onmessage = function(event){
		var id = event.data.id;		
		var service = event.data.service;
		
		if(service == "xmlhttpRequest"){
			var channel =  new MessageChannel();		
			ports[id] = channel.port1;
			
			event.source.postMessage(id, [channel.port2]);	
			
			channel.port1.onmessage = function(event){	
				var unpackedData = JSON.parse(event.data);
				var callbackId = unpackedData.id;		
				var reqData = unpackedData.data;			
				xmlhttpRequestBackground(reqData, ports[callbackId]);
			}
		}
		else if(service == "openInTab"){
			var channel =  new MessageChannel();		
			ports[id]=channel.port1;
			
			event.source.postMessage(id, [channel.port2]);	
			
			channel.port1.onmessage = function(event){
				var unpackedData = JSON.parse(event.data);
				if(typeof unpackedData.data == "string" && unpackedData.indexOf("javascript:") == -1){
					openInTabBackground(event.data.data);
				}
			}
		}
	}	
}

	
function xmlhttpRequestBackground(details, answerPort) {		
	var httpReq = new window.XMLHttpRequest();
	httpReq.onreadystatechange = function() { 	
	var resultData = {
		"status": (httpReq.readyState < 4 ? "" : httpReq.status),
		"statusText":  (httpReq.readyState < 4 ? "" : httpReq.statusText),
		"responseHeaders": (httpReq.readyState < 4 ? "" : httpReq.getAllResponseHeaders()),
		"responseText": (httpReq.readyState < 4 ? "" : httpReq.responseText),
		"readyState": (httpReq.readyState),
		//Hope this works
		//"finalUrl": (httpReq.readyState < 4 ? "" : httpReq.responseXML.documentURI),
		"id": details.id
	};

	sendUpdate(resultData, answerPort);	
};

    //open
    httpReq.open(details.method, details.url);

    //headers
    if (details.headers) {
        for (var header in details.headers) {
            httpReq.setRequestHeader(header, details.headers[header]);
        }
    }

    //send
    httpReq.send(typeof details.data == 'undefined' ? null : details.data);    
}

function openInTabBackground(url)
{
	opera.extension.tabs.create({"url":url,"focused":true});
}

function sendUpdate(data, port)
{	
	port.postMessage(data); 	
}

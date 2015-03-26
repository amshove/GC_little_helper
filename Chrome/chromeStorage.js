var storage = null;
var isLocalMode = false;
var promise = new Promise(function(resolve, reject) {
	chrome.storage.local.get("GclhStorageMethode", function(e){
		if(typeof(e["GclhStorageMethode"]) !== "undefined" && e["GclhStorageMethode"] === "local"){
			storage = chrome.storage.local;
			isLocalMode = true;
		}
		else{
			storage = chrome.storage.sync;
		}
		
		if(storage !== null){
			resolve();
		}
	});		
});

var changeStorageMode = function(targetMode, data, response){	
	var oldMode;
	
	if(targetMode === "sync"){
		storage = chrome.storage.sync;
		oldMode = chrome.storage.local;
		isLocalMode = false;
	}
	else{
		storage = chrome.storage.local;
		oldMode = chrome.storage.sync;
		isLocalMode = true;
	}
	
	if(targetMode !== "sync"){
		targetMode = "local";
	}
	
	chrome.storage.local.set({GclhStorageMethode: targetMode}, function(){
		oldMode.get(null , function(oldData){
			storage.set(oldData, function(){
				handleWrite(data, response);
			});	
		});
	});	
};


var handleWrite = function(data, sendResponse){
	storage.get(null, function(oldData){
		var changedData = {};
		var count = 0;
		for(key in data){
			if(oldData[key] !== data[key]){
				changedData[key] = data[key];
				count++;
			}
		}
		if(count > 0){
			storage.set(changedData, function(e){			
				if (!isLocalMode 
					&& typeof(chrome.runtime.lastError) !== "undefined"
					&& typeof(chrome.runtime.lastError.message) !== "undefined"
					&& ((chrome.runtime.lastError.message.indexOf('MAX_WRITE' ) !== -1)
						|| (chrome.runtime.lastError.message.indexOf('QUOTA_BYTES' ) !== -1))){
					
					changeStorageMode("local", changedData, sendResponse);						
				}
				else{
					sendResponse(e);
				}
			});					
		}
		else{
			sendResponse(null);
		}
	});
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	
		if(typeof(request["getGclhConfig"]) !== "undefined"){
			promise.then(function(){
				storage.get(null , sendResponse);
			});				
		}		
		else if(typeof(request["setGclhConfig"]) !== "undefined"){
			promise.then(function(){
				handleWrite(request["setGclhConfig"], sendResponse);
			});
		}
		else{
			return false;
		}
	
	return true;	
});
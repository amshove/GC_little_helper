chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(typeof(request["getGclhConfig"]) !== "undefined"){
		chrome.storage.sync.get("GclhConfig", sendResponse);
		return true;
	}
	
    if(typeof(request["setGclhConfig"]) !== "undefined"){
		var data = {};
		data["GclhConfig"] = request["setGclhConfig"];
		chrome.storage.sync.set(data, sendResponse);
		return true;
	}
	
	return false;
  });
// Taewook, Ryan, Zhenhui
// Date: November 7, 2023

console.log("background.js is running...");

// if Slack tab is refreshed
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
	// if the refresh is "complete" and the tab is active
	if (changeInfo.status == 'complete' && tab.active) {
		// print the tab status -- it should print "complete"
		console.log(changeInfo.status);
		
		let msg = {
			txt: "hello"
		};
		
		setTimeout(function(){
			console.log("wait for a second...");
			chrome.tabs.sendMessage(tab.id, msg);
		}, 3000);
	};
});


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){

		const return_val = [];

		if(request.type == 'info'){
			console.log(request.value);

			strategy = ["Self-disclosure"];
			guide = ["It is more recommended you to type it by yourself!!!"];

			var flex_url = "http://bfd6-34-91-161-142.ngrok.io/classify?sentence=";
			var url = flex_url + request.value;
			console.log(url);

			fetch(url, {  
				mode: 'cors',
				method: 'GET',
				headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"}
			})
			.then(function (response) {
				response.json().then(function(strategy){
					console.log(strategy);
					sendResponse({"strategy": strategy});
				});
			})
			.catch(function (error) {
				console.log('Request failed', error);
			});

			return true;
		};
});
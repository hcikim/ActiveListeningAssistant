// Taewook, Ryan, Zhenhui
// Date: November 7, 2023

function buildingframe() {
	
	let element = document.getElementsByClassName("agent-content");

	while (element[0]){
		element[0].parentNode.removeChild(element[0]);
	};

	var a = document.createElement("DIV");
	
	a.setAttribute("id", "agent-block");
	a.setAttribute("class", "agent-content");
	a.setAttribute("style", "margin-left:5px; margin-right:5px; border: 2px solid Lavender; border-radius: 15px; padding: 8px; cursor: none;");
	
	content = ["Active listening is ongoing"];
	a.innerHTML = '<i>' + content[0] + '</i>';

	var select = document.querySelector("div.c-texty_buttons");
	select.appendChild(a);

};

function read_input() {

	// get input section html, then assign id #input
	let input = document.querySelector("div.ql-editor");
	input.setAttribute("id", "input");

	let input_line = document.querySelector("#input > p");
	let block = document.querySelector("#agent-block");
	let key = [];
	
	input.onkeyup = function(entry){

		// if users type "return" -- keycode #13 means "return"
		if(entry.keyCode == 13){
			key = [];

			buildingframe();

		} // if users type "space" -- keycode #32 means "&nbsp"
		else if(entry.keyCode == 32){
		
			key.push(entry.keyCode);

			if(key.length == 2){
				// console.log(key);
				console.log(input_line);
				sendrecvData(block);

			} else if(key.length == 3){
				// console.log(key);
				console.log(input_line);
				sendrecvData(block);

			} else if(key.length == 4){
				// console.log(key);
				console.log(input_line);
				sendrecvData(block);

			} else if(key.length == 5){
				// console.log(key);
				console.log(input_line);
				sendrecvData(block);

			} else if(key.length == 6){
				// console.log(key);
				console.log(input_line);
				sendrecvData(block);

			} else if(key.length == 7){
				// console.log(key);
				console.log(input_line);
				sendrecvData(block);

			} else if(key.length == 8){
				// console.log(key);
				console.log(input_line);
				sendrecvData(block);

			} else if(key.length == 9){
				// console.log(key);
				console.log(input_line);
				sendrecvData(block);

			};
		};
	};
};


function updatecontent(box, strategy, guide) {

	// strategy = ["Self-disclosure"]
	// guide = ["It is more recommended you to type it by yourself!!!"]

	box.removeAttribute('style');
	box.setAttribute("style", "margin-left:5px; margin-right:5px; border: 2px solid #503570; border-radius: 15px; padding: 8px; cursor: help;");
	box.setAttribute("title", guide);
	box.innerHTML = '<i><b>' + strategy + '</b></i>';

};

function gotMessage(message) {

	// if tab is "active" and "complete"
	if (message.txt === "hello") {
		
		// build recommendation box
		buildingframe();

		// read input box
		read_input();
	};
};

chrome.runtime.onMessage.addListener(gotMessage);

function sendrecvData(box){
	let text = document.querySelector("#input > p").innerText;
	chrome.runtime.sendMessage({type: 'info', value: text}, function(response){

		var return_val = response.strategy;

		console.log(return_val);
		strategy = return_val;
		guide = "You should focus on her!! Not you!!";
		
		updatecontent(box, strategy, guide);
		
		console.log("Updatecontent works!!!!");
		
		text = "";
		return_val = [];
	});
};
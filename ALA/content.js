// Taewook, Ryan, Zhenhui

async function buildingframe() {

	let element = document.getElementsByClassName("agent-content");

	while (element[0]){
		element[0].parentNode.removeChild(element[0]);
	};

	var agentBlock = document.createElement("DIV");
	agentBlock.setAttribute('id', 'agent-block')
	agentBlock.setAttribute('class', 'agent-content purple-border')

	// Can append (1) within the Slack message area or (2) below message area
	// var select = document.querySelector("div.c-texty_buttons");
	var select = document.querySelector("div.p-message_pane_input_inner_main");
	select.appendChild(agentBlock);

	contentURL = chrome.runtime.getURL("agent_content.html");
	document.getElementById('agent-block').innerHTML = await (await fetch(contentURL)).text()

};

function read_input() {

	// get input section html, then assign id #input
	let input = document.querySelector("div.ql-editor");
	input.setAttribute("id", "input");

	let input_line = document.querySelector("#input > p");
	// let block = document.querySelector("#agent-block");
	let key = [];

	input.onkeyup = function(entry){

		// if users type "return" -- keycode #13 means "return"
		if(entry.keyCode == 13){
			key = [];

			buildingframe();

		} // if users type "space" -- keycode #32 means "&nbsp"
		else if(entry.keyCode == 32){

			key.push(entry.keyCode);

			if(key.length > 2){

				sendrecvData();

			};
		} // typing "F1 key" can be a backdoor shortcut to showing feature 1
		else if(entry.keyCode == 112) {
			strategy = "Self-disclosure"
			guide = fix_guide[strategy];
			updatecontent(strategy, guide);
		} // typing "F2 key" can be a backdoor shortcut to showing feature 1
		else if(entry.keyCode == 113) {
			strategy = "Providing Suggestions"
			guide = fix_guide[strategy];
			updatecontent(strategy, guide);
		}
	};
};


function updatecontent(strategy, guide) {

	// Annotate the strategy
	strategyAnnotation = document.getElementById("agent-prediction")
	strategyAnnotation.innerHTML = strategy;

	// Fill in fixed guides for each tip
	numSlides = document.getElementsByClassName('slides').tip_slides.childElementCount
	for (let index = 0; index < numSlides; index++) {
		slide = document.getElementById(`slide-${index+1}`) // not zero indexed
		if (index <= guide.length) {
			slide.innerHTML = guide[index];
		}
		else {
			slide.innerHTML = `Tip ${index+1}`
		}
	}

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

var fix_guide = {
	"Self-disclosure": [
		"Touch lightly upon your own experience to offer hope and encouragement.",
		"<i>I struggled with that and I got through it. I know you will, too. There is hope.<i>",
		"Sharing a small part of your own story can help the person to feel less embarrassed and alone.",
		"<i>Mary, I hear how painful that is through your words. I also know a bit about how that might feel because I too have been there.</i>",
		// "<div>Good: If someone is feeling hopeless, isolated, embarrassed, confused or stuck.</div><div>Bad: If you share an illness story not a wellness or recovery story, or you find yourself with feelings that you are trying to manage while you share.</div>",
		// "If sharing your story seems like it will diminish the member in any way. For example “you think you have it bad, my story is so much worse…” You are seeking to help, not hurt and you never want to “one up” someone.",
		// "If you share an illness story not a wellness or recovery story. The focus needs to be on offering hope to the person you are listening to, not drag anyone down.",
		// "If you find yourself with feelings that you are trying to manage while you share. This is a sign that you may be triggered by the person you are listening to and the focus is then off them and on you. If this is happening, you should exit the conversation and ask the member to find a new listener."
	],
	"Providing Suggestions": [
		"Show you trust in their ability to work this out.",
		"<i>You are the expert on your situation. I can’t give advice, but I can listen and help you figure out your path forward.</i>",
		"Help them to think about things from another point of view.",
		"<i>What would you say to a friend who was in your situation?</i>",
		// "<div>Dos: <ul><li>Show you trust in their ability to work this out, e.g. 'You are the expert on your situation. I can’t give advice, but I can listen and help you figure out your path forward.'</li><li>Help them to think about things from another point of view, e.g. 'What would you say to a friend who was in your situation?'</li><li>Guide them to look inside themselves for the answer, e.g. 'What do you feel like you should do?'</li></ul></div><div>Dont's: Don’t judge. Don’t push the person in any direction. Don’t give advice. Don’t give personal opinions.</div>",
		// "<div>Dos: If you want to give a suggestion, preface with a question to encourage them to reflect. <i>e.g., 'Have you thought about other ways you could handle this? One idea I had was...'<i></div><div>Dont's: Don’t judge. Don’t push the person in any direction. Don’t give advice. Don’t give personal opinions.</div>",
		// "<div>Good: Show you trust in their ability to work this out, e.g. <i>'You are the expert on your situation. I can’t give advice, but I can listen and help you figure out your path forward.'<i></div><div>Bad: ",
	]
}

function sendrecvData(){

	let text = document.querySelector("#input > p").innerText;
	console.log(text);

	chrome.runtime.sendMessage({type: 'info', value: text}, function(response){

		if (!response) {
			console.log("Empty response from background.js process")
			return
		}

		var return_val = response.strategy;

		console.log("strategy: " + return_val);
		strategy = return_val;

		if (fix_guide[strategy]){
			updatecontent(strategy, fix_guide[strategy]);
		};

		console.log("Updatecontent works!!!!");

		text = "";
		return_val = [];

	});
};
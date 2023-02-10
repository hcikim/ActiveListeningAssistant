// Taewook, Ryan, Zhenhui
// Date: November 10, 2023

function buildingframe() {

	let element = document.getElementsByClassName("agent-content");

	while (element[0]){
		element[0].parentNode.removeChild(element[0]);
	};

	var a = document.createElement("DIV");

	a.setAttribute("id", "agent-block");
	a.setAttribute("class", "agent-content");
	a.setAttribute("style", "margin-left:5px; margin-right:5px; border: 2px solid Lavender; border-radius: 15px; padding: 8px; cursor: none;");


	content = ["Rawal is active."];
	// content = ["ALIA is actively viewing what you type, so she can provide helpful tips."];
	a.innerHTML = '<i>' + content[0] + '</i>';

	// var select = document.querySelector("div.c-texty_buttons");
	var select = document.querySelector("div.p-message_pane_input_inner_main");
	select.appendChild(a);

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
			guide = fix_guide[strategy][0];
			updatecontent(strategy, guide);
		} // typing "F2 key" can be a backdoor shortcut to showing feature 1
		else if(entry.keyCode == 113) {
			strategy = "Providing Suggestions"
			guide = fix_guide[strategy][0];
			updatecontent(strategy, guide);
		}
	};
};


function updatecontent(strategy, guide) {

	let box = document.querySelector("#agent-block");

	box.removeAttribute('style');
	// Agent Purple Border Style
	box.setAttribute("style", "margin-left:5px; margin-right:5px; border: 2px solid #503570; border-radius: 15px; padding: 8px; cursor: help;");
	box.setAttribute("title", guide); // this is for the hover attribute

	strategyAnnotation = document.createElement("div")
	strategyAnnotation.innerHTML = "Active Listening Skill: <i>" + strategy + "</i> </div>";


	// Setting up the show and hide button
	var toggleButton = document.createElement("button");
	toggleButton.setAttribute("id", "toggleTip");
	toggleButton.setAttribute("class", "button-3") // green button
	toggleButton.innerHTML = "Toggle tips";
	toggleButton.onclick = function() {
		var x = document.getElementById("verboseTips");
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	};

	document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('toggleTip');
    // onClick's logic below:
    link.addEventListener('click', function() {
				var x = document.getElementById("verboseTips");
				if (x.style.display === "none") {
					x.style.display = "block";
				} else {
					x.style.display = "none";
				}
			});
	});
	// shortTip = "<div>ALIA has some tips on using this strategy. <b>*[hover for details]*</b></div>"
	// shortTip = "<div><span>Consider reviewing tips on good and bad ways to use this strategy</span>"+toggleButton+"</div>";
	shortTipContainer = document.createElement("div");
	shortTip = document.createElement("span")
	shortTip.innerHTML = "Consider reviewing tips on how to use this skill";
	shortTipContainer.appendChild(shortTip);
	shortTip.appendChild(toggleButton);

	guideDiv = document.createElement("div");
	guideDiv.setAttribute("id", "verboseTips")
	guideDiv.setAttribute("style", "display: none"); // start as hidden;
	guideDiv.innerHTML = guide;

	// guideDiv = "<div id='verboseTips'>" + guide + "</div>"

	box.appendChild(strategyAnnotation)
	box.appendChild(shortTip)
	box.appendChild(guideDiv)
	// box.innerHTML = strategyAnnotation + shortTip + guideDiv;


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
		"<div>Good: If someone is feeling hopeless, isolated, embarrassed, confused or stuck.</div><div>Bad: If you share an illness story not a wellness or recovery story, or you find yourself with feelings that you are trying to manage while you share.</div>",
		"If sharing your story seems like it will diminish the member in any way. For example “you think you have it bad, my story is so much worse…” You are seeking to help, not hurt and you never want to “one up” someone.",
		"If you share an illness story not a wellness or recovery story. The focus needs to be on offering hope to the person you are listening to, not drag anyone down.",
		"If you find yourself with feelings that you are trying to manage while you share. This is a sign that you may be triggered by the person you are listening to and the focus is then off them and on you. If this is happening, you should exit the conversation and ask the member to find a new listener."
	],
	"Providing Suggestions": [
		"<div>Dos: <ul><li>Show you trust in their ability to work this out, e.g. 'You are the expert on your situation. I can’t give advice, but I can listen and help you figure out your path forward.'</li><li>Help them to think about things from another point of view, e.g. 'What would you say to a friend who was in your situation?'</li><li>Guide them to look inside themselves for the answer, e.g. 'What do you feel like you should do?'</li></ul></div><div>Dont's: Don’t judge. Don’t push the person in any direction. Don’t give advice. Don’t give personal opinions.</div>",
		"<div>Dos: If you want to give a suggestion, preface with a question to encourage them to reflect. <i>e.g., 'Have you thought about other ways you could handle this? One idea I had was...'<i></div><div>Dont's: Don’t judge. Don’t push the person in any direction. Don’t give advice. Don’t give personal opinions.</div>",
		"<div>Good: Show you trust in their ability to work this out, e.g. <i>'You are the expert on your situation. I can’t give advice, but I can listen and help you figure out your path forward.'<i></div><div>Bad: ",
	]
}

function sendrecvData(){

	let text = document.querySelector("#input > p").innerText;
	console.log(text);

	chrome.runtime.sendMessage({type: 'info', value: text}, function(response){

		var return_val = response.strategy;

		console.log("strategy: " + return_val);
		strategy = return_val;

		if (fix_guide[strategy]){

			guide = fix_guide[strategy][0];
			// console.log(guide + " ----- ");
			// We are not assuming self-disclosure is bad... since it has some tips
			// note = strategy + " maybe not effective <b>*[hover for detail]*</b>";

			updatecontent(strategy, guide);
		};

		console.log("Updatecontent works!!!!");

		text = "";
		return_val = [];

	});
};
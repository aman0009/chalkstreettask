var create = document.getElementById("createBtn")
var output = document.getElementById("displayCard")
var input = document.getElementById("textArea")
var counter = 0
var deleteBtn = document.getElementById("deleteBtn")

create.addEventListener("click", cardMaker)

function cardMaker () {
	let makeCard = `<div class="newCard" id="${input.value}"> ${input.value} <a class="button recordButton" id="record">Record</a>
      <a class="button disabled one" id="pause">Pause</a>
      <a class="button disabled one" id="stop">Delete</a> <a class="button disabled one" id="play">Play</a> `
	let cardDiv = document.createElement("div");
	cardDiv.innerHTML = makeCard;
	output.appendChild(cardDiv);
	document.getElementById("deleteBtn").addEventListener("click", function () {
		console.log("working", document.getElementById("${input.value}"));
		document.getElementById("${input.value}").remove();
	});
};
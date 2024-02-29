document.getElementById("leftcontainer").innerHTML += Object.entries(x).map(([key, value]) => `<a href="#${key}">${key}</a>`).join('');

document.getElementById("centercontainer").innerHTML += Object.entries(x).map(([key, value]) =>
    `<section
        id="${key}"
        ><h2 id="categoryHeader">${key}</h2>${Object.entries(value).map(([subKey, subValue]) =>
        `<span my_name="${subKey}"><button
        class="promptButton"
        onclick="moveButton('${subKey}', 'container2',this)"
        oncontextmenu="rightMoveButton('container2', '${subKey}',this); return false;"
        onmouseover="selectSpanInDiv('output', '${subKey}', this)"
        prompt="${subValue}"
        >${subKey}</button></span>`).join('')}</section>`
).join('');

function moveButton(sourceId, destinationId, button) {
    var sourceDiv = document.querySelector('[my_name="' + sourceId + '"]'),
        destinationDiv = document.querySelector('[my_name="' + destinationId + '"]');
    if (button.parentNode.getAttribute('my_name') === destinationId) {
        moveButtonUp(button);
        return;
    }
    sourceDiv.removeChild(button);
    destinationDiv.appendChild(button);
    extractText('destination', 'output');
}

function rightMoveButton(sourceId, destinationId, button) {
    var sourceDiv = document.querySelector('[my_name="' + sourceId + '"]'),
        destinationDiv = document.querySelector('[my_name="' + destinationId + '"]');
    if (button.parentNode.getAttribute('my_name') === destinationId) {
        navigator.clipboard.writeText(button.getAttribute("prompt"));
        viewText("『" + button.getAttribute("prompt") + "』" + "コピーしました。");
        return;
    }
    sourceDiv.removeChild(button);
    destinationDiv.appendChild(button);
    extractText('destination', 'output');
}

function moveButtonUp(button) {
    var parent = button.parentNode;
    if (button.previousElementSibling) {
        parent.insertBefore(button, button.previousElementSibling);
    }
    extractText('destination', 'output');
}

function extractText(targetDivId, outputDivId) {
    var checkbox = document.getElementById("newline").checked;
    var texts = Array.from(document.getElementById(targetDivId).children)
        .map(span => `<span j_prompt=${span.textContent}>${span.getAttribute("prompt")}</span>`);
    document.getElementById(outputDivId).innerHTML = checkbox ? texts.join('<br>') : texts.join(', ');
}

function copyExtract() {
    var checkbox = document.getElementById("newline").checked;
    var targetDiv = document.getElementById('destination');
    var spans = targetDiv.children;
    var texts = [];
    for (var i = 0; i < spans.length; i++) {
        texts.push(spans[i].getAttribute("prompt"));
    }
    navigator.clipboard.writeText(checkbox ? texts.join("\n") : texts.join(", "));
    viewText("コピーしました。");
}

function viewText(value) {
    var displayArea = document.getElementById("display-area");
    displayArea.innerText = value;
}

function selectSpanInDiv(divId, spanId, button) {
    var divElement = document.getElementById(divId);
    var spanElement = divElement.querySelector('[j_prompt="' + spanId + '"]');
    if (divElement) {
        if (spanElement) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(spanElement);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    viewText(button.getAttribute("prompt"));
}
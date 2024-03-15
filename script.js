document.getElementById("leftcontainer").innerHTML += Object.entries(x).map(([key, value]) => `<a href="#${key}">${key}</a>`).join('');

document.getElementById("checkboxContainer").innerHTML += '<table>' + Object.entries(x).map(([key, value], hcount) =>
    (hcount % 5 === 0 ? '<tr>' : '') +
    `<td><label><input type="checkbox" id="c${++hcount}" name="${key}"><span>${key}</span></label></td>` +
    (hcount % 5 === 0 || hcount === Object.entries(x).length ? '</tr>' : '')
).join('') + '</table>';

let count = 0;
document.getElementById("centercontainer").innerHTML += Object.entries(x).map(([key, value]) => {
            return `<section id="${key}">
        <h2 id="categoryHeader">${key}</h2>
        ${Object.entries(value).map(([subKey, subValue]) =>
            `<span id="s${++count}">
                <button 
                class="promptButton"
                onclick="movebutton(this,'s${count}','destination')"
                oncontextmenu="rightMoveButton(this,'s${count}','destination'); return false;"
                onmouseover="selectSpanInDiv('output', '${subKey}', this)"
                prompt="${subValue}"
                >${subKey}</button>
            </span>`
        ).join('')}
    </section>`;
}).join('');

function animateButtonMovement(button, sourceDiv, destinationDiv, deltaX, deltaY, duration) {
    var buttonClone = button.cloneNode(true);
    buttonClone.style.position = 'absolute';
    buttonClone.style.left = button.getBoundingClientRect().left + 'px';
    buttonClone.style.top = button.getBoundingClientRect().top + 'px';
    document.body.appendChild(buttonClone);

    var startTime = null;
    function moveButtonAnimation(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        var percent = Math.min(progress / duration, 1);
        buttonClone.style.left = (button.getBoundingClientRect().left + deltaX * percent) + 'px';
        buttonClone.style.top = (button.getBoundingClientRect().top + deltaY * percent) + 'px';
        if (percent < 1) {
            requestAnimationFrame(moveButtonAnimation);
        } else {
            document.body.removeChild(buttonClone);
            sourceDiv.removeChild(button);
            destinationDiv.appendChild(button);
            extractText('destination', 'output');
        }
    }

    requestAnimationFrame(moveButtonAnimation);
}

function movebutton(element, parentID, sendID) {
    if (element.parentNode.id === parentID) {
        var deltaX = document.getElementById(sendID).getBoundingClientRect().left - element.getBoundingClientRect().left;
        var deltaY = document.getElementById(sendID).getBoundingClientRect().top - element.getBoundingClientRect().top;
        var duration = 100;
        animateButtonMovement(element, document.getElementById(parentID), document.getElementById(sendID), deltaX, deltaY, duration);
    }
    else{
        moveUp(element);
    }
    extractText('destination', 'output');
}

function rightMoveButton(element, parentID, sendID){
    if(element.parentNode.id === parentID){
        navigator.clipboard.writeText(element.getAttribute("prompt"));
        viewText("『" + element.getAttribute("prompt") + "』" + "コピーしました。");
    }
    else{
        var deltaX = document.getElementById(parentID).getBoundingClientRect().left - element.getBoundingClientRect().left;
        var deltaY = document.getElementById(parentID).getBoundingClientRect().top - element.getBoundingClientRect().top;
        var duration = 100;
        animateButtonMovement(element, document.getElementById(sendID), document.getElementById(parentID), deltaX, deltaY, duration);
    }
    
}

function moveUp(button) {
    var parent = button.parentNode;

    var buttonClone = button.cloneNode(true);
    buttonClone.style.position = 'absolute';
    buttonClone.style.left = button.getBoundingClientRect().left + 'px';
    buttonClone.style.top = button.getBoundingClientRect().top + 'px';
    document.body.appendChild(buttonClone);

    var deltaX = -50;
    var duration = 100;

    var startTime = null;
    function moveButtonAnimation(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        var percent = Math.min(progress / duration, 1);
        buttonClone.style.left = (button.getBoundingClientRect().left + deltaX * percent) + 'px';
        if (percent < 1) {
            requestAnimationFrame(moveButtonAnimation);
        } else {
            document.body.removeChild(buttonClone);
            if (button.previousElementSibling) {
                parent.insertBefore(button, button.previousElementSibling);
            }
            extractText('destination', 'output');
        }
    }

    requestAnimationFrame(moveButtonAnimation);
}

function clickAllButtons() {
    var buttons = document.getElementById('destination').getElementsByTagName('button');
    var event = new MouseEvent('contextmenu');
    for (var i = buttons.length - 1; i >= 0; i--) {
        buttons[i].dispatchEvent(event);
    }
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

function clickRandomButton(buttonsId) {
    var buttons = document.getElementById(buttonsId).getElementsByTagName('button');
    var randomIndex = Math.floor(Math.random() * buttons.length);
    if(document.getElementById("randomCheckbox").checked){
        buttons[randomIndex].click();
    }
}

function showButton(){
    var guiContainer = document.getElementById("guiContainer");
    if (guiContainer.style.display === "none") {
        guiContainer.style.display = "block";
    } else {
        guiContainer.style.display = "none";
    }
}

function checkCheckboxes() {
    var checkboxes = document.getElementById("checkboxContainer").querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(function(checkbox) {
        if(checkbox.checked){
            clickRandomButton(checkbox.name);
        }
    });
    showButton();
}

function clickRandomButton(buttonsId) {
    var buttons = document.getElementById(buttonsId).getElementsByTagName('button');
    var randomIndex = Math.floor(Math.random() * buttons.length);
    buttons[randomIndex].click();
}

// スクロールボタン作成
document.getElementById("title-top").innerHTML += Object.entries(x).map(([key, value]) => `<button onclick="scrollToCategory('${key}')">${key}</button>`).join('');
// カテゴリとボタン作成
document.getElementById("left-list").innerHTML += Object.entries(x).map(([key, value]) =>
  `<div my_name="${key}"><h1>${key}</h1>${Object.entries(value).map(([subKey, subValue]) =>
    `<button prompt="${subValue}" onclick="moveButton('${key}', 'container2',this)" oncontextmenu="rightMoveButton('container2', '${key}',this); return false;"  onmouseover="selectSpanInDiv('output', '${subKey}', this)">${subKey}</button>`).join('')}</div>`
).join('');
// 左クリック
function moveButton(sourceId, destinationId, button) {
  var sourceDiv = document.querySelector('[my_name="' + sourceId + '"]'),
    destinationDiv = document.querySelector('[my_name="' + destinationId + '"]');
  if (button.parentNode.getAttribute('my_name') === destinationId) {
    moveButtonUp(button);
    return;
  }
  sourceDiv.removeChild(button);
  destinationDiv.appendChild(button);
  extractText('pbtn', 'output');
}
// 右クリック
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
  extractText('pbtn', 'output');
}
function moveButtonUp(button) {
  var parent = button.parentNode;
  if (button.previousElementSibling) {
    parent.insertBefore(button, button.previousElementSibling);
  }
  extractText('pbtn', 'output');
}

function extractText(targetDivId, outputDivId) {
  var checkbox = document.getElementById("newline").checked;
  var texts = Array.from(document.getElementById(targetDivId).children)
      .map(span => `<span j_prompt=${span.textContent}>${span.getAttribute("prompt")}</span>`);
  document.getElementById(outputDivId).innerHTML = checkbox ? texts.join('<br>') : texts.join(', ');
}

// 文字を表示
function viewText(value) {
    var displayArea = document.getElementById("display-area");
    displayArea.innerText = value;
}

function selectSpanInDiv(divId, spanId, button) {
  var divElement = document.getElementById(divId);
  var spanselect = document.getElementById("spanselect").checked;
  var spanElement = divElement.querySelector('[j_prompt="' + spanId + '"]');
  if (divElement && spanselect) {
      if (spanElement) {
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(spanElement);
          selection.removeAllRanges();
          selection.addRange(range);
      } else {
          console.error("IDが " + spanId + " のspan要素が見つかりません。");
      }
  } else {
      console.error("IDが " + divId + " のdiv要素が見つかりません。");
  }

  viewText(button.getAttribute("prompt"));
}

function copyExtract() {
  var checkbox = document.getElementById("newline").checked;
  var targetDiv = document.getElementById('pbtn');
  var spans = targetDiv.children;
  var texts = [];
  for (var i = 0; i < spans.length; i++) {
      texts.push(spans[i].getAttribute("prompt"));// className
  }
  navigator.clipboard.writeText(checkbox ? texts.join("\n") : texts.join(", "));
  viewText("コピーしました。");
}

// スクロール
function scrollToCategory(category) {
    var h1Elements = document.querySelectorAll('h1');
    var element = document.getElementById('title-top');
    var height = element.clientHeight;
    h1Elements.forEach(function (h1) {
        if (h1.textContent === category) {
            var offset = h1.getBoundingClientRect().top + window.scrollY - (height + 7);
            var leftFrame = document.getElementById('left-frame');
            leftFrame.scrollTop += offset;
        }
    });
}

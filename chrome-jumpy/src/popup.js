/**
 * Used for kbd styling: https://chrispennington.blog/blog/add-styling-to-keyboard-keys-css/
 * Enabling more schemes: chrome://flags/#extensions-on-chrome-urls
 */

//
// Utilities.
//

// Uses: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
generateUuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// Uses: https://stackoverflow.com/questions/8747086/most-efficient-way-to-iterate-over-all-dom-elements
function iterDomElements(callback) {
  const items = document.getElementsByTagName("*");
  for (let i = 0; i < items.length; i++) {
    callback(item[i]);
  }
}

/**
 * @param {HTMLElement} element 
 */
const determineIsScrollable = (element) => {
  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
}

// Uses: https://stackoverflow.com/questions/185034/testing-the-type-of-a-dom-element-in-javascript
/**
 * @param {HTMLElement} element 
 */
const determineIsInteractable = (element) => {
  return (element.nodeType == 1 && (element.tagName == "a" || element.tagName == "input")) || determineIsScrollable(element);
}

// Uses: https://stackoverflow.com/questions/45770337/function-to-print-all-combinations-of-2-letters-length-using-the-english-alphabe
/**
 * @param {number} noOfCombinations 
 * @returns 
 */
const genKeyCombChars = (noOfCombinations) => {
  let result = [];

  letters = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
  for (let i = 26; i--;)
    for (let j = 26; j--;)
      for (let k = 26; k--;) result.push(letters[i] + letters[j] + letters[k]);

  if (result.length < noOfCombinations) return;
  return result.slice(0, noOfCombinations + 1);
}

//
// End Utilities.
//

const uuidv4 = generateUuidv4();

const upperKeyCombHtml = `<div class="${uuidv4}" style="
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    color: black;
    text-decoration: none;"
  >
    <kbd style="
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      padding: 0px 5px 0px 5px;
      border: 2px solid black; 
      box-shadow: 2px 2px black; 
      background: lightgrey; 
      opacity: 0.75;
      font-weight: 600;
      letter-spacing: .05em; 
      white-space: nowrap;"
    >`
const lowerKeyCombHtml = `
    </kdb>
  </div>`

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];

  chrome.scripting.executeScript({ 
    target: { tabId: tab.id },    
    injectImmediately: true,
    args: [genKeyCombChars(1500), upperKeyCombHtml, lowerKeyCombHtml],
    func: (keyCombinationChars, upperKeyCombHtml, lowerKeyCombHtml) => {
      const elements = document.getElementsByTagName("*");

      let isInteractableElements = [];      
      for (let i = 0; i < elements.length; i++) {
        if (
          (elements[i].nodeType == 1 && (elements[i].tagName == "A" || elements[i].tagName == "INPUT" || elements[i].tagName == "BUTTON"))
        )
          isInteractableElements.push(elements[i]);
      }
      
      for (let [i, interactableElement] of isInteractableElements.entries()) {
        if (!interactableElement.style.position) interactableElement.style.setProperty("position", "relative");
        interactableElement.insertAdjacentHTML("beforeend", upperKeyCombHtml + keyCombinationChars[i] + lowerKeyCombHtml);
      }
    }
  });
});

document.getElementById("key-combination-input").focus();
window.onblur = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    chrome.scripting.executeScript({ 
      target: { tabId: tab.id },    
      injectImmediately: true,
      args: [uuidv4],
      func: (uuidv4) => {
        const keyCombinations = document.getElementsByClassName(uuidv4);
        for (let keyCombination of keyCombinations)
          keyCombination.remove();
        for (let keyCombination of keyCombinations)
          keyCombination.remove();
        for (let keyCombination of keyCombinations)
          keyCombination.remove();
        for (let keyCombination of keyCombinations)
          keyCombination.remove();
        for (let keyCombination of keyCombinations)
          keyCombination.remove();
        for (let keyCombination of keyCombinations)
          keyCombination.remove();
        for (let keyCombination of keyCombinations)
          keyCombination.remove();
      }
    })
  });

  window.close();
}

document.getElementById("key-combination-input").addEventListener("input", () => { 
}, false)

document.getElementById("key-combination-input").addEventListener("keypress", (event) => { 
  if (event.key === "Enter") {
    window.close();
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
    
      chrome.scripting.executeScript({ 
        target: { tabId: tab.id },    
        injectImmediately: true,
        args: [uuidv4, event.target.value],
        func: (uuidv4, targetKeyCombChars) => {
          let targetKeyComb;
          for (let keyCombination of document.getElementsByClassName(uuidv4)) {
            if (keyCombination.textContent.toLowerCase().trim() === targetKeyCombChars) {
              targetKeyComb = keyCombination;
              break;
            }
          }
          
          targetKeyComb.parentElement.focus();
        }
      });
    });
  }
}, false)

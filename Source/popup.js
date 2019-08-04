'use strict';

const greenColor = '#3aa757';
const redColor = '#e8453c';

function changeButtonColor(button, color) {
    button.style.backgroundColor = color;
    button.setAttribute('value', color);
    console.log('Set color value to button and updated button color itself.');
}

function saveColorToStorage(newColor) {
    chrome.storage.sync.set({color: newColor}, () => {
        console.log('color is ' + newColor + '.');
    });
}

function removeAnnoyingElementsOnMedium(domContent) {
    function removeElementById(elementId) {
        let element = document.getElementById(elementId);
        if (element == undefined) {
            console.warn('No element with ID="' + elementId + '" found.');
            return;
        }
        element.parentNode.removeChild(element);
        console.log('Removed element with ID="' + elementId + '".');
    }

    function removeFirstElementByName(className) {
        let firstElement = document.getElementsByClassName(className)[0];
        if (firstElement == undefined) {
            console.warn('No element of class "' + className + '" found.');
            return;
        }
        firstElement.parentNode.removeChild(firstElement);
        console.log('Removed first element of class "' + className + '".');
    }

    function removeFirstElementByQuery(query) {
        let firstElement = document.querySelectorAll(query)[0];
        if (firstElement == undefined) {
            console.warn('No element found by query ' + query + '.');
            return;
        }
        firstElement.parentNode.removeChild(firstElement);
        console.log('Removed first element selected by query "' + query + '".');
    }

    // Change DOM here or check URL against regex.
    console.log('Tab script:');
    console.log(document.body);
    console.log('You are on Medium. Removing annoying elements.');

    removeFirstElementByName('l m n o p c q r s t u'); // Top panel.
    removeFirstElementByQuery('[data-test-id="post-sidebar"]'); // Left-side panel with description.
    removeFirstElementByName('m om ab on oo op oq'); // Down panel with registration suggestion.
    removeFirstElementByName('af ag es qm qn qo m n qp o p qq qr'); // Popup fullscreen window.

    console.log('Removed annoying elements successfully.');
    return document.body.innerHTML;
}

function determineWebSite(tabs) {
    // Regex-pattern to check URLs against.
    // It matches URLs like: http[s]://[...]medium.com[...]
    const urlRegex = /^https?:\/\/(?:[^./?#]+\.)?medium\.com/;

    let functionToCall;
    //Check the URL of the active tab against our pattern.
    if (urlRegex.test(tabs[0].url)) {
        functionToCall = removeAnnoyingElementsOnMedium;
    } else {
        console.error('Web site "' + tabs[0].url + '" is not supported.');
    }

    // We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: '(' + functionToCall + ')();'}, // Argument here is a string but function.toString() returns function's code.
        (results) => {
            // Here we have just the innerHTML and not DOM structure.
            console.log('Popup script:');
            console.log(results[0]);
        }
    );
}

let removeAnnoyingElements = document.getElementById('removeAnnoyingElements');

chrome.storage.sync.get('color', (data) => {
    changeButtonColor(removeAnnoyingElements, data.color);
});

removeAnnoyingElements.onclick = (element) => {
    console.log("Popup DOM fully loaded and parsed.");

    changeButtonColor(removeAnnoyingElements, redColor);
    chrome.tabs.query({active: true, currentWindow: true}, determineWebSite);
    changeButtonColor(removeAnnoyingElements, greenColor);
    // TODO: save progress to local storage and set button color depend on it
    // (but need to process all cases: page reloading, close and open page etc.).
};

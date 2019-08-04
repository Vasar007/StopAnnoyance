'use strict';

let removeAnnoyingElements = document.getElementById('removeAnnoyingElements');

chrome.storage.sync.get('color', (data) => {
    removeAnnoyingElements.style.backgroundColor = data.color;
    removeAnnoyingElements.setAttribute('value', data.color);
    console.log('Set color value to button and updated button color itself.');
});

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

    removeFirstElementByName('l m n o p c q r s t u');
    removeFirstElementByQuery('[data-test-id="post-sidebar"]');

    console.log('Removed annoying elements successfully.');
    return document.body.innerHTML;
}

function defineWebSite(tabs) {
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

removeAnnoyingElements.onclick = (element) => {
    console.log("Popup DOM fully loaded and parsed.");

    chrome.tabs.query({active: true, currentWindow: true}, defineWebSite);
};

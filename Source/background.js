'use strict';

const redColor = '#e8453c';

function saveColorToStorage(newColor) {
    chrome.storage.sync.set({color: newColor}, () => {
        console.log('color is ' + newColor + '.');
    });
}

chrome.runtime.onInstalled.addListener((tab) => {
    saveColorToStorage(redColor);

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { urlMatches: '(?:[^./?#]+\.)?medium\.com' },
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

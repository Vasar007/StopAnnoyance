'use strict';

chrome.runtime.onInstalled.addListener((tab) => {
    chrome.storage.sync.set({color: '#e8453c'}, function() {
        console.log('The color is red.');
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'medium.com'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

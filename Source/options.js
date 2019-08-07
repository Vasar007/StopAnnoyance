'use strict';

const greenColor = '#3aa757';
const redColor = '#e8453c';
const yellowColor = '#f9bb2d';
const blueColor = '#4688f1';

const buttonColors = [greenColor, redColor, yellowColor, blueColor];

function saveColorToStorage(newColor) {
    chrome.storage.sync.set({ color: newColor }, () => {
        console.log('color is ' + newColor + '.');
    });
}

function constructOptions(buttonColors, page) {
    for (let item of buttonColors) {
        let button = document.createElement('button');
        button.style.backgroundColor = item;
        button.addEventListener('click', () => {
            saveColorToStorage(item);
        });
        page.appendChild(button);
    }
}

let page = document.getElementById('buttonDiv');

constructOptions(buttonColors, page);

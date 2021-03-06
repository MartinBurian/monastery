// notifications.js

// Load the notifications
function loadNotifications() {
    browser.storage.sync.get(['notifications', 'notifyOn']).then(result => {
        document.querySelector('#notifications input[type=checkbox]')
            .checked = result.notifyOn;

        // If there are notices, use those times, otherwise, use a default 15 minutes
        for (let noteTime of (result.notifications.length > 0)
            ? result.notifications : [15])
            addNotifyEntry(noteTime);

        // Enable or disable the notifications area
        setNotifications(result.notifyOn);
    });
}

// Solely adds another notification nubmer input and span text to the notifications div
function addNotifyEntry(noteTime) {
    var noticeDiv = document.createElement('div');
    noticeDiv.classList.add('notifyTime');

    var noticeNode = document.createElement('input');
    noticeNode.setAttribute('type', 'number');
    noticeNode.setAttribute('min', '1');
    noticeNode.setAttribute('value', noteTime);
    noticeNode.addEventListener('change', event => saveNotifications());
    noticeDiv.appendChild(noticeNode);

    var noteText = document.createElement('span');
    noteText.textContent = 'minutes left';
    noticeDiv.appendChild(noteText);

    document.querySelector('#notifications #notifyTimes').appendChild(noticeDiv);
}

// Rig up checkbox functionality
document.querySelector('#notifications input[type=checkbox]').addEventListener('change', event => {
    setNotifications(
        document.querySelector('#notifications input[type=checkbox]').checked);
    saveNotifications();
});

// Save all the settings currently set on the options page
function saveNotifications() {
    var savedTimes = new Set();
    for (let noteTime of document.querySelectorAll('#notifications input[type=number]'))
        savedTimes.add(noteTime.value);
    savedTimes = [...savedTimes].filter(time => time >= 1).sort((left, right) => right - left);
    browser.storage.sync.set({notifications: savedTimes});
    console.log(`Saved times at ${savedTimes} minute(s)`);
}

function setNotifications(shouldBeEnabled) {
    for (let button of document.querySelectorAll('#notifications input[type=button]'))
        button.disabled = !shouldBeEnabled;
    for (let numInput of document.querySelectorAll('#notifications input[type=number]'))
        numInput.disabled = !shouldBeEnabled;

    if (shouldBeEnabled) {
        for (let paragraph of document.querySelectorAll('#notifications div span'))
            paragraph.classList.remove('notesDisabled');
        document.querySelector('#notifications div p').classList.remove('notesDisabled');
    }
    else {
        for (let paragraph of document.querySelectorAll('#notifications div span'))
            paragraph.classList.add('notesDisabled');
        document.querySelector('#notifications div p').classList.add('notesDisabled');
    }
    browser.storage.sync.set({notifyOn: shouldBeEnabled});
    console.log(`Turned notifications ${(shouldBeEnabled) ? 'on' : 'off'}`);
}

// Add functionality for the add button
document.querySelector('#notifications input[value=Add]').addEventListener('click', event => {
    addNotifyEntry(15);
    saveNotifications();
});
// Add functionality for the remove button
document.querySelector('#notifications input[value=Remove]').addEventListener('click', event => {
    if (document.querySelectorAll('#notifications div div').length > 1) {
        document.querySelector('#notifications div')
            .removeChild(document.querySelector('#notifications div div:last-of-type'));
        saveNotifications();
    }
});

document.addEventListener('DOMContentLoaded', event => loadNotifications());

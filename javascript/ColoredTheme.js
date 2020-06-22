var ipc = require('electron').ipcRenderer
const remote = require('electron').remote;

function closeChildWin () {
    var window = remote.getCurrentWindow();
    window.close();
};

document.getElementById("cancel-btn").addEventListener("click", function (e) {
    closeChildWin();
});

document.getElementById("eggplant").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-eggplant');
    closeChildWin();
});

document.getElementById("coral").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-coral');
    closeChildWin();
});

document.getElementById("amethyst").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-amethyst');
    closeChildWin();
});

document.getElementById("deep-blue").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-deep-blue');
    closeChildWin();
});

document.getElementById("terminal").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-terminal');
    closeChildWin();
});

document.getElementById("chocolate-mint").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-chocolate-mint');
    closeChildWin();
});

document.getElementById("milk-chocolate-mint").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-milk-chocolate-mint');
    closeChildWin();
});

document.getElementById("red-bean").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-red-bean');
    closeChildWin();
});

document.getElementById("candy-cotton").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-candy-cotton');
    closeChildWin();
});

document.getElementById("banana").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-banana');
    closeChildWin();
});

document.getElementById("depressive").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-depressive');
    closeChildWin();
});

document.getElementById("btp").addEventListener("click", function (e) {
    remote.getCurrentWindow().getParentWindow().webContents.send('color-theme-chosen', 'theme-btp');
    closeChildWin();
});

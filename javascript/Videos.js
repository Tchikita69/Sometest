var path = require("path")
var videoBtn = document.getElementById('open-video')
var videoPlayer = document.getElementById('video-player')
var list = document.getElementById('videos-list')
var folderList = document.getElementById('folder-list')
var source = document.createElement('source');
var selectedDir;
var nowPlay = document.getElementById("now_playing")
var electron = require("electron")
var fs = require('fs');
var Store = require('electron-store');
var store = new Store();
var jsFolderList = (store.get("videoFo") != undefined ? store.get("videoFo") : [])
var jsMusicList = []
source.setAttribute('src', "");
videoPlayer.appendChild(source);

if (jsFolderList.length > 0) {
    jsFolderList.forEach(folder => {
        var li = document.createElement('li')
        li.className = "folder"
        li.innerHTML = folder;
        folderList.appendChild(li);
        initVideoPlayer(folder, getFilesFromDir(folder))
    })
}
function getFilesFromDir(dir) {
    let files = []
    filenames = fs.readdirSync(dir); 
    filenames.forEach(file => {
        if (path.extname(file) == ".mp4" || path.extname(file) == ".avi") 
            files.push(file); 
    })
    return files
}

videoBtn.addEventListener('click', function(e) {
    dialog.showOpenDialog({
        properties: ['openDirectory'], title: "Sélectionnez une vidéo", 
    }).then((dir) => {
            const directoryPath = dir.filePaths[0];
            let files
            if (directoryPath && directoryPath !== undefined) {
                files = getFilesFromDir(directoryPath)
                if(directoryPath && files.length > 0)
                    initVideoPlayer(directoryPath, files)
                else
                    alert("Error: Unable to open directory. Please try again.")
            }
    })
})

function playVideo(videoTitle) {
    nowPlay.innerHTML = ""
    var title = document.createElement("h3")
    title.setAttribute("id", "npstring")
    title.innerHTML = videoTitle
    nowPlay.appendChild(title)
    videoPlayer.pause()
    source.setAttribute('src', path.join(selectedDir, videoTitle));
    videoPlayer.load()
    videoPlayer.play()
}

function initVideoPlayer(dirpath, files) {
    list.innerHTML = ''
    selectedDir = dirpath

    // Folder LIST

    if (!jsFolderList.includes(dirpath)) {
        var li = document.createElement('li')
        li.className = "folder"
        jsFolderList.push(dirpath)
        store.set("videoFo", jsFolderList)
        li.innerHTML = dirpath;
        folderList.appendChild(li);
    }

    // Files list
    jsMusicList = []
    files.forEach(element => {
        var tmp = document.createElement('li')
        tmp.innerHTML = element
        tmp.className = "vid"
        list.appendChild(tmp)
        jsMusicList.push(element)
    });
    playVideo(files[0])
}

list.addEventListener('click', function(e) {
    if (e.target && e.target.matches('li.vid'))
        playVideo(e.target.innerHTML)
})

folderList.addEventListener('click', function(e) {
    if (e.target && e.target.matches('li.folder'))
        initVideoPlayer(e.target.innerHTML, getFilesFromDir(e.target.innerHTML))
})

videoPlayer.addEventListener('ended', function(e) {
    const finder = (element) => element === document.getElementById("npstring").innerHTML
    const index = ((jsMusicList.length - 1) === (jsMusicList.findIndex(finder)) ? 0 : jsMusicList.findIndex(finder) + 1)
    playVideo(jsMusicList[index])
})
function getSavedDataFromLocalStorage(id) {
    let savedData = localStorage.getItem(id);
    if (savedData) {
        return JSON.parse(savedData);
    }
    console.log("No saved data found");
    return null;
}

function loadSavedItemToEditor(savedData) {

    currentId = savedData.blocks[0].data.text;
    console.log("current id from loadsaved " + currentId);
    editor.render(savedData);
    // document.addEventListener("DOMContentLoaded", function() {

    // });

}

function LoadItemButtonHandler(id) {
    console.log("Button clicked");
    let savedData = getSavedDataFromLocalStorage(id);
    if (window.location.pathname == "/settings.html" || window.location.pathname == "/settings") {
        console.log(window.location.pathname);
        window.location.href = "/" + "?note=" + id;
        return;
    }
    if (savedData) {
        loadSavedItemToEditor(savedData);
    }
    currentId = id;
}

function getPageTitle() {
    let title = document.getElementById("title").value;
    return title;
}


function saveActiveEditor() {
    console.log("current id from save active editor" + currentId);
    editor.save().then((savedData) => {
        console.log("Saved data called");

        if (savedData.blocks.length == 0) {
            console.log("No blocks found");
            localStorage.removeItem(currentId);
            newDoc();
            return;
        } else if (savedData.blocks[0].data.text == '<font color="#808080">Write your notes!</font>') {
            return
        }
        savedData["favorite"] = false;
        localStorage.setItem(currentId, JSON.stringify(savedData));
        console.log(savedData);
        console.log(savedData.blocks[0].data.text);
        loadSavedDataToDrawer();
    }).catch((error) => {
        console.error("Saving error", error);
    });
}


function getAllSavedData() {
    savedData = new Array();
    for (let i = 0; i < localStorage.length; i++) {
        data = {
            id: localStorage.key(i),
            savedData: localStorage.getItem(localStorage.key(i)),
        };
        savedData.push(data);
    }
    return savedData;
}

function loadSavedDataToDrawer() {
    savedDatas = getAllSavedData();
    let drawer = document.getElementById("savedDataDrawer");
    drawer.innerHTML = "";
    for (let i = 0; i < savedDatas.length; i++) {
        // skip if doesnt start with "doc"
        if (!savedDatas[i].id.startsWith("doc")) {
            continue;
        }

        dict = JSON.parse(savedDatas[i].savedData);

        let li = document.createElement("li");
        li.className = "nav-link";

        link = document.createElement("a");
        link.href = "#";

        icon = document.createElement("i");
        icon.className = "bx bxs-file icon";

        span = document.createElement("span");
        // title = dict.blocks[0].data.text
        span.innerText = dict.blocks[0].data.text.slice(0, 10);
        span.className = "text nav-text";

        link.appendChild(icon);
        link.appendChild(span);
        li.appendChild(link);
        drawer.appendChild(li);

        li.onclick = function() {
            LoadItemButtonHandler(savedDatas[i].id);
        }
    }

}

document.addEventListener("DOMContentLoaded", function() {
    loadSavedDataToDrawer();
});

// searchbar
searchbar = document.getElementById("search-textfield")

function filterSavedData(query) {
    savedDatas = getAllSavedData();
    let drawer = document.getElementById("savedDataDrawer");
    drawer.innerHTML = "";
    for (let i = 0; i < savedDatas.length; i++) {
        dict = savedDatas[i].savedData;
        if (dict.blocks[0].data.text.toLowerCase().includes(query.toLowerCase())) {
            let li = document.createElement("li");
            li.className = "nav-link";

            link = document.createElement("a");
            link.href = "#";

            icon = document.createElement("i");
            icon.className = "bx bxs-file icon";

            span = document.createElement("span");
            // title = dict.blocks[0].data.text
            span.innerText = dict.blocks[0].data.text.slice(0, 10);
            span.className = "text nav-text";

            link.appendChild(icon);
            link.appendChild(span);
            li.appendChild(link);
            drawer.appendChild(li);

            li.onclick = function() {
                LoadItemButtonHandler(savedDatas[i].id);
            }
        }
    }
}

searchbar.addEventListener('keyup', () => {
    filterSavedData(searchbar.value);
})

// var loadAllItemButton = document.getElementById("loadAllItemButton").addEventListener("click", function() {
//     console.log("Load all items button clicked");
//     loadSavedDataToDrawer();
// });

// var loadItemButton = document.getElementsByClassName("loadItemButton");
// for (let i = 0; i < loadItemButton.length; i++) {
//     loadItemButton[i].addEventListener("click", function() {
//         LoadItemButtonHandler(loadItemButton[i].id);
//     });
// }



//side-bar
const body = document.querySelector('body'),
    nav = body.querySelector('nav'),
    sidebar = body.querySelector('.sidebar'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");
docdrawer = body.querySelector(".doc-drawer");
textEditorMove = body.querySelector(".container");
settingsBtn = document.getElementById("settingsButton");
// notineLogo = document.getElementById("notine-logo");
profile_pics = document.getElementById("profile-pic-sidebar");

function loadProfilePicFromLocalStorage() {
    let profilePicure = localStorage.getItem("profile_picture");
    if (profilePicure) {
        profile_pics.src = profilePicure;
    } else {
        profile_pics.src = "./assets/img/default_profile.jpg";

    }
}



function setSidebarDisplayNameFromLocalStorage() {
    let displayName = localStorage.getItem("username");
    if (displayName) {
        document.getElementById("display-name").innerText = displayName;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadProfilePicFromLocalStorage();
    setSidebarDisplayNameFromLocalStorage();
    checkLastDarkMode();
});


toggle.addEventListener("click", () => {
    docdrawer.classList.toggle("close");
    sidebar.classList.toggle("close");
    toggle.classList.toggle("close");
    textEditorMove.classList.toggle("close")
})

searchBtn.addEventListener("click", () => {
    docdrawer.classList.remove("close");
    sidebar.classList.remove("close");
})







function editorModeSwitch() {
    body.classList.toggle("dark");
    nav.classList.toggle("dark");
    nav.classList.contains("dark") ? document.getElementById("notein-logo").src = "notein_light.svg" : document.getElementById("notein-logo").src = "notein_dark.svg";
    document.getElementsByClassName("container")[0].classList.toggle("dark");

    try {
        document.getElementsByClassName("codex-editor")[0].classList.toggle("dark");
    } catch (error) {}

    if (body.classList.contains("dark")) {
        modeText.innerText = "Light mode";
        localStorage.setItem("mode", "dark");
    } else {
        modeText.innerText = "Dark mode";
        localStorage.setItem("mode", "light");
    }
}


modeSwitch.addEventListener("click", () => {
    editorModeSwitch();
});

function checkLastDarkMode() {
    console.log("check last dark mode");
    mode = localStorage.getItem("mode");
    if (mode == "dark") {
        editorModeSwitch();
    }
}
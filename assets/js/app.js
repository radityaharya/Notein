var editor = new EditorJS({
    holder: "editorjs",
    readOnly: false,
    tools: {
        Color: {
            class: window.ColorPlugin,
            config: {
                colorCollections: ['#EC7878',
                    '#9C27B0',
                    '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF'
                ],
                defaultColor: '#FF1300',
                type: ['text', "header"]
            },
        },
        header: {
            class: Header,
            inlineToolbar: ["marker", "link"],
            config: {
                placeholder: "Header",
            },
            shortcut: "CMD+SHIFT+H",
        },
        image: SimpleImage,
        list: {
            class: List,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+L",
        },
        checklist: {
            class: Checklist,
            inlineToolbar: true,
        },
        quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
                quotePlaceholder: "Enter a quote",
                captionPlaceholder: "Quote's author",
            },
            shortcut: "CMD+SHIFT+O",
        },
        warning: Warning,
        marker: {
            class: Marker,
            shortcut: "CMD+SHIFT+M",
        },
        code: {
            class: CodeTool,
            shortcut: "CMD+SHIFT+C",
        },
        delimiter: Delimiter,
        inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+C",
        },
        linkTool: LinkTool,
        embed: Embed,
        table: {
            class: Table,
            inlineToolbar: true,
            shortcut: "CMD+ALT+T",
        },
    },

    data: {
        blocks: [{
            "id": "pUIoPefkED",
            "type": "paragraph",
            "data": {
                "text": "<font color=\"#808080\">Write your notes!</font>"
            }
        }],
    },
    onReady: function() {
        saveActiveEditor();
        new Undo({
            editor,
        });
        loadSavedDataToDrawer();
    },
    onChange: function(api, event) {
        console.log("something changed", event);
        updateCurrentPageTitle();
        saveActiveEditor();
        loadSavedDataToDrawer();
    },

});

var currentId = null;
var newDocButton = document.getElementById("newDocButton");

newDocButton.addEventListener("click", newDoc);

function newDoc() {
    editor.render({
        blocks: [{
            "id": "pUIoPefkED",
            "type": "paragraph",
            "data": {
                "text": "<font color=\"#808080\">Write your notes!</font>"
            }
        }],
    });
    rand_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    rand_id = "doc-" + rand_id;
    currentId = rand_id;
    document.title = "Notine - Untitled";
    loadSavedDataToDrawer();
}

// clear editor on first focus if text is default
document.getElementById("editorjs").addEventListener('focusin', () => {
    editor.save().then(function(data) {
        if (data.blocks[0]) {
            console.log(data.blocks[0].data.text)
            if (data.blocks[0].data.text == '<font color="#808080">Write your notes!</font>') {
                editor.render({ "time": 1653447104063, "blocks": [{ "id": "pUIoPefkED", "type": "paragraph", "data": { "text": "" } }], "version": "2.24.3" })
            }
        }

    })
})

function updateCurrentPageTitle() {
    editor.save().then(function(data) {
        if (data.blocks[0]) {
            console.log(data.blocks[0])
            let title = data.blocks[0].data.text;
            document.title = "Notine - " + title;
        } else {
            console.log("No title found");
            document.title = "Notine - Untitled";
        }
    });
}

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
}

function LoadItemButtonHandler(id) {
    console.log("Button clicked");
    let savedData = getSavedDataFromLocalStorage(id);
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
        dict = JSON.parse(savedDatas[i].savedData);

        let li = document.createElement("li");
        li.className = "nav-link";

        link = document.createElement("a");
        link.href = "#";

        icon = document.createElement("i");
        icon.className = "bx bxs-file icon";

        span = document.createElement("span");
        span.innerText = dict.blocks[0].data.text;
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
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");
docdrawer = body.querySelector(".doc-drawer");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    docdrawer.classList.toggle("close");
})

searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
    docdrawer.classList.remove("close");
})

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        modeText.innerText = "Light mode";
    } else {
        modeText.innerText = "Dark mode";

    }
});
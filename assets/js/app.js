if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}

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
        new Undo({
            editor,
        });

        if (onLoadCheckQueryString()) {
            newDoc();
            saveActiveEditor();
        }
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

function onLoadCheckQueryString() {
    console.log("onLoadCheckQueryString");
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    if (params.note) {
        console.log("Loading note: " + params.note);
        LoadItemButtonHandler(params.note);
        currentId = params.note;
        window.history.pushState("", document.title, window.location.pathname);
        return false;
    } else {
        console.log("No note specified");
        return true;
    }
}
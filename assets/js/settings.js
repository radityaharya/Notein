profile_pic = document.getElementById("profile-pic");

function loadProfilePicFromLocalStorages() {
    let profilePic = localStorage.getItem("profile_picture");
    if (profilePic) {
        profile_pic.src = profilePic;
    } else {
        console.log("No profile pic found");
        profile_pic.src = "./assets/img/default_profile.jpg";
    }
}

profile_pic.addEventListener("click", () => {
    document.getElementById("fileinputpics").click();
});


document.addEventListener("DOMContentLoaded", function () {
    loadProfilePicFromLocalStorages();
});



form = document.getElementById("filedroparea");
var importedDoc = null;

form.addEventListener("change", function (event) {
    file = event.target.files[0];
    reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
        console.log(event.target.result);
        number_of_notes = JSON.parse(event.target.result).length;
        console.log(number_of_notes);
        document.getElementById("fileInfo").innerHTML = file.name + " | Number of notes: " + number_of_notes + " | Size: " + file.size + " bytes" + "<br>";
        importedDoc = JSON.parse(event.target.result);

        confirmbtn = document.createElement("div")
        confirmbtn.className = "btn btn-primary"

        confirmbtn.innerText = "Import"
        confirmbtn.onclick = function () {
            importDoc(importedDoc);
        }


        warningMessage = document.createElement("div");
        warningMessage.className = "text-danger";
        warningMessage.innerText = "Warning: This will overwrite all existing notes.";

        document.getElementById("fileInfo").appendChild(warningMessage);
        
        document.getElementById("fileInfo").appendChild(confirmbtn);
    }


});

function clearLocalSavedData() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("doc")) {
            localStorage.removeItem(localStorage.key(i));
        }
    }
}

function loadImportedNotesToLocalStorage(importedDoc) {
    for (let i = 0; i < importedDoc.length; i++) {
        localStorage.setItem(importedDoc[i].id, importedDoc[i].savedData);
    }
}

function importDoc(importedDoc) {
    clearLocalSavedData();
    loadImportedNotesToLocalStorage(importedDoc);
    loadSavedDataToDrawer();
}



function savedNotesToJsonFile() {
    localStorage = document.localStorage;

    savedData = [];
    console.log(localStorage.length);
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("doc")) {
            data = {
                id: localStorage.key(i),
                savedData: localStorage.getItem(localStorage.key(i)),
            };
            savedData.push(data);
        }
    }

    return JSON.stringify(savedData);
}

document.getElementById("export-btn").addEventListener("click", function () {
    let json = savedNotesToJsonFile();
    console.log(json);
    let blob = new Blob([json], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "saved-notes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});


function loadPictureToLocalStorage(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
        localStorage.setItem("profile_picture", event.target.result);
        loadProfilePicFromLocalStorages();
        loadProfilePicFromLocalStorage()
    }
}

fileinputpic = document.getElementById("fileinputpic");
fileinputpic.addEventListener("change", function (event) {
    loadPictureToLocalStorage(event.target.files[0]);
});

function setNameValueFromLocalStorage() {
    uname = localStorage.getItem("username");
    if (uname) {
        document.getElementById("name-input").value = uname;
    }
};

document.addEventListener("DOMContentLoaded", function () {
    setNameValueFromLocalStorage();
});

function setNameToLocalStorage(name) {
    localStorage.setItem("username", name);
};

nameInput = document.getElementById("name-input");
nameInput.addEventListener("keyup", function (event) {
    setNameToLocalStorage(event.target.value);
    setSidebarDisplayNameFromLocalStorage();
});

document.getElementById("newDocButton").addEventListener("click", function () {
    if (window.location.pathname == "/settings.html" || window.location.pathname == "/settings") {
        console.log(window.location.pathname);
        window.location.href = "/";
    }
});
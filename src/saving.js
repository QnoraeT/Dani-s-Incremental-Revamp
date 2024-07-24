"use strict";
const saveID = "danidanijr_save_revamp";
const MODE_LIST = ["Normal", "Hard", "Extreme", "Easy", "Idler's Dream", "Softcap Central", "Scaled Ruins"];

function displayModes(mode) {
    let txt = "";
    if (mode.length === 0) { return MODE_LIST[0]; }
    if (mode.length === 1) { return MODE_LIST[mode[0] + 1]; }
    for (let i = 0; i < mode.length - 1; i++) {
        txt += `${MODE_LIST[mode[i] + 1]}, `;
    }
    txt += MODE_LIST[mode[mode.length - 1] + 1];
    return txt;
}

function saveTheFrickingGame() {
    try {
        game.value.list[game.value.currentSave].player = player.value;
        localStorage.setItem(saveID, btoa(JSON.stringify(game)));
        return "Game was saved!";
    } catch (e) {
        console.warn("Something went wrong while trying to save the game!!");
        throw e;
    }
}

function resetTheWholeGame() {
    if (!confirm("Are you sure you want to delete EVERY save?")) {
        return;
    }
    if (!confirm("You cannot recover ANY of your save files unless if you have an exported backup! Are you still sure? [Final Warning]")) {
        return;
    }
    localStorage.setItem(saveID, null);
    tmp.value.runGame = false;
}

function resetThisSave(prompt) {
    if (prompt) {
        if (!confirm("Are you sure you want to delete this save?")) {
            return;
        }
        if (!confirm("You cannot recover this save unless if you have an exported backup! Are you still sure? [Final Warning]")) {
            return;
        }
    }
    resetPlayer();
    saveTheFrickingGame();
    tmp.value.runGame = false;
}

function createNewSave() {
    game.value.list.push({
        name: `Save #${game.value.list.length + 1}`,
        mode: [],
        player: player
    })
    switchToSave(game.value.list.length - 1);
    resetPlayer();
    saveTheFrickingGame();
}

function switchToSave(id) {
    try {
        game.value.currentSave = id;
        localStorage.setItem(saveID, btoa(JSON.stringify(game)));
        tmp.value.runGame = false;
    } catch (e) {
        console.warn("Something went wrong while trying to save the game!!");
        throw e;
    }
}

function renameSave(id) {
    let i = prompt('What name would you like to give this save?'); 
    if (i !== '') { 
        game.value.list[id].name = i;
    }
}

function duplicateSave(id) {
    if (!confirm("Are you sure you want to duplicate this save?")) {
        return;
    }
    if (id < game.value.currentSave) {
        game.value.currentSave++
    }
    game.value.list.splice(id+1, 0, game.value.list[id]);
    saveTheFrickingGame();
    tmp.value.runGame = false;
}

function deleteSave(id) {
    if (!confirm("Are you sure you want to delete this save?")) {
        return;
    }
    if (!confirm("You cannot recover this save unless if you have an exported backup! Are you still sure? [Final Warning]")) {
        return;
    }
    if (game.value.list.length === 1) {
        resetThisSave();
    }
    game.value.list.splice(id, 1);
    if (game.value.currentSave === id) {
        switchToSave(id - 1);
    }
    if (id < game.value.currentSave) {
        game.value.currentSave--;
    }
}

function importSave(id) {
    if (!confirm("Are you sure you want to do this? This will overwrite this save file!")) {
        return;
    }
    let save = prompt('Paste your save file here.');

    if (save === '' || save === null) {
        return;
    }

    try {
        save = JSON.parse(atob(save));
    } catch(e) {
        alert(`Importing save file failed! ${e}`);
        return;
    }

    if (save._value !== undefined) {
        alert("Importing save file failed because this is an export of a save list, and not a save file.");
        return;
    }
    
    game.value.list[id] = save;
    if (game.value.currentSave === id) {
        player.value = save.player;
    }
    updatePlayerData(player);
    tmp.value.runGame = false;
}

function exportSave(id) {
    let str = btoa(JSON.stringify(game.value.list[id]));
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
    el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
}

function importSaveList() {
    if (!confirm("Are you sure you want to do this? This will overwrite EVERY save file in your save list!")) {
        return;
    }

    let save = prompt('Paste your save list here.');

    if (save === '' || save === null) {
        return;
    }

    try {
        save = JSON.parse(atob(save))._value;
    } catch(e) {
        alert(`Importing save list failed! ${e}`);
        return;
    }

    if (save === undefined) {
        alert("Importing save file failed because this is an export of a save file, and not a save list.");
        return
    }

    game.value = save;
    player.value = game.value.list[game.value.currentSave].player;
    updatePlayerData(player);
    tmp.value.runGame = false;
}

function exportSaveList() {
	let str = btoa(JSON.stringify(game));
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
    el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
}

function setAutosaveInterval() {
    let i = window.prompt('Set your new auto-saving interval in seconds. Set it to Infinity if you want to disable auto-saving.'); 

    if (i === '') {
        alert('Your set autosave interval is empty...');
        return;
    }

    if (isNaN(i)) { 
        alert('Your set autosave interval is not a number...');
        return;
    } 

    if (i < 1) { 
        alert('Your set autosave interval is way too fast or negative...'); 
        return;
    }

    // saving sets Infinity to null for some reason, so i have to cap it at 1e10
    // yes this theoretically means that after 317 years and 1 month, it will save :3
    if (i >= 1e10) {
        i = 1e10;
    }

    player.value.settings.autoSaveInterval = i * 1000; 
}


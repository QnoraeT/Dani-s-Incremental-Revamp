"use strict";
const saveID = "danidanijr_save_revamp";
const SAVE_MODES = [
    {
        name: "Hard",
        desc: "This mode makes the game harder, meaning there will be more strategizing, and sometimes a longer wait time. Some requirements will also be tougher to satisfy. However, some other requirements have been made slightly easier to somewhat accomodate for this.",
        borderColor: "#ff8000",
        borderSelectedColor: "#ffc080",
        bgColor: "#663300",
        textColor: "#ffc080"
    },
    {
        name: "Extreme",
        desc: "This mode makes the game way more difficult, meaning this does what Hard does, + you might also have to solve puzzles as well. This mode may also add in special layers to compensate.",
        borderColor: "#ff5040",
        borderSelectedColor: "#ffa080",
        bgColor: "#662820",
        textColor: "#ffd0c0"
    },
    {
        name: "Easy",
        desc: "This mode makes the game easier. This increases the pace of the game, and requirements with conditions will be nerfed.",
        borderColor: "#40ff60",
        borderSelectedColor: "#a0ffc0",
        bgColor: "#104018",
        textColor: "#80ffa0"
    },
    {
        name: "Idler's Dream",
        desc: "This mode makes the game more like an idle game instead of the hybrid it is. (At least I hope so... >_>') Many things may become slower, but you will not have to be active as much, and the difficulty will stay roughly the same.",
        borderColor: "#80c0ff",
        borderSelectedColor: "#d0e8ff",
        bgColor: "#203040",
        textColor: "#c0d0e0"
    },
    {
        name: "Softcap Central",
        desc: "This mode adds many, many softcaps into the game. Truly a Jacorbian spectacle! There will be a few added mechanics to help you deal with these softcaps, but overall the game will be harder.",
        borderColor: "#c040ff",
        borderSelectedColor: "#e0a0ff",
        bgColor: "#301a46",
        textColor: "#e0c0ff"
    },
    {
        name: "Scaled Ruins",
        desc: "This mode adds many, many scaling increases into the game. Is IM:R calling? This also includes scaling increases beyond the legendary \"Atomic\" scaling. There will be a few added mechanics to help you deal with these softcaps, but overall the game will be harder.",
        borderColor: "#6040ff",
        borderSelectedColor: "#a080ff",
        bgColor: "#1f1a46",
        textColor: "#c8c0ff"
    },
]

function setTempModes(id) {
    tmp.value.saveModes[id] = !tmp.value.saveModes[id];
}

function resetModes() {
    for (let i = 0; i < tmp.value.saveModes.length; i++) {
        tmp.value.saveModes[i] = false;
    }
}

function displayModes(mode) {
    let txt = "";
    if (mode.length === 0) { return "Normal"; }
    if (mode.length === 1) { return SAVE_MODES[mode[0]].name; }
    for (let i = 0; i < mode.length - 1; i++) {
        txt += `${SAVE_MODES[mode[i]].name}, `;
    }
    txt += SAVE_MODES[mode[mode.length - 1]].name;
    return txt;
}

function displayModesNonOptArray(modes) {
    let txt = "";
    let mode = [];
    for (let i = 0; i < modes.length; i++) {
        if (modes[i]) {
            mode.push(i);
        }
    }
    if (mode.length === 0) { return "Normal"; }
    if (mode.length === 1) { return SAVE_MODES[mode[0]].name; }
    for (let i = 0; i < mode.length - 1; i++) {
        txt += `${SAVE_MODES[mode[i]].name}, `;
    }
    txt += SAVE_MODES[mode[mode.length - 1]].name;
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

function createNewSave(modes) {
    let mode = [];
    for (let i = 0; i < modes.length; i++) {
        if (modes[i]) {
            mode.push(i);
        }
    }
    game.value.list.push({
        name: `Save #${game.value.list.length + 1}`,
        mode: mode,
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
        console.warn("Something went wrong while trying to switch save files!!");
        throw e;
    }
}

function renameSave(id) {
    let i = prompt('What name would you like to give this save? (Input blank to keep the name.)'); 
    if (!(i === '' || i === null)) { 
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
        return;
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
    saveTheFrickingGame();
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
    saveTheFrickingGame();
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


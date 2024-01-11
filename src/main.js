const saveID = "danidanijr_save_revamp";
const TABS_LIST = [
    {
        name() { return "Generators" },
        staticName() { return "gen" },
        backgroundColor() { return "#999999" },
        textColor() { return "#000000" },
        outlineColor() { return "#00000000" },
        highlightColor() { return "#FFFFFF" },
        if() { return true }
    },
    {
        name() { return "Options" },
        staticName() { return "opt" },
        backgroundColor() { return "#999999" },
        textColor() { return "#000000" },
        outlineColor() { return "#00000000" },
        highlightColor() { return "#FFFFFF" },
        if() { return true }
    },
    {
        name() { return "Stats" },
        staticName() { return "stat" },
        backgroundColor() { return "#999999" },
        textColor() { return "#000000" },
        outlineColor() { return "#00000000" },
        highlightColor() { return "#FFFFFF" },
        if() { return true }
    },
    {
        name() { return "Achievements" },
        staticName() { return "ach" },
        backgroundColor() { return "#999999" },
        textColor() { return "#000000" },
        outlineColor() { return "#00000000" },
        highlightColor() { return "#FFFFFF" },
        if() { return true }
    },
    {
        name() { return "Kuaraniai" },
        staticName() { return "kua" },
        backgroundColor() { return "#3100ff" },
        textColor() { return "#ffffff" },
        outlineColor() { return "#7958ff" },
        highlightColor() { return "#ff81cb" },
        if() { return player.generators.pr2.best.gte(10) }
    },
    {
        name() { return "Colosseum" },
        staticName() { return "col" },
        backgroundColor() { return "#af1a00" },
        textColor() { return "#ffffff" },
        outlineColor() { return "#ff3600" },
        highlightColor() { return "#ff9b7f" },
        if() { return player.kua.kpower.upgrades >= 2 && player.kua.amount.gte(100) }
    },
]

const otherGameStuffIg = {
    FPS: 0,
    sessionTime: 0,
    delta: 0
}

let version = 0;
let game = {};
let player = {};
let tmp = {};
let tab = [0, 0, 0];
let fpsList = [];
let lastFPSCheck = 0;
let lastSave = 0;
let saveTime = 30000;
let currentSave = 0;

function switchTab(t, id) {
    tab[id] = t;
    for (let TA = id + 1; TA <= (tab.length - 1); ++TA) {
        tab[TA] = 0;
        if (TA > 40) {
            throw new Error("what the hell? (broke out of somehow infinite loop)");
        }
    }
}

function resetPlayer() {
    player = {
        chapter: 0,
        achievements: {},
        points: dZero,
        pps: dOne,
        totalPoints: dZero,
        totalPointsInPRai: dZero,
        inChallenge: [], 
        totalTime: 0, // timespeed doesn't affect this
        gameTime: dZero, // timespeed will affect this (totalGameTime)
        timeSpeed: dOne,
        setTimeSpeed: dOne, // change this if you think the game is going too fast or slow, i won't judge you =P
        version: 0,
        nerf: {
            up1Active: true,
            up2Active: true,
            praiActive: true,
            pr2Active: true
        },
        auto: {
            upg1: false,
            upg2: false,
            pr2: false,
        },
        generators: {
            upg1: {
                cost: D(5),
                target: dZero,
                effectBase: D(1.5),
                calculatedEB: D(1.5),
                costBase: D(1.55),
                bought: dZero,
                freeExtra: dZero,
                effective: dZero,
                effect: dOne,
                best: dZero
            },
            upg2: {
                cost: D(1000),
                target: dZero,
                effectBase: D(1.2),
                calculatedEB: D(1.2),
                costBase: D(1.25),
                bought: dZero,
                freeExtra: dZero,
                effective: dZero,
                effect: dOne,
                best: dZero
            },
            prai: {
                amount: dZero,
                effect: dOne,
                best: dZero,
                total: dZero,
                totalInPR2: dZero,
                bestInPR2: dZero
            },
            pr2: {
                amount: dZero,
                freeExtra: dZero,
                target: dZero,
                effect: dOne,
                best: dZero
            },
        },
        kua: {
            amount: dZero,
            effect: dOne,
            kshards: {
                amount: dZero,
                upgrades: 0
            },
            kpower: {
                amount: dZero,
                upgrades: 0
            }
        },
        col: {
            completed: {},
            power: dZero,
            time: dZero,
        },
        settings: {
            notation: "Mixed Scientific",
            scalingNames: "DistInc",
            showCharacterImgs: true,
            nameChanges: false,
            theme: 0,
            background: [],
            // available: "Parallax" "Dots" "ChapterBased" "TabBased" "CharacterBased"
            musicVolume: 0.00,
            sfxVolume: 0.00,
        }
    }
}

function fixData(defaultData, newData) {
    let item;
    for (item in defaultData) {
        if (defaultData[item] == null) {
            if (newData[item] === undefined);
            newData[item] = null;
        } else if (Array.isArray(defaultData[item])) {
            if (newData[item] === undefined) {
                newData[item] = defaultData[item];
            } else {
                fixData(defaultData[item], newData[item]);
            }
        } else if (defaultData[item] instanceof Decimal) { // Convert to Decimal
            if (newData[item] === undefined) {
                newData[item] = defaultData[item];
            } else {
                newData[item] = new Decimal(newData[item]);
            }
        } else if ((!!defaultData[item]) && (typeof defaultData[item] === "object")) {
            if (newData[item] === undefined || (typeof defaultData[item] !== "object")) {
                newData[item] = defaultData[item];
            } else {
                fixData(defaultData[item], newData[item]);
            }
        } else {
            if (newData[item] === undefined) {
                newData[item] = defaultData[item];
            }
        }
    }
    return newData;
}

function updatePlayerData(player) {
    let play = player;
    let vers = player.version||-1;
    if (vers < 0) {
        vers = 0;
    }
    player = play;
}

function resetTheFrickingGame() {
    localStorage.setItem(saveID, null);
    document.location.reload(true);
}

function saveTheFrickingGame() {
    try {
        game[currentSave].player = player;
        localStorage.setItem(saveID, JSON.stringify(game));
        return "Game was saved!";
    } catch (e) {
        console.warn("Something went wrong while trying to save the game!!");
        throw e;
    }
}

function reset(what) {
    switch(what) {
        case "prai":
            if (tmp.praiCanDo) {
                player.generators.prai.amount = player.generators.prai.amount.add(tmp.praiPending);
                player.generators.prai.total = player.generators.prai.total.add(tmp.praiPending);
                player.generators.prai.totalInPR2 = player.generators.prai.totalInPR2.add(tmp.praiPending);
                for (let i = 0; i < 4; i++) {
                    updateStart("upg1");
                    updateStart("upg2");
                    updateStart("prai");
                    calcPointsPerSecond();
                    player.generators.upg1.bought = dZero;
                    player.generators.upg2.bought = dZero;
                    player.points = dZero;
                    player.totalPointsInPRai = dZero;
                }
            }
            break;
        case "pr2":
            if (tmp.pr2CanDo) {
                player.generators.pr2.amount = player.generators.pr2.amount.add(1);
                player.generators.pr2.best = Decimal.max(player.generators.pr2.best, player.generators.pr2.amount);
                for (let i = 0; i < 4; i++) {
                    updateStart("upg1");
                    updateStart("upg2");
                    updateStart("prai");
                    updateStart("pr2");
                    calcPointsPerSecond();
                    player.generators.prai.amount = dZero;
                    player.generators.prai.total = dZero;
                    player.generators.prai.totalInPR2 = dZero;
                    player.generators.prai.bestInPR2 = dZero;
                    player.generators.upg1.bought = dZero;
                    player.generators.upg2.bought = dZero;
                    player.points = dZero;
                    player.totalPointsInPRai = dZero;
                }
            }
            break;
        default:
            throw new Error(`uhh i don't think ${what} is resettable`)
    }
}

function calcPointsPerSecond() {
    let i = D(1);
    i = i.mul(player.generators.upg1.effect);
    i = i.mul(player.generators.prai.effect);
    i = i.mul(player.generators.pr2.effect);
    return i;
}

function loadGame() {
    let oldTimeStamp = 0;
    lastFPSCheck = 0;

    resetPlayer();
    game = {
        0: {
            name: "Save #1",
            mode: "normal",
            player: player
        }
    };

    let loadgame = JSON.parse(localStorage.getItem(saveID));
    if (loadgame !== null) {
        game = fixData(game, loadgame);
        player = game[currentSave].player;
        updatePlayerData(player);
    } else {
        currentSave = 0;
        console.log("reset");
    }

    loadVue();

    window.requestAnimationFrame(gameLoop);

    function gameLoop(timeStamp) {
        try {
            otherGameStuffIg.delta = (timeStamp - oldTimeStamp) / 1000;
            fpsList.push(otherGameStuffIg.delta);
            if (timeStamp > lastFPSCheck) {
                lastFPSCheck = timeStamp + 500;
                otherGameStuffIg.FPS = 0;
                for (let i = 0; i < fpsList.length; ++i) {
                    otherGameStuffIg.FPS += fpsList[i];
                }
                otherGameStuffIg.FPS = (fpsList.length / otherGameStuffIg.FPS).toFixed(1);
                fpsList = [];
                // document.getElementById("fps").innerText = `FPS: ${FPS}`;
            }

            let gameDelta = Decimal.mul(otherGameStuffIg.delta, player.timeSpeed).mul(player.setTimeSpeed);
            player.gameTime = player.gameTime.add(gameDelta);
            player.totalTime += otherGameStuffIg.delta;
            otherGameStuffIg.sessionTime += otherGameStuffIg.delta;

            player.pps = calcPointsPerSecond();
            player.points = player.points.add(player.pps.times(gameDelta));
            player.totalPointsInPRai = player.totalPointsInPRai.add(player.pps.times(gameDelta));
            player.totalPoints = player.totalPoints.add(player.pps.times(gameDelta));
            updateAllStart()

            if (timeStamp > lastSave + saveTime) {
                console.log(saveTheFrickingGame());
                lastSave = timeStamp;
            }

        } catch (e) {
            console.error(e);
            console.log("Game saving has been paused. It's likely that your save is broken or the programmer (TearonQ) is an idiot? Don't call them that, though.");
            return;
        }
        // do not change order at all
        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
}

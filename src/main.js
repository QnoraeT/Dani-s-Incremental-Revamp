"use strict";
const saveID = "danidanijr_save_revamp";
const TABS_LIST = [
    {
        get name() { return "Generators" },
        get staticName() { return "gen" },
        get backgroundColor() { return "#999999" },
        get textColor() { return "#000000" },
        get outlineColor() { return "#00000000" },
        get highlightColor() { return "#FFFFFF" },
        if: true
    },
    {
        get name() { return "Options" },
        get staticName() { return "opt" },
        get backgroundColor() { return "#999999" },
        get textColor() { return "#000000" },
        get outlineColor() { return "#00000000" },
        get highlightColor() { return "#FFFFFF" },
        if: true
    },
    {
        get name() { return "Stats" },
        get staticName() { return "stat" },
        get backgroundColor() { return "#999999" },
        get textColor() { return "#000000" },
        get outlineColor() { return "#00000000" },
        get highlightColor() { return "#FFFFFF" },
        if: true
    },
    {
        get name() { return "Achievements" },
        get staticName() { return "ach" },
        get backgroundColor() { return "#999999" },
        get textColor() { return "#000000" },
        get outlineColor() { return "#00000000" },
        get highlightColor() { return "#FFFFFF" },
        if: true
    },
    {
        get name() { return "Kuaraniai" },
        get staticName() { return "kua" },
        get backgroundColor() { return "#3100ff" },
        get textColor() { return "#ffffff" },
        get outlineColor() { return "#7958ff" },
        get highlightColor() { return "#ff81cb" },
        get if() { return player.value.kua.unlocked }
    },
    {
        get name() { return "Colosseum" },
        get staticName() { return "col" },
        get backgroundColor() { return "#af1a00" },
        get textColor() { return "#ffffff" },
        get outlineColor() { return "#ff3600" },
        get highlightColor() { return "#ff9b7f" },
        get if() { return player.value.col.unlocked }
    },
]

const otherGameStuffIg = {
    FPS: 0,
    sessionTime: 0,
    delta: 0
}

let game = Vue.ref({});
let player = Vue.ref({});
const tmp = Vue.ref({});
const tab = [0, 0, 0];
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
    player.value = {
        chapter: 0,
        achievements: [],
        points: c.d0,
        pps: c.d1,
        totalPoints: c.d0,
        totalPointsInPRai: c.d0,
        inChallenge: {}, 
        totalTime: 0, // timespeed doesn't affect this
        gameTime: c.d0, // timespeed will affect this (totalGameTime)
        timeSpeed: c.d1,
        setTimeSpeed: c.d1, // change this if you think the game is going too fast or slow, i won't judge you =P
        version: 0,
        nerf: {
            up1Active: true,
            up2Active: true,
            up3Active: true,
            up1BActive: true,
            up2BActive: true,
            up3BActive: true,
            praiActive: true,
            pr2Active: true,
            kuaActive: {
                kpower: {
                    upgrades: true,
                    effects: true,
                    gain: true
                },
                kshards: {
                    upgrades: true,
                    effects: true,
                    gain: true
                },
                onlyUpgrades: true,
                spUpgrades: true,
                effects: true,
                gain: true
            },
        },
        auto: {
            upg1: false,
            upg2: false,
            upg3: false,
            upg1B: false,
            upg2B: false,
            upg3B: false,
            prai: false,
            pr2: false,
            kua: false,
            kuaUpgrades: false,
        },
        generators: {
            upg1: {
                cost: c.d5,
                target: c.d0,
                effectBase: c.d1_5,
                calculatedEB: c.d1_5,
                costBase: c.d1_55,
                bought: c.d0,
                freeExtra: c.d0,
                effective: c.d0,
                effect: c.d1,
                best: c.d0,
                partB: {
                    cost: c.d5,
                    target: c.d0,
                    effectBase: c.d1_5,
                    calculatedEB: c.d1_5,
                    costBase: c.d1_55,
                    bought: c.d0,
                    freeExtra: c.d0,
                    effective: c.d0,
                    effect: c.d1,
                    best: c.d0
                },
            },
            upg2: {
                cost: c.e3,
                target: c.d0,
                effectBase: c.d1_2,
                calculatedEB: c.d1_2,
                costBase: c.d1_25,
                bought: c.d0,
                freeExtra: c.d0,
                effective: c.d0,
                effect: c.d1,
                best: c.d0,
                partB: {
                    cost: c.e3,
                    target: c.d0,
                    effectBase: c.d1_2,
                    calculatedEB: c.d1_2,
                    costBase: c.d1_25,
                    bought: c.d0,
                    freeExtra: c.d0,
                    effective: c.d0,
                    effect: c.d1,
                    best: c.d0,
                },
            },
            upg3: {
                cost: c.e10,
                target: c.d0,
                effectBase: c.d0_02,
                calculatedEB: c.d0_02,
                bought: c.d0,
                freeExtra: c.d0,
                effective: c.d0,
                effect: c.d0,
                best: c.d0,
                partB: {
                    cost: c.e10,
                    target: c.d0,
                    effectBase: c.d0_02,
                    calculatedEB: c.d0_02,
                    bought: c.d0,
                    freeExtra: c.d0,
                    effective: c.d0,
                    effect: c.d0,
                    best: c.d0,
                },
            },
            prai: {
                amount: c.d0,
                effect: c.d1,
                best: c.d0,
                total: c.d0,
                totalInPR2: c.d0,
                totalInKua: c.d0,
                bestInPR2: c.d0,
                timeInPRai: c.d0,
                times: c.d0
            },
            pr2: {
                amount: c.d0,
                freeExtra: c.d0,
                target: c.d0,
                effect: c.d1,
                best: c.d0
            },
        },
        kua: {
            unlocked: false,
            amount: c.d0,
            total: c.d0,
            best: c.d0,
            timeInKua: c.d0,
            times: c.d0,
            kshards: {
                amount: c.d0,
                total: c.d0,
                best: c.d0,
                upgrades: 0
            },
            kpower: {
                amount: c.d0,
                total: c.d0,
                best: c.d0,
                upgrades: 0
            }
        },
        col: {
            unlocked: false,
            inAChallenge: false,
            completed: {},
            challengeOrder: {chalID: [], layer: []},
            saved: {},
            power: c.d0,
            totalPower: c.d0,
            bestPower: c.d0,
            time: c.d0,
            maxTime: c.d0
        },
        settings: {
            notation: "Mixed Scientific",
            scalingNames: "DistInc",
            showCharacterImgs: true, // likely will not be used
            nameChanges: false, // likely will not be used
            theme: 0,
            background: [],
            // available: "Parallax" "Dots" "ChapterBased" "TabBased" "CharacterBased"
            musicVolume: 0.00, // likely will not be used
            sfxVolume: 0.00, // likely will not be used
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
    player.value.version = player.value.version||-1;
    if (player.value.version < 0) {
        player.value.version = 0;
    }
    if (player.value.version === 0) {

        // player.value.version = 1;
    }
}

function resetTheFrickingGame() {
    localStorage.setItem(saveID, null);
    loadGame();
}

function saveTheFrickingGame() {
    try {
        game.value[currentSave].player = player.value;
        localStorage.setItem(saveID, JSON.stringify(game));
        return "Game was saved!";
    } catch (e) {
        console.warn("Something went wrong while trying to save the game!!");
        throw e;
    }
}

function reset(layer, override) {
    switch(layer) {
        case "prai":
            if (tmp.value.praiCanDo || override) {
                if (!override) {
                    setAchievement(8, tmp.value.praiPending.gte(c.e3));
                    player.value.generators.prai.amount = player.value.generators.prai.amount.add(tmp.value.praiPending);
                    player.value.generators.prai.total = player.value.generators.prai.total.add(tmp.value.praiPending);
                    player.value.generators.prai.totalInPR2 = player.value.generators.prai.totalInPR2.add(tmp.value.praiPending);
                    player.value.generators.prai.totalInKua = player.value.generators.prai.totalInKua.add(tmp.value.praiPending);
                    player.value.generators.prai.times = player.value.generators.prai.times.add(c.d1);
                }

                for (let i = 0; i < 2; i++) {
                    player.value.generators.prai.timeInPRai = c.d0;
                    player.value.generators.upg3.bought = c.d0;
                    player.value.generators.upg2.bought = c.d0;
                    player.value.generators.upg1.bought = c.d0;
                    updateStart("prai");
                    updateStart("upg3");
                    updateStart("upg2");
                    updateStart("upg1");
                    player.value.pps = calcPointsPerSecond();
                    player.value.points = c.d0;
                    player.value.totalPointsInPRai = c.d0;
                }
            }
            break;
        case "pr2":
            if (tmp.value.pr2CanDo || override) {
                if (!override) {
                    player.value.generators.pr2.amount = player.value.generators.pr2.amount.add(1);
                }

                for (let i = 0; i < 2; i++) {
                    player.value.generators.prai.amount = c.d0;
                    player.value.generators.prai.total = c.d0;
                    player.value.generators.prai.totalInPR2 = c.d0;
                    player.value.generators.prai.bestInPR2 = c.d0;
                    updateStart("pr2");
                    reset("prai", true);
                }
            }
            break;
        case "kua":
            if (tmp.value.kuaCanDo || override) {
                if (!override) {
                    setAchievement(11, true);
                    player.value.kua.amount = player.value.kua.amount.add(tmp.value.kuaPending);
                    player.value.kua.total = player.value.kua.total.add(tmp.value.kuaPending);
                    player.value.kua.times = player.value.kua.times.add(c.d1);
                }

                player.value.generators.prai.times = c.d0;
                player.value.kua.timeInKua = c.d0;
                player.value.generators.prai.totalInKua = c.d0;
                if (player.value.achievements.includes(11)) {
                    player.value.generators.prai.amount = c.d10;
                    player.value.generators.prai.total = c.d10;
                    player.value.generators.prai.totalInPR2 = c.d10;
                    player.value.generators.prai.bestInPR2 = c.d10;
                    // not add totalInKua because not counted
                }
                updateKua("kua")
                reset("pr2", true);
            }
            break;
        case "col":
            if (tmp.value.kuaCanDo || override) {
                player.value.kua.amount = c.d0;
                player.value.kua.best = c.d0;
                player.value.kua.total = c.d0;
                player.value.kua.times = c.d0;
                player.value.kua.timeInKua = c.d0;
                player.value.kua.kshards.amount = c.d0;
                player.value.kua.kshards.best = c.d0;
                player.value.kua.kshards.total = c.d0;
                player.value.kua.kshards.upgrades = 0;
                player.value.kua.kpower.amount = c.d0;
                player.value.kua.kpower.best = c.d0;
                player.value.kua.kpower.total = c.d0;
                player.value.kua.kpower.upgrades = 0;
                player.value.auto.upg1 = false;
                player.value.auto.upg2 = false;
                player.value.auto.upg3 = false;
                player.value.auto.prai = false;
                player.value.generators.upg3.partB.bought = c.d0;
                player.value.generators.upg2.partB.bought = c.d0;
                player.value.generators.upg1.partB.bought = c.d0;
                player.value.generators.pr2.best = c.d0;
                player.value.generators.pr2.amount = c.d0;
                updateKua("kua");
                reset("kua", true);
            }
            break;
        default:
            throw new Error(`uhh i don't think ${what} is resettable`)
    }
}

function calcPointsPerSecond() {
    let i = c.d1;
    i = i.mul(player.value.generators.upg1.effect);
    i = i.mul(player.value.generators.upg1.partB.effect);
    i = i.mul(player.value.generators.prai.effect);
    i = i.mul(player.value.generators.pr2.effect);
    if (player.value.achievements.includes(4)) {
        i = i.mul(c.d3);
    }
    if (player.value.achievements.includes(11)) {
        i = i.mul(c.d3);
    }
    if (player.value.achievements.includes(12)) {
        i = i.mul(ACHIEVEMENT_DATA[12].eff);
    }
    if (player.value.achievements.includes(13)) {
        i = i.mul(ACHIEVEMENT_DATA[13].eff);
    }
    if (getKuaUpgrade("p", 3)) {
        i = i.pow(tmp.value.kuaEffects.ptPower);
    } 
    if (getKuaUpgrade("s", 7)) {
        i = i.mul(tmp.value.kuaEffects.pts);
    } 
    return i;
}

let vueLoaded = false;
let runGame = [true, true];

function loadGame() {
    lastFPSCheck = 0;
    let oldTimeStamp = 0;
    resetPlayer();
    game.value = {
        0: {
            name: "Save #1",
            mode: "normal",
            player: player
        }
    };

    let loadgame = JSON.parse(localStorage.getItem(saveID)); 
    if (loadgame !== null) {
        game.value = fixData(game.value, loadgame._value); 
        player.value = game.value[currentSave].player;
        updatePlayerData(player);
    } else {
        currentSave = 0;
        console.log("reset");
    }

    if (!vueLoaded) {
        loadVue();
        vueLoaded = true;
    }

    window.requestAnimationFrame(gameLoop);

    function gameLoop(timeStamp) {
        try {
            let generate;
            otherGameStuffIg.delta = (timeStamp - oldTimeStamp) / 1000;
            if (otherGameStuffIg.delta > 0) {
                fpsList.push(otherGameStuffIg.delta);
                if (timeStamp > lastFPSCheck) {
                    lastFPSCheck = timeStamp + 500;
                    otherGameStuffIg.FPS = 0;
                    for (let i = 0; i < fpsList.length; ++i) {
                        otherGameStuffIg.FPS += fpsList[i];
                    }
                    otherGameStuffIg.FPS = (fpsList.length / otherGameStuffIg.FPS).toFixed(1);
                    fpsList = [];
                }

                let gameDelta = Decimal.mul(otherGameStuffIg.delta, player.value.timeSpeed).mul(player.value.setTimeSpeed);
                player.value.gameTime = player.value.gameTime.add(gameDelta);
                player.value.totalTime += otherGameStuffIg.delta;
                otherGameStuffIg.sessionTime += otherGameStuffIg.delta;

                updateNerf();

                if (player.value.col.inAChallenge) {
                    player.value.col.time = player.value.col.time.sub(gameDelta)
                } else {
                    player.value.col.time = player.value.col.maxTime
                }
                updateAllCol();
                generate = tmp.value.colosseumPowerGeneration.mul(gameDelta);
                player.value.col.power = player.value.col.power.add(generate)
                player.value.col.totalPower = player.value.col.totalPower.add(generate)

                player.value.kua.timeInKua = player.value.kua.timeInKua.add(gameDelta);
                updateAllKua();
                generate = tmp.value.kuaShardGeneration.mul(gameDelta);
                player.value.kua.kshards.amount = player.value.kua.kshards.amount.add(generate);
                player.value.kua.kshards.total = player.value.kua.kshards.total.add(generate);
                generate = tmp.value.kuaPowerGeneration.mul(gameDelta);
                player.value.kua.kpower.amount = player.value.kua.kpower.amount.add(generate);
                player.value.kua.kpower.total = player.value.kua.kpower.total.add(generate);

                player.value.generators.prai.timeInPRai = player.value.generators.prai.timeInPRai.add(gameDelta);
                updateAllStart();
                if (getKuaUpgrade("s", 1) && player.value.auto.prai) {
                    generate = tmp.value.praiPending.mul(gameDelta).mul(c.em4);
                    player.value.generators.prai.amount = player.value.generators.prai.amount.add(generate);
                    player.value.generators.prai.total = player.value.generators.prai.total.add(generate);
                    player.value.generators.prai.totalInPR2 = player.value.generators.prai.totalInPR2.add(generate);
                    player.value.generators.prai.totalInKua = player.value.generators.prai.totalInKua.add(generate);
                }
                player.value.pps = calcPointsPerSecond();
                generate = player.value.pps.mul(gameDelta);
                player.value.points = player.value.points.add(generate);
                player.value.totalPointsInPRai = player.value.totalPointsInPRai.add(generate);
                player.value.totalPoints = player.value.totalPoints.add(generate);
        
                setAchievement(17, player.value.points.gte(c.e24) && player.value.generators.upg1.bought.eq(c.d0) && player.value.generators.upg2.bought.eq(c.d0) && player.value.generators.upg3.bought.eq(c.d0));
                setAchievement(22, player.value.points.gte(c.e80) && player.value.generators.upg1.bought.eq(c.d0) && player.value.generators.upg2.bought.eq(c.d0) && player.value.generators.upg3.bought.eq(c.d0));
                setAchievement(24, player.value.points.gte(c.e90) && player.value.generators.upg1.bought.eq(c.d0) && player.value.generators.upg2.bought.eq(c.d0));

                if (player.value.generators.pr2.best.gte(c.d10)) {
                    player.value.kua.unlocked = true;
                }

                if (player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2)) {
                    player.value.col.unlocked = true;
                }

                if (timeStamp > lastSave + saveTime) {
                    console.log(saveTheFrickingGame());
                    lastSave = timeStamp;
                }

                // misc unimportant stuff

                let k = { upg1: "Upgrade 1", upg2: "Upgrade 2", upg3: "Upgrade 3", praiGain: "PRai Gain", praiEffect: "PRai Effect", pr2: "PR2" }
                for (let i in tmp.value.scaling) {
                    for (let j in tmp.value.scaling[i]) {
                        if (tmp.value.scaling[i][j].res.gte(tmp.value.scaling[i][j].start)) {
                            tmp.value.scaleList[j].push(`${k[i]} - ${format(tmp.value.scaling[i][j].strength.mul(c.e2), 3)}% starting at ${format(tmp.value.scaling[i][j].start, 3)}`)
                        }
                    }
                }
                
                for (let i in tmp.value.softcap) {
                    for (let j in tmp.value.softcap[i]) {
                        if (tmp.value.softcap[i][j].res.gte(tmp.value.softcap[i][j].start)) {
                            tmp.value.softList[j].push(`${k[i]} - ${format(tmp.value.softcap[i][j].strength.mul(c.e2), 3)}% starting at ${format(tmp.value.softcap[i][j].start, 3)}`)
                        }
                    }
                }

                drawing();
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

    const draw = document.querySelector("#canvas");
    const pen = draw.getContext("2d");
    const particles = [];
    let stats = {
        norm: 0
    }
    const drawing = () => {
        draw.width = window.innerWidth;
        draw.height = window.innerHeight;

        stats.norm += otherGameStuffIg.delta;
        if (stats.norm >= 0.1) {
            if (stats.norm >= 10) {
                stats.norm = 0.1;
            }

            for (let atmps = 0; atmps < 10 && stats.norm >= 0.1; atmps++) {
                stats.norm -= 0.1;

                let obj = {
                    type: 0, 
                    dir: (Math.round(Math.random()) - 0.5) * 2,
                    y: Math.random() * 60,
                    maxLife: 2.0 + 1.5 * Math.random(),
                    size: 12 + 8 * Math.random(),
                    defGhost: 32 + 32 * Math.random()
                }

                obj.life = obj.maxLife;
                obj.x = obj.dir === 1 ? -100 : (draw.width + 100);
        
                particles.push(obj);
            }
        }
        // stats.kua += otherGameStuffIg.delta
        // if (stats.kua >= 0.1) {
        //     if (stats.kua >= 10) {
        //         stats.kua = 0.1
        //     }

        //     for (let atmps = 0; atmps < 10 && stats.kua >= 0.1; atmps++) {
        //         stats.kua -= 0.1

        //         let obj = {
        //             type: 1, 
        //             dir: (Math.round(Math.random()) - 0.5) * 2,
        //             y: Math.random() * 60,
        //             maxLife: 2.0 + 1.5 * Math.random(),
        //             size: 12 + 8 * Math.random(),
        //             defGhost: 32 + 32 * Math.random()
        //         }

        //         obj.life = obj.maxLife kuaGain
        //         obj.x = obj.dir === 1 ? element.getBoundingClientRect().x
        
        //         particles.push(obj)
        //     }
        // }

        for (let i = 0; i < particles.length; i++) {
            switch (particles[i].type) {
                case 0:
                    particles[i].life -= otherGameStuffIg.delta
                    if (particles[i].life <= 0) {
                        particles.splice(i, 1);
                        i--;
                        break;
                    }
                    particles[i].x += otherGameStuffIg.delta * (particles[i].dir * (particles[i].life + 1)) * ((1 + 2 * Math.random()) / 3) * 100;
                    particles[i].y += otherGameStuffIg.delta * (4 * (Math.random() - 0.5));
                    particles[i].y = lerp(1 - (0.75 ** otherGameStuffIg.delta), particles[i].y, 30);

                    pen.beginPath();
                    let alpha = particles[i].defGhost * particles[i].life / particles[i].maxLife;
                    pen.fillStyle = `hsla(0, 100%, 100%, ${alpha / 255})`;

                    pen.arc(particles[i].x,
                        particles[i].y,
                        particles[i].size,
                        0,
                        2 * Math.PI);
                    pen.fill();
                    break;
                default:
                    throw new Error(`Particle type ${particles[i].type} is not a valid type :c`);
            }
            // dots[i][4] += Math.random() - 0.5;
            // dots[i][5] += Math.random() - 0.5;
            // dots[i][4] = lerp(1 - (0.9 ** delta), dots[i][4], 0);
            // dots[i][5] = lerp(1 - (0.9 ** delta), dots[i][5], 0);
            // dots[i][1] += dots[i][3] * delta * dots[i][4];
            // dots[i][2] += dots[i][3] * delta * dots[i][5];
    
            // pen.beginPath();
            // let alpha;
            // if (dots[i][0] === 0) {
            //     alpha = 20 + (4 * Math.cos((sessionTime + 11 * i) / 50));
            // } else {
            //     alpha = 160 + (64 * Math.cos((sessionTime + 11 * i) / 50));
            // }
            // pen.fillStyle = `hsla(${sessionTime + (i * (dots[i][0] === 0 ? 1 : 0.1))}, 100%, 50%, ${alpha / 255})`;
            // let j = Math.cos((sessionTime * dots[i][3] + i) / (2 * Math.PI));
            // pen.arc((Math.abs(dots[i][1] % 3800) - 700),
            //     (Math.abs(dots[i][2] % 2400) - 700),
            //     dots[i][0] == 0 ? (300 + 100 * j) : (10 + 4 * j),
            //     0,
            //     2 * Math.PI);
            // pen.fill();
        }
    }
    
}


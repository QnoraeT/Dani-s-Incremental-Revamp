"use strict";
const saveID = "danidanijr_save_revamp";
const TABS_LIST = [
    {
        name: "Generators",
        staticName: "gen" ,
        backgroundColor: "#999999",
        textColor: "#000000",
        outlineColor: "#00000000",
        highlightColor: "#FFFFFF",
        if: true
    },
    {
        name: "Options" ,
        staticName: "opt" ,
        backgroundColor: "#999999",
        textColor: "#000000",
        outlineColor: "#00000000",
        highlightColor: "#FFFFFF",
        if: true
    },
    {
        name: "Stats",
        staticName: "stat",
        backgroundColor: "#999999",
        textColor: "#000000",
        outlineColor: "#00000000",
        highlightColor: "#FFFFFF",
        if: true
    },
    {
        name: "Achievements",
        staticName: "ach",
        backgroundColor: "#999999",
        textColor: "#000000",
        outlineColor: "#00000000",
        highlightColor: "#FFFFFF",
        if: true
    },
    {
        name: "Kuaraniai",
        staticName: "kua",
        backgroundColor: "#3100ff",
        textColor: "#ffffff",
        outlineColor: "#7958ff",
        highlightColor: "#ff81cb",
        get if() { return player.value.kua.unlocked }
    },
    {
        name: "Colosseum",
        staticName: "col",
        backgroundColor: "#af1a00",
        textColor: "#ffffff",
        outlineColor: "#ff3600",
        highlightColor: "#ff9b7f",
        get if() { return player.value.col.unlocked }
    },
    {
        name: "Taxation",
        staticName: "tax",
        backgroundColor: "#b07500",
        textColor: "#ffffff",
        outlineColor: "#d5c000",
        highlightColor: "#ffff7f",
        get if() { return Decimal.gte(player.value.totalPoints, c.inf) }
    },
]

const NEXT_UNLOCKS = {
    pr2: {
        get shown() { return Decimal.gte(player.value.generators.prai.best, c.d3) },
        get done() { return Decimal.gte(player.value.generators.prai.best, c.d10) },
        color: `#ffffff`
    },
    kua: {
        get shown() { return Decimal.gte(player.value.generators.pr2.best, c.d3) },
        get done() { return Decimal.gte(player.value.generators.pr2.best, c.d10) },
        color: `#7958ff`
    },
    col: {
        get shown() { return player.value.kua.kpower.upgrades >= 2 },
        get done() { return Decimal.gte(player.value.kua.amount, c.e2) },
        color: `#ff3600`
    },
    tax: {
        get shown() { return Decimal.gte(player.value.points, c.e250) },
        get done() { return Decimal.gte(player.value.kua.amount, c.inf) },
        color: `#f0d000`
    },
}

const otherGameStuffIg = {
    FPS: 0,
    sessionTime: 0,
    delta: 0
}

let game = Vue.ref({});
let player = Vue.ref({});
const tmp = Vue.ref({});
const tab = Vue.ref({
    currTab: "gen",
    gen: [0],
    opt: [0],
    stat: [0],
    ach: [0],
    kua: [0],
    col: [0, 0],
    tax: [0],
})
let fpsList = [];
let lastFPSCheck = 0;
let lastSave = 0;
let saveTime = 30000;
let currentSave = 0;

function switchTab(isTab, whatTab, index) {
    if (isTab) {
        tab.value.currTab = whatTab
    } else {
        tab.value[currTab][index] = whatTab
    }
    // tab[id] = t;
    // if (id >= tab.length) {
    //     throw new Error("tried to tab out of bounds");
    // }
    // // set this to 0 because we don't want anyone peeking into other layers' unaccessible areas early (e.g. Kua Blessings while still in start of Col)
    // for (let TA = id + 1; TA <= (tab.length - 1); ++TA) {
    //     tab[TA] = 0;
    // }
}

function resetPlayer() {
    player.value = {
        chapter: 0,
        achievements: [],
        
        pps: c.d1,
        points: c.d0,
        totalPoints: c.d0,
        totalPointsInPRai: c.d0,
        bestPointsInCol: c.d0,
        totalPointsInTax: c.d0,

        inChallenge: {}, 
        totalTime: 0, // timespeed doesn't affect this

        gameTime: c.d0, // timespeed will affect this (totalGameTime)
        timeSpeed: c.d1,
        setTimeSpeed: c.d1, // change this if you think the game is going too fast or slow, i won't judge you =P

        version: 0,
        nerf: {
            upgradesActive: [true, true, true, true, true, true],
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
            upgrades: [false, false, false, false, false, false],
            prai: false,
            pr2: false,
            kua: false,
            kuaUpgrades: false,
        },
        generators: {
            upgrades: [
                { bought: c.d0, best: c.d0 },
                { bought: c.d0, best: c.d0 },
                { bought: c.d0, best: c.d0 },
                { bought: c.d0, best: c.d0 },
                { bought: c.d0, best: c.d0 },
                { bought: c.d0, best: c.d0 },
            ],
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
            completedAll: false,
            saved: {},
            power: c.d0,
            totalPower: c.d0,
            bestPower: c.d0,
            time: c.d0,
            maxTime: c.d0,
            research: {
                xpTotal: [],
                enabled: []
            }
        },
        tax: {
            unlocked: false,
            taxed: c.d0
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

function updatePlayerData(player) {
    player.value.version = player.value.version||-1;
    if (player.value.version < 0) {
        player.value.version = 0;
    }
    if (player.value.version === 0) {
        player.value.totalPointsInTax = c.d0
        // player.value.version = 1;
    }
    if (player.value.version === 1) {

        // player.value.version = 2;
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
                    player.value.generators.prai.amount = Decimal.add(player.value.generators.prai.amount, tmp.value.praiPending);
                    player.value.generators.prai.total = Decimal.add(player.value.generators.prai.total, tmp.value.praiPending);
                    player.value.generators.prai.totalInPR2 = Decimal.add(player.value.generators.prai.totalInPR2, tmp.value.praiPending);
                    player.value.generators.prai.totalInKua = Decimal.add(player.value.generators.prai.totalInKua, tmp.value.praiPending);
                    player.value.generators.prai.times = Decimal.add(player.value.generators.prai.times, c.d1);
                }

                for (let i = 0; i < 2; i++) {
                    player.value.generators.prai.timeInPRai = c.d0;
                    player.value.generators.upgrades[0].bought = c.d0;
                    player.value.generators.upgrades[1].bought = c.d0;
                    player.value.generators.upgrades[2].bought = c.d0;
                    updateStart("prai");
                    updateStart(2);
                    updateStart(1);
                    updateStart(0);
                    player.value.pps = calcPointsPerSecond();
                    player.value.points = c.d0;
                    player.value.totalPointsInPRai = c.d0;
                }
            }
            break;
        case "pr2":
            if (tmp.value.pr2CanDo || override) {
                if (!override) {
                    player.value.generators.pr2.amount = Decimal.add(player.value.generators.pr2.amount, c.d1);
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
                    player.value.kua.amount = Decimal.add(player.value.kua.amount, tmp.value.kuaPending);
                    player.value.kua.total = Decimal.add(player.value.kua.total, tmp.value.kuaPending);
                    player.value.kua.times = Decimal.add(player.value.kua.times, c.d1);
                }

                player.value.generators.prai.times = c.d0;
                player.value.kua.timeInKua = c.d0;
                player.value.generators.prai.totalInKua = c.d0;
                player.value.generators.prai.amount = c.d0;
                player.value.generators.prai.total = c.d0;
                player.value.generators.prai.totalInPR2 = c.d0;
                player.value.generators.prai.bestInPR2 = c.d0;
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
                player.value.auto.upgrades[0] = false;
                player.value.auto.upgrades[1] = false;
                player.value.auto.upgrades[2] = false;
                player.value.auto.prai = false;
                player.value.generators.upgrades[3].bought = c.d0;
                player.value.generators.upgrades[4].bought = c.d0;
                player.value.generators.upgrades[5].bought = c.d0;
                player.value.generators.pr2.best = c.d0;
                player.value.generators.pr2.amount = c.d0;
                player.value.bestPointsInCol = c.d0;
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
    i = i.mul(tmp.value.upgrades[0].effect);
    i = i.mul(tmp.value.upgrades[3].effect);
    i = i.mul(player.value.generators.prai.effect);
    i = i.mul(player.value.generators.pr2.effect);
    if (player.value.achievements.includes(4)) {
        i = i.mul(c.d2);
    }
    if (player.value.achievements.includes(11)) {
        i = i.mul(c.d2);
    }
    if (player.value.achievements.includes(12)) {
        i = i.mul(ACHIEVEMENT_DATA[12].eff);
    }
    if (player.value.achievements.includes(13)) {
        i = i.mul(ACHIEVEMENT_DATA[13].eff);
    }
    if (player.value.achievements.includes(25)) {
        i = i.mul(ACHIEVEMENT_DATA[25].eff);
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

function initTmp() {
    tmp.value.scaleSoftcapNames = { points: "Points", upg1: "Upgrade 1", upg2: "Upgrade 2", upg3: "Upgrade 3", upg4: "Upgrade 4", upg5: "Upgrade 5", upg6: "Upgrade 6", praiGain: "PRai Gain", praiEffect: "PRai Effect", pr2: "PR2" };
    tmp.value.upgrades = [] 
    for (let i = player.value.generators.upgrades.length - 1; i >= 0; i--) {
        tmp.value.upgrades.push({})
        updateScaling(`upg${i + 1}`);
        updateSoftcap(`upg${i + 1}`);
    }
    updateSoftcap("points");

}

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
        game.value = loadgame._value; 
        player.value = game.value[currentSave].player;
        updatePlayerData(player);
    } else {
        currentSave = 0;
        console.log("reset");
    }

    // init tmp
    initTmp()
    
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
                player.value.gameTime = Decimal.add(player.value.gameTime, gameDelta);
                player.value.totalTime += otherGameStuffIg.delta;
                otherGameStuffIg.sessionTime += otherGameStuffIg.delta;

                updateNerf();
                updateAllTax(gameDelta);
                updateAllCol(gameDelta);
                updateAllKua(gameDelta);
                updateAllStart(gameDelta);

                updateSoftcap("points")
                player.value.pps = calcPointsPerSecond();
                generate = Decimal.mul(player.value.pps, gameDelta);

                // i hate that i have to do it here
                tmp.value.softcap.points[0].red = `/${format(c.d1, 2)}`
                if (Decimal.add(player.value.points, generate).gte(tmp.value.softcap.points[0].start.pow10())) {
                    let oldGen = generate;
                    let oldPts = Decimal.max(player.value.points, 1);
                    let newPts = 
                        scale(
                            scale(
                                oldPts.log10(), 0.2, true, tmp.value.softcap.points[0].start, tmp.value.softcap.points[0].strength, c.d0_8
                            )
                            .pow10().add(generate).log10(), 0.2, false, tmp.value.softcap.points[0].start, tmp.value.softcap.points[0].strength, c.d0_8
                        )
                        .pow10()
            
                    generate = newPts.sub(oldPts).max(tmp.value.softcap.points[0].start.pow10())
                    player.value.pps = generate.div(gameDelta)
                    tmp.value.softcap.points[0].red = `/${format(Decimal.div(oldGen, generate), 2)}`
                }

                player.value.points = Decimal.add(player.value.points, generate);
                player.value.totalPointsInPRai = Decimal.add(player.value.totalPointsInPRai, generate);
                player.value.totalPoints = Decimal.add(player.value.totalPoints, generate);
                player.value.bestPointsInCol = Decimal.max(player.value.bestPointsInCol, player.value.points);

                setAchievement(17, Decimal.gte(player.value.points, c.e24) && Decimal.eq(player.value.generators.upgrades[0].bought, c.d0) && Decimal.eq(player.value.generators.upgrades[1].bought, c.d0) && Decimal.eq(player.value.generators.upgrades[2].bought, c.d0));
                setAchievement(22, Decimal.gte(player.value.points, c.e80) && Decimal.eq(player.value.generators.upgrades[0].bought, c.d0) && Decimal.eq(player.value.generators.upgrades[1].bought, c.d0) && Decimal.eq(player.value.generators.upgrades[2].bought, c.d0));
                setAchievement(24, Decimal.gte(player.value.points, c.e33) && Decimal.eq(player.value.generators.upgrades[0].bought, c.d0) && Decimal.eq(player.value.generators.upgrades[1].bought, c.d0));
                setAchievement(25, Decimal.gte(player.value.points, c.e260) && Decimal.lt(player.value.kua.timeInKua, 5));

                if (Decimal.gte(player.value.generators.pr2.best, c.d10)) {
                    player.value.kua.unlocked = true;
                }

                if (player.value.kua.kpower.upgrades >= 2 && Decimal.gte(player.value.kua.amount, c.e2)) {
                    player.value.col.unlocked = true;
                }

                if (Decimal.gte(player.value.points, c.inf)) {
                    player.value.tax.unlocked = true;
                }

                if (timeStamp > lastSave + saveTime) {
                    console.log(saveTheFrickingGame());
                    lastSave = timeStamp;
                }

                // misc unimportant stuff
                for (let i in tmp.value.scaling) {
                    for (let j in tmp.value.scaling[i]) {
                        if (Decimal.gte(tmp.value.scaling[i][j].res, tmp.value.scaling[i][j].start)) {
                            tmp.value.scaleList[j].push(`${tmp.value.scaleSoftcapNames[i]} - ${format(tmp.value.scaling[i][j].strength.mul(c.e2), 3)}% starting at ${format(tmp.value.scaling[i][j].start, 3)}`);
                        }
                    }
                }
                
                for (let i in tmp.value.softcap) {
                    for (let j in tmp.value.softcap[i]) {
                        if (Decimal.gte(tmp.value.softcap[i][j].res, tmp.value.softcap[i][j].start)) {
                            tmp.value.softList[j].push(`${tmp.value.scaleSoftcapNames[i]} - ${format(tmp.value.softcap[i][j].strength.mul(c.e2), 3)}% starting at ${format(tmp.value.softcap[i][j].start, 3)} (${tmp.value.softcap[i][j].red})`);
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


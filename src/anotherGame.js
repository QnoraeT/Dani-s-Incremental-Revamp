"use strict";

function fixedMod(x, d) {
    return ((x % d) + d) % d;
}

const TICKRATE = 33;

const el = id => document.getElementById(id);

try {
    clearInterval(INTERVALYUM);
} catch {
    console.log(`cannot clear intervalyum`);
}

let INTERVALYUM;

try {
    INTERVALYUM = setInterval(doThing, TICKRATE);
} catch {
    console.log(`cannot set intervalyum`);
}

try {
    if (player.hp === undefined) {
        var player = {};
        setPlayer();
    }
} catch {
    var player = {};
    setPlayer();
}

const abbSuffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg"];
const abbExp = 1e66;

function format(num, pv = 0, epv = 3) {
    if (num < 0) { return "-" + format(-num, pv, epv); }
    if (Math.abs(num) <= 1e-15) { return (0).toFixed(pv); }
    if (!Number.isFinite(num)) return "Infinity";
    if (Number.isNaN(num)) return "NaN";
    if (num < 0.001) {
        return "1 / " + format(1 / num, pv, epv);
    } else if (num < 1e6) {
        return num.toFixed(pv).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    } else if (num < abbExp) {
        let abb = Math.floor(Math.log10(num) / 3.0000001);
        return (num / (10 ** (3.0000001 * abb))).toFixed(epv) + " " + abbSuffixes[abb];
    } else {
        return (10 ** (Math.log10(num) % 1)).toFixed(epv) + "e" + Math.floor(Math.log10(num))
    }
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

function start() {
    document.body.style['background-color'] = '#000';
    document.body.innerHTML = `
    <div style="margin-left: auto; margin-right: auto; color: #fff; display: flex; justify-content: center; flex-direction: column;">
        <div id="topInfo" style="background-color: #111; border: 0.4vw solid #222; width: 80vw; height: 40vw; display: flex; justify-content: center; align-items: center;">

        </div>
        <div id="enemySelection" style="background-color: #111; border: 0.4vw solid #222; width: 80vw; height: 30vw; display: flex; flex-wrap: wrap; justify-content: center; align-items: center;">

        </div>
        <div id="inBattle" style="background-color: #111; border: 0.4vw solid #222; width: 80vw; height: 6vw; display: flex; justify-content: center;">
            <div onclick="leaveBattle()" id="leaveBattle" style="display: flex; justify-content: center; align-items: center; color: #fff; font-size: 2vw; text-align: center; background-color: #111; border: 0.4vw solid #222; width: 16vw; height: 6vw;">
                <b>Leave</b>
            </div>
            <div onclick="toggleBattle()" id="toBattle" style="display: flex; justify-content: center; align-items: center; color: #fff; font-size: 2vw; text-align: center; background-color: #111; border: 0.4vw solid #222; width: 16vw; height: 6vw;">

            </div>
            <div onclick="rerollBattle()" id="rerollBattle" style="display: flex; justify-content: center; align-items: center; color: #fff; font-size: 2vw; text-align: center; background-color: #111; border: 0.4vw solid #222; width: 16vw; height: 6vw;">
                <b>Reroll</b>
            </div>
        </div>
        <div id="battleRewards" style="background-color: #111; border: 0.4vw solid #222; width: 80vw; height: 25vw; display: flex; flex-wrap: wrap; align-content: center; justify-content: center;">
            
        </div>
    </div>
    `
    let table = '';
    for (let i = 0; i < enemyList.length; i++) {
        let enemy = enemyList[i];
        table += `
        <div id="enemySelect${enemy.id}" onclick="enterEnemy(${enemy.id})" style="text-align: center; background-color: #111; border: 0.4vw solid #222; width: 14vw; height: 12vw; font-size: 1.5vw">
            <h3>${enemy.name}</h3>
        </div>
        `
    }
    el('enemySelection').innerHTML = table;

    table = ''
    for (let i = 0; i < 2; i++) {
        let item = ['player', 'enemy'][i]
        let name = ``
        let xp = ``
        let invbl = ``
        if (item === 'player') {
            xp = `
            <div id="${item}XPBar" style="width: 15vw; height: 0.8vw; border: 0.3vw solid #cc0; margin-bottom: 0.2vw;">
                <div id="${item}XPBar1" style="position: relative; background-color: #440; height: 100%; z-index: 1;"></div>
                <div id="${item}XPBar2" style="position: relative; background-color: #ff0; top: -100%; height: 100%; z-index: 2;"></div>
            </div>
            <div id="${item}HPBarAB" style="width: 20vw; height: 1vw; border: 0.3vw solid #848; margin-bottom: 0.2vw;">
                <div id="${item}HPBarAB1" style="position: relative; background-color: #424; height: 100%; z-index: 1;"></div>
                <div id="${item}HPBarAB2" style="transition-duration: 0.2s; background-color: #f8f; position: relative; top: -100%; height: 100%; z-index: 2;"></div>
            </div>
            <div id="${item}SpeedBarAB" style="width: 20vw; height: 1vw; border: 0.3vw solid #ccc; margin-bottom: 0.2vw;">
                <div id="${item}SpeedBarAB1" style="position: relative; background-color: #444; height: 100%; z-index: 1;"></div>
                <div id="${item}SpeedBarAB2" style="transition-duration: 0.2s; position: relative; background-color: #fff; top: -100%; height: 100%; z-index: 2;"></div>
            </div>
            `
            name = `<span style="color: #ff0; font-size: 1.4vw">Level: <b><span id="${item}Level" style="font-size: 1.8vw">level</span></b> <span id="${item}XP">(xp / xp)</span></span>`

            invbl = `<span id="invBlHPT" style="color: #f8f; font-size: 2vw">HP: <b><span id="invBlHP" style="font-size: 2.5vw">health</span></b> / <span id="invBlMaxHP">max health</span> (<span id="invBlRegen">regen</span>/s)<br></span>`
        }
        table += `
        <div id="${item}Info" style="padding: 1vw; background-color: #111; border: 0.4vw solid #222; width: 35vw; height: 30vw;">
            <b><span id="${item}Name" style="font-size: 3vw; margin-bottom: 0.5vw;">example name</span></b>${name}
            <div>
                ${invbl}
                <span id="playerHPT" style="color: #f00; font-size: 2vw">HP: <b><span id="${item}HP" style="font-size: 2.5vw">health</span></b> / <span id="${item}MaxHP">max health</span> (<span id="${item}Regen">regen</span>/s)</span>
            </div>
            <div id="${item}Bars" style="display: flex; flex-direction: column;">
                ${xp}
                <div id="${item}HPBar" style="width: 20vw; height: 1vw; margin-bottom: 0.2vw;">
                    <div id="${item}HPBar1" style="position: relative; height: 100%; z-index: 1;"></div>
                    <div id="${item}HPBar2" style="transition-duration: 0.2s; position: relative; top: -100%; height: 100%; z-index: 2;"></div>
                </div>
                <div id="${item}SpeedBar" style="width: 20vw; height: 1vw; border: 0.3vw solid #ccc; margin-bottom: 0.2vw;">
                    <div id="${item}SpeedBar1" style="position: relative; background-color: #444; height: 100%; z-index: 1;"></div>
                    <div id="${item}SpeedBar2" style="transition-duration: 0.2s; position: relative; background-color: #fff; top: -100%; height: 100%; z-index: 2;"></div>
                </div>
            </div>
            <div id="${item}Stats" style="display: flex; flex-direction: column; font-size: 1.4vw;">
                <span style="color: #f80;">ATK: <b><span id="${item}StatsATK" style="font-size: 1.8vw">atk</span></b></span>
                <span style="color: #0f0;">DEF: <b><span id="${item}StatsDEF" style="font-size: 1.8vw">def</span></b></span>
                <span style="color: #fff;">SPD: <b><span id="${item}StatsSPD" style="font-size: 1.8vw">speed</span></b>s</span>
                <span style="color: #ff0;" id="${item}Crit">Crit: <b><span id="${item}StatsCrit1-1" style="font-size: 1.8vw">crit%</span></b>%, <b><span id="${item}StatsCrit1-2" style="font-size: 1.8vw">critX</span></b>x</span>
                <span style="color: #80f;" id="${item}Poison">Poison: <b><span id="${item}StatsPsn1" style="font-size: 1.8vw">psn%</span></b>%, <b><span id="${item}StatsPsn2" style="font-size: 1.8vw">psnDmg</span></b>/s, <b><span id="${item}StatsPsn3" style="font-size: 1.8vw">psnR</span></b>x resistance</span>
                <span style="color: #f40;" id="${item}Burn">Burn: <b><span id="${item}StatsBrn1" style="font-size: 1.8vw">Brn%</span></b>%, <b><span id="${item}StatsBrn2" style="font-size: 1.8vw">BrnDmg</span></b>/s, <b><span id="${item}StatsBrn3" style="font-size: 1.8vw">BrnR</span></b>x resistance</span>
                <span style="color: #800;" id="${item}Bleed">Bleed: <b><span id="${item}StatsBld1" style="font-size: 1.8vw">Bld%</span></b>%, <b><span id="${item}StatsBld2" style="font-size: 1.8vw">BldDmg</span></b>%/s, <b><span id="${item}StatsBld3" style="font-size: 1.8vw">BldR</span></b>x resistance</span>
                <span style="color: #888;" id="${item}Slow">Slow: <b><span id="${item}StatsSlow1" style="font-size: 1.8vw">slow%</span></b>%, <b><span id="${item}StatsSlow2" style="font-size: 1.8vw">slowEff</span></b>x, <b><span id="${item}StatsSlow3" style="font-size: 1.8vw">slowL</span></b>s, <b><span id="${item}StatsSlow4" style="font-size: 1.8vw">slowR</span></b>x resistance</span>
                <span style="color: #fff;" id="${item}Block">Block: <b><span id="${item}StatsBlock1" style="font-size: 1.8vw">block%</span></b>%, <b><span id="${item}StatsBlock2" style="font-size: 1.8vw">blockX</span></b>x</span>
                <span style="color: #0ff;" id="${item}Counter">Counter: <b><span id="${item}StatsCounter1" style="font-size: 1.8vw">Counter%</span></b>%, <b><span id="${item}StatsCounter2" style="font-size: 1.8vw">CounterX</span></b>x</span>
                <span style="color: #f8c;" id="${item}HitRegen">Recover: <b><span id="${item}StatsHitRegen1" style="font-size: 1.8vw">HitRegen%</span></b>%, <b><span id="${item}StatsHitRegen2" style="font-size: 1.8vw">HitRegenEff</span></b>/s, <b><span id="${item}StatsHitRegen3" style="font-size: 1.8vw">HitRegenL</span></b>s</span>
                <span style="color: #f08;" id="${item}Hug">Hug: <b><span id="${item}StatsHug1" style="font-size: 1.8vw">Hug%</span></b>%, <b>-<span id="${item}StatsHug2" style="font-size: 1.8vw">HugEff</span></b>%, <b><span id="${item}StatsHug3" style="font-size: 1.8vw">HugL</span></b>s, <b><span id="${item}StatsHug4" style="font-size: 1.8vw">HugR</span></b>x resistance</span>
            </div>
        </div>
        `
        console.log(table)
    }
    el('topInfo').innerHTML = table
}

let started = false;

function setPlayer() {
    player = {
        time: 0,
        name: "Player",
        xp: 0.1,
        dispXP: 0,
        level: 1,
    
        hp: 20,
        maxhp: 20,
        atk: 3,
        def: 1,
        speed: 0.2,
        progress: 0,
        crit: [0, 2],
        alive: true,
        special: {
            poison: [0, 1, 1],
            bleed: [0, 1, 1],
            burn: [0, 0, 1],
            slow: [0, 1, 1, 1],
            block: [0, 0.5],
            counter: [0, 0.5],
            hitRegen: [0, 1, 1],
            hug: [0, 0, 0, 1]
        },
        status: [],
    
        altBli: {
            hp: 20,
            progress: 0,
            alive: true
        },
    
        state: 0,
    
        stage: -1,
        difficulty: 0,
        defeated: [0, 0, 0, 0, 0, 0, 0, 0],
    
        zone: [],
    
        rewards: {
            hp: 0,
            regen: 0,
            atk: 0,
            def: 0,
            speed: 0,
            divSpeed: 1, // penalty
            critP: 0,
            critD: 0,
            psnP: 0,
            psnD: 0,
            psnR: 0,
            burnP: 0,
            burnD: 0,
            burnR: 0,
            blockP: 0,
            blockD: 2,
            invBAlly: 0,
        },
    
        enemy: {
            name: 'lmao',
            hp: 20,
            maxhp: 20,
            atk: 3,
            def: 1,
            speed: 0.2,
            progress: 0,
            crit: [0, 2],
            special: {
                poison: [0, 0, 1],
                bleed: [0, 0, 1],
                burn: [0, 0, 1],
                slow: [0, 0, 0, 1],
                block: [0, 1],
                counter: [0, 0],
                hitRegen: [0, 0, 0],
                hug: [0, 0, 0, 1],
            },
            status: [],
        }
    }
}

const enemyList = [
    { id: 0, type: 0, get when() { return true }, name: "Basic Slime", stats: { hp: 10, atk: 3, def: 2, speed: 0.4, crit: [0.04, 2]}, 
    zone: { 
        size: 40,
        table: [
            { type: ["hp", 0],  amt: 0.5,  rare:  3 }, 
            { type: ["atk", 0], amt: 0.1,  rare:  3 }, 
            { type: ["def", 0], amt: 0.1,  rare:  2 }, 
            { type: ["xp", 1],  amt: 3,    every: 20 }
        ] 
    } },

    { id: 1, type: 1, get when() { return true }, name: "Blighteon", 
    stats: { hp: 40, atk: 5, def: 5, speed: 0.125, crit: [0.125, 1.5], 
        special: {
            poison: [0.5, 4.0, 1.5]
        }
    }, reward: [
        ["divSpeed", 0.01], 
        ["hp", 0.2], 
        ["def", 0.1], 
        ["psnP", 0.0025], 
        ["psnD", 0.19], 
        ["xp", 2.5]
    ], cap: 100 },

    { id: 2, type: 0, get when() { return true }, name: "Paudin", stats: { hp: 12, atk: 2, def: 4, speed: 1.25, crit: [0.125, 1.5], special: {
        slow: [0.2, 2, 1.5, 1],
    }}, 
    zone: { 
        size: 100,
        table: [
            { type: ["atk", 0],   amt: 0.1,   rare:  3 }, 
            { type: ["hp", 0],    amt: 0.2,   rare:  2 }, 
            { type: ["def", 0],   amt: 0.1,   rare:  2 }, 
            { type: ["regen", 0], amt: 0.02,  rare:  1 }, 
            { type: ["xp", 1],    amt: 5,     every: 20 },
            { type: ["speed", 1], amt: 0.025, every: 50 }
        ] 
    } },

    { id: 3, type: 0, get when() { return true }, name: "Spriat", stats: { hp: 3, atk: 7.5, def: 20, speed: 1, crit: [0.5, 2]}, 
    zone: { 
        size: 40,
        table: [
            { type: ["atk", 0],   amt: 0.1,    rare:  15 }, 
            { type: ["def", 0],   amt: 0.25,   rare:  5  }, 
            { type: ["critP", 0], amt: 0.0001, rare:  5  }, 
            { type: ["speed", 0], amt: 0.01,   rare:  4  }, 
            { type: ["xp", 1],    amt: 6,      every: 20 }
        ] 
    } },

    { id: 4, type: 0, get when() { return true }, name: "A bunch of bees", stats: { hp: 100, atk: 2, def: 0, speed: 8, crit: [0.05, 3], special: {
        slow: [0.5, 1.5, 0.2, 1],
        poison: [0.1, 1, 1]
    }}, 
    zone: { 
        size: 40,
        table: [
            { type: ["def", 0],   amt: 0.02,   rare:  3  }, 
            { type: ["regen", 0], amt: 0.04,   rare:  2  }, 
            { type: ["speed", 0], amt: 0.025,  rare:  2  }, 
            { type: ["psnR", 0],  amt: 0.01,   rare:  1  }, 
            { type: ["xp", 1],    amt: 8,      every: 10 },
            { type: ["psnD", 1],  amt: 0.2,    every: 20 }
        ] 
    } },

    { id: 5, type: 1, get when() { return true }, name: "Berserk Aurora", 
    stats: { hp: 625, atk: 85, def: 55, speed: 1/2.4, crit: [0.125, 1.5], 
        special: {
            bleed: [0.3, 0.025, 1],
            burn: [0.5, 30, 3],
        }
    }, reward: [
        ["atk", 30], 
        ["burnP", 0.1],
        ["burnD", 25],
        ["critD", 0.5],
        ["xp", 85]
    ], cap: 1 },

    { id: 6, type: 1, get when() { return true }, name: "Inverse Blighteon", 
    stats: { hp: 4000, atk: 120, def: 150, speed: 1/3, crit: [0.125, 1.5], regen: 20, 
        special: {
            hitRegen: [1.0, 40.0, 2.0],
            hug: [0.5, 0.5, 2.0, 1.0],
            poison: [1.0, 50.0, 3.0]
        }
    }, reward: [
        ["hp", 100],
        ["regen", 15], 
        ["def", 75],
        ["xp", 150],
        ["psnP", 0.15], 
        ["psnD", 20], 
        ["psnR", 0.5], 
        ["invBAlly", 1],
    ], cap: 1 },

    { id: 7, type: 1, get when() { return true }, name: "Kyron Skyler Clones", 
    stats: { hp: 350, atk: 75, def: 100, speed: 0.75, crit: [0.04, 3], 
        special: {
            block: [0.5, 0.5],
            counter: [0.2, 1.0],
            slow: [0.2, 1.5, 2.0, 1.0],
            bleed: [0.2, 0.025, 1.0]
        }
    }, reward: [
        ["hp", 1],
        ["speed", 0.005],
        ["blockP", 0.001],
        ["critP", 0.0004],
        ["xp", 10]
    ], cap: 250 },
]

function isUndefined(value) {
    return value === undefined;
}

function rerollBattle() {
    let s = player.stage;
    leaveBattle();
    enterEnemy(s);
}

function enterEnemy(id) {
    player.stage = id;
    player.enemy.name = enemyList[id].name;
    player.enemy.hp = enemyList[id].stats.hp;
    player.enemy.maxhp = enemyList[id].stats.hp;
    player.enemy.atk = enemyList[id].stats.atk;
    player.enemy.def = enemyList[id].stats.def;
    player.enemy.speed = enemyList[id].stats.speed;
    player.enemy.regen = enemyList[id].stats.regen ?? 0;
    player.enemy.crit[0] = enemyList[id].stats.crit[0];
    player.enemy.crit[1] = enemyList[id].stats.crit[1];
    if (isUndefined(enemyList[id].stats.special)) {
        player.enemy.special = {
            poison: [0, 0, 1],
            bleed: [0, 0, 1],
            burn: [0, 0, 1],
            slow: [0, 0, 0, 1],
            block: [0, 1],
            counter: [0, 0],
            hitRegen: [0, 0, 0],
            hug: [0, 0, 0, 1],
        }
    } else {
        player.enemy.special.poison[0]   = isUndefined(enemyList[id].stats.special.poison)   ? 0 : (enemyList[id].stats.special.poison[0] ?? 0); // poisonChance
        player.enemy.special.poison[1]   = isUndefined(enemyList[id].stats.special.poison)   ? 0 : (enemyList[id].stats.special.poison[1] ?? 0); // poisonStrength
        player.enemy.special.poison[2]   = isUndefined(enemyList[id].stats.special.poison)   ? 1 : (enemyList[id].stats.special.poison[2] ?? 0); // poisonResistance
        player.enemy.special.bleed[0]    = isUndefined(enemyList[id].stats.special.bleed)    ? 0 : (enemyList[id].stats.special.bleed[0] ?? 0); // bleedChance
        player.enemy.special.bleed[1]    = isUndefined(enemyList[id].stats.special.bleed)    ? 0 : (enemyList[id].stats.special.bleed[1] ?? 0); // bleedStrength
        player.enemy.special.bleed[2]    = isUndefined(enemyList[id].stats.special.bleed)    ? 1 : (enemyList[id].stats.special.bleed[2] ?? 0); // bleedResistance
        player.enemy.special.burn[0]     = isUndefined(enemyList[id].stats.special.burn)     ? 0 : (enemyList[id].stats.special.burn[0] ?? 0);
        player.enemy.special.burn[1]     = isUndefined(enemyList[id].stats.special.burn)     ? 0 : (enemyList[id].stats.special.burn[1] ?? 0);
        player.enemy.special.burn[2]     = isUndefined(enemyList[id].stats.special.burn)     ? 1 : (enemyList[id].stats.special.burn[2] ?? 0);
        player.enemy.special.slow[0]     = isUndefined(enemyList[id].stats.special.slow)     ? 0 : (enemyList[id].stats.special.slow[0] ?? 0);
        player.enemy.special.slow[1]     = isUndefined(enemyList[id].stats.special.slow)     ? 0 : (enemyList[id].stats.special.slow[1] ?? 0);
        player.enemy.special.slow[2]     = isUndefined(enemyList[id].stats.special.slow)     ? 0 : (enemyList[id].stats.special.slow[2] ?? 0);
        player.enemy.special.slow[3]     = isUndefined(enemyList[id].stats.special.slow)     ? 1 : (enemyList[id].stats.special.slow[3] ?? 0);
        player.enemy.special.block[0]    = isUndefined(enemyList[id].stats.special.block)    ? 0 : (enemyList[id].stats.special.block[0] ?? 0);
        player.enemy.special.block[1]    = isUndefined(enemyList[id].stats.special.block)    ? 0 : (enemyList[id].stats.special.block[1] ?? 0);
        player.enemy.special.counter[0]  = isUndefined(enemyList[id].stats.special.counter)  ? 0 : (enemyList[id].stats.special.counter[0] ?? 0);
        player.enemy.special.counter[1]  = isUndefined(enemyList[id].stats.special.counter)  ? 0 : (enemyList[id].stats.special.counter[1] ?? 0);
        player.enemy.special.hitRegen[0] = isUndefined(enemyList[id].stats.special.hitRegen) ? 0 : (enemyList[id].stats.special.hitRegen[0] ?? 0);
        player.enemy.special.hitRegen[1] = isUndefined(enemyList[id].stats.special.hitRegen) ? 0 : (enemyList[id].stats.special.hitRegen[1] ?? 0);
        player.enemy.special.hitRegen[2] = isUndefined(enemyList[id].stats.special.hitRegen) ? 1 : (enemyList[id].stats.special.hitRegen[2] ?? 0);
        player.enemy.special.hug[0]      = isUndefined(enemyList[id].stats.special.hug)      ? 0 : (enemyList[id].stats.special.hug[0] ?? 0);
        player.enemy.special.hug[1]      = isUndefined(enemyList[id].stats.special.hug)      ? 0 : (enemyList[id].stats.special.hug[1] ?? 0);
        player.enemy.special.hug[2]      = isUndefined(enemyList[id].stats.special.hug)      ? 0 : (enemyList[id].stats.special.hug[2] ?? 0);
        player.enemy.special.hug[3]      = isUndefined(enemyList[id].stats.special.hug)      ? 1 : (enemyList[id].stats.special.hug[3] ?? 0);
    }

    player.zone = [];
    if (enemyList[id].type === 0) {
        let total = 0;

        for (let i = 0; i < enemyList[id].zone.table.length; i++) {
            if (enemyList[id].zone.table[i].type[1] === 0) {
                total += enemyList[id].zone.table[i].rare;
            }
        }

        for (let i = 0; i < enemyList[id].zone.size; i++) {
            let rand = Math.random();
            let acc = total;
            let current
            for (let j = 0; j < enemyList[id].zone.table.length; j++) {
                if (enemyList[id].zone.table[j].type[1] === 1) {
                    if (i % enemyList[id].zone.table[j].every === 0) {
                        current = enemyList[id].zone.table[j];
                    }
                } 
                if (enemyList[id].zone.table[j].type[1] === 0) {
                    if (rand <= acc / total) {
                        current = enemyList[id].zone.table[j];
                    } 
                    acc -= enemyList[id].zone.table[j].rare;
                } 
            }

            player.zone.push(current);
        }
    }
}

function addStatus(whom, chance, id, str, length, special = {}) {
    if (whom === 0) {
        whom = player.status;
    } else if (whom === 1) {
        whom = player.enemy.status;
    }

    if (chance >= 1) {
        whom.push({id: id, str: str, length: Math.floor(chance) * length, special: special});
    }

    if (Math.random() <= (chance % 1)) {
        whom.push({id: id, str: str, length: length, special: special});
    }
}

function leaveBattle() {
    player.alive = true;
    player.altBli.alive = true;
    player.stage = -1;
    player.state = 0;
    player.progress = 0;
    player.altBli.progress = 0;
    player.enemy.progress = 0;
    player.status = [];
    player.enemy.status = [];
}

function toggleBattle() {
    if (player.state === 0 || player.state === 2) {
        player.state = 1;
    } else {
        player.state = 2;
    }
}

function formatReward(type, amt) {
    switch (type) {
        case 'hp':
            return `<span style="color: #f00">HP: +${format(amt, 2)}</span>`;
        case 'regen':
            return `<span style="color: #f8f">Regeneration Speed: +${format(amt, 2)}/s</span>`;
        case 'atk':
            return `<span style="color: #f80">ATK: +${format(amt, 2)}</span>`;
        case 'def':
            return `<span style="color: #0f0">DEF: +${format(amt, 2)}</span>`;
        case 'speed':
            return `<span style="color: #fff">SPD: +${format(amt, 3)}</span>`;
        case 'divSpeed':
            return `<span style="color: #c00">/SPD: +${format(amt, 3)}</span>`;
        case 'critP':
            return `<span style="color: #ff0">Critical Chance: +${format(amt * 100, 2)}%</span>`;
        case 'critD':
            return `<span style="color: #ff0">Critical Damage: +${format(amt, 2)}x</span>`;
        case 'psnP':
            return `<span style="color: #80f">Poison Chance: +${format(amt * 100, 2)}%</span>`;
        case 'psnD':
            return `<span style="color: #80f">Poison Damage: +${format(amt, 2)}</span>`;
        case 'psnR':
            return `<span style="color: #80f">Poison Resistance: +${format(amt * 100, 2)}%</span>`;
        case 'burnP':
            return `<span style="color: #f40">Burn Chance: +${format(amt * 100, 2)}%</span>`;
        case 'burnD':
            return `<span style="color: #f40">Burn Damage: +${format(amt, 2)}</span>`;
        case 'burnR':
            return `<span style="color: #f40">Burn Resistance: +${format(amt * 100, 2)}%</span>`;
        case 'blockP':
            return `<span style="color: #fff">Block Chance: +${format(amt * 100, 2)}%</span>`;
        case 'blockD':
            return `<span style="color: #fff">Block Damage: +${format(amt * 100, 2)}%</span>`;
        case 'counterP':
            return `<span style="color: #0ff">Counter Chance: +${format(amt * 100, 2)}%</span>`;
        case 'counterD':
            return `<span style="color: #0ff">Counter Damage: +${format(amt * 100, 2)}%</span>`;
        case 'invBAlly':
            return `<span style="color: #f8f">Get an Inverse Blighteon as an ally !</span>`;
        case 'xp':
            return `<span style="color: #ff8">XP: +${format(amt, 1)}</span>`;
        default:
            throw new Error(`that TYPE: ${type} ain't existing bruh`);
    }
}

function doThing() {
    if (!started) {
        start();
        started = true;
    }
    update();

    el('playerLevel').innerText = format(player.level + 1);
    el('playerXP').innerText = `(${format(player.dispXP)} / ${format(player.nextXP)})`;
    el('playerXPBar2').style.width = `${player.dispXP / player.nextXP * 100}%`;

    el('playerHPBarAB').style.display = (player.rewards.invBAlly >= 1) ? "" : "none";
    el('playerSpeedBarAB').style.display = (player.rewards.invBAlly >= 1) ? "" : "none";
    if (player.rewards.invBAlly >= 1) {
        el('playerHPBarAB2').style.width = `${((clamp(player.altBli.hp / player.maxhp, 0.05, 0.95) - 0.05) / 0.9) * 100}%`;
        el('playerSpeedBarAB2').style.width = `${((clamp(player.altBli.progress, 0.05, 0.95) - 0.05) / 0.9) * 100}%`;
        el('invBlHP').innerText = format(player.altBli.hp, 1);
        el('invBlMaxHP').innerText = format(player.maxhp, 1);
        el('invBlRegen').innerText = format(player.regen * (player.state === 0 ? 1 : 0.4), 2);
    }

    el('invBlHPT').style.display = (player.rewards.invBAlly >= 1) ? "" : "none";

    let current = ['player', 'enemy'];
    let data = [player, player.enemy];
    for (let i = 0; i < data.length; i++) {
        let obj = { html: current[i], data: data[i] };
        el(obj.html + 'Name').innerText = obj.data.name;
        el(obj.html + 'HP').innerText = format(obj.data.hp, 1);
        el(obj.html + 'MaxHP').innerText = format(obj.data.maxhp, 1);
        el(obj.html + 'Regen').innerText = format(obj.data.regen, 2);
        el(obj.html + 'Crit').style.display = (obj.data.crit[0] > 0) ? "" : "none";
        el(obj.html + 'Poison').style.display = (obj.data.special.poison[0] > 0) ? "" : "none";
        el(obj.html + 'Burn').style.display = (obj.data.special.burn[0] > 0) ? "" : "none";
        el(obj.html + 'Bleed').style.display = (obj.data.special.bleed[0] > 0) ? "" : "none";
        el(obj.html + 'Slow').style.display = (obj.data.special.slow[0] > 0) ? "" : "none";
        el(obj.html + 'Block').style.display = (obj.data.special.block[0] > 0) ? "" : "none";
        el(obj.html + 'Counter').style.display = (obj.data.special.counter[0] > 0) ? "" : "none";
        el(obj.html + 'HitRegen').style.display = (obj.data.special.hitRegen[0] > 0) ? "" : "none";
        el(obj.html + 'Hug').style.display = (obj.data.special.hug[0] > 0) ? "" : "none";
        
        el(obj.html + 'StatsATK').innerText = format(obj.data.atk, 2);
        el(obj.html + 'StatsDEF').innerText = format(obj.data.def, 2);
        el(obj.html + 'StatsSPD').innerText = format(1 / obj.data.speed, 3);
        el(obj.html + 'StatsCrit1-1').innerText = format(obj.data.crit[0] * 100, 1);
        el(obj.html + 'StatsCrit1-2').innerText = format(obj.data.crit[1], 2);
        el(obj.html + 'StatsPsn1').innerText = format(obj.data.special.poison[0] * 100, 1);
        el(obj.html + 'StatsPsn2').innerText = format(obj.data.special.poison[1], 2);
        el(obj.html + 'StatsPsn3').innerText = format(obj.data.special.poison[2], 2);
        el(obj.html + 'StatsBrn1').innerText = format(obj.data.special.burn[0] * 100, 1);
        el(obj.html + 'StatsBrn2').innerText = format(obj.data.special.burn[1], 2);
        el(obj.html + 'StatsBrn3').innerText = format(obj.data.special.burn[2], 2);
        el(obj.html + 'StatsBld1').innerText = format(obj.data.special.bleed[0] * 100, 1);
        el(obj.html + 'StatsBld2').innerText = format(obj.data.special.bleed[1] * 100, 2);
        el(obj.html + 'StatsBld3').innerText = format(obj.data.special.bleed[2], 2);
        el(obj.html + 'StatsSlow1').innerText = format(obj.data.special.slow[0] * 100, 1);
        el(obj.html + 'StatsSlow2').innerText = format(obj.data.special.slow[1], 2);
        el(obj.html + 'StatsSlow3').innerText = format(obj.data.special.slow[2], 2);
        el(obj.html + 'StatsSlow4').innerText = format(obj.data.special.slow[3], 2);
        el(obj.html + 'StatsBlock1').innerText = format(obj.data.special.block[0] * 100, 1);
        el(obj.html + 'StatsBlock2').innerText = format(obj.data.special.block[1], 2);
        el(obj.html + 'StatsCounter1').innerText = format(obj.data.special.counter[0] * 100, 1);
        el(obj.html + 'StatsCounter2').innerText = format(obj.data.special.counter[1], 2);
        el(obj.html + 'StatsHitRegen1').innerText = format(obj.data.special.hitRegen[0] * 100, 1);
        el(obj.html + 'StatsHitRegen2').innerText = format(obj.data.special.hitRegen[1], 2);
        el(obj.html + 'StatsHitRegen3').innerText = format(obj.data.special.hitRegen[2], 2);
        el(obj.html + 'StatsHug1').innerText = format(obj.data.special.hug[0] * 100, 1);
        el(obj.html + 'StatsHug2').innerText = format(obj.data.special.hug[1] * 100, 2);
        el(obj.html + 'StatsHug3').innerText = format(obj.data.special.hug[2], 2);
        el(obj.html + 'StatsHug4').innerText = format(obj.data.special.hug[3], 2);

        el(obj.html + 'HPBar').style.border = `0.3vw solid hsl(${obj.data.hp / obj.data.maxhp * 120}, 100%, 25%)`;
        el(obj.html + 'HPBar1').style.backgroundColor = `hsl(${obj.data.hp / obj.data.maxhp * 120}, 100%, 15%)`;
        el(obj.html + 'HPBar2').style.width = `${((clamp(obj.data.hp / obj.data.maxhp, 0.05, 0.95) - 0.05) / 0.9) * 100}%`;
        el(obj.html + 'HPBar2').style.backgroundColor = `hsl(${obj.data.hp / obj.data.maxhp * 120}, 100%, 50%)`;
        el(obj.html + 'SpeedBar2').style.width = `${((clamp(obj.data.progress, 0.05, 0.95) - 0.05) / 0.9) * 100}%`;
    }

    for (let i = 0; i < enemyList.length; i++) {
        let enemy = enemyList[i];
        el(`enemySelect${enemy.id}`).innerHTML = `<h3>${enemy.name}</h3>Defeated: ${format(player.defeated[enemy.id])} times`;
    }

    el('enemyInfo').style.display = (player.stage === -1) ? "none" : "";
    el('enemySelection').style.display = (player.stage === -1) ? "flex" : "none";
    el('inBattle').style.display = (player.stage === -1) ? "none" : "flex";
    el('battleRewards').style.display = (player.stage === -1) ? "none" : "flex";
    el('toBattle').innerHTML = "<b>" + ((player.state === 0 || player.state === 2) ? "Fight!" : "Pause") + "</b>";
    el('rerollBattle').style.display = (player.stage === -1) ? "none" : (enemyList[player.stage].type === 0) ? "flex" : "none";

    if (player.stage !== -1) {
        let j, table = ``;
        if (enemyList[player.stage].type === 0) {
            for (let i = 0; i < 15; i++) {
                j = fixedMod(player.difficulty + i - 7, player.zone.length);
                table += `
                <div style="align-items: center; font-size: 1.7vw; text-align: center; background-color: #${i < 7 ? "080808" : (j === player.difficulty % player.zone.length) ? "303030" : "101010"}; border: 0.4vw solid #${i < 7 ? "101010" : (j === player.difficulty % player.zone.length) ? "606060" : "202020"}; width: 15vw; height: 5vw;">
                    ${formatReward(player.zone[j].type[0], player.zone[j].amt)}
                </div>
                `
            }
            el('battleRewards').innerHTML = table;
        }
        if (enemyList[player.stage].type === 1) {
            for (let i = 0; i < enemyList[player.stage].reward.length; i++) {
                table += `
                    <br>${formatReward(enemyList[player.stage].reward[i][0], enemyList[player.stage].reward[i][1])}
                `
            }
            el('battleRewards').innerHTML = `<span style="text-align: center;">${format(player.defeated[player.stage])} / ${format(enemyList[player.stage].cap)}<br>${table}</span>`;
        }
    }
}

function update() {
    let tickRate = TICKRATE / 1000;
    player.time += tickRate;

    player.regen = 0.2;
    player.regen += player.rewards.regen;
    if (player.state === 0) { player.regen = player.maxhp / 10 }
    if (player.state === 2) { player.regen = 0 }

    if (player.alive || player.state === 0) {
        player.hp = Math.min(player.maxhp, player.hp + (tickRate * player.regen));
    }
    if (player.altBli.alive || player.state === 0) {
        player.altBli.hp = Math.min(player.maxhp, player.altBli.hp + (tickRate * player.regen * (player.state === 0 ? 1 : 0.4)));
    }

    player.level = Math.floor(Math.max(0, (Math.log(Math.log((player.xp / 50.6) + 1) / Math.log(1.198) + 199.69) / Math.log(1.005)) - 1062));
    let levelCalc = (x) => {
        return 50.6 * (1.198 ** ((1.005 ** (x + 1062)) - 199.69) - 1);
    }
    player.dispXP = player.xp - levelCalc(player.level);
    player.nextXP = levelCalc(player.level + 1) - levelCalc(player.level);

    let eff;
    player.maxhp = Math.max(1, 20 + (3 * player.level) + (0.4 * player.level ** 2));
    player.maxhp += player.rewards.hp;

    player.atk = 3 + (0.45 * player.level) + (0.05 * player.level ** 2);
    player.atk += player.rewards.atk;

    player.def = 1 + (0.3 * player.level) + (0.033 * player.level ** 2);
    player.def += player.rewards.def;

    player.speed = 0.5;
    eff = player.rewards.speed;
    if (eff >= 1.8) {
        eff = 2.4 * (Math.pow(eff / 1.8, 0.75) - 0.25);
    }
    player.speed += eff;
    player.speed /= player.rewards.divSpeed;

    player.crit[0] = 0;
    player.crit[0] += player.rewards.critP;

    player.crit[1] = 2;
    player.crit[1] += player.rewards.critD;

    player.special.poison[0] = 0;
    player.special.poison[0] += player.rewards.psnP;

    player.special.poison[1] = 1;
    player.special.poison[1] += player.rewards.psnD;

    player.special.poison[2] = 1.00;
    player.special.poison[2] += player.rewards.psnR;

    player.special.burn[0] = 0;
    player.special.burn[0] += player.rewards.burnP;

    player.special.burn[1] = 0;
    player.special.burn[1] += player.rewards.burnD;

    player.special.burn[2] = 1.00;
    player.special.burn[2] += player.rewards.burnR;

    player.special.block[0] = 0;
    player.special.block[0] += player.rewards.blockP;

    player.special.block[1] = 1;
    player.special.block[1] /= player.rewards.blockD;

    if (player.stage !== -1) {
        if (player.defeated[player.stage] >= enemyList[player.stage].cap ?? Infinity) {
            leaveBattle();
        }
    }

    if (player.state === 1) {
        let accuracy = [1, 1]

        for (let i = 0; i < player.status.length; i++) {
            switch (player.status[i].id) {
                case 'poison':
                    player.hp -= player.status[i].str * tickRate / player.special.poison[2];
                    player.altBli.hp -= player.status[i].str * tickRate / player.special.poison[2];
                    break;
                case 'hitRegen':
                    player.hp += player.status[i].str * tickRate;
                    player.altBli.hp += player.status[i].str * tickRate;
                    break;
                case 'slow':
                    player.speed /= ((player.status[i].str - 1) / player.special.slow[3]) + 1
                    break;
                case 'burn':
                    player.hp -= player.status[i].str * tickRate / (player.special.burn[2] * (1 + player.status[i].length));
                    player.altBli.hp -= player.status[i].str * tickRate / (player.special.burn[2] * (1 + player.status[i].length));
                    break;
                case 'bleed':
                    player.hp -= player.status[i].str * player.maxhp * tickRate / (player.special.bleed[2]);
                    player.altBli.hp -= player.status[i].str * player.maxhp * tickRate / (player.special.bleed[2]);
                    break;
                case 'hug':
                    accuracy[0] *= ((player.status[i].str - 1) / player.special.hug[3]) + 1
                    break;
                default:
                    throw new Error(`status effect player ${player.status[i].id} doesn't exist`);
            }

            player.status[i].length -= tickRate;

            if (player.status[i].length <= 0) {
                player.status.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < player.enemy.status.length; i++) {
            switch (player.enemy.status[i].id) {
                case 'poison':
                    player.enemy.hp -= player.enemy.status[i].str * tickRate / player.enemy.special.poison[2];
                    break;
                case 'hitRegen':
                    player.enemy.hp += player.enemy.status[i].str * tickRate;
                    break;
                case 'slow':
                    player.enemy.speed /= ((player.enemy.status[i].str - 1) / player.enemy.special.slow[3]) + 1
                    break;
                case 'burn':
                    player.enemy.hp -= player.enemy.status[i].str * tickRate / (player.enemy.special.burn[2] * (1 + player.enemy.status[i].length));
                    break;
                case 'bleed':
                    player.enemy.hp -= player.enemy.status[i].str * player.enemy.maxhp * tickRate / (player.enemy.special.bleed[2]);
                    break;
                case 'hug':
                    accuracy[1] *= ((player.enemy.status[i].str - 1) / player.enemy.special.hug[3]) + 1
                    break;
                default:
                    throw new Error(`status effect player ${player.enemy.status[i].id} doesn't exist`);
            }

            player.enemy.status[i].length -= tickRate;

            if (player.enemy.status[i].length <= 0) {
                player.enemy.status.splice(i, 1);
                i--;
            }
        }

        player.enemy.hp = Math.min(player.enemy.maxhp, player.enemy.hp + (tickRate * player.enemy.regen));
        player.enemy.progress = player.enemy.progress + (tickRate * player.enemy.speed);

        player.altBli.alive = player.rewards.invBAlly >= 1 ? player.altBli.hp > 0 : false
        player.alive = player.hp > 0

        if (player.altBli.alive) {
            player.altBli.progress = player.altBli.progress + (tickRate * player.speed * 0.4);
        } else {
            player.altBli.hp = 0
            player.altBli.progress = 0
        }

        if (player.alive) {
            player.progress = player.progress + (tickRate * player.speed);
        } else {
            player.hp = 0
            player.progress = 0
        }

        for (let attk = 0; player.progress >= 1 && attk < 50; attk++) {
            player.progress -= 1;
            if (Math.random() <= accuracy[0]) {
                playerAttack(0);
            }
        }

        if (player.rewards.invBAlly >= 1) {
            for (let attk = 0; player.altBli.progress >= 1 && attk < 50; attk++) {
                player.altBli.progress -= 1;
                if (Math.random() <= accuracy[0]) {
                    playerAttack(1, 0.75);
                }
            }
        }

        for (let attk = 0; player.enemy.progress >= 1 && attk < 50; attk++) {
            player.enemy.progress -= 1;
            if (Math.random() <= accuracy[1]) {
                enemyAttack();
            }
        }

        if (!(player.altBli.alive || player.alive)) {
            player.alive = true;
            player.altBli.alive = true;
            player.state = 0;
            player.progress = 0;
            player.enemy.progress = 0;
            player.status = [];
            player.enemy.hp = enemyList[player.stage].stats.hp;
            player.enemy.status = [];
            player.hp = 0;
        }

        if (player.enemy.hp <= 0) {
            if (enemyList[player.stage].type === 0) {
                if (player.zone[player.difficulty % player.zone.length].type[0] === 'xp') { 
                    player.xp += player.zone[player.difficulty % player.zone.length].amt;
                } else {
                    player.rewards[player.zone[player.difficulty % player.zone.length].type[0]] += player.zone[player.difficulty % player.zone.length].amt;
                }
            }

            if (enemyList[player.stage].type === 1) {
                for (let i = 0; i < enemyList[player.stage].reward.length; i++) {
                    if (enemyList[player.stage].reward[i][0] === 'xp') {
                        player.xp += enemyList[player.stage].reward[i][1];
                    } else {
                        player.rewards[enemyList[player.stage].reward[i][0]] += enemyList[player.stage].reward[i][1];
                    }
                }
            }

            player.difficulty++;
            player.defeated[player.stage]++;
            player.enemy.progress = 0;
            player.enemy.status = [];
            player.enemy.hp = enemyList[player.stage].stats.hp;

            if (!player.altBli.alive) {
                player.altBli.hp += 1
            }

            if (!player.alive) {
                player.hp += 1
            }
        }
    }
}

function playerAttack(ally, counters = false, dmgMod = 1) {
    let DM = player.atk * dmgMod;
    if (Math.random() <= player.crit[0]) {
        DM *= player.crit[1];
    }

    addStatus(1, player.special.poison[0], 'poison', player.special.poison[1], 1);
    addStatus(1, player.special.burn[0], 'burn', player.special.burn[1], 1);
    addStatus(1, player.special.bleed[0], 'bleed', player.special.bleed[1], 1);
    addStatus(1, player.special.slow[0], 'slow', player.special.slow[1], player.special.slow[2]);
    addStatus(1, player.special.hug[0], 'hug', player.special.hug[1], player.special.hug[2]);
    addStatus(0, player.special.hitRegen[0], 'hitRegen', player.special.hitRegen[1], player.special.hitRegen[2]);

    if (Math.random() <= player.enemy.special.block[0]) {
        DM *= player.enemy.special.block[1];
    }
    player.enemy.hp -= (DM ** 2) / (DM + player.enemy.def);
    
    if (ally === 1 && player.alive) {
        player.hp += DM / 20
    }

    if (!counters) {
        if (Math.random() <= player.enemy.special.counter[0]) {
            enemyAttack(true, dmgMod * player.enemy.special.counter[1]);
        }
    }
}

function enemyAttack(counters = false, dmgMod = 1) {
    let DM = player.enemy.atk * dmgMod;
    if (Math.random() <= player.enemy.crit[0]) {
        DM *= player.enemy.crit[1];
    }

    addStatus(0, player.enemy.special.poison[0], 'poison', player.enemy.special.poison[1], 1);
    addStatus(0, player.enemy.special.burn[0], 'burn', player.enemy.special.burn[1], 1);
    addStatus(0, player.enemy.special.bleed[0], 'bleed', player.enemy.special.bleed[1], 1);
    addStatus(0, player.enemy.special.slow[0], 'slow', player.enemy.special.slow[1], player.enemy.special.slow[2]);
    addStatus(0, player.enemy.special.hug[0], 'hug', player.enemy.special.hug[1], player.enemy.special.hug[2]);
    addStatus(1, player.enemy.special.hitRegen[0], 'hitRegen', player.enemy.special.hitRegen[1], player.enemy.special.hitRegen[2]);

    if (Math.random() <= player.special.block[0]) {
        DM *= player.special.block[1];
    }
    player.hp -= (DM ** 2) / (DM + player.def);
    player.altBli.hp -= (DM ** 2) / (DM + (player.def * 1.5)) / 1.2;
    
    if (!counters) {
        if (Math.random() <= player.special.counter[0]) {
            enemyAttack(0, true, dmgMod * player.special.counter[1]);
        }
    }
}
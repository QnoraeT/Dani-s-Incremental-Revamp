"use strict";
let turnOrder = []
let turnNum = 0
let id = 0
let damageQueue = []
let timer = 0
let state = 0
let nextAction = 0

const listS = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
const list2 = ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
const list10 = ["", "Dc", "Vg", "Tr", "Qe", "Qt", "Se", "St", "Og", "Nv", "Ce"];

const ELEMENTS = {
    Normal: "Normal",
    Fire: "Fire",
    Water: "Water",
    Electric: "Electric",
    Grass: "Grass",
    Ice: "Ice",
    Fighting: "Fighting",
    Poison: "Poison",
    Ground: "Ground",
    Flying: "Flying",
    Psychic: "Psychic",
    Bug: "Bug",
    Rock: "Rock",
    Ghost: "Ghost",
    Dragon: "Dragon",
    Dark: "Dark",
    Steel: "Steel",
    Fairy: "Fairy",
    Digital: "Digital"
}

let possibleTypeDmg = [0, 0.5, 2, 4]

const TYPE_LIST = [ELEMENTS.Normal, ELEMENTS.Fire, ELEMENTS.Water, ELEMENTS.Electric, ELEMENTS.Grass, ELEMENTS.Ice, ELEMENTS.Fighting, ELEMENTS.Poison, ELEMENTS.Ground, ELEMENTS.Flying, ELEMENTS.Psychic, ELEMENTS.Bug, ELEMENTS.Rock, ELEMENTS.Ghost, ELEMENTS.Dragon, ELEMENTS.Dark, ELEMENTS.Steel, ELEMENTS.Fairy, ELEMENTS.Digital]

const typeEff = {
    Normal: {
        0: [ELEMENTS.Ghost],
        0.5: [ELEMENTS.Rock, ELEMENTS.Steel]
    },
    Fire: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Water, ELEMENTS.Rock, ELEMENTS.Dragon],
        2: [ELEMENTS.Grass, ELEMENTS.Ice, ELEMENTS.Bug, ELEMENTS.Steel, ELEMENTS.Digital],
    },
    Water: {
        0.5: [ELEMENTS.Water, ELEMENTS.Grass, ELEMENTS.Dragon],
        2: [ELEMENTS.Fire, ELEMENTS.Ground, ELEMENTS.Rock, ELEMENTS.Digital],
    },
    Electric: {
        0: [ELEMENTS.Ground],
        0.5: [ELEMENTS.Electric, ELEMENTS.Grass, ELEMENTS.Dragon],
        2: [ELEMENTS.Water, ELEMENTS.Flying],
    },
    Grass: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Grass, ELEMENTS.Poison, ELEMENTS.Flying, ELEMENTS.Bug, ELEMENTS.Dragon, ELEMENTS.Steel],
        2: [ELEMENTS.Water, ELEMENTS.Ground, ELEMENTS.Rock],
    },
    Ice: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Water, ELEMENTS.Ice, ELEMENTS.Steel],
        2: [ELEMENTS.Grass, ELEMENTS.Ground, ELEMENTS.Flying, ELEMENTS.Dragon],
    },
    Fighting: {
        0: [ELEMENTS.Ghost],
        0.5: [ELEMENTS.Poison, ELEMENTS.Flying, ELEMENTS.Psychic, ELEMENTS.Bug, ELEMENTS.Fairy, ELEMENTS.Digital],
        2: [ELEMENTS.Normal, ELEMENTS.Ice, ELEMENTS.Rock, ELEMENTS.Dark, ELEMENTS.Steel],
    },
    Poison: {
        0: [ELEMENTS.Steel, ELEMENTS.Digital],
        0.5: [ELEMENTS.Poison, ELEMENTS.Ground, ELEMENTS.Rock, ELEMENTS.Ghost],
        2: [ELEMENTS.Grass, ELEMENTS.Fairy],
    },
    Ground: {
        0: [ELEMENTS.Flying],
        0.5: [ELEMENTS.Grass, ELEMENTS.Bug],
        2: [ELEMENTS.Fire, ELEMENTS.Electric, ELEMENTS.Poison, ELEMENTS.Rock, ELEMENTS.Steel],
    },
    Flying: {
        0.5: [ELEMENTS.Electric, ELEMENTS.Rock, ELEMENTS.Steel],
        2: [ELEMENTS.Grass, ELEMENTS.Fighting, ELEMENTS.Bug],
    },
    Psychic: {
        0: [ELEMENTS.Dark],
        0.5: [ELEMENTS.Psychic, ELEMENTS.Steel],
        2: [ELEMENTS.Fighting, ELEMENTS.Poison],
    },
    Bug: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Fighting, ELEMENTS.Poison, ELEMENTS.Flying, ELEMENTS.Ghost, ELEMENTS.Steel, ELEMENTS.Fairy],
        2: [ELEMENTS.Grass, ELEMENTS.Psychic, ELEMENTS.Dark],
        4: [ELEMENTS.Digital],
    },
    Rock: {
        0.5: [ELEMENTS.Fighting, ELEMENTS.Ground, ELEMENTS.Steel],
        2: [ELEMENTS.Fire, ELEMENTS.Ice, ELEMENTS.Flying, ELEMENTS.Bug],
    },
    Ghost: {
        0: [ELEMENTS.Normal],
        0.5: [ELEMENTS.Dark],
        2: [ELEMENTS.Psychic, ELEMENTS.Ghost, ELEMENTS.Digital],
    },
    Dragon: {
        0: [ELEMENTS.Fairy],
        0.5: [ELEMENTS.Steel],
        2: [ELEMENTS.Dragon],
    },
    Dark: {
        0.5: [ELEMENTS.Fighting, ELEMENTS.Dark, ELEMENTS.Fairy, ELEMENTS.Digital],
        2: [ELEMENTS.Psychic, ELEMENTS.Ghost],
    },
    Steel: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Water, ELEMENTS.Electric, ELEMENTS.Steel],
        2: [ELEMENTS.Ice, ELEMENTS.Rock, ELEMENTS.Fairy],
    },
    Fairy: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Poison, ELEMENTS.Steel],
        2: [ELEMENTS.Fighting, ELEMENTS.Dragon, ELEMENTS.Dark],
    },
    Digital: {
        0.5: [ELEMENTS.Ice, ELEMENTS.Ground, ELEMENTS.Rock, ELEMENTS.Fairy],
        2: [ELEMENTS.Electric, ELEMENTS.Fighting, ELEMENTS.Flying, ELEMENTS.Psychic, ELEMENTS.Ghost, ELEMENTS.Dragon, ELEMENTS.Digital],
    }
}

function getTypeEffective(attacking, defending) {
    let mul = 1.0;
        for (let i = 0; i < attacking.length; i++) {
            for (let j = 0; j < possibleTypeDmg.length; j++) {
                if (typeEff[attacking[i]][possibleTypeDmg[j]] !== undefined) {
                    let eff = typeEff[attacking[i]][possibleTypeDmg[j]]
                    for (let k = 0; k < defending.length; k++) {
                        if (eff.includes(defending[k])) {
                            mul *= possibleTypeDmg[j];
                        }
                    }
                }
            }
        }
    return mul
}

function checkEveryType(defending) {
    for (let i = 0; i < TYPE_LIST.length; i++) {
        console.log(`${TYPE_LIST[i]} --(${getTypeEffective([TYPE_LIST[i]], defending)}x)-> ${defending}`);
    }
}

function format(num, dec, limit = 10000, int = 1) {
    if (num > limit){
        let abb;
        let abbN = Math.floor(Math.log10(num) / 2.99999999);
        if (abbN >= listS.length){
            abb = list2[(abbN - 1) % 10] + list10[Math.floor((abbN - 1) / 10)];
        } else {
            abb = listS[abbN];
        }
        num = 10 ** (Math.log10(num) % 3);
        return `${num.toFixed(dec)} ${abb}`;
    } else {
        let n = num;
        if (int === -1) {
            n = Math.floor(num);
        } else if (int === 0) {
            n = Math.round(num);
        } else if (int === 1) {
            n = Math.ceil(num);
        }
        return n.toLocaleString();
    }
}

class Character {
    constructor(name, baseStats, level, xpGain, team, idType, pronouns, elements) {
        this.id = id
        this.internalType = idType
        this.pronouns = pronouns
        id++
        
        this.name = name
        this.team = team
        this.baseStats = [...baseStats]
        this.stats = [...baseStats]
        this.trueStats = [...baseStats]
        this.alive = true
        this.xpGain = xpGain
        this.elements = elements
        this.gp = 0

        this.statusEffects = []
        this.xp = 10 + (10 * (level - 1)) + ((level - 1) * (level))
        this.level = level
        this.levelUp()
    }
    levelUp() {
        if (this.xp >= 10 + (10 * this.level) + (this.level * (1 + this.level))) {
            this.level++
            console.log(`${this.name} levels up to level ${this.level}!!`)
            let levelFactor = (1 + (9 * (this.level - 1) / 99)) * (1 + 0.04 * Math.floor(this.level, 4)) * (1 + 0.05 * Math.floor(this.level, 10)) * (1 + 0.1 * Math.floor(this.level, 50))
            let newStats = []
            for (let i = 0; i < this.baseStats.length; i++) {
                newStats.push(Math.max(0, (this.baseStats[i] * levelFactor) - this.stats[i]) * (this.level % 25 == 0 ? 1 : 0.75 + 0.5 * Math.random()))
                let before = Math.ceil(this.stats[i])
                this.stats[i] += newStats[i]
                console.log(`${this.name}'s ${["HP", "PATK", "PDEF", "MATK", "MDEF", "SPD", "ACC", "EVA"][i]} increased by +${Math.ceil(this.stats[i]) - before}!`)
                this.trueStats[i] = this.stats[i]
            }
            this.doStatusEffects()
        }
    }
    doStatusEffects() {
        // starts at 1 because HP is at index 0
        for (let i = 1; i < this.stats.length; i++) {
            this.trueStats[i] = this.stats[i]
        }

        for (let i = 0; i < this.statusEffects.length; i++) {

        }
    }
    damage(who, damage, type, acc, pierce, typeless, elements, crit = [[90, 2]]) {
        damageQueue.push(
            {
                type: 0,
                who: who,
                amount: damage,
                fromWhom: this.id,
                atkType: type,
                accuracy: acc,
                defPierce: pierce,
                typeless: typeless,
                elements: elements,
                crit: crit
            }
        )
    }
    damageScript(damage) {
        this.gp += damage / (this.trueStats[0])
        switch (this.internalType) {
            case 0:
            case 1:
                if (this.trueStats[0] <= 0) {
                    this.alive = false
                    this.trueStats[0] = 0

                    console.error(`${this.name} was defeated!`)
                }
                break;
            case 2:
            case 3:
            case 4:
            case 5:
                if (this.trueStats[0] <= 0) {
                    this.alive = false
                    this.trueStats[0] = 0
                    for (let i = 0; i < characters.length; i++) {
                        if (characters[i].team === 0) {
                            characters[i].xp += this.xpGain
                            characters[i].levelUp()
                        }
                    }
                    console.error(`${this.name} was defeated!`)
                }
                break;
            default:
                console.warn(`internal type ${this.internalType} does not exist in damageScript`)
        }
    }
    response(response) {
        this.gp += response.damage / (this.trueStats[1] + this.trueStats[3])
        switch (this.internalType) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            default:
                console.warn(`internal type ${this.internalType} does not exist in responseScript`)
        }
    }
}

// hp, patk, pdef, matk, mdef, spd, acc, eva
let characters = [
    new Character("FSBlue", [40, 16, 12, 3, 3, 15, 9, 5], 1, 0, 0, 0, ['she', 'her', 'her'], [ELEMENTS.Fighting]),
    new Character("DesSB", [12, 14, 7, 15, 9, 20, 14, 8], 1, 0, 0, 1, ['he', 'him', 'his'], [ELEMENTS.Fairy])
]

let characterListFixed = []
getCharacterList()

try {
    clearInterval(ok)
} catch {
    
}
let ok = setInterval(doThing, 50)
let wave = 0
let rng = []
function doThing() {
    timer += 50
    let enemies = 0

    for (let i = 0; i < characters.length; i++) {
        if (characters[i].team !== 0 && characters[i].alive) {
            enemies++
        }
    }
    if (enemies === 0 && wave < 5) {
        for (let i = 0; i < characters.length; i++) {
            if (characters[i].team !== 0) {
                characters.splice(i, 1)
                i--
            }
        }
        wave++
        console.warn(`<| Wave ${wave}! |>`)
        if (wave >= 1 && wave < 5) {
            rng[0] = Math.random()
            if (rng[0] < 1 && rng[0] > 0.00) {
                rng[1] = Math.floor(Math.random() * 3) + 1
                for (let i = 0; i < rng[1]; i++) {
                    rng[2] = 0.8 + 0.4 * Math.random()
                    rng[3] = Math.floor(Math.random() * 4)
                    characters.push(
                        new Character(
                            `${["Green Slime", "Red Slime", "Yellow Slime", "Blue Slime"][rng[3]]} #${i + 1}`, 
                        [ // stat
                            [45, 40, 30, 60][rng[3]] * rng[2], 
                            [6,  5,  8,  4 ][rng[3]] * rng[2], 
                            [3,  2,  1,  6 ][rng[3]] * rng[2], 
                            [5,  9,  9,  4 ][rng[3]] * rng[2], 
                            [2,  3,  2,  7 ][rng[3]] * rng[2], 
                            [11, 8,  17, 5 ][rng[3]] * rng[2], 
                            [7,  5,  7,  10][rng[3]] * rng[2], 
                            [7,  8,  15, 2 ][rng[3]] * rng[2]
                        ], 1, 
                        [6, 7.5, 7, 6][rng[3]] * rng[2] * rng[2], // xp
                        1, 2 + rng[3], pronouns_list[Math.floor(Math.random() * 3)], [
                            [[ELEMENTS.Grass, ELEMENTS.Fire, ELEMENTS.Electric, ELEMENTS.Water][rng[3]]]
                        ])
                    )
                }
            }

            getCharacterList()
        }
    }

    if (turnOrder.length === 0) {
        let sides = [[], []]
        for (let i = 0; i < characters.length; i++) {
            sides[characters[i].team].push(characters[i].id)
        }

        console.log(`\n`)
        console.log(`Players         | Level | HP          | GP`)
        for (let i = 0; i < sides[0].length; i++) {
            displayCharacter(sides[0][i], 0)
        }
        console.log(`\n`)
        console.log(`Enemies         | Level | HP          | GP`)
        for (let i = 0; i < sides[1].length; i++) {
            displayCharacter(sides[1][i], 0)
        }
        console.log(`\n`)
        

        turnNum++
        turnOrder = []
        for (let i = 0; i < characters.length; i++) {
            if (characters[i].alive) {
                turnOrder.push(characters[i])
            }
        }
        turnOrder.sort((a, b) => b.trueStats[5] - a.trueStats[5]);
        console.warn(`<| Turn ${turnNum} |>`)
        nextAction = timer + 1000
    }
    
    if (timer >= nextAction) {
        if (state === -1) {
            turnOrder.splice(0, 1)
            state = 0
        }
        if (turnOrder.length > 0) {
            if (!getCharacter(turnOrder[0].id).alive) {
                state = -1
            } else {
                console.log(`\n`)
                let currChar = getCharacter(turnOrder[0].id)
                let target
                switch (currChar.internalType) {
                    case 0:
                        if (state === 0) {
                            let moveFind = false
                            let iterations = 0
                            while (!moveFind) {
                                iterations++
                                if (iterations >= 1000) {
                                    throw new Error(`[ERROR] ${currChar.name} got stuck!`)
                                }
        
                                rng[0] = Math.floor(Math.random() * 2)
                                if (rng[0] === 0) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} strongly punches ${getCharacter(target).name}!`)
                                    currChar.damage(target, 1.0 * currChar.trueStats[1], 'p', currChar.trueStats[6], 0, false, [ELEMENTS.Fighting])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 1) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} comboes ${getCharacter(target).name}!`)
                                    currChar.damage(target, 0.4 * currChar.trueStats[1], 'p', currChar.trueStats[6], 0, false, [ELEMENTS.Fighting])
                                    currChar.damage(target, 0.4 * currChar.trueStats[1], 'p', currChar.trueStats[6], 0, false, [ELEMENTS.Fighting])
                                    currChar.damage(target, 0.4 * currChar.trueStats[1], 'p', currChar.trueStats[6], 0, false, [ELEMENTS.Fighting])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                            }
                        }
                        break;
                    case 1:
                        if (state === 0) {
                            let moveFind = false
                            let iterations = 0
                            while (!moveFind) {
                                iterations++
                                if (iterations >= 1000) {
                                    throw new Error(`[ERROR] ${currChar.name} got stuck!`)
                                }
        
                                rng[0] = Math.floor(Math.random() * 2)
                                if (rng[0] === 0) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} kicks ${getCharacter(target).name}!`)
                                    currChar.damage(target, 0.6 * currChar.trueStats[1], 'p', currChar.trueStats[6], 0, false, [ELEMENTS.Fighting])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 1) {
                                    target = getTargets(currChar.team)
                                    console.log(`${currChar.name} swipes the opposing team with chocolate!`)
                                    for (let i = 0; i < target.length; i++) {
                                        currChar.damage(target[i], 0.3 * currChar.trueStats[3], 'm', currChar.trueStats[6], 0, false, [ELEMENTS.Fairy])
                                    }
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                // if (rng[0] === 2) {
                                //     target = getTargets(currChar.team)
                                //     target = target[Math.floor(Math.random() * target.length)]
                                //     console.log(`${currChar.name} kicks ${getCharacter(target).name}!`)
                                //     currChar.damage(target, 0.6 * currChar.trueStats[1], 'p', currChar.trueStats[6], 0, false, [ELEMENTS.Fighting])
        
                                //     nextAction += 5000
                                //     moveFind = true
                                //     state = -1
                                // }
                            }
                        }
                        break;
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        if (state === 0) {
                            let moveFind = false
                            let iterations = 0
                            while (!moveFind) {
                                iterations++
                                if (iterations >= 1000) {
                                    throw new Error(`[ERROR] ${currChar.name} got stuck!`)
                                }
        
                                rng[0] = Math.floor(Math.random() * 2)
                                if (rng[0] === 0) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} jumps on ${getCharacter(target).name}!`)
                                    currChar.damage(target, 0.75 * currChar.trueStats[1], 'p', currChar.trueStats[6], 0, false, [ELEMENTS.Normal])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 1) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} ${['fires a Leaf Storm at', 'unleashes a fire pillar from under', 'strikes thunder on', 'drenches'][currChar.internalType - 2]} ${getCharacter(target).name}!`)
                                    currChar.damage(target, 0.75 * currChar.trueStats[3], 'm', currChar.trueStats[6], 0, false, [[ELEMENTS.Grass, ELEMENTS.Fire, ELEMENTS.Electric, ELEMENTS.Water][currChar.internalType - 2]])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                            }
                        }
                        break;
                    default:
                        throw new Error(`internal type ${currChar.internalType} is not a valid type`)
                }
            }
        }
    }
    doDamageQueue()
}

let pronouns_list = [
    ['he', 'him',' his'],
    ['she', 'her',' her'],
    ['they', 'them',' their'],
]

function getTargets(team) {
    let targets = []
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].team !== team && characters[i].alive) {
            targets.push(characters[i].id)
        }
    }
    return targets
}

function doDamageQueue() {
    for (let i = 0; i < damageQueue.length; i++) {
        if (damageQueue[i].type === 0) {
            if (Math.random() >= dodgeFormula(damageQueue[i].accuracy, getCharacter(damageQueue[i].who).trueStats[7])) {
                console.log(`${getCharacter(damageQueue[i].who).name} dodges the attack!`)
                getCharacter(damageQueue[i].fromWhom).response({state: "dodge", damage: 0, effects: null})
                continue;
            }

            let typeEff = getTypeEffective(damageQueue[i].elements, getCharacter(damageQueue[i].who).elements)
            let DM = damageFormula(damageQueue[i].amount, getCharacter(damageQueue[i].who).trueStats[damageQueue[i].atkType === "p" ? 2 : 4])
            DM *= 0.75 + 0.5 * Math.random()
            if (!damageQueue[i].typeless) { 
                DM *= typeEff 
            }

            let critRand = Math.random() * 100
            for (let j = damageQueue[i].crit.length - 1; j >= 0; j--) {
                if (critRand >= damageQueue[i].crit[j][0]) {
                    console.log(`${['Critical', 'DEADLY', 'HOLY'][j]} hit! (${damageQueue[i].crit[j][1]}x)`)
                    DM *= damageQueue[i].crit[j][1]
                    break;
                }
            }

            // do character speicific things here

            let before = Math.ceil(getCharacter(damageQueue[i].who).trueStats[0])
            getCharacter(damageQueue[i].who).trueStats[0] -= DM

            if (typeEff <= 0) {
                console.log(`${getCharacter(damageQueue[i].who).name} is immune...`)
            } else if (typeEff < 1) {
                console.log(`${getCharacter(damageQueue[i].who).name} suffers ${format(before - Math.ceil(getCharacter(damageQueue[i].who).trueStats[0]), 2)} not very effective damage... (${typeEff}x)`)
            } else if (typeEff === 1) {
                console.log(`${getCharacter(damageQueue[i].who).name} suffers ${format(before - Math.ceil(getCharacter(damageQueue[i].who).trueStats[0]), 2)} damage!`)
            } else if (typeEff > 1) {
                console.log(`${getCharacter(damageQueue[i].who).name} suffers ${format(before - Math.ceil(getCharacter(damageQueue[i].who).trueStats[0]), 2)} super effective damage!! (${typeEff}x)`)
            }

            getCharacter(damageQueue[i].who).damageScript(DM)
            getCharacter(damageQueue[i].fromWhom).response({state: "hit", damage: DM, effects: null})
        }
    }
    damageQueue = []
}

function damageFormula(atk, def) {
    return (atk * atk) / (atk + def)
}

let baseAcc = 0.9

function dodgeFormula(acc, eva) {
    return acc >= eva
        ? 1 - ((1 - baseAcc) * ((eva * eva) / (acc * acc)))
        : baseAcc * (acc * 2) / (acc + eva)
}

function displayCharacter(id, type) {
    let whom = getCharacter(id)
    switch (type) {
        case 0:
            console.log(`${pad(whom.name, 15, " ")} | ${pad(whom.level, 5, " ")} | ${pad(Math.ceil(whom.trueStats[0]), 4, " ")} / ${pad(Math.ceil(whom.stats[0]), 4, " ")} | ${pad(Math.ceil(whom.gp), 3, " ")}`)
            break;
        case 1:
            console.log(`${whom.name} Level ${whom.level} (XP: ${Math.ceil(whom.xp)})\nHP: ${Math.ceil(whom.stats[0])}\nPATK: ${Math.ceil(whom.stats[1])}\nPDEF: ${Math.ceil(whom.stats[2])}\nMATK: ${Math.ceil(whom.stats[3])}\nMDEF: ${Math.ceil(whom.stats[4])}\nSPD: ${Math.ceil(whom.stats[5])}`)
            break;
        default:
            console.warn("what")
    }
}

function pad(thing, chars, withWhat) {
    if (thing.length > chars) {
        console.warn("text too big")
        return thing;
    }
    if (typeof thing === 'number') {
        thing = thing.toString()
    }
    for (let i = thing.length; i < chars; i++) {
        thing = `${thing}${withWhat}`
    }
    return thing
}

function getCharacterList() {
    characterListFixed = []
    for (let i = 0; i < characters.length; i++) {
        if (!characterListFixed[characters[i].id] === undefined) {
            throw new Error(`hey! ${characters[i].id} is already occupied!`)
        }
        characterListFixed[characters[i].id] = i
    }
}

function getCharacter(id) {
    return characters[characterListFixed[id]]
}
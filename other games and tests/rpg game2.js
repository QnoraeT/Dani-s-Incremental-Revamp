"use strict";
// * note: this is boredom at it's finest, not particularly good code lol
// TODO: fix enemies spawning with NaN stats
let turnOrder = []
let turnNum = 0
let id = 0
let damageQueue = []
let timer = 0
let state = 0
let nextAction = 0
let pronouns_list = [
    ['he', 'him', 'his', 'himself'],
    ['she', 'her', 'her', 'herself'],
    ['they', 'them', 'their', 'themselves'],
]
let baseAcc = 0.9

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
    if (attacking.length === 0) {
        return 1.0
    }

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
    constructor(name, baseStats, level, xpGain, team, idType, pronouns, elements, lvReq = [Infinity, Infinity, Infinity], levelSet) {
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
        this.state = 0
        this.levelSet = levelSet // if the character *can* level up and change their stats

        this.statusEffects = []

        this.lvReq = lvReq
        this.xp = this.levelUpReq(level - 1)
        this.level = level
        this.levelUp()
        this.doStatusEffects()
        for (let i = 0; i < this.trueStats.length; i++) {
            if (isNaN(this.trueStats[i])) {
                throw new Error(`fucking shit go check console ig`)
            }
        }
    }

    levelUpReq(levl) {
        return this.lvReq[0] + (this.lvReq[1] * levl) + (this.lvReq[2] * levl * levl)
    }
    levelUp() {
        if (this.xp >= this.levelUpReq(this.level) && this.levelSet) {
            this.level++
            console.log(`\n`)
            console.log(`${this.name} levels up to level ${this.level}!!`)
            let levelFactor = (1 + (9 * (this.level - 1) / 99)) * (1 + 0.04 * Math.floor(this.level / 4)) * (1 + 0.05 * Math.floor(this.level / 10)) * (1 + 0.1 * Math.floor(this.level / 50))
            let newStats = []
            for (let i = 0; i < this.baseStats.length; i++) {
                newStats.push(Math.max(0, (this.baseStats[i] * levelFactor) - this.stats[i]) * (this.level % 25 == 0 ? 1 : 0.75 + 0.5 * Math.random()))
                let before = Math.ceil(this.stats[i])
                this.stats[i] += newStats[i]
                console.log(`${this.name}'s ${["HP", "MP", "PATK", "PDEF", "MATK", "MDEF", "SPD", "ACC", "EVA"][i]} increased by +${Math.ceil(this.stats[i]) - before}!`)
                this.trueStats[i] = this.stats[i]
            }
            this.doStatusEffects()
        }
    }
    doStatusEffects() {
        // starts at 2 because HP and MP is at index 0 and 1
        for (let i = 2; i < this.stats.length; i++) {
            this.trueStats[i] = this.stats[i]
        }

        for (let i = 0; i < this.statusEffects.length; i++) {
            switch (this.statusEffects[i].effectType) {
                case 'poison':
                case 'burn':
                case 'stun':
                    break;
                case 'slow':
                    this.trueStats[6] *= this.statusEffects[i].strength
                    break;
                case 'patkInc':
                case 'patkDec':
                    this.trueStats[2] *= this.statusEffects[i].strength
                    break;
                case 'pdefInc':
                case 'pdefDec':
                    this.trueStats[3] *= this.statusEffects[i].strength
                    break;
                case 'matkInc':
                case 'matkDec':
                    this.trueStats[4] *= this.statusEffects[i].strength
                    break;
                case 'mdefInc':
                case 'mdefDec':
                    this.trueStats[5] *= this.statusEffects[i].strength
                    break;
                default:
                    throw new Error(`${this.statusEffects[i].effectType} is not a valid status effect`)
            }
        }
    }
    tickStatusEffects() {
        let before2 = [null, null]
        for (let i = 2; i < this.stats.length; i++) {
            before2[i] = this.stats[i]
        }
        let before
        for (let i = 0; i < this.statusEffects.length; i++) {
            this.statusEffects[i].length--
            switch (this.statusEffects[i].effectType) {
                case 'poison':
                    console.log(`${this.name} takes poison damage! (${this.statusEffects[i].length} turns, ${Math.ceil(this.statusEffects[i].strength)} base damage)`)
                    this.damage(this.id, this.statusEffects[i].strength, 'p', Infinity, 1, [ELEMENTS.Poison], [0, 1])
                    break;
                case 'burn':
                    console.log(`${this.name} takes burn damage! (${this.statusEffects[i].length} turns, ${Math.ceil(this.statusEffects[i].strength * this.statusEffects[i].length)}↓ base damage)`)
                    this.damage(this.id, this.statusEffects[i].strength * this.statusEffects[i].length, 'p', Infinity, 1, [ELEMENTS.Fire], [0, 1])
                    break;
                case 'stun':
                    console.log(`${this.name} is stunned! (${this.statusEffects[i].length} turns)`)
                    break;
                case 'slow':
                    before = Math.ceil(before2[6])
                    before2[6] *= this.statusEffects[i].strength
                    console.log(`${this.name}'s SPD is ${Math.ceil(before2[6]) - before} (${this.statusEffects[i].length} turns, ${this.statusEffects[i].strength}x effect)`)
                    break;
                case 'patkInc':
                case 'patkDec':
                    before = Math.ceil(before2[2])
                    before2[2] *= this.statusEffects[i].strength
                    console.log(`${this.name}'s PATK is ${Math.ceil(before2[2]) - before >= 1 ? '+' : ''}${Math.ceil(before2[2]) - before} (${this.statusEffects[i].length} turns, ${this.statusEffects[i].strength}x effect)`)
                    break;
                case 'pdefInc':
                case 'pdefDec':
                    before = Math.ceil(before2[3])
                    before2[3] *= this.statusEffects[i].strength
                    console.log(`${this.name}'s PDEF is ${Math.ceil(before2[3]) - before >= 1 ? '+' : ''}${Math.ceil(before2[3]) - before} (${this.statusEffects[i].length} turns, ${this.statusEffects[i].strength}x effect)`)
                    break;
                case 'matkInc':
                case 'matkDec':
                    before = Math.ceil(before2[4])
                    before2[4] *= this.statusEffects[i].strength
                    console.log(`${this.name}'s MATK is ${Math.ceil(before2[4]) - before >= 1 ? '+' : ''}${Math.ceil(before2[4]) - before} (${this.statusEffects[i].length} turns, ${this.statusEffects[i].strength}x effect)`)
                    break;
                case 'mdefInc':
                case 'mdefDec':
                    before = Math.ceil(before2[5])
                    before2[5] *= this.statusEffects[i].strength
                    console.log(`${this.name}'s MDEF is ${Math.ceil(before2[5]) - before >= 1 ? '+' : ''}${Math.ceil(before2[5]) - before} (${this.statusEffects[i].length} turns, ${this.statusEffects[i].strength}x effect)`)
                    break;
                default:
                    throw new Error(`${this.statusEffects[i].effectType} is not a valid status effect`)
            }
            if (this.statusEffects[i].length < 1) {
                this.statusEffects.splice(i, 1)
                i--
            }
        }
    }
    heal(who, healing) {
        damageQueue.push(
            {
                type: 1,
                who: who,
                amount: healing,
                fromWhom: this.id,
            }
        )
    }
    damage(who, damage, type, acc, pierce, elements, crit = [[10, 2]], effectList = []) {
        damageQueue.push(
            {
                type: 0,
                who: who,
                amount: damage,
                fromWhom: this.id,
                atkType: type,
                accuracy: acc,
                defPierce: pierce,
                elements: elements,
                crit: crit,
                statusEffectList: effectList
            }
        )
    }
    damageScript(damage) {
        this.gp += (Math.max(damage, 0) / (this.stats[0])) * 5
        switch (this.internalType) {
            case 'fsblue':
            case 'dessb':
            case 'cauli':
            case 'auroram':
                if (this.trueStats[0] <= 0) {
                    this.trueStats[0] = 0
                    if (this.alive) {
                        console.error(`${this.name} was defeated!`)
                    }
                    this.alive = false
                }
                break;
            case 'imartiz':
                this.heal(this.id, Math.min(Math.max(damage, 0) * 0.5, this.trueStats[1] * 0.25))
                this.trueStats[1] -= Math.min(Math.max(damage, 0) * 0.5, this.trueStats[1] * 0.25)
                break;
            case 'gslime':
            case 'rslime':
            case 'yslime':
            case 'bslime':
            case 'dslime':
                if (this.trueStats[0] <= 0) {
                    this.trueStats[0] = 0
                    if (this.alive) {
                        console.error(`${this.name} was defeated! They gained ${Math.floor(this.xpGain)} XP!`)
                    }
                    this.alive = false
                    for (let i = 0; i < characters.length; i++) {
                        if (characters[i].team === 0) {
                            characters[i].xp += this.xpGain
                            characters[i].levelUp()
                        }
                    }
                }
                break;
            default:
                console.warn(`internal type ${this.internalType} does not exist in damageScript`)
        }
    }
    response(response) {
        if (response.state === 'hit') {
            this.gp += (Math.max(response.damage, 0) / (this.trueStats[2] + this.trueStats[4])) * 8
        }
        switch (this.internalType) {
            case 'fsblue':
            case 'dessb':
            case 'imartiz':
            case 'cauli':
            case 'auroram':
            case 'gslime':
            case 'rslime':
            case 'yslime':
            case 'bslime':
                break;
            case 'dslime':
                if (this.state === 1 && response.state === 'hit') {
                    this.heal(this.id, response.damage * 0.5)
                }
                this.state = 0
                break;
            default:
                console.warn(`internal type ${this.internalType} does not exist in responseScript`)
        }
    }
}

// 0   1   2     3     4     5     6    7    8
// hp, mp, patk, pdef, matk, mdef, spd, acc, eva
let characters = [//             HP  MP  PA  PD  MA  MD  SP  AC  EV
    new Character("FSBlue",     [40, 8,  16, 12, 3,  3,  15, 9,  5 ], 1, 0, 0, 'fsblue',   pronouns_list[1], [ELEMENTS.Fighting], [15, 15, 4], true),
    new Character("DesSB",      [12, 16, 14, 7,  15, 9,  20, 14, 13], 1, 0, 0, 'dessb',    pronouns_list[0], [ELEMENTS.Fairy],    [10, 12, 3], true),
    new Character("I. Martiz",  [45, 14, 8,  15, 5,  14, 8,  12, 6 ], 1, 0, 0, 'imartiz',  pronouns_list[0], [ELEMENTS.Fairy],    [15, 12, 4], true),
    new Character("Cauli",      [25, 15, 22, 10, 17, 9,  4,  20, 3 ], 1, 0, 0, 'cauli',    pronouns_list[0], [ELEMENTS.Grass],    [16, 15, 5], true),
    new Character("Aurora:M",   [15, 30, 4,  7,  20, 15, 8,  12, 10], 1, 0, 0, 'auroram',  pronouns_list[1], [ELEMENTS.Fire],     [13, 12, 4], true),
]

const ENEMIES = {
    gslime: {
        name: 'Green Slime',
        HP: 45,
        MP: 7,
        PATK: 6,
        PDEF: 3,
        MATK: 5,
        MDEF: 2,
        SPD: 11,
        ACC: 7,
        EVA: 7,
        XP: 4,
        Level: 1,
        pronouns: 'random',
        elements: [ELEMENTS.Grass]
    },
    rslime: {
        name: 'Red Slime',
        HP: 40,
        MP: 16,
        PATK: 5,
        PDEF: 2,
        MATK: 9,
        MDEF: 3,
        SPD: 8,
        ACC: 5,
        EVA: 8,
        XP: 5.5,
        Level: 1,
        pronouns: 'random',
        elements: [ELEMENTS.Fire]
    },
    yslime: {
        name: 'Yellow Slime',
        HP: 30,
        MP: 12,
        PATK: 8,
        PDEF: 1,
        MATK: 9,
        MDEF: 2,
        SPD: 17,
        ACC: 7,
        EVA: 15,
        XP: 4.5,
        Level: 1,
        pronouns: 'random',
        elements: [ELEMENTS.Electric]
    },
    bslime: {
        name: 'Blue Slime',
        HP: 60,
        MP: 10,
        PATK: 4,
        PDEF: 6,
        MATK: 4,
        MDEF: 7,
        SPD: 5,
        ACC: 10,
        EVA: 2,
        XP: 5,
        Level: 1,
        pronouns: 'random',
        elements: [ELEMENTS.Water]
    },
    dslime: {
        name: 'Dark Slime',
        HP: 110,
        MP: 40,
        PATK: 5,
        PDEF: 8,
        MATK: 12,
        MDEF: 12,
        SPD: 16,
        ACC: 15,
        EVA: 20,
        XP: 12,
        Level: 4,
        pronouns: 'random',
        elements: [ELEMENTS.Dark]
    },
}

function spawnEnemy(id, statModif) {
    let enemy = ENEMIES[id]
    characters.push(new Character(enemy.name, [enemy.HP * statModif, enemy.MP * statModif, enemy.PATK * statModif, enemy.PDEF * statModif, enemy.MATK * statModif, enemy.MDEF * statModif, enemy.SPD * statModif, enemy.ACC * statModif, enemy.EVA * statModif], enemy.Level, enemy.XP * statModif * statModif, 1, id, enemy.pronouns === 'random' ? pronouns_list[Math.floor(Math.random() * 3)] : enemy.pronouns, enemy.elements, [Infinity, Infinity, Infinity], false))
}

let characterListFixed = []
getCharacterList()

try {
    clearInterval(ok)
} catch {
    
}

function hasStatusEffect(id, effectID) {
    let character = getCharacter(id)
    for (let i = 0; i < character.statusEffects.length; i++) {
        if (character.statusEffects[i].effectType === effectID) {
            return true;
        }
    }
    return false;
}

let ok = setInterval(doThing, 50)
let wave = 0
let rng = []
let tmp = []

function doThing() {
    timer += 50
    let enemies = 0
    let players = 0

    for (let i = 0; i < characters.length; i++) {
        if (characters[i].team !== 0 && characters[i].alive) {
            enemies++
        }
        if (characters[i].team === 0 && characters[i].alive) {
            players++
        }
    }
    if (players === 0) {
        console.error(`\nGame Over!`)
        wave = 0
        for (let i = 0; i < characters.length; i++) {
            if (characters[i].team !== 0) {
                characters.splice(i, 1)
                i--
            }
            if (characters[i].team === 0) {
                characters[i].trueStats[0] = characters[i].stats[0]
                characters[i].trueStats[1] = characters[i].stats[1]
                characters[i].alive = true
                characters[i].gp = 0
                characters[i].statusEffects = []
            }
        }
        nextAction += 5000
    }

    if (enemies === 0 && wave < 999) {
        for (let i = 0; i < characters.length; i++) {
            if (characters[i].team !== 0) {
                characters.splice(i, 1)
                i--
            }
        }
        wave++
        console.warn(`<| Wave ${wave}! |>`)
        turnNum = 0
        if (wave >= 1 && wave < 999) {
            rng[0] = Math.random()
            if (rng[0] < 0.75 && rng[0] > 0.00) {
                rng[1] = Math.floor(Math.random() * 3) + 1
                for (let i = 0; i < rng[1]; i++) {
                    rng[2] = 0.8 + 0.4 * Math.random()
                    rng[3] = Math.floor(Math.random() * 4)
                    spawnEnemy(['gslime', 'rslime', 'yslime', 'bslime'][rng[3]], rng[2])
                }
            }
            if (rng[0] < 0.85 && rng[0] > 0.75) {
                rng[2] = 0.8 + 0.4 * Math.random()
                spawnEnemy('dslime', rng[2])
            }
            if (rng[0] < 0.93 && rng[0] > 0.85) {
                spawnEnemy('dslime', rng[2])
                rng[1] = Math.floor(Math.random() * 3) + 1
                for (let i = 0; i < rng[1]; i++) {
                    rng[2] = 0.8 + 0.4 * Math.random()
                    rng[3] = Math.floor(Math.random() * 4)
                    spawnEnemy(['gslime', 'rslime', 'yslime', 'bslime'][rng[3]], rng[2])
                }
            }
            if (rng[0] < 0.96 && rng[0] > 0.93) {
                rng[1] = Math.floor(Math.random() * 4) + 1
                for (let i = 0; i < rng[1]; i++) {
                    rng[2] = 0.8 + 0.4 * Math.random()
                    rng[3] = Math.floor(Math.random() * 4)
                    spawnEnemy(['gslime', 'rslime', 'yslime', 'bslime', 'dslime'][rng[3]], rng[2])
                }
            }
            if (rng[0] < 0.99 && rng[0] > 0.96) {
                rng[1] = Math.floor(Math.random() * 10) + 1
                for (let i = 0; i < rng[1]; i++) {
                    rng[2] = 0.8 + 0.4 * Math.random()
                    rng[3] = Math.floor(Math.random() * 4)
                    spawnEnemy(['gslime', 'rslime', 'yslime', 'bslime'][rng[3]], rng[2])
                }
            }
            if (rng[0] < 1.00 && rng[0] > 0.99) {
                rng[1] = Math.floor(Math.random() * 3) + 1
                for (let i = 0; i < rng[1]; i++) {
                    rng[2] = 0.8 + 0.4 * Math.random()
                    spawnEnemy('dslime', rng[2])
                }
            }

            getCharacterList()
        }
        turnOrder = []
        state = 0
    }

    if (turnOrder.length === 0) {
        console.log(`\n`)
        for (let i = 0; i < characters.length; i++) {
            characters[i].tickStatusEffects()
        }

        let sides = [[], []]
        for (let i = 0; i < characters.length; i++) {
            sides[characters[i].team].push(characters[i].id)
        }

        console.log(`\n`)
        console.log(`Players         | Level | HP          | MP          | XP          | GP`)
        for (let i = 0; i < sides[0].length; i++) {
            displayCharacter(sides[0][i], 0)
        }
        console.log(`\n`)
        console.log(`Enemies         | Level | HP          | MP          | GP`)
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
        turnOrder.sort((a, b) => b.trueStats[6] - a.trueStats[6]);
        console.warn(`<| Turn ${turnNum} |>`)

        for (let i = 0; i < characters.length; i++) {
            let before = Math.ceil(characters[i].trueStats[1])
            characters[i].trueStats[1] = Math.min(characters[i].stats[1], characters[i].trueStats[1] + (characters[i].stats[1] * 0.075))
            if (Math.ceil(characters[i].trueStats[1]) - before >= 1) { console.log(`${characters[i].name} regained ${Math.ceil(characters[i].trueStats[1]) - before} MP!`) }
        }

        nextAction = timer + 1000
    }
    
    if (timer >= nextAction) {
        if (state === -1) {
            turnOrder.splice(0, 1)
            state = 0
        }
        if (turnOrder.length > 0) {
            if (!getCharacter(turnOrder[0].id).alive || hasStatusEffect(turnOrder[0].id, 'stun')) {
                if (hasStatusEffect(turnOrder[0].id, 'stun')) {
                    console.log(`${getCharacter(turnOrder[0].id).name} is stunned and cannot move!`)
                    getCharacter(turnOrder[0].id).doStatusEffects()
                }
                state = -1
            } else {
                console.log(`\n`)
                let currChar = getCharacter(turnOrder[0].id)
                let target
                switch (currChar.internalType) {
                    case 'fsblue':
                        if (state === 0) {
                            let moveFind = false
                            let iterations = 0
                            while (!moveFind) {
                                iterations++
                                if (iterations >= 1000) {
                                    throw new Error(`[ERROR] ${currChar.name} got stuck!`)
                                }
        
                                rng[0] = Math.floor(Math.random() * 5)
                                if (rng[0] === 0) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} strongly punches ${getCharacter(target).name}!`)
                                    currChar.damage(target, 1.0 * currChar.trueStats[2], 'p', currChar.trueStats[7], 0, [ELEMENTS.Fighting])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 1) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} comboes ${getCharacter(target).name}!`)
                                    tmp = [3, target]
                                    moveFind = true
                                    state = 1
                                }
                                if (rng[0] === 2 && currChar.trueStats[1] >= 5) {
                                    target = getAllies(currChar.team, true, false)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} buffs up ${target === currChar.id ? currChar.pronouns[3] : getCharacter(target).name}!`)
                                    currChar.damage(target, 0, 'p', Infinity, 0, [], [0, 1], [{effectType: 'patkInc', strength: 1.333, length: Math.floor(Math.random() * 3) + 2}])

                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                    currChar.trueStats[1] -= 5
                                }
                                if (rng[0] === 3 && currChar.trueStats[1] >= 4) {
                                    if (Math.random() > (currChar.trueStats[0] / currChar.stats[0])) {
                                        break;
                                    }
                                    console.log(`${currChar.name} uses her weak healing to try to heal ${currChar.pronouns[3]}...`)
                                    currChar.heal(currChar.id, 0.5 * currChar.trueStats[4])

                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                    currChar.trueStats[1] -= 4
                                }
                                if (rng[0] === 4 && currChar.gp >= 100) {
                                    currChar.gp -= 100
                                    target = getTargets(currChar.team)
                                    let lowestHP = {hp: Infinity, id: 0}
                                    for (let enemy = 0; enemy < target.length; enemy++) {
                                        if (lowestHP.hp > getCharacter(target[enemy]).trueStats[0] / getCharacter(target[enemy]).stats[0]) {
                                            lowestHP.hp = getCharacter(target[enemy]).trueStats[0] / getCharacter(target[enemy]).stats[0]
                                            lowestHP.id = target[enemy]
                                        }
                                    }
                                    target = lowestHP.id

                                    console.log(`${currChar.name} unleashes her ultimate attack: SUPERSTAR STRIKE!`)
                                    tmp = [1, 0, target]
                                    moveFind = true
                                    state = 2
                                    nextAction += 2000
                                }
                            }
                        }
                        if (state === 1) {
                            currChar.damage(tmp[1], 0.4 * currChar.trueStats[2], 'p', currChar.trueStats[7], 0, [ELEMENTS.Fighting])
                            nextAction += 750
                            tmp[0]--
                            if (tmp[0] < 1) {
                                state = -1
                                nextAction += 3000
                            }
                        }
                        if (state === 2) {
                            if (!getCharacter(tmp[2]).alive) {
                                tmp[2] = getTargets(currChar.team)
                                let lowestHP = {hp: Infinity, id: 0}
                                for (let enemy = 0; enemy < tmp[2].length; enemy++) {
                                    if (lowestHP.hp > getCharacter(tmp[2][enemy]).trueStats[0] / getCharacter(tmp[2][enemy]).stats[0]) {
                                        lowestHP.hp = getCharacter(tmp[2][enemy]).trueStats[0] / getCharacter(tmp[2][enemy]).stats[0]
                                        lowestHP.id = tmp[2][enemy]
                                    }
                                }
                                tmp[2] = lowestHP.id
                            }
                            if (tmp[0] <= 0) {
                                if (tmp[1] === 4) {
                                    tmp[0] = 1
                                    tmp[1] = 5
                                    nextAction += 2000
                                }
                                if (tmp[1] === 3) {
                                    tmp[0] = 5
                                    tmp[1] = 4
                                }
                                if (tmp[1] === 2) {
                                    tmp[0] = 4
                                    tmp[1] = 3
                                }
                                if (tmp[1] === 1) {
                                    tmp[0] = 3
                                    tmp[1] = 2
                                }
                                if (tmp[1] === 0) {
                                    tmp[0] = 3
                                    tmp[1] = 1
                                }
                            }
                            if (tmp[1] === 0) {
                                let EM = []
                                if (Math.random() < 0.25) {
                                    EM = [
                                        {
                                            effectType: 'pdefDec',
                                            strength: 0.833,
                                            length: 2
                                        }
                                    ]
                                }
                                currChar.damage(tmp[2], 0.8 * currChar.trueStats[2], 'p', currChar.trueStats[7] * 1.5, 0, [ELEMENTS.Fighting], [[10, 2]], EM)
                                nextAction += 1500
                                tmp[0]--
                            }
                            if (tmp[1] === 1) {
                                let EM = []
                                if (Math.random() < 0.1) {
                                    EM = [
                                        {
                                            effectType: 'pdefDec',
                                            strength: 0.833,
                                            length: 2
                                        }
                                    ]
                                }
                                currChar.damage(tmp[2], 0.3 * currChar.trueStats[2], 'p', currChar.trueStats[7] * 1.5, 0, [ELEMENTS.Fighting], [[10, 2]], EM)
                                nextAction += 150
                                tmp[0]--
                            }
                            if (tmp[1] === 2) {
                                let EM = []
                                if (Math.random() < 0.1) {
                                    EM = [
                                        {
                                            effectType: 'pdefDec',
                                            strength: 0.833,
                                            length: 2
                                        }
                                    ]
                                }
                                currChar.damage(tmp[2], 0.5 * currChar.trueStats[2], 'p', currChar.trueStats[7] * 1.5, 0, [ELEMENTS.Fighting], [[10, 2]], EM)
                                nextAction += 250
                                tmp[0]--
                            }
                            if (tmp[1] === 3) {
                                let EM = []
                                if (Math.random() < 0.1) {
                                    EM = [
                                        {
                                            effectType: 'pdefDec',
                                            strength: 0.833,
                                            length: 2
                                        }
                                    ]
                                }
                                currChar.damage(tmp[2], 0.4 * currChar.trueStats[2], 'p', currChar.trueStats[7] * 1.5, 0, [ELEMENTS.Fighting], [[10, 2]], EM)
                                nextAction += 200
                                tmp[0]--
                            }
                            if (tmp[1] === 4) {
                                let EM = []
                                if (Math.random() < 0.1) {
                                    EM = [
                                        {
                                            effectType: 'pdefDec',
                                            strength: 0.833,
                                            length: 2
                                        }
                                    ]
                                }
                                currChar.damage(tmp[2], 0.3 * currChar.trueStats[2], 'p', currChar.trueStats[7] * 1.5, 0, [ELEMENTS.Fighting], [[10, 2]], EM)
                                nextAction += 150
                                tmp[0]--
                            }
                            if (tmp[1] === 5) {
                                currChar.damage(tmp[2], 1.3 * currChar.trueStats[2], 'p', currChar.trueStats[7] * 2, 0, [ELEMENTS.Fighting], [[100, 2], [10, 5]])
                                nextAction += 2000
                                tmp[0]--
                                state = -1
                            }
                        }
                        break;
                    case 'dessb':
                        if (state === 0) {
                            let moveFind = false
                            let iterations = 0
                            while (!moveFind) {
                                iterations++
                                if (iterations >= 1000) {
                                    throw new Error(`[ERROR] ${currChar.name} got stuck!`)
                                }
        
                                rng[0] = Math.floor(Math.random() * 4)
                                let averageTeamHP = 0
                                let allies = []
                                for (let i = 0; i < characters.length; i++) {
                                    if (characters[i].team === currChar.team && characters[i].alive) {
                                        allies.push(characters[i].id)
                                    }
                                }
                                for (let tg = 0; tg < allies.length; tg++) {
                                    averageTeamHP += (getCharacter(allies[tg]).trueStats[0] / getCharacter(allies[tg]).stats[0]) / allies.length
                                }
                                if (averageTeamHP < 0.5 || (currChar.trueStats[0] / currChar.stats[0] < 0.5)) {
                                    rng[0] = Math.floor(4 - (Math.random() * (Math.random() * 4)))
                                }
                                if (rng[0] === 0) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} kicks ${getCharacter(target).name}!`)
                                    currChar.damage(target, 0.6 * currChar.trueStats[2], 'p', currChar.trueStats[7], 0, [ELEMENTS.Fighting])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 1) {
                                    target = getTargets(currChar.team)
                                    if (Math.random() > 0.35 * (3 - target.length)) {
                                        break;
                                    }
                                    console.log(`${currChar.name} swipes the opposing team with chocolate!`)
                                    for (let i = 0; i < target.length; i++) {
                                        currChar.damage(target[i], 0.35 * currChar.trueStats[4], 'm', currChar.trueStats[7], 0, [ELEMENTS.Fairy])
                                    }
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 2 && currChar.trueStats[1] >= 2) {
                                    target = getAllies(currChar.team)
                                    if (target.length < 1) {
                                        break;
                                    }
                                    let lowest = [1, 0]
                                    for (let tg = 0; tg < target.length; tg++) {
                                        if (lowest[0] > getCharacter(target[tg]).trueStats[0] / getCharacter(target[tg]).stats[0]) {
                                            lowest = [getCharacter(target[tg]).trueStats[0] / getCharacter(target[tg]).stats[0], tg]
                                        }
                                    }
                                    target = lowest[1]
                                    console.log(`${currChar.name} feeds ${getCharacter(target).name} chocolate!`)
                                    currChar.heal(target, 0.4 * currChar.trueStats[4])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                    currChar.trueStats[1] -= 2
                                }
                                if (rng[0] === 3 && currChar.trueStats[1] >= 7) {
                                    target = getAllies(currChar.team)
                                    if (target.length < 1) {
                                        break;
                                    }

                                    let avg = 0
                                    for (let tg = 0; tg < target.length; tg++) {
                                        avg += (getCharacter(target[tg]).trueStats[0] / getCharacter(target[tg]).stats[0]) / target.length
                                    }

                                    if (Math.random() > avg) {
                                        break;
                                    }

                                    console.log(`${currChar.name} puts a protective chocolatey structure around ${currChar.pronouns[2]} teammates!`)
                                    for (let i = 0; i < target.length; i++) {
                                        currChar.damage(target[i], 0, 'm', Infinity, 0, [ELEMENTS.Fairy], [0, 1], [{effectType: 'pdefInc', strength: 1.333, length: 3}, {effectType: 'mdefInc', strength: 1.333, length: 3}])
                                    }
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                    currChar.trueStats[1] -= 7
                                }   
                            }
                        }
                        break;
                    case 'imartiz':
                        if (state === 0) {
                            let moveFind = false
                            let iterations = 0
                            while (!moveFind) {
                                iterations++
                                if (iterations >= 1000) {
                                    throw new Error(`[ERROR] ${currChar.name} got stuck!`)
                                }
        
                                rng[0] = Math.floor(Math.random() * 2)
                                let averageTeamHP = 0
                                let allies = []
                                for (let i = 0; i < characters.length; i++) {
                                    if (characters[i].team === currChar.team && characters[i].alive) {
                                        allies.push(characters[i].id)
                                    }
                                }
                                for (let tg = 0; tg < allies.length; tg++) {
                                    averageTeamHP += (getCharacter(allies[tg]).trueStats[0] / getCharacter(allies[tg]).stats[0]) / allies.length
                                }
                                if (rng[0] === 0) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} slams ${getCharacter(target).name} with ${currChar.pronouns[2]} tail!`)
                                    currChar.damage(target, 1.0 * currChar.trueStats[2], 'p', currChar.trueStats[7], 0, [])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 1) {
                                    target = getAllies(currChar.team)
                                    if (target.length < 1) {
                                        break;
                                    }
                                    let lowest = [1, 0, 0]
                                    for (let tg = 0; tg < target.length; tg++) {
                                        if (lowest[0] > getCharacter(target[tg]).trueStats[0] / getCharacter(target[tg]).stats[0]) {
                                            lowest = [getCharacter(target[tg]).trueStats[0] / getCharacter(target[tg]).stats[0], tg, getCharacter(target[tg]).stats[0]]
                                        }
                                    }
                                    target = lowest[1]
                                    let healing = Math.min(0.5 * currChar.trueStats[1], lowest[2] * 0.5 * (1 - lowest[0]))

                                    console.log(`${currChar.name} uses ${currChar.pronouns[2]} tail to heal ${getCharacter(target).name}!`)
                                    currChar.heal(target, healing)
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                    currChar.trueStats[1] -= healing
                                }
                            }
                        }
                        break;
                    case 'cauli':
                        if (state === 0) {
                            let moveFind = false
                            let iterations = 0
                            while (!moveFind) {
                                iterations++
                                if (iterations >= 1000) {
                                    throw new Error(`[ERROR] ${currChar.name} got stuck!`)
                                }
        
                                if (currChar.state === 0) {
                                    currChar.state = {move: null, moveName: null, turns: 0, targets: [], lifeSteal: false}
                                }
                                if (currChar.state.move === null) {
                                    rng[0] = Math.floor(Math.random() * 2)
                                    if (rng[0] === 0) {
                                        currChar.state = {move: 'gigaDrain', moveName: 'giga drain', turns: 2, targets: [], lifeSteal: false}
                                        target = getTargets(currChar.team)
                                        target = target[Math.floor(Math.random() * target.length)]
                                        console.log(`${currChar.name} slams ${getCharacter(target).name} with ${currChar.pronouns[2]} tail!`)
                                        currChar.damage(target, 1.0 * currChar.trueStats[2], 'p', currChar.trueStats[7], 0, [])
            
                                        nextAction += 5000
                                        moveFind = true
                                        state = -1
                                    }
                                } else {
                                    currChar.state.turns--
                                    if (currChar.state.turns <= 0) {
                                        if (currChar.state.move === 'gigaDrain') {

                                        }
                                    } else {
                                        console.log(`${currChar.name} is still charging ${currChar.state.moveName}... (${currChar.state.turns} turns left)`)
                                        currChar.state.targets[0] = getTargets(currChar.team)
                                        let lowestHP = {hp: Infinity, id: 0}
                                        for (let enemy = 0; enemy < currChar.state.targets[0].length; enemy++) {
                                            if (lowestHP.hp > getCharacter(currChar.state.targets[0][enemy]).trueStats[0] / getCharacter(currChar.state.targets[0][enemy]).stats[0]) {
                                                lowestHP.hp = getCharacter(currChar.state.targets[0][enemy]).trueStats[0] / getCharacter(currChar.state.targets[0][enemy]).stats[0]
                                                lowestHP.id = currChar.state.targets[0][enemy]
                                            }
                                        }
                                        currChar.state.targets[0] = lowestHP.id
                                    }
                                }
                            }
                        }
                        break;
                    case 'gslime':
                    case 'rslime':
                    case 'yslime':
                    case 'bslime':
                        if (state === 0) {
                            let moveFind = false
                            let iterations = 0
                            while (!moveFind) {
                                iterations++
                                if (iterations >= 1000) {
                                    throw new Error(`[ERROR] ${currChar.name} got stuck!`)
                                }
        
                                rng[0] = Math.floor(Math.random() * 3)
                                if (rng[0] === 0) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} jumps on ${getCharacter(target).name}!`)
                                    currChar.damage(target, 0.75 * currChar.trueStats[2], 'p', currChar.trueStats[7], 0, [ELEMENTS.Normal])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 1) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} ${{
                                        gslime: 'fires a Leaf Storm at', 
                                        rslime: 'unleashes a fire pillar from under', 
                                        yslime: 'strikes thunder on', 
                                        bslime: 'drenches'
                                    }[currChar.internalType]} ${getCharacter(target).name}!`)
                                    currChar.damage(target, 0.75 * currChar.trueStats[4], 'm', currChar.trueStats[7], 0, [{
                                        gslime: ELEMENTS.Grass, 
                                        rslime: ELEMENTS.Fire, 
                                        yslime: ELEMENTS.Electric, 
                                        bslime: ELEMENTS.Water
                                    }[currChar.internalType]])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 2 && currChar.trueStats[1] >= 4) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} ${{
                                        gslime: 'attempts to hit ' + getCharacter(target).name + ' with a toxic bite!', 
                                        rslime: 'tries to burn ' + getCharacter(target).name + '!', 
                                        yslime: 'attempts to strike ' + getCharacter(target).name + ' with electrostatic discharge!', 
                                        bslime: 'tries to overwhelm ' + getCharacter(target).name + ' with water!'
                                    }[currChar.internalType]}`)

                                    let EM = []
                                    if (Math.random() >= 0.5) {
                                        EM = [
                                            {
                                                effectType:{
                                                    gslime: 'poison', 
                                                    rslime: 'burn', 
                                                    yslime: 'stun', 
                                                    bslime: 'slow'
                                                }[currChar.internalType],
                                                strength: {
                                                    gslime: 0.2 * currChar.trueStats[2], 
                                                    rslime: 0.1 * currChar.trueStats[4], 
                                                    yslime: 1.0, 
                                                    bslime: 0.5
                                                }[currChar.internalType],
                                                length: Math.ceil((1 + Math.random() * 2) * (currChar.internalType === 'yslime' ? 0.5 : 1))
                                            }
                                        ]
                                    }
                                    currChar.damage(target, 0.5 * currChar.trueStats[2], 'p', currChar.trueStats[7], 0, [{
                                        gslime: ELEMENTS.Poison, 
                                        rslime: ELEMENTS.Fire, 
                                        yslime: ELEMENTS.Electric, 
                                        bslime: ELEMENTS.Water
                                    }[currChar.internalType]], [[10, 2]], EM)

                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                    currChar.trueStats[1] -= 4
                                }
                            }
                        }
                        break;
                    case 'dslime':
                        if (state === 0) {
                            let moveFind = false
                            let iterations = 0
                            while (!moveFind) {
                                iterations++
                                if (iterations >= 1000) {
                                    throw new Error(`[ERROR] ${currChar.name} got stuck!`)
                                }
        
                                rng[0] = Math.floor(Math.random() * 5)
                                if (rng[0] === 0) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} jumps on ${getCharacter(target).name}!`)
                                    currChar.damage(target, 0.9 * currChar.trueStats[2], 'p', currChar.trueStats[7], 0, [ELEMENTS.Dark])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 1) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} absorbs ${getCharacter(target).name}!`)
                                    currChar.state = 1
                                    currChar.damage(target, 0.45 * currChar.trueStats[4], 'm', currChar.trueStats[7], 0, [ELEMENTS.Dark])
        
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                }
                                if (rng[0] === 2 && currChar.trueStats[1] >= 5) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} slams down on ${getCharacter(target).name}!`)

                                    currChar.damage(target, 1.2 * currChar.trueStats[2], 'p', currChar.trueStats[7], 0, [ELEMENTS.Dark])

                                    let lastTarget = target
                                    target = getTargets(currChar.team)
                                    for (let i = 0; i < target.length; i++) {
                                        if (target[i] === lastTarget) { continue; }
                                        currChar.damage(target[i], 0.24 * currChar.trueStats[4], 'm', currChar.trueStats[7] * 0.5, 0, [ELEMENTS.Dark])
                                    }
                                    
                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                    currChar.trueStats[1] -= 5
                                }
                                if (rng[0] === 3 && currChar.trueStats[1] >= 3) {
                                    console.log(`${currChar.name} reinforces ${currChar.pronouns[3]}!`)
                                    currChar.damage(currChar.id, 0, 'p', Infinity, 0, [], [0, 1], [{effectType: 'pdefInc', strength: 1 + 0.1 * (Math.floor(Math.random() * 3) + 2), length: 3}])

                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                    currChar.trueStats[1] -= 3
                                }
                                if (rng[0] === 4 && currChar.trueStats[1] >= 9) {
                                    target = getTargets(currChar.team)
                                    target = target[Math.floor(Math.random() * target.length)]
                                    console.log(`${currChar.name} blasts a beam of dark energy at ${getCharacter(target).name}!`)

                                    currChar.damage(target, 1.75 * currChar.trueStats[2], 'm', currChar.trueStats[7], 0, [ELEMENTS.Dark])

                                    nextAction += 5000
                                    moveFind = true
                                    state = -1
                                    currChar.trueStats[1] -= 9
                                }
                            }
                        }
                        break;
                    default:
                        throw new Error(`internal type ${currChar.internalType} is not a valid type`)
                }
                currChar.doStatusEffects()
            }
        }
    }
    doDamageQueue()
}


function getTargets(team, alive = true) {
    let targets = []
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].team !== team && (characters[i].alive || !alive)) {
            targets.push(characters[i].id)
        }
    }
    return targets
}

function getAllies(team, alive = true, fullHeal = true) {
    let targets = []
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].team === team && (characters[i].alive || !alive) && ((characters[i].trueStats[0] < characters[i].stats[0]) || !fullHeal)) {
            targets.push(characters[i].id)
        }
    }
    return targets
}

function doDamageQueue() {
    for (let i = 0; i < damageQueue.length; i++) {
        let currQueue = damageQueue[i]

        if (currQueue.type === 0) {
            if (Math.random() >= dodgeFormula(currQueue.accuracy, getCharacter(currQueue.who).trueStats[8])) {
                console.log(`${getCharacter(currQueue.who).name} dodges the attack!`)
                getCharacter(currQueue.fromWhom).response({state: "dodge", damage: null, effects: null})
                continue;
            }

            let typeEff = getTypeEffective(currQueue.elements, getCharacter(currQueue.who).elements)
            let DM = damageFormula(currQueue.amount, (1 - currQueue.defPierce) * getCharacter(currQueue.who).trueStats[currQueue.atkType === "p" ? 3 : 5])
            DM *= 0.75 + 0.5 * Math.random()

            let critRand = Math.random() * 100
            for (let j = currQueue.crit.length - 1; j >= 0; j--) {
                if (critRand <= currQueue.crit[j][0]) {
                    console.log(`%c${['Critical', 'DEADLY', 'HOLY'][j]}%c hit! (${currQueue.crit[j][1]}x)`, 'font-weight: bold;', 'font-weight: normal;')
                    DM *= currQueue.crit[j][1]
                    break;
                }
            }

            let EM = currQueue.statusEffectList

            // do character specific things here

            // end character specific things here

            if (isNaN(DM)) {
                console.error(`typeEff: ${getTypeEffective(currQueue.elements, getCharacter(currQueue.who).elements)}`)
                console.error(`base damage: ${currQueue.amount}`)
                console.error(`pierce: ${currQueue.defPierce}`)
                console.error(`defense: ${getCharacter(currQueue.who).trueStats[currQueue.atkType === "p" ? 3 : 5]}`)
                console.error(`damage: ${damageFormula(currQueue.amount, (1 - currQueue.defPierce) * getCharacter(currQueue.who).trueStats[currQueue.atkType === "p" ? 3 : 5])}`)
                throw new Error("Oh no damage is NaN")
            }

            let before = Math.ceil(getCharacter(currQueue.who).trueStats[0])
            getCharacter(currQueue.who).trueStats[0] -= DM


            if (currQueue.amount > 0) {
                if (typeEff <= 0) {
                    console.log(`${getCharacter(currQueue.who).name} is immune...`)
                } else if (typeEff < 1) {
                    console.log(`${getCharacter(currQueue.who).name} suffers %c${format(before - Math.ceil(getCharacter(currQueue.who).trueStats[0]), 2)}%c not very effective damage... (${typeEff}x)`, 'font-weight: bold;', 'font-weight: normal;')
                } else if (typeEff === 1) {
                    console.log(`${getCharacter(currQueue.who).name} suffers %c${format(before - Math.ceil(getCharacter(currQueue.who).trueStats[0]), 2)}%c damage!`, 'font-weight: bold;', 'font-weight: normal;')
                } else if (typeEff > 1) {
                    console.log(`${getCharacter(currQueue.who).name} suffers %c${format(before - Math.ceil(getCharacter(currQueue.who).trueStats[0]), 2)}%c super effective damage!! (${typeEff}x)`, 'font-weight: bold;', 'font-weight: normal;')
                }
    
                getCharacter(currQueue.who).damageScript(DM)
                getCharacter(currQueue.fromWhom).response({state: "hit", damage: DM, effects: null})
            }

            for (let j = 0; j < EM.length; j++) {
                console.log(`${getCharacter(currQueue.who).name}${{
                    poison: ' has been poisoned!',
                    burn: ' was burned!',
                    stun: ' was stunned!',
                    slow: ' was slowed!',
                    patkInc: '\'s PATK increased!',
                    pdefInc: '\'s PDEF increased!',
                    matkInc: '\'s MATK increased!',
                    mdefInc: '\'s MDEF increased!',
                    patkDec: '\'s PATK decreased!',
                    pdefDec: '\'s PDEF decreased!',
                    matkDec: '\'s MATK decreased!',
                    mdefDec: '\'s MDEF decreased!',
                }[EM[j].effectType]}`)
                getCharacter(currQueue.who).statusEffects.push(EM[j])
                getCharacter(currQueue.fromWhom).response({state: "effect", damage: null, effects: EM[j]})
            }
            if (EM.length > 0) {
                getCharacter(currQueue.who).doStatusEffects()
            }
        }
        if (currQueue.type === 1) {
            let DM = currQueue.amount
            DM *= 0.75 + 0.5 * Math.random()

            let before = Math.ceil(getCharacter(currQueue.who).trueStats[0])
            getCharacter(currQueue.who).trueStats[0] = Math.min(getCharacter(currQueue.who).trueStats[0] + DM, getCharacter(currQueue.who).stats[0])

            console.log(`${getCharacter(currQueue.who).name} was healed by %c${format(Math.ceil(getCharacter(currQueue.who).trueStats[0]) - before, 2)}%c HP!`, 'font-weight: bold;', 'font-weight: normal;')

            getCharacter(currQueue.who).damageScript(-DM)
            getCharacter(currQueue.fromWhom).response({state: "heal", damage: DM, effects: null})
        }
    }
    damageQueue = []
}

function damageFormula(atk, def) {
    if (atk === 0 && def === 0) { return 0; }
    return (atk * atk) / (atk + def)
}

function dodgeFormula(acc, eva) {
    return acc >= eva
        ? 1 - ((1 - baseAcc) * ((eva * eva) / (acc * acc)))
        : baseAcc * (acc * 2) / (acc + eva)
}

function displayCharacter(id, type) {
    let whom = getCharacter(id)
    switch (type) {
        case 0:
            if (whom.team === 0) {
                console.log(`${pad(whom.name, 15, " ")} | ${pad(whom.level, 5, " ")} | ${pad(Math.ceil(whom.trueStats[0]), 4, " ")} / ${pad(Math.ceil(whom.stats[0]), 4, " ")} | ${pad(Math.ceil(whom.trueStats[1]), 4, " ")} / ${pad(Math.ceil(whom.stats[1]), 4, " ")} | ${pad(Math.floor(whom.xp - whom.levelUpReq(whom.level - 1)), 4, " ")} / ${pad(Math.ceil(whom.levelUpReq(whom.level) - whom.levelUpReq(whom.level - 1)), 4, " ")} | ${pad(Math.ceil(whom.gp), 3, " ")}`)
            } else {
                console.log(`${pad(whom.name, 15, " ")} | ${pad(whom.level, 5, " ")} | ${pad(Math.ceil(whom.trueStats[0]), 4, " ")} / ${pad(Math.ceil(whom.stats[0]), 4, " ")} | ${pad(Math.ceil(whom.trueStats[1]), 4, " ")} / ${pad(Math.ceil(whom.stats[1]), 4, " ")} | ${pad(Math.ceil(whom.gp), 3, " ")}`)
            }
            break;
        case 1:
            console.log(`${whom.name} Level ${whom.level} (XP: ${Math.ceil(whom.xp)})\nHP: ${Math.ceil(whom.stats[0])}\nMP: ${Math.ceil(whom.stats[1])}\nPATK: ${Math.ceil(whom.stats[1])}\nPDEF: ${Math.ceil(whom.stats[2])}\nMATK: ${Math.ceil(whom.stats[3])}\nMDEF: ${Math.ceil(whom.stats[4])}\nSPD: ${Math.ceil(whom.stats[5])}`)
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
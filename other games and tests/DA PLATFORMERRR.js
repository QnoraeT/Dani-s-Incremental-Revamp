"use strict";

const TICKRATE = 16;

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

let player
// try {
//     if (player.hp === undefined) {
//         var player = {};
//         setPlayer();
//     }
// } catch {
//     var player = {};
//     setPlayer();
// }

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

function isUndefined(value) {
    return value === undefined;
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

let canvas, ctx

function start() {
    document.body.style['background-color'] = '#000';
    document.body.innerHTML = `
    <canvas id="canvas"></canvas>`
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d");
}

let started = false;

function scalePos(x, y, w, h) {
    return {
        x: ((x - cam.x + shake.x) / cam.zoom) + (canvas.width / 2),
        y: ((y - cam.y + shake.y) / cam.zoom) + (canvas.height / 2),
        width: w / cam.zoom,
        height: h / cam.zoom,
    }
}

let cam = {x: 0, y: 0, zoom: 1}
let shake = {x: 0, y: 0, amt: 0, decay: 25}
function setPlayer() {
    player = {
        x: 0,
        y: 0,
        xvel: 0,
        yvel: 0,
        jump: 0.15,
        height: 80,
        width: 40,
        time: 0,
        friction: 4,
        touchingGround: true,
    }
}

let platforms
let keysHeld = {};
let keyPresses = {};
window.onkeyup = function(e) { keysHeld[e.code] = false; }
window.onkeydown = function(e) { keysHeld[e.code] = true; }

function doThing() {
    if (!started) {
        start();
        setPlayer()
        platforms = []
        for (let i = 0; i < 4; i++) {
            platforms.push({
                x: 150 * i,
                y: 70 - (30 * i),
                width: 150,
                height: 25,
                angle: -10 * i
            })
        }
        ctx.canvas.width = 960;
        ctx.canvas.height = 540;
        started = true;
    }

    // reset
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let tickrate = TICKRATE / 1000;
    player.time += tickrate;

    if (player.time >= 1) {
        return;
    }

    // keyboard controller
    for (let i in keysHeld) {
        if (keyPresses[i] === undefined) keyPresses[i] = 0
        keyPresses[i] = keysHeld[i] ? keyPresses[i] + tickrate : 0
    }

    if (keyPresses.KeyD > 0) {
        player.xvel += 1000 * player.friction * tickrate
    }

    if (keyPresses.KeyA > 0) {
        player.xvel -= 1000 * player.friction * tickrate
    }
    
    player.x += player.xvel * tickrate;
    player.y -= player.yvel * tickrate;
    player.xvel *= Math.pow(Math.pow(10, -player.friction), tickrate)
    player.yvel = lerp(player.yvel, -1000, 1 - Math.pow(0.2, tickrate)) // gravity, terminal velocity

    for (let i = 0; i < platforms.length; i++) {
        let playerCorner = [
            {x: player.x - (player.width / 2), y: player.y - (player.height / 2)}, // SW
            {x: player.x - (player.width / 2), y: player.y + (player.height / 2)}, // NW
            {x: player.x + (player.width / 2), y: player.y - (player.height / 2)}, // SE
            {x: player.x + (player.width / 2), y: player.y + (player.height / 2)}, // NE
        ]
        let playerGravity = []

        for (let j = 0; j < playerCorner.length; j++) {
            playerGravity.push()
        }

        if (distPointToRect(dist[j], platforms[i]) <= 0) {
            
        }
    }

    shake.amt *= Math.pow(1 / shake.decay, tickrate)
    shake.x = (Math.random() - 0.5) * shake.amt
    shake.y = (Math.random() - 0.5) * shake.amt

    cam.x = lerp(cam.x, player.x, 1 - Math.pow(0.001, tickrate))
    cam.y = lerp(cam.y, player.y, 1 - Math.pow(0.001, tickrate))
    
    //stage
    ctx.fillStyle = "#040608";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //player
    let pos = scalePos(player.x - (player.width / 2), player.y - (player.height / 2), player.width, player.height)
    ctx.fillStyle = "#0078FF";
    ctx.fillRect(pos.x, pos.y, pos.width, pos.height);

    for (let i = 0; i < platforms.length; i++) {
        ctx.fillStyle = "#FFFFFF";
        let platform = platforms[i]
        pos = scalePos(platform.x, platform.y, platform.width, platform.height)
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(platform.angle * Math.PI/180);
        ctx.fillRect(-pos.width/2, -pos.height/2, pos.width, pos.height);
        ctx.restore()
    }
}

function lerp(start, end, time) {
    time = clamp(time, 0, 1)
    return (time * end) + ((1 - time) * start)
}

function distPointToRect(point, rect) {
    // calculate distance of point to rectagle
    let calc = {x: point.x - rect.x, y: point.y - rect.y}
    calc = {
        x: (calc.x * Math.cos(rect.angle * Math.PI/180)) - (calc.y * Math.sin(rect.angle * Math.PI/180)),
        y: (calc.y * Math.cos(rect.angle * Math.PI/180)) + (calc.x * Math.sin(rect.angle * Math.PI/180))
    }
    calc.x = Math.max(0, Math.abs(calc.x - (rect.width / 2)))
    calc.y = Math.max(0, Math.abs(calc.y - (rect.height / 2)))
    return Math.sqrt((calc.x * calc.x) + (calc.y * calc.y))
}
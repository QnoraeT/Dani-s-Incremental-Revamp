"use strict";

function updatePlayerData(player) {
    player.value.version = player.value.version||-1;
    if (player.value.version < 0) {
        player.value.version = 0;
    }
    if (player.value.version === 0) {
        // player.value.displayVersion
        // player.value.version = 1;
    }
    if (player.value.version === 1) {

        // player.value.version = 2;
    }
    if (player.value.version === 2) {

        // player.value.version = 3;
    }
}
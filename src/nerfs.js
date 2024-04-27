"use strict";

function updateNerf() {
    let nerf;

    for (let i = 0; i < player.value.nerf.upgradesActive.length; i++) {
        nerf = true;
        player.value.nerf.upgradesActive[i] = nerf;
    }

    nerf = true;
    player.value.nerf.praiActive = nerf;
    
    nerf = true;
    player.value.nerf.pr2Active = nerf;
    
    nerf = true;
    nerf &&= !inChallenge('nk');
    player.value.nerf.kuaActive.effects = nerf;
    
    nerf = true;
    nerf &&= !inChallenge('nk');
    player.value.nerf.kuaActive.gain = nerf;

    nerf = true;
    nerf &&= !inChallenge('nk');
    player.value.nerf.kuaActive.upgrades = nerf;
    
    nerf = true;
    nerf &&= !inChallenge('nk');
    player.value.nerf.kuaActive.kpower.effects = nerf;
    
    nerf = true;
    nerf &&= !inChallenge('nk');
    player.value.nerf.kuaActive.kpower.gain = nerf;
    
    nerf = true;
    nerf &&= !inChallenge('nk');
    player.value.nerf.kuaActive.kpower.upgrades = nerf;
    
    nerf = true;
    nerf &&= !inChallenge('nk');
    player.value.nerf.kuaActive.kshards.effects = nerf;
    
    nerf = true;
    nerf &&= !inChallenge('nk');
    player.value.nerf.kuaActive.kshards.gain = nerf;
    
    nerf = true;
    nerf &&= !inChallenge('nk');
    player.value.nerf.kuaActive.kshards.upgrades = nerf;
}
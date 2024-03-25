"use strict";

function loadVue() {
    Vue.createApp({
        data() {
            return { 
                Decimal,
                game,
                player,
                tmp,
                format,
                formatTime,
                formatPerc,
                switchTab,
                TABS_LIST,
                tab,
                otherGameStuffIg,
                DEFAULT_SCALE,
                gRC,
                colorChange,
                buyGenUPG,
                reset,
                ACHIEVEMENT_DATA,
                ACH_DEF_COLORS,
                c,
                KUA_UPGRADES,
                buyKShardUpg,
                buyKPowerUpg,
                COL_CHALLENGES,
                challengeToggle
            }
    }}).mount('#app')
}

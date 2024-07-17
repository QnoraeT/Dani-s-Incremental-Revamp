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
                setAutosaveInterval,
                saveTheFrickingGame,
                exportSave,
                TABS_LIST,
                STAGES,
                tab,
                otherGameStuffIg,
                SCALE_ATTR,
                SOFT_ATTR,
                gRC,
                colorChange,
                buyGenUPG,
                reset,
                ACHIEVEMENT_DATA,
                ACH_DEF_COLORS,
                c,
                BASIC_UPGS,
                KUA_UPGRADES,
                buyKShardUpg,
                buyKPowerUpg,
                COL_CHALLENGES,
                COL_RESEARCH,
                challengeToggle,
                completedChallenge,
                inChallenge,
                timesCompleted,
                getColResLevel,
                allocColResearch,
                TAX_UPGRADES,
                getTaxUpgrade
            }
    }}).mount('#app')
}

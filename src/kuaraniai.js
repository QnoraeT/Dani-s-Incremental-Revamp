const KUA_UPGRADES = {
    KShards: [
        {
            desc() {
                return "Unlock UP2's autobuyer and Kuaraniai Gain is multiplied by 3x"
            },
            cost() {
                return D(10)
            },
            show() {
                return true
            }
        }
    ],
    KPower: [
        {
            desc() {
                return ""
            },
            cost() {
                return D(1000)
            },
            show() {
                return true
            }
        }
    ]
}

function updateAllKua() {
    updateKua("kua")
}

function updateKua(type) {
    switch (type) {
        case "kua":

            break;
        default:
            throw new Error(`Kuaraniai area of the game does not contain ${type}`);
    }
}
enum Interval {
    CONSTANT = 1,
    SHORT = 10,
    MEDIUM = 40,
    LONG = 100,
    SECOND = 1000,
    MINUTE = 60000
}

export const Config = {
    luckyBankMultiplier: 10,
    intervals: {
        clickInterval: Interval.CONSTANT,
        goldenCheckInterval: Interval.CONSTANT,
        buyInterval: Interval.SHORT,
        fortuneInterval: Interval.SECOND * 10,
        seasonInterval: Interval.SECOND,
        harvestSugarLumpInterval: Interval.MINUTE,
        dragonAuraInterval: Interval.LONG,
        dragonUpgradeInterval: Interval.LONG,
        popWrinklerInterval: Interval.SECOND,
        spendSugarLumpInterval: Interval.SECOND,
        assignGodInterval: Interval.LONG,
        upgradeClausInterval: Interval.LONG,
        petDragonInterval: Interval.MINUTE * 15
    }
};

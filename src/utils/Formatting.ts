import Decimal from "../../node_modules/decimal.js/decimal";

const SUFFIX_ABBRIVATIONS: string[] = [
    "", "K", "M", "B", "T",
    "Qa", "Qi", "Sx", "Sp", "Oc", "No",
    "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod",
    "Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Qivg", "Sxvg", "Spvg", "Ocvg", "Novg",
    "Tg", "Utg", "Dtg", "Ttg", "Qatg", "Qitg", "Sxtg", "Sptg", "Octg", "Notg",
    "Qag", "Uqag", "Dqag", "Tqag", "Qaqag", "Qiqag", "Sxqag", "Spqag", "Ocqag", "Noqag",
    "Cg"
];

const SUFFIXES: { [key: string]: number } = {
    "million": 6, "billion": 9, "trillion": 12, "quadrillion": 15,
    "quintillion": 18, "sextillion": 21, "septillion": 24, "octillion": 27,
    "nonillion": 30, "decillion": 33, "undecillion": 36, "duodecillion": 39,
    "tredecillion": 42, "quattuordecillion": 45, "quindecillion": 48,
    "sexdecillion": 51, "septendecillion": 54, "octodecillion": 57,
    "novemdecillion": 60, "vigintillion": 63, "unvigintillion": 66,
    "duovigintillion": 69, "trevigintillion": 72, "quattuorvigintillion": 75,
    "quinvigintillion": 78, "sexvigintillion": 81, "septenvigintillion": 84,
    "octovigintillion": 87, "novemvigintillion": 90, "trigintillion": 93,
    "untrigintillion": 96, "duotrigintillion": 99, "tretrigintillion": 102,
    "quattuortrigintillion": 105, "quintrigintillion": 108, "sextrigintillion": 111,
    "septentrigintillion": 114, "octotrigintillion": 117, "novemtrigintillion": 120,
    "quadragintillion": 123, "unquadragintillion": 126, "duoquadragintillion": 129,
    "trequadragintillion": 132, "quattuorquadragintillion": 135, "quinquadragintillion": 138,
    "sexquadragintillion": 141, "septenquadragintillion": 144, "octoquadragintillion": 147,
    "novemquadragintillion": 150, "quinquagintillion": 153, "unquinquagintillion": 156,
    "duoquinquagintillion": 159, "trequinquagintillion": 162, "quattuorquinquagintillion": 165,
    "quinquinquagintillion": 168, "sexquinquagintillion": 171, "septenquinquagintillion": 174,
    "octoquinquagintillion": 177, "novemquinquagintillion": 180, "sexagintillion": 183,
    "unsexagintillion": 186, "duosexagintillion": 189, "tresexagintillion": 192,
    "quattuorsexagintillion": 195, "quinsexagintillion": 198, "sexsexagintillion": 201,
    "septensexagintillion": 204, "octosexagintillion": 207, "novemsexagintillion": 210,
    "septuagintillion": 213, "unseptuagintillion": 216, "duoseptuagintillion": 219,
    "treseptuagintillion": 222, "quattuorseptuagintillion": 225, "quinseptuagintillion": 228,
    "sexseptuagintillion": 231, "septenseptuagintillion": 234, "octoseptuagintillion": 237,
    "novemseptuagintillion": 240, "octogintillion": 243, "unoctogintillion": 246,
    "duooctogintillion": 249, "treoctogintillion": 252, "quattuoroctogintillion": 255,
    "quinoctogintillion": 258, "sexoctogintillion": 261, "septenoctogintillion": 264,
    "octooctogintillion": 267, "novemoctogintillion": 270, "nonagintillion": 273,
    "unnonagintillion": 276, "duononagintillion": 279, "trenonagintillion": 282,
    "quattuornonagintillion": 285, "quinnonagintillion": 288, "sexnonagintillion": 291,
    "septennonagintillion": 294, "octononagintillion": 297, "novemnonagintillion": 300,
    "centillion": 303
};

export function formatNumber(n: number): string {
    if (n < 1000) return n.toFixed(0);

    const tier = Math.min(
        Math.floor(Math.log10(n) / 3),
        SUFFIX_ABBRIVATIONS.length - 1
    );

    const value = n / Math.pow(10, tier * 3);
    return value.toFixed(2) + SUFFIX_ABBRIVATIONS[tier];
}

export function parseFormattedNumber(str: string): Decimal {
    const match = str.match(/^([\d.]+)\s*(\w+)?$/);
    if (!match) return new Decimal(0);

    const num = new Decimal(match[1]);
    const suffix = match[2]?.toLowerCase();

    if (suffix && suffix in SUFFIXES) {
        return num.times(new Decimal(10).pow(SUFFIXES[suffix]));
    }

    return num;
}

export function formatTime(sec: number): string {
    if (!isFinite(sec) || sec <= 0) return "---";
    if (sec < 60) return sec.toFixed(1) + "s";
    if (sec < 3600) return (sec / 60).toFixed(1) + "m";
    if (sec < 86400) return (sec / 3600).toFixed(1) + "h";
    return (sec / 86400).toFixed(1) + "d";
}

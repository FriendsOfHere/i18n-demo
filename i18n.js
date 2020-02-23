function i18n(template, ...expression) {
    let info = i18n.db[i18n.locale][template.join('\x01')];
    if (typeof info == "undefined") {
        let output = ``
        for (const [i, val] of expression.entries()) {
            output += template[i] + val
        }
        output += template[template.length - 1]
        return output
    }

    for (var
            out = [info.t[0]],
            i = 1, length = info.t.length; i < length; i++) out[i] = arguments[1 + info.v[i - 1]] + info.t[i];
    return out.join('');
}

i18n.set = locale => (tCurrent, ...rCurrent) => {
    const key = tCurrent.join('\x01');
    let db = i18n.db[locale] || (i18n.db[locale] = {});
    db[key] = {
        t: tCurrent.slice(),
        v: rCurrent.map((value, i) => i)
    };
    const config = {
        for: other => (tOther, ...rOther) => {
            db = i18n.db[other] || (i18n.db[other] = {});
            db[key] = {
                t: tOther.slice(),
                v: rOther.map((value, i) => rCurrent.indexOf(value))
            };
            return config;
        }
    };
    return config;
};

i18n.db = {}

module.exports = i18n

/*
 * This file is part of app.here.i18n-demo.
 *
 * Copyright (c) 2020 Lifesign.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

const _ = require("lodash")
const net = require("net")
const cache = require('cache')
const pref = require('pref')
let i18nTool = require("./i18n.js")
const langMap = ['en','zh-CN']

function loadActualLang(locale) {
    //Pref
    i18nTool.set('en')`Interface Language`
    .for('zh-CN')`界面语言`
    i18nTool.set('en')`Food`
    .for('zh-CN')`食物`
    i18nTool.set('en')`Banana`
    .for('zh-CN')`香蕉`
    i18nTool.set('en')`Apple`
    .for('zh-CN')`苹果`

    //notification
    i18nTool.set('en')`Notification: Success`
    .for('zh-CN')`通知：更换语言成功`
    i18nTool.set('en')`Please Restart`
    .for('zh-CN')`请重启或者 Reload 生效`

    i18nTool.locale = locale
}

function changeLang() {
    let actualLang = _.toSafeInteger(cache.get('actualLang'))
    let prefLang = _.toSafeInteger(pref.get('prefLang'))
    console.log(`actualLang: ${actualLang} prefLang: ${prefLang}`)
    loadActualLang(langMap[prefLang])
    //debug i18n db
    console.log(JSON.stringify(i18nTool.db))

    let i18nTitle = i18nTool`Interface Language`
    let i18nFood = i18nTool`Food`
    let i18nBanana = i18nTool`Banana`
    let i18nApple = i18nTool`Apple`
    console.log(`${i18nTitle}:${i18nFood}:${i18nBanana}:${i18nApple}`)

    //rewrite current config, need restart here or reload plugin
    if (actualLang != prefLang) {
        console.log("Begin rewrite config.json")
        here.exec(`
cp config.default.json config.json;
perl -pi -e 's/{{i18nTitle}}/${i18nTitle}/g' ./config.json;
perl -pi -e 's/{{i18nDefault}}/${prefLang}/g' ./config.json;
perl -pi -e 's/{{i18nFood}}/${i18nFood}/g' ./config.json;
perl -pi -e 's/{{i18nBanana}}/${i18nBanana}/g' ./config.json;
perl -pi -e 's/{{i18nApple}}/${i18nApple}/g' ./config.json;
`)
                .then((output) => {
                    console.log(output)
                    cache.set('actualLang', prefLang)
                    //notification
                    here.systemNotification(i18nTool`Notification: Success`, i18nTool`Please Restart`)
                })
    } else {
        console.log("Nothing Changed")
    }
}

here.onLoad(() => {
    
    //ChangeLang Demo
    changeLang()

    // Update every 2 hours
    setInterval(changeLang, 2*3600*1000);
})

net.onChange((type) => {
    console.log("Connection type changed:", type)
    if (net.isReachable()) {
        changeLang()
    }
})

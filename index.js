/*
 * This file is part of app.here.helloworld.
 *
 * Copyright (c) 2020 Lifesign.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

const _ = require("lodash")
const net = require("net")

function updateData() {





}

here.onLoad(() => {
    updateData()
    // Update every 2 hours
    setInterval(updateData, 2*3600*1000);
})

net.onChange((type) => {
    console.log("Connection type changed:", type)
    if (net.isReachable()) {
        updateData()
    }
})

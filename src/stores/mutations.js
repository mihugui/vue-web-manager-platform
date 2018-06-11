/*
* 全局state状态修改提交
* */

import * as types from './mutation-types'

const mutations = {
    [types.USER_INFO](state, data) {
        state.userInfo = data
    }
}

export default mutations

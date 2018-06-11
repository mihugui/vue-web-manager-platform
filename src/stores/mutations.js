/*
* 全局state状态修改提交
* */

import * as types from './mutation-types'

const mutations = {
    [types.SHOW_DEL_BUTTON](status,data){
        status.show = data;
    },

    [types.SHOW_EDIT_BUTTON](status,data){
        status.show = data;
    }
}

export default mutations

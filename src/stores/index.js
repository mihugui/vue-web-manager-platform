import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import state from './state'
import mutation from './mutations'
import * as actions from './actions'
import * as getters from './getter'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


const store = new Vuex.Store({
    state,
    actions,
    mutation,
    getters,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})

export default store

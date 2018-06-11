import axios from 'axios'

const global = {
    install: null
}

global.install = (Vue, router) => {
    //axois不属于vue插件，需要在vue原型链上增加方法
    Vue.prototype.fetch = axios
    //对所有接口请求拦截添加token（与后台协商）
    axios.interceptors.request.use(config => {
        //对数据在请求值服务器前做一次处理
        /*..........*/
        return config
    })
    axios.interceptors.response.use(res => {
        //对返回数据在使用之前做一次处理
        /*............*/
        return res
    })

    //promise原型链新增finally方法，用于loading状态控制,或者自定义的异常捕获
    Promise.prototype.finally = callback => {
        let Pro = this.constructor
        return this.then(
            value => Pro.resolve(callback()).then(() => value),
            reason => Pro.resolve(callback()).then(() => { throw reason})
        )
    }


    router.beforeEach((to, from, next) => {
        /*
		* to下一个路由路径
		* from上一个路由路径
		* 需要调用next()生效
		*/
        next()
    })

}

export default global

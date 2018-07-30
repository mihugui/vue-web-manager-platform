import axios from 'axios'
import * as getters from "../stores/getter";
import store from '../stores';
import {Permission} from '../axios/Permission'

const global = {
    install: null,
}

global.install = (Vue, router) => {
    //axois不属于vue插件，需要在vue原型链上增加方法
    Vue.prototype.fetch = axios
    //对所有接口请求拦截添加token（与后台协商）
    axios.interceptors.request.use(config => {
        //对数据在请求值服务器前做一次处理
        /*..........*/
        console.log(config.data)
        if(config.url.indexOf("import")==-1){
        if (sessionStorage.getItem("token")) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            if(config.data === undefined){
                config.data ='token=' + sessionStorage.getItem("token")
            }else {
                config.data = config.data + '&token=' + sessionStorage.getItem("token")
            }
        }
        if (sessionStorage.getItem("placeIds")){
            config.data = config.data+"&pIds="+JSON.parse(sessionStorage.getItem("placeIds")).toString();
        }
        }
        return config
    })
    axios.interceptors.response.use(res => {
        //对返回数据在使用之前做一次处理
        /*............*/
        if(res.data.retcode===3200){
            router.push('/login');
        }

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
        if (sessionStorage.getItem("token")) {
                if (store.getters.userroutes === false) {
                    Permission.getUserPermission(1).then(function (val) {
                        let userRoutes = Permission.getrouter(val, store.getters.mycomponents)
                        router.addRoutes(userRoutes);
                        store.commit("SET_USER_ROUTES", true)
                    });
                    store.dispatch("GET_DICTS_DATA");
                    next();
                } else {
                    sessionStorage.setItem("activeIndex",to.path)
                    next();
                }
        }else{
           if (to.path === '/login') {
                next()
           }else{
               next('/login')
           }
        }
    })

}

export default global

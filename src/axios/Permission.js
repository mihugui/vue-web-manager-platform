import url from "../globbal/url";
import axios from 'axios';
import store from '../stores'

export const Permission = {

    data:'',
    //获取用户资源
    getUserPermission: async function(action){
        var vm = this;
        let placeId = sessionStorage.getItem("placeId")
        var qs = require('qs');
        const promise = new Promise(function(resolve, reject) {
        if(!sessionStorage.getItem('permission')){
            axios.post(url.allurl+url.permissionurl,qs.stringify({'placeId':placeId})).then(function(res){
                if(res.data.retcode === 200) {
                    sessionStorage.setItem('permission', JSON.stringify(res.data.data));
                    vm.data = res.data.data.filter(Permission => {
                        return Permission.button != 1;
                    });
                    if(action === 1){ //获取路由
                        resolve(res.data.data.filter(Permission => {
                            return Permission.button != 1 || Permission.pId != null;
                        }));
                    }else {
                        resolve(vm.analysis());
                    }
                }else{
                    return null;
                }
            }).catch(function(error){
                console.log(error)
            });

        }else{
            vm.data = JSON.parse(sessionStorage.getItem('permission')).filter(Permission=>{
                return Permission.button !=1;
            });
            if(action==1){
                resolve(vm.data.filter(Permission => {
                    return (Permission.button != 1 && Permission.pId != null);
                }));
            }else {
                resolve(vm.analysis());
            }
        }
        });
        return promise;
    },

    analysis:function(){
        var vm = this;
        let tree =[];
        for(let i=0;i<vm.data.length;i++){
            if(this.data[i].pId === null){
                let obj = vm.data[i]
                obj.children = []
                tree.push(obj)
                vm.data.splice(i,1)
                i--
            }
        }
        return this.menuList(tree);
    },

    menuList:function(arr){
        var vm = this;
        if(vm.data.length !=0){
            for(let i=0; i<arr.length;i++){
                for(let j=0;j<vm.data.length;j++){
                    if(this.data[j].pId == arr[i].id){
                        let obj = vm.data[j]
                        obj.children = []
                        arr[i].children.push(obj)
                        vm.data.splice(j,1)
                        j--
                    }
                }
                vm.menuList(arr[i].children)
            }
        }
        return arr;
    },

    //路由权限处理
    getrouter:function(data,components){
        let userRouter = [{name:'mainLayout',path: '/',component: resolve => {require(['@/components/MainLayout'], resolve)}, children:[]}];
        for(let router of data){
            router.component = components[router.component];
        }

        userRouter[0].children=data;
        return userRouter;
    },
    //获取全部资源
    getAllPermission:function(action){
        var vm = this;
        let placeId = sessionStorage.getItem("placeId")
        var qs = require('qs');
        const promise = new Promise(function(resolve, reject) {
            axios.post(url.allurl + url.allpermissionurl,qs.stringify({"placeId":placeId}))
              .then(res =>{
                  if(action === 1){
                      vm.data = res.data.data.filter(Permission => {
                          return Permission.button != 1;
                      });
                  }else {
                      vm.data = res.data.data;
                  }
                  resolve(vm.analysis());
              }).catch(error => {
                  console.log(error);
              })
        });
        return promise;
    },

    //获取用户园区
    getUserPlaces:function(){
        var vm = this;
        const promise = new Promise(function(resolve, reject) {
            axios.post(url.allurl + '/places/findUserAllPlace')
                .then(res =>{
                    resolve(res.data.data);
                }).catch(error => {
                reject(error);
            })
        });
        return promise;
    },
}

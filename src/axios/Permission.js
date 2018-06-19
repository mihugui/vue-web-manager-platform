import url from "../globbal/url";
import axios from 'axios';
import store from '../stores'

export const Permission = {

    data:'',
    //获取用户资源
    getUserPermission:function(){
        var vm = this;
        if(!sessionStorage.getItem('permission')){
        axios.post(url.allurl+url.permissionurl).then(function(res){
            if(res.data.code=200) {
                sessionStorage.setItem('permission', JSON.stringify(res.data.data));
                vm.data = res.data.data.filter(Permission => {
                    return Permission.button != 1;
                });
                return vm.analysis();
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
        }
        let permission = this.analysis()
        console.log(permission)
        return permission;

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

    //获取全部资源
    getAllPermission:function(){
        var vm = this;
        if(!sessionStorage.getItem('permission')){
            axios.post(url.allurl+url.allpermissionurl).then(function(res){
                sessionStorage.setItem('permission',JSON.stringify(res.data.data));
                vm.data = res.data.data;
                return vm.analysis();
            }).catch(function(error){
                console.log(error)
            });
        }else{
            vm.data = JSON.parse(sessionStorage.getItem('permission'));
        }
        return vm.analysis();
    }
}

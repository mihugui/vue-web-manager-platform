import url from "../globbal/url";
import axios from 'axios';

export const Permission = {

    data:'',

    getallpermission:function(){
        var vm = this;
        if(!sessionStorage.getItem('permission')){
        axios.post(url.allurl+url.permissionurl).then(function(res){
            sessionStorage.setItem('permission',JSON.stringify(res.data.data));
            vm.data = res.data.data.filter(Permission=>{
                return Permission.button !=1;
            });
            console.log(res.data.data);
            vm.analysis(res.data.data);
        }).catch(function(error){
            console.log(error)
        });
        }
        vm.data = JSON.parse(sessionStorage.getItem('permission')).filter(Permission=>{
            return Permission.button !=1;
        });
        console.log(vm.data);
        vm.analysis();
    },

    analysis:function(){
        var vm = this;
        let tree =[];
        for(let i=0;i<vm.data.length;i++){
            if(this.data[i].pId === null){
                let obj = vm.data[i]
                obj.list = []
                tree.push(obj)
                vm.data.splice(i,1)
                i--
            }
        }
        this.menuList(tree);
        console.log(this.menuList(tree));
    },

    menuList:function(arr){
        var vm = this;
        if(vm.data.length !=0){
            for(let i=0; i<arr.length;i++){
                for(let j=0;j<vm.data.length;j++){
                    if(this.data[j].pId == arr[i].id){
                        let obj = vm.data[j]
                        obj.list = []
                        arr[i].list.push(obj)
                        vm.data.splice(j,1)
                        j--
                    }
                }
                vm.menuList(arr[i].list)
            }
        }
        return arr;
    }
}

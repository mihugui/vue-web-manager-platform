<template>
    <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-checked-keys="checkedids"
        :props="defaultProps"
        @check-change="gettreeid">
    </el-tree>
</template>
<script>
    import {mapMutations} from 'vuex'
    export default{
        name:'treemenu',
        data(){
            return {

            };
        },

        methods:{
            gettreeid(){
                let vm =this;
                let tree = [...vm.$refs.tree.getCheckedNodes(),...vm.$refs.tree.getHalfCheckedNodes()];
                let ids = [];
                for( var item of tree){
                    ids.push(item.id);
                }
                this.settreeids(ids);
            },
        },
        props:['checkedids','data','defaultProps'],
    }
</script>

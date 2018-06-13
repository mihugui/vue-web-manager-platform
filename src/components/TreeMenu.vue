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
    import {mapGetters,mapMutations} from 'vuex'
    import * as types from '../stores/mutation-types'
    export default{
        name:'treemenu',
        data(){
            return {
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            };
        },
        methods :{
            gettreeid(){
                let tree = [...this.$refs.tree.getCheckedNodes(),...this.$refs.tree.getHalfCheckedNodes()];
                let ids = [];
                for( var item of tree){
                    ids.push(item.id);
                }
                this.settreeids(ids);
            },
            ...mapMutations({
                settreeids: types.SET_TREE_IDS
            }),
        },
        computed:{
            ...mapGetters({
                data:'permission',
            }),
        },
        props:['checkedids'],
    }
</script>

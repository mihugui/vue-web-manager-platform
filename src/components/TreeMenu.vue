<template>
    <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-checked-keys="[5]"
        :props="defaultProps"
        @check-change="getHalfCheckedNodes">
    </el-tree>
</template>
<script>
    import {mapGetters} from 'vuex'
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
            getHalfCheckedNodes(){
                console.log(this.$refs.tree.getCheckedNodes())
                console.log(this.$refs.tree.getHalfCheckedNodes());
            },
        },
        computed:{
            ...mapGetters({
                data:'permission',
            }),
        },
    }
</script>

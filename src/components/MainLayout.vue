<template>
    <el-container>
        <el-header>
            <div>
                <div class="fl title" style="display: inline-block;"><img style="margin-top: 9px ;width:125px" src="../assets/img/chinaMessage.png"></div>
                <div class="fl system">
                    <mini-system :SystemTitle="SystemTitle" :changeSystem="changeSystem"></mini-system>
                </div>
            </div>
        </el-header>
        <el-container class="maintype">
            <el-aside :width="myWidth"><mini-asidetitle :AsideTitle="AsideTitle" :isCollapse="isCollapse"></mini-asidetitle></el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import SystemTitle from '@/components/SystemTitle'
    import AsideTitle from '@/components/AsideTitle'
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name: "MainLayout",
        data(){
            return {
                isCollapse:true,
                myWidth:"65px"
            }
        },
        methods:{
            changertitle(){
                if(window.innerWidth>800) {
                    this.isCollapse = false;
                    this.myWidth = "200px";
                }
                else{
                    this.isCollapse = true;
                    this.myWidth = "65px";
                }
            },
            changeSystem:function(val){
                this.setSystemTitle(val);
            },
            ...mapActions({
                getUserPermission: 'GET_USER_PERMISSION'
            }),
            ...mapMutations({
                setSystemTitle : 'SET_SYSTEM_TITLE'
            })
        },
        mounted () {

            this.changertitle();
            var _this =this;
            // 注：window.onresize只能在项目内触发1次
            window.onresize = function windowResize () {
                // 通过捕获系统的onresize事件触发我们需要执行的事件
                _this.changertitle()
            }
        },
        created(){
            this.getUserPermission();
        },
        computed:{
            ...mapGetters({
                AsideTitle: 'asideinfo',
                SystemTitle:'systeminfo',
            })
        },
        components: {
            'mini-system': SystemTitle,
            'mini-asidetitle':AsideTitle,
        },
    }
</script>
<style scoped>
    .maintype {
        height: 100%;
        width: 100%;
        position: fixed;
        margin-top: 60px
    }
    .el-header {
        background-color: #36a8fc;
        color: #333;
        text-align: center;
        line-height: 60px;
        padding: 0;
    }
    .el-aside {
        background-color: rgb(84, 92, 100);
        color: #333;
        text-align: center;
        line-height: 200px;
        width: 63px;
    }

    .el-main {
        background-color: #fff;
        color: #333;
        /*text-align: center;*/
        margin:0px 0px 0px 0px;
        height: auto;
    }

    .title {
        width: 200px;
        text-align: center;
        line-height: 60px;
        color: #fff;
    }

    .fl {
        float: left;
    }
    .fr {
        float: right;
    }

    .system{
        position:absolute;
        left:210px;
        height:60px ;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }
</style>

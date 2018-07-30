<template>
    <div>
        <section class="content-search">
            <div style="padding-left: 20px">
                <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
                    <el-form-item
                        label="企业名称" label-width="80px">
                        <el-input
                            placeholder="请输入企业名称"
                            v-model="entName"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="企业类型" label-width="80px">
                        <el-select v-model="enttype" clearable placeholder="请选择">
                            <el-option
                                v-for="item in dicts.enttype"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="searchTable">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </section>
        <section class="content-operate">
            <el-button type="primary" size="mini" icon="el-icon-setting" v-if="showEdit && (button.filter(btn =>{return btn.path === '/enterprise/per'}).length!=0)" @click="showPerMission">权限分配</el-button>
            <!--<el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showOrganization">组织管理</el-button>-->
        </section>
        <section class="content-table">
            <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"
                        :sizeChange="sizeChange" :currentChange="currentChange" :rowClick="rowClick" :showInfo="showInfo" :showTitle="showTitle" :loading="loading"></mini-table>
        </section>
        <div>
            <el-dialog
                :title="title_permission"
                :visible.sync="dialogVisible_permission"
                width="800px"
                heigth="80%"
                :modal-append-to-body="false"
                close='closeDialog_permission'
                style="z-index: 99999;">
                <span v-for="item,index in dataInfo.beans"
                      :class="['selectItem', item.state ? 'selected' : '']"
                      :key="index"
                      v-on:click="toggleSelect(item, index)"
                >
                    宇宙无敌领导元首
                </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_permission = false">取 消</el-button>
                <el-button type="primary" @click="surePermission">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Table from '@/components/Table'
    import TreeMenu from '@/components/TreeMenu'
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import {base} from '../../axios/base'
    import store from '../../stores'
    import dataInfo from './data'

    export default {
        name: "EnterpriseManager",
        data() {
            var checkEntcode = (rule, value, callback) => {
                if(this.userStatue === false){
                    this.setCheckUrl('/enterprise/checkEntCode')
                    this.getCheakNO({entCode:value}).then(function(val){
                        console.log(val);
                        if(val.data.retcode === 200){
                            return  callback();
                        }else{
                            return  callback(new Error('企业编号已经存在'));
                        }
                    })}else{
                    return  callback()
                }

            };

            return {
                //弹出框
                title: '',
                dialog: {
                    entName: '',
                    entCode: '',
                    entLerep: '',
                    entType: '',
                    entNo: '',
                    entTel: '',
                    entParentId: '',
                    placeIds: [],
                },

                place:{
                    defaultplace:'',
                    otherplace:''
                },
                dialogVisible: false,
                soururl: '',
                allEnt: [],
                allPlace: [],
                userStatue:false,
                showTitle:'',

                //权限弹出框
                title_permission: '资源管理',
                dialogVisible_permission: false,
                dialogVisible_Organization: false,
                dialogVisible_places:false,
                dialogVisible_chart:false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                entIds: [],
                chartTree:'',

                //表格
                loading:true,
                page: {
                    page: 1,
                    pageSize: 10,
                },
                showEdit: false,
                showDetele: false,
                url: '/enterprise/list',
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                }, {
                    name: '企业编号',
                    value: 'entCode',
                    operate: true
                }, {
                    name: '企业名称',
                    value: 'entName',
                    operate: true
                }, {
                    name: '企业法人',
                    value: 'entLerep',
                    operate: true
                }, {
                    name: '企业类型',
                    value: 'placeArea',
                    operate: true,
                    formatter: function (row) {
                        for(let type  of store.getters.dicts.enttype){
                            if(type.code === row.entType){
                                return type.name
                            }
                        }
                    }
                }, {
                    name: '企业税号',
                    value: 'entNo',
                    operate: true
                }, {
                    name: '负责人电话',
                    value: 'entTel',
                    operate: true
                }, {
                    name: '父级企业',
                    value: 'entParentName',
                    operate: true,
                }, {
                    name: '入驻园区',
                    value: 'placeNames',
                    operate: true
                }],
                param: null,
                showInfo:'',
                enttype: '',
                entName:'',
                seltable: '',
                selall: [],
                dataInfo: {
                    beans: [{}]
                }
            }
        },
        components: {
            'mini-table': Table,
        },
        computed: {
            ...mapGetters({
                tableData: 'tableData',
                total: 'total',
                dicts: 'dicts',
                allPermission: 'permission',
                button:'buttonpermission'
            }),
        },
        methods: {

            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl: 'SET_SURE_URL',
                settreeids: 'SET_TREE_IDS',
                setPermissionUrl: 'SET_PERMISSION_URL',
                setCheckUrl:'SET_CHECK_URL'
            }),
            ...mapActions({
                getTableData: 'GET_TABLE_DATA',
                updateSureOK: 'UPDATE_TABLE_DATA',
                getEntPermission: 'GET_ENT_PERMISSION',
                getAllPermission: 'GET_ALL_PERMISSION',
                setPermission: 'SET_PERMISSION',
                axioPostNoData: 'AXIO_POST_NODATA',
                getCheakNO : 'GET_CHECK_NO',
                getChildrenList:'GET_CHILDREN_LIST',
                getEntListByPlace:'GET_ENT_LIST'
            }),

            gettreeid() {
                let vm = this;
                let tree = [...this.$refs.tree.getCheckedNodes(), ...this.$refs.tree.getHalfCheckedNodes()];
                let ids = [];
                for (var item of tree) {
                    ids.push(item.id);
                }
                let a = JSON.stringify(ids);
                let pids = a.substring(1, a.length - 1);
                this.params = {'entId': vm.seltable.Id, 'resourceId': pids}
            },

            showEntER(){
                let vm =this
                this.dialogVisible_chart=true
                let rid = {'placeId':sessionStorage.getItem("placeId")}
                this.getEntListByPlace(rid).then(function(val){
                    console.log(val.data.data)
                    vm.chartTree =val.data.data
                    let placeEnt = {
                        children:vm.analysis(),
                        name:'当前园区'
                    }
                    vm.showChart(placeEnt)
                })
            },

            showChart(data){
                let myChart = this.$echarts.init(document.getElementById('myChart'))

                // echarts.util.each(data.children, function (datum, index) {
                //     index % 2 === 0 && (datum.collapsed = true);
                // });
                myChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove'
                    },
                    series: [
                        {
                            type: 'tree',
                            data: [data],
                            top: '1%',
                            left: '7%',
                            bottom: '1%',
                            right: '20%',
                            symbolSize: 7,
                            label: {
                                normal: {
                                    position: 'left',
                                    verticalAlign: 'middle',
                                    align: 'right',
                                    fontSize: 9
                                }
                            },
                            leaves: {
                                label: {
                                    normal: {
                                        position: 'right',
                                        verticalAlign: 'middle',
                                        align: 'left'
                                    }
                                }
                            },
                            expandAndCollapse: true,
                            animationDuration: 200,
                            animationDurationUpdate: 250
                        }
                    ]
                });
            },

            selectedChange(val) {
                console.info(val)
                var vm = this;
                this.selall = val;
                if (val.length > 0) {
                    let result =[];
                    if(val[0].placeIds != null) {
                        result = base.toNum(val[0].placeIds);
                    }
                    this.seltable = {
                        "entName": val[0].entName,
                        "entCode": val[0].entCode,
                        "entLerep": val[0].entLerep,
                        "entType": val[0].entType,
                        "entNo": val[0].entNo,
                        "entTel": val[0].entTel,
                        "entParentId": val[0].entParentId,
                        "placeIds": result,
                        "Id": val[0].id,
                    };
                }
                switch (val.length) {
                    case 0:
                        vm.showEdit = false;
                        break;
                    case 1:
                        vm.showEdit = true
                        break;
                    default:
                        vm.showEdit = false;
                }

            },

            analysis:function(){
                var vm = this;
                let tree =[];
                for(let i=0;i<vm.chartTree.length;i++){
                    if(this.chartTree[i].entParentId === null){
                        let obj = vm.chartTree[i]
                        obj.children = []
                        obj.name = obj.entName
                        tree.push(obj)
                        vm.chartTree.splice(i,1)
                        i--
                    }
                }
                return this.menuList(tree);
            },

            menuList:function(arr){
                var vm = this;
                if(vm.chartTree.length !=0){
                    for(let i=0; i<arr.length;i++){
                        for(let j=0;j<vm.chartTree.length;j++){
                            if(this.chartTree[j].entParentId == arr[i].id){
                                let obj = vm.chartTree[j]
                                obj.children = []
                                obj.name = obj.entName
                                arr[i].children.push(obj)
                                vm.chartTree.splice(j,1)
                                j--
                            }
                        }
                        vm.menuList(arr[i].children)
                    }
                }
                return arr;
            },

            sizeChange(val) {
                let vm = this
                this.page.pageSize = val;
                this.loading = true;
                this.getTableData({...this.page, ...this.enttype,...this.entName}).then( function () {
                    vm.loading = false
                })
            },
            currentChange(val) {
                let vm = this
                this.page.pageNum = val;
                this.loading = true;
                this.getTableData({...this.page, ...this.enttype,...this.entName}).then( function () {
                    vm.loading = false
                })
            },

            rowClick(val){
                let vm = this
                vm.showInfo='';
                let rid = {'entParentId':val.id}
                this.getChildrenList(rid).then(function(val){
                    vm.showTitle='子系统'
                    if(val.data.data.length ===0)
                    {
                        vm.showInfo = "无"
                    }else {
                        for (let ent of val.data.data) {
                            vm.showInfo += ent.entParentName + ';'
                        }
                    }
                })

            },

            searchTable(){
                let vm = this
                this.loading = true;
                this.getTableData({...this.page,"entType":this.enttype,"entName":this.entName}).then( function () {
                    vm.loading = false
                })
            },

            showPerMission() {
                this.setPermissionUrl('/enterprise/updateResource');
                let vm = this;
                this.title_permission = "权限分配";
                this.params = {'Id': vm.seltable.Id}
                this.dialogVisible_permission = true;
                this.getEntPermission(this.params).then(function (val) {
                    let ids = new Array();
                    for (var item of val.data.data) {
                        ids.push(item.id)
                    }
                    // vm.$refs.tree.setCheckedKeys(ids);
                });
            },
            showPlaces() {
                this.dialog = {...this.seltable};
                this.setSureUrl('/enterprise/updatePlaces');
                this.dialogVisible_places=true;
            },
            deleteList() {
                let vm = this;
                this.setSureUrl('/enterprise/delete');
                let ids = new Array();
                for (var item of vm.selall) {
                    ids.push(item.id)
                }
                let result = {'ids': ids}
                vm.updateSureOK(result).then(function (val) {
                    if (val.data.retcode === 200) {
                        vm.$message.success("删除成功");
                        vm.getTableByOther();
                    } else {
                        vm.$message.error("删除失败");
                    }
                })
            },

            handleClose(done) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },

            surePlaces:function(){
                let vm = this;
                let a = JSON.stringify(vm.dialog.placeIds);
                let pids = a.substring(1, a.length - 1);
                this.params = { "entId":vm.selall[0].id,"placeIds":pids}
                vm.updateSureOK(vm.params).then(function (val) {
                    if (val.data.retcode === 200) {
                        vm.dialogVisible_places = false;
                        vm.$message.success(val.data.retmsg)
                        vm.getTableByOther();
                    }else{
                        vm.dialogVisible_places = false;
                        vm.$message.error(val.data.retmsg)
                    }
                })
            },

            surePermission () {
                this.$message.success('okay')
                let arr = []
                this.dataInfo.beans.forEach(v => {
                    if(v.state) {
                        arr.push(v)
                    }
                })
                console.info(arr)
                // this.fetch('', {})
                //     .then(res => {
                //
                //     })
                this.dialogVisible_permission = false
                console.info(this.dialogVisible_permission)
            },


            resetForm(formName) {
                let vm = this
                vm.dialogVisible = false;
                vm.$refs[formName].resetFields();
            },

            sureok: function () {
                let vm = this;
                this.setCheckUrl('/enterprise/checkEntCode')
                delete vm.dialog.placeIds;

                if(vm.dialog.entTel.indexOf('****')===-1 ){
                    let rule = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                    if(!rule.test(vm.dialog.entTel)){
                        vm.$message.error("手机号不符合规范");
                        return
                    }
                };

                this.$refs['dialog'].validate((valid) => {
                    if (valid) {
                        vm.updateSureOK(vm.dialog).then(function (val) {
                            if (val.data.retcode === 200) {
                                vm.dialogVisible = false;
                                vm.$message.success(val.data.retmsg)
                                vm.getTableByOther();

                            }else{
                                vm.$message.error(val.data.retmsg)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            closeDialog: function () {
                this.resetForm('dialog');
                this.dialog.entName = '';
                this.dialog.entCode = '';
                this.dialog.entLerep = '';
                this.dialog.entType = '';
                this.dialog.entNo = '';
                this.dialog.entTel = '';
                this.dialog.entParentId = '';
                this.dialog.placeIds = [];
                if (this.dialog.Id) {
                    delete this.dialog.Id;
                }
            },

            closeDialog_permission: function () {

            },

            getTableByOther: function () {
                let vm = this
                this.getTableData(this.page).then( function () {
                    vm.loading = false
                })
            },
            getAllEnt: function () {
                let vm = this;
                this.axioPostNoData("/enterprise/getAllEnterprise").then(function (val) {
                    vm.allEnt = val.data.data
                })
            },
            getAllPlace: function () {
                let vm = this;
                this.axioPostNoData("/places/getAllPlaces").then(function (val) {
                    vm.allPlace = val.data.data
                })
            },

            toggleSelect (item, index) {
                item.state = !item.state
                this.dataInfo.beans.splice(index, 1, item)
            }

        },
        mounted() {
            console.info(dataInfo)
            this.getAllPlace();
            this.getAllEnt();
            this.getAllPermission();
            this.setTableUrl(this.url);
            this.getTableByOther();
            this.dataInfo = {...{}, ...dataInfo}
        },
    }
</script>
<style scoped lang="scss">
    .content-search {
        background-color: #fff;
        border-bottom: 2px solid hsla(0,0%,92%,.9);
        margin:20px 0 0 0;
        width: 100% ;
    }
    .content-operate {
        margin:10px 0 10px 30px;
        flex: 1;
        overflow-y: auto;
    }
    .content-table{
        background-color: #f0f4f7;
        padding: 10px 20px 60px;
        height: calc(100vh - 220px);
    }
    .el-dialog {
        max-height: calc(100% - 300px);
        max-width: calc(100% - 30px);
        display: flex;
        flex-direction: column;

    }
    .el-dialog__body {
        overflow: auto;
    }
    .dialog-input {
        width: 80%;
        padding-left: 50px;
    }
    .selectItem {
        display: inline-block;
        justify-content: center;
        align-items: center;
        padding: 5px;
        font-size: 14px;
        color: #888;
        border: 1px solid #409EFF;
        border-radius: 5px;
        margin: 0 15px 15px 0;
        cursor: pointer;
    }
    .selected {
        background: #409EFF;
        color: #fff;
    }
</style>

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
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="button.filter(btn =>{return btn.path === '/enterprise/add'}).length!=0" @click="showAddModal">新增</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showEntER">企业关系图</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit && (button.filter(btn =>{return btn.path === '/enterprise/edit'}).length!=0)" @click="showEditModal">编辑</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit && (button.filter(btn =>{return btn.path === '/enterprise/per'}).length!=0)" @click="showPerMission">权限分配</el-button>
            <!--<el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showOrganization">组织管理-->
            <!--</el-button>-->
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit && (button.filter(btn =>{return btn.path === '/enterprise/place'}).length!=0)" @click="showPlaces">园区管理
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele && (button.filter(btn =>{return btn.path === '/enterprise/del'}).length!=0)" @click="handleClose(deleteList)">删除
            </el-button>
        </section>
        <section class="content-table">
        <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"
                    :sizeChange="sizeChange" :currentChange="currentChange" :rowClick="rowClick" :showInfo="showInfo" :showTitle="showTitle" :loading="loading"></mini-table>
        </section>
        <div>
            <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="850px"
                heigth="80%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <el-form :model="dialog" :rules="rules" ref="dialog" label-width="120px"  class="demo-ruleForm">
                    <el-form-item label="企业名称" prop="entName">
                        <el-col :span="20">
                        <el-input v-model="dialog.entName"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="企业编号" prop="entCode">
                        <el-col :span="20">
                        <el-input v-model="dialog.entCode"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="企业法人" prop="entLerep">
                        <el-col :span="20">
                        <el-input v-model="dialog.entLerep"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="企业类型" prop="entType">
                        <el-select v-model="dialog.entType" clearable placeholder="请选择">
                            <el-option
                                v-for="item in dicts.enttype"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="企业税号" prop="entNo">
                        <el-col :span="20">
                        <el-input v-model="dialog.entNo"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="负责人电话" prop="entTel">
                        <el-col :span="20">
                        <el-input v-model="dialog.entTel"></el-input>
                        </el-col>
                    </el-form-item>
                        <el-form-item label="父企业" prop="entParentId">
                            <el-select v-model="dialog.entParentId" clearable placeholder="请选择">
                                <el-option
                                    v-for="item in allEnt"
                                    :key="item.id"
                                    :label="item.entName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('dialog')">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                :title="title_permission"
                :visible.sync="dialogVisible_permission"
                width="300px"
                heigth="80%"
                :modal-append-to-body="false"
                @close='closeDialog_permission'
                style="z-index: 99999;">
            <span>
                <el-tree
                    :data="allPermission"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="tree"
                    :default-checked-keys="entIds"
                    :props="defaultProps"
                    check-strictly
                    @check-change="gettreeid">
                 </el-tree>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_permission = false">取 消</el-button>
                <el-button type="primary" @click="surePermission">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                :title="title_places"
                :visible.sync="dialogVisible_places"
                width="500px"
                heigth="80%"
                :modal-append-to-body="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <div class="dialog-input" style="margin-top: 15px;">
                    <div class="el-input el-input-group el-input-group--prepend">
                    <div class="el-input-group__prepend">入驻园区</div>
                    <el-select v-model="dialog.placeIds" multiple clearable placeholder="请选择">
                        <el-option
                            v-for="item in allPlace"
                            :key="item.id"
                            :label="item.placeName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    </div>
                </div>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_places = false">取 消</el-button>
                <el-button type="primary" @click="surePlaces">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                :title="title_permission"
                :visible.sync="dialogVisible_Organization"
                width="300px"
                heigth="80%"
                :modal-append-to-body="false"
                @close='closeDialog_permission'
                style="z-index: 99999;">
            <span>
                <el-tree
                    :data="allPermission"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="tree"
                    :default-checked-keys="entIds"
                    check-strictly
                    :props="defaultProps"
                    @check-change="gettreeid"
                >
                 </el-tree>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_Organization = false">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
            </span>
            </el-dialog>
            <el-dialog
                :title="title_chart"
                :visible.sync="dialogVisible_chart"
                width="500px"
                heigth="80%"
                :modal-append-to-body="false"
                style="z-index: 99999;">
            <span>
                <div id="myChart" :style="{width: '500px', height: '300px'}"></div>
            </span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_chart = false">取 消</el-button>
            <el-button type="primary" @click="sureok">确 定</el-button>
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
                //输入框规则
                rules: {
                    entName:[
                        { required: true, message: '请输入企业名称', trigger: 'blur' },
                        { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
                    ],
                    entCode:[
                        { required: true, message: '请输入企业编号', trigger: 'blur' },
                        { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
                        { validator: checkEntcode, trigger: 'blur' }
                    ],
                    entLerep:[
                        { required: true, message: '请输入企业法人', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    entType:[
                        { required: true, message: '请选择企业类型', trigger: 'change' }
                    ],
                    entNo:[
                        { required: true, message: '请输入企业税号', trigger: 'blur' },
                        { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
                    ],
                    entTel:[
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        // { pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '你的手机号格式不正确'}
                        { min: 11, max: 11, message: '长度必须为11位', trigger: 'blur' }
                    ],
                    entParentId:[
                        { required: false, message: '请选择父企业', trigger: 'change' }
                    ],
                },
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
                title_places:'园区管理',
                title_chart:'企业关系',
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
                        vm.showDetele = false;
                        break;
                    case 1:
                        vm.showEdit = true
                        vm.showDetele = true;
                        break;
                    default:
                        vm.showEdit = false;
                        vm.showDetele = true;
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

            showAddModal() {
                this.title = "新增";
                this.setSureUrl('/enterprise/add');
                this.userStatue = false;
                this.dialogVisible = true;
            },
            showEditModal() {
                this.dialog = {...this.seltable};
                this.title = "编辑";
                this.userStatue = true;
                this.setSureUrl('/enterprise/update');
                this.dialogVisible = true;
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
                    vm.$refs.tree.setCheckedKeys(ids);
                });
            },
            showPlaces() {
                this.dialog = {...this.seltable};
                this.setSureUrl('/enterprise/updatePlaces');
                this.dialogVisible_places=true;
            },
            showOrganization() {
                let vm = this;
                this.title_permission = "组织管理";
                this.params = {'Id': vm.seltable.Id}
                this.dialogVisible_Organization = true;
                this.getEntPermission(this.params).then(function (val) {
                    let ids = base.toNum(val.data.data)
                    vm.$refs.tree.setCheckedKeys(ids);
                });
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

            surePermission: function () {
                let vm = this;
                this.setPermission(this.params).then(function (val) {
                    if (val.data.retcode = 200) {
                        vm.$message.success(val.data.data);
                        vm.dialogVisible_permission = false;
                        sessionStorage.removeItem("permission");
                    } else {
                        vm.$message.error(val.data.data);
                        vm.dialogVisible_permission = false;
                    }
                })
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

        },
        mounted() {
            this.getAllPlace();
            this.getAllEnt();
            this.getAllPermission();
            this.setTableUrl(this.url);
            this.getTableByOther();
            this.showEntER();
        },
    }
</script>
<style scoped>
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
</style>

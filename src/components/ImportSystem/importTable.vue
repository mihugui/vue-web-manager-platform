<template>
    <div>
        <section class="content-search">
            <div style="padding-left: 20px">
            <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
                <el-form-item
                    v-for="(item,key) in search"
                    v-if="item.paramRule.type===''"
                    :key="key"
                    :label="item.paramDesc"
                    label-width="80px">
                    <el-input
                        :placeholder="'请输入'+item.paramDesc"
                        v-model="search[key].paramValue"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item
                    v-else-if="item.paramRule.type==='date'"
                    :key="key"
                    :label="item.paramDesc"
                    label-width="80px">
                    <el-date-picker
                        v-model="search[key].paramValue"
                        type="datetime"
                        placeholder="选择日期时间"
                        align="right"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    v-else-if="item.paramRule.type==='ent'"
                    :key="key"
                    :label="item.paramDesc"
                    label-width="80px">
                    <el-select v-model="search[key].paramValue"  clearable  placeholder="请选择企业" :key="'dataType'+key">
                        <el-option
                            v-for="(itemDict,key) in allEnt"
                            :key="itemDict.filialeid"
                            :label="itemDict.filialename"
                            :value="itemDict.filialeid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-else-if="item.paramRule.type==='controller'"
                    :key="key"
                    :label="item.paramDesc"
                    label-width="80px">
                    <el-select v-model="search[key].paramValue"  clearable  placeholder="请选择控制中心" :key="'dataType'+key">
                        <el-option
                            v-for="(itemDict,key) in controller"
                            :key="itemDict.systemid"
                            :label="itemDict.systemname"
                            :value="itemDict.systemid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-else-if="item.paramRule.type==='groupInfo'"
                    :key="key"
                    :label="item.paramDesc"
                    label-width="80px">
                    <el-select v-model="search[key].paramValue"  clearable  placeholder="请选择工作组" :key="'dataType'+key">
                        <el-option
                            v-for="(itemDict,key) in groupInfo"
                            :key="itemDict.groupid"
                            :label="itemDict.groupname"
                            :value="itemDict.groupid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-else-if="item.paramRule.type==='WelfareType'"
                    :key="key"
                    :label="item.paramDesc"
                    label-width="80px">
                    <el-select v-model="search[key].paramValue"  clearable  placeholder="请选择福利类型" :key="'dataType'+key">
                        <el-option
                            v-for="(itemDict,key) in groupInfo"
                            :key="itemDict.id"
                            :label="itemDict.name"
                            :value="itemDict.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="searchTable" v-if="search!=[]">查询</el-button>
                </el-form-item>
            </el-form>
            </div>
        </section>
        <section class="content-operate">
            <el-button
                v-for="(item,key) in button"
                v-if="item.dataType != 'del'"
                :key="key"
                type="primary"
                size="mini"
                :icon="item.resourceIcon"
                @click="clickbutton(item.dataType,item.id)">
                {{ item.resourceName }}
            </el-button>
            <el-button
                v-else
                :key="key"
                type="danger"
                size="mini"
                :icon="item.resourceIcon"
                @click="clickbutton(item.dataType,item.id)"
                >
                {{ item.resourceName }}
            </el-button>
        </section>
        <section class="content-table">
        <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange" :sizeChange="sizeChange" :currentChange="currentChange" :loading="loading"></mini-table>
        </section>
        <div>
            <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="850px"
                heigth = "80%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <el-form :model="dialog" ref="dialog"  label-width="120px"  class="demo-ruleForm">
                    <el-form-item
                        v-for="(item,key) in formList"
                        v-if="item.type==''"
                        :key="key"
                        :label="item.paramDesc"
                        :prop="item.paramKey"
                        :rules="item.paramRule">
                        <el-col :span="20">
                        <el-input v-model="dialog[item.paramKey]"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item
                        v-else-if="item.type=='ent'"
                        :key="key"
                        :label="item.paramDesc"
                        :prop="item.paramKey"
                        :rules="item.paramRule">
                        <el-col :span="20">
                        <el-select v-model="dialog[item.paramKey]"  clearable  placeholder="请选择企业" :key="'dataType'+key">
                            <el-option
                                v-for="(itemDict,key) in allEnt"
                                :key="itemDict.id"
                                :label="itemDict.entName"
                                :value="itemDict.id">
                            </el-option>
                        </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item
                        v-else
                        :key="key"
                        :label="item.paramDesc"
                        :prop="item.paramKey"
                        :rules="item.paramRule">
                        <el-col :span="20">
                        <el-select v-model="dialog[item.paramKey]" filterable clearable placeholder="请选择">
                            <el-option
                                v-for="itemDict in dicts[item.type]"
                                :key="itemDict.id"
                                :label="itemDict.name"
                                :value="itemDict.code">
                            </el-option>
                        </el-select>
                        </el-col>
                    </el-form-item>
                </el-form>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                :title="title_file"
                :visible.sync="dialogVisible_file"
                default-expand-all
                width="500px"
                heigth="80%"
                :modal-append-to-body="false"
                style="z-index: 99999;">
                <span>
                 <div class="dialog-input" style="margin-top: 15px;">
                        <el-upload
                            class="upload-demo"
                            drag
                            action="/"
                            :before-upload="getFile">
                            <i class="el-icon-upload"></i>
                            <
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip" v-if="upFileName !=null"><h1 style="color: #303133">上传文件名称:{{ upFileName }}</h1></div>
                            <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，且不超过500kb</div>
                            <div class="el-upload__tip" slot="tip"><a target="_blank" :href="downurl" style="color: #303133;">下载模板</a></div>
                        </el-upload>
                </div>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible_file = false;upFileName =null">取 消</el-button>
                    <el-button type="primary" @click="sureok" :loading="isBtnLoading">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Table from '@/components/Table'
    import { mapActions,mapGetters,mapMutations } from 'vuex'
    import XLSX from 'xlsx'
    import axios from 'axios'
    import url from "../../globbal/url"
    export default {
        name: 'importTable',
        data() {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                title:'',
                id:'',
                bid:'',
                is_one:false,
                consumeToken:'',
                //所有企业
                allEnt:[],
                controller:[],
                groupInfo:[],
                WelfareType:[],
                dialog:{

                },
                rules:{

                },
                deviceList:[],
                search:[],
                page:[],
                button:[],
                tableKey:[],
                formList:[],
                selall:[],
                searchParams:{

                },
                tableData: [],
                total:10,
                loading:true,
                url:'/resourceData/getData',
                //dialog
                dialogVisible:false,

                //上传文件
                title_file:'导入',
                dialogVisible_file:false,
                upFileName:null,
                files:'',
                downurl:'',
                list:'',
                isBtnLoading:false,
                importdata:''
            }
        },

        computed:{
            ...mapGetters({
                dicts: 'dicts',
            }),
        },

        methods:{

            ...mapMutations({
                setDataByUrl: 'SET_DATA_BYURL',
            }),
            ...mapActions({
                getTableInfo:'G' +
                'ET_TABLE_INFO',
                getDataByUrl:'GET_DATA_BYURL',
                getTableButton:'GET_TABLE_BUTTON',
                axioPostNoData: 'AXIO_POST_NODATA',
            }),

            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            getTableOption:function(){
                let vm = this
                this.id = JSON.parse(sessionStorage.getItem('permission')).filter(p=>{return p.path === vm.$route.path})[0].id
                let rid = {'rId':this.id}
                this.getTableInfo(rid).then(function(val){
                    let info = val.data.data.srdpList
                    vm.search = info.filter(p=>{return p.isCondition === "1"})
                    for(let s of vm.search){
                        vm.searchParams[s.paramKey]='';
                        if(s.paramRule != '')
                            s.paramRule = JSON.parse(s.paramRule)
                    }
                    vm.page.push(info.filter(p=>{return p.paramDesc === "page"})[0])
                    vm.page.push(info.filter(p=>{return p.paramDesc === "pagesize"})[0])
                    vm.page[0].paramValue = 1
                    vm.page[1].paramValue = 10

                    vm.tableKey.push({
                        name: '序号',
                        type: 'index',
                    })
                    for(let a of info.filter(p=>{return p.isShow === "1"})){
                        if(a.paramKey === 'mgmtincid' ||a.paramKey === 'consumeincid'){
                            vm.tableKey.push({
                                name:a.paramDesc,
                                value:a.paramKey,
                                formatter:function(row){
                                    for(let type  of vm.allEnt){
                                        if(type.filialeid === row[a.paramKey]){
                                            return type.filialename
                                        }
                                    }
                                }
                            })
                        }else if(a.paramKey === 'downloadstatus'||a.paramKey === 'cardstatus'||a.paramKey === 'consumetype'||a.paramKey === 'consumemode' ||a.paramKey === 'consumeway' ||a.paramKey === 'tradetype'
                        ){
                            vm.tableKey.push({
                                name:a.paramDesc,
                                value:a.paramKey,
                                formatter:function(row){
                                    for(let type  of vm.dicts[a.paramKey]){
                                        if(type.code===row[a.paramKey].toString()){
                                            console.log(type.name)
                                            return type.name
                                        }
                                    }
                                }
                            })
                        }else{
                            vm.tableKey.push({
                                name:a.paramDesc,
                                value:a.paramKey
                            })
                        }

                    }
                    vm.getTableDataByUrl();
                })

                this.getTableButton(rid).then(function(val){
                    let result = val.data.data.filter(p=>{return p.isButton === 1})
                    for( let b of result){
                        let bid = { 'rId':b.id}
                        vm.getTableInfo(bid).then(function(val){
                            b.dataType = val.data.data.srd.dataType
                        })
                    }
                    vm.button = result
                })

            },

            clickbutton(val,bid){
                let vm = this
                this.bid = bid
                let rid = {'rId':bid}
                switch(val){
                    case 'add':
                        vm.title = "新增"
                        vm.dialogVisible = true
                        vm.getTableInfo(rid).then(function(val){
                            vm.formList = val.data.data.srdpList
                            for(let f of vm.formList){
                                let rule = JSON.parse(f.paramRule)
                                f.paramRule=[]
                                if(rule.isRequired === true){
                                    f.paramRule.push(
                                        {
                                            required: true,
                                            message: '请输入'+f.paramDesc,
                                            trigger: 'blur' })
                                }
                                f.type=rule.type
                                if(rule.isRegular === true){
                                    f.paramRule.push(
                                        {
                                            pattern: rule.regular,
                                            message: '输入不符合规则'
                                        })
                                }
                            }
                        })
                        break

                    case 'del':
                        if(vm.selall.length != 1){
                            vm.$message.warning('每次只能删除一个')
                            break
                        }
                        vm.handleClose(vm.bid)
                        break

                    case 'edit':
                        // if(vm.selall.length != 1){
                        //     vm.$message.warning('每次只能编辑一个')
                        //     break
                        // }
                        vm.title = "编辑"
                        vm.dialogVisible = true
                        vm.getTableInfo(rid).then(function(val){
                            vm.formList = val.data.data.srdpList.filter(p=>{return p.isShow === '1'})
                            //vm.dialog = vm.selall[0]

                            for(let f of vm.formList){
                                let rule = JSON.parse(f.paramRule)
                                f.paramRule=[]
                                if(rule.isRequired === true){
                                    f.paramRule.push(
                                        {
                                            required: true,
                                            message: '请输入'+f.paramDesc,
                                            trigger: 'blur' })
                                }
                                f.type=rule.type
                                if(rule.isRegular === true){
                                    f.paramRule.push(
                                        {
                                            pattern: rule.regular,
                                            message: '输入不符合规则'
                                        })
                                }
                            }
                        })
                        break

                    case 'import':
                        vm.getTableInfo(rid).then(function(val){
                            vm.importdata = val.data.data.srdpList.filter(p=>{return p.isShow === '1'})
                            vm.dialogVisible_file=true
                        })

                        break

                    case 'export':
                        let Condition = [...vm.search]
                        vm.getTableInfo(rid).then(function(val){
                            let url = val.data.data.srd.dataUrl+"?token="+vm.consumeToken
                            console.log(Condition)
                            for(let a of Condition)
                            {
                                url +="&&"+a.paramKey+"="+a.paramValue
                            }
                            window.open(url)
                        })
                        break

                    case 'send':
                        if(vm.selall.length != 1){
                            vm.$message.warning('每次只能删除一个')
                            break
                        }

                        vm.handleSend(vm.bid)
                        break
                }
            },

            handleClose(id) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.deleteList(id)
                    })
                    .catch(_ => {});
            },

            handleSend(id){
                this.$confirm('确认下发当前福利？')
                    .then(_ => {
                        this.sendList(id)
                    })
                    .catch(_ => {});
            },
            //导入相关 JSON
            getFile:function(file){
                this.isBtnLoading = true
                if((file.name.indexOf(".xls") == -1) && (file.name.indexOf(".xlsx") == -1) ) {
                    this.$message.warning("只能上传xls/xlsx文件")
                    return false
                } else if(file.size > 1024*1024*0.5){
                    this.$message.warning("文件大小不能超过500kb")
                    return false
                } else {
                    this.excelToList(file);
                    this.upFileName = file.name
                    this.files = file;
                }
                return false
            },

            listToJson:function(list){
                let result = []
                for(let m of list){
                    let s ={}
                    for(let n of this.importdata){
                        if(m[n.paramDesc] != undefined) {
                            s[n.paramKey] = m[n.paramDesc]
                        }
                    }
                    result.push(s)
                }
                this.isBtnLoading = false
            },
            excelToList:function(file){
                let vm = this
                var rABS = true;
                var reader = new FileReader();
                var name = file.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var wb;
                    if (rABS) {
                        wb = XLSX.read(data, { type: 'binary' });
                    } else {
                        var arr = vm.fixdata(data);
                        wb = XLSX.read(btoa(arr), { type: 'base64' });
                    }
                    vm.list= XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                };
                if (rABS)  reader.readAsBinaryString(file);
                else   reader.readAsArrayBuffer(file);
            },

            fixdata:function(data) {
                var o = "", l = 0, w = 10240;
                for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
                return o;
            },

            sendList(id){
                let vm = this;

                let rid = {'rId':id}
                this.getTableInfo(rid).then(function(val){
                    val.data.data.srdpList[0].paramValue = vm.selall[0].batch
                    let Condition = [...val.data.data.srdpList]
                    let Params = {'rId':val.data.data.srd.resourceId,'params':JSON.stringify(Condition)}
                    vm.getDataByUrl(Params).then(function(val2){
                        let data = JSON.parse(val2.data.data)
                        vm.$message.success(data.retmsg)
                        vm.getTableDataByUrl()
                    })
                })
            },


            deleteList(id){
                let vm = this;

                let rid = {'rId':id}
                this.getTableInfo(rid).then(function(val){
                    val.data.data.srdpList[0].paramValue = vm.selall[0].id
                    let Condition = [...val.data.data.srdpList]
                    let Params = {'rId':val.data.data.srd.resourceId,'params':JSON.stringify(Condition)}
                    vm.getDataByUrl(Params).then(function(val2){
                        let data = JSON.parse(val2.data.data)
                        vm.$message.success(data.retmsg)
                        vm.getTableDataByUrl()
                    })
                })
            },

            getTableDataByUrl(){
                let vm = this
                //this.search[0].paramValue = '洛阳园区'
                let Condition = [...this.page,...this.search]
                let Params = {'rId':this.id,'params':JSON.stringify(Condition)}
                this.getDataByUrl(Params).then(function(val){
                    let data = JSON.parse(val.data.data)
                    if(data.data.data != null)
                    {
                        vm.tableData= data.data.data
                    }else if(data.data.list != null){
                        vm.tableData = data.data.list
                    }else{
                        vm.tableData = []
                    }

                    vm.total = data.data.total
                    vm.loading = false

                })

            },

            searchTable:function(){
                this.getTableDataByUrl()
            },

            selectedChange:function(val){
                this.selall = val
            },
            sizeChange:function(val){

                this.page[1].paramValue = val
                this.getTableDataByUrl()

            },
            currentChange:function(val){

                this.page[0].paramValue = val
                this.getTableDataByUrl()
            },
            sureok:function(){
                let vm = this
                let result = []
                let keys = Object.keys(this.dialog)
                for(let key of keys){
                    result.push({
                        paramKey:key,
                        paramValue:this.dialog[key]
                    })
                }
                let Params = {'rId':this.bid,'params':JSON.stringify(result)}
                this.getDataByUrl(Params).then(function(val){
                    let data = JSON.parse(val.data.data)
                    vm.$message.success(data.retmsg)
                    vm.dialogVisible = false
                    vm.getTableDataByUrl()
                })


            },
            closeDialog:function(){
                this.dialog = {}
                this.resetForm('dialog')
            },

            changeRouter(){
                Object.assign(this.$data, this.$options.data())
                this.getConsumeToken()
                this.getAllEnt()
                this.getGroupInfo()
                this.getController()
                this.getWelfareType()
                this.setDataByUrl(this.url)
                this.getTableOption()
            },

            getAllEnt: function () {
                let vm = this;
                // this.axioPostNoData("/enterprise/getAllEnterprise").then(function (val) {
                //     vm.allEnt = val.data.data
                // })

                axios(
                    {
                        method: 'post',
                        url:url.allurl+'/resourceData/getOtherData',
                        params:{
                            url:vm.dicts.consume_url.filter(p=>{return p.name==='ent' })[0].code
                        }
                    }).then((res)=>{
                    vm.allEnt = JSON.parse(res.data.data)
                })

            },

            getConsumeToken:function(){
                let vm = this;
                axios(
                    {
                        method: 'post',
                        url:url.allurl+'/token/getConsumeToken'
                    }).then((res)=>{
                    vm.consumeToken = res.data.data[0].consumeToken
                })

            },

            getGroupInfo(){
                let vm = this;
                // this.axioPostNoData("/enterprise/getAllEnterprise").then(function (val) {
                //     vm.allEnt = val.data.data
                // })

                axios(
                    {
                        method: 'post',
                        url:url.allurl+'/resourceData/getOtherData',
                        params:{
                            url:vm.dicts.consume_url.filter(p=>{return p.name==='groupInfo' })[0].code
                        }
                    }).then((res)=>{
                    vm.groupInfo = JSON.parse(res.data.data)
                })
            },

            getController(){
                let vm = this;
                // this.axioPostNoData("/enterprise/getAllEnterprise").then(function (val) {
                //     vm.allEnt = val.data.data
                // })

                axios(
                    {
                        method: 'post',
                        url:url.allurl+'/resourceData/getOtherData',
                        params:{
                            url:vm.dicts.consume_url.filter(p=>{return p.name==='controller' })[0].code
                        }
                    }).then((res)=>{
                    vm.controller = JSON.parse(res.data.data)
                })
            },

            getWelfareType(){
                let vm = this;
                // this.axioPostNoData("/enterprise/getAllEnterprise").then(function (val) {
                //     vm.allEnt = val.data.data
                // })

                axios(
                    {
                        method: 'post',
                        url:url.allurl+'/resourceData/getOtherData',
                        params:{
                            url:vm.dicts.consume_url.filter(p=>{return p.name==='WelfareType' })[0].code
                        }
                    }).then((res)=>{
                    vm.WelfareType = JSON.parse(res.data.data)
                })
            }
        },
        components:{
            'mini-table':Table
        },

        activated(){
            console.log('切换')
        },

        watch: {
            // 如果路由有变化，会再次执行该方法
            "$route": "changeRouter",
            "list":"listToJson"
        },
        created(){
            this.getConsumeToken()
            this.getAllEnt()
            this.getGroupInfo()
            this.getController()
            this.getWelfareType()
            this.setDataByUrl(this.url)
            this.getTableOption()
        }
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
        height: auto;
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

<template>
  <div id="LogManagement">
      <section>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="用户">
                  <el-input v-model="formInline.user" placeholder="用户"></el-input>
              </el-form-item>
              <el-form-item label="操作内容">
                  <el-input v-model="formInline.user" placeholder="操作内容"></el-input>
              </el-form-item>
          </el-form>
      </section>
      <section>
          <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"></mini-table>
      </section>
  </div>
</template>
<script type="text/ecmascript-6">
    import Table from '@/components/Table'
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name: 'LogManagement',
        data() {
            return {
                url:'/table/data',
                placename:'',
                tableKey: [{
                    name: '日期',
                    value: 'date',
                    operate: true
                },{
                    name: '姓名',
                    value: 'name',
                    operate: false
                },{
                    name: '地址',
                    value: 'address',
                    operate: false
                }],
                formInline: {
                    user: '',
                    region: '',
                }
            }
        }
    }
</script>
<style  rel="stylesheet/stylus">
</style>

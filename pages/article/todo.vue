<template>
  <div class="el-container is-vertical">
    <header class="el-header layout-header" style="height: 60px">Hi, {{ username }}, 欢迎浏览<span style="font-weight: bold">bogking的博客</span></header>
    <section class="el-container">
      <aside class="el-aside layout-sidebar" style="width: 200px">
        <div>快捷导航</div>
        <div class="back-home">
          <nuxt-link to="/">
            <el-button type="success" icon="el-icon-s-home" circle></el-button>
          </nuxt-link>
        </div>
      </aside>
      <section class="el-container is-vertical">
        <main class="el-main">
          <div class="hidden">this is security guard page.</div>
          <div class="filter-container">
            <el-button v-if="hasModifyRight" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-upload" @click="handleImportRules"> 上传文件 </el-button>
            <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleExportRules"> 文件导出 </el-button> -->
            <el-divider direction="vertical"></el-divider>
            <span>点击"产品名称"列头，以筛选产品</span>
          </div>

          <div class="app-container">
            <el-table v-loading="listLoading" :data="ruleList" element-loading-text="Loading" border fit highlight-current-row>
              <el-table-column align="center" label="ID" width="40">
                <template slot-scope="scope">
                  {{ scope.$index }}
                </template>
              </el-table-column>
              <el-table-column class-name="status-col" label="运行状态" width="90" align="center">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="created_at" label="运行时间" width="150">
                <template slot-scope="scope">
                  <i class="el-icon-time" />
                  <span>{{ scope.row.reportTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="触发人" width="130" align="center">
                <template slot-scope="scope">
                  {{ scope.row.developer }}
                </template>
              </el-table-column>
              <el-table-column label="产品名称" width="180" align="center" :filters="allProducts" :filter-method="handleRuleFilter">
                <template slot-scope="scope">
                  {{ scope.row.productName }}
                </template>
              </el-table-column>
              <el-table-column label="特性" width="230" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.feature }}</span>
                </template>
              </el-table-column>
              <el-table-column label="模块" width="130" align="center">
                <template slot-scope="scope">
                  {{ scope.row.module }}
                </template>
              </el-table-column>
              <el-table-column label="文件名" width="200" align="center">
                <template slot-scope="scope">
                  {{ scope.row.fileName }}
                </template>
              </el-table-column>
              <el-table-column label="安全API" width="210" align="center">
                <template slot-scope="scope">
                  {{ scope.row.secFrameworkAPI }}
                </template>
              </el-table-column>
              <el-table-column label="修改人" width="130" align="center">
                <template slot-scope="scope">
                  {{ scope.row.author }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="created_at" label="规则上传时间" width="150">
                <template slot-scope="scope">
                  <i class="el-icon-time" />
                  <span>{{ scope.row.updateTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="代码仓库" width="290" align="center">
                <template slot-scope="scope">
                  {{ scope.row.repository }}
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-pagination
              :current-page="ruleQuery.currentPage"
              :page-sizes="[5, 10, 20, 50, 100]"
              :page-size="ruleQuery.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleTableSizeChange"
              @current-change="handleTableCurrentChange"
            >
            </el-pagination> -->
            <!-- TODO: form -->
            <!--
            <el-dialog :title="textMap[dialogName]" :visible.sync="dialogFormVisible">
              <el-form ref="uploadForm" :rules="formRules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left: 50px">
                <el-form-item label="产品名称" prop="productName">
                  <el-select v-model="temp.productName" class="filter-item" placeholder="选择一个产品">
                    <el-option v-for="item in productOptions" :key="item.key" :label="item.name" :value="item.key" />
                  </el-select>
                </el-form-item>
                <el-form-item label="上传文件" prop="uploadFile">
                  <el-upload
                    ref="fileUpload"
                    action="/api/v1/security-guard/rule-file"
                    accept=".xlsx"
                    multiple
                    :limit="1"
                    :on-exceed="handleFileExceed"
                    :before-remove="beforeFileRemove"
                    :on-success="handleFileSussess"
                    :on-error="handleFileError"
                    class="upload-demo"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <span slot="tip" class="el-upload__tip" style="margin-left: 10px">只能上传excel(.xlsx)文件，且不超过50MB</span>
                  </el-upload>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="这次更新的原因是..." />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false"> 取消 </el-button>
                <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" @click="importRules()"> 确定 </el-button>
              </div>
            </el-dialog>
            -->
          </div>
        </main>
        <footer class="el-footer hidden" style="height: 60px">Footer</footer>
      </section>
    </section>
  </div>
</template>

<script>
// import { getPermission } from '~/api/article' // getRules,importRules

export default {
  components: {
    // ElUpload
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        noData: 'gray',
        failed: 'danger'
      }
      return statusMap[status]
    }
  },
  layout: 'content',
  // middleware: 'permission',
  // 填充数据到data: page组件每次加载(重载从服务端加载/前端路由切换)前被调用
  async asyncData({ $axios, params }) {
    // context对象，内部无this
    try {
      // TODO: 这里有个奇怪问题，$axios.$get会走plugin/axios.js拦截，但$axios({url: 'xxx',method: 'get', params})这样写就不会进拦截器，后续再研究
      // data formate as: {"hasModifyRight":true,"products":["DP","eturbo","pssCloud","ECM","cloudDector","CLLI","netcare"]}
      // const userInfo = await getPermission($axios)
      debugger
      await console.log('in asyncData.')
      // console.log(process.client + 'run asyncData() in security guard page:' + JSON.stringify(userInfo))
      // return { hasModifyRight: userInfo.hasModifyRight || 'false', productOptions: userInfo.products || [], allProducts: userInfo.allProducts || [] }
    } catch (error) {
      console.log('user info request error: ' + error)
    }
  },
  data() {
    const validateFiles = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('Please enter the correct file name.'))
      } else {
        callback()
      }
    }
    return {
      fullscreenLoading: false,
      ruleList: null,
      // tableData: null,
      ruleQuery: {
        currentPage: 1,
        pageSize: 5,
        limit: 20
      },
      listLoading: true,
      dialogFormVisible: false,
      dialogName: '',
      textMap: {
        import: '导入规则',
        update: '编辑规则'
      },
      productOptions: [],
      allProducts: [],
      temp: {
        id: undefined,
        productName: '',
        uploadFile: [],
        // timestamp: new Date(),
        remark: ''
      },
      formRules: {
        productName: [{ required: true, message: '需要在你负责的产品中选一个', trigger: 'blur' }],
        uploadFile: [{ required: true, message: '需要上传规则文件', trigger: 'blur', validator: validateFiles }],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }]
      },
      hasModifyRight: false
    }
  },
  // 填充数据到store: page组件每次加载(重载从服务端加载/前端路由切换)前被调用
  // async fetch({ store, params }) { // context对象，内部无this
  //   // async & await
  //   const { data } = await this.$axios.get('http://my-api/stars')
  //   store.commit('setStars', data)
  // },
  computed: {
    username() {
      // return this.$store.state.name || 'somebody'
      return 'somebody'
    }
  },
  async mounted() {
    await console.log('in mounted.')
    // await this.randerTable()
  }
}
</script>

<style>
.layout-header {
  text-align: center;
  line-height: 60px;
}
.layout-sidebar {
  text-align: center;
}
.back-home {
  margin-top: 50px;
}
</style>

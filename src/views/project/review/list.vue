<template>
  <n-card :bordered="false" class="proCard pmp">
    <template #header>
      <span class="all"> 全部（{{ total }}）</span>
      <span class="search"
        ><n-button text size="large" @click="showSearchBar">
          <template #icon>
            <n-icon>
              <SearchOutlined />
            </n-icon>
          </template>
          搜索
        </n-button>
      </span>
    </template>
    <BasicForm v-if="showSearch" @register="register" @submit="handleSubmit" @reset="handleReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>
    <n-divider />
    <BasicTable
      :bordered="false"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id_num"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      @update:pagination="getPagination"
      :scroll-x="1090"
    >
      <template #tableTitle>
        <router-link to="/project/newReview">
          <n-button type="primary" size="large">新增评审计划</n-button></router-link
        >
        <!-- <n-button type="primary" size="large" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增申报计划
        </n-button> -->
      </template>

      <!-- <template #toolbar>
        <n-button type="primary" @click="reloadTable">刷新数据</n-button>
      </template> -->
    </BasicTable>

    
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, toRefs, watch } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BaseResultEnum, ResultEnum } from '@/enums/httpEnum';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getReviewList, deleteReview } from '@/api/project/list';
  import { columns } from './columns';
  import { PlusOutlined, SearchOutlined } from '@vicons/antd';
  // import { DownOutlined, AlignLeftOutlined, SearchOutlined, FormOutlined } from '@vicons/antd';

  import { useRouter } from 'vue-router';

  const props = defineProps({
    save_status: Number,
  });

  const { save_status } = toRefs(props);
  const rules = {
    keyword: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入检索条件',
    },
    address: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入地址',
    },
    date: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择日期',
    },
  };

  const schemas: FormSchema[] = [
    {
      field: 'keyword',
      labelMessage: '这是一个提示',
      component: 'NInput',
      label: '关键词检索',
      componentProps: {
        placeholder: '请输入计划编号/计划名称/项目来源',
        onInput: (e: any) => {
          console.log(e);
          formParams.keyword = e;
        },
      },
      rules: [{ required: true, message: '请输入检索条件', trigger: ['blur'] }],
    },
  ];

  const router = useRouter();
  const formRef: any = ref(null);
  const message = useMessage();
  const actionRef = ref();

  const showModal = ref(false);
  const showSearch = ref(false);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    save_status: 1,
    keyword: '',
    type: '',
  });

  const total = ref(0);
  const params = ref({
    page: 1,
    rows: 20,
    // name: 'xiaoMa',
  });

  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '关闭',
            // icon: 'ic:outline-delete-outline',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            // auth: ['basic_list'],
          },
          // {
          //   label: '预览',
          //   onClick: handleEdit.bind(null, record),
          //   ifShow: () => {
          //     return true;
          //   },
          //   // auth: ['basic_list'],
          // },
        ],

        select: (key) => {
          message.info(`您点击了，${key} 按钮`);
        },
      });
    },
  });

  const [register, {}] = useForm({
    gridProps: { cols: '2' },
    labelWidth: 180,
    schemas,
  });

  function addTable() {
    showModal.value = true;
    router.replace({ path: '/project/newplan' });
  }
  function showSearchBar() {
    showSearch.value = !showSearch.value;
  }

  const loadDataTable = async (res) => {
    // await getTableList({ ...formParams, ...params.value, ...res }).then((ret) => {
    //   console.log(ret.data.data.result);
    //   return ret.data.data;
    // });
    formParams.save_status = save_status.value;
    // debugger;
    return await getReviewList({ ...formParams, ...params.value, ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }
  function getPagination(pagination) {
    // console.log('11', pagination);
    total.value = pagination.itemCount;
  }

  function reloadTable() {
    actionRef.value.reload();
    // loadDataTable();
  }
  watch(save_status, () => {
    // debugger;
    active.value = false;
    reloadTable();
  });
  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate((errors) => {
      if (!errors) {
        message.success('新建成功');
        setTimeout(() => {
          showModal.value = false;
          reloadTable();
        });
      } else {
        message.error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  }

  function handleEdit(record: Recordable) {
    router.replace({ path: '/project/detail', query: { id: record.id } });
    // console.log('点击了编辑', record);
    // router.push({ name: 'basic-info', params: { id: record.id } });
  }

  async function handleDelete(record) {
    const ids = [record.id];

    let result = await deleteReview({ ids: ids });

    let code = result.data.code;

    if (code == BaseResultEnum.SUCCESS) {
      message.success('删除成功');
    } else {
      message.info(result.data.info);
    }

    reloadTable();
  }

  function handleSubmit(values: Recordable) {
    console.log(values);
    reloadTable();
  }

  function handleReset(values: Recordable) {
    console.log(values);
  }
</script>

<style lang="less" scoped>
  .pmp {
    ::v-deep(.n-card-header) {
      padding: 0;
    }
    .all {
      font-size: 16px;
      color: #2d8cf0;
      border-bottom: 2px solid;
      line-height: 20px;
      padding-bottom: 10px;
    }
    .search {
      margin: 8px;
    }
  }
</style>

function ids(ids: any[], ids: any[]) { throw new Error('Function not implemented.'); } function
res(res: any) { throw new Error('Function not implemented.'); }

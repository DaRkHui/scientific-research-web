<template>
  <n-card :bordered="false" class="proCard pmp" id="drawer-target">
    <template #header>
      <span class="all" v-if="status !== 5">
        <n-tabs default-value="0" @update:value="handleclickPr">
          <!-- <template #prefix> 全部（{{ total }}） </template> -->
          <n-tab name="0"> 全部（{{ total }}）</n-tab>
          <n-tab name="1">科研处初审通过 </n-tab>
          <n-tab name="2"> 科研处退回</n-tab>
          <n-tab name="3">待审核</n-tab>
          <template #suffix>
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
            <span class="search"
              ><n-button type="info" ghost @click="addTable">
                <template #icon>
                  <n-icon>
                    <CloudDownloadOutlined />
                  </n-icon>
                </template>
                导出
              </n-button>
            </span>
          </template>
        </n-tabs></span
      >
      <span class="all" v-else> 全部（{{ total }}）</span>
    </template>
    <BasicForm v-if="showSearch" @register="register" @submit="handleSubmit" @reset="handleReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>
    <!-- <n-divider /> -->
    <BasicTable
      :bordered="false"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      @update:pagination="getPagination"
      :scroll-x="1090"
    >
      <template #tableTitle>
        <n-tabs type="segment" default-value="2" @update:value="handleclick">
          <n-tab name="2">我负责的项目 </n-tab>
          <n-tab name="1">我参与的项目 </n-tab>
        </n-tabs>
      </template>
    </BasicTable>
    <n-modal
      v-model:show="showModal"
      :show-icon="false"
      preset="dialog"
      title="导出"
      style="min-width: calc(80vw - 500px)"
    >
      <Export :ids="idList" />
    </n-modal>
    <n-drawer
      v-model:show="active"
      width="100%"
      :placement="placement"
      :trap-focus="false"
      :block-scroll="false"
      to="#drawer-target"
    >
      <transition name="fade" mode="out-in" appear>
        <n-drawer-content>
          <detail @handleBack="activate('right')" />
        </n-drawer-content>
      </transition>
    </n-drawer>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, toRefs, watch, provide } from 'vue';
  import { useMessage, DrawerPlacement } from 'naive-ui';
  import { BaseResultEnum, ResultEnum } from '@/enums/httpEnum';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { myApply, deleteApply, myApplypr } from '@/api/project/list';
  import { columns } from './columns';
  import { PlusOutlined, SearchOutlined, CloudDownloadOutlined } from '@vicons/antd';
  import Export from './export.vue';
  import detail from '../expert/detail.vue';
  // import { DownOutlined, AlignLeftOutlined, SearchOutlined, FormOutlined } from '@vicons/antd';

  import { useRouter } from 'vue-router';

  const props = defineProps({
    status: Number,
    total: Number,
  });

  const { status, total } = toRefs(props);
  const childId = ref();
  provide('Id', childId);

  const active = ref(false);
  const placement = ref<DrawerPlacement>('top');
  const activate = (place: DrawerPlacement) => {
    active.value = !active.value;
    placement.value = place;
  };

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
  const idList = ref([]);

  const showModal = ref(false);
  const showSearch = ref(false);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    category: 2,
    pass_or_return: 0,
    save_status: 1,
    status: 0,
    b_type: 1,
    x_type: 2,
    keyword: '',
    type: '',
  });
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
          {
            label: '预览',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            // auth: ['basic_list'],
          },
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
  }
  function showSearchBar() {
    showSearch.value = !showSearch.value;
  }

  const loadDataTable = async (res) => {
    // await getTableList({ ...formParams, ...params.value, ...res }).then((ret) => {
    //   console.log(ret.data.data.result);
    //   return ret.data.data;
    // });
    formParams.status = status.value;
    if (status.value == 5) {
      formParams.save_status = 0;
      formParams.status = 0;
    }
    formParams.x_type = status.value + 2;
    // debugger;
    if (!formParams.pass_or_return || formParams.pass_or_return == 0) {
      return await myApply({ ...formParams, ...params.value, ...res });
    } else {
      return await myApplypr({ ...formParams, ...params.value, ...res });
    }
  };

  function onCheckedRow(rowKeys) {
    // console.log(rowKeys);
    idList.value = rowKeys;
  }
  function getPagination(pagination) {
    // console.log('11', pagination);
    // total.value = pagination.itemCount;
  }

  function reloadTable() {
    actionRef.value.reload();
    // loadDataTable();
  }
  watch(status, () => {
    // debugger;
    active.value = false;
    reloadTable();
  });
  function handleclick(e) {
    console.log(e);
    formParams.category = e;
    reloadTable();
  }
  function handleclickPr(e) {
    console.log(e);
    formParams.pass_or_return = e;
    reloadTable();
  }
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
    // router.replace({ path: '/project/detail', query: { id: record.id } });
    childId.value = record.id;

    activate('right');
  }

  async function handleDelete(record) {
    const ids = [record.id];

    let result = await deleteApply({ ids: ids });

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
    min-height: 1000px;
    ::v-deep(.n-card-header) {
      padding: 0;
    }
    .all {
      font-size: 16px;
      color: #2d8cf0;
      border-bottom: 2px solid;
      line-height: 20px;
      // padding-bottom: 10px;
    }
    .search {
      margin: 8px 16px;
    }
  }
</style>

function ids(ids: any[], ids: any[]) { throw new Error('Function not implemented.'); } function
res(res: any) { throw new Error('Function not implemented.'); }

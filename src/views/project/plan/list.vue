<template>
  <n-card :bordered="false" class="proCard pmp" id="drawer-target">
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
        <router-link to="/project/newplan">
          <n-button type="primary" size="large">新增申报计划</n-button></router-link
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

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="名称" path="name">
          <n-input placeholder="请输入名称" v-model:value="formParams.name" />
        </n-form-item>
        <n-form-item label="地址" path="address">
          <n-input type="textarea" placeholder="请输入地址" v-model:value="formParams.address" />
        </n-form-item>
        <n-form-item label="日期" path="date">
          <n-date-picker type="datetime" placeholder="请选择日期" v-model:value="formParams.date" />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
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
          <Detail @handleBack="activate('right')" />
        </n-drawer-content>
      </transition>
    </n-drawer>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, toRefs, watch, unref, provide } from 'vue';
  import { useMessage, DrawerPlacement } from 'naive-ui';
  import { BaseResultEnum, ResultEnum } from '@/enums/httpEnum';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getTableList, deleteApply, closePlan } from '@/api/project/list';
  import { columns } from './columns';
  import Detail from '../detail/planDetail.vue';
  import { PlusOutlined, SearchOutlined } from '@vicons/antd';
  // import { DownOutlined, AlignLeftOutlined, SearchOutlined, FormOutlined } from '@vicons/antd';

  import { useRouter } from 'vue-router';

  const props = defineProps<{
    // eslint-disable-next-line vue/prop-name-casing
    save_status: Number;
  }>();
  const { save_status } = toRefs(props);
  const childId = ref();
  provide('Id', childId);
  const active = ref(false);
  const placement = ref<DrawerPlacement>('top');
  const activate = (place: DrawerPlacement) => {
    active.value = !active.value;
    placement.value = place;
  };

  const rules: any = {
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
  const ctx = defineEmits(['getTotal']);
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
          [
            {
              label: '编辑',

              onClick: handleDetail.bind(null, record),

              ifShow: () => {
                return true;
              },
            },
            // {
            //   label: '发布',
            //   onClick: handleEdit.bind(null, record),
            //   ifShow: () => {
            //     return true;
            //   },
            // },
            {
              label: '删除',

              onClick: handleDelete.bind(null, record),

              ifShow: () => {
                return true;
              },
            },
          ],
          [
            {
              label: '预览',
              onClick: handleEdit.bind(null, record),
              ifShow: () => {
                return true;
              },
            },
            {
              label: '关闭',

              onClick: handleClose.bind(null, record),

              ifShow: () => {
                return true;
              },
            },
          ],
          [
            {
              label: '预览',
              onClick: handleEdit.bind(null, record),
              ifShow: () => {
                return true;
              },
            },
            {
              label: '删除',

              onClick: handleDelete.bind(null, record),

              ifShow: () => {
                return true;
              },
            },
          ],
        ][save_status.value],

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
  watch(save_status, () => {
    // debugger;
    active.value = false;
    reloadTable();
  });
  function addTable() {
    showModal.value = true;
    router.replace({ path: '/project/newplan' });
  }
  function showSearchBar() {
    showSearch.value = !showSearch.value;
  }

  const loadDataTable = async (res) => {
    formParams.save_status = save_status.value;
    return await getTableList({ ...formParams, ...params.value, ...res });
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
    console.log(childId);
    activate('right');
  }
  function handleDetail(record: Recordable) {
    router.replace({ path: '/project/newplan', query: { id: record.id } });
  }

  async function handleClose(record) {
    const ids = [record.id];
    let result = await closePlan({ ids: ids });

    let code = result.data.code;

    if (code == BaseResultEnum.SUCCESS) {
      message.success('关闭成功');
    } else {
      message.info(result.data.info);
    }

    ctx('getTotal');
    reloadTable();
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
    ctx('getTotal');
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
      padding-bottom: 10px;
    }
    .search {
      margin: 8px;
    }
  }
</style>

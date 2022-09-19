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
            <span class="search"><n-button size="large" type="success"> 批量审核 </n-button> </span>
            <!-- <n-button @click="activate('right')"> 右 </n-button> -->
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
      :showSetting="false"
      :bordered="false"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      @update:pagination="getPagination"
      :scroll-x="1090"
    /><n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="审核">
      <n-form
        :model="auditForm"
        :rules="adrule"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="审核结果：" path="choice">
          <n-radio-group v-model:value="auditForm.choice" name="radiogroup">
            <n-space>
              <n-radio v-for="item in auditChoice" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="审核意见：" path="des">
          <n-input type="textarea" placeholder="请输入意见" v-model:value="auditForm.des" />
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
      :trap-focus="true"
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
  import { getExportList, toSummmary, myApplypr } from '@/api/project/list';
  import { columns } from './columns';
  import { PlusOutlined, SearchOutlined } from '@vicons/antd';
  // import { DownOutlined, AlignLeftOutlined, SearchOutlined, FormOutlined } from '@vicons/antd';
  import detail from './detail.vue';
  import { useRouter } from 'vue-router';
  const props = defineProps({
    status: Number,
    total: Number,
  });
  const { status } = toRefs(props);
  const childId = ref();
  provide('Id', childId);

  const active = ref(false);
  const placement = ref<DrawerPlacement>('top');
  const activate = (place: DrawerPlacement) => {
    active.value = !active.value;
    placement.value = place;
  };

  const adrule = {
    choice: {
      required: true,
      trigger: ['blur'],
      message: '请选择审核结果',
    },
    des: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入审批意见',
    },
  };
  const auditForm = reactive({
    b_type: '1',
    choice: '',
    id: '',
    des: '',
    x_type: 2,
    need_review: '',
  });
  const auditChoice = [
    {
      value: '2',
      label: '同意立项',
    },
    {
      value: '3',
      label: '不予立项',
    },
  ];
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
  const ids = ref([]);
  const showModal = ref(false);
  const showSearch = ref(false);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    // category: 2,
    // pass_or_return: 0,
    // save_status: 1,
    status: 0,

    keyword: '',
  });

  const params = ref({
    page: 1,
    rows: 20,
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
            label: '详情',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            // auth: ['basic_list'],
          },
          {
            label: '审核',

            ifShow: () => {
              return true;
            },
          },
        ],

        select: (key) => {
          message.info(`您点击了，${key} 按钮`);
        },
      });
    },
  });
  function handleSelect(record) {
    showModal.value = true;
    auditForm.id = record.id;
    auditForm.need_review = '1';
    auditForm.x_type = Number(status.value) + 2;
  }
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
    formParams.status = status.value;
    if (status.value == 5) {
      formParams.save_status = 0;
      formParams.status = 0;
    }
    // formParams.x_type = status.value + 2;
    // debugger;
    // if (!formParams.pass_or_return || formParams.pass_or_return == 0) {
    return await getExportList({ ...formParams, ...params.value, ...res });
    // }
    //  else {
    //   return await myApplypr({ ...formParams, ...params.value, ...res });
    // }
  };
  function onCheckedRow(rowKeys) {
    ids.value = rowKeys;
  }

  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors) => {
      if (!errors) {
        let formData = new window.FormData();
        for (const key in auditForm) {
          if (Object.prototype.hasOwnProperty.call(auditForm, key)) {
            const element = auditForm[key];
            formData.append(key, element);
          }
        }
        let result = await toSummmary(formData);

        let code = result.data.code;

        if (code == BaseResultEnum.SUCCESS) {
          message.success('操作成功');
        } else {
          message.info(result.data.info);
        }

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

  function handleclickPr(e) {
    console.log(e);
    formParams.pass_or_return = e;
    reloadTable();
  }
  // function confirmForm(e) {
  //   e.preventDefault();
  //   formBtnLoading.value = true;
  //   formRef.value.validate((errors) => {
  //     if (!errors) {
  //       message.success('新建成功');
  //       setTimeout(() => {
  //         showModal.value = false;
  //         reloadTable();
  //       });
  //     } else {
  //       message.error('请填写完整信息');
  //     }
  //     formBtnLoading.value = false;
  //   });
  // }

  function handleEdit(record: Recordable) {
    childId.value = record.id;

    activate('right');
    // emit('toDetail', record);
    // router.replace({ path: '/project/exportDetail', query: { id: record.id } });
    // console.log('点击了编辑', record);
    // router.push({ name: 'basic-info', params: { id: record.id } });
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
      margin: 8px;
    }
  }
</style>

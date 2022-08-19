<template>
  <div>
    <n-card :bordered="false" class="mt-4 proCard">
      <n-form
        :label-width="200"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        ref="formRef"
        class="newPlan"
        inline
      >
        <span class="from-title">项目基本信息</span>
        <n-divider />
        <n-grid cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen">
          <n-grid-item>
            <n-form-item label="项目名称" path="name" required>
              <n-input v-model:value="formValue.name" placeholder="输入项目名称" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="申报计划名称" path="plan" required>
              <n-input v-model:value="formValue.plan" disabled />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="项目编号" path="id_num">
              <n-input placeholder="计划编号" v-model:value="formValue.id_num" disabled />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="批准号" path="id_num">
              <n-input placeholder="批准号" v-model:value="formValue.id_num" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="负责人" path="user_name" required>
              <n-input placeholder="项目来源单位" v-model:value="formValue.user_name" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="联系方式" path="phone" required>
              <n-input placeholder="项目来源单位" v-model:value="formValue.phone" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="所属科室" path="department" required>
              <n-input placeholder="所属科室" v-model:value="formValue.department" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="项目类别" path="type" required>
              <n-select
                placeholder="请选择项目类别"
                :options="matterList"
                v-model:value="formValue.type"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="项目开始时间" path="start_date" required>
              <n-date-picker type="date" v-model:value="formValue.start_date" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="项目级别" path="level" required>
              <n-input :placeholder="levelFilters(formValue.level)" disabled />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="计划完成时间" path="end_date" required>
              <n-date-picker v-model:value="formValue.end_date" type="date" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="预计经费" path="expenses">
              <n-input-group>
                <n-input :style="{ width: '93%' }" v-model:value="formValue.expenses" />
                <n-input-group-label>万元</n-input-group-label>
              </n-input-group>
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <span class="from-title">上传材料附件</span>
        <n-divider />
        <n-grid cols="1 s:1 m:1 l:1 xl:1 2xl:1" responsive="screen">
          <n-grid-item>
            <n-form-item label="申请材料" path="des" required>
              <n-upload
                ref="upload"
                action="#"
                :default-upload="false"
                accept=".pdf"
                multiple
                @change="handleChange"
              >
                <n-button>选择文件</n-button>
              </n-upload>
            </n-form-item>
          </n-grid-item></n-grid
        >

        <p class="from-title">项目成员 <n-button @click="addTable"> 添加成员 </n-button></p>
        <n-divider />
        <n-grid cols="1 s:1 m:1 l:1 xl:1 2xl:1" responsive="screen">
          <n-grid-item>
            <n-data-table
              :columns="columns"
              :data="newMember"
              :pagination="pagination"
              :max-height="250"
            />
          </n-grid-item>
        </n-grid>
        <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建">
          <n-form
            :model="formParams"
            ref="memberRef"
            label-placement="left"
            :label-width="80"
            class="py-4"
          >
            <n-form-item label="人员" path="name">
              <n-select
                label-field="username"
                value-field="userid"
                v-model:value="formParams.userid"
                filterable
                :options="memberList"
              />
            </n-form-item>
            <n-form-item label="分工" path="dowork">
              <n-input placeholder="请分配人员分工" v-model:value="formParams.dowork" />
            </n-form-item>
          </n-form>

          <template #action>
            <n-space>
              <n-button @click="() => (showModal = false)">取消</n-button>
              <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
            </n-space>
          </template>
        </n-modal>
        <n-divider />
        <br />
        <div style="margin-left: 80px">
          <n-space>
            <n-button type="primary" @click="formSubmit(1)">发布</n-button>
            <n-button @click="formSubmit(0)">保存为草稿</n-button>
            <n-button @click="resetForm">取消</n-button>
          </n-space>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, reactive, onMounted, defineComponent } from 'vue';
  import { levelFilters, typeFilters } from '@/utils/filters.ts';
  import { useMessage } from 'naive-ui';
  import { BasicUpload } from '@/components/Upload';
  import { columns } from './columns';
  import { BaseResultEnum, ResultEnum } from '@/enums/httpEnum';
  import { useGlobSetting } from '@/hooks/setting';
  import { newApply, getApplyInfo } from '@/api/project/list';
  import { queryuser } from '@/api/system/user';
  import { BasicTable, TableAction } from '@/components/Table';
  import { useUserStore } from '@/store/modules/user';
  import { useRouter, useRoute } from 'vue-router';
  import { formatToDate } from '@/utils/dateUtil.ts';
  import type { UploadInst, UploadFileInfo } from 'naive-ui';
  import { file } from '@babel/types';

  const route = useRoute();
  const globSetting = useGlobSetting();
  const userStore = useUserStore();
  const memberList = ref([]);
  const matterList = [
    {
      label: '横向',
      value: 1,
    },
    {
      label: '纵向',
      value: 2,
    },
  ];

  const doctorList = [
    {
      label: '李医生',
      value: 1,
    },
    {
      label: '黄医生',
      value: 2,
    },
    {
      label: '张医生',
      value: 3,
    },
  ];
  const pagination = {
    pageSize: 15,
  };
  const rules = {
    name: {
      required: true,
      message: '请输入申报计划名称',
      trigger: 'blur',
    },
    department: {
      required: true,
      message: '请输入项目来源单位',
      trigger: 'blur',
    },
    id_num: {
      required: true,
      message: '请输入计划编号',
      trigger: ['input'],
    },
    end_date: {
      required: true,
      type: 'number',
      message: '请选择预约时间',
      trigger: ['blur', 'change'],
    },
    start_date: {
      required: true,
      type: 'number',
      message: '请选择预约时间',
      trigger: ['blur', 'change'],
    },
  };

  const showSetting = ref(false);
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const approvalList = ref([]);
  const newMember = ref([]);
  const levelList = [
    {
      label: '院级',
      value: 4,
    },
    {
      label: '市厅级',
      value: 3,
    },
    {
      label: '省部级级',
      value: 2,
    },
    {
      label: '国家级',
      value: 1,
    },
  ];
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
            label: '删除',
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
  const formRef: any = ref(null);
  const memberRef: any = ref(null);
  const message = useMessage();
  const router = useRouter();
  const formParams = reactive({
    userid: '',
    dowork: '',
  });
  const defaultValueRef = () => ({
    plan: '',
    approval_id: '',
    created_user_id: '',
    department: '',
    end_date: ref(new Date()),
    expenses: '',
    level: 0,
    material_template_info: '',
    name: '',
    phone: '',
    project_apply_plan_id: '',
    save_status: 0,
    start_date: ref(new Date()),
    type: 0,
    user_name: '',
    users: '',
  });

  let formValue = reactive(defaultValueRef());

  const fileList = ref([] as any);
  const fileListLengthRef = ref(0);
  const uploadRef = ref<UploadInst | null>(null);
  const loadDataTable = async () => {};
  async function addTable() {
    const data = await queryuser();
    console.log(data);
    memberList.value = data.list;

    showModal.value = true;
  }
  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;

    let list = memberList.value.find((obj) => {
      return obj.userid === formParams.userid;
    });
    console.log(list);
    let copy = Object.assign({}, formParams, list);
    newMember.value.push(copy);
    showModal.value = false;
    formBtnLoading.value = false;
  }

  function handleChange(options: { fileList: UploadFileInfo[] }) {
    fileList.value = options.fileList;
    fileListLengthRef.value = options.fileList.length;
  }

  function handleDelete(record) {}
  function formSubmit(status) {
    // debugger
    formRef.value.validate(async (errors) => {
      if (!errors) {
        formValue.save_status = status;
        formValue.end_date = formatToDate(formValue.end_date);
        formValue.start_date = formatToDate(formValue.start_date);
        formValue.save_status = status;
        formValue.users = JSON.stringify(newMember.value);
        let arr = Array.from({ ...fileList.value, length: fileList.value.length }).map(
          (file, index) => ({
            file_name: file.name,
            des: '',
          })
        );
        formValue.material_template_info = JSON.stringify(arr);
        let formData = new window.FormData();
        for (const key in formValue) {
          if (Object.prototype.hasOwnProperty.call(formValue, key)) {
            const element = formValue[key];
            formData.append(key, element);
          }
        }
        fileList.value.forEach((file, index) => {
          formData.append(`file${index + 1}`, file.file);
        });
        // debugger;
        const result = await newApply(formData);
        console.log(result.data.code);
        let code = result.data.code;
        // debugger
        if (code == BaseResultEnum.SUCCESS) {
          if (status) {
            message.success('项目申报提交成功');
          } else {
            message.success('保存草稿成功');
          }
          router.replace({ path: '/project/plan' });
          // debugger
        } else {
          message.info(result.data.info);
        }
      } else {
        message.error('验证失败，请填写完整信息');
      }
    });
  }
  onMounted(async () => {
    const data = await getApplyInfo({ id: route.query.id });
    let detail = data.data.data;
    console.log(detail);
    formValue.plan = detail.name;
    formValue.level = detail.level;
    formValue.id_num = detail.id_num;
    formValue.expert_approval_id = detail.expert_approval_id;
    formValue.project_apply_plan_id = detail.id;
    formValue.approval_id = detail.approval_id;
  });
  function resetForm() {
    router.replace({ path: '/project/plan' });
    // formRef.value.restoreValidation();
    // formValue = Object.assign(unref(formValue), defaultValueRef());
  }

  function uploadChange(list: string[]) {
    console.log(list);
  }
</script>
<style lang="less">
  .newPlan {
    width: 80% !important;
    flex-wrap: wrap;
    justify-content: center;
    margin: 10px;
    .from-title {
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>

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
            <n-form-item label="评审计划名称" path="review_plan_name">
              <n-input v-model:value="formValue.review_plan_name" placeholder="输入评审计划名称" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="选择申报计划" path="order_id">
              <n-select
                placeholder="请选择申报计划"
                :options="planList"
                label-field="name"
                value-field="id"
                v-model:value="formValue.order_id"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="评审开始时间">
              <n-date-picker type="date" v-model:value="start_date" format="yyyy-mm-dd" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="评审截止时间">
              <n-date-picker type="date" v-model:value="end_date" format="yyyy-mm-dd" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="选择评审专家" path="type" required>
              <n-select
                placeholder="请选择评审专家"
                :options="expertList"
                label-field="user_name"
                value-field="user_id"
                v-model:value="formValue.export_json"
                multiple
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="评审指南" path="des" required>
              <n-upload
                ref="upload"
                action="#"
                :default-upload="false"
                accept=".pdf"
                @change="handleChange"
              >
                <n-button>选择文件</n-button>
              </n-upload>
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="评审说明" path="des">
              <n-input
                v-model:value="formValue.des"
                type="textarea"
                placeholder="请输入预约备注"
              /> </n-form-item
          ></n-grid-item>
        </n-grid>
        <n-grid cols="1 s:1 m:1 l:1 xl:1 2xl:1" responsive="screen">
          <n-grid-item>
            <n-form-item label="选择评审方案" path="type" required>
              <n-button @click="addTable"> 设置方案 </n-button>
              <br />
              <n-data-table
                :columns="columns"
                :data="newScheme"
                :pagination="pagination"
                :max-height="250"
              />
            </n-form-item> </n-grid-item
        ></n-grid>

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
  import { ref, unref, reactive, onMounted } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicUpload } from '@/components/Upload';
  import { BaseResultEnum, ResultEnum } from '@/enums/httpEnum';
  import { useGlobSetting } from '@/hooks/setting';
  import { newReviewPlan, selectExpert, selectReviewPlan } from '@/api/project/list';
  import { queryapprovermenu } from '@/api/system/user';
  import { useUserStore } from '@/store/modules/user';
  import { useRouter } from 'vue-router';
  import { formatToDate } from '@/utils/dateUtil.ts';
  import type { UploadInst, UploadFileInfo } from 'naive-ui';
  import { useTabsViewStore } from '@/store/modules/tabsView';
  const tabsViewStore = useTabsViewStore();
  const globSetting = useGlobSetting();
  const userStore = useUserStore();
  const fileList = ref([] as any);
  const fileListLengthRef = ref(0);
  const uploadRef = ref<UploadInst | null>(null);
  const expertList = ref([]);
  const planList = ref([]);
  const pagination = {
    pageSize: 15,
  };
  const newScheme = ref([] as any);
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
  const approvalList = ref([]);
  const expert = ref();
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
  const formRef: any = ref(null);
  const message = useMessage();
  const { uploadUrl } = globSetting;
  const router = useRouter();
  const start_date = ref(null);
  const end_date = ref(null);
  const defaultValueRef = () => ({
    apply_id: '',
    created_user_id: '',
    des: '',
    export_json: '',
    file_name: '',
    file_path: '',
    order_id: 0,
    review_plan_name: '',
    review_program_id: 0,
    review_time_end: '',
    review_time_strat: '',
    save_status: 0,
  });
  const columns = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Age',
      key: 'age',
    },
    {
      title: 'Address',
      key: 'address',
    },
  ];
  let formValue = reactive(defaultValueRef());
  const uploadList = ref([
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  ]);
  const uploadHeaders = reactive({
    platform: 'miniPrograms',
    timestamp: new Date().getTime(),
    token: 'Q6fFCuhc1vkKn5JNFWaCLf6gRAc5n0LQHd08dSnG4qo=',
  });
  async function addTable() {
    const data = await queryuser();
    console.log(data);
    memberList.value = data.list;

    showModal.value = true;
  }
  function handleChange(options: { fileList: UploadFileInfo[] }) {
    fileList.value = options.fileList;
    fileListLengthRef.value = options.fileList.length;
  }

  function formSubmit(status) {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        formValue.save_status = status;
        formValue.review_time_end = formatToDate(end_date.value);
        formValue.review_time_strat = formatToDate(start_date.value);
        formValue.save_status = status;
        let formData = new window.FormData();
        for (const key in formValue) {
          if (Object.prototype.hasOwnProperty.call(formValue, key)) {
            const element = formValue[key];
            formData.append(key, element);
          }
        }
        // debugger;
        const result = await newReviewPlan(formData);
        // console.log(result.data.code);
        let code = result.data.code;
        // debugger
        if (code == BaseResultEnum.SUCCESS) {
          if (status) {
            message.success('申请计划发布成功');
          } else {
            message.success('保存草稿成功');
          }
          router.replace({ path: 'project/myProject' });
          tabsViewStore.closeCurrentTab(route);
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
    const params = {
      name: '',
      totalcount: 0,
      pageno: 1,
      pagesize: 10,
    };

    let formData = new window.FormData();
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const element = params[key];
        formData.append(key, element);
      }
    }
    queryapprovermenu(formData).then((res) => {
      const ret = res.map((item) => {
        return Object.assign({}, { value: item.approver_id, label: item.name });
      });
      console.log(ret);
      approvalList.value = ret;
    });
    const data = await selectExpert();
    // debugger;
    expertList.value = data.data.data.result;
    const list = await selectReviewPlan();
    // debugger;
    planList.value = list.data.data.result;
    console.log(expertList.value);
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
    .n-upload-trigger + .n-upload-file-list {
      margin-top: 0;
      display: inline-block;
    }
  }
</style>

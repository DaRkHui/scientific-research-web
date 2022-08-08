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
            <n-form-item label="项目名称" path="name">
              <n-input v-model:value="formValue.name" placeholder="输入申报计划名称" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="申报计划名称" path="name">
              <n-input v-model:value="formValue.name" placeholder="输入申报计划名称" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="项目编号" path="id_num">
              <n-input placeholder="计划编号" v-model:value="formValue.id_num" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="计划编号" path="id_num">
              <n-input placeholder="计划编号" v-model:value="formValue.id_num" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="负责人" path="department">
              <n-input placeholder="项目来源单位" v-model:value="formValue.department" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="联系方式" path="department">
              <n-input placeholder="项目来源单位" v-model:value="formValue.department" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="所属科室" path="type" required>
              <n-select
                placeholder="请选择项目类别"
                :options="matterList"
                v-model:value="formValue.type"
                multiple
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="项目类别" path="type" required>
              <n-select
                placeholder="请选择项目类别"
                :options="matterList"
                v-model:value="formValue.type"
                multiple
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="项目开始时间" path="start_date">
              <n-date-picker type="date" v-model:value="formValue.start_date" format="yyyy-mm-dd" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="项目级别" path="type" required>
              <n-select
                placeholder="请选择项目类别"
                :options="matterList"
                v-model:value="formValue.type"
                multiple
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="计划完成时间" path="end_date">
              <n-date-picker type="date" v-model:value="formValue.end_date" format="yyyy-mm-dd" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="审核流程设置" path="approval_id" required>
              <n-select
                placeholder="请选择审核流程"
                :options="approvalList"
                v-model:value="formValue.approval_id"
                multiple
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="项目级别" path="level" required>
              <n-select
                placeholder="请选择项目级别"
                :options="levelList"
                v-model:value="formValue.level"
                multiple
              />
            </n-form-item>
          </n-grid-item>
          <!-- <n-grid-item>
            <n-form-item label="是否需要专家线上评审" path="need_review" required>
              <n-radio-group v-model:value="formValue.need_review" name="need_review">
                <n-space>
                  <n-radio :value="1">是</n-radio>
                  <n-radio :value="2">否</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </n-grid-item> -->
          <!-- <n-grid-item>
            <n-form-item label="申报限额" path="need_review">
              <n-radio-group v-model:value="formValue.need_review" name="sex" disabled>
                <n-space>
                  <n-radio :value="1">是</n-radio>
                  <n-radio :value="2">否</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </n-grid-item> -->
          <n-grid-item>
            <n-form-item label="预计经费" path="des">
              <n-input-number v-model:value="value">
                <template #prefix> ￥ </template>
              </n-input-number>
            </n-form-item>
          </n-grid-item>

          <!-- <n-grid-item> </n-grid-item> -->
        </n-grid>
        <span class="from-title">上传材料附件</span>
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
  import { ref, unref, reactive, onMounted } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicUpload } from '@/components/Upload';
  import { BaseResultEnum, ResultEnum } from '@/enums/httpEnum';
  import { useGlobSetting } from '@/hooks/setting';
  import { newApply } from '@/api/project/list';
  import { queryapprovermenu } from '@/api/system/user';
  import { useUserStore } from '@/store/modules/user';
  import { useRouter } from 'vue-router';
  import { formatToDate } from '@/utils/dateUtil.ts';
  const globSetting = useGlobSetting();
  const userStore = useUserStore();
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
    // type: {
    //   // required: true,
    //   type: 'number',
    //   message: '请选择项目列别',
    //   trigger: 'blur',
    // },
  };
  const approvalList = ref([]);
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
  // debugger;
  const defaultValueRef = () => ({
    approval_id: '',
    created_user_id: userStore.userid,
    department: '',
    des: '',
    end_date: [],
    expert_approval_id: '',
    id_num: '',
    material_template_info: '',
    name: '',
    need_review: 2,
    save_status: 0,
    start_date: [],
    type: '1',
    level: '',
  });

  let formValue = reactive(defaultValueRef());
  const uploadList = ref([
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  ]);
  const uploadHeaders = reactive({
    platform: 'miniPrograms',
    timestamp: new Date().getTime(),
    token: 'Q6fFCuhc1vkKn5JNFWaCLf6gRAc5n0LQHd08dSnG4qo=',
  });

  function formSubmit(status) {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        formValue.save_status = status;
        formValue.end_date = formatToDate(formValue.end_date);
        formValue.start_date = formatToDate(formValue.start_date);
        formValue.save_status = status;
        let formData = new window.FormData();
        for (const key in formValue) {
          if (Object.prototype.hasOwnProperty.call(formValue, key)) {
            const element = formValue[key];
            formData.append(key, element);
          }
        }
        // debugger;
        const result = await newApply(formData);
        // console.log(result.data.code);
        let code = result.data.code;
        // debugger
        if (code == BaseResultEnum.SUCCESS) {
          if (status) {
            message.success('申请计划发布成功');
          } else {
            message.success('保存草稿成功');
          }
          router.replace({ path: '/project/plan' });
          // debugger
        } else {
          message.info(result.data.info);
        }

        // const ret = result.data.data;

        // //  arr3=arr2.filter(item=>item.id == 20)
        // console.log('====================================');
        // console.log(formParams);
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

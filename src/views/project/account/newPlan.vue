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
        <span>编辑申报计划</span>
        <n-divider />
        <n-grid cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen">
          <n-grid-item>
            <n-form-item label="申报计划名称" path="name">
              <n-input v-model:value="formValue.name" placeholder="输入申报计划名称" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="项目来源单位" path="department">
              <n-input placeholder="项目来源单位" v-model:value="formValue.department" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="计划编号" path="id_num">
              <n-input placeholder="计划编号" v-model:value="formValue.id_num" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="预约事项" path="type">
              <n-select
                placeholder="请选择预约事项"
                :options="matterList"
                v-model:value="formValue.matter"
                multiple
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="申报开始时间" path="start_date">
              <n-date-picker type="datetime" v-model:value="formValue.start_date" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="申报结束时间" path="end_date">
              <n-date-picker type="datetime" v-model:value="formValue.end_date" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="是否需要专家线上评审" path="need_review" required>
              <n-radio-group v-model:value="formValue.need_review" name="need_review">
                <n-space>
                  <n-radio :value="1">是</n-radio>
                  <n-radio :value="2">否</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="申报限额" path="need_review">
              <n-radio-group v-model:value="formValue.need_review" name="sex">
                <n-space>
                  <n-radio :value="1">是</n-radio>
                  <n-radio :value="2">否</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="申报说明" path="des">
              <n-input v-model:value="formValue.des" type="textarea" placeholder="请输入预约备注" />
            </n-form-item>
          </n-grid-item>

          <!-- <n-grid-item> </n-grid-item> -->
        </n-grid>
        <span>材料附件模板</span>
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
  import { ref, unref, reactive } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicUpload } from '@/components/Upload';
  import { useGlobSetting } from '@/hooks/setting';
  import { newApply } from '@/api/project/list';
  const globSetting = useGlobSetting();

  const matterList = [
    {
      label: '种牙',
      value: 1,
    },
    {
      label: '补牙',
      value: 2,
    },
    {
      label: '根管',
      value: 3,
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
    type: {
      required: true,
      type: 'number',
      message: '请选择项目列别',
      trigger: 'change',
    },
  };

  const formRef: any = ref(null);
  const message = useMessage();
  const { uploadUrl } = globSetting;

  const defaultValueRef = () => ({
    approval_id: '',
    created_user_id: '',
    department: '',
    des: '',
    end_date: [],
    expert_approval_id: '',
    id_num: '',
    material_template_info: '',
    name: '',
    need_review: 0,
    save_status: 0,
    start_date: [],
    type: 1,
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
    formRef.value.validate((errors) => {
      if (!errors) {
        formValue.save_status = status;
        let formData = new window.FormData();
        for (const key in formValue) {
          if (Object.prototype.hasOwnProperty.call(formValue, key)) {
            const element = formValue[key];
            formData.append(key, element);
          }
        }
        const result = newApply(formData);
        // const ret = result.data.data;

        // //  arr3=arr2.filter(item=>item.id == 20)
        // console.log('====================================');
        // console.log(formParams);
      } else {
        message.error('验证失败，请填写完整信息');
      }
    });
  }

  function resetForm() {
    formRef.value.restoreValidation();
    formValue = Object.assign(unref(formValue), defaultValueRef());
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
  }
</style>

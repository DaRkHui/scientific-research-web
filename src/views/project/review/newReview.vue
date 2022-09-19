<template>
  <div>
    <n-card :bordered="false" class="mt-4 proCard">
      <span class="from-title">新增评审计划</span>
      <n-divider />
      <n-steps :current="current" :status="currentStatus" vertical>
        <n-step title="项目基本信息">
          <div class="n-step-description">
            <n-form
              :label-width="200"
              :model="formRef1"
              :rules="rules1"
              :disabled="current !== 1"
              label-placement="left"
              ref="formRefOne"
              class="newPlan"
              inline
            >
              <n-grid cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen">
                <n-grid-item>
                  <n-form-item label="评审计划名称" path="review_plan_name" required>
                    <n-input
                      v-model:value="formRef1.review_plan_name"
                      placeholder="输入评审计划名称"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item label="选择申报计划" path="order_id" required>
                    <n-select
                      placeholder="请选择申报计划"
                      :options="planList"
                      label-field="name"
                      value-field="id"
                      @update:value="handleUpdatePlan"
                    />
                  </n-form-item>
                </n-grid-item>

                <n-grid-item>
                  <n-form-item label="评审开始时间" required path="start_date">
                    <n-date-picker type="date" v-model:value="formRef1.start_date" />
                  </n-form-item>
                </n-grid-item>

                <n-grid-item>
                  <n-form-item label="评审截止时间" required path="end_date">
                    <n-date-picker type="date" v-model:value="formRef1.end_date" />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item label="选择评审专家" path="export" required>
                    <n-select
                      placeholder="请选择评审专家"
                      :options="expertList"
                      label-field="user_name"
                      value-field="user_id"
                      @update:value="handleUpdateValue"
                      multiple
                    />
                  </n-form-item>
                </n-grid-item>

                <n-grid-item>
                  <n-form-item label="评审指南" path="file_name">
                    <n-upload
                      ref="upload"
                      action="#"
                      :multiple="false"
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
                      placeholder="请输入评审说明"
                    /> </n-form-item
                ></n-grid-item>
              </n-grid>
            </n-form>
            <n-divider />
            <n-button v-if="current === 1" :type="buttonType" size="small" @click="next('1')">
              下一步
            </n-button>
          </div>
        </n-step>
        <n-step title="项目分配">
          <div class="n-step-description">
            <n-form
              :label-width="200"
              :model="formRef1"
              v-if="current >= 2"
              :disabled="current !== 2"
              label-placement="left"
              ref="formRefTwo"
              class="newPlan"
              inline
            >
              <n-form-item
                v-for="(item, index) in formRef1.export"
                :key="index"
                :label="item.user_name"
                :path="`export[${index}].project_apply_id`"
                :rule="{
                  type: 'array',
                  required: true,
                  message: `请选择`,
                  trigger: ['input', 'blur'],
                }"
              >
                <n-checkbox-group v-model:value="item.project_apply_id">
                  <n-space v-for="(i, index) in plancheck" :key="i.id">
                    <n-checkbox :value="i.id" :label="i.name" />
                  </n-space>
                </n-checkbox-group>
              </n-form-item>
            </n-form>
            <n-divider />
            <n-button v-if="current === 2" :type="buttonType" size="small" @click="prev">
              上一步
            </n-button>
            <n-button v-if="current === 2" :type="buttonType" size="small" @click="next('2')">
              下一步
            </n-button>
          </div>
        </n-step>
        <n-step title="设置评审方案">
          <div class="n-step-description">
            <n-form
              :label-width="45"
              :model="model"
              :disabled="current !== 3"
              label-placement="left"
              ref="formRefThree"
              inline
            >
              <n-card hoverable>
                <n-form-item label="名称" path="name" style="width: 50%">
                  <n-input v-model:value="model.name" placeholder="请输入名称" required />
                </n-form-item>
                <n-form-item label="备注" path="des" style="width: 50%">
                  <n-input v-model:value="model.des" placeholder="请输入备注" required />
                </n-form-item>

                <n-dynamic-input
                  show-sort-button
                  v-model:value="model.program_json"
                  item-style="width: 64%;"
                  :on-create="onCreate"
                  #="{ index, value }"
                >
                  <div style="display: flex; width: 80%"
                    ><n-tag round small :bordered="false" type="info" style="margin: 0 10px">
                      {{ index + 1 }}
                    </n-tag>

                    <n-form-item
                      ignore-path-change
                      :show-label="false"
                      :path="`program_json[${index}].content`"
                      :rule="dynamicInputRule"
                      style="width: 30%"
                    >
                      <n-input
                        v-model:value="model.program_json[index].content"
                        placeholder="请输入评审内容"
                        @keydown.enter.prevent
                      />
                    </n-form-item>

                    <n-form-item
                      ignore-path-change
                      :show-label="false"
                      :path="`program_json[${index}].proportion`"
                      :rule="dynamicInputRule"
                    >
                      <n-input
                        v-model:value="model.program_json[index].proportion"
                        placeholder="所占分数"
                        @keydown.enter.prevent
                      />
                    </n-form-item>
                    <n-form-item
                      ignore-path-change
                      :show-label="false"
                      :path="`program_json[${index}].des`"
                      :rule="dynamicInputRule"
                      style="width: 50%"
                    >
                      <n-input
                        v-model:value="model.program_json[index].des"
                        placeholder="备注说明"
                        @keydown.enter.prevent
                      />
                    </n-form-item>
                  </div>
                </n-dynamic-input>
                <n-divider />
                <n-space v-if="current === 3">
                  <!-- <n-button @click="formSubmit(0)" size="small" style="margin-left: 80px"
                    >保存</n-button
                  > -->
                  <n-button :type="buttonType" size="small" @click="prev"> 上一步 </n-button>
                  <n-button :type="buttonType" size="small" @click="next('3')"> 下一步 </n-button>
                </n-space>
              </n-card>
            </n-form>
          </div>
        </n-step>
        <n-step title="发布">
          <div class="n-step-description">
            <p>Something in the way she moves Attracts me like no other lover</p>

            <div style="margin-left: 80px">
              <n-space>
                <n-button v-if="current === 4" :type="buttonType" @click="prev"> 上一步 </n-button>
                <n-button :disabled="current !== 4" @click="formSubmit(1)">发布</n-button>
                <!-- <n-button :disabled="current !== 4" @click="formSubmit(0)">保存为草稿</n-button> -->

                <!-- <n-button @click="resetForm">取消</n-button> -->
              </n-space>
            </div>
          </div>
        </n-step>
      </n-steps>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { h, ref, unref, reactive, onMounted, computed } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicUpload } from '@/components/Upload';
  import { BaseResultEnum, ResultEnum } from '@/enums/httpEnum';
  import { NInput, NButton } from 'naive-ui';
  import { useGlobSetting } from '@/hooks/setting';
  import {
    newReviewPlan,
    selectExpert,
    selectReviewPlan,
    getapplybyid,
    newReviewProgram,
  } from '@/api/project/list';
  import { queryapprovermenu } from '@/api/system/user';
  import { useUserStore } from '@/store/modules/user';
  import { useRouter, useRoute } from 'vue-router';
  import { formatToDate } from '@/utils/dateUtil.ts';
  import type { UploadInst, UploadFileInfo, StepsProps, SelectOption } from 'naive-ui';
  import { useTabsViewStore } from '@/store/modules/tabsView';
  const currentStatusRef = ref<StepsProps['status']>('process');
  const currentRef = ref(1);
  const current = currentRef;
  const currentStatus = currentStatusRef;
  const dynamicInputRule = {
    trigger: 'input',
    validator(rule: unknown, value: string) {
      if (value.length <= 0) return new Error('请输入完整');
      return true;
    },
  };
  const model = ref({
    name: '',
    des: '',
    program_json: [
      {
        content: '', //评审内容
        proportion: '', //所占分数
        des: '', //备注
        grade: '',
      },
    ],
  });
  const buttonTypeRef = computed(() => {
    switch (currentStatusRef.value) {
      case 'error':
        return 'error';
      case 'finish':
        return 'success';
      default:
        return 'default';
    }
  });
  const buttonType = buttonTypeRef;
  const tabsViewStore = useTabsViewStore();
  const globSetting = useGlobSetting();
  const userStore = useUserStore();
  const fileList = ref([] as any);
  const checkboxGroupValue = ref([]);
  const fileListLengthRef = ref(0);
  const uploadRef = ref<UploadInst | null>(null);
  const expertList = ref([]);
  const planList = ref([]);
  const plancheck = ref([]);

  const defaultValueRef = () => ({
    apply_id: null,
    created_user_id: '',
    des: '',
    export_json: '',
    file_name: '',
    file_path: '',
    order_id: null,
    review_plan_name: null,
    review_program_id: 0,
    review_time_end: '',
    review_time_strat: '',
    save_status: null,
  });

  let formRef1 = ref({
    export: [{ project_apply_id: [] }],
    file_name: null,
    file_path: null,
    order_id: null,
    review_plan_name: null,
    end_date: ref(null),
    start_date: ref(null),
    des: null,
  });

  const rules1 = {
    review_plan_name: {
      required: true,
      message: '请输入评审计划名称',
      trigger: 'blur',
    },
    export: {
      type: 'array',
      required: true,
      message: '请选择评审专家',
      trigger: ['blur', 'change'],
    },
    order_id: {
      type: 'number',
      required: true,
      message: '请选择申报计划',
      trigger: ['blur', 'change'],
    },
    end_date: {
      required: true,
      type: 'number',
      message: '请选择截止日期',
      trigger: ['blur', 'change'],
    },
    start_date: {
      required: true,
      type: 'number',
      message: '请选择开始日期',
      trigger: ['blur', 'change'],
    },
  };
  const approvalList = ref([]);

  const formRefOne: any = ref(null);
  const formRefTwo: any = ref(null);
  const formRefThree: any = ref(null);
  const message = useMessage();
  const route = useRoute();
  const router = useRouter();

  let formValue = reactive(defaultValueRef());

  function handleUpdateValue(value: string, option: SelectOption) {
    formRef1.value.export = option;
  }
  function handleUpdatePlan(value: string, option: SelectOption) {
    formRef1.value.order_id = option.id;

    formValue.apply_id = option.approval_id;
  }
  async function next(status) {
    switch (status) {
      case '1':
        // debugger;
        formRefOne.value.validate(async (errors) => {
          if (!errors) {
            const data = await getapplybyid({ id: formRef1.value.order_id });
            plancheck.value = data.data.data.result;
            currentRef.value = (currentRef.value % 4) + 1;
          } else {
            message.error('请填写完整信息');
            return;
          }
        });
        break;
      case '2':
        formRefTwo.value.validate((errors) => {
          if (!errors) {
            currentRef.value = (currentRef.value % 4) + 1;
          } else {
            message.error('请填写完整信息');
            return;
          }
        });
        break;
      case '3':
        // formRefThree.value.validate(async (errors) => {
        //     if (!errors) {

        let newArr = JSON.parse(JSON.stringify(model.value));
        newArr.program_json = JSON.stringify(model.value.program_json);

        let formData = new window.FormData();
        for (const key in newArr) {
          if (Object.prototype.hasOwnProperty.call(newArr, key)) {
            const element = newArr[key];
            formData.append(key, element);
          }
        }
        const data = await newReviewProgram(formData);
        let code = data.data.code;
        // debugger
        if (code == BaseResultEnum.SUCCESS) {
          if (status) {
            formValue.review_program_id = data.data.data;
            currentRef.value = (currentRef.value % 4) + 1;
          } else {
            message.error(data.data.msg);
          }
        }

        break;

      // } else {
      //   message.error('请填写完整信息');
      //   return;
      // }
      // });

      default:
        break;
    }
  }
  function prev() {
    if (currentRef.value === 0) currentRef.value = null;
    else if (currentRef.value === null) currentRef.value = 5;
    else currentRef.value--;
  }
  function handleChange(options: { fileList: UploadFileInfo[] }) {
    fileList.value = options.fileList[0];

    fileListLengthRef.value = options.fileList.length;
  }
  function handleDel(row) {}

  async function formSubmit(state) {
    // formRef.value.validate(async (errors) => {
    //   if (!errors) {
    // debugger;
    formValue.save_status = await state;
    formValue.review_time_end = formatToDate(formRef1.value.end_date);
    formValue.review_time_strat = formatToDate(formRef1.value.start_date);
    formValue.order_id = formRef1.value.order_id;
    formValue.review_plan_name = formRef1.value.review_plan_name;
    formValue.export_json = JSON.stringify(formRef1.value.export);

    formValue.file_name = fileList.value.name;

    let formData = new window.FormData();
    for (const key in formValue) {
      if (Object.prototype.hasOwnProperty.call(formValue, key)) {
        const element = formValue[key];
        formData.append(key, element);
      }
    }
    formData.append('file', fileList.value.file);
    // debugger;
    const result = await newReviewPlan(formData);
    // console.log(result.data.code);
    let code = result.data.code;
    // debugger
    if (code == BaseResultEnum.SUCCESS) {
      if (status) {
        message.success('评审计划发布成功');
      } else {
        message.success('保存草稿成功');
      }
      router.replace({ path: '/project/review' });
      tabsViewStore.closeCurrentTab(route);
      // debugger
    } else {
      message.info(result.data.info);
    }
    //   } else {
    //     message.error('验证失败，请填写完整信息');
    //   }
    // });
  }
  function onCreate() {
    return {
      content: '', //评审内容
      proportion: '', //所占分数
      des: '', //备注
    };
  }
  onMounted(async () => {
    const data = await selectExpert();
    // debugger;
    expertList.value = data.data.data.result;
    for (var i = 0; i < expertList.value.length; i++) {
      expertList.value[i].project_apply_id = [];
    }
    const list = await selectReviewPlan();
    // debugger;
    planList.value = list.data.data.result;
    console.log(planList.value);
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
  .from-title {
    font-size: 18px;
    font-weight: bold;
  }
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

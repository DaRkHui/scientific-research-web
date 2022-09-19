<template>
  <div>
    <n-card :bordered="false" class="mt-4 proCard" size="small" :segmented="{ content: true }">
      <div style="display: flex">
        <div class="content">

          <n-descriptions
            label-placement="left"
            label-align="left"
            label-style="
            width: 200px;
            display:inline-block;
             text-align:right;
             padding-right:10px;
        
          "
            :column="2"
            size="large"
            class="decInfo"
          >
            <n-descriptions-item label="项目名称">{{ detail.name }}</n-descriptions-item>
            <n-descriptions-item label="申报计划名称">{{ detail.name }}</n-descriptions-item>
            <n-descriptions-item label="项目编号">{{ detail.id_num }}</n-descriptions-item>
            <n-descriptions-item label="批准号">{{ detail.id_num }}</n-descriptions-item>
            <n-descriptions-item label="负责人">{{ detail.name }}</n-descriptions-item>
            <n-descriptions-item label="联系方式">{{ detail.phone }}</n-descriptions-item>
            <n-descriptions-item label="所属科室">{{ detail.department }}</n-descriptions-item>
            <n-descriptions-item label="项目类别">{{ detail.type }}</n-descriptions-item>
            <n-descriptions-item label="项目开始日期">{{ detail.start_date }}</n-descriptions-item>
            <n-descriptions-item label="项目级别">{{ detail.level }}</n-descriptions-item>
            <n-descriptions-item label="计划完成日期">{{ detail.end_date }}</n-descriptions-item>
            <n-descriptions-item label="预计经费">{{ detail.expenses }}</n-descriptions-item>
            <!-- <n-descriptions-item label="申报限额">{{ detail.name }}</n-descriptions-item> -->
          </n-descriptions>

          <span class="from-title">项目成员</span>
          <n-divider />
          <n-data-table :columns="columns" :data="memberList" :pagination="pagination" />
        </div>
        <div class="side">
          <p class="title">申报材料</p>
          <div v-if="typeTabList.length">
            <n-thing
              class="thing-cell"
              v-for="item in typeTabList"
              :key="item.file_path"
              @click="switchType(item)"
            >
              <template #header
                >{{ item.file_name
                }}<span style="icon"
                  ><CloudDownloadOutlined style="width: 16px; display: inline-block" /></span
              ></template>
            </n-thing>
          </div>
          <div v-else>暂未上传申报材料</div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, onMounted, inject } from 'vue';
  import { useMessage } from 'naive-ui';

  import { CloudDownloadOutlined } from '@vicons/antd';
  import { BaseResultEnum, ResultEnum } from '@/enums/httpEnum';
  import { useRouter, useRoute } from 'vue-router';
  import { projectReviewDetail, projectReviewInfo, projectReviewStaff } from '@/api/project/list';
  import { levelFilters, typeFilters } from '@/utils/filters.ts';
  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 100,
    },
    {
      title: '姓名',
      key: 'user_name',
      width: 100,
    },
    {
      title: '性别',
      key: 'sex',
      width: 100,
    },
    {
      title: '工作单位',
      key: 'start_date',
      width: 160,
    },
    {
      title: '出生日期',
      key: 'birthday',
      width: 160,
    },

    {
      title: '行政职务',
      key: 'date',
      width: 100,
    },
    {
      title: '职称',
      key: 'title',
      width: 100,
    },
    {
      title: '项目分工',
      key: 'do_work',
      width: 100,
    },
  ];
  const message = useMessage();
  const router = useRouter();
  const route = useRoute();

  const detail = ref<any>({});
  const handleBack = () => {
    router.back();
  };
  const memberList = ref<any>([]);
  const typeTabList = ref([{}]);
  const pagination = {
    pageSize: 5,
  };

  onMounted(async () => {
    const idValue = inject('Id');
    // debugger;
    const data = await projectReviewDetail({ id: idValue.value });
    detail.value = data.data.data.result;
    const ret = await projectReviewInfo({ id: idValue.value });
    // debugger;
    typeTabList.value = ret.data.data.result;
    const list = await projectReviewStaff({ id: idValue.value });
    // debugger;
    memberList.value = list.data.data.result;

    // visits.value = data.visits;
    // saleroom.value = data.saleroom;
    // orderLarge.value = data.orderLarge;
    // volume.value = data.volume;
    // loading.value = false;
  });
  function switchType(e) {
    window.location.href = '/download/' + e.file_path;
  }
</script>

<style lang="less" scoped>
  .content {
    width: 75%;
    p {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      line-height: 40px;
    }

    .decInfo {
      ::v-deep.n-descriptions {
        .n-descriptions-table-wrapper {
          .n-descriptions-table .n-descriptions-table-row .n-descriptions-table-content {
            padding: 16px 20px;
            // text-align: center;
          }
        }
      }
    }
  }
  .side {
    background-color: #f8fafb;
    width: 20%;
    height: 600px;
    padding: 20px;
    margin-left: 20px;
    color: #999999;
    text-align: center;
    .title {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      line-height: 30px;
      color: #5c6268;
    }
    .thing-cell {
      // margin: 0 -16px 10px;
      padding: 12px 28px 10px;
      border-bottom: 1px dashed #ccc;
      .icon-cell {
        width: 16px;
      }
      &:hover {
        background: #f0faff;
        color: #2d8cf0;
        border-left: 2px solid;
        cursor: pointer;
      }
    }

    .thing-cell-on {
      background: #f0faff;
      color: #2d8cf0;
      border-left: 2px solid;

      ::v-deep(.n-thing-main .n-thing-header .n-thing-header__title) {
        color: #2d8cf0;
      }

      &:hover {
        background: #f0faff;
      }
    }
  }
</style>

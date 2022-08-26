<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false">
        <n-breadcrumb separator=">">
          <n-breadcrumb-item @click="handleBack">
            返回上一级<template #separator> | </template></n-breadcrumb-item
          >
          <n-breadcrumb-item> 项目申报详情</n-breadcrumb-item>
          <n-breadcrumb-item> {{ detail.name }}</n-breadcrumb-item>
        </n-breadcrumb>
      </n-card>
    </div>

    <n-card :bordered="false" class="mt-4 proCard" size="small" :segmented="{ content: true }">
      <div style="display: flex">
        <div class="content">
          <p>{{ detail.name }}</p>
          <br />
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
            <n-descriptions-item label="申报计划名称">{{ detail.name }}</n-descriptions-item>
            <n-descriptions-item label="项目来源单位">{{ detail.department }}</n-descriptions-item>
            <n-descriptions-item label="计划编号">{{ detail.id_num }}</n-descriptions-item>
            <n-descriptions-item label="项目类型">{{
              typeFilters(detail.type)
            }}</n-descriptions-item>
            <n-descriptions-item label="项目级别">{{
              levelFilters(detail.level)
            }}</n-descriptions-item>
            <!-- <n-descriptions-item label="申报限额">{{ detail.name }}</n-descriptions-item> -->
          </n-descriptions>

          <n-descriptions
            label-placement="left"
            label-align="left"
            :column="1"
            size="large"
            label-style="
            width: 200px;
            display:inline-block;
             text-align:right;
              padding-right:10px;            
          "
            class="decInfo"
          >
            <n-descriptions-item label="申报时间"
              >{{ detail.start_date }} 至 {{ detail.end_date }}</n-descriptions-item
            >
            <n-descriptions-item label="申报说明">{{ detail.des }}</n-descriptions-item>
          </n-descriptions>
        </div>
        <div class="side">
          <p class="title">申报材料</p>
          <span
            >申报材料使用要求申报材料使用要求申报材料使材料使用要求申报材料使用要求申报材料使用要求申报材料使用要求申报材料使用要求申报材料使用要求。</span
          >
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
          <p style="text-align: center" v-if="route.query.status && route.query.status !== '1'">
            <n-button type="info" ghost @click="handleEdit"> 项目申报 </n-button>
          </p>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, onMounted } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BaseResultEnum, ResultEnum } from '@/enums/httpEnum';
  import { useRouter, useRoute } from 'vue-router';
  import { getApplyInfo, applyMaterial } from '@/api/project/list';
  import { levelFilters, typeFilters } from '@/utils/filters.ts';
  const message = useMessage();
  const router = useRouter();
  const route = useRoute();
  const typeTabList = ref([{}]);
  const detail = ref<any>({});
  const handleBack = () => {
    router.back();
  };
  function handleEdit() {
    router.replace({ path: '/project/newapply', query: { id: route.query.id } });
  }
  function switchType(e) {
    window.location.href = '/download/' + e.file_path;
  }
  onMounted(async () => {
    const data = await getApplyInfo({ id: route.query.id });
    detail.value = data.data.data;
    const ret = await applyMaterial({ id: route.query.id });
    // debugger;
    typeTabList.value = ret.data.data.result;
    // visits.value = data.visits;
    // saleroom.value = data.saleroom;
    // orderLarge.value = data.orderLarge;
    // volume.value = data.volume;
    // loading.value = false;
  });
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
    color: #999999;
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

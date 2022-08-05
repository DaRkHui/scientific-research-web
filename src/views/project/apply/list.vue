<template>
  <n-card
    :bordered="false"
    class="proCard pmp"
    :segmented="{
      content: true,
      footer: 'soft',
    }"
  >
    <template #header>
      <span class="all"> 全部（{{ total }}）</span>
    </template>

    <div class="cardContent" v-if="cardList.length">
      <div class="card-item" v-for="(item, index) in cardList" :key="`img_${index}`">
        <n-card>
          <template #cover>
            <div class="upload-card-item-info">
              <div class="img-box"
                ><p class="title">{{ item.name }}</p
                ><p class="time">{{ item.start_date }}至{{ item.end_date }}</p>
              </div>
              <div class="img-box-actions">
                <n-button type="primary" size="large" @click="handleEdit(item.id)"
                  >查看申报详情</n-button
                >
              </div>
            </div>
          </template>
          <p style="color: rgb(123, 160, 207); line-height: 3">{{ levelFilters(item.level) }}</p>
          <n-button type="info" ghost> 项目申报 </n-button>
        </n-card>
      </div>
    </div>
    <n-empty description="暂无数据" v-else />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, watch, onMounted } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getTableList } from '@/api/project/list';
  import { levelFilters } from '@/utils/filters.ts';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const formRef: any = ref(null);
  const message = useMessage();

  const cardList = ref<any>([]);
  const total = ref(0);
  const params = ref({
    page: 1,
    rows: 1000,
    save_status: '1',
  });

  onMounted(async () => {
    const data = await getTableList({ ...params.value });
    // console.log('====================================');
    // console.log(data.data.。result);
    // console.log('====================================');
    cardList.value = data.data.data.result;
    total.value = data.data.data.total;
  });
  function handleDetail(item) {
    console.log('点击了查看', item);
  }

  function handleEdit(id) {
    router.replace({ path: '/project/detail', query: { id: id } });
  }
  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    message.info('点击了删除');
  }
</script>

<style lang="less" scoped>
  .pmp {
    .all {
      font-size: 16px;
      color: #2d8cf0;
      border-bottom: 2px solid;
      line-height: 20px;
      padding-bottom: 10px;
    }
  }

  .cardContent {
    width: auto;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 10px;
    // margin: 0 auto;

    .card-item {
      margin: 0 20px 20px 0;
      position: relative;
      border-top: 4px solid #ffcc00;
      border-radius: 2px;
      color: #c6bcd5;
      text-align: center;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      min-width: 240px;

      &:hover {
        background: 0 0;

        .upload-card-item-info::before {
          opacity: 1;
        }

        &-info::before {
          opacity: 1;
        }
      }

      .upload-card-item-info {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 0;
        overflow: hidden;

        &:hover {
          .img-box-actions {
            opacity: 1;
          }
        }

        &::before {
          display: flex;
          position: absolute;
          z-index: 1;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: all 0.3s;
          content: ' ';
        }

        .img-box {
          position: relative;
          background-color: #fff8e2;
          height: 200px;
          border-radius: 2px;
          padding: 30px;
          // text-align: center;
          .title {
            font-size: 20px;
            font-weight: bold;
            color: #666;
          }
          .time {
            font-size: 14px;
            color: #a0aeb8;
            position: absolute;
            bottom: 20px;
          }
        }

        .img-box-actions {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 10;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &:hover {
            background: 0 0;
          }
        }
      }
      // p {
      //   text-align: center;
      // }
    }
  }
</style>

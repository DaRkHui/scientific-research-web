<template>
  <div>
    <n-grid :x-gap="24">
      <n-grid-item span="4">
        <n-card :bordered="false" size="small" class="proCard">
          <span class="proCard-title">申报计划（{{ ret.total }}）</span>
          <n-thing
            class="thing-cell"
            v-for="item in typeTabList"
            :key="item.key"
            :class="{ 'thing-cell-on': type === item.key }"
            @click="switchType(item)"
          >
            <template #header>{{ item.name }}({{ item.desc }})</template>
            <!-- <template #description>{{ item.desc }}</template> -->
          </n-thing>
        </n-card>
        <n-card :bordered="false" size="small" class="proCard" style="margin-top: 30px">
          <n-thing
            class="thing-cell"
            v-for="item in throwTabList"
            :key="item.key"
            :class="{ 'thing-cell-on': type === item.key }"
            @click="switchType(item)"
          >
            <template #header>{{ item.name }}({{ item.desc }})</template>
            <!-- <template #description>{{ item.desc }}</template> -->
          </n-thing>
        </n-card>
      </n-grid-item>
      <n-grid-item span="20">
        <n-card :bordered="false" size="small" class="proCard">
          <List :save_status="type" :total="ret.total" @getTotal="getAllPlanTotal" />
          <!-- <SafetySetting v-if="type === 2" /> -->
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
  import { h, reactive, ref, onMounted, onBeforeMount, onUpdated } from 'vue';
  import { getPlanTotal } from '@/api/project/list';
  import BasicSetting from './BasicSetting.vue';
  import SafetySetting from './SafetySetting.vue';
  import List from './list.vue';
  const formParams = reactive({
    total: 1,
    release: 1,
    close: 1,
    draft: 1,
  });
  const typeTabList = ref([{}]);
  const throwTabList = ref([{}]);
  const type = ref(1);
  const ret = ref({});
  const typeTitle = ref('已发布');
  async function getAllPlanTotal() {
    const result = await getPlanTotal();
    ret.value = result.data.data;
    formParams.draft = ret.value.result.Draft;
    formParams.close = ret.value.result.Close;
    formParams.release = ret.value.result.Release;
    formParams.total = ret.value.total;
    throwTabList.value = [
      {
        name: `我的草稿`,
        desc: formParams.draft,
        key: 0,
      },
    ];
    typeTabList.value = [
      {
        name: '已发布',
        desc: formParams.release,
        key: 1,
      },
      {
        name: '已关闭',
        desc: formParams.close,
        key: 2,
      },
    ];
    console.log(formParams);
  }
  onMounted(() => {
    getAllPlanTotal();
  });

  function switchType(e) {
    type.value = e.key;
    // typeTitle.value = e.name;
  }
  const getTotalData = {};
</script>
<style lang="less" scoped>
  .proCard-title {
    display: block;
    font-weight: bold;
    font-size: 22px;
    color: #4f586f;
    margin-bottom: 10px;
  }
  .thing-cell {
    // margin: 0 -16px 10px;
    padding: 12px 28px 10px;

    &:hover {
      background: #f3f3f3;
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
</style>

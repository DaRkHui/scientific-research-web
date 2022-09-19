<template>
  <div>
    <n-grid :x-gap="24">
      <n-grid-item span="4">
        <n-card :bordered="false" size="small" class="proCard">
          <span class="proCard-title"
            >专家评审（{{ formParams.total }}）
            <!-- <n-button @click="activate('right')"> 右 </n-button> -->
          </span>
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
      </n-grid-item>
      <n-grid-item span="20">
        <n-card :bordered="false" size="small" class="proCard">
          <List :status="type" :total="num" />
          <!-- <SafetySetting v-if="type === 2" /> -->
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
  import { h, reactive, ref, onMounted, onBeforeMount, onUpdated } from 'vue';
  import { useMessage, DrawerPlacement } from 'naive-ui';
  import { getExporNum } from '@/api/project/list';

  import BasicSetting from './BasicSetting.vue';
  import SafetySetting from './SafetySetting.vue';
  import List from './list.vue';
  const active = ref(false);
  const placement = ref<DrawerPlacement>('top');
  const activate = (place: DrawerPlacement) => {
    // debugger;
    active.value = !active.value;
    placement.value = place;
  };
  const formParams = reactive({
    Change: 0,
    ClosingItem: 0,
    Declare: 5,
    Draft: 0,
    IntermediateInspection: 0,
    ProjectInitiation: 0,
    total: 0,
  });
  const typeTabList = ref([{}]);

  const type = ref(0);
  const num = ref(0);
  const typeTitle = ref('已发布');
  onMounted(async () => {
    const result = await getExporNum();
    const ret = result.data.data.result;
    formParams.Change = ret.Change;
    formParams.ClosingItem = ret.ClosingItem;
    formParams.Declare = ret.Declare;
    formParams.Draft = ret.Draft;
    formParams.IntermediateInspection = ret.IntermediateInspection;
    formParams.ProjectInitiation = ret.ProjectInitiation;
    formParams.total = result.data.data.total;

    typeTabList.value = [
      {
        name: '项目申报',
        desc: formParams.Declare,
        key: 0,
      },
      {
        name: '项目立项',
        desc: formParams.ProjectInitiation,
        key: 1,
      },
      {
        name: '项目变更',
        desc: formParams.Change,
        key: 2,
      },
      {
        name: '项目中检',
        desc: formParams.IntermediateInspection,
        key: 3,
      },
      {
        name: '项目结项',
        desc: formParams.ClosingItem,
        key: 4,
      },
    ];
    switchType(typeTabList.value[0]);
  });

  function switchType(e) {
    console.log(e);

    type.value = e.key;
    num.value = e.desc;
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

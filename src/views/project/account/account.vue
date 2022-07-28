<template>
  <div>
    <n-grid :x-gap="24">
      <n-grid-item span="4">
        <n-card :bordered="false" size="small" class="proCard">
          <span class="proCard-title">项目申报（{{ formParams.total }}）</span>
          <n-thing
            class="thing-cell"
            v-for="item in typeTabList"
            :key="item.key"
            :class="{ 'thing-cell-on': type === item.key }"
            @click="switchType(item)"
          >
            <template #header>{{ item.name }}</template>
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
            <template #header>{{ item.name }}{{ item.desc }}</template>
            <!-- <template #description>{{ item.desc }}</template> -->
          </n-thing>
        </n-card>
      </n-grid-item>
      <n-grid-item span="20">
        <n-card :bordered="false" size="small" class="proCard">
          <List v-if="type === 1" />
          <SafetySetting v-if="type === 2" />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
  import { h, reactive, ref, onMounted } from 'vue';
  import { getTableList } from '@/api/project/list';
  import BasicSetting from './BasicSetting.vue';
  import SafetySetting from './SafetySetting.vue';
  import List from './list.vue';
  const formParams = reactive({
    total: '1',
    published: '1',
    closed: '1',
  });

  const type = ref(1);
  const typeTitle = ref('已发布');
  onMounted(async () => {
    const result = await getTableList();
    const ret = result.data.data;
    formParams.total = ret.total;
    formParams.published = ret.result.filter((item) => item.save_status == 1).length;
    console.log('====================================');
    console.log(ret.result.filter((item) => item.save_status == 0).length);
    console.log('====================================');
    formParams.closed = ret.result.filter((item) => item.save_status == 0);
    // //  arr3=arr2.filter(item=>item.id == 20)
    // console.log('====================================');
    console.log(formParams);
    // console.log('====================================');
  });
  const typeTabList = reactive([
    {
      name: `已发布(${formParams.published})`,
      desc: '个人账户信息设置',
      key: 1,
    },
    {
      name: `已关闭(${formParams.closed})`,
      desc: formParams.closed,
      key: 2,
    },
  ]);
  const throwTabList = [
    {
      name: `我的草稿(${formParams.closed})`,
      desc: formParams.closed,
      key: 3,
    },
  ];
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

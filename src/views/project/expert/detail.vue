<template>
  <transition name="fade" mode="out-in" appear>
    <div>
      <div class="n-layout-page-header">
        <n-breadcrumb separator=">">
          <n-breadcrumb-item @click="handleBack">
            返回上一级<template #separator> | </template></n-breadcrumb-item
          >
          <n-breadcrumb-item> 项目详情</n-breadcrumb-item>
        </n-breadcrumb>
        <n-divider />
      </div>

      <n-grid style="background: #fff">
        <n-grid-item span="4" style="border-right: 1px solid #e4e4e4">
          <n-card :bordered="false" size="small" class="proCard">
            <n-thing
              class="thing-cell"
              v-for="item in typeTabList"
              :key="item.key"
              :class="{ 'thing-cell-on': type === item.key }"
              @click="switchType(item)"
            >
              <template #header>{{ item.name }}</template>
            </n-thing>
          </n-card>
        </n-grid-item>
        <n-grid-item span="20">
          <n-card
            :bordered="false"
            size="small"
            :title="typeTitle"
            class="proCard"
            header-style="
          font-weight: bold;
            "
            :segmented="{
              content: true,
              footer: 'soft',
            }"
          >
            <projectDetail v-if="type === 1" />
            <BasicSetting v-if="type === 2" />
          </n-card>
        </n-grid-item>
      </n-grid> </div
  ></transition>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import projectDetail from './projectDetail.vue';
  import BasicSetting from './BasicSetting.vue';
  let props = defineProps({
    active: {
      // 父组件v-model绑定的值
      type: Boolean,
    },
  });

  const emit = defineEmits(['handleBack']);

  // console.log(selectValue);

  const typeTabList = [
    {
      name: '项目详情信息',

      key: 1,
    },
    {
      name: '项目评审结果',

      key: 2,
    },
  ];

  const type = ref(1);
  const typeTitle = ref('项目详情信息');
  function switchType(e) {
    type.value = e.key;
    typeTitle.value = e.name;
  }
  function handleBack(e) {
    emit('handleBack', false);
  }
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

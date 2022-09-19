<template>
  <div class="table-toolbar-inner">
    <n-checkbox-group v-model:value="state.checkList" @update:value="onChange" class="checkItem">
      <n-space
        v-for="(element, index) in state.defaultCheckList"
        :key="element.key"
        style="display:inline-block;
         margin：20px"
      >
        <n-checkbox :value="element.key" :label="element.title" :disabled="element.disabled" />
      </n-space>
    </n-checkbox-group>
    <n-data-table
      :columns="columnsList"
      :data="state.newMember"
      :max-height="650"
      :scroll-x="800"
    />
    <n-space>
      <!-- <n-button @click="() => (showModal = false)">取消</n-button> -->
      <n-button type="info" @click="confirmForm">导出</n-button>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, toRefs, onMounted } from 'vue';

  import { isEqual, cloneDeep } from 'lodash-es';
  import { exportDataList, exportDataExcl } from '@/api/project/export';
  import { isArray, isString, isBoolean, isFunction } from '@/utils/is';
  // import { columns } from './columns';
  import { useDesignSetting } from '@/hooks/setting/useDesignSetting';

  interface Options {
    title: string;
    key: string;
    fixed?: boolean | 'left' | 'right';
  }

  const props = defineProps({
    ids: Array,
  });

  const { ids } = toRefs(props);
  console.log(ids);

  const { getDarkTheme } = useDesignSetting();

  const columnsList = ref<Options[]>([]);

  const state = reactive({
    selection: false,
    checkAll: true,
    checkList: [],
    newMember: [],
    defaultCheckList: [],
  });
  const columns = [
    {
      title: '项目编号',
      key: 'id_num',
      width: 100,
    },
    {
      title: '项目名称',
      key: 'name',
      width: 100,
    },
    {
      title: '项目类别',
      key: 'type',
      width: 160,
    },
    {
      title: '负责人',
      key: 'user_name',
      width: 160,
    },
    {
      title: '批准经费',
      key: 'expenses',
      width: 160,
    },

    {
      title: '状态',
      key: 'status',
      width: 160,
    },
  ];
  const column = [
    {
      title: '项目编号',
      key: 'id_num',
      width: 100,
    },
    {
      title: '项目名称',
      key: 'name',
      width: 100,
    },
    {
      title: '项目类型',
      key: 'type',
      width: 160,
    },
    {
      title: '负责人',
      key: 'user_name',
    },
    {
      title: '立项日期',
      key: 'start_date',
    },
    {
      title: '批准经费',
      key: 'expenses',
    },

    {
      title: '所属单位',
      key: 'source_department',
    },
    {
      title: '所属科室',
      key: 'department',
    },
    {
      title: '项目级别',
      key: 'level',
    },
    {
      title: '项目状态',
      key: 'status',

      render(row) {
        return ['申报中', '立项中', '变更中'][row.status];
      },
    },
    // {
    //   title: '计划开始日期',
    //   key: 'expenses',
    //   width: 160,
    // },
    {
      title: '计划结项日期',
      key: 'plan_end_date',
      width: 160,
    },

    {
      title: '结项日期',
      key: 'end_date',
      width: 160,
    },
    {
      title: '配套经费',
      key: 'ac',
      disabled: true,
    },
    {
      title: '外拨经费',
      key: 'af',
      disabled: true,
    },
    {
      title: '成果形式',
      key: 'afg',
      disabled: true,
    },
    {
      title: '所有项目成员',
      key: 'users',
      disabled: true,
    },
  ];

  onMounted(() => {
    init();
  });
  // //初始化
  async function init() {
    const id = ids.value;
    const result = await exportDataList({ ids: id.toString() });

    state.newMember = result.data.data;
    state.defaultCheckList = column;
    state.checkList = columns.map((item) => item.key);
    const newColumns = columns;
    if (!columnsList.value.length) {
      columnsList.value = cloneDeep(newColumns);
    }
  }
  async function confirmForm() {
    const formValue = {
      ids: ids.value,
      filed: state.checkList.toString(),
      chinese_simple: columnsList.value.map((item) => item.title),
    };

    let formData = new window.FormData();
    for (const key in formValue) {
      if (Object.prototype.hasOwnProperty.call(formValue, key)) {
        const element = formValue[key];
        formData.append(key, element);
      }
    }
    const res = await exportDataExcl(formData);
    console.log(res);

    if (res.data.size > 0) {
      const pat = new RegExp('(?<=filename=).*');

      let contentDisposition = '';
      //浏览器问题可能会出现 content-disposition 匹配不到
      if (res.headers['content-disposition'])
        contentDisposition = res.headers['content-disposition'];
      if (res.headers['Content-Disposition'])
        contentDisposition = res.headers['Content-Disposition'];

      const result = pat.exec(contentDisposition);

      let str = result && result[0];
      let fileName = str.substring(1, str.length - 1);

      if (fileName == undefined) {
        fileName = '导出文件.xlsx';
      } else {
        fileName = decodeURIComponent(fileName);
      }

      let url = window.URL.createObjectURL(new Blob([res.data]));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href); // 释放URL 对象
      document.body.removeChild(link); //下载完成移除
    } else {
      message.info('文件不存在');
    }
  }

  //切换
  function onChange(checkList) {
    setColumns(checkList);
  }

  //设置
  function setColumns(list) {
    const col: any[] = cloneDeep(list);
    const newColumns: any[] = [];
    column.forEach((item) => {
      if (col.includes(item.key)) {
        newColumns.push({ ...item });
      }
    });
    columnsList.value = newColumns;

    console.log(newColumns);
  }
</script>

<style lang="less">
  .table-toolbar {
    &-inner-popover-title {
      padding: 3px 0;
    }

    &-right {
      &-icon {
        margin-left: 12px;
        font-size: 16px;
        color: var(--text-color);
        cursor: pointer;

        :hover {
          color: #1890ff;
        }
      }
    }
  }

  .table-toolbar-inner {
    .checkItem {
      margin: 20px 0;
      display: flex;
      flex-wrap: wrap;
      &-checkbox {
        display: flex;
        align-items: center;
        padding: 10px 24px;

        &:hover {
          background: #e6f7ff;
        }
      }
    }

    .fixed-item {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-left: auto;
    }

    .ant-checkbox-wrapper {
      flex: 1;

      &:hover {
        color: #1890ff !important;
      }
    }
  }

  &-checkbox-dark {
    &:hover {
      background: hsla(0, 0%, 100%, 0.08);
    }
  }

  .toolbar-popover {
    .n-popover__content {
      padding: 0;
    }
  }
</style>

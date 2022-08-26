import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';

export const columns = [
  {
    type: 'selection',
  },
  {
    title: '项目编号',
    key: 'id_num',
    width: 100,
    sorter: (row1, row2) => row1.id - row2.id

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
    title: '提交时间',
    key: 'created_at',
    width: 160,
    sorter: (row1, row2) => row1.start_date - row2.start_date
  },

  {
    title: '所属科室',
    key: 'department',
    width: 160,
  },
  {
    title: '评审进度',
    key: 'need_review',
    width: 160,
  },
  {
    title: '状态',
    key: 'first_check',
    width: 160,
  },


];

import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';

export const columns = [
  {
    title: '序号',
    key: 'id_num',
    width: 100,
  },
  {
    title: '姓名',
    key: 'name',
    width: 100,
  },
  {
    title: '成员类型',
    key: 'department',
    width: 100,
  },
  {
    title: '工作单位',
    key: 'start_date',
    width: 160,
  },
  {
    title: '出生日期',
    key: 'end_date',
    width: 160,
  },

  {
    title: '行政职务',
    key: 'date',
    width: 100,
  },
  {
    title: '职称',
    key: 'date1',
    width: 100,
  },
  {
    title: '项目分工',
    key: 'date2',
    width: 100,
  },
];

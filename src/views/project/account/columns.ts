import { h } from 'vue';
import { NAvatar } from 'naive-ui';

export const columns = [
  {
    title: '计划编号',
    key: 'id_num',
    width: 100,
  },
  {
    title: '申报计划名称',
    key: 'name',
    width: 100,
  },
  {
    title: '项目来源单位',
    key: 'department',
    width: 100,


  },
 

  {
    title: '申报开始日期',
    key: 'start_date',
    width: 160,
  },
  {
    title: '申报结束日期',
    key: 'end_date',
    width: 160,
  },
  {
    title: '状态',
    key: 'save_status',
    width: 100,


  },
  {
    title: 'save_status',
    key: 'address',
    auth: ['basic_list'], // 同时根据权限控制是否显示
    ifShow: (_column) => {
      return true; // 根据业务控制是否显示
    },
    width: 150,
  },
  // {
  //   title: '创建时间',
  //   key: 'date',
  //   width: 100,
  // },
];

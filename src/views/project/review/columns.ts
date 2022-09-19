import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';

export const columns = [

  {
    title: '评审计划名称',
    key: 'review_plan_name',
    width: 100,
  },
  {
    title: '申报计划名称',
    key: 'review_plan_name',
    width: 100,
  },
  {
    title: '评审截止日期',
    key: 'review_time_end',
    width: 160,
  },
  {
    title: '更新日期',
    key: 'updated_at',
    width: 160,
  },
  // {
  //   title: '状态',
  //   key: 'save_status',
  //   width: 100,
  //   render(row) {
  //     return h(
  //       NTag,
  //       {
  //         type: ['', 'success', 'warning'][row.save_status],
  //       },
  //       {
  //         default: () => ['未发布', '已发布', '已关闭'][row.save_status],
  //       }
  //     );
  //   },

  // },
  // {
  //   title: 'save_status',
  //   key: 'address',
  //   auth: ['basic_list'], // 同时根据权限控制是否显示
  //   ifShow: (_column) => {
  //     return true; // 根据业务控制是否显示
  //   },
  //   width: 150,
  // },
  // {
  //   title: '创建时间',
  //   key: 'date',
  //   width: 100,
  // },
];

import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';

export const columns = [
  {
    type: 'selection',
  },
  {
    title: '序号',
    key: 'index',
    width: 50,
  },
  {
    title: '项目名称',
    key: 'name',
    width: 100,
  },
  {
    title: '负责人',
    key: 'user_name',
    width: 100,
  },
  {
    title: '评审计划',
    key: 'review_plan_name',
    width: 100,
  },
  {
    title: '评审专家',
    key: 'export_json',
    width: 100,
    render(row) {
      const list = JSON.parse(row.export_json);
      console.log(list)
      const newColumns = list.map((item) => item.user_name).toString();
      console.log(newColumns)
      return newColumns;
    },
  },
  {
    title: '评审进度',
    key: 'speed_of_progresss',
    width: 150,
    render(row) {
      const list = row.speed_of_progresss;

      return '应评审【' + `${list.wait_reviewed}` + '】,已评审【' + `${list.reviewed}` + '】';
    },
  },
  {
    title: '平均分',
    key: 'average',
    width: 100,
  },
  {
    title: '评审截止日期',
    key: 'review_time_end',
    width: 100,
  },
  {
    title: '状态',
    key: 'review_status',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: ['', 'info', 'warning'][row.review_status],
        },
        {
          default: () => ['未发布', '待审核', '未提交'][row.review_status],
        }
      );
    },

  },

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

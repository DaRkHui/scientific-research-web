import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { SettingOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 *
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/project',
    name: 'Project',
    redirect: '/project/plan',
    component: Layout,
    meta: {
      title: '项目管理',
      icon: renderIcon(SettingOutlined),
      sort: 5,
    },

    children: [
      {
        path: 'myProject',
        name: 'project-my',
        meta: {
          id: '306000002',
          title: '我的项目',
        },
        component: () => import('@/views/project/myProject/myProject.vue'),
      },
      {
        path: 'plan',
        name: 'project-plan',
        meta: {
          id: '306000003',
          title: '申报计划',
        },
        component: () => import('@/views/project/plan/plan.vue'),
        // children: [
        //   {
        //     path: 'newplan',
        //     name: 'project-new',
        //     meta: {
        //       title: '新增',
        //       hidden: true,
        //       hideTab: true,

        //     },
        //     component: () => import('@/views/project/plan/newPlan.vue'),
        //   },
        // ],
      },
      {
        path: 'apply',
        name: 'project-apply',
        meta: {
          id: '306000001',
          title: '项目申报',
        },
        component: () => import('@/views/project/apply/list.vue'),

      },
      {
        path: 'newplan',
        name: 'project-new',
        meta: {
          title: '新增计划',
          hidden: true,
          hideTab: true,
        },
        component: () => import('@/views/project/plan/newPlan.vue'),
      },
      {
        path: 'newapply',
        name: 'apply-new',
        meta: {
          title: '新增申报',
          hidden: true,
          hideTab: true,
        },
        component: () => import('@/views/project/apply/newApply.vue'),
      },
      // {
      //   path: 'detail',
      //   name: 'project-detail',
      //   meta: {
      //     title: '项目申报详情',
      //     hidden: true,
      //     hideTab: true,
      //   },
      //   component: () => import('@/views/detail/planDetail.vue'),
      // },

      {
        path: 'audit',
        name: 'project-audit',
        meta: {
          id: '306000004',
          title: '项目审核',
        },
        component: () => import('@/views/project/audit/audit.vue'),
      },
      // {
      //   path: 'auditDetail',
      //   name: 'audit-detail',
      //   meta: {
      //     title: '项目审核详情',
      //     hidden: true,
      //     hideTab: true,
      //   },
      //   component: () => import('@/views/detail/projectDetail.vue'),
      // },
      {
        path: 'statistics',
        name: 'project-statistics',
        meta: {
          id: '306000006',
          title: '项目统计',
        },
        component: () => import('@/views/project/audit/statistics.vue'),
      },

      {
        path: 'review',
        name: 'project-review',
        meta: {
          id: '306000009',
          title: '评审计划',
        },
        component: () => import('@/views/project/review/review.vue'),
      },
      {
        path: 'reviewAll',
        name: 'review-all',
        meta: {
          id: '306000008',
          title: '评审汇总',
        },
        component: () => import('@/views/project/review/reviewAll.vue'),
      },

      {
        path: 'expert',
        name: 'project-expert',
        meta: {
          id: '306000007',
          title: '专家评审',
        },
        component: () => import('@/views/project/expert/expert.vue'),
      },
      {
        path: 'expertDetail',
        name: 'expert-detail',
        meta: {
          title: '评审详情',
          hidden: true,
          hideTab: true,
        },
        component: () => import('@/views/project/expert/detail.vue'),
      },
      {
        path: 'newReview',
        name: 'review-new',
        meta: {
          title: '新增评审计划',
          hidden: true,
          hideTab: true,
        },
        component: () => import('@/views/project/review/newReview.vue'),
      },
      // {
      //   path: 'system',
      //   name: 'project-system',
      //   meta: {
      //     title: '系统设置',
      //   },
      //   component: () => import('@/views/project/system/system.vue'),
      // },
    ],
  },
];

export default routes;

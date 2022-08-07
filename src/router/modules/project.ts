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
        path: 'plan',
        name: 'project-plan',
        meta: {
          title: '申报计划',
        },
        component: () => import('@/views/project/plan/plan.vue'),
        // children: [
        //   {
        //     path: 'newplan',
        //     name: 'plan-new',
        //     meta: {
        //       title: '新增',
        //       hidden: true,
        //     },
        //     component: () => import('@/views/project/plan/newPlan.vue'),
        //   },
        // ],
      },
      {
        path: 'apply',
        name: 'project-apply',
        meta: {
          title: '项目申报',
        },
        component: () => import('@/views/project/apply/list.vue'),
        // children: [
        //   {
        //     path: 'newplan',
        //     name: 'plan-new',
        //     meta: {
        //       title: '新增',
        //       hidden: true,
        //     },
        //     component: () => import('@/views/project/plan/newPlan.vue'),
        //   },
        // ],
      },
      {
        path: 'newplan',
        name: 'project-new',
        meta: {
          title: '新增',
          hidden: true,
          hideTab: true,
        },
        component: () => import('@/views/project/plan/newPlan.vue'),
      },
      {
        path: 'detail',
        name: 'project-detail',
        meta: {
          title: '项目申报详情',
          hidden: true,
          hideTab: true,
        },
        component: () => import('@/views/project/plan/detail.vue'),
      },
      {
        path: 'system',
        name: 'project-system',
        meta: {
          title: '系统设置',
        },
        component: () => import('@/views/project/system/system.vue'),
      },
    ],
  },
];

export default routes;

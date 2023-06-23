import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue')
    },
    {
      path: '/activate-account',
      name: 'activate-account',
      component: () => import('../views/ActivateAccountView.vue')
    },
    {
      path: '/onboarding/:step',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/notifications',
      name: 'notifications',
      redirect: '/notifications/alerts',
      component: () => import('../views/notifications/NotificationsView.vue'),
      children: [{
        path: '/notifications/alerts',
        name: 'notifications_alerts',
        component: () => import('../views/notifications/AlertsView.vue')
      }, {
        path: '/notifications/messages',
        name: 'notifications_messages',
        component: () => import('../views/notifications/MessagesView.vue')
      }, {
        path: '/notifications/disposal',
        name: 'notifications_disposal',
        component: () => import('../views/notifications/DisposalBucketView.vue')
      }]
    },
    {
      path: '/settings',
      name: 'settings',
      redirect: '/settings/configs',
      component: () => import('../views/settings/SettingsView.vue'),
      children: [{
        path: '/settings/branches',
        name: 'settings_branches',
        component: () => import('../views/settings/BranchesView.vue')
      }, {
        path: '/settings/sites',
        name: 'settings_sites',
        component: () => import('../views/settings/SitesView.vue')
      }, {
        path: '/settings/deparmtents',
        name: 'settings_deparmtents',
        component: () => import('../views/settings/DepartmentsView.vue')
      }, {
        path: '/settings/configs',
        name: 'settings_configs',
        component: () => import('../views/settings/ConfigsView.vue')
      }, {
        path: '/settings/custodians',
        name: 'settings_custodians',
        component: () => import('../views/settings/CustodiansView.vue')
      }]
    },
    {
      path: '/security',
      name: 'security',
      redirect: '/security/profile',
      component: () => import('../views/security/SecurityView.vue'),
      children: [{
        path: '/security/profile',
        name: 'security_profile',
        component: () => import('../views/security/ProfileView.vue')
      }, {
        path: '/security/users',
        name: 'security_users',
        component: () => import('../views/security/SystemUsersView.vue')
      }, {
        path: '/security/permissions',
        name: 'security_permissions',
        component: () => import('../views/security/PermissionsView.vue')
      }, {
        path: '/security/roles',
        name: 'security_roles',
        component: () => import('../views/security/RolesView.vue')
      },{
        path: '/security/logs',
        name: 'security_logs',
        component: () => import('../views/security/LogsView.vue')
      }]
    },
    {
      path: '/registery',
      name: 'registery',
      redirect: '/registery/list',
      component: () => import('../views/registery/RegisteryView.vue'),
      children: [{
        path: '/registery/list',
        name: 'registery_list',
        component: () => import('../views/registery/ListView.vue')
      }, {
        path: '/registery/batch',
        name: 'registery_batch',
        component: () => import('../views/registery/BatchUploadView.vue')
      }, {
        path: '/registery/requisitions',
        name: 'registery_requisitions',
        component: () => import('../views/registery/RequisitionsView.vue')
      }, {
        path: '/registery/transfers',
        name: 'registery_transfers',
        component: () => import('../views/registery/TransfersView.vue')
      }, {
        path: '/registery/disposal',
        name: 'registery_disposal',
        component: () => import('../views/registery/DisposalsView.vue')
      }, {
        path: '/registery/categories',
        name: 'registery_categories',
        component: () => import('../views/registery/CategoriesView.vue')
      }]
    },
    {
      path: '/purchases',
      name: 'purchases',
      redirect: '/purchases/list',
      component: () => import('../views/purchases/PurchasesView.vue'),
      children: [{
        path: '/purchases/list',
        name: 'purchases_list',
        component: () => import('../views/purchases/ListView.vue')
      }, {
        path: '/purchases/suppliers',
        name: 'suppliers',
        component: () => import('../views/purchases/SuppliersView.vue')
      }, {
        path: '/purchases/short-delivery',
        name: 'short-delivery',
        component: () => import('../views/purchases/ShortDelivery.vue')
      }, {
        path: '/purchases/recording',
        name: 'asset-recording',
        component: () => import('../views/purchases/AssetRecording.vue')
      }]
    },
    {
      path: '/maintenance',
      name: 'maintenance',
      redirect: '/maintenance/upcoming',
      component: () => import('../views/maintenance/MaintenanceView.vue'),
      children: [{
        path: '/maintenance/upcoming',
        name: 'maintenance_upcoming',
        component: () => import('../views/maintenance/UpcomingView.vue')
      },{
        path: '/maintenance/schedule',
        name: 'maintenance_schedule',
        component: () => import('../views/maintenance/ScheduleView.vue')
      },{
        path: '/maintenance/works',
        name: 'maintenance_works',
        component: () => import('../views/maintenance/WorkTypesView.vue')
      },{
        path: '/maintenance/impairments',
        name: 'maintenance_impairments',
        component: () => import('../views/maintenance/ImpairmentsView.vue')
      },{
        path: '/maintenance/insurance',
        name: 'maintenance_insurance',
        component: () => import('../views/maintenance/InsuranceView.vue')
      },{
        path: '/maintenance/warranties',
        name: 'maintenance_warranties',
        component: () => import('../views/maintenance/WarrantiesView.vue')
      }]
    },
    {
      path: '/accounting',
      name: 'accounting',
      redirect: '/accounting/transactions',
      component: () => import('../views/accounting/AccountingView.vue'),
      children: [{
        path: '/accounting/transactions',
        name: 'accounting_transactions',
        component: () => import('../views/accounting/TransactionsView.vue')
      },{
        path: '/accounting/general-ledger',
        name: 'accounting_general_ledger',
        component: () => import('../views/accounting/GeneralLedgerView.vue')
      },{
        path: '/accounting/chart-of-accounts',
        name: 'accounting_chart_of_accounts',
        component: () => import('../views/accounting/ChartOfAccountsView.vue')
      },{
        path: '/accounting/expenses',
        name: 'accounting_expenses',
        component: () => import('../views/accounting/ExpensesView.vue')
      },{
        path: '/accounting/expense-types',
        name: 'accounting_expense_types',
        component: () => import('../views/accounting/ExpenseTypesView.vue')
      }] 
    },
    {
      path: '/reports',
      name: 'reports',
      redirect: '/reports/register',
      component: () => import('../views/reports/ReportsView.vue'),
      children: [{
        path: '/reports/register',
        name: 'reports_register',
        component: () => import('../views/reports/RegisterReportView.vue')
      },{
        path: '/reports/acquisitions',
        name: 'reports_acquisitions',
        component: () => import('../views/reports/AcquisitionsReportView.vue')
      },{
        path: '/reports/maintenace',
        name: 'reports_maintenace',
        component: () => import('../views/reports/MaintenaceReportView.vue')
      },{
        path: '/reports/impairments',
        name: 'reports_impairments',
        component: () => import('../views/reports/ImpairmentsReportView.vue')
      },{
        path: '/reports/balance-sheet',
        name: 'reports_balance_sheet',
        component: () => import('../views/reports/BalanceSheetReportView.vue')
      },{
        path: '/reports/income-statement',
        name: 'reports_income_statement',
        component: () => import('../views/reports/IncomeStatementReportView.vue')
      }] 
    },
    {
      path: '/sinkhall',
      name: 'sinkhall',
      component: () => import('../views/SinkHallView.vue')
    }
  ]
})

export default router

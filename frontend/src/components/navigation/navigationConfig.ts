import {
  FiHome,
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiBarChart,
  FiSettings,
  FiHelpCircle,
  FiUser,
  FiCalendar,
  FiFileText,
  FiShield,
  FiGrid,
  FiActivity,
  FiTrello,
  FiAward,
  FiCpu,
  FiDatabase,
  FiBell,
  FiMail
} from 'react-icons/fi';
import type { NavSectionData } from './NavSection';

/**
 * Enterprise Navigation Configuration
 * Centralized navigation structure with permissions and features
 */
export const navigationSections: NavSectionData[] = [
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        href: '/dashboard',
        icon: FiHome,
        description: 'Overview of your projects and tasks'
      },
      {
        id: 'projects',
        name: 'Projects',
        href: '/projects',
        icon: FiFolder,
        badge: 12,
        description: 'Manage your test projects'
      },
      {
        id: 'tasks',
        name: 'Tasks',
        href: '/tasks',
        icon: FiCheckSquare,
        badge: 5,
        description: 'View and manage tasks'
      },
      {
        id: 'calendar',
        name: 'Calendar',
        href: '/calendar',
        icon: FiCalendar,
        description: 'Schedule and timeline view'
      }
    ]
  },
  {
    id: 'testing',
    title: 'Testing',
    icon: FiActivity,
    items: [
      {
        id: 'test-plans',
        name: 'Test Plans',
        href: '/test-plans',
        icon: FiTrello,
        badge: 8,
        description: 'Create and manage test plans'
      },
      {
        id: 'test-cases',
        name: 'Test Cases',
        href: '/test-cases',
        icon: FiCheckSquare,
        badge: 156,
        description: 'Test case repository'
      },
      {
        id: 'test-runs',
        name: 'Test Runs',
        href: '/test-runs',
        icon: FiActivity,
        badge: 'New',
        description: 'Execute and track test runs'
      },
      {
        id: 'defects',
        name: 'Defects',
        href: '/defects',
        icon: FiAward,
        badge: 23,
        description: 'Bug tracking and management'
      }
    ]
  },
  {
    id: 'management',
    title: 'Management',
    icon: FiUsers,
    items: [
      {
        id: 'team',
        name: 'Team Management',
        icon: FiUsers,
        description: 'Manage team members and roles',
        children: [
          {
            id: 'team-members',
            name: 'All Members',
            href: '/team/members',
            icon: FiUser,
            description: 'View all team members'
          },
          {
            id: 'team-roles',
            name: 'Roles & Permissions',
            href: '/team/roles',
            icon: FiShield,
            description: 'Manage user roles and permissions'
          },
          {
            id: 'team-departments',
            name: 'Departments',
            href: '/team/departments',
            icon: FiGrid,
            description: 'Organize teams by departments'
          }
        ]
      },
      {
        id: 'companies',
        name: 'Companies',
        href: '/companies',
        icon: FiGrid,
        description: 'Manage client companies'
      },
      {
        id: 'reports',
        name: 'Reports',
        icon: FiBarChart,
        description: 'Analytics and reporting',
        children: [
          {
            id: 'test-reports',
            name: 'Test Reports',
            href: '/reports/tests',
            icon: FiFileText,
            description: 'Test execution reports'
          },
          {
            id: 'project-reports',
            name: 'Project Reports',
            href: '/reports/projects',
            icon: FiFolder,
            description: 'Project progress reports'
          },
          {
            id: 'performance-reports',
            name: 'Performance',
            href: '/reports/performance',
            icon: FiActivity,
            comingSoon: true,
            description: 'Performance analytics (Coming Soon)'
          }
        ]
      },
      {
        id: 'documents',
        name: 'Documents',
        href: '/documents',
        icon: FiFileText,
        description: 'Project documentation'
      }
    ]
  },
  {
    id: 'system',
    title: 'System',
    icon: FiCpu,
    items: [
      {
        id: 'integrations',
        name: 'Integrations',
        icon: FiDatabase,
        description: 'Third-party integrations',
        children: [
          {
            id: 'api-keys',
            name: 'API Keys',
            href: '/integrations/api-keys',
            icon: FiCpu,
            description: 'Manage API keys'
          },
          {
            id: 'webhooks',
            name: 'Webhooks',
            href: '/integrations/webhooks',
            icon: FiBell,
            comingSoon: true,
            description: 'Configure webhooks (Coming Soon)'
          },
          {
            id: 'email-settings',
            name: 'Email Settings',
            href: '/integrations/email',
            icon: FiMail,
            description: 'Email notification settings'
          }
        ]
      },
      {
        id: 'settings',
        name: 'Settings',
        href: '/settings',
        icon: FiSettings,
        description: 'Application settings'
      },
      {
        id: 'help',
        name: 'Help & Support',
        href: '/help',
        icon: FiHelpCircle,
        description: 'Documentation and support'
      }
    ]
  }
];

/**
 * Permission-based navigation filtering
 */
export const filterNavigationByPermissions = (
  sections: NavSectionData[],
  userPermissions: string[]
): NavSectionData[] => {
  return sections
    .map(section => ({
      ...section,
      items: section.items
        .filter(item => {
          if (item.permissions) {
            return item.permissions.some(permission => userPermissions.includes(permission));
          }
          return true;
        })
        .map(item => ({
          ...item,
          children: item.children?.filter(child => {
            if (child.permissions) {
              return child.permissions.some(permission => userPermissions.includes(permission));
            }
            return true;
          })
        }))
    }))
    .filter(section => section.items.length > 0);
};

/**
 * Get navigation item by ID (supports nested lookup)
 */
export const findNavigationItem = (sections: NavSectionData[], itemId: string): any => {
  for (const section of sections) {
    for (const item of section.items) {
      if (item.id === itemId) return item;
      
      if (item.children) {
        const child = item.children.find(child => child.id === itemId);
        if (child) return child;
      }
    }
  }
  return null;
};

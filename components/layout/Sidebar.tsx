
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, ListChecks, FileText, Users, Landmark, Settings } from 'lucide-react';
import { ROUTES } from '@/constants';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ease-in-out
       ${isActive 
         ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white font-medium' 
         : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`
    }
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </NavLink>
);

const Sidebar: React.FC = () => {
  const navItems = [
    { to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { to: ROUTES.AGENDA, icon: CalendarDays, label: 'Agenda' },
    { to: ROUTES.TAREFAS, icon: ListChecks, label: 'Prazos e Tarefas' },
    { to: ROUTES.CONTRATOS, icon: FileText, label: 'Contratos' },
    { to: ROUTES.FINANCEIRO_CLIENTES, icon: Users, label: 'Financeiro Clientes' },
    { to: ROUTES.FINANCEIRO_REPASSES, icon: Landmark, label: 'Financeiro Repasses' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 space-y-2 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
      <div className="mt-auto">
         <NavItem to={ROUTES.SETTINGS} icon={Settings} label="Configurações" />
      </div>
    </aside>
  );
};

export default Sidebar;
    
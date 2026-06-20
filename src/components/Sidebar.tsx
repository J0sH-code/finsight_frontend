import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  PieChart, 
  BrainCircuit, 
  Settings, 
  HelpCircle,
  Coins,
  ChevronDown
} from 'lucide-react';
import { TabId } from '../types';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  userName?: string;
  userRole?: string;
}

export default function Sidebar({ activeTab, setActiveTab, userName = "Alex Jensen", userRole = "Premium Account" }: SidebarProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const menuItems = [
    { id: 'dashboard' as TabId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses' as TabId, label: 'Expenses', icon: Receipt },
    { id: 'income' as TabId, label: 'Income', icon: Coins },
    { id: 'budgets' as TabId, label: 'Budgets', icon: PieChart },
    { id: 'assets' as TabId, label: 'Assets', icon: Wallet },
    { id: 'insights' as TabId, label: 'AI Insights', icon: BrainCircuit },
  ];

  return (
    <>
      {/* Desktop Sidebar: Visible on md and up */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed left-0 top-0 h-full flex-col py-6 z-50 bg-[#ffffff] border-r border-[#d6c3b6] transition-all duration-300 ease-in-out select-none shadow-md ${
          isHovered ? 'w-64 overflow-y-auto custom-scrollbar' : 'w-[72px] overflow-hidden'
        }`}
      >
        {/* Brand Header */}
        <div className="px-4 mb-8 transition-all duration-300 overflow-hidden flex-shrink-0">
          <div className="flex items-center gap-3 justify-start pl-1.5">
            <div className="w-10 h-10 bg-[#804e22] rounded-lg flex items-center justify-center text-[#fff9e8] font-bold text-xl font-display shadow-sm flex-shrink-0">
              FS
            </div>
            <div className={`transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100 w-auto visible' : 'opacity-0 scale-90 w-0 h-0 hidden pointer-events-none overflow-hidden'
            }`}>
              <h1 className="font-display text-xl font-extrabold text-[#804e22] leading-none mb-0.5 whitespace-nowrap">FinSight</h1>
              <p className="font-sans text-[10px] font-semibold text-[#51443b] opacity-70 tracking-widest uppercase whitespace-nowrap">Wealth Management</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className={`flex-1 space-y-1 min-h-0 ${
          isHovered ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'
        }`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center py-3.5 transition-all outline-hidden text-left font-display text-sm relative group overflow-hidden ${
                  isActive
                    ? 'text-[#804e22] bg-[#f4eedb] font-bold border-r-[3px] border-[#804e22]'
                    : 'text-[#51443b] hover:bg-[#faf3e0] hover:text-[#1e1c10] font-medium'
                } ${isHovered ? 'px-6 justify-start' : 'px-0 justify-center'}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#804e22]' : 'text-[#847469] group-hover:text-[#804e22]'
                }`} />
                <span className={`font-sans tracking-wide whitespace-nowrap transition-all duration-300 ${
                  isHovered ? 'opacity-100 ml-4 translate-x-0' : 'opacity-0 ml-0 -translate-x-4 pointer-events-none w-0 h-0 hidden overflow-hidden'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Utility Sections & User Details */}
        <div className="mt-auto space-y-1 transition-all duration-300 flex-shrink-0">
          <button 
            id="sidebar-link-settings"
            className={`w-full flex items-center py-2.5 text-[#51443b] hover:text-[#1e1c10] hover:bg-[#faf3e0] rounded-md transition-all text-sm group overflow-hidden ${
              isHovered ? 'px-6 justify-start' : 'px-0 justify-center'
            }`}
          >
            <Settings className="w-4.5 h-4.5 text-[#847469] group-hover:text-[#804e22] flex-shrink-0" />
            <span className={`font-sans tracking-wide whitespace-nowrap transition-all duration-300 ${
              isHovered ? 'opacity-100 ml-3 translate-x-0' : 'opacity-0 ml-0 w-0 h-0 hidden overflow-hidden'
            }`}>
              Settings
            </span>
          </button>
          
          <button 
            id="sidebar-link-help"
            className={`w-full flex items-center py-2.5 text-[#51443b] hover:text-[#1e1c10] hover:bg-[#faf3e0] rounded-md transition-all text-sm group overflow-hidden ${
              isHovered ? 'px-6 justify-start' : 'px-0 justify-center'
            }`}
          >
            <HelpCircle className="w-4.5 h-4.5 text-[#847469] group-hover:text-[#804e22] flex-shrink-0" />
            <span className={`font-sans tracking-wide whitespace-nowrap transition-all duration-300 ${
              isHovered ? 'opacity-100 ml-3 translate-x-0' : 'opacity-0 ml-0 w-0 h-0 hidden overflow-hidden'
            }`}>
              Help & Support
            </span>
          </button>

          <div className={`pt-4 mt-4 border-t border-[#d6c3b6] transition-all duration-300 ${isHovered ? 'px-6' : 'px-0'}`}>
            <div className={`flex items-center gap-3 ${isHovered ? 'justify-start pl-1' : 'justify-center'}`}>
              <div className="w-10 h-10 rounded-full border-2 border-[#dde7c4] overflow-hidden shadow-xs bg-amber-100 flex-shrink-0">
                <img 
                  alt="User Profile" 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                />
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${
                isHovered ? 'opacity-100 scale-100 w-auto visible' : 'opacity-0 scale-95 w-0 h-0 hidden pointer-events-none'
              }`}>
                <p className="font-sans text-xs font-bold text-[#1e1c10] truncate leading-tight whitespace-nowrap">{userName}</p>
                <p className="font-sans text-[10px] text-[#847469] truncate font-medium whitespace-nowrap">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation: Visible on < md devices */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-[#fff9e8] border-t border-[#d6c3b6] flex justify-around items-center px-4 z-50 shadow-lg">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 transition-all text-center border-none select-none ${
                isActive ? 'text-[#804e22] scale-105' : 'text-[#847469] opacity-70'
              }`}
            >
              <Icon className="w-5.5 h-5.5" />
              <span className="text-[10px] font-sans font-semibold mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

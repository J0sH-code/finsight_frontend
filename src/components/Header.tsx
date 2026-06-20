import React, { useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
}

export default function Header({ 
  title, 
  onSearchChange, 
  searchPlaceholder = "Search transactions, budgets or insights..." 
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const notifications = [
    { id: 1, message: "⚠️ Food & Dining is at 98% capacity ($14.80 left)", time: "10m ago" },
    { id: 2, message: "💡 AI Assistant: We identified $84.00/mo in potential savings!", time: "2h ago" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-8 h-18 sticky top-0 z-40 bg-[#fff9e8]/90 backdrop-blur-md border-b border-[#d6c3b6]">
      <div className="flex items-center gap-4 flex-1">
        {/* Title for mobile */}
        <h1 className="font-display text-xl font-extrabold text-[#804e22] md:hidden">FinSight</h1>
        
        {/* Search bar */}
        <div className="hidden sm:flex items-center bg-[#faf3e0] px-4 py-1.5 rounded-full border border-[#d6c3b6] w-96 relative focus-within:ring-1 focus-within:ring-[#804e22] focus-within:border-[#804e22] transition-all">
          <Search className="text-[#847469] w-4 h-4 mr-2" />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearch}
            className="bg-transparent border-none focus:outline-hidden text-sm w-full text-[#1e1c10] placeholder-[#847469] font-sans"
          />
          {searchValue && (
            <button 
              onClick={() => { setSearchValue(""); if(onSearchChange) onSearchChange(""); }}
              className="text-xs text-[#847469] hover:text-[#1e1c10] ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <div className="relative">
          <button 
            id="notifications-bell-btn"
            onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }}
            className="p-2 hover:bg-[#faf3e0] text-[#804e22] rounded-full transition-colors relative cursor-pointer outline-hidden"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#d6c3b6] rounded-xl shadow-lg z-50 overflow-hidden font-sans">
              <div className="px-4 py-3 bg-[#faf3e0] border-b border-[#d6c3b6] flex justify-between items-center">
                <span className="font-bold text-sm text-[#1e1c10]">Notifications</span>
                <button onClick={() => setShowNotifications(false)} className="text-xs text-[#847469] hover:text-[#1e1c10]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-[#eee8d5] max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-[#fff9e8]/50 transition-colors">
                    <p className="text-xs text-[#1e1c10] leading-relaxed font-medium">{notif.message}</p>
                    <span className="text-[10px] text-[#847469] block mt-1">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2">
          <img 
            className="w-9 h-9 rounded-full object-cover border-2 border-[#dde7c4]" 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
            alt="User avatar male"
          />
          <div className="hidden sm:block">
            <span className="text-xs font-bold block text-[#1e1c10] leading-tight">Alex Jensen</span>
            <span className="text-[10px] text-[#847469] block font-medium">Premium Tier</span>
          </div>
        </div>
      </div>
    </header>
  );
}

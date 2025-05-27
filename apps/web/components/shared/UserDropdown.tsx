import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const UserDropdown: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const user = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: '/images/avatar.jpg',
    role: 'Premium User',
    xp: 1250
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 overflow-hidden">
          <img 
            src={user.avatar} 
            alt={user.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '';
              e.currentTarget.classList.add('bg-blue-500');
              e.currentTarget.innerHTML = user.name.charAt(0);
            }}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 overflow-hidden mr-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '';
                    e.currentTarget.classList.add('bg-blue-500');
                    e.currentTarget.innerHTML = user.name.charAt(0);
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium text-blue-500 dark:text-blue-400">{user.role}</span>
                  <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-800 dark:text-green-100">
                    XP: {user.xp}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="py-2">
            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {t('common.profile')}
            </Link>
            <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {t('common.settings')}
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {t('common.dashboard')}
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                console.log('Logging out...');
              }}
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

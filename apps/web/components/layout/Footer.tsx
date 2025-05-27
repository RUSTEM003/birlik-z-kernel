import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Birlik Platform
            </h3>
            <div className="mt-4 flex items-center">
              <img src="/logo.svg" alt="Birlik Logo" className="h-8 w-8 mr-2" />
              <span className="text-gray-900 dark:text-white font-semibold">Birlik</span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t('common.footer_description')}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('common.services')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/exchange" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('navigation.exchange')}
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('navigation.real_estate')}
                </Link>
              </li>
              <li>
                <Link href="/bank" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('navigation.bank')}
                </Link>
              </li>
              <li>
                <Link href="/market" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('navigation.market')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('common.company')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('common.about')}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('common.careers')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('common.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {t('common.terms')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('common.connect')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://twitter.com/birlik" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://facebook.com/birlik" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/company/birlik" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://t.me/birlik" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Birlik. {t('common.all_rights_reserved')}
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              {t('common.privacy')}
            </Link>
            <Link href="/terms" className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              {t('common.terms')}
            </Link>
            <Link href="/cookies" className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              {t('common.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

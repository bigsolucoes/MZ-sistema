
import React from 'react';
import { FOOTER_TEXT } from '@/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center py-4 fixed bottom-0 w-full">
      <p className="text-sm text-gray-600 dark:text-gray-400">{FOOTER_TEXT}</p>
    </footer>
  );
};

export default Footer;
    
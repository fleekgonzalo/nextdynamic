import { PropsWithChildren } from 'react';
import Header from './Header';
import Links from './Links';

export const Page = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="container mx-auto px-4 py-2 flex flex-col items-center">
      <Header />
      <Links />
      <div className="w-full max-w-lg md:max-w-2xl border-b pt-2"></div>
      <main className="max-w-lg md:max-w-2xl w-full pt-4 flex-1">{children}</main>

      <footer className="py-4 text-sm text-gray-500 dark:text-gray-300">
        always strive and prosper.
      </footer>
    </div>
  );
};

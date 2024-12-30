import { useEffect, useState } from 'react';
import Image from 'next/image';

import GithubIconLight from 'public/light/github-logo.svg';
import GithubIconDark from 'public/dark/github-logo.svg';
import LinkedInIconLight from 'public/light/linkedin-logo.svg';
import LinkedInIconDark from 'public/dark/linkedin-logo.svg';
import FarcasterLogoLight from 'public/light/farcaster-logo.svg';
import FarcasterLogoDark from 'public/dark/farcaster-logo.svg';
import ENSLogo from 'public/light/ens-logo.svg';
import VSCOLogoLight from 'public/light/vsco-logo.svg';
import VSCOLogoDark from 'public/dark/vsco-logo.svg';
import headshot from '../../../public/kevinsaigon.nft.png';
import SunIcon from 'public/sun-icon.svg';
import MoonIcon from 'public/moon-icon.svg';

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if window is defined to access localStorage
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        setIsDarkMode(true);
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    // Update body class and localStorage when isDarkMode changes
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('dark', isDarkMode);
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  return (
    <header className={`flex flex-col items-center pt-6 pb-4 text-center ${isDarkMode ? 'dark' : ''}`}>  
      <a onClick={toggleTheme} className="cursor-pointer">
        <div className="sm:w-32 sm:h-32 flex w-24 h-24 relative">
          <Image alt="Kevin" src={headshot} className="rounded-full cursor-pointer" />
        </div>
      </a>
      <div className="py-1 text-2xl">
        <a href="/resume.pdf" target="_blank" rel="noreferrer"className='no-underline hover:no-underline cursor-pointer'>
          Kevin Nguyen
        </a>
      </div>
      <div className="flex space-x-3 items-center">
        <a
          className="w-5 h-5 cursor-pointer"
          aria-label="LinkedIn icon button"
          href="https://www.linkedin.com/in/kevin-saigon/"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            className="rounded-sm cursor-pointer"
            alt="linkedin icon"
            src={isDarkMode ? LinkedInIconDark : LinkedInIconLight}
          />
        </a>
        <a
          className="w-5 h-5 cursor-pointer"
          aria-label="Github icon button"
          href="https://github.com/KevinSaigon"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            className="rounded-full cursor-pointer"
            alt="github icon"
            src={isDarkMode ? GithubIconDark : GithubIconLight}
          />
        </a>
        <a
          className="w-5 h-5 cursor-pointer"
          aria-label="Farcaster icon button"
          href="https://warpcast.com/kevin-saigon"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            className="rounded-sm cursor-pointer"
            alt="farcaster icon"
            src={isDarkMode ? FarcasterLogoDark : FarcasterLogoLight}
          />
        </a>
        {/* <a
          className="w-5 h-5 cursor-pointer"
          aria-label="ENS icon button"
          href="https://app.ens.domains/ksaigon.base.eth"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            className="rounded-sm cursor-pointer"
            alt="ens icon"
            src={ENSLogo}
          />
        </a> */}
        <a
          className="w-5 h-5 cursor-pointer"
          aria-label="VSCO icon button"
          href="https://vsco.co/ksaigon"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            className="rounded-full cursor-pointer"
            alt="vsco icon"
            src={isDarkMode ? VSCOLogoDark : VSCOLogoLight}
          />
        </a>

        {/* <button
          onClick={toggleTheme}
          aria-label="Toggle dark/light mode"
          className="w-7 h-7 p-1 rounded-full bg-transparent flex items-center justify-center"
        >
          {isDarkMode ? (
            <Image
              src={SunIcon}
              alt="Sun icon"
              width={20}
              height={20}
            />
          ) : (
            <Image
              src={MoonIcon}
              alt="Moon icon"
              width={20}
              height={20}
            />
          )}
        </button> */}
      </div>
    </header>
  );
}

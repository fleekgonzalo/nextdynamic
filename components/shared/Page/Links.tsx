import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';

type LinkProps = {
  path: string;
};

const BoldText = ({ children }: PropsWithChildren<{}>) => {
  return (
    // <div className="text-center font-semibold text-darkGray text-xs sm:text-base">
    <div className="text-center font-semibold text-darkGray dark:text-darkText text-xs sm:text-base">
      {children}
    </div>
  );
};

const Link = ({ children, path }: PropsWithChildren<LinkProps>) => {
  return (
    <NextLink
      href={path}
      className="text-darkGray dark:text-darkText no-underline text-center text-xs sm:text-base"
    >
      <span className="hover:font-semibold hover:text-darkGray dark:hover:text-darkText">
        {children}
      </span>
    </NextLink>
  );
};

const pathMap = {
  About: '/',
  Experience: '/experience',
  Publications: '/publications',
  Writing: '/writing',
};

// export default function MobileLinks() {
//   const { pathname } = useRouter();
//   return (
//     <nav className="w-full max-w-lg pt-2 pb-2 border-b">
//       <div className="grid grid-cols-4 gap-4">
//         {Object.entries(pathMap).map((mapping) =>
//           pathname === mapping[1] ? (
//             <BoldText key={mapping[0]}>{mapping[0]}</BoldText>
//           ) : (
//             <Link key={mapping[0]} path={mapping[1]}>
//               {mapping[0]}
//             </Link>
//           ),
//         )}
//       </div>
//     </nav>
//   );
// }

export default function MobileLinks() {
  const { pathname } = useRouter();
  return (
    <div className="w-full">
      <nav className="w-full max-w-lg mx-auto pt-2 pb-2">
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(pathMap).map((mapping) =>
            pathname === mapping[1] ? (
              <BoldText key={mapping[0]}>{mapping[0]}</BoldText>
            ) : (
              <Link key={mapping[0]} path={mapping[1]}>
                {mapping[0]}
              </Link>
            ),
          )}
        </div>
      </nav>
    </div>
  );
}

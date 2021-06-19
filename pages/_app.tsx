import React from "react";
import type {AppProps} from 'next/app';
import {Provider} from 'next-auth/client'
import Sidebar from "components/Sidebar";
import {SWRConfig} from 'swr'

import '../styles/globals.css';

function MyApp({Component, pageProps}: AppProps) {
  let hasSidebar = (Component as any).hasSidebar || false;

  return (
    <Provider session={pageProps.session}>
      <SWRConfig value={{fetcher: (resource, init) => fetch(resource, init).then(res => res.json())}}>
        <div className="min-h-screen w-full flex bg-gray-100">
          {hasSidebar && <Sidebar/>}

          <div className="flex-grow min-w-0">
            <Component {...pageProps} />
          </div>
        </div>
      </SWRConfig>
    </Provider>
  );
}

export default MyApp

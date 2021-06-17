import React from "react";
import type {AppProps} from 'next/app';
import {Provider} from 'next-auth/client'
import '../styles/globals.css';
import Sidebar from "components/Sidebar";

function MyApp({Component, pageProps}: AppProps) {
  let hasSidebar = (Component as any).hasSidebar || false;

  return (
    <Provider session={pageProps.session}>
      <div className="min-h-screen w-full flex bg-gray-100">
        {hasSidebar && <Sidebar/>}

        <div className="flex-grow min-w-0">
          <Component {...pageProps} />
        </div>
      </div>
    </Provider>
  );
}

export default MyApp

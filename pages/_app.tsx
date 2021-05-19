import React from "react";
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Sidebar from "../components/sidebar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      <div className="bg-white">
        <Sidebar />
      </div>
      <div className="flex-grow min-w-0">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp

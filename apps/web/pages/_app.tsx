import '../styles/globals.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

import Layout from '../components/layout/Layout';
import MarketDataBar from '../components/shared/MarketDataBar';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (router.locale) {
      i18n.changeLanguage(router.locale);
    }
  }, [router.locale]);

  return (
    <I18nextProvider i18n={i18n}>
      <MarketDataBar />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </I18nextProvider>
  );
}

export default MyApp;

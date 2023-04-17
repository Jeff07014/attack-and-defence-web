import '@/css/tailwind.css'
import '@/css/prism.css'
import 'katex/dist/katex.css'
// import '@/css/docsearch.css' // Uncomment if using algolia docsearch
// import '@docsearch/css' // Uncomment if using algolia docsearch

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import siteMetadata from '@/data/siteMetadata'
import { Analytics } from 'pliny/analytics'
import { SearchProvider } from 'pliny/search'
import LayoutWrapper from '@/components/LayoutWrapper'
import { SessionProvider } from "next-auth/react"


export default function App({ 
    Component,
    pageProps: { session, ...pageProps },
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <SessionProvider session={session}>
        <Head>
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>
        <Analytics analyticsConfig={siteMetadata.analytics} />
        <LayoutWrapper>
          <SearchProvider searchConfig={siteMetadata.search}>
            <Component {...pageProps} />
          </SearchProvider>
        </LayoutWrapper>
      </SessionProvider>
    </ThemeProvider>
  )
}
import type { AppProps } from 'next/app'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page)

	return (
		<ThemeProvider enableSystem={true} attribute={"class"}>
			{getLayout(<Component {...pageProps} />)}
		</ThemeProvider>
	)

}

export default MyApp

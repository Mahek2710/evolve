import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageTransition from "@/components/PageTransition";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<RecoilRoot>
			<Head>
				<title>evolve</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.png" />
				<meta
					name="description"
					content="Practice coding. Perform better."
				/>
			</Head>

			<ToastContainer />

			<PageTransition>
				<Component {...pageProps} />
			</PageTransition>
		</RecoilRoot>
	);
}

import type { AppProps } from "next/app";
import Head from "next/head";
import { WalletContextProvider } from "../components/WalletProvider";
import "../styles/globals.css";
require("@solana/wallet-adapter-react-ui/styles.css");

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>EmojiLotto — Pick 6 Emojis Win SOL</title>
        <link rel="icon" href="/logo.webp" type="image/webp" />
        <meta name="description" content="EmojiLotto — Pick 6 emojis and win SOL on Solana!" />
      </Head>
      <WalletContextProvider>
        <Component {...pageProps} />
      </WalletContextProvider>
    </>
  );
}
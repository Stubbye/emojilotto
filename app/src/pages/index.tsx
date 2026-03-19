import type { NextPage } from "next";
import Head from "next/head";
import EmojiLottoApp from "../components/EmojiLottoApp";

const Home: NextPage = () => (
  <>
    <Head>
      <title>EmojiLotto — Win USDC & $EMLO on Solana</title>
      <meta name="description" content="Pick 6 emojis, win USDC or $EMLO tokens. On-chain lottery on Solana." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <EmojiLottoApp />
  </>
);

export default Home;

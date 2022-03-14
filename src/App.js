import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

// Constants
const TWITTER_HANDLE = 'wickdxd';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  // State
  const [walletAddress, setWalletAddress] = useState(null);

  /*
    name: checkIfWalletIsConnected
    params: none
    return: message
  */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
        }
        /*
         * The solana object gives us a function that will allow us to connect
         * directly with the user's wallet!
        */
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );

         /*
         * Set the user's publicKey in state to be used on a later time
         */
        setWalletAddress(response.publicKey.toString());
      } else {
        alert('Solana Phantom Wallet not found! Please install Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* This will prompt to connect to the Phantom Wallet*/
  const connectWallet = async () => {
    const { solana } = window; // check for phantom wallet

    if (solana) { // if phantom wallet exists
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  /* rendering UI when user has not connected their wallet */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
    Connect to Wallet
    </button>
  );

  /*
    Add evenListener for Phantom Wallet
  */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);


  // This renders the front end
  return (
    <div className="App">
      {/* make things fancy*/}
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 My GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

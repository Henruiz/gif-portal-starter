import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

// Constants
const TWITTER_HANDLE = 'wickdxd';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://media.giphy.com/media/hqTguNdEoA1ooYxeog/giphy.gif',
	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
	'https://media.giphy.com/media/y0NFayaBeiWEU/giphy.gif'
]

const App = () => {

  // state obj
  const [walletAddress, setWalletAddress] = useState(null);
  // input obj
  const [inputValue, setInputValue] = useState('');
  // gifinput obj
  const [gifList, setGifList] = useState([]);

  /* This will check if wallet is connected or not*/
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

  /* Defining onInputChange variable based on event */
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  /* checking if inputvalue is not null */
  const sendGif = async () => {
    if (inputValue.length > 0){
      console.log('Gif link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else { console.log('No input found, please try again... '); }
  }

  /* rendering UI when user has not connected their wallet */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
    Connect to Wallet
    </button>
  );

  /* rendering UI when user has connected their wallet */
  const renderConnectedContainer = () => (
    <div className="connected-container">
    {/*Input and button to start*/}
    <form onSubmit={(event) => {
      event.preventDefault();
      sendGif();
      }}
    >
      <input
        type="text"
        placeholder="Enter gif link here!"
        value={inputValue}
        onChange={onInputChange}
      />
      <button type="submit" className="cta-button sumbit-gif-button">SUBMIT</button>
    </form>
    {/*Have a grid for the gifs to be placed*/}
      <div className="gif-grid">
        {gifList.map(gif => ( // this is to set up for our test data
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  /* Add evenListener for Phantom Wallet*/
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  /* event listner for fetch data after wallet is connected */
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');

      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

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
          {/* We just need to add the inverse here! */}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

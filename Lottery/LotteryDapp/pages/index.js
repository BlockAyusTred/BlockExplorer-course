import { useState, useEffect } from "react";
import Head from "next/head";
import Web3 from "web3";
import lotteryContract from "../blockchain/lottery";
import styles from "../styles/Home.module.css";
import "bulma/css/bulma.css";

export default function Home() {
  const [web3, setWeb3] = useState();
  const [address, setAddress] = useState();
  const [lcContract, setLcContract] = useState();
  const [lotteryPot, setLotteryPot] = useState();
  const [lotteryId, setLotteryId] = useState();
  const [lotteryPlayers, setLotteryPlayers] = useState([]);
  const [lotteryHistory, setLotteryHistory] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selected, setSelected] = useState(false);
  const [winnerIsSelected, setWinnerIsSelected] = useState("");

  useEffect(() => {
    updateState();
  }, [lcContract]);

  const updateState = () => {
    if (lcContract) getPot();
    if (lcContract) getPlayers();
    if (lcContract) getLotteryId();
    if (lcContract) getWinnerAvailableOrNot();
  };

  const getWinnerAvailableOrNot = async () => {
    const result = await lcContract.methods.randomResult().call();
    if(result > 0) {
      setSelected(true);
    }else {
      setSelected(false);
    }
    if (selected) {
      setWinnerIsSelected("Winner is selected.");
    } else {
      setWinnerIsSelected("Winner is not selected yet.");
    }
  };

  const getPot = async () => {
    const pot = await lcContract.methods.getBalance().call();
    setLotteryPot(web3.utils.fromWei(pot, "ether"));
  };

  const getPlayers = async () => {
    const players = await lcContract.methods.getPlayers().call();
    setLotteryPlayers(players);
  };

  const getHistory = async (id) => {
    setLotteryHistory([]);
    for (let i = parseInt(id); i > 0; i--) {
      const winnerAddress = await lcContract.methods.lotteryHistory(i).call();
      const historyObj = {};
      historyObj.id = i;
      historyObj.address = winnerAddress;
      setLotteryHistory((lotteryHistory) => [...lotteryHistory, historyObj]);
    }
  };
  const getLotteryId = async () => {
    const lotteryId = await lcContract.methods.lotteryId().call();
    setLotteryId(lotteryId);
    await getHistory(lotteryId);
  };

  const enterLotteryHandler = async () => {
    try {
      await lcContract.methods.enter().send({
        from: address,
        value: web3.utils.toWei("0.011", "ether"),
        gas: 300000,
        gasPrice: null,
      });
      updateState();
    } catch (error) {
      setError(error.message);
    }
  };

  const pickWinnerHandler = async () => {
    setError("");
    setSuccessMsg("");
    console.log(`address from pick winner :: ${address}`);
    try {
      await lcContract.methods.pickWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      });
    } catch (err) {
      setError(err.message);
    }
  };
  const payWinnerHandler = async () => {
    setError("");
    setSuccessMsg("");
    getWinnerAvailableOrNot();
    if (selected) {
      try {
        await lcContract.methods.payWinner().send({
          from: address,
          gas: 300000,
          gasPrice: null,
        });
        console.log(`lottery id :: ${lotteryId}`);
        const winnerAddress = await lcContract.methods
          .lotteryHistory(lotteryId)
          .call();
        setSuccessMsg(`The winner is ${winnerAddress}`);
        updateState();
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("Winner is not selected yet");
    }
  };

  const connectWalletHandler = async () => {
    setError("");
    setSuccessMsg("");
    /* check if MetaMask is installed */
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        /* request wallet connection */
        await window.ethereum.request({ method: "eth_requestAccounts" });
        /* create web3 instance & set to state */
        const web3 = new Web3(window.ethereum);
        /* set web3 instance in React state */
        setWeb3(web3);
        /* get list of accounts */
        const accounts = await web3.eth.getAccounts();
        /* set account 1 to React state */
        setAddress(accounts[0]);

        // create local contract copy
        const lc = lotteryContract(web3);
        setLcContract(lc);

        window.ethereum.on("accountsChanged", async () => {
          const accounts = await web3.eth.getAccounts();
          console.log(accounts[0]);
          /* set account 1 to React state */
          setAddress(accounts[0]);
        });
      } catch (err) {
        setError(err.message);
      }
    } else {
      /* MetaMask is not installed */
      setError("Please install MetaMask");
    }
  };

  return (
    <div>
      <Head>
        <title>Ether Lottery</title>
        <meta name="description" content="An Ethereum Lottery dApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav className="navbar mt-4 mb-4">
          <div className="container">
            <div className="navbar-brand">
              <h1>Ether Lottery</h1>
            </div>
            <div className="navbar-end">
              <button onClick={connectWalletHandler} className="button is-link">
                Connect Wallet
              </button>
            </div>
          </div>
        </nav>
        <div className="container">
          <section className="mt-5">
            <div className="columns">
              <div className="column is-two-third">
                <section className="mt-5">
                  <p>Enter the lottery by sending 0.011 Ether</p>
                  <button
                    onClick={enterLotteryHandler}
                    className="button is-link is-large is-light mt-3"
                  >
                    Play now
                  </button>
                </section>
                <section className="mt-6">
                  <p>
                    <b>Admin only:</b> Pick winner
                  </p>
                  <button
                    onClick={pickWinnerHandler}
                    className="button is-primary is-large is-light mt-3"
                  >
                    Pick Winner
                  </button>
                </section>
                <section className="mt-6">
                  <p>
                    <b>Anyone can:</b> Pick winner (but after winner selction)
                  </p>
                  <button
                    onClick={payWinnerHandler}
                    className="button is-success is-large is-light mt-3"
                  >
                    Pay Winner
                  </button>
                </section>
                <section>
                  <div className="container has-text-danger mt-6">
                    <p>{error}</p>
                  </div>
                </section>
                <section>
                  <div className="container has-text-success mt-6">
                    <p>{successMsg}</p>
                  </div>
                </section>
              </div>
              <div className={`${styles.lotteryinfo} column is-one-third`}>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Lottery History</h2>
                        {lotteryHistory &&
                          lotteryHistory.length > 0 &&
                          lotteryHistory.map((item) => {
                            if (lotteryId != item.id) {
                              return (
                                <div
                                  className="history-entry mt-3"
                                  key={item.id}
                                >
                                  <div>Lottery #{item.id} winner:</div>
                                  <div>
                                    <a
                                      href={`https://goerli.etherscan.io/address/${item.address}`}
                                      target="_blank"
                                    >
                                      {item.address}
                                    </a>
                                  </div>
                                </div>
                              );
                            }
                          })}
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Players({lotteryPlayers.length})</h2>
                        <ul className="ml-0">
                          {lotteryPlayers &&
                            lotteryPlayers.length > 0 &&
                            lotteryPlayers.map((player, index) => {
                              return (
                                <li key={`${player}-${index}`}>
                                  <a
                                    href={`https://etherscan.io/address/${player}`}
                                    target="_blank"
                                  >
                                    {player}
                                  </a>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Pot</h2>
                        <p>{lotteryPot} Ethers</p>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Winner is Selected or not?</h2>
                        <p>{winnerIsSelected}</p>
                        <button onClick={getWinnerAvailableOrNot}>Refresh</button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2022 Ayush Anand</p>
      </footer>
    </div>
  );
}

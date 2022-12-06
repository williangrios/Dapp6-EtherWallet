import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import { ethers } from "ethers";
import './App.css';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState('Click below to discover');
  const [deposit, setDeposit] = useState();
  const [withdraw, setWithdraw] = useState();
  const [to, setTo] = useState();

  const addressContract = '0x23fC678f7F1467559E5BeFB656BDf94477F7ee6E'

  const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "send",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

  let contractDeployed = null;
  let contractDeployedSigner = null;
  
  function getProvider(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (contractDeployed == null){
      contractDeployed = new ethers.Contract(addressContract, abi, provider)
    }
    if (contractDeployedSigner == null){
      contractDeployedSigner = new ethers.Contract(addressContract, abi, provider.getSigner());
    }
  }

  function toastMessage(text) {
    toast.info(text)  ;
  }

  async function getBalance(){
    getProvider();
    const resp = await contractDeployed.balanceOf();
    setBalance(resp.toString())
    toastMessage (`Balance loaded`);
  }

  async function getOwner(){
    getProvider();
    const owner = await contractDeployed.owner();
    toastMessage (`The owner is ${owner}. Only the owner can make withdrawals.`);
  }

  async function handleDeposit(valueDeposit){
    getProvider();
    const balanceLoaded = await contractDeployedSigner.deposit({value: valueDeposit});
    toastMessage (`Deposited`);
    getBalance();
  }

  async function handleWithdraw(_to, valueWithdraw){
    getProvider();
    const balanceLoaded = await contractDeployedSigner.send( _to, valueWithdraw);
    toastMessage (`Withdrawn`);
    getBalance();
  }

  return (
    <div className="App">
        <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Ether Wallet" image={true} />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
        
        <h3>Contract balance (in wey): {balance}</h3>
        <button onClick={getBalance}>Get balance</button>
        <button onClick={getOwner}>Who is the owner?</button>
        <hr/>
        <h3>Deposit funds (in wey): </h3>
        <input type="text" placeholder="value" onChange={(e) => setDeposit(e.target.value)} value={deposit}/>
        <button onClick={() => handleDeposit(deposit)}>Deposit funds</button>
        <hr/>
        <h3>Send funds (only owner): </h3>
        <input type="text" placeholder="address to" onChange={(e) => setTo(e.target.value)} value={to}/>
        <input type="text" placeholder="value" onChange={(e) => setWithdraw(e.target.value)} value={withdraw}/>
        <button onClick={() => handleWithdraw(to, withdraw)}>Send funds</button>
        <hr/>
        

      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />
    </div>
  );
}

export default App;

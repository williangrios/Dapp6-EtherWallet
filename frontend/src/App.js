import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

import {  useState, useEffect } from 'react';
import { ethers } from "ethers";
import {ToastContainer, toast} from "react-toastify";

import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter, { async } from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import Button from "react-bootstrap/Button";

import { format6FirstsAnd6LastsChar } from "./utils";
import meta from "./assets/metamask.png";

function App() {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  const [balance, setBalance] = useState('Click below to discover');
  const [deposit, setDeposit] = useState();
  const [withdraw, setWithdraw] = useState();
  const [to, setTo] = useState();
  const [userAccount, setUserAccount] = useState('');

  const contractAddress = '0x90dE5f47Ed03D8aAf360B17BAf79E9403b77b402'

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

  async function handleConnectWallet (){
    try {
      setLoading(true)
      let prov =  new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);

      let userAcc = await prov.send('eth_requestAccounts', []);
      setUser({account: userAcc[0], connected: true});

      const contrSig = new ethers.Contract(contractAddress, abi, prov.getSigner())
      setSigner( contrSig)

    } catch (error) {
      toastMessage(error.reason)
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    
    async function getData() {
      try {
        const {ethereum} = window;
        if (!ethereum){
          toastMessage('Metamask not detected');
        }
  
        const goerliChainId = "0x5";
        const currentChainId = await window.ethereum.request({method: 'eth_chainId'})
        if (goerliChainId != currentChainId){
          toastMessage('Change to goerli testnet')
        }    
      } catch (error) {
        toastMessage(error.reason)        
      }
      
    }

    getData()  
    
  }, [])
  
  async function isConnected(){
    if (!user.connected){
      toastMessage('You are not connected!')
      return false;
    }
    return true;
  }

  async function handleDisconnect(){
    try {
      setUser({});
      setSigner(null);
      setProvider(null);
    } catch (error) {
      toastMessage(error.reason)
    }
  }

  function toastMessage(text) {
    toast.info(text)  ;
  }

  async function getBalance(){
    
    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true);
      const resp = await signer.balanceOf();
      setBalance(resp.toString())
      toastMessage (`Balance loaded`);  
    } catch (error) {
      toastMessage(error.reason)
    } finally{
      setLoading(false);
    }
  }

  async function getOwner(){
    
    try {
      setLoading(true)
      const owner = await signer.owner();
      console.log(owner);
      toastMessage (`The owner is ${owner}. Only the owner can make withdrawals.`);      
    } catch (error) {
      toastMessage(error.reason);
    }finally{
      setLoading(false);
    }

  }

  async function handleDeposit(valueDeposit){
    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true);
      const resp = await signer.deposit({value: valueDeposit});
      await resp.wait();
      toastMessage (`Deposited`);
    } catch (error) {
      toastMessage(error.reason)
    } finally{
      setLoading(false)
    }
  }

  async function handleWithdraw(_to, valueWithdraw){
    
    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true);
      const resp = await signer.send( _to, valueWithdraw);
      await resp.wait();
      toastMessage (`Withdrawn`);
    } catch (error) {
      toastMessage(error.reason)
    } finally{
      setLoading(false);
    }
    
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Ether Wallet" image={true} />
      <WRInfo chain="Goerli" testnet={true} />
      <WRContent>

        <h1>Ether wallet</h1>        
        {loading && 
          <h1>Loading....</h1>
        }
        { !user.connected ?<>
            <Button variant="btn btn-primary commands" onClick={handleConnectWallet}>
              <img src={meta} alt="metamask" width="30px" height="30px"/>Connect to Metamask
            </Button></>
          : <>
            <label>Welcome {format6FirstsAnd6LastsChar(user.account)}</label>
            <button className="btn btn-primary commands" onClick={handleDisconnect}>Disconnect</button>
          </>
        }
        <hr/>

        <h3>Contract balance (in wey): {balance}</h3>
        <button className="btn btn-primary commands" onClick={getBalance}>Get balance</button>
        <button className="btn btn-primary commands" onClick={getOwner}>Who is the owner?</button>
        <hr/>
        <h3>Deposit funds (in wey)</h3>
        <input type="number" className="commands" placeholder="Value in wei" onChange={(e) => setDeposit(e.target.value)} value={deposit}/>
        <button className="btn btn-primary commands" onClick={() => handleDeposit(deposit)}>Deposit funds</button>
        <hr/>
        <h3>Send funds (only owner): </h3>
        <input type="text"  className="commands" placeholder="Address to" onChange={(e) => setTo(e.target.value)} value={to}/>
        <input type="number" className="commands" placeholder="Value in wei" onChange={(e) => setWithdraw(e.target.value)} value={withdraw}/>
        <button className="btn btn-primary commands" onClick={() => handleWithdraw(to, withdraw)}>Send funds</button>
        <hr/>

      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />
    </div>
  );
}

export default App;

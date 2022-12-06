//testing contract
const EtherWallet = artifacts.require("EtherWallet");

contract("EtherWallet", (accounts) => {

    let etherWallet = null;

    before(async() =>{
        etherWallet = await EtherWallet.deployed();
    })

    it ("Should set accounts[0] as owner", async () => {
        const owner = await etherWallet.owner();
        assert(owner === accounts[0]);
    })

    it ("Should Deposit ETH", async () => {
        await etherWallet.deposit({
            from: accounts[0],
            value: 1000
         });
        const balance = await web3.eth.getBalance(etherWallet.address);
        assert(owner === accounts[0]);
    })

    // está faltando  = return the balance of contract


    it ("Should transfer ether to another address", async () => {
        const balanceRecipientBefore = await web3.eth.getBalance(accounts[1]);

        await etherWallet.send(accounts[1], 50, { from: accounts[0]});

        const balanceWallet = await web3.eth.getBalance(etherWallet.address);

        assert(parseInt(balanceWallet) === 50);

        const balanceRecipientAfter = await web3.eth.getBalance(accounts[1]);

        const initialBalance = web3.utils.toBN(balanceRecipientBefore);
        const finalBalance = web3.utils.toBN(balanceRecipientAfter);

        assert( finalBalance.sub(initialBalance).toNumber() === 50);
    })
    
    it ("Should NOT transfer ether if tx not sent from owner", async () => {
        try{
            await etherWallet.send(accounts[1], 50, {from: accounts[2]});
        }catch(e){
            assert(e.message.includes('Sender is not allowed'));
            return;
        }
        assert(false)
        
    })


})
//SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

contract EtherWallet{

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() payable public{
        //dont need code
    }

    function send(address payable to, uint256 amount) public {
        require(owner == msg.sender, "You are not the owner!");
        to.transfer(amount);
    }

    function balanceOf() view public returns (uint256){
        return address(this).balance;
    }
}
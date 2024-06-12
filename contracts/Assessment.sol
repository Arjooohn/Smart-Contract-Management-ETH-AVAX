// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Transfer(address indexed to, uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this account");
        _;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable onlyOwner {
        uint256 _previousBalance = balance;

        // Perform the deposit
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // Emit the event
        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public payable onlyOwner {
        //uint256 _previousBalance = balance;

        // Check if there's enough balance to withdraw
        require(balance >= _withdrawAmount, "Insufficient balance");

        // Perform the withdrawal
        balance -= _withdrawAmount;

        // Emit the event
        emit Withdraw(_withdrawAmount);
    }

    function transfer(address _to, uint256 _amount) public payable onlyOwner {
        // Check if there's enough balance to transfer
        require(balance >= _amount, "Insufficient balance");

        // Perform the transfer
        balance -= _amount;

        // Emit the transfer event
        emit Transfer(_to, _amount);
    }

}
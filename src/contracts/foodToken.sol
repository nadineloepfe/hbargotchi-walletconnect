// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHederaTokenService {
    function transferToken(address token, address from, address to, int64 amount) external returns (int32);
    function mintToken(address token, uint64 amount) external returns (int64 newTotalSupply, int64[] memory serialNumbers);
}

contract TreasuryContract {
    address public owner;
    address public treasury;
    address public tokenAddress;
    uint256 public tokenExchangeRate; // Tokens per 1 HBAR

    event TokensSent(address indexed receiver, uint256 amount);

    constructor(address _treasury, address _tokenAddress, uint256 _tokenExchangeRate) {
        owner = msg.sender;
        treasury = _treasury;
        tokenAddress = _tokenAddress;
        tokenExchangeRate = _tokenExchangeRate;
    }

    // Automatically handle receiving HBAR and sending tokens
    receive() external payable {
        require(msg.value > 0, "Must send HBAR to get tokens");

        // Calculate how many tokens to send
        uint256 tokensToSend = msg.value * tokenExchangeRate;

        // Transfer tokens from the treasury to the user
        int32 result = IHederaTokenService(tokenAddress).transferToken(
            tokenAddress,  // Token address
            treasury,      // Treasury account
            msg.sender,    // User's address
            int64(tokensToSend) // Amount of tokens to transfer
        );

        require(result == 0, "Token transfer failed");

        emit TokensSent(msg.sender, tokensToSend);
    }

    // Function to update the token exchange rate
    function updateTokenExchangeRate(uint256 newRate) external {
        require(msg.sender == owner, "Only owner can update rate");
        tokenExchangeRate = newRate;
    }

    // Withdraw HBAR from the contract
    function withdrawHBAR(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw HBAR");
        payable(owner).transfer(amount);
    }
}

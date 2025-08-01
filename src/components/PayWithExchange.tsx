import { useState } from 'react';
import { useAccount, useBalance, useContractWrite, useTransaction } from 'wagmi';
import { parseEther } from 'viem';

export function PayWithExchange() {
  const [amount, setAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const { address } = useAccount();

  // Get the balance of the selected token
  const { data: tokenBalance } = useBalance({
    address,
    token: tokenAddress as `0x${string}`
  });

  // Example contract interaction (you'll need to replace with your actual contract)
  const contractConfig = {
    abi: [{
      name: 'payWithToken',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'tokenAddress', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [],
    }] as const,
    address: '0xYourContractAddress' as `0x${string}`, // Replace with your contract address
  };

  const { writeContract: executePayment, data: paymentData } = useContractWrite();

  // Wait for transaction to be mined
  const { isLoading, isSuccess } = useTransaction({
    hash: paymentData as unknown as `0x${string}`,
  });

  const handlePayment = () => {
    if (!amount || !tokenAddress) return;
    
    executePayment?.({
      ...contractConfig,
      functionName: 'payWithToken',
      args: [tokenAddress as `0x${string}`, parseEther(amount)],
    });
  };

  return (
    <div className="pay-with-exchange">
      <h2>Pay with Exchange</h2>
      
      <div className="input-group">
        <label htmlFor="token-address">Token Address:</label>
        <input
          id="token-address"
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Enter token address (0x...)"
        />
      </div>

      <div className="input-group">
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        {tokenBalance && (
          <span className="balance">
            Balance: {tokenBalance.formatted} {tokenBalance.symbol}
          </span>
        )}
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading || !amount || !tokenAddress}
      >
        {isLoading ? 'Processing...' : 'Pay with Token'}
      </button>

      {isSuccess && (
        <div className="success-message">
          Payment successful! Transaction: {paymentData as unknown as `0x${string}`}
        </div>
      )}

      <style>{`
        .pay-with-exchange {
          max-width: 500px;
          margin: 2rem auto;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .input-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .balance {
          display: block;
          font-size: 0.9rem;
          color: #666;
        }

        .success-message {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #d4edda;
          color: #155724;
          border-radius: 4px;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}
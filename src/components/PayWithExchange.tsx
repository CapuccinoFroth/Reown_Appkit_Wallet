import { useState } from 'react';
import { useAccount, useBalance, useContractWrite, useTransaction } from 'wagmi';
import { parseEther } from 'viem';

interface PayWithExchangeProps {
  amount: number;
}

export function PayWithExchange({ amount }: PayWithExchangeProps) {
  const [showModal, setShowModal] = useState(false);
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
    if (!tokenAddress) return;
    
    executePayment?.({
      ...contractConfig,
      functionName: 'payWithToken',
      args: [tokenAddress as `0x${string}`, parseEther(amount.toString())],
    });
  };

  return (
    <>
      <button 
        className="exchange-button"
        onClick={() => setShowModal(true)}
      >
        Pay with Exchange Token
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Pay with Exchange Token</h2>
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <p className="amount-display">Amount to Pay: {amount} ETH</p>
              
              <div className="input-group">
                <label htmlFor="token-address">Token Address:</label>
                <input
                  id="token-address"
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="Enter token address (0x...)"
                />
                {tokenBalance && (
                  <span className="balance">
                    Balance: {tokenBalance.formatted} {tokenBalance.symbol}
                  </span>
                )}
              </div>

              <button
                className="pay-button"
                onClick={handlePayment}
                disabled={isLoading || !tokenAddress}
              >
                {isLoading ? 'Processing...' : 'Confirm Payment'}
              </button>

              {isSuccess && (
                <div className="success-message">
                  Payment successful! Transaction: {paymentData as unknown as `0x${string}`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .exchange-button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #2ecc71;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin: 1rem 0;
          width: auto;
        }

        .exchange-button:hover {
          background-color: #27ae60;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 0;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #2c3e50;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .amount-display {
          font-size: 1.2rem;
          color: #2ecc71;
          font-weight: bold;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #eee;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        input:focus {
          border-color: #3498db;
          outline: none;
        }

        .balance {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }

        .pay-button {
          width: 100%;
          padding: 1rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .pay-button:hover {
          background-color: #2980b9;
        }

        .pay-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .success-message {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #d4edda;
          color: #155724;
          border-radius: 8px;
          word-break: break-all;
        }
      `}</style>
    </>
  );
}
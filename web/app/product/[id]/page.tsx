'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name?: string;
  productName?: string;
  price?: number;
  components?: { name: string; origin: string; cost: number }[];
  totalCost?: number;
  localCost?: number;
  localPercentage: number;
  classification: 'Class I' | 'Class II' | 'Non-local';
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  riskReasons?: string[];
  timestamp: number;
  txHash?: string;
  verifier?: string;
  contractAddress?: string;
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = params.id;
    if (id) {
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setProduct(data.product);
          } else {
            setError(data.error || 'Product not found');
          }
        })
        .catch(() => setError('Failed to load product'))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="brutalist-border p-6 font-bold">{error || 'Product not found'}</p>
        <Link href="/dashboard" className="brutalist-button mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isOnChain = product.txHash && !product.txHash.startsWith('0x') === false && product.txHash.length > 10;

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="nav-link text-sm">
          &larr; Back to Dashboard
        </Link>
      </div>

      <h2 className="text-3xl font-bold mb-6 border-b-3 border-black pb-4">{(product.name || product.productName || 'Product').toUpperCase()}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="brutalist-border p-6">
          <h3 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">VERIFICATION SUMMARY</h3>
          
          <div className="space-y-4">
            {product.price && (
              <div className="flex justify-between">
                <span className="font-bold">Price:</span>
                <span>₹{product.price.toLocaleString()}</span>
              </div>
            )}
            {product.totalCost && (
              <div className="flex justify-between">
                <span className="font-bold">Total BoM Cost:</span>
                <span>₹{product.totalCost.toLocaleString()}</span>
              </div>
            )}
            {product.localCost && (
              <div className="flex justify-between">
                <span className="font-bold">Local Cost:</span>
                <span>₹{product.localCost.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-black pt-2">
              <span className="font-bold">Local Content:</span>
              <span className="text-2xl font-bold">{product.localPercentage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Classification:</span>
              <span className={`badge ${
                product.classification === 'Class I' ? 'badge-class-i' :
                product.classification === 'Class II' ? 'badge-class-ii' :
                'badge-non-local'
              }`}>
                {product.classification}
              </span>
            </div>
          </div>
        </div>

        <div className="brutalist-border p-6">
          <h3 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">RISK ASSESSMENT</h3>
          
          <div className="mb-4">
            <span className="font-bold">Risk Level: </span>
            <span className={`badge ${
              product.riskLevel === 'HIGH' ? 'badge-risk-high' :
              product.riskLevel === 'MEDIUM' ? 'badge-risk-medium' :
              'badge-risk-low'
            }`}>
              {product.riskLevel}
            </span>
          </div>

          <div className="space-y-2">
            <p className="font-bold">Risk Factors:</p>
            {(product.riskReasons && product.riskReasons.length > 0) ? product.riskReasons.map((reason, index) => (
              <div key={index} className="brutalist-border-thin p-3 bg-gray-100">
                {reason}
              </div>
            )) : (
              <div className="brutalist-border-thin p-3 bg-gray-100">
                No risk factors identified
              </div>
            )}
          </div>
        </div>
      </div>

      {product.components ? (
        <div className="brutalist-border p-6 mt-6">
          <h3 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">BILL OF MATERIALS (BoM)</h3>
          
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header text-left">Component</th>
                <th className="table-header text-center">Origin</th>
                <th className="table-header text-right">Cost (₹)</th>
                <th className="table-header text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {product.components.map((component, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell font-bold">{component.name}</td>
                  <td className="table-cell text-center">
                    <span className={`badge ${component.origin === 'India' ? 'badge-class-i' : 'badge-non-local'}`}>
                      {component.origin}
                    </span>
                  </td>
                  <td className="table-cell text-right">₹{component.cost.toLocaleString()}</td>
                  <td className="table-cell text-right">
                    {((component.cost / product.totalCost!) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="brutalist-border p-6 mt-6">
          <h3 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">BILL OF MATERIALS (BoM)</h3>
          <p className="text-gray-600">Full BoM details stored on-chain. Contact supplier for component details.</p>
        </div>
      )}

      <div className="brutalist-border p-6 mt-6">
        <h3 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">BLOCKCHAIN VERIFICATION</h3>
        
        {product.verifier || product.txHash ? (
          <div>
            <div className="on-chain-indicator mb-4">
              <span className="text-2xl">&#9679;</span>
              <span className="font-bold">VERIFIED ON-CHAIN</span>
            </div>
            
            {product.txHash && (
              <div className="mb-4">
                <p className="font-bold mb-2">Transaction Hash:</p>
                <a 
                  href={`https://sepolia.basescan.org/tx/${product.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-hash block"
                >
                  {product.txHash}
                </a>
              </div>
            )}

            {product.verifier && (
              <div className="mb-4">
                <p className="font-bold mb-2">Verified By:</p>
                <a 
                  href={`https://sepolia.basescan.org/address/${product.verifier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-hash block"
                >
                  {product.verifier}
                </a>
              </div>
            )}

            <div>
              <p className="font-bold mb-2">Contract Address:</p>
              <a 
                href={`https://sepolia.basescan.org/address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tx-hash block"
              >
                {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
              </a>
            </div>
          </div>
        ) : (
          <div className="brutalist-border p-4 bg-gray-100 text-center">
            <p className="font-bold">Demo Mode - No Real Blockchain</p>
            <p className="text-sm">Configure with real RPC to store on-chain</p>
          </div>
        )}

        <p className="text-sm mt-4">
          Verified: {new Date(product.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
import { ethers } from 'ethers';

const CONTRACT_ABI = [
  'function storeProduct(bytes32 productId, string productName, uint256 localPercentage, string classification, string riskLevel) external',
  'function getProduct(bytes32 productId) view returns (tuple(bytes32 productId, string productName, uint256 localPercentage, string classification, string riskLevel, uint256 timestamp, address verifier))',
  'function hasProduct(bytes32 productId) view returns (bool)',
  'event ProductStored(bytes32 indexed productId, string productName, uint256 localPercentage, string classification, string riskLevel, uint256 timestamp, address indexed verifier)',
];

export interface BlockchainConfig {
  rpcUrl: string;
  privateKey: string;
  contractAddress: string;
}

let config: BlockchainConfig | null = null;

function initializeConfig() {
  if (typeof window !== 'undefined') return;
  
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (rpcUrl && privateKey && contractAddress) {
    config = { rpcUrl, privateKey, contractAddress };
  }
}

initializeConfig();

export function setBlockchainConfig(newConfig: BlockchainConfig) {
  config = newConfig;
}

export function getBlockchainConfig(): BlockchainConfig | null {
  return config;
}

export async function storeProductOnChain(
  productId: string,
  productName: string,
  localPercentage: number,
  classification: string,
  riskLevel: string
): Promise<string> {
  if (!config) {
    throw new Error('Blockchain not configured');
  }

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(config.privateKey, provider);
  const contract = new ethers.Contract(config.contractAddress, CONTRACT_ABI, wallet);

  const tx = await contract.storeProduct(
    productId,
    productName,
    Math.round(localPercentage * 100),
    classification,
    riskLevel
  );

  const receipt = await tx.wait();
  return receipt.hash;
}

export async function getProductFromChain(productId: string): Promise<{
  productId: string;
  productName: string;
  localPercentage: number;
  classification: string;
  riskLevel: string;
  timestamp: number;
  verifier: string;
} | null> {
  if (!config) {
    throw new Error('Blockchain not configured');
  }

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const contract = new ethers.Contract(config.contractAddress, CONTRACT_ABI, provider);

  const result = await contract.getProduct(productId);
  return result;
}

export async function checkProductOnChain(productId: string): Promise<boolean> {
  if (!config) {
    throw new Error('Blockchain not configured');
  }

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const contract = new ethers.Contract(config.contractAddress, CONTRACT_ABI, provider);

  return await contract.hasProduct(productId);
}

export function isConfigured(): boolean {
  return config !== null;
}
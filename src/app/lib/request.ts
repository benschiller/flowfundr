import { RequestNetwork, Types } from '@requestnetwork/request-client.js';
import { Web3SignatureProvider } from '@requestnetwork/web3-signature';
import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';
import { Wallet, providers, utils } from 'ethers';
import {
  getReceivableTokenIdForRequest,
  mintErc20TransferableReceivable,
  payErc20TransferableReceivableRequest,
} from '@requestnetwork/payment-processor'; // Correct module for these functions

// Create the web3 signature provider (for MetaMask)
const createSignatureProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new Web3SignatureProvider(window.ethereum);
  }
  return null;
};

// Initialize Request Client with web3 signature provider
export const getRequestClient = () => {
  const signatureProvider = createSignatureProvider();

  return new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: 'https://sepolia.gateway.request.network/',
    },
    signatureProvider: signatureProvider || undefined,
  });
};

export const createRentalPackageRequest = async (
  annualIncome: number,
  discountedPrice: number,
  ownerAddress: string,
  erc20ContractAddress: string,
) => {
  try {
    const requestClient = getRequestClient();

    const payeeIdentity = {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: ownerAddress,
    };

    const request = await requestClient.createRequest({
      paymentNetwork: {
        id: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE,
        parameters: {
          paymentAddress: ownerAddress,
          feeAddress: ownerAddress,
          feeAmount: '0',
        },
      },
      requestInfo: {
        currency: {
          type: RequestLogicTypes.CURRENCY.ERC20, // Correct type reference
          value: erc20ContractAddress,
          network: 'sepolia'
        },
        expectedAmount: annualIncome.toString(),
        payee: payeeIdentity,
      },
      signer: payeeIdentity,
    });

    await request.waitForConfirmation();
    return request;
  } catch (error) {
    console.error('Error creating rental package request:', error);
    throw error;
  }
};

// Function to mint the ERC20 transferable receivable
export const mintReceivable = async (
  request: any,
  signer: providers.JsonRpcSigner
) => {
  try {
    const mintTx = await mintErc20TransferableReceivable(request, signer, {
      gasLimit: utils.parseUnits('20000000', 'wei'),
    });
    const confirmedTx = await mintTx.wait(1);
    return confirmedTx;
  } catch (error) {
    console.error('Error minting receivable:', error);
    throw error;
  }
};

// Function to pay the ERC20 transferable receivable
export const payReceivable = async (
  request: any,
  signer: providers.JsonRpcSigner,
  amount: string,
  feeAmount: string = '0'
) => {
  try {
    const payTx = await payErc20TransferableReceivableRequest(request, signer, amount, feeAmount, {
      gasLimit: utils.parseUnits('20000000', 'wei'),
    });
    const confirmedTx = await payTx.wait(1);
    return confirmedTx;
  } catch (error) {
    console.error('Error paying receivable:', error);
    throw error;
  }
};

export const getRentalPackageRequest = async (requestId: string) => {
  try {
    const requestClient = getRequestClient();
    return await requestClient.fromRequestId(requestId);
  } catch (error) {
    console.error('Error fetching request:', error);
    throw error;
  }
};

export default getRequestClient;

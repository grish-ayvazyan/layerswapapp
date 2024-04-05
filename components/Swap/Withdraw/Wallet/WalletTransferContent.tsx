import { FC } from "react";
import { useSwapDataState } from "../../../../context/swap";
import KnownInternalNames from "../../../../lib/knownIds";
import ImtblxWalletWithdrawStep from "./ImtblxWalletWithdrawStep";
import StarknetWalletWithdrawStep from "./StarknetWalletWithdraw";
import TransferFromWallet from "./WalletTransfer";
import ZkSyncWalletWithdrawStep from "./ZKsyncWalletWithdraw";
import SolanaWalletWithdrawStep from "./SolanaWalletWithdraw";
import LoopringWalletWithdraw from "./Loopring";

//TODO have separate components for evm and none_evm as others are sweepless anyway
export const WalletTransferContent: FC = () => {
    const { swapResponse, swapPrepareData } = useSwapDataState();
    const { swap } = swapResponse || {};

    const { source_network } = swap || {};
    const source_network_internal_name = source_network?.name;

    const sourceIsImmutableX = swap?.source_network?.name?.toUpperCase() === KnownInternalNames.Networks.ImmutableXMainnet?.toUpperCase()
        || swap?.source_network.name === KnownInternalNames.Networks.ImmutableXGoerli?.toUpperCase()
        || swap?.source_network.name === KnownInternalNames.Networks.ImmutableXSepolia?.toUpperCase();

    const sourceIsZkSync = swap?.source_network?.name?.toUpperCase() === KnownInternalNames.Networks.ZksyncMainnet?.toUpperCase();
    const sourceIsStarknet = swap?.source_network?.name?.toUpperCase() === KnownInternalNames.Networks.StarkNetMainnet?.toUpperCase()
        || swap?.source_network.name === KnownInternalNames.Networks.StarkNetGoerli?.toUpperCase();
    const sourceIsLoopring = swap?.source_network?.name?.toUpperCase() === KnownInternalNames.Networks.LoopringMainnet?.toUpperCase() ||
        swap?.source_network?.name?.toUpperCase() === KnownInternalNames.Networks.LoopringGoerli?.toUpperCase();
    const sourceIsSolana = source_network_internal_name?.toUpperCase() === KnownInternalNames.Networks.SolanaMainnet?.toUpperCase();

    const depositAddress = swapPrepareData?.deposit_actions?.find(da => da.type == 'transfer')?.to_address;
    const requested_amount = swapPrepareData?.deposit_actions.find(da => da.type == 'transfer')?.amount || 0;

    if (sourceIsImmutableX)
        return <ImtblxWalletWithdrawStep
            depositAddress={depositAddress}
            amount={requested_amount.toString()}
            source_network={swap.source_network}
            source_token={swap.source_token}
            swapId={swap.id}
        />;
    else if (sourceIsStarknet)
        return <StarknetWalletWithdrawStep
            amount={requested_amount}
            depositAddress={depositAddress} />;
    else if (sourceIsZkSync)
        return <>
            {requested_amount
                && <ZkSyncWalletWithdrawStep
                    depositAddress={depositAddress}
                    amount={requested_amount} />}
        </>;
    else if (sourceIsLoopring)
        return <LoopringWalletWithdraw
            amount={requested_amount}
            depositAddress={depositAddress} />;
    else if (sourceIsSolana)
        return <>
            {requested_amount &&
                <SolanaWalletWithdrawStep
                    depositAddress={depositAddress}
                    amount={requested_amount} />}
        </>;
    else
        return <>
            {swap && <TransferFromWallet
                sequenceNumber={swap?.metadata.sequence_number}
                swapId={swap.id}
                networkDisplayName={swap.source_network?.display_name}
                tokenDecimals={swap.source_token?.decimals}
                tokenContractAddress={swap.source_token.contract as `0x${string}`}
                chainId={Number(swap.source_network.chain_id)}
                depositAddress={depositAddress}
                userDestinationAddress={swap.destination_address}
                amount={requested_amount} />}
        </>;
};




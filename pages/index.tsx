import { useState } from "react";
import { osmosis } from '../codegen/';
import md5 from "md5";
import { Center } from "@chakra-ui/react";

import { StargateClient, IndexedTx, SigningStargateClient } from "@cosmjs/stargate";
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { DirectSecp256k1HdWallet, OfflineDirectSigner } from "@cosmjs/proto-signing";

export default function Home() {
      const [transactionHash, setTransactionHash] = useState("");
      const [height, setHeight] = useState(0);
      const [hash, setHash] = useState("");
      const [numPools, setNumPools] = useState("numPools are not fetched");

      //prepare for signing the transaction
      //NOTE: keys should not be hardcoded and shared publicly in production. This is for demo only.
      const getAliceSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
          return DirectSecp256k1HdWallet.fromMnemonic("hint shop put vocal welcome jazz cram slight action trigger claw tower evolve nuclear mention equip fiber road cotton adult roast space skin reason", {
              prefix: "cosmos",
          })
      }

      const sendTokens = async(): Promise<void> => {
        //connect to RPC port
        const rpc = "rpc.sentry-01.theta-testnet.polypore.xyz:26657";
        //instantiate the client using Stargate
        const client = await StargateClient.connect(rpc);
        //get transaction
        const faucetTx: IndexedTx = (await client.getTx(
            "540484BDD342702F196F84C2FD42D63FA77F74B26A8D7383FAA5AB46E4114A9B",
        ))! 
        //decode transaction
        const decodedTx: Tx = Tx.decode(faucetTx.tx)
        const sendMessage: MsgSend = MsgSend.decode(decodedTx.body!.messages[0].value)
        const faucet: string = sendMessage.fromAddress
        //get signer
        const aliceSigner: OfflineDirectSigner = await getAliceSignerFromMnemonic();
        const alice = (await aliceSigner.getAccounts())[0].address
        //get signing client
        const signingClient = await SigningStargateClient.connectWithSigner(rpc, aliceSigner)
        console.log(
            "With signing client, chain id:",
            await signingClient.getChainId(),
            ", height:",
            await signingClient.getHeight()
        )
        console.log("Gas fee:", decodedTx.authInfo!.fee!.amount)
        console.log("Gas limit:", decodedTx.authInfo!.fee!.gasLimit.toString(10))
    
        //check the balance of Alice and the Faucet
        console.log("Alice balance before:", await client.getAllBalances(alice))
        console.log("Faucet balance before:", await client.getAllBalances(faucet))
        
        //execute the sendTokens Tx and store the result
        const result = await signingClient.sendTokens(
            alice,
            faucet,
            [{ denom: "uatom", amount: "100000" }],
            {
                amount: [{ denom: "uatom", amount: "500" }],
                gas: "200000",
            },
        )
        //print the result of the Tx
        console.log("Transfer result:", result)
        const transactionHash = result.transactionHash
        console.log("Transaction hash:", result.transactionHash)
        setTransactionHash(transactionHash);
        console.log("Alice balance after:", await client.getAllBalances(alice))
        console.log("Faucet balance after:", await client.getAllBalances(faucet))
    }

    const getHeight = async() => {
      const { createRPCQueryClient } = osmosis.ClientFactory;
    
      //instantiate a client:
      const client = await createRPCQueryClient({ rpcEndpoint: "https://rpc-test.osmosis.zone/" });
    
      //get response
      const response = await client.cosmos.base.tendermint.v1beta1.getLatestBlock()

      //get height
      const height = response.block!.header!.height.toInt()
      console.log("height: " + height);
      setHeight(height);
  }

  const getHash = async () => {
      const { createRPCQueryClient } = osmosis.ClientFactory;
    
      //instantiate a client:
      const client = await createRPCQueryClient({ rpcEndpoint: "https://rpc-test.osmosis.zone/" });
    
      //get response
      const response = await client.cosmos.base.tendermint.v1beta1.getLatestBlock()

      //get hash
      const hash = md5(response.blockId!.hash);
      console.log(hash);
      setHash(hash);

      if (height % 10 == 0) {
        //get num_pools
        let numPools = await client.osmosis.gamm.v1beta1.numPools()
        console.log("numpools: " + numPools.numPools.toString())
        setNumPools(numPools.numPools.toString());
    }
  }

  return (
    <>

      <Center bg='tomato' h='100px' color='white'>
        <button onClick={sendTokens}>Click to Send Tokens</button>
      </Center>

      <Center bg='white' h='100px' color='black'>
        <p>Transaction hash: {transactionHash}</p>
      </Center>

      <Center bg='tomato' h='100px' color='white'>
        <button onClick={getHeight}>Click to Get Height</button>
      </Center>

      <Center bg='white' h='100px' color='black'>
        <p>Height: {height}</p>
      </Center>

      <Center bg='white' h='100px' color='black'>
        <p>NumPools: {numPools}</p>
      </Center>

      <Center bg='tomato' h='100px' color='white'>
        <button onClick={getHash}>Click to Get Hash</button>
      </Center>

      <Center h='100px' color='black'>
        <p>Hash: {hash}</p>
      </Center>

  </>
  );
}

import { useState } from "react";
import { osmosis } from '../codegen/';
import md5 from "md5";
import { Center } from "@chakra-ui/react";

export default function Home() {
    const [height, setHeight] = useState(0);
    const [hash, setHash] = useState("");
    const [numPools, setNumPools] = useState("numPools are not fetched");

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

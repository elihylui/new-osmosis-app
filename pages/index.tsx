import { useState } from "react";
import { osmosis } from '../codegen/';
import md5 from "md5";

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
      <button style={{ backgroundColor: 'grey', borderColor: 'black' }} onClick={getHeight}>Click to Get Height</button>
      <p>Height: {height}</p>

      <button style={{ backgroundColor: 'grey', borderColor: 'black' }} onClick={getHash}>Get Hash</button>
      <p>Hash: {hash}</p>

      <p>NumPools: {numPools}</p>
      
  </>
  );
}

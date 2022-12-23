# SDK for Osmosis Chain

This repository contains a SDK which connects to the Osmosis Chain and is built using Typescript and ```cosmjs``` modules. 

To run the application, run ```yarn && yarn dev```.

The application will then be available at [http://localhost:3000](http://localhost:3000). 

Click the respective buttons to inquire the latest block height and latest block hash. 

If (block number % 10 == 0), the number of pools will also be inquired and shown. 

In addition, click the button at the top to trigger a transaction which sends tokens to the faucet. If the transaction succeeds, a hash of that transaction will be printed. 
0) Open this webpage and take a look:
https://docs.chain.link/docs/vrf/v2/subscription/examples/get-a-random-number/#create-and-deploy-a-vrf-v2-compatible-contract


1) Add "Goerli testnet" to your metamask.

2) Go to Goerli testnet faucet and get some ETH tokens
https://goerlifaucet.com/

3) Go to this website and find "Goerli testnet" settings
https://docs.chain.link/vrf/v2/subscription/supported-networks#goerli-testnet

First add "LINK" token to your Metamask, you will see a button for this.

Then go to LINK faucet for Goerli testnet and get some LINK tokens
https://faucets.chain.link/

4)Open subscription manager: https://vrf.chain.link/
You can find this link also on the webpage in step 0.

5) Click on "create subscription"

6) Enter your Metamask account which has ETH and LINK tokens

7) Then Add funds. Sending 10 LINK tokens is more than enough.

8) You will need a chainlink contract to get random numbers. This contract is called
"VRFv2Consumer.sol". You can find contract on the webpage in step 0. On that webpage,
you will see a button "Open in Remix" button, click on it. 

9) You can deploy this contract without anychange if you are using Goerli Testnet. except here you can change numWords from 2 to any number of random no. you want in my case i want 1 random no. so i change it to 1

and if you are using any other network then you have to change two things
- keyHash - here you will paste "____ gwei key hash" of your network
- parameter inside VRFConsumerBaseV2 - here you will paste "VRF conrdinator" address of your network

 
10) Make sure, you are using "injected provider" on Remix
and make sure your Metamask account and Goerli testnet is connected to Remix.

11) Go to your subscription page, you will find an "id" number. Copy it and go back to Remix.
Compile the contract and then in the deployment, paste "id" number as constructor argument and click "deploy" button.

12) Then copy contract address and go to subscription page. There add contract address by clicking "Add Consumer" button. 



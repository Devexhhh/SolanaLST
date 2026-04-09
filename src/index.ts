require('dotenv').config();
import express from 'express';
import { mintTokens } from './mintTokens';
import { PUBLIC_KEY } from './address';

const app = express();

const HELIUS_RESPONSE = {
    "nativeTransfers": [{
        "amount": 10000000,
        "fromUserAccount": PUBLIC_KEY,
        "toUserAccount": "8qQpyV2QM6yAibazX219h1ia8WQ1TEsmcKJ9ZbFGQcMz"
    }]
}

const VAULT = "8qQpyV2QM6yAibazX219h1ia8WQ1TEsmcKJ9ZbFGQcMz"

app.post('/helius', async (req, res) => {
    const incomingTx = HELIUS_RESPONSE.nativeTransfers.find(x => x.toUserAccount === VAULT);
    if (!incomingTx) {
        res.json({ message: "processed" })
        return
    }

    const fromAddress = incomingTx.fromUserAccount;
    const toAddress = VAULT;
    const amount = incomingTx.amount;
    const type = "received_native_sol";
    await mintTokens(fromAddress, amount);

    // if (type === "received_native_sol") {
    // } else {
    //     // What could go wrong here?
    //     await burnTokens(fromAddress, toAddress, amount);
    //     await sendNativeTokens(fromAddress, toAddress, amount);
    // }

    res.send('Transaction successful');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
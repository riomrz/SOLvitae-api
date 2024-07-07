const express = require('express');
const router = express.Router();
const { createMintAccount } = require('../utils/tokenUtils.js');

// create NFT representing the user CV
router.get('/user/createcv', (req, res) => {
    console.log("creating CV")
    // create a new wallet, obtain lamports, create NFT collection and mint NFT of the CV

    // TODO: call token utils

    return res.send('CV created')
});

// add metadata to the NFT of the CV
router.get('/user/addJob', (req, res) => {
    console.log("adding new job")
    // add metadata to the NFT

    return res.send('Job added')
});

module.exports = router;
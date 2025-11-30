# Subscrybe Smart Contract Deployment Guide

## Prerequisites

### 1. Install Nix
```bash
curl -L https://nixos.org/nix/install | sh
```

### 2. Install Cardano Node & CLI
```bash
# Download latest release
wget https://github.com/input-output-hk/cardano-node/releases/download/8.7.2/cardano-node-8.7.2-linux.tar.gz
tar -xzf cardano-node-8.7.2-linux.tar.gz
sudo mv cardano-node cardano-cli /usr/local/bin/
```

### 3. Setup Plutus Development Environment
```bash
git clone https://github.com/input-output-hk/plutus-apps
cd plutus-apps
nix-shell
```

## Build Contract

### 1. Compile the Contract
```bash
cd subscrybe-demo/contracts
cabal clean
cabal build
cabal run subscription-vault-cli
```

This generates `subscription-vault.plutus` file.

### 2. Run Tests
```bash
cabal test
```

## Deploy to Testnet

### 1. Setup Testnet Environment
```bash
export CARDANO_NODE_SOCKET_PATH="$HOME/cardano/testnet/node.socket"
export TESTNET_MAGIC=1  # Preview testnet
```

### 2. Create Payment Keys
```bash
cardano-cli address key-gen \
  --verification-key-file payment.vkey \
  --signing-key-file payment.skey

cardano-cli address build \
  --payment-verification-key-file payment.vkey \
  --out-file payment.addr \
  --testnet-magic 1
```

### 3. Fund Your Address
Get test ADA from faucet:
```bash
# Preview testnet faucet
https://docs.cardano.org/cardano-testnet/tools/faucet/
```

### 4. Create Script Address
```bash
cardano-cli address build \
  --payment-script-file subscription-vault.plutus \
  --out-file script.addr \
  --testnet-magic 1
```

### 5. Lock Funds in Contract
```bash
# Create datum
cat > datum.json << EOF
{
  "constructor": 0,
  "fields": [
    {"bytes": "SUBSCRIBER_PKH"},
    {"bytes": "MERCHANT_PKH"},
    {"int": 10000000},
    {"int": 2592000000},
    {"int": 0},
    {"constructor": 1, "fields": []}
  ]
}
EOF

# Build transaction
cardano-cli transaction build \
  --tx-in <YOUR_UTXO> \
  --tx-out $(cat script.addr)+50000000 \
  --tx-out-datum-hash-file datum.json \
  --change-address $(cat payment.addr) \
  --testnet-magic 1 \
  --out-file tx.raw

# Sign transaction
cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment.skey \
  --testnet-magic 1 \
  --out-file tx.signed

# Submit transaction
cardano-cli transaction submit \
  --tx-file tx.signed \
  --testnet-magic 1
```

### 6. Process Payment (Redeem from Contract)
```bash
# Create redeemer
cat > redeemer.json << EOF
{
  "constructor": 0,
  "fields": []
}
EOF

# Build transaction
cardano-cli transaction build \
  --tx-in <SCRIPT_UTXO> \
  --tx-in-script-file subscription-vault.plutus \
  --tx-in-datum-file datum.json \
  --tx-in-redeemer-file redeemer.json \
  --tx-in-collateral <COLLATERAL_UTXO> \
  --tx-out <MERCHANT_ADDRESS>+10000000 \
  --change-address $(cat payment.addr) \
  --testnet-magic 1 \
  --protocol-params-file protocol.json \
  --out-file tx.raw

# Sign and submit
cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment.skey \
  --testnet-magic 1 \
  --out-file tx.signed

cardano-cli transaction submit \
  --tx-file tx.signed \
  --testnet-magic 1
```

## Deploy to Mainnet

⚠️ **WARNING**: Deploying to mainnet requires real ADA. Ensure thorough testing on testnet first.

Same steps as testnet, but use:
```bash
export TESTNET_MAGIC=--mainnet
```

## Verify Deployment

### Check Script Address Balance
```bash
cardano-cli query utxo \
  --address $(cat script.addr) \
  --testnet-magic 1
```

### View Transaction on Explorer
- Testnet: https://preview.cardanoscan.io/
- Mainnet: https://cardanoscan.io/

## Troubleshooting

### Error: "Script failed"
- Check datum format matches contract expectations
- Verify redeemer is correct for the action
- Ensure sufficient collateral (5 ADA minimum)

### Error: "Insufficient funds"
- Check wallet balance
- Ensure script UTXO has enough ADA

### Error: "Invalid script"
- Recompile contract with correct Plutus version
- Verify script hash matches

## Security Checklist

- [ ] Contract audited by security firm
- [ ] All tests passing
- [ ] Tested on testnet extensively
- [ ] Collateral wallet funded
- [ ] Emergency pause mechanism tested
- [ ] Monitoring alerts configured

## Support

- Documentation: https://docs.subscrybe.io
- Discord: https://discord.gg/subscrybe
- Email: contracts@subscrybe.io

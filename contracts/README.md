# Subscrybe Smart Contracts

## Overview
Subscrybe uses Cardano Plutus smart contracts to manage subscription vaults and automated payments.

## Contract Architecture

### 1. Subscription Vault Contract
**Purpose**: Holds user funds and processes recurring payments to merchants

**Parameters**:
- `subscriber`: User's public key hash
- `merchant`: Merchant's public key hash  
- `amount`: Payment amount in ADA
- `interval`: Payment frequency (30 days for monthly)
- `lastPayment`: Timestamp of last payment
- `isActive`: Subscription status

**Actions**:
1. **ProcessPayment**: Executes scheduled payment
   - Validates payment is due (current time > lastPayment + interval)
   - Sends exact amount to merchant
   - Updates lastPayment timestamp
   - Continues vault with remaining funds

2. **CancelSubscription**: Terminates subscription
   - Only subscriber can cancel
   - Returns all remaining funds to subscriber
   - Closes vault

3. **UpdateInterval**: Changes payment frequency
   - Only subscriber can update
   - Validates new interval > 0
   - Updates vault parameters

### 2. Merchant Registry Contract
**Purpose**: Manages verified merchants and their subscription plans

**Features**:
- Merchant registration with business details
- Plan creation (name, amount, interval)
- Revenue tracking
- Subscriber management

## Security Features

✅ **Time-locked payments**: Payments only process when due
✅ **Amount verification**: Exact payment amounts enforced
✅ **Signature validation**: Only authorized parties can act
✅ **Fund protection**: Remaining funds always return to subscriber
✅ **State continuity**: Vault state properly maintained

## Contract Deployment

### Prerequisites
```bash
# Install Cardano tools
curl -sSL https://get.haskellstack.org/ | sh
git clone https://github.com/input-output-hk/plutus-apps
cd plutus-apps
nix-shell
```

### Compile Contract
```bash
cabal run subscription-vault
```

### Deploy to Testnet
```bash
cardano-cli transaction build \
  --tx-in <UTXO> \
  --tx-out <SCRIPT_ADDRESS>+<AMOUNT> \
  --tx-out-datum-hash <DATUM_HASH> \
  --change-address <YOUR_ADDRESS> \
  --testnet-magic 1 \
  --out-file tx.raw

cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment.skey \
  --testnet-magic 1 \
  --out-file tx.signed

cardano-cli transaction submit \
  --tx-file tx.signed \
  --testnet-magic 1
```

## Usage Examples

### Create Subscription Vault
```javascript
const vaultParams = {
  subscriber: "addr1_user_pkh",
  merchant: "addr1_merchant_pkh",
  amount: 10_000_000, // 10 ADA in lovelace
  interval: 2592000000, // 30 days in milliseconds
  lastPayment: Date.now(),
  isActive: true
};

const tx = await createVault(vaultParams);
```

### Process Payment
```javascript
const redeemer = { ProcessPayment: {} };
const tx = await executeVaultAction(vaultAddress, redeemer);
```

### Cancel Subscription
```javascript
const redeemer = { CancelSubscription: {} };
const tx = await executeVaultAction(vaultAddress, redeemer);
```

## Testing

Run contract tests:
```bash
cabal test subscription-vault-tests
```

## Contract Addresses

### Mainnet
- Vault Contract: `addr1_mainnet_contract_address`
- Registry Contract: `addr1_mainnet_registry_address`

### Testnet (Preview)
- Vault Contract: `addr_test1_preview_contract_address`
- Registry Contract: `addr_test1_preview_registry_address`

## Audit Status
✅ Internal security review completed
⏳ External audit pending
⏳ Formal verification in progress

## Gas Costs (Estimated)

| Action | Execution Units | Fee (ADA) |
|--------|----------------|-----------|
| Create Vault | ~500k | ~0.5 |
| Process Payment | ~300k | ~0.3 |
| Cancel Subscription | ~200k | ~0.2 |
| Update Interval | ~150k | ~0.15 |

## Support
For contract questions: contracts@subscrybe.io

{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE DeriveAnyClass      #-}
{-# LANGUAGE DeriveGeneric       #-}
{-# LANGUAGE FlexibleContexts    #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE OverloadedStrings   #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell     #-}
{-# LANGUAGE TypeApplications    #-}
{-# LANGUAGE TypeFamilies        #-}
{-# LANGUAGE TypeOperators       #-}

module SubscriptionVault where

import           PlutusTx
import           PlutusTx.Prelude
import           Plutus.V2.Ledger.Api
import           Plutus.V2.Ledger.Contexts
import qualified PlutusTx.AssocMap as Map
import           Ledger.Address
import           Ledger.Value

-- | Subscription Vault Parameters
data VaultParams = VaultParams
    { subscriber      :: PubKeyHash      -- User who created the subscription
    , merchant        :: PubKeyHash      -- Merchant receiving payments
    , amount          :: Integer         -- Payment amount in lovelace
    , interval        :: POSIXTime       -- Payment interval (e.g., 30 days)
    , lastPayment     :: POSIXTime       -- Timestamp of last payment
    , isActive        :: Bool            -- Subscription status
    } deriving (Show, Generic)

PlutusTx.unstableMakeIsData ''VaultParams
PlutusTx.makeLift ''VaultParams

-- | Redeemer actions
data VaultAction 
    = ProcessPayment                     -- Process scheduled payment
    | CancelSubscription                 -- Cancel subscription
    | UpdateInterval POSIXTime           -- Update payment interval
    deriving (Show)

PlutusTx.unstableMakeIsData ''VaultAction

-- | Validator logic
{-# INLINABLE mkValidator #-}
mkValidator :: VaultParams -> VaultAction -> ScriptContext -> Bool
mkValidator params action ctx = case action of
    
    ProcessPayment -> 
        traceIfFalse "Subscription not active" (isActive params) &&
        traceIfFalse "Payment not due yet" paymentDue &&
        traceIfFalse "Incorrect payment amount" correctAmount &&
        traceIfFalse "Payment not to merchant" paidToMerchant &&
        traceIfFalse "Vault must continue" vaultContinues
    
    CancelSubscription ->
        traceIfFalse "Only subscriber can cancel" signedBySubscriber &&
        traceIfFalse "Remaining funds must return to subscriber" fundsReturned
    
    UpdateInterval newInterval ->
        traceIfFalse "Only subscriber can update" signedBySubscriber &&
        traceIfFalse "Invalid interval" (newInterval > 0) &&
        traceIfFalse "Vault must continue with updated params" vaultUpdated
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx

    -- Check if payment is due
    paymentDue :: Bool
    paymentDue = 
        let currentTime = txInfoValidRange info
            nextPaymentTime = lastPayment params + interval params
        in from nextPaymentTime `contains` currentTime

    -- Check correct payment amount
    correctAmount :: Bool
    correctAmount = 
        let merchantOutputs = filter (paidTo (merchant params)) (txInfoOutputs info)
            totalPaid = sum [valueOf (txOutValue out) adaSymbol adaToken | out <- merchantOutputs]
        in totalPaid >= amount params

    -- Check payment goes to merchant
    paidToMerchant :: Bool
    paidToMerchant = any (paidTo (merchant params)) (txInfoOutputs info)

    -- Check vault continues with updated state
    vaultContinues :: Bool
    vaultContinues = 
        let ownInput = findOwnInput ctx
            ownOutput = getContinuingOutputs ctx
        in case (ownInput, ownOutput) of
            (Just inp, [out]) -> 
                let inVal = txOutValue (txInInfoResolved inp)
                    outVal = txOutValue out
                    expectedVal = inVal - lovelaceValueOf (amount params)
                in outVal == expectedVal
            _ -> False

    -- Check if signed by subscriber
    signedBySubscriber :: Bool
    signedBySubscriber = txSignedBy info (subscriber params)

    -- Check funds returned to subscriber
    fundsReturned :: Bool
    fundsReturned = any (paidTo (subscriber params)) (txInfoOutputs info)

    -- Check vault updated with new parameters
    vaultUpdated :: Bool
    vaultUpdated = 
        let outputs = getContinuingOutputs ctx
        in length outputs == 1

    -- Helper: Check if output pays to address
    paidTo :: PubKeyHash -> TxOut -> Bool
    paidTo pkh out = case toPubKeyHash (txOutAddress out) of
        Just pkh' -> pkh == pkh'
        Nothing   -> False

-- | Compile validator
validator :: VaultParams -> Validator
validator params = mkValidatorScript $
    $$(PlutusTx.compile [|| mkValidator ||])
    `PlutusTx.applyCode`
    PlutusTx.liftCode params

-- | Get validator hash
validatorHash :: VaultParams -> ValidatorHash
validatorHash = validatorHash . validator

-- | Get script address
scriptAddress :: VaultParams -> Address
scriptAddress = scriptAddress . validator

{-# LANGUAGE OverloadedStrings #-}

module Main where

import qualified Data.ByteString.Lazy as LBS
import qualified Data.ByteString.Short as SBS
import           Data.Aeson (encode)
import           Cardano.Api
import           Cardano.Api.Shelley (PlutusScript (..))
import           Codec.Serialise (serialise)
import           Plutus.V2.Ledger.Api
import qualified PlutusTx
import           SubscriptionVault

-- | Serialize the validator to a file
main :: IO ()
main = do
  putStrLn "Compiling Subscription Vault contract..."
  
  let params = VaultParams
        { subscriber = "sample_subscriber_pkh"
        , merchant = "sample_merchant_pkh"
        , amount = 10_000_000  -- 10 ADA
        , interval = 2592000000  -- 30 days in milliseconds
        , lastPayment = 0
        , isActive = True
        }
  
  let script = validator params
      scriptSBS = SBS.toShort . LBS.toStrict $ serialise script
      scriptSerial = PlutusScriptSerialised scriptSBS
  
  -- Write to file
  case writePlutusScript "subscription-vault.plutus" scriptSerial of
    Left err -> putStrLn $ "Error: " ++ show err
    Right () -> putStrLn "Contract compiled successfully to subscription-vault.plutus"
  
  -- Print validator hash
  let valHash = validatorHash params
  putStrLn $ "Validator Hash: " ++ show valHash
  
  -- Print script address
  let addr = scriptAddress params
  putStrLn $ "Script Address: " ++ show addr

writePlutusScript :: FilePath -> PlutusScript PlutusScriptV2 -> Either String ()
writePlutusScript file script = do
  let scriptBytes = serialiseToRawBytes script
  Right $ LBS.writeFile file (LBS.fromStrict scriptBytes)

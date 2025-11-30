-- Subscrybe Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  balance DECIMAL(20, 6) DEFAULT 0,
  joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  preferences JSONB DEFAULT '{"currency": "ADA", "notifications": true}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(20, 6) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ADA',
  interval VARCHAR(20) NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_payment_date DATE NOT NULL,
  vault_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(20, 6) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ADA',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  tx_hash VARCHAR(255),
  is_hydra_simulation BOOLEAN DEFAULT false,
  processing_time_ms INTEGER,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_subscription ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Insert sample data
INSERT INTO merchants (business_name, wallet_address, logo_url, description, website) VALUES
('Netflix', 'addr1merchant_netflix', 'https://logo.clearbit.com/netflix.com', 'Streaming service', 'https://netflix.com'),
('Spotify', 'addr1merchant_spotify', 'https://logo.clearbit.com/spotify.com', 'Music streaming', 'https://spotify.com'),
('Genius Yield', 'addr1merchant_geniusyield', 'https://logo.clearbit.com/geniusyield.co', 'DeFi protocol', 'https://geniusyield.co'),
('GitHub', 'addr1merchant_github', 'https://logo.clearbit.com/github.com', 'Code hosting', 'https://github.com'),
('Notion', 'addr1merchant_notion', 'https://logo.clearbit.com/notion.so', 'Productivity', 'https://notion.so')
ON CONFLICT (wallet_address) DO NOTHING;

-- Create subscription plans for merchants
INSERT INTO subscription_plans (merchant_id, name, description, amount, interval, category) 
SELECT 
  m.id,
  m.business_name || ' Premium',
  'Premium subscription for ' || m.business_name,
  CASE 
    WHEN m.business_name = 'Netflix' THEN 10
    WHEN m.business_name = 'Spotify' THEN 5
    WHEN m.business_name = 'Genius Yield' THEN 15
    WHEN m.business_name = 'GitHub' THEN 20
    WHEN m.business_name = 'Notion' THEN 8
  END,
  'monthly',
  CASE 
    WHEN m.business_name IN ('Netflix') THEN 'Entertainment'
    WHEN m.business_name IN ('Spotify') THEN 'Music'
    WHEN m.business_name IN ('Genius Yield') THEN 'DeFi'
    WHEN m.business_name IN ('GitHub') THEN 'Development'
    WHEN m.business_name IN ('Notion') THEN 'Productivity'
  END
FROM merchants m
ON CONFLICT DO NOTHING;

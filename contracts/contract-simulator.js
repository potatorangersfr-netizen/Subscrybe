/**
 * Subscrybe Smart Contract Simulator
 * Simulates contract validation logic without deploying to blockchain
 */

class SubscriptionVault {
  constructor(params) {
    this.subscriber = params.subscriber;
    this.merchant = params.merchant;
    this.amount = params.amount;
    this.interval = params.interval;
    this.lastPayment = params.lastPayment;
    this.isActive = params.isActive;
    this.balance = params.balance || 0;
  }

  /**
   * Validate and process a payment
   */
  processPayment(currentTime, signer) {
    const errors = [];

    // Check if subscription is active
    if (!this.isActive) {
      errors.push("Subscription not active");
    }

    // Check if payment is due
    const nextPaymentTime = this.lastPayment + this.interval;
    if (currentTime < nextPaymentTime) {
      errors.push(`Payment not due yet. Next payment: ${new Date(nextPaymentTime).toISOString()}`);
    }

    // Check if vault has sufficient balance
    if (this.balance < this.amount) {
      errors.push(`Insufficient balance. Required: ${this.amount}, Available: ${this.balance}`);
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
        trace: this.generateTrace('ProcessPayment', errors)
      };
    }

    // Execute payment
    this.balance -= this.amount;
    this.lastPayment = currentTime;

    return {
      success: true,
      newBalance: this.balance,
      paidAmount: this.amount,
      nextPayment: currentTime + this.interval,
      trace: this.generateTrace('ProcessPayment', [], {
        paidTo: this.merchant,
        amount: this.amount,
        newBalance: this.balance
      })
    };
  }

  /**
   * Cancel subscription and return funds
   */
  cancelSubscription(signer) {
    const errors = [];

    // Only subscriber can cancel
    if (signer !== this.subscriber) {
      errors.push("Only subscriber can cancel");
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
        trace: this.generateTrace('CancelSubscription', errors)
      };
    }

    const refundAmount = this.balance;
    this.balance = 0;
    this.isActive = false;

    return {
      success: true,
      refundAmount,
      refundedTo: this.subscriber,
      trace: this.generateTrace('CancelSubscription', [], {
        refundAmount,
        refundedTo: this.subscriber
      })
    };
  }

  /**
   * Update payment interval
   */
  updateInterval(newInterval, signer) {
    const errors = [];

    // Only subscriber can update
    if (signer !== this.subscriber) {
      errors.push("Only subscriber can update interval");
    }

    // Validate interval
    if (newInterval <= 0) {
      errors.push("Invalid interval. Must be greater than 0");
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
        trace: this.generateTrace('UpdateInterval', errors)
      };
    }

    const oldInterval = this.interval;
    this.interval = newInterval;

    return {
      success: true,
      oldInterval,
      newInterval,
      trace: this.generateTrace('UpdateInterval', [], {
        oldInterval,
        newInterval
      })
    };
  }

  /**
   * Generate execution trace
   */
  generateTrace(action, errors = [], details = {}) {
    return {
      action,
      timestamp: new Date().toISOString(),
      vaultState: {
        subscriber: this.subscriber,
        merchant: this.merchant,
        amount: this.amount,
        interval: this.interval,
        lastPayment: this.lastPayment,
        balance: this.balance,
        isActive: this.isActive
      },
      errors,
      details
    };
  }
}

// Example usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SubscriptionVault };
}

// Browser usage
if (typeof window !== 'undefined') {
  window.SubscriptionVault = SubscriptionVault;
}

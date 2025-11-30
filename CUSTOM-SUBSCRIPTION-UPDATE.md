# Custom Subscription Feature Update

## Changes Made

### 1. Add Subscription Modal - New Features
- **Date Field**: Added "Start Date" input to specify when the first payment was made
- **User Amount**: Now uses the exact amount you enter (e.g., 12 ADA stays 12 ADA, not converted)
- **Custom Subscriptions**: Creates custom subscriptions instead of using predefined plans

### 2. Backend API - New Endpoint
**POST /api/subscriptions/custom**
- Creates custom subscriptions with user-defined values
- Accepts: name, amount, interval, category, startDate
- Calculates next payment date based on start date and interval

### 3. Database Updates
- Added `createCustomSubscription()` function
- Stores custom subscriptions with fields:
  - customName
  - customAmount (exact user input)
  - customInterval
  - customCategory
  - startDate (when you first paid)
  - nextPaymentDate (calculated automatically)

### 4. Subscription Display
- Updated user subscriptions endpoint to handle both:
  - Plan-based subscriptions (Netflix, Spotify, etc.)
  - Custom subscriptions (your own entries)
- Shows exact amounts you entered

## How to Use

1. Click "Add Subscription" button
2. Enter merchant name (e.g., "My Custom Service")
3. Enter exact amount (e.g., 12.45 ADA)
4. Select start date (when you first paid)
5. Choose interval (monthly/yearly)
6. Select category
7. Click "Add Subscription"

The subscription will now show:
- Your exact amount (12.45 ADA, not converted)
- Start date you specified
- Next payment date (calculated from start date + interval)

## Example
If you add:
- Name: "Premium Tool"
- Amount: 12 ADA
- Start Date: 2024-01-15
- Interval: Monthly

It will display as 12 ADA (not 5 or any other amount) and calculate the next payment as 2024-02-15.

# 🧪 DEMO TEST CHECKLIST

## ✅ Pre-Test Setup
- [x] Frontend running on http://localhost:3000
- [x] Backend running on http://localhost:3001
- [ ] Browser DevTools open (F12) to check for errors

---

## 🎯 CRITICAL FEATURES TO TEST

### 1. Landing Page (/)
- [ ] Page loads without errors
- [ ] Welcome modal appears on first visit
- [ ] "Get Started" button works
- [ ] Animations are smooth
- [ ] GitHub link visible in header

### 2. Dashboard (/dashboard)
- [ ] Spending overview cards display correctly
- [ ] Spending chart renders
- [ ] Upcoming payments list shows
- [ ] All data loads from backend

### 3. Subscriptions (/subscriptions)
- [ ] Subscription cards display
- [ ] "Add Subscription" button opens modal
- [ ] Can add custom subscription
- [ ] Subscription appears in list
- [ ] Edit/Delete buttons work
- [ ] Transaction toast appears on actions

### 4. **HYDRA DEMO** (/hydra) - MOST IMPORTANT! 🚀
- [ ] Page loads with educational content
- [ ] "Why This Matters" section visible
- [ ] Cost breakdown shows (17 ADA vs 0.34 ADA)
- [ ] "Run Comparison Demo" button works
- [ ] **Hydra simulation completes in ~200ms**
- [ ] **L1 simulation takes ~18 seconds**
- [ ] Progress bars animate smoothly
- [ ] **Cardano-colored confetti appears** (blue/cyan)
- [ ] Metrics display correctly:
  - [ ] 90x faster
  - [ ] 98% cheaper
  - [ ] $10 saved per 100 payments
- [ ] Real-time processing times show
- [ ] Can run demo multiple times

### 5. Calendar (/calendar)
- [ ] Calendar view renders
- [ ] Payment dates marked
- [ ] Can navigate months
- [ ] Tooltips show payment details

### 6. Privacy (/privacy)
- [ ] Privacy features explained
- [ ] Zero-knowledge proof info
- [ ] Cardano integration details

### 7. Merchant Portal (/merchant)
- [ ] Merchant dashboard loads
- [ ] Analytics display
- [ ] Integration guides available

### 8. Smart Contracts (/contracts)
- [ ] Contract code displays
- [ ] Deployment info shows
- [ ] Simulator works (if implemented)

---

## 🎁 BONUS FEATURES TO TEST

### Bonus Pool #1: Accessibility ($5,000)
- [ ] Keyboard navigation works (Tab through elements)
- [ ] ARIA labels present (check DevTools)
- [ ] Focus indicators visible
- [ ] Screen reader friendly (test with NVDA/JAWS if available)

### Bonus Pool #2: Cardano Memes ($2,500)
- [ ] Try Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
- [ ] Meme popup appears
- [ ] Can cycle through memes
- [ ] Close button works
- [ ] Visit /memes-test page
- [ ] All memes load correctly

### Bonus Pool #3: Custom Subscriptions ($2,500)
- [ ] Add subscription with custom name
- [ ] Add subscription with custom amount
- [ ] Add subscription with custom interval
- [ ] Backend logs show custom subscription data
- [ ] Data persists in memory store

### Bonus Pool #4: Hydra Integration ($5,000)
- [ ] All Hydra demo tests above pass
- [ ] Educational content is clear
- [ ] Performance difference is dramatic
- [ ] Cost savings are obvious
- [ ] Confetti effect works

---

## 🐛 ERROR CHECKING

### Console Errors
- [ ] No JavaScript errors in browser console
- [ ] No React warnings
- [ ] No failed network requests

### Backend Logs
- [ ] No server errors
- [ ] API endpoints responding
- [ ] Custom subscription logging works

### Performance
- [ ] Pages load quickly (< 2 seconds)
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks (check DevTools Performance tab)

---

## 📱 RESPONSIVE TESTING (Optional)
- [ ] Test on mobile viewport (DevTools)
- [ ] Test on tablet viewport
- [ ] Sidebar collapses on mobile
- [ ] Touch interactions work

---

## 🎬 DEMO FLOW FOR JUDGES

**Recommended presentation order:**

1. **Start at Landing Page** (/)
   - Show welcome modal
   - Explain the problem Subscrybe solves

2. **Go to Dashboard** (/dashboard)
   - Show spending overview
   - Highlight upcoming payments

3. **Visit Subscriptions** (/subscriptions)
   - Add a custom subscription
   - Show transaction toast

4. **🌟 HYDRA DEMO** (/hydra) - THE SHOWSTOPPER!
   - Explain the micro-subscription problem
   - Run the comparison demo
   - Let them see the dramatic difference
   - Highlight the cost savings

5. **Show Calendar** (/calendar)
   - Visualize payment schedule

6. **Privacy Features** (/privacy)
   - Explain zero-knowledge proofs

7. **Easter Egg** (Konami Code)
   - Show Cardano memes for fun

---

## ✅ FINAL CHECKS

- [ ] All critical features work
- [ ] Hydra demo is impressive
- [ ] No console errors
- [ ] Backend is responding
- [ ] Ready for submission!

---

## 🚨 IF SOMETHING BREAKS

1. Check browser console for errors
2. Check backend logs: `getProcessOutput` for process 14
3. Check frontend logs: `getProcessOutput` for process 4
4. Restart servers if needed
5. Clear browser cache and reload

---

**Status**: Ready to test! 🚀
**Next Step**: Open http://localhost:3000 and start checking items off this list!

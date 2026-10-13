# XAU AI Scalper v15.3 — Demo/Paper Trading Starter

This starter project is based on the uploaded PDF's Pine Script idea:
EMA fast/slow (5/20), RSI(14), Heikin Ashi direction, FVG, liquidity sweep, and basic Order Block patterns.

## Important limits
- This is a **paper-trading prototype**, not a live trading bot and not financial advice.
- It does not connect to Finex, MT5, or a live price feed yet.
- The browser dashboard uses illustrative/demo candle data. Do not treat its signals or results as real-market performance.
- No APK is included as a prebuilt binary. The Android WebView project source is in `android/`; it must be built using Android tooling/CI.
- The PDF code's `indicator()` and `strategy()` declarations were combined, which is invalid in Pine Script. A corrected standalone strategy example is in `pine/SMC_Scalper_v15_3_strategy.pine`.

## Quick test on a phone
1. Upload the contents of this folder to a GitHub repository.
2. Open `index.html` in a browser, or enable GitHub Pages:
   - Repository → Settings → Pages
   - Deploy from branch → `main` → `/ (root)` → Save
3. Open the published Pages URL on your Android phone.
4. Tap **Start paper session**. The sample data is synthetic and labelled as demo.

## Android source
`android/` contains a basic Android WebView shell loading the local `index.html`.
To create an APK, use Android Studio or a GitHub Actions Android build workflow. Building entirely on a phone can be constrained by memory; GitHub Actions is the recommended build route.

## Next integration steps
1. Replace synthetic candles with a documented, permitted quote source.
2. Confirm Finex symbol naming, digits, pip/point convention, spread, and contract size.
3. Validate signal logic and stop sizing on historical M1 data.
4. Add robust paper-trade accounting and walk-forward testing.
5. Only consider broker/MT5 execution after demo validation and explicit review.

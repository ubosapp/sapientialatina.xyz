# Sapientia Latina

A simple web app for discovering and exploring famous Latin quotes.

## Deployment on Vercel

This project is configured for deployment on Vercel, but requires a specific manual configuration in the Vercel Dashboard to work correctly. This is due to Vercel's automatic framework detection.

**IMPORTANT:** To deploy this project successfully, you must set the "Framework Preset" in your Vercel project settings.

1.  Navigate to your project in the Vercel Dashboard.
2.  Go to **Settings > General**.
3.  Under the **Build & Development Settings** section:
    *   Set **Framework Preset** to **Other**.
    *   Ensure the **Build Command** input field is **EMPTY**. Vercel will then correctly fall back to using the `build` script defined in `package.json`.
4.  Click **Save**.
5.  Go to the **Deployments** tab and **Redeploy** your latest commit to apply the new settings.

These settings will prevent Vercel from incorrectly identifying the project as "Vite" and will ensure the serverless function and static files are deployed correctly.
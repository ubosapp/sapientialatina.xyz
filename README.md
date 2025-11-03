# Sapientia Latina

A simple web app for discovering and exploring famous Latin quotes.

## Deployment on Vercel

This project is configured for a streamlined deployment on Vercel. It uses a minimal build script defined in `package.json` to create a `public` output directory, which Vercel automatically serves.

**Deployment Instructions:**

For the most reliable deployment, it's recommended to give Vercel a hint about the project structure.

1.  Navigate to your project in the Vercel Dashboard.
2.  Go to **Settings > General**.
3.  Under the **Build & Development Settings** section:
    *   Set **Framework Preset** to **Other**.
4.  Click **Save**.
5.  Go to the **Deployments** tab and **Redeploy** your latest commit.

The `vercel.json` and `package.json` files are configured to handle the rest automatically. This setup prevents Vercel from incorrectly identifying the project as "Vite" and ensures a successful build.

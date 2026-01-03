# Environment Configuration

## Demo Mode Setup

This application runs in **demo mode** by default, using browser localStorage for all data storage. No external services or databases are required.

## Local Development

No environment variables are required for local development. The app will work out of the box.

Optional variables (for AI features):
- `GEMINI_API_KEY` - For AI demo features (optional)
- `CLAUDE_API_KEY` - For Auto Claude sync (optional)

## Vercel Deployment

For Vercel deployment, no environment variables are required for basic demo functionality.

### Optional Environment Variables

If you want to enable AI features:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `GEMINI_API_KEY` (optional)
   - `CLAUDE_API_KEY` (optional)

### Build Configuration

The app is configured for Vercel:
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

### Health Check

After deployment, verify the app is running:
- Health endpoint: `https://your-domain.vercel.app/api/health`
- Should return: `{"status":"ok","timestamp":"...","environment":"production","version":"demo"}`

## Data Storage

**Important**: In demo mode, all data is stored in browser localStorage. This means:
- Data persists only in the user's browser
- Data is cleared when browser cache is cleared
- Each user/browser has independent data
- No server-side database required

For production, you would need to:
1. Set up a database (PostgreSQL, MongoDB, etc.)
2. Replace `lib/storage.ts` functions with API calls
3. Implement proper authentication
4. Configure Spree Commerce integration

## Troubleshooting

### Build Fails on Vercel
- Ensure `package.json` has all dependencies listed
- Check that Node.js version is compatible (18.x or 20.x)
- Verify no server-side localStorage usage in API routes

### Data Not Persisting
- This is expected in demo mode (localStorage only)
- For production, implement proper database storage

### API Routes Not Working
- All API routes use mock data from localStorage
- No external API calls are made in demo mode
- Check browser console for errors

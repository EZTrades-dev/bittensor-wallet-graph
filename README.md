# Bittensor Wallet Knowledge Graph

A modern, interactive knowledge graph visualization for Bittensor wallet transactions and account history, built with React and Cytoscape.js.

![Bittensor Wallet Knowledge Graph](https://img.shields.io/badge/Bittensor-Wallet%20Graph-00eaff?style=for-the-badge&logo=react)

## 🚀 Features

- **Interactive Knowledge Graph**: Visualize wallet connections and transaction history
- **Real-time Data Loading**: Load any Bittensor wallet address via Taostats API
- **Rate-limited API Integration**: Respects 5 requests/minute API limits
- **Block Timeline**: View wallet balance changes over time
- **Transfer Visualization**: See incoming/outgoing transactions between wallets
- **Modern UI**: Sleek, dark theme with smooth animations
- **Click-to-Copy**: Copy block numbers and wallet addresses with one click
- **Toggle Controls**: Show/hide blocks and wallet nodes
- **Demo Mode**: View sample wallet data without API key

## 🎯 Demo

The app includes demo data for wallet `5FZ3kzkS3t...` so you can explore the interface immediately without an API key.

## 🛠️ Setup (Step-by-Step Guide)

### Prerequisites

Before you begin, make sure you have the following installed on your computer:

1. **Node.js** (version 16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the "LTS" (Long Term Support) version
   - After installation, open a terminal/command prompt and type `node --version` to verify

2. **Git** (for downloading the project)
   - Download from [git-scm.com](https://git-scm.com/)
   - After installation, open a terminal and type `git --version` to verify

3. **A code editor** (optional but recommended)
   - Visual Studio Code: [code.visualstudio.com](https://code.visualstudio.com/)
   - Or any text editor you prefer

### Installation (Detailed Steps)

#### Step 1: Download the Project

1. **Open your terminal/command prompt**
   - **Windows**: Press `Win + R`, type `cmd`, press Enter
   - **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter
   - **Linux**: Press `Ctrl + Alt + T`

2. **Navigate to where you want to save the project**
   ```bash
   # Example: navigate to your Documents folder
   cd Documents
   ```

3. **Download the project**
   ```bash
   git clone https://github.com/EZTrades-dev/bittensor-wallet-graph.git
   ```

4. **Enter the project folder**
   ```bash
   cd bittensor-wallet-graph
   ```

#### Step 2: Install Dependencies

1. **Install the required packages**
   ```bash
   npm install
   ```
   
   This may take a few minutes. You'll see progress bars and package names being downloaded.

2. **Wait for completion**
   - You'll see a message like "added X packages" when it's done
   - If you see any warnings, that's normal

#### Step 3: Start the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Look for the success message**
   You should see something like:
   ```
   VITE v7.0.1  ready in 283 ms
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

3. **Open your web browser**
   - Go to `http://localhost:5173`
   - The app should load with the demo wallet data

## 🔑 API Configuration (Optional)

**Note**: You can use the app without an API key! The demo mode works immediately.

To load custom wallet data, follow these steps:

### Step 1: Get a Taostats API Key

1. **Visit Taostats.io**
   - Go to [taostats.io](https://taostats.io)
   - Look for "API" or "Get API Key" section
   - Sign up or log in to your account
   - Generate a new API key

2. **Copy your API key**
   - It will look something like: `tao-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx`

### Step 2: Add Your API Key to the App

1. **Open the project in your code editor**
   - If using VS Code: `code .` (in the project folder)
   - Or open the folder manually in your editor

2. **Find the API key file**
   - Navigate to `src/WalletLoader.jsx`
   - Look for line 3: `const API_KEY = "add your TAOSTATS API key";`

3. **Replace the placeholder**
   - Change it to: `const API_KEY = "your-actual-api-key-here";`
   - Save the file

4. **Restart the app** (if it's running)
   - Press `Ctrl + C` in the terminal to stop
   - Run `npm run dev` again

### Step 3: Load Custom Wallet Data

1. **Find the input box**
   - Look at the bottom-left corner of the app
   - You'll see "Load Another Wallet"

2. **Enter a wallet address**
   - Bittensor wallet addresses start with `5` and are about 48 characters long
   - Example: `5FZ3kzkS3t...`

3. **Choose loading options**
   - **Full data**: Leave "Skip block nodes" unchecked for complete history
   - **Fast loading**: Check "Skip block nodes" for wallet connections only

4. **Click "Load"**
   - Watch the progress bar at the bottom
   - The graph will update when loading is complete

## 📊 How to Use the App

### First Time Users

1. **Explore the demo** (no setup required)
   - The app loads with sample data automatically
   - Try clicking on different elements
   - Use the controls in the top-right corner

2. **Learn the interface**
   - **Header**: Shows the app title and social links
   - **Graph area**: The main visualization (center)
   - **Controls**: Top-right corner for toggling elements
   - **Legend**: Bottom-right corner explaining colors
   - **Wallet loader**: Bottom-left for loading new wallets

### Graph Controls (Top-Right)

- **Toggle Blocks**: Show/hide the timeline of balance changes
- **Toggle Wallets**: Show/hide connected wallet addresses
- **Reset View**: Double-click to reset zoom and position

### Graph Elements Explained

- **🔵 Blue Circle**: The main wallet you're viewing
- **⚪ White Dots**: Points in time when the wallet's balance was recorded
- **🟡 Yellow Circles**: Other wallets that sent/received TAO from your wallet
- **🔴 Red Arrows**: Money going OUT from your wallet (outgoing transfers)
- **🟢 Green Arrows**: Money coming IN to your wallet (incoming transfers)
- **🟣 Purple Arrows**: Large balance changes (more than 1% difference)

### Interactive Features

- **Zoom**: Use your mouse wheel to zoom in/out
- **Pan**: Click and drag to move around the graph
- **Copy data**: Click any node to copy its information
- **Hover**: Move your mouse over elements to see details

## 🚨 Troubleshooting

### Common Issues and Solutions

#### "Command not found: npm"
**Problem**: Node.js is not installed or not in your PATH
**Solution**: 
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Install it completely
3. Restart your terminal/command prompt
4. Try `npm --version` to verify

#### "Port 5173 is already in use"
**Problem**: Another app is using the same port
**Solution**:
1. Press `Ctrl + C` to stop the current server
2. Try a different port: `npm run dev -- --port 3000`
3. Or close other applications that might be using port 5173

#### "Cannot find module" errors
**Problem**: Dependencies not installed properly
**Solution**:
1. Delete the `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. Try `npm run dev`

#### "API key not working"
**Problem**: Invalid or expired API key
**Solution**:
1. Check your API key is correct in `src/WalletLoader.jsx`
2. Verify your Taostats account is active
3. Check if you've exceeded API limits
4. Try the demo mode first to ensure the app works

#### "Graph not loading"
**Problem**: Demo data not found or corrupted
**Solution**:
1. Check that `public/account_history_5FZ3kzkS3t.json` exists
2. Check that `public/transfers_5FZ3kzkS3t.json` exists
3. Try refreshing the browser page
4. Check browser console for errors (F12 → Console tab)

#### "Loading takes too long"
**Problem**: API rate limits or network issues
**Solution**:
1. Check "Skip block nodes" for faster loading
2. Wait a few minutes and try again (rate limit: 5 requests/minute)
3. Check your internet connection
4. Try with a different wallet address

### Getting Help

If you're still having issues:

1. **Check the browser console** (F12 → Console tab) for error messages
2. **Search existing issues** on the GitHub repository
3. **Create a new issue** with:
   - What you were trying to do
   - What error message you saw
   - Your operating system (Windows/Mac/Linux)
   - Your Node.js version (`node --version`)

## 🏗️ Project Structure (For Developers)

```
src/
├── App.jsx              # Main app component
├── WalletGraph.jsx      # Cytoscape.js graph visualization
├── WalletLoader.jsx     # API integration and data loading
├── Legend.jsx          # Graph legend and controls
└── GraphControls.jsx   # Toggle controls for graph elements
```

## 🔧 Technologies

- **React 18**: Modern React with hooks
- **Cytoscape.js**: Graph visualization library
- **Vite**: Fast build tool and dev server
- **Taostats API**: Bittensor blockchain data

## 📁 Project Structure

```
bittensor-wallet-graph/
├── public/
│   ├── account_history_5FZ3kzkS3t.json  # Demo account history
│   ├── transfers_5FZ3kzkS3t.json        # Demo transfer data
│   └── bg-tile.png                      # Header avatar
├── src/
│   ├── components/                      # React components
│   ├── App.jsx                          # Main app
│   └── main.jsx                         # Entry point
├── package.json                         # Dependencies
└── README.md                           # This file
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
1. Add to `package.json`:
```json
{
  "homepage": "https://EZTrades-dev.github.io/bittensor-wallet-graph",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Deploy:
```bash
npm run deploy
```

## 🔒 Security

- API keys are stored in client-side code (for demo purposes)
- In production, consider using environment variables
- The app respects API rate limits automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Taostats.io](https://taostats.io) for the Bittensor API
- [Cytoscape.js](https://cytoscape.org/) for graph visualization
- [E_Z_Trades](https://x.com/E_Z_Trades) for inspiration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/EZTrades-dev/bittensor-wallet-graph/issues)
- **Discussions**: [GitHub Discussions](https://github.com/EZTrades-dev/bittensor-wallet-graph/discussions)

---

**Built with ❤️ for the Bittensor community** 
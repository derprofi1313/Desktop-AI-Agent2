#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

/**
 * Ollama Installation Script for Desktop AI Agent
 */

const platform = os.platform();
const arch = os.arch();

console.log('🤖 Desktop AI Agent - Ollama Installation');
console.log('==========================================');
console.log(`Detected Platform: ${platform} (${arch})`);
console.log('');

function checkOllamaInstalled() {
  try {
    execSync('ollama --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function installOllamaWindows() {
  console.log('📦 Installing Ollama for Windows...');
  console.log('');
  console.log('Please follow these steps:');
  console.log('1. Visit https://ollama.ai');
  console.log('2. Download the Windows installer');
  console.log('3. Run the installer as Administrator');
  console.log('4. After installation, run this script again');
  console.log('');
  process.exit(0);
}

function installOllamaMacOS() {
  console.log('📦 Installing Ollama for macOS...');
  console.log('');
  console.log('Please follow these steps:');
  console.log('1. Visit https://ollama.ai');
  console.log('2. Download the macOS version');
  console.log('3. Open the .dmg file and drag Ollama to Applications');
  console.log('4. Run this script again');
  console.log('');
  process.exit(0);
}

function installOllamaLinux() {
  console.log('📦 Installing Ollama for Linux...');
  try {
    console.log('Running installation script...');
    execSync('curl -fsSL https://ollama.ai/install.sh | sh', { stdio: 'inherit' });
    console.log('✅ Ollama installed successfully!');
  } catch (error) {
    console.error('❌ Failed to install Ollama automatically.');
    console.log('Please install manually:');
    console.log('1. Visit https://ollama.ai');
    console.log('2. Follow the Linux installation instructions');
    process.exit(1);
  }
}

function startOllama() {
  console.log('🚀 Starting Ollama service...');
  
  if (platform === 'win32') {
    console.log('Ollama should start automatically on Windows.');
    console.log('Check your system tray for the Ollama icon.');
  } else {
    try {
      // Start Ollama in background
      const ollamaProcess = spawn('ollama', ['serve'], {
        detached: true,
        stdio: 'ignore'
      });
      ollamaProcess.unref();
      console.log('✅ Ollama service started!');
    } catch (error) {
      console.log('⚠️  Please start Ollama manually: ollama serve');
    }
  }
}

async function checkOllamaService() {
  console.log('🔍 Checking Ollama service...');
  
  const axios = require('axios');
  
  try {
    await axios.get('http://localhost:11434/api/tags', { timeout: 5000 });
    console.log('✅ Ollama service is running!');
    return true;
  } catch (error) {
    console.log('❌ Ollama service is not responding.');
    return false;
  }
}

function pullModel(modelName = 'llama3.2') {
  console.log(`📥 Pulling model: ${modelName}...`);
  console.log('This may take several minutes depending on your internet connection.');
  
  try {
    execSync(`ollama pull ${modelName}`, { stdio: 'inherit' });
    console.log(`✅ Model ${modelName} pulled successfully!`);
  } catch (error) {
    console.error(`❌ Failed to pull model ${modelName}:`, error.message);
    throw error;
  }
}

function createEnvFile() {
  const envContent = `# Ollama Configuration for Desktop AI Agent
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
`;
  
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with Ollama configuration');
  }
}

async function main() {
  try {
    // Check if Ollama is already installed
    if (checkOllamaInstalled()) {
      console.log('✅ Ollama is already installed!');
    } else {
      console.log('❌ Ollama not found. Installing...');
      
      switch (platform) {
        case 'win32':
          installOllamaWindows();
          break;
        case 'darwin':
          installOllamaMacOS();
          break;
        case 'linux':
          installOllamaLinux();
          break;
        default:
          console.error(`Unsupported platform: ${platform}`);
          process.exit(1);
      }
    }
    
    // Start Ollama service
    startOllama();
    
    // Wait a moment for service to start
    console.log('⏳ Waiting for Ollama service to start...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if service is running
    const serviceRunning = await checkOllamaService();
    if (!serviceRunning) {
      console.log('⚠️  Please start Ollama manually and run this script again.');
      process.exit(1);
    }
    
    // Pull the default model
    console.log('');
    pullModel('llama3.2');
    
    // Create environment file
    createEnvFile();
    
    console.log('');
    console.log('🎉 Ollama setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run `npm run dev` to start the Desktop AI Agent');
    console.log('2. Open your browser and interact with the AI agent');
    console.log('3. Check docs/OLLAMA_SETUP.md for more information');
    console.log('');
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.log('');
    console.log('For manual installation, please check:');
    console.log('- docs/OLLAMA_SETUP.md');
    console.log('- https://ollama.ai');
    process.exit(1);
  }
}

// Run the installer
main();
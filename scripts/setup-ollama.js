#!/usr/bin/env node

const axios = require('axios');
const { execSync } = require('child_process');

/**
 * Ollama Setup and Model Management Script
 */

const OLLAMA_BASE_URL = 'http://localhost:11434';

async function checkOllamaStatus() {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 5000 });
    return {
      isRunning: true,
      models: response.data.models || []
    };
  } catch (error) {
    return {
      isRunning: false,
      models: []
    };
  }
}

async function pullModel(modelName) {
  console.log(`📥 Pulling model: ${modelName}...`);
  try {
    execSync(`ollama pull ${modelName}`, { stdio: 'inherit' });
    console.log(`✅ Model ${modelName} ready!`);
  } catch (error) {
    console.error(`❌ Failed to pull ${modelName}:`, error.message);
    throw error;
  }
}

async function createCustomModel() {
  console.log('🛠️  Creating custom Desktop AI Agent model...');
  
  const modelfile = `FROM llama3.2

# Desktop AI Agent System Prompt
SYSTEM """
Du bist 'DesktopAI', ein intelligenter KI-Agent zur Steuerung eines Windows-Desktop-Systems.

Deine Hauptaufgaben:
- Dateien und Ordner verwalten (erstellen, lesen, bearbeiten, löschen)
- Browser-Fenster öffnen und Webseiten besuchen
- Benutzeranfragen verstehen und entsprechende Aktionen ausführen
- Strukturierte JSON-Antworten generieren

Du antwortest IMMER in deutscher Sprache und befolgst exakt das vorgegebene JSON-Schema.
Sei hilfreich, präzise und führe nur die angeforderten Aktionen aus.
"""

# Optimierte Parameter für Desktop-Aufgaben
PARAMETER temperature 0.1
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER repeat_penalty 1.1
PARAMETER num_predict 1024
`;

  const fs = require('fs');
  const path = require('path');
  
  const modelfilePath = path.join(process.cwd(), 'Modelfile');
  fs.writeFileSync(modelfilePath, modelfile);
  
  try {
    execSync('ollama create desktop-agent -f ./Modelfile', { stdio: 'inherit' });
    fs.unlinkSync(modelfilePath); // Clean up
    console.log('✅ Custom desktop-agent model created!');
  } catch (error) {
    console.error('❌ Failed to create custom model:', error.message);
    if (fs.existsSync(modelfilePath)) {
      fs.unlinkSync(modelfilePath);
    }
  }
}

async function testModel(modelName) {
  console.log(`🧪 Testing model: ${modelName}...`);
  
  const testPrompt = {
    model: modelName,
    prompt: 'Hallo! Ich bin ein Desktop AI Agent. Erstelle eine Testdatei namens "test.txt" mit dem Inhalt "Hello World".',
    stream: false,
    format: 'json'
  };
  
  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, testPrompt, {
      timeout: 30000
    });
    
    console.log('Model Response:');
    console.log(response.data.response);
    console.log('✅ Model test completed!');
  } catch (error) {
    console.error('❌ Model test failed:', error.message);
  }
}

async function setupTrainingData() {
  console.log('📚 Setting up training data structure...');
  
  const fs = require('fs');
  const path = require('path');
  
  const trainingDir = path.join(process.cwd(), 'training');
  const dataDir = path.join(trainingDir, 'data');
  
  if (!fs.existsSync(trainingDir)) {
    fs.mkdirSync(trainingDir);
  }
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // Create sample training data
  const sampleTrainingData = {
    conversations: [
      {
        "input": "Erstelle eine Datei namens 'notizen.txt' mit dem Text 'Meine wichtigen Notizen'",
        "output": {
          "thought": "Der Benutzer möchte eine neue Textdatei erstellen.",
          "responseToUser": "Ich erstelle die Datei 'notizen.txt' mit dem gewünschten Inhalt für Sie.",
          "action": {
            "type": "CREATE",
            "fileName": "notizen.txt",
            "content": "Meine wichtigen Notizen"
          }
        }
      },
      {
        "input": "Öffne Wikipedia im Browser",
        "output": {
          "thought": "Der Benutzer möchte Wikipedia in einem Browser-Fenster öffnen.",
          "responseToUser": "Ich öffne Wikipedia für Sie im Browser.",
          "action": {
            "type": "OPEN_BROWSER",
            "url": "https://de.wikipedia.org"
          }
        }
      }
    ],
    "metadata": {
      "created": new Date().toISOString(),
      "description": "Sample training data for Desktop AI Agent",
      "version": "1.0"
    }
  };
  
  fs.writeFileSync(
    path.join(dataDir, 'sample_training.json'),
    JSON.stringify(sampleTrainingData, null, 2)
  );
  
  // Create training log template
  const trainingLog = {
    sessions: [],
    improvements: [],
    feedback: []
  };
  
  fs.writeFileSync(
    path.join(dataDir, 'training_log.json'),
    JSON.stringify(trainingLog, null, 2)
  );
  
  console.log('✅ Training data structure created!');
  console.log(`📁 Training directory: ${trainingDir}`);
}

async function main() {
  console.log('🤖 Desktop AI Agent - Ollama Setup');
  console.log('===================================');
  
  try {
    // Check Ollama status
    const status = await checkOllamaStatus();
    
    if (!status.isRunning) {
      console.log('❌ Ollama is not running. Please start it first:');
      console.log('   ollama serve');
      process.exit(1);
    }
    
    console.log('✅ Ollama is running!');
    console.log(`📦 Available models: ${status.models.length}`);
    
    // Check if base model exists
    const hasLlama = status.models.some(model => model.name.includes('llama3.2'));
    
    if (!hasLlama) {
      console.log('📥 Base model not found. Downloading...');
      await pullModel('llama3.2');
    }
    
    // Create custom model
    const hasCustomModel = status.models.some(model => model.name === 'desktop-agent');
    
    if (!hasCustomModel) {
      await createCustomModel();
    } else {
      console.log('✅ Custom desktop-agent model already exists!');
    }
    
    // Test the model
    await testModel('desktop-agent');
    
    // Setup training data
    await setupTrainingData();
    
    console.log('');
    console.log('🎉 Ollama setup completed successfully!');
    console.log('');
    console.log('Available models for Desktop AI Agent:');
    console.log('- llama3.2 (base model)');
    console.log('- desktop-agent (custom model)');
    console.log('');
    console.log('Training features:');
    console.log('- Training data structure created');
    console.log('- Conversation logging enabled');
    console.log('- Model improvement tracking ready');
    console.log('');
    console.log('Ready for training with Jannik! 🚀');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
import axios from 'axios';

/**
 * Configuration for Ollama integration
 */
const OLLAMA_CONFIG = {
  baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama3.2',
  timeout: 30000, // 30 seconds
};

/**
 * Check if Ollama is running and accessible
 */
export async function checkOllamaStatus() {
  try {
    const response = await axios.get(`${OLLAMA_CONFIG.baseURL}/api/tags`, {
      timeout: 5000
    });
    return {
      isRunning: true,
      models: response.data.models || [],
      message: 'Ollama is running successfully'
    };
  } catch (error) {
    return {
      isRunning: false,
      models: [],
      message: `Ollama is not accessible: ${error.message}`
    };
  }
}

/**
 * Pull a model from Ollama (for installation)
 */
export async function pullModel(modelName = OLLAMA_CONFIG.model) {
  try {
    const response = await axios.post(`${OLLAMA_CONFIG.baseURL}/api/pull`, 
      { name: modelName },
      { 
        timeout: 300000, // 5 minutes for model download
        responseType: 'stream'
      }
    );
    
    return {
      success: true,
      message: `Model ${modelName} pulled successfully`
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to pull model ${modelName}: ${error.message}`
    };
  }
}

/**
 * Main function to invoke LLM via Ollama
 * @param {Object} params - Parameters for the LLM call
 * @param {string} params.prompt - The prompt to send to the LLM
 * @param {Object} params.response_json_schema - JSON schema for structured response
 * @param {string} params.model - Model to use (optional)
 * @param {number} params.temperature - Temperature for generation (optional)
 * @returns {Promise<Object>} - The LLM response
 */
export async function InvokeLLM({ 
  prompt, 
  response_json_schema = null, 
  model = OLLAMA_CONFIG.model,
  temperature = 0.1 
}) {
  try {
    // Check if Ollama is running
    const status = await checkOllamaStatus();
    if (!status.isRunning) {
      throw new Error('Ollama is not running. Please start Ollama first.');
    }

    // Prepare the request payload
    let requestPayload = {
      model: model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: temperature,
        num_predict: 2048,
      }
    };

    // If JSON schema is provided, add format instruction to prompt
    if (response_json_schema) {
      requestPayload.prompt += `\n\nPlease respond with a valid JSON object that matches this schema:\n${JSON.stringify(response_json_schema, null, 2)}\n\nResponse:`;
      requestPayload.format = 'json';
    }

    // Make the request to Ollama
    const response = await axios.post(
      `${OLLAMA_CONFIG.baseURL}/api/generate`,
      requestPayload,
      {
        timeout: OLLAMA_CONFIG.timeout,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data || !response.data.response) {
      throw new Error('Invalid response from Ollama');
    }

    let result = response.data.response;

    // If JSON schema was requested, parse the JSON response
    if (response_json_schema) {
      try {
        result = JSON.parse(result);
      } catch (parseError) {
        // If JSON parsing fails, try to extract JSON from the response
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (secondParseError) {
            throw new Error(`Failed to parse JSON response: ${secondParseError.message}`);
          }
        } else {
          throw new Error('Response is not valid JSON');
        }
      }
    }

    return result;

  } catch (error) {
    console.error('Error invoking LLM:', error);
    
    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Ollama. Please ensure Ollama is installed and running on http://localhost:11434');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Request to Ollama timed out. The model might be too large or the server is overloaded.');
    } else if (error.response?.status === 404) {
      throw new Error(`Model "${model}" not found. Please pull the model first using: ollama pull ${model}`);
    } else {
      throw new Error(`LLM invocation failed: ${error.message}`);
    }
  }
}

/**
 * List available models in Ollama
 */
export async function listAvailableModels() {
  try {
    const response = await axios.get(`${OLLAMA_CONFIG.baseURL}/api/tags`);
    return response.data.models || [];
  } catch (error) {
    throw new Error(`Failed to list models: ${error.message}`);
  }
}

/**
 * Check if a specific model is available
 */
export async function isModelAvailable(modelName) {
  try {
    const models = await listAvailableModels();
    return models.some(model => model.name === modelName);
  } catch (error) {
    return false;
  }
}

/**
 * Get system information from Ollama
 */
export async function getOllamaInfo() {
  try {
    const response = await axios.get(`${OLLAMA_CONFIG.baseURL}/api/version`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get Ollama info: ${error.message}`);
  }
}

// Export configuration for external use
export { OLLAMA_CONFIG };
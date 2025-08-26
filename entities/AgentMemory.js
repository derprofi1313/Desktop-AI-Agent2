/**
 * AgentMemory Entity - Manages AI agent conversation memory
 * Stores chat history and agent interactions
 */

class AgentMemory {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.role = data.role; // 'user' or 'agent'
    this.content = data.content;
    this.action_details = data.action_details || null;
    this.created_date = data.created_date || new Date().toISOString();
    this.metadata = data.metadata || {};
  }

  // Simulate database storage using localStorage
  static getStorage() {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('agent_memory');
    return stored ? JSON.parse(stored) : this.getDefaultMemory();
  }

  static setStorage(memories) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('agent_memory', JSON.stringify(memories));
  }

  static getDefaultMemory() {
    return [
      {
        id: '1',
        role: 'agent',
        content: 'Hallo! Ich bin DesktopAI, Ihr intelligenter Desktop-Agent. Ich kann Ihnen bei der Verwaltung von Dateien, dem Öffnen von Webseiten und vielen anderen Desktop-Aufgaben helfen. Wie kann ich Ihnen heute behilflich sein?',
        created_date: new Date().toISOString(),
        metadata: { type: 'welcome_message' }
      }
    ];
  }

  // CRUD operations
  static async list(sortBy = '-created_date', limit = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let memories = this.getStorage().map(data => new AgentMemory(data));
        
        // Sort memories
        if (sortBy.startsWith('-')) {
          const field = sortBy.substring(1);
          memories.sort((a, b) => new Date(b[field]) - new Date(a[field]));
        } else {
          memories.sort((a, b) => new Date(a[sortBy]) - new Date(b[sortBy]));
        }
        
        if (limit) {
          memories = memories.slice(0, limit);
        }
        
        resolve(memories);
      }, 50); // Faster for chat
    });
  }

  static async create(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const memories = this.getStorage();
          const newMemory = new AgentMemory(data);
          memories.push(newMemory);
          
          // Keep only last 100 messages to prevent storage overflow
          if (memories.length > 100) {
            memories.splice(0, memories.length - 100);
          }
          
          this.setStorage(memories);
          resolve(newMemory);
        } catch (error) {
          reject(error);
        }
      }, 50);
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const memories = this.getStorage();
          const index = memories.findIndex(m => m.id === id);
          
          if (index === -1) {
            reject(new Error('Memory entry not found.'));
            return;
          }
          
          memories[index] = { ...memories[index], ...data };
          this.setStorage(memories);
          resolve(new AgentMemory(memories[index]));
        } catch (error) {
          reject(error);
        }
      }, 50);
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const memories = this.getStorage();
          const index = memories.findIndex(m => m.id === id);
          
          if (index === -1) {
            reject(new Error('Memory entry not found.'));
            return;
          }
          
          const deletedMemory = memories[index];
          memories.splice(index, 1);
          this.setStorage(memories);
          resolve(deletedMemory);
        } catch (error) {
          reject(error);
        }
      }, 50);
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const memories = this.getStorage();
        const memory = memories.find(m => m.id === id);
        
        if (!memory) {
          reject(new Error('Memory entry not found.'));
          return;
        }
        
        resolve(new AgentMemory(memory));
      }, 50);
    });
  }

  // Conversation management
  static async getRecentConversation(limit = 20) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memories = this.getStorage()
          .map(data => new AgentMemory(data))
          .sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
          .slice(-limit);
        resolve(memories);
      }, 50);
    });
  }

  static async getConversationByDateRange(startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memories = this.getStorage()
          .map(data => new AgentMemory(data))
          .filter(m => {
            const date = new Date(m.created_date);
            return date >= startDate && date <= endDate;
          });
        resolve(memories);
      }, 50);
    });
  }

  static async searchByContent(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memories = this.getStorage()
          .map(data => new AgentMemory(data))
          .filter(m => m.content.toLowerCase().includes(query.toLowerCase()));
        resolve(memories);
      }, 100);
    });
  }

  static async getActionHistory() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memories = this.getStorage()
          .map(data => new AgentMemory(data))
          .filter(m => m.action_details)
          .map(m => ({
            ...m,
            action: JSON.parse(m.action_details)
          }));
        resolve(memories);
      }, 100);
    });
  }

  // Training and analytics
  static async getTrainingData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memories = this.getStorage();
        const conversations = [];
        
        for (let i = 0; i < memories.length - 1; i++) {
          const current = memories[i];
          const next = memories[i + 1];
          
          if (current.role === 'user' && next.role === 'agent') {
            conversations.push({
              input: current.content,
              output: next.content,
              action: next.action_details ? JSON.parse(next.action_details) : null,
              timestamp: current.created_date
            });
          }
        }
        
        resolve(conversations);
      }, 200);
    });
  }

  static async exportTrainingData() {
    return new Promise(async (resolve) => {
      const trainingData = await this.getTrainingData();
      const exportData = {
        conversations: trainingData,
        metadata: {
          exported_at: new Date().toISOString(),
          total_conversations: trainingData.length,
          version: '1.0'
        }
      };
      resolve(exportData);
    });
  }

  // Utility methods
  static async clearAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setStorage([]);
        resolve(true);
      }, 50);
    });
  }

  static async resetToDefaults() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setStorage(this.getDefaultMemory());
        resolve(true);
      }, 50);
    });
  }

  static async getStatistics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memories = this.getStorage();
        const userMessages = memories.filter(m => m.role === 'user').length;
        const agentMessages = memories.filter(m => m.role === 'agent').length;
        const actionsPerformed = memories.filter(m => m.action_details).length;
        
        resolve({
          totalMessages: memories.length,
          userMessages,
          agentMessages,
          actionsPerformed,
          lastActivity: memories.length > 0 ? memories[memories.length - 1].created_date : null
        });
      }, 100);
    });
  }
}

export { AgentMemory };
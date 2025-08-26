/**
 * DesktopFile Entity - Manages desktop files and applications
 * Simulates a backend storage for desktop items
 */

class DesktopFile {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.name = data.name;
    this.content = data.content || '';
    this.type = data.type || 'txt';
    this.icon = data.icon || this.getDefaultIcon();
    this.created_date = data.created_date || new Date().toISOString();
    this.updated_date = data.updated_date || new Date().toISOString();
  }

  getDefaultIcon() {
    const iconMap = {
      txt: 'FileText',
      md: 'FileCode',
      log: 'FileWarning',
      app: 'Globe'
    };
    return iconMap[this.type] || 'FileText';
  }

  // Simulate database storage using localStorage
  static getStorage() {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('desktop_files');
    return stored ? JSON.parse(stored) : this.getDefaultFiles();
  }

  static setStorage(files) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('desktop_files', JSON.stringify(files));
  }

  static getDefaultFiles() {
    return [
      {
        id: '1',
        name: 'Welcome.txt',
        content: 'Willkommen beim Desktop AI Agent!\n\nDieser intelligente Agent kann:\n- Dateien erstellen und bearbeiten\n- Browser-Fenster öffnen\n- Desktop-Aufgaben automatisieren\n\nViel Spaß beim Testen!',
        type: 'txt',
        created_date: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Browser',
        content: 'Web-Browser für die Internetnutzung',
        type: 'app',
        created_date: new Date().toISOString()
      },
      {
        id: '3',
        name: 'README.md',
        content: '# Desktop AI Agent\n\n## Features\n- Intelligent desktop control\n- File management\n- Web browsing\n- Natural language commands\n\n## Usage\nChat with the AI agent to control your desktop!',
        type: 'md',
        created_date: new Date().toISOString()
      }
    ];
  }

  // CRUD operations
  static async list(sortBy = '-created_date', limit = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let files = this.getStorage().map(data => new DesktopFile(data));
        
        // Sort files
        if (sortBy.startsWith('-')) {
          const field = sortBy.substring(1);
          files.sort((a, b) => new Date(b[field]) - new Date(a[field]));
        } else {
          files.sort((a, b) => new Date(a[sortBy]) - new Date(b[sortBy]));
        }
        
        if (limit) {
          files = files.slice(0, limit);
        }
        
        resolve(files);
      }, 100); // Simulate network delay
    });
  }

  static async create(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const files = this.getStorage();
          
          // Check for duplicate names
          if (files.find(f => f.name.toLowerCase() === data.name.toLowerCase())) {
            reject(new Error(`Eine Datei mit dem Namen "${data.name}" existiert bereits.`));
            return;
          }
          
          const newFile = new DesktopFile(data);
          files.push(newFile);
          this.setStorage(files);
          resolve(newFile);
        } catch (error) {
          reject(error);
        }
      }, 200);
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const files = this.getStorage();
          const index = files.findIndex(f => f.id === id);
          
          if (index === -1) {
            reject(new Error('Datei nicht gefunden.'));
            return;
          }
          
          files[index] = { ...files[index], ...data, updated_date: new Date().toISOString() };
          this.setStorage(files);
          resolve(new DesktopFile(files[index]));
        } catch (error) {
          reject(error);
        }
      }, 200);
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const files = this.getStorage();
          const index = files.findIndex(f => f.id === id);
          
          if (index === -1) {
            reject(new Error('Datei nicht gefunden.'));
            return;
          }
          
          const deletedFile = files[index];
          files.splice(index, 1);
          this.setStorage(files);
          resolve(deletedFile);
        } catch (error) {
          reject(error);
        }
      }, 200);
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const files = this.getStorage();
        const file = files.find(f => f.id === id);
        
        if (!file) {
          reject(new Error('Datei nicht gefunden.'));
          return;
        }
        
        resolve(new DesktopFile(file));
      }, 100);
    });
  }

  static async findByName(name) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const files = this.getStorage();
        const file = files.find(f => f.name.toLowerCase() === name.toLowerCase());
        resolve(file ? new DesktopFile(file) : null);
      }, 100);
    });
  }

  // Utility methods
  static async clearAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setStorage([]);
        resolve(true);
      }, 100);
    });
  }

  static async resetToDefaults() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setStorage(this.getDefaultFiles());
        resolve(true);
      }, 100);
    });
  }
}

export { DesktopFile };
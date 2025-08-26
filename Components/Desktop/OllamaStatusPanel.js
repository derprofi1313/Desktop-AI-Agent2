import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Settings, Download, Brain, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { checkOllamaStatus, listAvailableModels, pullModel, getOllamaInfo } from '../../integrations/Core.js';

export default function OllamaStatusPanel({ isOpen, onClose }) {
  const [status, setStatus] = useState({ isRunning: false, models: [], message: '' });
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pullProgress, setPullProgress] = useState(null);

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const [statusResult, infoResult] = await Promise.all([
        checkOllamaStatus(),
        getOllamaInfo().catch(() => null)
      ]);
      
      setStatus(statusResult);
      setSystemInfo(infoResult);
    } catch (error) {
      setStatus({ isRunning: false, models: [], message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePullModel = async (modelName) => {
    setPullProgress(modelName);
    try {
      await pullModel(modelName);
      await checkStatus(); // Refresh status
      setPullProgress(null);
    } catch (error) {
      console.error('Failed to pull model:', error);
      setPullProgress(null);
    }
  };

  const recommendedModels = [
    { name: 'llama3.2', description: 'Basis-Modell für Desktop-Aufgaben (3B)', size: '~2GB' },
    { name: 'llama3.2:7b', description: 'Erweiterte Version für bessere Leistung (7B)', size: '~4GB' },
    { name: 'mistral', description: 'Gut für deutsche Sprache', size: '~4GB' },
    { name: 'codellama', description: 'Spezialisiert auf Programmieraufgaben', size: '~7GB' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Ollama Status & Model Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">System Status</h3>
              <Button variant="outline" size="sm" onClick={checkStatus} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aktualisieren'}
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              {status.isRunning ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={status.isRunning ? 'text-green-400' : 'text-red-400'}>
                {status.isRunning ? 'Ollama läuft' : 'Ollama ist nicht verfügbar'}
              </span>
            </div>
            
            <p className="text-sm text-gray-400">{status.message}</p>
            
            {systemInfo && (
              <div className="mt-3 text-xs text-gray-500">
                Version: {systemInfo.version || 'Unbekannt'}
              </div>
            )}
          </div>

          {/* Installed Models */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Installierte Modelle ({status.models.length})</h3>
            {status.models.length > 0 ? (
              <div className="space-y-2">
                {status.models.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div>
                      <span className="font-medium">{model.name}</span>
                      <div className="text-xs text-gray-400">
                        Größe: {model.size ? `${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB` : 'Unbekannt'}
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Keine Modelle installiert</p>
            )}
          </div>

          {/* Recommended Models */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Empfohlene Modelle</h3>
            <div className="space-y-2">
              {recommendedModels.map((model) => {
                const isInstalled = status.models.some(m => m.name.includes(model.name));
                const isPulling = pullProgress === model.name;
                
                return (
                  <div key={model.name} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.name}</span>
                        {isInstalled && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-xs text-gray-400">{model.description}</p>
                      <p className="text-xs text-gray-500">{model.size}</p>
                    </div>
                    
                    {!isInstalled && (
                      <Button
                        size="sm"
                        onClick={() => handlePullModel(model.name)}
                        disabled={isPulling || !status.isRunning}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        {isPulling ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Lädt...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            Installieren
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Training Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Training & Verbesserung
            </h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>• Alle Konversationen werden automatisch gespeichert</p>
              <p>• Erfolgreiche Aktionen dienen als Trainingsbeispiele</p>
              <p>• Custom Model "desktop-agent" wird bei Setup erstellt</p>
              <p>• Training mit Jannik verbessert die Leistung kontinuierlich</p>
            </div>
          </div>

          {!status.isRunning && (
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-yellow-400">Setup erforderlich</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Ollama ist nicht verfügbar. Folgen Sie den Setup-Anweisungen:
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>1. npm run ollama:install</p>
                <p>2. npm run ollama:setup</p>
                <p>3. Dokumentation: docs/OLLAMA_SETUP.md</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
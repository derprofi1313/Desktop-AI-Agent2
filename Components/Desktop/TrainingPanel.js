import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Brain, Download, Upload, Trash2, BarChart3, MessageSquare, CheckCircle, X } from 'lucide-react';
import { AgentMemory } from '../../entities/AgentMemory.js';

export default function TrainingPanel({ isOpen, onClose }) {
  const [conversations, setConversations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedConversations, setSelectedConversations] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTrainingData();
      loadStatistics();
    }
  }, [isOpen]);

  const loadTrainingData = async () => {
    setLoading(true);
    try {
      const data = await AgentMemory.getTrainingData();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await AgentMemory.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const exportTrainingData = async () => {
    try {
      const exportData = await AgentMemory.exportTrainingData();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `desktop_ai_training_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export training data:', error);
    }
  };

  const clearAllMemory = async () => {
    if (window.confirm('Sind Sie sicher, dass Sie alle Konversationen löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      try {
        await AgentMemory.clearAll();
        await loadTrainingData();
        await loadStatistics();
      } catch (error) {
        console.error('Failed to clear memory:', error);
      }
    }
  };

  const toggleConversationSelection = (index) => {
    const newSelected = new Set(selectedConversations);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedConversations(newSelected);
  };

  const exportSelectedConversations = () => {
    const selectedData = conversations.filter((_, index) => selectedConversations.has(index));
    const exportData = {
      conversations: selectedData,
      metadata: {
        exported_at: new Date().toISOString(),
        total_conversations: selectedData.length,
        selection: 'manual',
        version: '1.0'
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_training_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Training & Verbesserung für Jannik
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Statistics */}
          {statistics && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Trainings-Statistiken
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{statistics.totalMessages}</div>
                  <div className="text-xs text-gray-400">Nachrichten</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{statistics.actionsPerformed}</div>
                  <div className="text-xs text-gray-400">Aktionen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{conversations.length}</div>
                  <div className="text-xs text-gray-400">Gespräche</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedConversations.size}
                  </div>
                  <div className="text-xs text-gray-400">Ausgewählt</div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={exportTrainingData}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Alle Exportieren
              </Button>
              
              {selectedConversations.size > 0 && (
                <Button
                  onClick={exportSelectedConversations}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Auswahl Exportieren ({selectedConversations.size})
                </Button>
              )}

              <Button
                onClick={() => setSelectedConversations(new Set())}
                variant="outline"
                className="border-gray-600"
                disabled={selectedConversations.size === 0}
              >
                Auswahl Löschen
              </Button>

              <Button
                onClick={clearAllMemory}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600/20 ml-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Alles Löschen
              </Button>
            </div>
          </div>

          {/* Training Instructions for Jannik */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-blue-400">Anweisungen für Jannik</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>1. Qualitätskontrolle:</strong> Überprüfen Sie die Konversationen und wählen Sie die besten Beispiele aus.</p>
              <p><strong>2. Training-Export:</strong> Exportieren Sie erfolgreiche Dialoge für das Modell-Training.</p>
              <p><strong>3. Verbesserungen:</strong> Nutzen Sie schlechte Beispiele, um Schwächen zu identifizieren.</p>
              <p><strong>4. Custom Model:</strong> Verwenden Sie die Daten für Fine-tuning des "desktop-agent" Modells.</p>
              <p><strong>5. Iteration:</strong> Regelmäßige Überprüfung und Anpassung für kontinuierliche Verbesserung.</p>
            </div>
          </div>

          {/* Conversation List */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Trainingsdaten ({conversations.length} Gespräche)
            </h3>
            
            {loading ? (
              <div className="text-center py-8">Lade Trainingsdaten...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Noch keine Trainingsdaten verfügbar. Starten Sie Konversationen mit dem AI Agent.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {conversations.map((conv, index) => {
                  const isSelected = selectedConversations.has(index);
                  const hasAction = conv.action && conv.action.type !== 'NONE';
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded border-2 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-cyan-500 bg-cyan-900/20' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => toggleConversationSelection(index)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <div className="w-4 h-4 border border-gray-500 rounded" />
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(conv.timestamp).toLocaleString()}
                          </span>
                          {hasAction && (
                            <span className="bg-green-600 text-xs px-2 py-1 rounded">
                              {conv.action.type}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-blue-400">User:</span>
                          <p className="text-gray-300 ml-2">{conv.input}</p>
                        </div>
                        <div>
                          <span className="text-cyan-400">Agent:</span>
                          <p className="text-gray-300 ml-2">{conv.output}</p>
                        </div>
                        {hasAction && (
                          <div className="text-xs text-gray-500 bg-gray-700 p-2 rounded">
                            <strong>Aktion:</strong> {JSON.stringify(conv.action, null, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
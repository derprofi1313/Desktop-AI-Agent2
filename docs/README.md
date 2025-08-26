# Desktop AI Agent - Vollständige Anleitung

## Überblick

Der Desktop AI Agent ist eine innovative Anwendung, die künstliche Intelligenz nutzt, um Desktop-Aufgaben zu automatisieren. Mit Ollama als lokaler KI-Engine können Sie Dateien verwalten, Webseiten öffnen und komplexe Desktop-Operationen durch natürliche Sprache steuern.

## Funktionen

### 🤖 Intelligente Desktop-Steuerung
- Dateien erstellen, bearbeiten und löschen
- Browser-Fenster öffnen und navigieren
- Automatische Aufgabenausführung
- Natürliche Sprachverarbeitung

### 💻 Lokale KI mit Ollama
- Vollständig offline funktionsfähig
- Datenschutz durch lokale Verarbeitung
- Anpassbare Modelle
- Keine Cloud-Abhängigkeiten

### 📊 Training und Verbesserung
- Kontinuierliches Lernen aus Interaktionen
- Trainingsdaten-Export für Jannik
- Performance-Überwachung
- Custom Model Training

## Installation und Setup

### 1. Projekt-Dependencies installieren

```bash
npm install
```

### 2. Ollama installieren

**Option A: Automatische Installation**
```bash
npm run ollama:install
```

**Option B: Manuelle Installation**
- Windows: Download von [https://ollama.ai](https://ollama.ai)
- macOS: Download und Installation der .dmg-Datei
- Linux: `curl -fsSL https://ollama.ai/install.sh | sh`

### 3. Ollama Setup und Modelle

```bash
npm run ollama:setup
```

Dies wird:
- Ollama-Service starten
- Basis-Modell (llama3.2) herunterladen
- Custom "desktop-agent" Modell erstellen
- Trainingsdaten-Struktur einrichten

### 4. Anwendung starten

```bash
npm run dev
```

Die Anwendung läuft auf [http://localhost:3000](http://localhost:3000)

## Verwendung

### Chat-Interface
1. Öffnen Sie die Anwendung
2. Verwenden Sie das Chat-Interface unten auf dem Bildschirm
3. Geben Sie Befehle in natürlicher Sprache ein:
   - "Erstelle eine Datei namens 'notizen.txt'"
   - "Öffne Wikipedia im Browser"
   - "Lösche die Datei 'test.txt'"

### Desktop-Icons
- Doppelklicken Sie auf Dateien, um sie zu öffnen
- Doppelklicken Sie auf Apps, um sie zu starten
- Browser-App öffnet ein eingebettetes Browser-Fenster

### Ollama-Management
- Klicken Sie auf das Settings-Icon (⚙️) oben rechts
- Überprüfen Sie den Ollama-Status
- Installieren Sie zusätzliche Modelle
- Überwachen Sie System-Performance

### Training (für Jannik)
- Klicken Sie auf das Brain-Icon (🧠) oben rechts
- Überprüfen Sie Trainingsdaten und Statistiken
- Exportieren Sie erfolgreiche Konversationen
- Verwalten Sie Trainingsdaten-Qualität

## Erweiterte Konfiguration

### Umgebungsvariablen

Erstellen Sie eine `.env`-Datei:

```env
# Ollama-Konfiguration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Alternative Modelle
# OLLAMA_MODEL=desktop-agent
# OLLAMA_MODEL=mistral
```

### Custom Model Training

1. **Daten sammeln**: Verwenden Sie die Anwendung und sammeln Sie Interaktionen
2. **Qualitätskontrolle**: Nutzen Sie das Training-Panel zur Überprüfung
3. **Export**: Exportieren Sie gute Beispiele als JSON
4. **Modelfile erstellen**:

```dockerfile
FROM llama3.2

# Custom Prompts basierend auf Trainingsdaten
SYSTEM "Du bist DesktopAI, spezialisiert auf..."

# Parameter optimieren
PARAMETER temperature 0.1
PARAMETER top_p 0.9
```

5. **Model erstellen**:
```bash
ollama create custom-desktop-agent -f ./Modelfile
```

## Architektur

### Frontend (React/Next.js)
- **Layout.js**: Basis-Layout-Komponente
- **Pages/Desktop**: Haupt-Desktop-Seite
- **Components/Desktop/**: UI-Komponenten
  - ChatInterface: Chat mit AI Agent
  - DesktopIcon: Desktop-Symbol-Darstellung
  - FileViewer: Datei-Editor
  - BrowserWindow: Eingebetteter Browser
  - OllamaStatusPanel: Ollama-Management
  - TrainingPanel: Training-Management

### Backend-Simulation
- **entities/**: Daten-Entitäten
  - DesktopFile: Datei-Management
  - AgentMemory: Konversations-Speicher
- **integrations/Core.js**: Ollama-Integration

### AI Integration
- **Ollama**: Lokale LLM-Engine
- **JSON-Schema**: Strukturierte AI-Antworten
- **Memory System**: Persistent conversation storage

## API-Endpunkte (Ollama)

### Modell-Generation
```bash
POST http://localhost:11434/api/generate
{
  "model": "llama3.2",
  "prompt": "...",
  "format": "json"
}
```

### Modell-Management
```bash
GET http://localhost:11434/api/tags
POST http://localhost:11434/api/pull
```

## Fehlerbehebung

### Ollama nicht erreichbar
1. Überprüfen Sie, ob Ollama läuft: `ollama serve`
2. Port-Konflikt prüfen: `netstat -an | grep 11434`
3. Firewall-Einstellungen überprüfen

### Modell nicht gefunden
1. Verfügbare Modelle anzeigen: `ollama list`
2. Modell neu herunterladen: `ollama pull llama3.2`
3. Custom Model neu erstellen: `npm run ollama:setup`

### Performance-Probleme
1. Kleineres Modell verwenden (llama3.2:1b)
2. Andere Anwendungen schließen
3. RAM erweitern
4. GPU-Beschleunigung aktivieren

### Chat-Interface reagiert nicht
1. Browser-Konsole auf Fehler prüfen
2. Ollama-Status im Settings-Panel überprüfen
3. LocalStorage löschen und neu starten

## Training mit Jannik

### Workflow für Modell-Verbesserung

1. **Datensammlung**
   - Täglich neue Konversationen führen
   - Verschiedene Aufgaben-Typen testen
   - Edge-Cases dokumentieren

2. **Qualitätskontrolle**
   - Training-Panel regelmäßig überprüfen
   - Erfolgreiche vs. problematische Dialoge identifizieren
   - Auswahl der besten Trainingsbeispiele

3. **Export und Analyse**
   - Hochwertige Konversationen exportieren
   - Muster in erfolgreichen Interaktionen erkennen
   - Schwachstellen analysieren

4. **Model Fine-tuning**
   - Custom Modelfile mit besseren Prompts erstellen
   - Parameter für spezifische Aufgaben optimieren
   - A/B-Testing mit verschiedenen Modell-Varianten

5. **Iteration**
   - Kontinuierliche Verbesserung basierend auf Feedback
   - Regelmäßige Model-Updates
   - Performance-Metriken verfolgen

### Trainings-Metriken

- **Erfolgsrate**: Prozentsatz erfolgreicher Aktionen
- **Antwortqualität**: Benutzer-Feedback zu AI-Antworten
- **Aufgaben-Diversität**: Vielfalt der bewältigten Aufgaben
- **Lerngeschwindigkeit**: Verbesserung über Zeit

## Erweitungsmöglichkeiten

### Geplante Features
- [ ] Erweiterte Datei-Operationen
- [ ] System-Integration (Prozesse, Services)
- [ ] Multi-Modal Eingabe (Sprache, Bilder)
- [ ] Plugin-System für neue Funktionen
- [ ] Cloud-Synchronisation (optional)

### Custom Integrationen
- **APIs**: REST/GraphQL Anbindungen
- **Datenbanken**: Persistente Datenspeicherung
- **Automatisierung**: Workflow-Orchestrierung
- **Monitoring**: Erweiterte Analytics

## Support und Community

### Dokumentation
- `docs/OLLAMA_SETUP.md`: Detaillierte Ollama-Anleitung
- `README.md`: Projekt-Übersicht
- Inline-Code-Kommentare

### Entwicklung
- GitHub Issues für Bug-Reports
- Feature-Requests willkommen
- Contribution Guidelines

### Training-Support für Jannik
- Regelmäßige Review-Sessions
- Training-Data-Analyse
- Performance-Optimierung
- Best-Practice-Dokumentation

---

**Desktop AI Agent** - Intelligente Desktop-Automatisierung mit lokaler KI
Entwickelt für maximale Effizienz, Datenschutz und kontinuierliche Verbesserung.
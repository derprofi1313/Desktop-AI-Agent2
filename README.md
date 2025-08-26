# Desktop AI Agent

Ein intelligenter Desktop-Agent mit Ollama-Integration für autonome Desktop-Steuerung durch natürliche Sprache.

## 🚀 Schnellstart

1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **Ollama installieren und einrichten:**
   ```bash
   npm run ollama:install
   npm run ollama:setup
   ```

3. **Anwendung starten:**
   ```bash
   npm run dev
   ```

4. **Öffnen Sie [http://localhost:3000](http://localhost:3000)**

## 📋 Funktionen

- 🤖 **KI-gesteuerte Desktop-Kontrolle** - Steuern Sie Ihren Desktop mit natürlicher Sprache
- 📁 **Datei-Management** - Erstellen, bearbeiten, löschen Sie Dateien per Chat
- 🌐 **Browser-Integration** - Öffnen Sie Webseiten direkt aus der Anwendung
- 🧠 **Lokale KI mit Ollama** - Vollständig offline, datenschutzfreundlich
- 📊 **Training-System** - Kontinuierliche Verbesserung für Jannik
- 💾 **Persistent Memory** - Alle Konversationen werden gespeichert

## 💻 Verwendung

### Chat-Befehle:
- "Erstelle eine Datei namens 'notizen.txt' mit dem Inhalt 'Meine Notizen'"
- "Öffne Wikipedia im Browser"
- "Lösche die Datei 'test.txt'"
- "Zeige mir den Inhalt der Datei 'README.md'"

### Desktop-Interaktion:
- Doppelklicken Sie auf Dateien, um sie zu öffnen und zu bearbeiten
- Doppelklicken Sie auf Apps, um sie zu starten
- Verwenden Sie die Settings (⚙️) für Ollama-Management
- Nutzen Sie das Training-Panel (🧠) für Modell-Verbesserungen

## 📚 Dokumentation

- **[Vollständige Anleitung](docs/README.md)** - Detaillierte Dokumentation
- **[Ollama Setup](docs/OLLAMA_SETUP.md)** - Ollama Installation und Konfiguration

## 🛠️ Für Jannik (Training)

Das Training-Panel bietet:
- Konversations-Übersicht und -Auswahl
- Export von Trainingsdaten
- Qualitätskontrolle für Modell-Verbesserungen
- Performance-Statistiken

**Training-Workflow:**
1. Verwenden Sie die Anwendung für verschiedene Aufgaben
2. Öffnen Sie das Training-Panel (🧠-Icon)
3. Wählen Sie erfolgreiche Konversationen aus
4. Exportieren Sie die Daten für Custom Model Training

## 🔧 Technische Details

- **Frontend:** React, Next.js, Tailwind CSS
- **KI-Engine:** Ollama (lokal)
- **Speicher:** LocalStorage (Browser)
- **UI-Komponenten:** Radix UI, Lucide Icons

## 📦 Verfügbare Scripts

```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Produktions-Build erstellen
npm run start        # Produktionsserver starten
npm run ollama:install  # Ollama installieren
npm run ollama:setup    # Ollama konfigurieren
```

## 🎯 Für die Firma

Dieser Desktop AI Agent demonstriert:
- **Lokale KI-Integration** ohne Cloud-Abhängigkeiten
- **Natürliche Sprachverarbeitung** für Desktop-Automatisierung
- **Continuous Learning** durch Jannik's Training
- **Skalierbare Architektur** für weitere Features
- **Datenschutz-konformes Design** mit lokaler Datenverarbeitung

---

**Desktop AI Agent** - Die Zukunft der intelligenten Desktop-Automatisierung! 🤖✨
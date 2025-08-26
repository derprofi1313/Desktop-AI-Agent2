# Desktop AI Agent - Ollama Integration Guide

## Was ist Ollama?

Ollama ist ein benutzerfreundliches Tool zum Ausführen großer Sprachmodelle (Large Language Models, LLMs) lokal auf Ihrem Computer. Es ermöglicht es, leistungsstarke KI-Modelle wie Llama, Mistral, und andere ohne Cloud-Abhängigkeiten zu nutzen.

### Vorteile von Ollama:
- **Datenschutz**: Alle Daten bleiben lokal auf Ihrem Computer
- **Offline-Nutzung**: Keine Internetverbindung nach der Installation erforderlich
- **Kostenlos**: Keine API-Kosten oder Abonnements
- **Anpassbar**: Verschiedene Modelle für unterschiedliche Anwendungsfälle

## Ollama Installation

### Windows Installation

1. **Download**: Besuchen Sie [https://ollama.ai](https://ollama.ai) und laden Sie die Windows-Version herunter
2. **Installation**: Führen Sie die heruntergeladene .exe-Datei aus und folgen Sie den Anweisungen
3. **Systemstart**: Ollama wird automatisch als Dienst gestartet

### macOS Installation

1. **Download**: Laden Sie die macOS-Version von [https://ollama.ai](https://ollama.ai) herunter
2. **Installation**: Öffnen Sie die .dmg-Datei und ziehen Sie Ollama in den Programme-Ordner
3. **Erstes Starten**: Öffnen Sie Terminal und führen Sie `ollama` aus

### Linux Installation

```bash
# Installation über curl
curl -fsSL https://ollama.ai/install.sh | sh

# Oder manueller Download
wget https://ollama.ai/download/linux
chmod +x linux
sudo mv linux /usr/local/bin/ollama
```

## Modell-Setup für Desktop AI Agent

### 1. Basis-Modell installieren (Empfohlen)

```bash
# Llama 3.2 (3B Parameter) - Gut für Desktop-Aufgaben
ollama pull llama3.2

# Oder für bessere Leistung (benötigt mehr RAM):
ollama pull llama3.2:7b
```

### 2. Alternative Modelle

```bash
# Mistral - Gut für deutsche Sprache
ollama pull mistral

# CodeLlama - Speziell für Programmieraufgaben
ollama pull codellama

# Gemma - Google's Modell
ollama pull gemma:2b
```

## Ollama für Desktop AI Agent konfigurieren

### 1. Ollama Service starten

```bash
# Windows (automatisch gestartet)
# Überprüfen im Task-Manager oder Services

# macOS/Linux
ollama serve
```

### 2. Modell testen

```bash
# Interaktiver Test
ollama run llama3.2

# API-Test
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Hallo, ich bin ein Desktop AI Agent!"
}'
```

### 3. Umgebungsvariablen (optional)

Erstellen Sie eine `.env`-Datei im Projektverzeichnis:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

## Modell-Training und Anpassung

### Custom Model für Desktop-Aufgaben

1. **Modelfile erstellen**:
```dockerfile
FROM llama3.2

# Basis-Prompt für Desktop-Agent
SYSTEM """
Du bist 'DesktopAI', ein KI-Agent zur Steuerung eines Windows-Desktop-Systems.
Du kannst Dateien erstellen, bearbeiten, löschen und Browser-Fenster öffnen.
Antworte immer in deutscher Sprache und strukturiere deine Antworten als JSON.
"""

# Parameter für Desktop-Aufgaben optimieren
PARAMETER temperature 0.1
PARAMETER top_p 0.9
PARAMETER top_k 40
```

2. **Custom Model erstellen**:
```bash
ollama create desktop-agent -f ./Modelfile
```

### Training mit spezifischen Desktop-Aufgaben

Für das Training mit Jannik können Sie:

1. **Konversations-Log sammeln**: Alle Interaktionen werden in der AgentMemory gespeichert
2. **Fine-tuning Daten vorbereiten**: Erfolgreiche Aufgaben als Trainingsbeispiele nutzen
3. **Model-Updates**: Regelmäßige Verbesserungen basierend auf Nutzerfeedback

## Fehlerbehandlung

### Häufige Probleme:

**Ollama startet nicht:**
```bash
# Port prüfen
netstat -an | grep 11434

# Prozess neu starten
pkill ollama
ollama serve
```

**Modell nicht gefunden:**
```bash
# Verfügbare Modelle anzeigen
ollama list

# Modell neu herunterladen
ollama pull llama3.2
```

**Speicher-Probleme:**
- Kleineres Modell verwenden (llama3.2:1b)
- Andere Anwendungen schließen
- RAM erweitern

## Performance-Optimierung

### Hardware-Anforderungen:
- **Minimum**: 4GB RAM, 2GB freier Speicher
- **Empfohlen**: 8GB+ RAM, 4GB+ freier Speicher
- **GPU-Beschleunigung**: CUDA oder ROCm für bessere Performance

### Modell-Auswahl:
- **1B-3B Parameter**: Schnell, weniger Speicher, gut für einfache Aufgaben
- **7B Parameter**: Ausgewogen zwischen Geschwindigkeit und Qualität
- **13B+ Parameter**: Beste Qualität, benötigt viel Speicher

## Integration in Desktop AI Agent

Die Desktop AI Agent Anwendung nutzt Ollama über die REST-API:

1. **Automatische Erkennung**: Prüft ob Ollama läuft
2. **Modell-Management**: Lädt benötigte Modelle automatisch
3. **Strukturierte Ausgaben**: Nutzt JSON-Schema für konsistente Antworten
4. **Fehlerbehandlung**: Benutzerfreundliche Fehlermeldungen

## Nächste Schritte

1. Ollama installieren und testen
2. Basis-Modell herunterladen
3. Desktop AI Agent starten
4. Erste Interaktionen testen
5. Training und Verbesserungen mit Jannik

Bei Fragen oder Problemen: Überprüfen Sie die Logs in der Konsole oder kontaktieren Sie das Entwicklungsteam.
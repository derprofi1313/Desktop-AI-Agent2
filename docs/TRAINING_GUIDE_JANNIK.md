# Desktop AI Agent - Training Guide für Jannik

## 🎯 Überblick für den Owner

Hallo Jannik! Diese Anwendung ist Ihr Desktop AI Agent mit vollständiger Ollama-Integration. Das System wurde speziell dafür entwickelt, kontinuierlich durch Ihre Interaktionen zu lernen und sich zu verbessern.

## 🚀 Sofort loslegen

### 1. Erste Schritte (5 Minuten)
```bash
# Projekt setup
npm install

# Ollama installieren (folgen Sie den Anweisungen)
npm run ollama:install

# Modelle und Training einrichten
npm run ollama:setup

# Anwendung starten
npm run dev
```

### 2. Erste Interaktion
- Öffnen Sie http://localhost:3000
- Testen Sie einfache Befehle im Chat:
  - "Erstelle eine Datei 'test.txt'"
  - "Öffne Google im Browser"
  - "Zeige mir alle Dateien"

## 🧠 Training-System für Sie

### Training-Panel Funktionen
Klicken Sie auf das 🧠-Icon oben rechts für:

**Konversations-Management:**
- Alle Ihre Chat-Verläufe mit dem AI Agent
- Erfolgreiche vs. problematische Interaktionen
- Auswahl der besten Trainingsbeispiele

**Export-Tools:**
- Exportieren Sie hochwertige Konversationen als JSON
- Nutzen Sie diese für Custom Model Training
- Analysieren Sie Verbesserungsmöglichkeiten

**Statistiken:**
- Anzahl erfolgreicher Aktionen
- Conversation-Qualität über Zeit
- Training-Progress Tracking

### Empfohlener Training-Workflow

**Woche 1: Basis-Training**
- Täglich 30-60 Minuten verschiedene Aufgaben testen
- Fokus auf Standard-Operationen (Dateien, Browser)
- Alle Interaktionen werden automatisch gespeichert

**Woche 2-4: Vertiefung**
- Komplexere Aufgaben und Edge-Cases
- Regelmäßiger Export von erfolgreichen Dialogen
- Erste Custom Model Experimente

**Laufend: Optimierung**
- Wöchentliche Reviews im Training-Panel
- Kontinuierliche Modell-Verbesserungen
- Performance-Monitoring

## 🛠️ Custom Model Training

### Schritt 1: Daten sammeln
```bash
# Nutzen Sie das Training-Panel zur Datenauswahl
# Exportieren Sie erfolgreiche Konversationen
```

### Schritt 2: Modelfile erstellen
```dockerfile
FROM llama3.2

SYSTEM """
Du bist DesktopAI für Jannik's Firma.
Basierend auf den Trainingsdaten von [DATUM]...
[Ihre spezifischen Anweisungen basierend auf den Daten]
"""

PARAMETER temperature 0.1
PARAMETER top_p 0.9
```

### Schritt 3: Custom Model erstellen
```bash
ollama create jannik-desktop-agent -f ./Modelfile
```

### Schritt 4: Testen und Iterieren
- A/B-Testing zwischen Modellen
- Performance-Vergleiche
- Weitere Datensammlung

## 💼 Business Value für Ihre Firma

### Direkte Vorteile:
- **Automatisierung**: Repetitive Desktop-Aufgaben werden automatisiert
- **Effizienz**: Natürliche Sprache statt komplexer Software-Bedienung
- **Datenschutz**: Alle Daten bleiben lokal, keine Cloud-Abhängigkeiten
- **Anpassbarkeit**: System lernt Ihre spezifischen Arbeitsweisen

### Skalierungsmöglichkeiten:
- **Team-Integration**: Modell kann für Ihr ganzes Team trainiert werden
- **Branchen-Spezialisierung**: Custom Models für Ihre Geschäftsprozesse
- **API-Integration**: Anbindung an Ihre bestehenden Systeme
- **Multi-Modal**: Erweiterung um Sprach- und Bildeingabe

## 🔧 Technische Unterstützung

### Häufige Probleme lösen:

**Ollama startet nicht:**
```bash
# Windows: Überprüfen Sie den Service
# macOS/Linux: Manuell starten
ollama serve
```

**Modell antwortet nicht:**
```bash
# Modell-Status prüfen
ollama list

# Modell neu laden
ollama pull llama3.2
```

**Performance-Probleme:**
- Kleineres Modell verwenden (llama3.2:1b)
- RAM-Nutzung überwachen
- Andere Anwendungen schließen

### Training-Unterstützung:
- Alle Funktionen sind dokumentiert
- Inline-Hilfe in der Anwendung
- Export-Formate sind standardisiert
- Backup-Strategien implementiert

## 📊 Success Metrics für Ihr Training

### KPIs zu verfolgen:
- **Erfolgsrate**: % erfolgreich ausgeführter Befehle
- **Response-Qualität**: Bewertung der AI-Antworten (1-5)
- **Task-Diversity**: Anzahl verschiedener Aufgabentypen
- **Learning-Speed**: Verbesserung über Zeit

### Monatliche Reviews:
1. Training-Panel Statistiken analysieren
2. Best-Practice Beispiele identifizieren
3. Schwachstellen dokumentieren
4. Model-Updates planen

## 🎯 Nächste Schritte für Sie

### Diese Woche:
- [ ] System installieren und ersten Test durchführen
- [ ] 5-10 verschiedene Aufgaben ausprobieren
- [ ] Training-Panel erkunden
- [ ] Erste Daten exportieren

### Nächster Monat:
- [ ] Custom Model für Ihre Arbeitsweise erstellen
- [ ] Performance-Metriken etablieren
- [ ] Team-Integration planen
- [ ] Erweiterungsfeatures evaluieren

## 💡 Pro-Tips für maximalen Erfolg

1. **Konsistenz**: Regelmäßige Nutzung ist wichtiger als intensive Sessions
2. **Dokumentation**: Notieren Sie besonders erfolgreiche Interaktionen
3. **Iteration**: Kleine, kontinuierliche Verbesserungen sind effektiver
4. **Feedback**: Das System lernt aus Ihren Korrekturen
5. **Geduld**: KI-Training ist ein iterativer Prozess

---

**Viel Erfolg mit Ihrem Desktop AI Agent, Jannik!** 🚀

Bei Fragen oder für erweiterte Trainings-Sessions stehe ich gerne zur Verfügung.

*Ihr AI-Entwicklungsteam*
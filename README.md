# Generator Krzywej Hilberta

Interaktywna aplikacja webowa do wizualizacji Krzywej Hilberta - ciągłej krzywej fraktalnej wypełniającej przestrzeń.

## 🌟 Możliwości

- **Wizualizacja w czasie rzeczywistym**: Generowanie krzywej od 1 do 8 stopnia iteracji.
- **Animacja**: Opcja animowanego rysowania krzywej („rysowanie na żywo”).
- **Personalizacja**:
  - Wybór koloru linii
  - Regulacja grubości linii
- **Responsywność**: Automatyczne dopasowanie do rozmiaru okna przeglądarki.
- **Statystyki**: Wyświetlanie liczby punktów i długości krzywej.

## 🚀 Jak uruchomić

Wystarczy otworzyć plik `index.html` w dowolnej nowoczesnej przeglądarce internetowej.

Nie wymaga instalacji żadnych zależności ani uruchamiania serwera (choć zalecane jest używanie lokalnego serwera np. Live Server w VS Code dla najlepszej wydajności).

## 🛠️ Technologie

- **HTML5 Canvas** - do renderowania grafiki
- **Vanilla JavaScript (ES6+)** - logika generowania fraktala
- **CSS3** - nowoczesny, responsywny interfejs użytkownika

## 📚 O Krzywej Hilberta

Krzywa Hilberta to krzywa wypełniająca przestrzeń opisana przez niemieckiego matematyka Davida Hilberta w 1891 roku. Jest to granica ciągu krzywych przybliżających, które w każdym kroku stają się coraz bardziej złożone, ostatecznie przechodząc przez każdy punkt kwadratu.

Wzór na liczbę punktów: N = 4^n, gdzie n to liczba iteracji.

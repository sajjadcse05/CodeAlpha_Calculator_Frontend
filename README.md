# 🧮 Calculator System

A sleek, responsive, and precision-optimized web-based Calculator application built with standard front-end web technologies (**HTML5**, **CSS3 Grid**, and **Vanilla JavaScript**). The application features a dark-themed neumorphic interface, complete keyboard integration, and smart evaluation safety mechanics.

## 🚀 Features

* **Core Arithmetic Operations:** Robust support for standard operations: Addition (`+`), Subtraction (`-`), Multiplication (`×`), and Division (`÷`).
* **Smart Dual-Line Display:** Features an upper tracking line to view your full active formula string alongside a main display for real-time calculation previews.
* **Smart Decimal Engine:** Prevents duplicate decimal point entry anomalies within the same numerical segment.
* **Precision Control:** Eliminates floating-point rounding errors (e.g., `0.1 + 0.2` correctly yields `0.3`) and transitions long numbers seamlessly into scientific notation.
* **Bonus Features Added:**
    * **Full Physical Keyboard Support:** Type calculations instantly using your keyboard numbers, operators, `Enter` or `=`, `Backspace`, and `Escape` (AC).
    * **Live Computation Preview:** Calculates and displays results instantly in real time as you type, before you even press equals.

## 🛠️ Tech Stack

* **Structure:** HTML5 (Semantic document layout)
* **Styling:** CSS3 (CSS Grid matrix, Flexbox, Fluid scale animations)
* **Functionality:** Vanilla JavaScript (Isolated algorithmic `Function()` engine evaluation for high safety margins)
* **Icons:** FontAwesome v6.4.0 (via CDN Integration)

---

## 📂 File Structure

```text
calculator-system/
├── index.html        # App structural layout framework
├── style.css         # Visual aesthetic styles & Grid engine mapping
├── script.js         # Core algorithmic data processing & input mapping
└── README.md         # Documentation file

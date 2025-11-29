# Seesaw Simulation

An interactive physics simulation demonstrating how **weight**, **distance**, and **torque** affect a seesaw's balance. Users can click on the plank to drop a randomly generated weight and watch the seesaw tilt in real-time.

---

## Features

- **Interactive weight placement**  
  Click anywhere on the seesaw to drop a weight (1–10 kg) at that position.

- **Real-time physics calculations**

  - Total weight on left & right
  - Torque = weight × distance
  - Tilt angle calculation (±30°)

- **Smooth animations**  
  Plank rotates visually according to torque difference.

- **Logs & Persistence**  
  Every drop is recorded with weight, side, and distance. All state is saved in `localStorage` and restored on reload.

- **Responsive design**  
  Works on desktop, tablet, and mobile screens.

- **Reset functionality**  
  Clears all weights, logs, and stored data instantly.

---

## Thought Process & Design Decisions

- **Initial structure:** Started the project by building the HTML and CSS layout, creating the basic structure for the seesaw, stats panel, and logs.
- **Core calculations:** Before handling the placement of weights visually, implemented the calculations for left and right total weight, torque, and tilt angle.
- **Plank rotation and animations:** Added smooth transitions for the plank based on calculated angles to reflect the seesaw tilting dynamically.
- **Weight placement and improvements:** Implemented the visual placement of weights on the plank and improved the design by making the size of each weight dynamic based on its value.
- **LocalStorage integration:** Added state persistence using LocalStorage. While integrating, realized that I needed to carefully determine which data to save, which required small adjustments in functions like `newCircle` and `addLog`.
- **Responsive layout:** Used percentage-based widths and media queries to ensure the simulation works well across desktop, tablet, and mobile devices.
- **Visual clarity & user interaction:** Ensured weights are visually distinct and the simulation is intuitive—clicking anywhere on the plank immediately adds a weight with smooth animations.

---

## AI Assistance

Some minor parts of the project were assisted by AI:

- Provided suggestions for debugging the `localStorage` save/load logic to ensure weights and logs persisted correctly.
- Suggested small responsive CSS improvements.
- Helped structure the README and organize feature sections.

All core physics calculations, DOM manipulation, weight placement logic, and animations were implemented manually.

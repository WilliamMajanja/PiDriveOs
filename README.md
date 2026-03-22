# PiDriveOS - Open Source Self-Driving Car Platform

PiDriveOS is a comprehensive, open-source self-driving car platform designed to run on a Raspberry Pi. It provides a robust, idiot-proof interface for monitoring, calibrating, and controlling your autonomous vehicle.

## ⚠️ Safety Warning
**Self-driving vehicles are inherently dangerous.** This software is provided "as is" without warranty of any kind. Always test in a safe, enclosed environment away from people, pets, and property. **Always maintain a physical emergency kill switch that cuts power to the motors.**

## Hardware Requirements

To build a complete self-driving car using PiDriveOS, you will need the following hardware:

### Core Computing
*   **Raspberry Pi 4 Model B (8GB) or Raspberry Pi 5:** The brain of the operation.
*   **High-Speed MicroSD Card (64GB+):** Class 10 A2 recommended for fast read/write speeds.
*   **Active Cooling Case:** The Pi will run heavy AI models and needs active cooling to prevent thermal throttling.

### Sensors
*   **Camera:** Raspberry Pi Camera Module 3 (Wide) or a high-quality USB webcam (e.g., Logitech C920). Used for lane detection and object recognition.
*   **LiDAR (Optional but Recommended):** RPLidar A1M8 or similar for 360-degree obstacle avoidance and mapping.
*   **GPS Module:** U-blox NEO-M8N or similar for global positioning and waypoint navigation.
*   **IMU (Inertial Measurement Unit):** BNO085 or MPU6050 for accurate heading, acceleration, and tilt data.
*   **Ultrasonic Sensors (HC-SR04):** For close-range obstacle detection (bumpers).

### Actuation & Control
*   **Motor Controller (ESC):** Compatible with your vehicle's motors (e.g., PCA9685 for PWM control).
*   **Steering Servo:** High-torque servo motor for steering.
*   **Drive Motor:** DC motor or brushless motor for propulsion.
*   **RC Transmitter & Receiver:** **CRITICAL FOR SAFETY.** You must be able to take manual control at any time.

### Next-Level Signal Lab (Advanced)
*   **High-Power IR LED Array (940nm):** For MIRT (Mobile Infrared Transmitter) simulation. Connect to GPIO 18 with a high-current transistor (e.g., TIP120).
*   **HackRF One SDR:** Wideband Software Defined Radio (1MHz to 6GHz). Connect via USB for full-spectrum scanning and signal analysis.
*   **ESP32-S3 Addon:** For dedicated 2.4GHz/5GHz Wi-Fi and Bluetooth analysis. Interfaced via USB-CDC or Serial.
*   **RTL-SDR (Software Defined Radio):** Like the RTL-SDR Blog V3. Used for frequency scanning and signal analysis.
*   **Radar Detector Module:** Interfaced via GPIO/Serial (e.g., custom integration with Uniden or Valentine One modules).
*   **Sub-GHz Transceiver (CC1101):** For advanced radio frequency experimentation (similar to Flipper Zero).

### Active Defense & Threat Intelligence
PiDriveOS includes a sophisticated **Threat Intelligence** system designed to protect your vehicle from modern signal-based attacks:
*   **V2X Mesh Monitoring:** Real-time analysis of the 5.9GHz DSRC/C-V2X spectrum to detect spoofing, replay attacks, and malicious nodes.
*   **Governance & Surveillance Detection:** Identifies signals from automated enforcement (ALPR, Speed Cameras) and cellular surveillance nodes (IMSI Catchers/Stingrays).
*   **Sovereign AI Audit:** Uses the Gemini 3 Flash reasoning engine to analyze signal signatures and provide defensive recommendations.
*   **Signal Integrity:** Monitors GPS and V2X signal health to detect jamming or interference.

### Power
*   **Battery:** LiPo battery (2S or 3S depending on your motors) with sufficient capacity.
*   **UBEC (Universal Battery Elimination Circuit):** To step down the battery voltage to a stable 5V/3A+ for the Raspberry Pi.

## Software Requirements

*   **OS:** Raspberry Pi OS (64-bit, Bookworm recommended).
*   **Python 3.9+:** For backend control scripts.
*   **OpenCV:** For image processing.
*   **TensorFlow Lite or ONNX Runtime:** For running the self-driving AI models efficiently on the Pi.
*   **Node.js & npm:** To run this dashboard.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/pidriveos.git
    cd pidriveos
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the dashboard:**
    ```bash
    npm run dev
    ```

## Features

*   **Real-time Telemetry:** Monitor speed, steering angle, throttle, and sensor status.
*   **Camera Feed:** Live view from the front-facing camera with AI overlays (lane detection, object bounding boxes).
*   **Map View:** GPS tracking and route planning.
*   **Idiot-Proof Calibration:** Step-by-step wizards for calibrating steering limits and throttle curves.
*   **Emergency Stop:** Massive, easily accessible software E-Stop (always use a physical one too!).
*   **System Health:** Monitor Raspberry Pi CPU usage, temperature, and memory.

## Architecture

PiDriveOS uses a decoupled architecture:
1.  **Hardware Abstraction Layer (Python/C++):** Interfaces directly with GPIO, I2C, and serial devices.
2.  **AI Engine (Python):** Processes camera and LiDAR data to generate driving commands.
3.  **WebSocket Server (Node.js/Python):** Bridges the hardware/AI layer with the frontend dashboard.
4.  **Frontend Dashboard (React/Vite):** This repository. Provides the user interface.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

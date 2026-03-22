# PiDriveOS - Open Source Self-Driving Car Platform

PiDriveOS is a comprehensive, open-source self-driving car platform designed to run on a Raspberry Pi. It provides a robust, idiot-proof interface for monitoring, calibrating, and controlling your autonomous vehicle.

## ⚠️ Safety Warning
**Self-driving vehicles are inherently dangerous.** This software is provided "as is" without warranty of any kind. Always test in a safe, enclosed environment away from people, pets, and property. **Always maintain a physical emergency kill switch that cuts power to the motors.**

## 🛒 Hardware Shopping List

To build a complete self-driving car using PiDriveOS, you will need the following hardware. We've categorized them to help you plan your build.

### 1. Core Computing & Power
| Item | Quantity | Recommended | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **Raspberry Pi 5 (8GB or 16GB)** | 1 | [Raspberry Pi Foundation](https://www.raspberrypi.com/products/raspberry-pi-5/) | $80 - $120 |
| **MicroSD Card (64GB+ A2)** | 1 | [SanDisk Extreme](https://www.amazon.com/SanDisk-64GB-Extreme-microSDXC-Adapter/dp/B07FCMKK5X) | $15 |
| **Active Cooling Case** | 1 | [Argon ONE V3](https://www.argon40.com/products/argon-one-v3-case-for-raspberry-pi-5) | $30 |
| **LiPo Battery (3S 5000mAh)** | 1 | [Zeee 3S LiPo](https://www.amazon.com/Zeee-5200mAh-Battery-Hardcase-Connector/dp/B076Z778MJ) | $40 |
| **UBEC (5V/5A)** | 1 | [Hobbywing 5V/6V 3A/5A UBEC](https://www.amazon.com/Hobbywing-3A-UBEC-Switch-mode/dp/B008X396Y6) | $15 |

### 2. Sensors & Vision
| Item | Quantity | Recommended | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **Camera Module** | 1 | [Raspberry Pi Camera Module 3 (Wide)](https://www.raspberrypi.com/products/camera-module-3/) | $35 |
| **LiDAR Scanner** | 1 | [RPLidar A1M8](https://www.slamtec.com/en/Lidar/A1) | $100 |
| **GPS Module** | 1 | [U-blox NEO-M8N](https://www.amazon.com/Beitian-BN-880-Compass-Antenna-Raspberry/dp/B078Y6JH47) | $20 |
| **IMU (9-DOF)** | 1 | [Adafruit BNO055](https://www.adafruit.com/product/2472) | $35 |
| **Ultrasonic Sensors** | 4 | [HC-SR04](https://www.amazon.com/Elegoo-HC-SR04-Ultrasonic-Distance-Arduino/dp/B01COSN7O6) | $10 |

### 3. Actuation & Control
| Item | Quantity | Recommended | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **PWM Controller** | 1 | [PCA9685 16-Channel](https://www.adafruit.com/product/815) | $15 |
| **Steering Servo** | 1 | [DS3218 20KG High Torque](https://www.amazon.com/ANNIMOS-Digital-Waterproof-Steering-Control/dp/B076CNK24W) | $20 |
| **ESC (Electronic Speed Controller)** | 1 | [Hobbywing QuicRun 1060](https://www.amazon.com/Hobbywing-QUICRUN-1060-Brushed-ESC/dp/B00L1079S6) | $25 |
| **RC Transmitter & Receiver** | 1 | [Flysky FS-i6X](https://www.amazon.com/Flysky-FS-i6X-Transmitter-FS-iA6B-Receiver/dp/B0744DPPL8) | $60 |

---

## Hardware Requirements

PiDriveOS is optimized for the following compute modules:
*   **Raspberry Pi 5 (16GB):** Recommended for full autonomous stacks, multi-camera SLAM, and high-speed signal intelligence.
*   **Raspberry Pi Zero 2 W:** Recommended for lightweight edge nodes, basic motor control, and low-power surveillance.

### Motor & Servo Control (PCA9685)
To replace or control native vehicle parts (steering, throttle, braking), PiDriveOS uses the **PCA9685 16-Channel 12-bit PWM Controller** via I2C:
1.  **Wiring (Pi to PCA9685):**
    *   VCC -> 3.3V (Pin 1)
    *   SDA -> SDA (Pin 3)
    *   SCL -> SCL (Pin 5)
    *   GND -> GND (Pin 9)
2.  **Servo Power:** Connect an external 5V-6V power supply to the PCA9685 screw terminals. **DO NOT power high-torque servos directly from the Pi.**
3.  **Channel Mapping:**
    *   Channel 0: Steering Servo
    *   Channel 1: Electronic Speed Controller (ESC) / Throttle
    *   Channel 2: Braking Actuator (if separate)
    *   Channels 3-15: Auxiliary (Lights, Pan/Tilt Camera, etc.)

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

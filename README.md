# 🛰️ Satellite Tracking & Collision Prediction System

A modern, space-themed web application for real-time satellite tracking, orbital visualization, and collision prediction using TLE (Two-Line Element) data.

![Satellite Tracker](https://img.shields.io/badge/Satellite-Tracker-blue?style=for-the-badge&logo=space)
![React](https://img.shields.io/badge/React-18.0.0-blue?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-5.2.3-green?style=for-the-badge&logo=django)
![Cesium](https://img.shields.io/badge/Cesium-3D%20Globe-orange?style=for-the-badge)

## 🌟 Features

### 🛰️ **OrbitExplorer**
- **Real-time satellite tracking** with 3D visualization
- **Dynamic satellite management** - add/remove custom satellites
- **TLE data processing** for accurate orbital calculations
- **Infinite orbital movement** with smooth animations
- **Interactive 3D globe** powered by Cesium.js

### 💥 **CollisionLab**
- **Satellite collision prediction** using ML models
- **TLE-based analysis** for orbital parameter assessment
- **Visual collision indicators** with real-time feedback
- **3D trajectory visualization** showing potential collision points

### 🎨 **Modern Space UI**
- **Space-themed design** with violet accents and animations
- **Responsive layout** optimized for all devices
- **Professional typography** using Orbitron and Audiowide fonts
- **Smooth user experience** with loading states and error handling

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start Django server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
SEM_4_Individual_Project/
├── backend/
│   ├── backend/          # Django settings
│   ├── orbit/           # Satellite tracking app
│   ├── satellite/       # Collision prediction app
│   ├── ML/             # Machine learning models
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── pages/      # React components
│   │   │   ├── Home.jsx
│   │   │   ├── OrbitExplorer.jsx
│   │   │   ├── CollisionLab.jsx
│   │   │   └── About.jsx
│   │   ├── App.jsx     # Main app component
│   │   └── index.css   # Global styles
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Satellite Management
- `GET /api/orbit/positions/` - Get real-time satellite positions
- `POST /api/orbit/satellites/` - Add custom satellite
- `DELETE /api/orbit/satellites/` - Remove satellite
- `GET /api/orbit/satellites/` - List all satellites

### Collision Prediction
- `POST /api/orbit/predict/` - Predict satellite collision
- `POST /api/satellite/visualize/` - Visualize satellite trajectories

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Cesium.js** - 3D globe visualization
- **Resium** - React components for Cesium
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Django 5.2** - Web framework
- **Django REST Framework** - API development
- **SGP4** - Satellite orbital calculations
- **Scikit-learn** - Machine learning
- **Pandas** - Data processing
- **NumPy** - Numerical computations

### ML Models
- **Random Forest** - Collision prediction
- **TLE Processing** - Orbital parameter extraction
- **Feature Engineering** - Satellite characteristics

## 🎯 Key Features

### Real-time Tracking
- Live satellite position updates every 100ms
- Orbital trail visualization
- Custom satellite addition via TLE data
- Infinite orbital movement simulation

### Collision Analysis
- ML-powered collision prediction
- TLE-based orbital parameter analysis
- Visual collision indicators
- Real-time trajectory comparison

### Modern UI/UX
- Space-themed design with violet accents
- Responsive layout for all devices
- Smooth animations and transitions
- Professional typography and spacing

## 📊 Screenshots

### OrbitExplorer
![OrbitExplorer](screenshots/orbit-explorer.png)

### CollisionLab
![CollisionLab](screenshots/collision-lab.png)

### Home Page
![Home](screenshots/home.png)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cesium.js** for 3D globe visualization
- **SGP4** for satellite orbital calculations
- **NASA** for TLE data format standards
- **Space-Track.org** for satellite tracking data

## 📞 Contact

- **Project Link:** [https://github.com/Aditya-patel-01/Satellite-Collision-Predictor](https://github.com/Aditya-patel-01/Satellite-Collision-Predictor)
- **Email:** adityaprime.mehsana@gmail.com

---

⭐ **Star this repository if you found it helpful!**

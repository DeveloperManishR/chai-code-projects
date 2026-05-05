# YouTube Videos Listing UI

##  Project Overview
This project is a simple YouTube-style video listing application built using React and Vite. It fetches video data from the FreeAPI public YouTube endpoint and displays it in a clean, responsive grid layout.

---

##  Features
- Fetches videos from FreeAPI endpoint
- Displays video thumbnails
- Shows video title and channel name
- Responsive grid layout
- Clickable "Watch Video" link that opens YouTube
- Loading state handling

---

##  API Used
https://api.freeapi.app/api/v1/public/youtube/videos

---

##  Tech Stack
- React (Vite)
- JavaScript (ES6+)
- CSS (Inline styling)

---

##  Project Structure
- App.jsx → Main logic for fetching and displaying videos
- index.css → Basic styling (optional)

---

##  How It Works
1. App loads and triggers API request using useEffect
2. Data is fetched from FreeAPI
3. Video list is extracted and stored in state
4. Videos are rendered using map function
5. Each card shows thumbnail, title, channel name, and watch link

---

##  Deployment
The project is deployed on Vercel:
https://youtube-video-gold.vercel.app

---

##  GitHub Repository

---

##  Outcome
A functional YouTube-style UI that demonstrates API integration, React state management, and responsive UI design.

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import './App.css';

function App() {
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    rating: '',
    description: '',
    username: '', 
  });

  const fetchPlaceDetails = async () => {
    try {
      const response = await axios.get('https://pin-bx59.onrender.com/api/pins');
      if (response.data) {
        setPins(response.data);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  useEffect(() => {
    fetchPlaceDetails();
  }, []);

  function LocationMarker() {
    useMapEvents({
      dblclick(e) {
        setNewPlace({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      ...formData,
      lat: newPlace.lat,
      long: newPlace.lng,
    };

    try {
      // Send the new pin data to the backend
      const response = await axios.post('https://pin-bx59.onrender.com/api/pins', newPin);
      if (response.status === 201) {
        setPins((prevPins) => [...prevPins, response.data]);
        setFormData({ title: '', rating: '', description: '', username: '' });
        setNewPlace(null);
      }
    } catch (error) {
      console.error("Error saving new pin:", error);
    }
  };

  const blueIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return (
    <MapContainer center={[18.516726, 73.856255]} zoom={10} style={{ width: '100vw', height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <LocationMarker />

      {pins.map((pin, index) => (
        <Marker key={index} position={[pin.lat, pin.long]} icon={blueIcon}>
          <Popup>
            <div className="popup-card">
              <h3>{pin.title}</h3>
              <p><strong>Rating:</strong> {pin.rating} ★</p>
              <p><strong>Description:</strong> {pin.description}</p>
              <p><strong>Created By:</strong> {pin.username}</p>
              <p><strong>Time:</strong> {new Date(pin.createdAt).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {newPlace && (
        <Marker position={[newPlace.lat, newPlace.lng]} icon={blueIcon}>
          <Popup>
            <form onSubmit={handleFormSubmit} className="form-container">
              <h3>Add New Place</h3>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="rating"
                placeholder="Rating (1-5)"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Add Place</button>
            </form>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default App;

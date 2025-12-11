import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    myName: "", partnerName: "", myAge: "", partnerAge: "",
    place: "", college: "", degree: ""
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if(!form.myName || !form.partnerName) {
      alert("Please enter names!"); 
      return;
    }

    try {
      const res = await axios.post("https://calculator-backend-6666.onrender.com/api/calculate", form);
      if (res.data.success) {
        setResult(res.data.result);
      }
    } catch (error) {
      alert("Server is OFF! Please run 'node server.js' in backend folder.");
      console.error(error);
    }
  };

  return (
    <div className="page">
      <motion.div 
        initial={{ y: -30, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="card__header">
          <p className="badge">LoveCalc Pro</p>
          <h1>💖 Future Predictor 💖</h1>
          <p className="subtext">Fill the details and see your match score.</p>
        </div>

        <div className="grid">
          <label className="field">
            <span>Your Name</span>
            <input name="myName" placeholder="e.g., Arjun" onChange={handleChange} />
          </label>
          <label className="field">
            <span>Your Age</span>
            <input name="myAge" placeholder="22" onChange={handleChange} />
          </label>
          <label className="field">
            <span>Partner Name</span>
            <input name="partnerName" placeholder="e.g., Priya" onChange={handleChange} />
          </label>
          <label className="field">
            <span>Partner Age</span>
            <input name="partnerAge" placeholder="22" onChange={handleChange} />
          </label>
          <label className="field">
            <span>Place</span>
            <input name="place" placeholder="Madurai" onChange={handleChange} />
          </label>
          <label className="field">
            <span>College / Work</span>
            <input name="college" placeholder="PSG Tech" onChange={handleChange} />
          </label>
          <label className="field">
            <span>Degree</span>
            <input name="degree" placeholder="B.E CSE" onChange={handleChange} />
          </label>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} 
          className="primary-btn"
        >
          Predict Future 🔮
        </motion.button>

        {result && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
            className="result"
          >
            <h2>Match: {result}% 🔥</h2>
            <p>{form.place ? `From ${form.place}, this looks like a destiny match!` : "Looks like a destiny match!"}</p>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}

export default App;
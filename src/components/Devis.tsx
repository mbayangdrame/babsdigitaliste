import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "../css/devis.css";

const Devis = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Fonction pour gérer les changements de saisie
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fonction pour envoyer l'email
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        "service_l0ln5kp", // Remplace par ton Service ID
        "template_hi3b7xj", // Remplace par ton Template ID
        {
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          user_message: formData.message,
          form_type: activeForm === "photos" ? "Devis Photos" : "Devis Vidéos",
        },
        "gH_jajNR5D-xRpF0v" // Remplace par ta Public Key EmailJS
      )
      .then(
        () => {
          alert("Votre demande a bien été envoyée !");
          setFormData({ name: "", phone: "", email: "", message: "" }); // Réinitialisation du formulaire
        },
        (error) => {
          console.error("Erreur lors de l'envoi:", error);
          alert("Une erreur est survenue. Veuillez réessayer !");
        }
      );
  };

  return (
    <div className="devis-container">
      <div className="devis-header">
        <span className="devis-subtitle">TRAVAILLONS ENSEMBLE</span>
        <h1 className="devis-title">DEMANDEZ VOTRE DEVIS</h1>
        <p className="devis-description">
          Remplissez le formulaire, en nous détaillant votre projet. Après étude, nous vous ferons
          parvenir une proposition dans les meilleurs délais.
        </p>
      </div>

      <div className="devis-types">
        <div className="devis-cards">
          <div className={`devis-card ${activeForm === "photos" ? "active" : ""}`} onClick={() => setActiveForm("photos")}>
            <div className="devis-card-icon">
              📸
            </div>
            <span>Devis Photos</span>
          </div>

          <div className={`devis-card ${activeForm === "videos" ? "active" : ""}`} onClick={() => setActiveForm("videos")}>
            <div className="devis-card-icon">
              🎥
            </div>
            <span>Devis Vidéos</span>
          </div>
        </div>

        {activeForm && (
          <div className="devis-form-container">
            <form className="devis-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom" required />
              </div>
              <div className="form-group">
                <input type="number" name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" required />
              </div>
              <div className="form-group">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={`Décrivez votre projet ${activeForm === "photos" ? "photo" : "vidéo"}...`}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                style={{
                  float: "left",
                  marginBottom: "1rem",
                  backgroundColor: "#007E9C",
                  color: "#fff",
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                }}
              >
                Envoyer
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devis;

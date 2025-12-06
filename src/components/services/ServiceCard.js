import React from "react";
import { Link } from "react-router-dom";
import "./ServiceCard.css";

const ServiceCard = ({ title, description, icon, link }) => {
  return (
    <Link to={link} className="service-card-link">
      <div className="service-card">
        <div className="service-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="service-arrow"></div>
      </div>
    </Link>
  );
};

export default ServiceCard;

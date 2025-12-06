import React from "react";
import ServiceCard from "./ServiceCard";
import "./ServiceGrid.css";

const ServiceGrid = ({ services }) => {
  return (
    <div className="service-grid">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          title={service.title}
          description={service.description}
          icon={service.icon}
          link={service.link}
        />
      ))}
    </div>
  );
};

export default ServiceGrid;

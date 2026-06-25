"use client";
import React from "react";
import CategorySlider from "../slider/CategorySlider";

const CategorySection3 = ({ servicesData }) => {
  return (
    <div className="tf__popular_services_3">
      <div className="container">
        <CategorySlider servicesData={servicesData} />
      </div>
    </div>
  );
};

export default CategorySection3;

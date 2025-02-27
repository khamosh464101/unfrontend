"use client";
import React, { useEffect } from "react";

const Seo = ({ title }) => {
	useEffect(() => {
		document.title = `Ynex - ${title}`;
	}, []);
  
	return (
		<>
		</>
	);
};

export default Seo;

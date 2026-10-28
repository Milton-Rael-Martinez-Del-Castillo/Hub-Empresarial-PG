// src/components/login/LoginBackground.jsx
import React from "react";

function LoginBackground() {
  return (
    <div className="hidden md:block md:w-1/2 bg-cover bg-center" 
         style={{ 
           backgroundImage: "url('/images/loginpage/univalle-entrance.png')",
           backgroundPosition: "center",
           backgroundSize: "cover"
         }}>
    </div>
  );
}

export default LoginBackground;
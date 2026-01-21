import Toastify from 'toastify-js/src/toastify';
import "toastify-js/src/toastify.css";

export const showToast = (message, type = 'success') => {
  const bg = type === 'success' 
    ? 'linear-gradient(to right, #00b09b, #96c93d)' 
    : 'linear-gradient(to right, #ff5f6d, #ffc371)';

  Toastify({
    text: message,
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, 
    style: {
      background: bg,
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      color: "white",
      fontWeight: "500",
    },
  }).showToast();
};
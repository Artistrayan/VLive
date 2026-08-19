import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';

try {
  renderToString(<App />);
  console.log("Rendered successfully");
} catch (e) {
  console.error("Render failed:", e.message);
}

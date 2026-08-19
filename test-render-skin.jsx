import React from 'react';
import { renderToString } from 'react-dom/server';

function Test() {
  return <div style={{ filter: undefined }}>Test</div>;
}

try {
  renderToString(<Test />);
  console.log("Rendered Test successfully");
} catch (e) {
  console.error("Render Test failed:", e.message);
}

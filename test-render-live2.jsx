import React from 'react';
import { renderToString } from 'react-dom/server';
import LiveStudioModal from './src/components/LiveStudioModal.jsx';

// mock window.loc
global.window = { loc: (f, e) => f || e };

try {
  renderToString(<LiveStudioModal isOpen={true} currentUser={{id: 'test', name: 'Test', avatar: ''}} />);
  console.log("Rendered LiveStudioModal successfully");
} catch (e) {
  console.error("Render LiveStudioModal failed:", e.message);
}

const babel = require('@babel/parser');
const code0 = `export default function App() { return ( <>
  {cond && (
    <div>
    <div>
    </div>
  )}
</>);}`;

const code1 = `export default function App() { return ( <>
  {cond && (
    <div>
  )}
</>);}`;
try { babel.parse(code1, { sourceType: "module", plugins: ["jsx"] }); } catch(e) { console.log("code1:", e.message); }

const code2 = `export default function App() { return ( <>
  {cond && (
    <>
  )}
</>);}`;
try { babel.parse(code2, { sourceType: "module", plugins: ["jsx"] }); } catch(e) { console.log("code2:", e.message); }

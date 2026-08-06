const babel = require('@babel/parser');
const code0 = `export default function App() { return ( <>
  {cond && (
    <div>
    </div>
  )}
</>);}`;
try { babel.parse(code0, { sourceType: "module", plugins: ["jsx"] }); console.log("code0 ok"); } catch(e) { console.log("code0:", e.message); }

const code1 = `export default function App() { return ( <>
  {cond && (
    <div>
    </div>
    </div>
  )}
</>);}`;
try { babel.parse(code1, { sourceType: "module", plugins: ["jsx"] }); console.log("code1 ok"); } catch(e) { console.log("code1:", e.message); }

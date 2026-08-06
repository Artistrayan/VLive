const babel = require('@babel/parser');
const code = `
export default function App() {
  return (
    <>
      {cond && (
        <div>
        </>
      )}
    </>
  );
}
`;
try {
  babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
} catch(e) {
  console.log("Error:", e.message);
}

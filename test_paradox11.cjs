const babel = require('@babel/parser');
const code = `
export default function App() {
  return (
    <>
      {cond1 && (
        <div id="first">
        </div>
        {cond2 && (
          <div id="second">
          </div>
        )}
      )}
    </>
  );
}
`;
try {
  babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
  console.log("Success");
} catch(e) {
  console.log("Error:", e.message);
}

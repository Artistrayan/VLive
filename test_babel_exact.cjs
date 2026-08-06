const babel = require('@babel/parser');
const code = `
export default function App() {
  return (
    <>
      {true && (
        <div id="root">
          <div id="child">
          </div>
        </div>
      )}
    </>
  );
}
`;
try {
  babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
  console.log("Success");
} catch(e) {
  console.log(e.message);
}

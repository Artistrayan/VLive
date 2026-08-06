const babel = require('@babel/parser');
const code = `
export default function App() {
  return (
    <div>
      {cond1 && (
        <div></div>
      )}
      {cond2 && (
        <div></div>
      )}
    </div>
  );
}
`;
babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
console.log("minimal passed");

const babel = require('@babel/parser');
const code = `
export default function App() {
  return (
    <div>
      {cond && (
        <div>
          <div>
      )}
    </div>
  );
}
`;
try {
  babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
} catch(e) {
  console.log(e.message);
}

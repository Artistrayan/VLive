const babel = require('@babel/parser');
const testCases = [
  `export default function App() { return ( <>{cond && ( <div /> )}</> ); }`,
  `export default function App() { return ( <>{cond && ( <div /><div> )}</> ); }`,
  `export default function App() { return ( <>{cond && ( <div></div><div> )}</> ); }`,
];
testCases.forEach((tc, i) => {
  try { babel.parse(tc, { sourceType: "module", plugins: ["jsx"] }); } catch(e) { console.log(`Case ${i}:`, e.message); }
});

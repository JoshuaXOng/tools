# wrap-em-up

A basic tool for wrapping classic code blocks in additional code.
It's a bit stoopid though (e.g., Python syntax, non-code brackets (i.e., comments)).

## Playground

README.md
```
const aJsFunction = () => {
  console.log("I don't like curly brackets")
  
  # How about another then?
  const moreCurlyBrackets = { more: { yaya: [] } }
}
```

Output from "wrap-em-up -f andMore: { " -e " }" -c "more:" -r README.md
README.md.tmp
```
const aJsFunction = () => {
  console.log("I don't like curly brackets")
  
  # How about another then?
  const moreCurlyBrackets = { andMore: { more: { yaya: [] } } }
}
```
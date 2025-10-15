// This is a simplified mock of an AI service for code analysis
// In a real application, you would use the AI SDK to connect to a real AI model

const analyzeCode = async (code, language) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // For demo purposes, we'll return mock analysis based on the code content
  const hasErrors = code.includes("error") || code.includes("undefined") || code.includes("null")
  const hasBestPractices = code.includes("function") || code.includes("const") || code.includes("let")

  // Generate mock analysis
  const analysis = {
    issues: [],
    suggestions: [],
    fixedCode: null,
  }

  // Add mock issues based on code content
  if (hasErrors) {
    analysis.issues.push({
      severity: "error",
      title: "Potential undefined variable",
      description: "There might be undefined variables in your code that could cause runtime errors.",
      location: "Line 3",
    })
  }

  if (code.includes("var ")) {
    analysis.issues.push({
      severity: "warning",
      title: "Use of var keyword",
      description: "Consider using const or let instead of var for better scoping.",
      location: "Throughout code",
    })
  }

  if (code.length > 100 && !code.includes("//")) {
    analysis.issues.push({
      severity: "info",
      title: "Missing comments",
      description: "Adding comments to your code will make it more maintainable.",
      location: "Throughout code",
    })
  }

  // Add mock suggestions
  if (language === "javascript" || language === "typescript") {
    analysis.suggestions.push({
      title: "Use arrow functions for callbacks",
      description: "Arrow functions provide a more concise syntax and lexically bind the this value.",
      example: 'const handleClick = () => {\n  console.log("Clicked");\n};',
    })
  }

  if (hasBestPractices) {
    analysis.suggestions.push({
      title: "Destructure objects for cleaner code",
      description: "Use object destructuring to make your code more readable.",
      example: "const { name, age } = user;",
    })
  }

  // Generate fixed code if there are issues
  if (analysis.issues.length > 0) {
    // Simple mock fix: replace var with const, add comments
    let fixedCode = code

    if (code.includes("var ")) {
      fixedCode = fixedCode.replace(/var /g, "const ")
    }

    if (code.length > 100 && !code.includes("//")) {
      fixedCode = "// Main function\n" + fixedCode
    }

    if (hasErrors) {
      // Mock fix for undefined variables
      if (code.includes("undefined")) {
        fixedCode = fixedCode.replace("undefined", '""')
      }
      if (code.includes("null")) {
        fixedCode = fixedCode.replace("null", "{}")
      }
    }

    analysis.fixedCode = fixedCode
  }

  return analysis
}

export { analyzeCode }

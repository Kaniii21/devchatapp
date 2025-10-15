"use client"

import React, { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

// Import Prism core
import Prism from "prismjs"

// Import language support
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-go"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-swift"
import "prismjs/components/prism-kotlin"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-markup-templating"
import "prismjs/components/prism-php"
import "prismjs/components/prism-ruby"

// Import theme
import "prismjs/themes/prism-tomorrow.css"

const CodeSnippet = ({ code = "", language = "javascript" }) => {
  const [copied, setCopied] = React.useState(false)
  const codeRef = useRef(null)

  // Map language to Prism's supported languages
  const getLanguageClass = () => {
    const languageMap = {
      javascript: "javascript",
      typescript: "typescript",
      jsx: "jsx",
      tsx: "tsx",
      python: "python",
      java: "java",
      csharp: "csharp",
      go: "go",
      rust: "rust",
      swift: "swift",
      kotlin: "kotlin",
      php: "php",
      ruby: "ruby",
      css: "css",
      html: "markup",
      xml: "markup",
      sql: "sql",
      bash: "bash",
      shell: "bash",
      json: "json",
      yaml: "yaml",
      markdown: "markdown",
      plaintext: "plaintext",
    }

    return languageMap[language.toLowerCase()] || "javascript"
  }

  useEffect(() => {
    // Make sure Prism is available
    if (Prism && codeRef.current) {
      try {
        Prism.highlightElement(codeRef.current)
      } catch (error) {
        console.error("Prism highlighting error:", error)
      }
    }
  }, [code, language])

  const copyToClipboard = () => {
    if (!code) return

    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-[#2d2d2d] text-white px-4 py-2 text-sm">
        <span>{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <pre className="m-0 p-4 overflow-x-auto bg-[#2d2d2d] text-white">
        <code ref={codeRef} className={`language-${getLanguageClass()}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}

export default CodeSnippet

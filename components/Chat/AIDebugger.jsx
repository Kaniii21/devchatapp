"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { analyzeCode } from "@/services/aiService"
import CodeSnippet from "./CodeSnippet"

const AIDebugger = ({ code, language }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeCode(code, language)
      setAnalysis(result)
    } catch (err) {
      setError(err.message || "Failed to analyze code")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Reset analysis when code changes significantly
  useEffect(() => {
    setAnalysis(null)
    setError(null)
  }, [code, language])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 mr-2 text-primary"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
          AI Code Assistant
        </CardTitle>
        <CardDescription>Get AI-powered analysis and suggestions for your code</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!analysis && !isAnalyzing && (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Click the button below to analyze your code for potential issues and improvements
            </p>
            <Button onClick={handleAnalyze}>Analyze Code</Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Analyzing your code...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
          </div>
        )}

        {analysis && (
          <Tabs defaultValue="issues">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="fixed">Fixed Code</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="space-y-4 mt-4">
              {analysis.issues.length === 0 ? (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>No issues found</AlertTitle>
                  <AlertDescription>Your code looks good! No significant issues were detected.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {analysis.issues.map((issue, index) => (
                    <Alert key={index} variant={issue.severity === "error" ? "destructive" : "default"}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{issue.title}</AlertTitle>
                      <AlertDescription className="mt-2">
                        <p>{issue.description}</p>
                        {issue.location && (
                          <p className="text-sm mt-1">
                            <span className="font-medium">Location:</span> {issue.location}
                          </p>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4 mt-4">
              {analysis.suggestions.length === 0 ? (
                <Alert>
                  <AlertTitle>No suggestions</AlertTitle>
                  <AlertDescription>No specific suggestions for improvement at this time.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">{suggestion.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                      {suggestion.example && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Example:</p>
                          <CodeSnippet code={suggestion.example} language={language} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="fixed" className="mt-4">
              {analysis.fixedCode ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Here's an improved version of your code with fixes applied:
                  </p>
                  <CodeSnippet code={analysis.fixedCode} language={language} />
                </div>
              ) : (
                <Alert>
                  <AlertTitle>No fixes needed</AlertTitle>
                  <AlertDescription>No automatic fixes were necessary for your code.</AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      {analysis && (
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">
            AI analysis is provided as a suggestion and may not catch all issues
          </p>
          <Button variant="outline" size="sm" onClick={handleAnalyze}>
            Re-analyze
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default AIDebugger

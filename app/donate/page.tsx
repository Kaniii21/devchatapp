"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Navbar from "@/components/Layout/Navbar"
import Sidebar from "@/components/Layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CreditCard, Heart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DonatePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [amount, setAmount] = useState("10")
  const [customAmount, setCustomAmount] = useState("")
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsProcessing(true)

    try {
      // In a real app, this would process the payment
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push("/donate/success")
    } catch (err: any) {
      setError(err.message || "Payment processing failed")
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center text-center mb-8">
              <Heart className="h-12 w-12 text-red-500 mb-4" />
              <h1 className="text-3xl font-bold">Support DevChat</h1>
              <p className="text-muted-foreground mt-2 max-w-md">
                Your donations help us maintain and improve DevChat for developers around the world
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>Choose an amount to support our project</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <RadioGroup value={amount} onValueChange={setAmount} className="grid grid-cols-3 gap-4">
                    <Label
                      htmlFor="amount-5"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem value="5" id="amount-5" className="sr-only" />
                      <span className="text-2xl font-bold">$5</span>
                      <span className="text-sm text-muted-foreground">One-time</span>
                    </Label>
                    <Label
                      htmlFor="amount-10"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem value="10" id="amount-10" className="sr-only" />
                      <span className="text-2xl font-bold">$10</span>
                      <span className="text-sm text-muted-foreground">One-time</span>
                    </Label>
                    <Label
                      htmlFor="amount-20"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem value="20" id="amount-20" className="sr-only" />
                      <span className="text-2xl font-bold">$20</span>
                      <span className="text-sm text-muted-foreground">One-time</span>
                    </Label>
                    <Label
                      htmlFor="amount-50"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem value="50" id="amount-50" className="sr-only" />
                      <span className="text-2xl font-bold">$50</span>
                      <span className="text-sm text-muted-foreground">One-time</span>
                    </Label>
                    <Label
                      htmlFor="amount-100"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem value="100" id="amount-100" className="sr-only" />
                      <span className="text-2xl font-bold">$100</span>
                      <span className="text-sm text-muted-foreground">One-time</span>
                    </Label>
                    <Label
                      htmlFor="amount-custom"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem value="custom" id="amount-custom" className="sr-only" />
                      <span className="text-2xl font-bold">Custom</span>
                      <span className="text-sm text-muted-foreground">Any amount</span>
                    </Label>
                  </RadioGroup>

                  {amount === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="customAmount">Custom Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="customAmount"
                          type="number"
                          min="1"
                          step="1"
                          className="pl-8"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                  )}

                  <Tabs defaultValue="card" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="card">Credit Card</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="card" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="paypal" className="space-y-4">
                      <div className="rounded-md bg-muted p-6 text-center">
                        <p className="mb-2">You'll be redirected to PayPal to complete your donation.</p>
                        <p className="text-sm text-muted-foreground">
                          PayPal securely processes your payment information.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Donate {amount === "custom" ? `$${customAmount}` : `$${amount}`}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 items-center text-center text-sm text-muted-foreground">
                <p>Your donation helps us maintain servers and develop new features.</p>
                <p>DevChat is a community-supported project. Thank you for your generosity!</p>
              </CardFooter>
            </Card>

            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-bold text-center">What Your Donation Supports</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Server Costs</h3>
                  <p className="text-sm text-muted-foreground mt-1">Keeping our infrastructure running smoothly</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">New Features</h3>
                  <p className="text-sm text-muted-foreground mt-1">Developing tools to enhance your experience</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <h3 className="font-medium">AI Integration</h3>
                  <p className="text-sm text-muted-foreground mt-1">Improving our AI debugging assistant</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

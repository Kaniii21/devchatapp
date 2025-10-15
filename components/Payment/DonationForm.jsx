"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CreditCard } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const DonationForm = () => {
  const [amount, setAmount] = useState("10")
  const [customAmount, setCustomAmount] = useState("")
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsProcessing(true)

    try {
      // In a real app, this would process the payment
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push("/donate/success")
    } catch (err) {
      setError(err.message || "Payment processing failed")
      setIsProcessing(false)
    }
  }

  return (
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
                <p className="text-sm text-muted-foreground">PayPal securely processes your payment information.</p>
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
  )
}

export default DonationForm

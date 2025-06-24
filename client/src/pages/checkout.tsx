import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { SEOHead, seoPages } from "@/components/SEOHead";

import { stripePromise } from "@/lib/stripe";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase! Credits have been added to your account.",
      });
    }
  }

  return (
    <Card className="bg-cyber-card border-cyber-border max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-cyber-cyan">Add Credits</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <Button 
            type="submit" 
            disabled={!stripe || isLoading}
            className="w-full bg-cyber-cyan text-cyber-dark hover:bg-cyber-green"
          >
            {isLoading ? "Processing..." : "Pay $2.00"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");

  useEffect(() => {
    if (paymentMethod === "stripe" && stripePromise) {
      // Create PaymentIntent as soon as the page loads
      apiRequest("POST", "/api/create-payment-intent", { amount: 2 })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret)
        })
        .catch(() => {
          // If Stripe fails, default to PayPal
          setPaymentMethod("paypal");
        });
    }
  }, [paymentMethod]);

  if (paymentMethod === "stripe" && !clientSecret && stripePromise) {
    return (
      <div className="min-h-screen bg-cyber-dark text-cyber-text flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cyber-cyan border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-cyber-cyan hover:text-cyber-green">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Console
            </Button>
          </Link>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-cyber-cyan mb-2">Add Credits</h1>
            <p className="text-cyber-text-dim">Add $2.00 credit for cybersecurity consultations</p>
          </div>

          {/* Payment Method Selection */}
          <Card className="bg-cyber-card border-cyber-border mb-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-cyber-cyan mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={paymentMethod === "stripe" ? "default" : "outline"}
                  className={`${paymentMethod === "stripe" 
                    ? "bg-cyber-cyan text-cyber-dark" 
                    : "border-cyber-border hover:border-cyber-cyan"
                  }`}
                  onClick={() => setPaymentMethod("stripe")}
                  disabled={!stripePromise}
                >
                  Credit Card
                </Button>
                <Button
                  variant={paymentMethod === "paypal" ? "default" : "outline"}
                  className={`${paymentMethod === "paypal" 
                    ? "bg-cyber-cyan text-cyber-dark" 
                    : "border-cyber-border hover:border-cyber-cyan"
                  }`}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  PayPal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Forms */}
          {paymentMethod === "stripe" && stripePromise && clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm />
            </Elements>
          ) : paymentMethod === "paypal" ? (
            <PayPalCheckout />
          ) : (
            <Card className="bg-cyber-card border-cyber-border">
              <CardContent className="p-6 text-center">
                <p className="text-cyber-text-dim">Payment services are currently unavailable. Please try again later.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, CreditCard, MessageSquare, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PayPalCheckout } from "./PayPalCheckout";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from "@/lib/stripe";

interface User {
  id: number;
  credits: string;
  hasUsedFreeQuestion: boolean;
}

interface CreditSystemProps {
  onCreditsUpdate?: (credits: string) => void;
}

const StripeCheckoutForm = ({ onSuccess, amount }: { onSuccess: () => void, amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/?payment=success",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      onSuccess();
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full bg-cyber-cyan text-cyber-dark hover:bg-cyber-green"
      >
        {isLoading ? "Processing..." : `Pay $${amount}`}
      </Button>
    </form>
  );
};

export function CreditSystem({ onCreditsUpdate }: CreditSystemProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await apiRequest("GET", "/api/user/profile");
      const userData = await response.json();
      setUser(userData);
      onCreditsUpdate?.(userData.credits);
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const handleBuyCredits = async (amount: number) => {
    if (paymentMethod === "stripe" && stripePromise) {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { amount });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful",
      description: "Credits have been added to your account!",
    });
    setIsOpen(false);
    loadUserData();
  };

  const creditPackages = [
    { amount: 5, price: 5, questions: 1, popular: false },
    { amount: 25, price: 20, questions: 5, popular: true },
    { amount: 50, price: 35, questions: 10, popular: false },
  ];

  return (
    <>
      <Button 
        variant="outline" 
        className="border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Wallet className="mr-2 h-4 w-4" />
        Credits: ${user?.credits || "0.00"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-cyber-card border-cyber-border text-cyber-text max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyber-cyan text-xl">
              <CreditCard className="inline mr-2" />
              Buy Credits
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Free Question Notice */}
            {user && !user.hasUsedFreeQuestion && (
              <Card className="bg-cyber-green/10 border-cyber-green">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-cyber-green">
                    <Gift className="h-5 w-5" />
                    <span className="font-medium">You have 1 FREE question available!</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Credit Packages */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyber-cyan">Select Credit Package</h3>
              {creditPackages.map((pkg) => (
                <Card 
                  key={pkg.amount}
                  className={`cursor-pointer transition-colors hover:border-cyber-cyan ${
                    pkg.popular ? 'border-cyber-green bg-cyber-green/5' : 'border-cyber-border'
                  }`}
                  onClick={() => handleBuyCredits(pkg.price)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-cyber-cyan">${pkg.amount}</span>
                          {pkg.popular && (
                            <span className="bg-cyber-green text-cyber-dark px-2 py-1 rounded text-xs font-medium">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-cyber-text-dim">
                          {pkg.questions} consultation{pkg.questions > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-cyber-green">${pkg.price}</div>
                        {pkg.amount > pkg.price && (
                          <div className="text-xs text-cyber-green">
                            Save ${pkg.amount - pkg.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Method Selection */}
            {clientSecret && (
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    variant={paymentMethod === "stripe" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setPaymentMethod("stripe")}
                  >
                    Credit Card
                  </Button>
                  <Button
                    variant={paymentMethod === "paypal" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    PayPal
                  </Button>
                </div>

                {/* Payment Forms */}
                {paymentMethod === "stripe" && stripePromise && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripeCheckoutForm 
                      onSuccess={handlePaymentSuccess} 
                      amount={creditPackages.find(p => p.price === 5)?.price || 5}
                    />
                  </Elements>
                ) : paymentMethod === "paypal" ? (
                  <PayPalCheckout />
                ) : null}
              </div>
            )}

            {/* Support Contact */}
            <Card className="bg-cyber-border/20 border-cyber-border">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-cyber-text-dim mb-2">Need help?</p>
                <Button
                  variant="outline"
                  className="border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark"
                  onClick={() => window.open("https://wa.me/31628073996", "_blank")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
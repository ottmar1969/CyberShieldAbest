import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function PayPalCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayPalPayment = async () => {
    setIsLoading(true);
    try {
      // Create PayPal order
      const orderResponse = await apiRequest("POST", "/api/paypal/order", {
        intent: "CAPTURE",
        amount: "2.00",
        currency: "USD"
      });
      
      const orderData = await orderResponse.json();
      
      if (orderData.links) {
        // Redirect to PayPal
        const approvalUrl = orderData.links.find((link: any) => link.rel === "approve")?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        }
      }
    } catch (error) {
      toast({
        title: "PayPal Error",
        description: "Failed to initialize PayPal payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-cyber-card border-cyber-border">
      <CardHeader>
        <CardTitle className="text-cyber-cyan flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
            <span className="text-white text-xs font-bold">PP</span>
          </div>
          PayPal Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-cyber-text-dim">Consultation Credit</span>
            <span className="text-cyber-cyan font-medium">$2.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyber-text-dim">Processing Fee</span>
            <span className="text-cyber-green">$0.00</span>
          </div>
          <hr className="border-cyber-border" />
          <div className="flex justify-between font-semibold">
            <span className="text-cyber-text">Total</span>
            <span className="text-cyber-cyan">$2.00</span>
          </div>
        </div>
        
        <Button 
          onClick={handlePayPalPayment}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Redirecting to PayPal..." : "Pay with PayPal"}
        </Button>
        
        <p className="text-xs text-cyber-text-dim text-center">
          You will be redirected to PayPal to complete your payment securely
        </p>
      </CardContent>
    </Card>
  );
}
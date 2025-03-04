
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Calendar, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { PaymentDetails } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentDetails: PaymentDetails) => void;
  onCancel: () => void;
}

const PaymentForm = ({ amount, onSuccess, onCancel }: PaymentFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { toast } = useToast();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExpiryDate(formatExpiryDate(value));
  };

  const validateForm = () => {
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
      toast({
        title: "Invalid card number",
        description: "Please enter a valid 16-digit card number.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!expiryDate.trim() || expiryDate.length < 5) {
      toast({
        title: "Invalid expiry date",
        description: "Please enter a valid expiry date (MM/YY).",
        variant: "destructive",
      });
      return false;
    }
    
    if (!cvv.trim() || cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid 3-digit CVV code.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!nameOnCard.trim()) {
      toast({
        title: "Name required",
        description: "Please enter the name on your card.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be your payment API call
      // For now, we'll simulate a successful payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentSuccess(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const paymentDetails: PaymentDetails = {
        cardNumber,
        expiryDate,
        cvv,
        nameOnCard
      };
      
      onSuccess(paymentDetails);
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="w-16 h-16 mb-4 text-green-500">
          <CheckCircle className="w-full h-full" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
        <p className="text-muted-foreground mb-6">
          Your payment of ${amount.toFixed(2)} has been processed successfully.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          We're preparing your booking confirmation...
        </p>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Secure Payment</h2>
        <p className="text-muted-foreground mt-1">
          Complete your booking by providing payment details
        </p>
      </div>
      
      <div className="bg-secondary/50 rounded-lg p-4 mb-6 flex items-center">
        <div className="mr-4 text-primary">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium">Secure Transaction</p>
          <p className="text-xs text-muted-foreground">
            Your payment information is encrypted and secure
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <Input
              id="amount"
              value={`$${amount.toFixed(2)}`}
              disabled
              className="bg-muted font-medium"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              disabled={isLoading}
              className="pl-10"
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <div className="relative">
              <Input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                maxLength={5}
                disabled={isLoading}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <div className="relative">
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
                disabled={isLoading}
                className="pl-10"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nameOnCard">Name on Card</Label>
          <Input
            id="nameOnCard"
            type="text"
            placeholder="John Doe"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="pt-2 flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "flex-1",
              isLoading && "opacity-80"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-xs text-center text-muted-foreground">
        <p>By completing this purchase, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
      </div>
    </div>
  );
};

export default PaymentForm;

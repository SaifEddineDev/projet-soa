// src/components/paiement/PaymentForm.jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentForm.css';

// Initialiser Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Créer un paiement sur le backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100 }) // Convertir en centimes
      });

      const { clientSecret } = await response.json();

      // Confirmer le paiement avec Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onSuccess(result.paymentIntent);
        }
      }
    } catch (err) {
      setError('Erreur lors du paiement');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-methods">
        <div className="method-option">
          <input type="radio" id="card" name="payment" defaultChecked />
          <label htmlFor="card">Carte bancaire</label>
        </div>
        <div className="method-option">
          <input type="radio" id="paypal" name="payment" />
          <label htmlFor="paypal">PayPal</label>
        </div>
        <div className="method-option">
          <input type="radio" id="transfer" name="payment" />
          <label htmlFor="transfer">Virement bancaire</label>
        </div>
      </div>

      <div className="card-section">
        <h4>Informations de carte</h4>
        <div className="card-input">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="payment-summary">
        <div className="summary-item">
          <span>Montant à payer</span>
          <span className="amount">{amount} €</span>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="btn-pay"
      >
        {processing ? 'Traitement...' : `Payer ${amount} €`}
      </button>

      <div className="security-info">
        <span className="secure-icon">🔒</span>
        <span>Paiement 100% sécurisé - SSL加密</span>
      </div>
    </form>
  );
};

const PaymentForm = ({ amount, reservationId, onSuccess }) => {
  return (
    <div className="payment-container">
      <Elements stripe={stripePromise}>
        <CheckoutForm 
          amount={amount} 
          onSuccess={onSuccess}
        />
      </Elements>
    </div>
  );
};

export default PaymentForm;
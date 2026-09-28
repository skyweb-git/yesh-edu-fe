import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export const PaymentStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState('Verifying your payment details...');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setLoading(false);
        setSuccess(false);
        setMessage('Missing order parameters. Could not verify payment status.');
        return;
      }

      try {
        const token = localStorage.getItem('token') || '';
        const userEmail = localStorage.getItem('userEmail') || '';
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (userEmail) headers['user-email'] = userEmail;

        const res = await fetch(`${API_BASE_URL}/api/fees/payments/verify-cashfree-order`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ orderId, paymentId })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setSuccess(true);
          setMessage('Your payment has been successfully completed and verified! Redirecting to your dashboard...');
          setTimeout(() => {
            navigate('/dashboard/parent?tab=Fees');
          }, 2500);
        } else {
          setSuccess(false);
          setMessage(data.message || 'Payment verification failed or payment was cancelled.');
        }
      } catch (err: any) {
        console.error('Error verifying payment:', err);
        setSuccess(false);
        setMessage('Network error while verifying payment status.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId, paymentId, navigate]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-stone-100 p-8 text-center">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-stone-700 animate-spin" />
            <h2 className="text-xl font-bold text-stone-900">Verifying Payment</h2>
            <p className="text-sm text-stone-500">{message}</p>
          </div>
        ) : success ? (
          <div className="py-6 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Payment Successful!</h2>
              <p className="text-stone-600 text-sm mt-2">{message}</p>
            </div>
            {orderId && (
              <div className="bg-stone-50 p-3 rounded-xl text-xs text-stone-500 font-mono">
                Order ID: {orderId}
              </div>
            )}
            <button
              onClick={() => navigate('/dashboard/parent?tab=Fees')}
              className="w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2 font-medium"
            >
              Back to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-6 space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <XCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Payment Failed</h2>
              <p className="text-stone-600 text-sm mt-2">{message}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/parent?tab=Fees')}
              className="w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2 font-medium"
            >
              Return to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

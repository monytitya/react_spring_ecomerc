import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, QrCode, AlertCircle, Loader2, ArrowLeft, Building2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { BakongKHQR, khqrData, MerchantInfo } from 'bakong-khqr';
import { paymentApi } from '../services/api';

const Checkout = () => {
  const { invoiceNo } = useParams();
  const [qr, setQr] = useState(null);
  const [status, setStatus] = useState('PENDING'); // PENDING | PAID
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [amount, setAmount] = useState(150.75); // Default, will be updated from payment creation

  const initPayment = async () => {
    try {
      // 1. First, we create/fetch a payment record in the backend
      const res = await paymentApi.create({
        orderId: invoiceNo,
        amount: amount,
        currency: "USD"
      });
      
      if (res.data?.success) {
        const pData = res.data.data;
        setTransactionId(pData.transactionId);
        setAmount(pData.amount);
        setStatus(pData.status);
        
        // 2. Use the QR string returned from backend OR generate locally
        if (pData.qrString) {
          setQr(pData.qrString);
        } else {
          generateKHQR(pData.amount);
        }
      }
    } catch (e) {
      console.error("Payment init failed", e);
      // Fallback: generate QR anyway if generic
      generateKHQR(amount);
    } finally {
      setLoading(false);
    }
  };

  const generateKHQR = (payAmount) => {
    try {
      // Ensure amount is a number and invoiceNo is a string
      const finalAmount = Number(payAmount);
      const finalInvoice = String(invoiceNo);

      const merchantInfo = new MerchantInfo(
        "dev_bakong@abc",      // Merchant Account ID
        "Blueberry Store",     // Merchant Name
        "Phnom Penh",          // Merchant City
        null,                  // Merchant ID (optional if Account ID is provided)
        "DEVBKKHPXXX",         // Acquiring Bank ID
        {
          currency: khqrData.currency.usd,
          amount: finalAmount,
          billNumber: finalInvoice,
          storeLabel: "Blueberry E-com",
          terminalLabel: "Online",
          expirationTimestamp: Date.now() + (30 * 60 * 1000)
        }
      );

      const khqr = new BakongKHQR();
      const response = khqr.generateMerchant(merchantInfo);
      
      if (response && response.data && response.data.qr) {
         setQr(response.data.qr);
         console.log("Generated KHQR locally:", response.data.qr);
      }
    } catch (e) {
      console.error("KHQR generation failed", e);
    }
  };

  const pollStatus = async () => {
    if (!transactionId || status === 'PAID') return;
    try {
      const res = await paymentApi.getStatus(transactionId);
      if (res.data.data?.status === 'PAID') {
        setStatus('PAID');
      }
    } catch (e) {
      console.error("Status check failed", e);
    }
  };

  const simulateSuccess = async () => {
    setSimulating(true);
    try {
      // Real flow: simulate a webhook callback from the bank to our server
      await paymentApi.webhook({ 
        transactionId: transactionId,
        amount: amount
      });
      // The poller will pick up the status change automatically
    } catch (e) {
      alert("Simulation failed");
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    initPayment();
  }, [invoiceNo]);

  useEffect(() => {
    let timer;
    if (transactionId && status !== 'PAID') {
      timer = setInterval(pollStatus, 3000);
    }
    return () => clearInterval(timer);
  }, [transactionId, status]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        <div className="bg-brand p-6 text-white text-center rounded-b-3xl">
          <Link to="/" className="absolute left-6 top-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <Building2 className="w-12 h-12 mx-auto mb-3 text-white/90" />
          <h1 className="text-xl font-black">Checkout</h1>
          <p className="text-sm text-white/70 mt-1">Invoice #{invoiceNo}</p>
        </div>

        <div className="p-8 flex flex-col items-center">
          {status === 'PAID' ? (
            <div className="text-center animate-in zoom-in duration-500">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-slate-900">Payment Successful!</h2>
              <p className="text-slate-500 mt-2">Check your Telegram bot for notification.</p>
              <button onClick={() => window.location.reload()} className="mt-8 w-full py-4 bg-brand text-white font-black rounded-2xl shadow-lg hover:scale-[1.02] transition-all">Back to Store</button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-slate-500 font-medium">Total Amount</p>
                <h2 className="text-3xl font-black text-slate-900 mt-1">$150.75</h2>
              </div>

              <div className="relative p-6 bg-slate-50 rounded-3xl border-2 border-brand/10 mb-8 w-full flex justify-center">
                {qr && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <QRCodeSVG value={qr} size={220} level="M" includeMargin={false} />
                  </div>
                )}
                <div className="absolute inset-0 border-4 border-brand/5 rounded-3xl pointer-events-none"></div>
              </div>

              <div className="space-y-4 w-full">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                  <QrCode className="w-5 h-5 text-brand mt-0.5" />
                  <p className="text-xs text-blue-700 font-medium">Scan the QR code with your <b>ABA</b> or <b>Wing Bank</b> app to pay instantly.</p>
                </div>

                <div className="h-1 bg-slate-100 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-brand animate-progress origin-left"></div>
                </div>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Waiting for bank confirmation...</p>

                <button 
                  onClick={simulateSuccess}
                  disabled={simulating}
                  className="mt-4 w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 hover:text-brand hover:border-brand/40 font-bold rounded-2xl text-sm transition-all flex items-center justify-center"
                >
                  {simulating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  [SIMULATE] Customer Scan & Pay
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-xs text-slate-400 font-medium flex items-center">
        <AlertCircle className="w-3 h-3 mr-1.5" /> Secure payment powered by Blueberry CRM
      </p>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 3s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default Checkout;

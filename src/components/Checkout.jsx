import React, { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { loadStripe } from '@stripe/stripe-js';
import ProductImage1 from '/R.jpg';
import ProductImage2 from '/Square.png';
import axios from 'axios';

const Checkout = () => {
  const queryClient = useQueryClient();
  const [cart, setCart] = useState([
    { productId: 'prod_PTBUbrEdPb7O5s', name: 'Product 1', quantity: 2, priceId: 'price_1OeF7VAIVa1cjuSRQCB5NqwY', price: 19.99 },
    { productId: 'prod_PTB4sFIedZTsWj', name: 'Product 2', quantity: 1, priceId: 'price_1OeEi0AIVa1cjuSRBCns97FB', price: 29.99 },
  ]);

  const calculateTotal = () => cart.reduce((total, item) => total + item.quantity * item.price, 0);

  const mutation = useMutation(
    async () => {
      try {
        
        await new Promise((resolve) => setTimeout(resolve, 2000));

        
        const orderDetails = {
          orderNumber: generateOrderNumber(),
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price.toFixed(2),
          })),
          totalQuantity: cart.reduce((total, item) => total + item.quantity, 0),
          totalPrice: calculateTotal().toFixed(2),
        };

        
        await saveOrderDetails(orderDetails);

        
        queryClient.invalidateQueries('cart');
      } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        
        console.log('Payment successful');
      },
      onError: (error) => {
        
        console.error('Error processing payment:', error);
      },
    }
  );

  const handleCheckout = async () => {
    try {
      const stripe = await loadStripe('pk_test_51Oe02BAIVa1cjuSRUPrMCHIX9mWOxM3eMs6iAMXTrdNEA1e4pcl9FtQHlrTgmds1Tb7yB2fdfo2x0XcTgCKYoGPa00jdZG3C8X');
  
      
      const oneTimeItems = cart.filter((item) => item.mode !== 'subscription');
      const subscriptionItems = cart.filter((item) => item.mode === 'subscription');
  
      
      if (oneTimeItems.length > 0) {
      
        const oneTimeCheckoutSession = await stripe.redirectToCheckout({
          lineItems: oneTimeItems.map((item) => ({ price: item.priceId, quantity: item.quantity })),
          mode: 'subscription',
          successUrl: window.location.origin + '/success',
          cancelUrl: window.location.origin + '/cancel',
        });
  
        
        if (oneTimeCheckoutSession.error) {
          console.error('Error redirecting to one-time checkout:', oneTimeCheckoutSession.error);
          return;
        }
      }
  
  
      if (subscriptionItems.length > 0) {
  
        const subscriptionCheckoutSession = await stripe.redirectToCheckout({
          lineItems: subscriptionItems.map((item) => ({ price: item.priceId, quantity: item.quantity })),
          mode: 'subscription',
          successUrl: window.location.origin + '/success',
          cancelUrl: window.location.origin + '/cancel',
        });
  
        // Handle subscription checkout session result if needed
        if (subscriptionCheckoutSession.error) {
          console.error('Error redirecting to subscription checkout:', subscriptionCheckoutSession.error);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading Stripe:', error);
    }
  };
  const generateOrderNumber = () => {
    
    return `ORDER-${Math.floor(Math.random() * 1000000)}`;
  };

  const saveOrderDetails = async (orderDetails) => {
    try {
      // Assume orderDetails is an object with the necessary information
      const response = await axios.post('/api/saveOrder', { orderDetails });
  
      // Check if the save operation was successful
      if (response.status === 200) {
        console.log('Order details saved successfully:', response.data);
        // Optionally, you can store the order details or perform additional actions
      } else {
        console.error('Failed to save order details. Server response:', response.status);
      }
    } catch (error) {
      console.error('Error saving order details:', error);
    }
  };
  

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-3xl font-semibold mb-6 text-center'>Checkout Page</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
        {cart.map((item) => (
          <div key={item.productId} className='mb-6 flex flex-col items-center'>
            <img
              src={item.productId === 'prod_PTBUbrEdPb7O5s' ? ProductImage1 : ProductImage2}
              alt={`Product ${item.productId} Image`}
              className='mb-4 max-w-full h-auto rounded-lg'
            />
            <p className='text-xl font-semibold'>{item.name}</p>
            <p className='text-gray-500'>Quantity: {item.quantity}</p>
            <p className='text-gray-500'>Price: ${item.price.toFixed(2)}</p>
            <div className='flex space-x-4 mt-4'>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
              >
                +
              </button>
              <button
                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className='mb-6'>
        <p className='text-lg text-gray-500'>Total Quantity: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
        <p className='text-lg text-gray-500'>Total Price: ${calculateTotal().toFixed(2)}</p>
      </div>
      <button
        onClick={handleCheckout} id ="pay"
        className='items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full mx-auto block'
      >
        Checkout with Stripe
      </button>
    </div>
  );
};

export default Checkout;
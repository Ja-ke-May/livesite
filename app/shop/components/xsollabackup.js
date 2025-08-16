// const handleBuy = async (sku) => {
//   const res = await fetch('https://livesite-backend.onrender.com/api/xsolla/get-token', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, sku })
//   });
//   const data = await res.json();
//   if (data.paymentUrl) {
//     window.open(data.paymentUrl, '_blank');
//   } else {
//     alert('Failed to start payment');
//   }
// };

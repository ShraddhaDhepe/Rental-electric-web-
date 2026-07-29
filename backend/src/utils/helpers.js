// Format currency in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format short date
export const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Truncate text
export const truncate = (text, length = 80) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Get discount percentage
export const getDiscountPercent = (original, current) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

// Get order status color
export const getStatusColor = (status) => {
  const colors = {
    Processing: '#f59e0b',
    Confirmed: '#3b82f6',
    Shipped: '#8b5cf6',
    Delivered: '#22c55e',
    Cancelled: '#ef4444',
    Returned: '#f59e0b',
    'Refund Initiated': '#f59e0b',
    Refunded: '#22c55e'
  };
  return colors[status] || '#6c757d';
};

// Compute cart totals
export const computeCartTotals = (items = []) => {
  let itemsPrice = 0;
  let securityDeposit = 0;

  items.forEach((item) => {
    if (item.orderType === 'rent' && item.rentalPlan) {
      itemsPrice += item.rentalPlan.totalAmount;
      securityDeposit += item.rentalPlan.securityDeposit;
    } else {
      itemsPrice += item.price * item.quantity;
    }
  });

  const deliveryCharges = itemsPrice > 999 ? 0 : 49;
  const totalAmount = itemsPrice + securityDeposit + deliveryCharges;

  return { itemsPrice, securityDeposit, deliveryCharges, totalAmount };
};

// Stars array for given rating
export const starsArray = (rating) => {
  return Array.from({ length: 5 }, (_, i) => ({
    filled: i < Math.floor(rating),
    half: i === Math.floor(rating) && rating % 1 >= 0.5
  }));
};

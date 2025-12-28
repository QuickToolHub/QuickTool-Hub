// DOM Elements
const billingToggle = document.getElementById('billingToggle');
const freePrice = document.getElementById('freePrice');
const proPrice = document.getElementById('proPrice');
const businessPrice = document.getElementById('businessPrice');
const freePeriod = document.getElementById('freePeriod');
const proPeriod = document.getElementById('proPeriod');
const businessPeriod = document.getElementById('businessPeriod');
const paymentModal = document.getElementById('paymentModal');
const paymentForm = document.getElementById('paymentForm');

// Pricing data
const monthlyPrices = {
    free: { price: 0, period: 'forever' },
    pro: { price: 9.99, period: 'per month' },
    business: { price: 29.99, period: 'per month' }
};

const yearlyPrices = {
    free: { price: 0, period: 'forever' },
    pro: { price: 71.99, period: 'per year' },
    business: { price: 215.99, period: 'per year' }
};

// Initialize prices
updatePrices();

// Billing toggle handler
billingToggle.addEventListener('change', updatePrices);

function updatePrices() {
    const isYearly = billingToggle.checked;
    const prices = isYearly ? yearlyPrices : monthlyPrices;
    
    freePrice.textContent = `$${prices.free.price}`;
    proPrice.textContent = `$${prices.pro.price}`;
    businessPrice.textContent = `$${prices.business.price}`;
    
    freePeriod.textContent = prices.free.period;
    proPeriod.textContent = prices.pro.period;
    businessPeriod.textContent = prices.business.period;
}

// Plan selection
let selectedPlan = '';

function selectPlan(plan) {
    selectedPlan = plan;
    const isYearly = billingToggle.checked;
    const prices = isYearly ? yearlyPrices : monthlyPrices;
    
    // Update modal
    document.getElementById('modalPlanName').textContent = 
        plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
    
    document.getElementById('modalPrice').textContent = 
        plan === 'free' ? 'FREE' : `$${prices[plan].price}`;
    
    document.getElementById('modalPeriod').textContent = prices[plan].period;
    document.getElementById('planType').value = plan;
    document.getElementById('payButtonText').textContent = 
        plan === 'free' ? 'Start Free Plan' : `Pay $${prices[plan].price}`;
    
    // Show modal
    paymentModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetPaymentForm();
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === paymentModal) {
        closeModal();
    }
}

// Payment method selection
function selectPayment(method) {
    document.getElementById('paymentMethod').value = method;
    
    // Update UI
    document.querySelectorAll('.method').forEach(el => {
        el.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Show card details if credit card selected
    const cardDetails = document.getElementById('cardDetails');
    cardDetails.style.display = method === 'card' ? 'block' : 'none';
}

// Form submission
paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const plan = document.getElementById('planType').value;
    const email = document.getElementById('email').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!paymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardNumber || !expiry || !cvv) {
            alert('Please fill all card details');
            return;
        }
    }
    
    // Process payment
    processPayment(plan, email, paymentMethod);
});

function processPayment(plan, email, paymentMethod) {
    const isYearly = billingToggle.checked;
    const price = isYearly ? yearlyPrices[plan].price : monthlyPrices[plan].price;
    const period = isYearly ? 'year' : 'month';
    
    // Show loading
    const submitBtn = paymentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage (simulating database)
        const subscription = {
            plan: plan,
            email: email,
            price: price,
            period: period,
            paymentMethod: paymentMethod,
            date: new Date().toISOString(),
            status: 'active'
        };
        
        localStorage.setItem('quicktoolhub_subscription', JSON.stringify(subscription));
        
        // Redirect to success page
        window.location.href = 'success.html';
    }, 2000);
}

function resetPaymentForm() {
    paymentForm.reset();
    document.getElementById('paymentMethod').value = '';
    document.getElementById('cardDetails').style.display = 'none';
    document.querySelectorAll('.method').forEach(el => {
        el.classList.remove('active');
    });
}

// Check existing subscription on page load
window.onload = function() {
    const subscription = localStorage.getItem('quicktoolhub_subscription');
    if (subscription) {
        const data = JSON.parse(subscription);
        console.log('Existing subscription:', data);
        // You can show a message or redirect to dashboard
    }
};

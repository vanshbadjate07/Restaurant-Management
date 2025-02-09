let orderItems = {};
let total = 0;

function proceedToMenu() {
    const tableNumber = document.getElementById('tableNumber').value;
    if (!tableNumber) {
        alert('Please select a table number first!');
        return;
    }
    localStorage.setItem('tableNumber', tableNumber);
    window.location.href = 'menu.html';
}

function goToPage(page) {
    window.location.href = page;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
        notification.remove();
    }, 3000);
}

function updateTableInfo() {
    const tableInfo = document.getElementById('tableInfo');
    if (tableInfo) {
        const tableNumber = localStorage.getItem('tableNumber');
        tableInfo.textContent = `Table ${tableNumber}`;
    }
}

function loadSavedItems() {
    const savedItems = JSON.parse(localStorage.getItem('orderItems') || '{}');
    orderItems = savedItems;

    for (const [item, details] of Object.entries(orderItems)) {
        const quantityElement = document.getElementById(`${item}-quantity`);
        if (quantityElement) {
            quantityElement.textContent = details.quantity;
        }
    }

    updateOrderDisplay();
}

function increaseQuantity(item, price) {
    if (!orderItems[item]) {
        orderItems[item] = { quantity: 0, price: price };
    }
    orderItems[item].quantity++;
    updateOrderDisplay();
    document.getElementById(`${item}-quantity`).textContent = orderItems[item].quantity;
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
}

function decreaseQuantity(item) {
    if (orderItems[item] && orderItems[item].quantity > 0) {
        orderItems[item].quantity--;
        if (orderItems[item].quantity === 0) {
            delete orderItems[item];
        }
        updateOrderDisplay();
        const quantityElement = document.getElementById(`${item}-quantity`);
        quantityElement.textContent = orderItems[item]?.quantity || 0;
        localStorage.setItem('orderItems', JSON.stringify(orderItems));
    }
}

function updateOrderDisplay() {
    const currentOrder = document.getElementById('currentOrder');
    const orderTotal = document.getElementById('orderTotal');
    if (!currentOrder || !orderTotal) return;

    currentOrder.innerHTML = '';
    total = 0;

    for (const [item, details] of Object.entries(orderItems)) {
        if (details.quantity > 0) {
            const itemTotal = details.quantity * details.price;
            total += itemTotal;
            const orderItem = document.createElement('p');
            orderItem.textContent = `${item} x${details.quantity} - ₹${itemTotal}`;
            currentOrder.appendChild(orderItem);
        }
    }

    orderTotal.textContent = total;
    localStorage.setItem('total', total);
}

function proceedToBill() {
    if (Object.keys(orderItems).length === 0) {
        alert('Please add items to your order first!');
        return;
    }
    window.location.href = 'bill.html';
}

function loadBill() {
    const billItems = document.getElementById('billItems');
    const totalElement = document.getElementById('totalAmount');
    if (!billItems || !totalElement) return;

    const savedItems = JSON.parse(localStorage.getItem('orderItems') || '{}');
    const tableNumber = localStorage.getItem('tableNumber');
    const savedTotal = localStorage.getItem('total');

    billItems.innerHTML = `<h3>Table ${tableNumber}</h3>`;

    for (const [item, details] of Object.entries(savedItems)) {
        const li = document.createElement('li');
        li.textContent = `${item} x${details.quantity} - ₹${details.quantity * details.price}`;
        billItems.appendChild(li);
    }

    totalElement.textContent = `Total: ₹${savedTotal}`;
}

function sendOrderEmail(orderDetails) {
    const templateParams = {
        to_email: 'dawangeshruti29@gmail.com',
        table_number: orderDetails.tableNumber,
        order_items: orderDetails.items,
        total_amount: `₹${orderDetails.total}`
    };

    return emailjs.send('service_95rjb4k', 'template_gzyotff', templateParams);
}

function placeOrder() {
    const tableNumber = localStorage.getItem('tableNumber');
    const orderDetails = JSON.parse(localStorage.getItem('orderItems'));
    const totalAmount = localStorage.getItem('total');

    if (!tableNumber || !orderDetails || !totalAmount) {
        showNotification('Order details are missing. Please try again.');
        return;
    }

    let orderItemsList = Object.entries(orderDetails)
        .map(([item, details]) => `${item} x${details.quantity} - ₹${details.quantity * details.price}`)
        .join('\n'); 

    const emailOrderDetails = {
        tableNumber: tableNumber,
        items: orderItemsList,
        total: totalAmount
    };

    sendOrderEmail(emailOrderDetails)
        .then(() => {
            showNotification('Order placed successfully! Email notification sent.');

            // Clear stored order data
            localStorage.removeItem('orderItems');
            localStorage.removeItem('total');
            localStorage.removeItem('tableNumber');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            showNotification('Error placing order. Please try again.');
        });
}



function toggleChat() {
    const chatbot = document.getElementById('chatbot');
    if (chatbot) {
        chatbot.style.display = chatbot.style.display === 'none' || chatbot.style.display === '' ? 'flex' : 'none';
    }
}

function addMessage(message, isUser = false) {
    const messagesDiv = document.getElementById('chatMessages');
    if (messagesDiv) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

const chatbotResponses = {
    best_starter: "Our best starter dish is Paneer Tikka—a flavorful and smoky grilled paneer marinated in spices. However, if you love street food, Vada Pav is also a must-try!",
    dessert_options: "We serve a variety of delicious desserts, including Gulab Jamun, Rasgulla, Kaju Katli, and Gajar ka Halwa. Perfect to satisfy your sweet cravings!",
    special_dish: "Our special dish is Paneer Butter Masala, a rich and creamy paneer curry loved by our customers. If you enjoy a spicy kick, you should also try Misal!",
    south_indian: "We offer authentic South Indian delights like Dosa, Idli, Medu Vada, and Uttapam. Served with flavorful chutneys and sambar!",
    payment_methods: "We accept all major credit/debit cards, UPI payments, and cash.",
    spicy_dishes: "If you love spicy food, we recommend trying Misal—a fiery Maharashtrian dish, and Chole Bhature, which has a rich and flavorful spice blend!",
    veg_options: "Yes! Our entire menu is pure vegetarian, offering delicious options from starters to desserts.",
    delivery: "Yes, we do! You can order online and get your food delivered to your doorstep. Contact us for more details.",
    allergies: "We take food allergies seriously. Please inform our staff about any allergies, and we’ll ensure that your food is prepared with utmost care.",
    waiting_time: "Our average waiting time is around 15-20 minutes, depending on the order size. We strive to serve you fresh and delicious food as quickly as possible!"
};

function handleQuestionSelect() {
    const select = document.getElementById('questionSelect');
    if (select) {
        const selectedQuestion = select.options[select.selectedIndex].text;
        const selectedValue = select.value;

        if (selectedValue) {
            addMessage(selectedQuestion, true);
            setTimeout(() => {
                addMessage(chatbotResponses[selectedValue], false);
            }, 500);
            select.value = "";
        }
    }
}

function filterCategory(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    const buttons = document.querySelectorAll('.category-btn');

    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === category || 
            (category === 'all' && btn.textContent.toLowerCase() === 'all')) {
            btn.classList.add('active');
        }
    });

    menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateTableInfo();

    if (window.location.pathname.endsWith('menu.html')) {
        loadSavedItems();
    }
    if (window.location.pathname.endsWith('bill.html')) {
        loadBill();
    }
});
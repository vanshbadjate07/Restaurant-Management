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

    // Update quantity displays for all items
    for (const [item, details] of Object.entries(orderItems)) {
        const quantityElement = document.getElementById(`${item}-quantity`);
        if (quantityElement) {
            quantityElement.textContent = details.quantity;
        }
    }

    // Update the order display
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
        to_email: 'badjatevansh1008@gmail.com',
        table_number: orderDetails.tableNumber,
        order_items: orderDetails.items,
        total_amount: orderDetails.total
    };

    return emailjs.send(
        'service_6t7pcpg',
        'template_1j3djsh',
        templateParams
    );
}

function placeOrder() {
    const tableNumber = localStorage.getItem('tableNumber');
    const orderDetails = JSON.parse(localStorage.getItem('orderItems'));
    const totalAmount = localStorage.getItem('total');

    let orderItemsList = '';
    for (const [item, details] of Object.entries(orderDetails)) {
        orderItemsList += `${item} x${details.quantity}\n`;
    }

    const emailOrderDetails = {
        tableNumber: tableNumber,
        items: orderItemsList,
        total: totalAmount
    };

    sendOrderEmail(emailOrderDetails)
        .then(() => {
            showNotification('Order placed successfully! Email notification sent.');
            
            // Clear the order data
            localStorage.removeItem('orderItems');
            localStorage.removeItem('total');
            localStorage.removeItem('tableNumber');
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            showNotification('Error placing order. Please try again.');
        });
}

// Chatbot functionality
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
    best_starter: "Our Spring Rolls are highly recommended as a starter. They're crispy, fresh, and come with a delicious dipping sauce.",
    dessert_options: "We have a variety of desserts including Gulab Jamun, Ice Cream, and our special Chocolate Brownie.",
    special_dish: "Our special dish is the authentic Misal - a spicy curry served with pav bread. It's a local favorite!",
    south_indian: "We serve classic South Indian dishes like Dosa, Medu Vada, and Filter Coffee. All made with authentic recipes.",
    payment_methods: "We accept all major credit/debit cards, UPI payments, and cash.",
    spicy_dishes: "Misal and some of our South Indian dishes are spicy. Please let us know if you prefer less spicy options.",
    veg_options: "Yes, we have many vegetarian options including South Indian dishes, Pizza, and various starters.",
    delivery: "Yes, we provide home delivery within a 5km radius. Please call our delivery number for details.",
    allergies: "Please inform our staff about any allergies. We take food allergies seriously and can customize dishes accordingly.",
    waiting_time: "During peak hours, the average waiting time is 15-20 minutes. Off-peak hours usually have minimal wait times."
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
            select.value = ""; // Reset select
        }
    }
}

// Category filtering
function filterCategory(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    const buttons = document.querySelectorAll('.category-btn');

    // Update active button
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === category || 
            (category === 'all' && btn.textContent.toLowerCase() === 'all')) {
            btn.classList.add('active');
        }
    });

    // Filter items
    menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Initialize page-specific elements
document.addEventListener('DOMContentLoaded', function() {
    updateTableInfo();

    // Load saved items if we're on the menu page
    if (window.location.pathname.endsWith('menu.html')) {
        loadSavedItems();
    }

    // Load bill if we're on the bill page
    if (window.location.pathname.endsWith('bill.html')) {
        loadBill();
    }
});
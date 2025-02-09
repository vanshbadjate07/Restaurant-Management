let orderItems = {};
let total = 0;
let currentLanguage = 'en';

const questions = {
    en: {
        best_starter: "What is the best starter dish?",
        dessert_options: "What desserts do you have?",
        special_dish: "What is your special dish?",
        south_indian: "What South Indian dishes do you serve?",
        payment_methods: "What payment methods do you accept?",
        spicy_dishes: "Which dishes are spicy?",
        veg_options: "Do you have vegetarian options?",
        delivery: "Do you provide home delivery?",
        allergies: "How do you handle food allergies?",
        waiting_time: "What's the average waiting time?"
    },
    mr: {
        best_starter: "सर्वोत्तम स्टार्टर डिश कोणती आहे?",
        dessert_options: "तुमच्याकडे कोणते डेझर्ट्स आहेत?",
        special_dish: "तुमची स्पेशल डिश कोणती आहे?",
        south_indian: "तुम्ही कोणती दक्षिण भारतीय जेवणे सर्व्ह करता?",
        payment_methods: "तुम्ही कोणती पेमेंट पद्धत स्वीकारता?",
        spicy_dishes: "कोणती जेवणे तिखट आहेत?",
        veg_options: "तुमच्याकडे शाकाहारी पर्याय आहेत का?",
        delivery: "तुम्ही होम डिलिव्हरी करता का?",
        allergies: "तुम्ही फूड अॅलर्जीज कशा हाताळता?",
        waiting_time: "सरासरी वेटिंग टाइम किती आहे?"
    }
};

const chatbotResponses = {
    en: {
        best_starter: "Our best starter dish is Paneer Tikka—a flavorful and smoky grilled paneer marinated in spices. However, if you love street food, Vada Pav is also a must-try!",
        dessert_options: "We serve a variety of delicious desserts, including Gulab Jamun, Rasgulla, Kaju Katli, and Gajar ka Halwa. Perfect to satisfy your sweet cravings!",
        special_dish: "Our special dish is Paneer Butter Masala, a rich and creamy paneer curry loved by our customers. If you enjoy a spicy kick, you should also try Misal!",
        south_indian: "We offer authentic South Indian delights like Dosa, Idli, Medu Vada, and Uttapam. Served with flavorful chutneys and sambar!",
        payment_methods: "We accept all major credit/debit cards, UPI payments, and cash.",
        spicy_dishes: "If you love spicy food, we recommend trying Misal—a fiery Maharashtrian dish, and Chole Bhature, which has a rich and flavorful spice blend!",
        veg_options: "Yes! Our entire menu is pure vegetarian, offering delicious options from starters to desserts.",
        delivery: "Yes, we do! You can order online and get your food delivered to your doorstep. Contact us for more details.",
        allergies: "We take food allergies seriously. Please inform our staff about any allergies, and we'll ensure that your food is prepared with utmost care.",
        waiting_time: "Our average waiting time is around 15-20 minutes, depending on the order size. We strive to serve you fresh and delicious food as quickly as possible!"
    },
    mr: {
        best_starter: "आमची सर्वोत्तम स्टार्टर डिश पनीर टिक्का आहे - मसाल्यात मॅरिनेट केलेला स्वादिष्ट आणि स्मोकी ग्रिल्ड पनीर. तथापि, जर तुम्हाला स्ट्रीट फूड आवडत असेल तर वडा पाव देखील ट्राय करण्यासारखा आहे!",
        dessert_options: "आम्ही विविध प्रकारचे स्वादिष्ट डेझर्ट्स सर्व्ह करतो, ज्यामध्ये गुलाब जामून, रसगुल्ला, काजू कतली आणि गाजर का हलवा समाविष्ट आहे. तुमची गोड खाण्याची इच्छा पूर्ण करण्यासाठी परफेक्ट!",
        special_dish: "आमची स्पेशल डिश पनीर बटर मसाला आहे, एक समृद्ध आणि क्रीमी पनीर करी जी आमच्या ग्राहकांना आवडते. जर तुम्हाला तिखट आवडत असेल तर मिसळ देखील ट्राय करा!",
        south_indian: "आम्ही डोसा, इडली, मेदू वडा आणि उत्तपम सारखे दक्षिण भारतीय पदार्थ ऑफर करतो. स्वादिष्ट चटणी आणि सांबार सोबत सर्व्ह केले जाते!",
        payment_methods: "आम्ही सर्व प्रमुख क्रेडिट/डेबिट कार्ड्स, UPI पेमेंट्स आणि रोख स्वीकारतो.",
        spicy_dishes: "जर तुम्हाला तिखट जेवण आवडत असेल तर आम्ही मिसळ - एक तिखट महाराष्ट्रीयन डिश, आणि छोले भटुरे ट्राय करण्याची शिफारस करतो!",
        veg_options: "हो! आमचे संपूर्ण मेनू शुद्ध शाकाहारी आहे, स्टार्टर्स पासून डेझर्ट्स पर्यंत स्वादिष्ट पर्याय देतो.",
        delivery: "हो, आम्ही करतो! तुम्ही ऑनलाइन ऑर्डर करू शकता आणि तुमचे जेवण तुमच्या दारापर्यंत मिळवू शकता. अधिक माहितीसाठी आमच्याशी संपर्क साधा.",
        allergies: "आम्ही फूड अॅलर्जीज गांभीर्याने घेतो. कृपया आमच्या स्टाफला कोणत्याही अॅलर्जीबद्दल सांगा, आणि आम्ही तुमचे जेवण अत्यंत काळजीपूर्वक तयार करण्याची खात्री करू.",
        waiting_time: "आमचा सरासरी वेटिंग टाइम ऑर्डरच्या साइझनुसार 15-20 मिनिटे आहे. आम्ही तुम्हाला ताजे आणि स्वादिष्ट जेवण शक्य तितक्या लवकर सर्व्ह करण्याचा प्रयत्न करतो!"
    }
};

function changeLanguage(lang) {
    currentLanguage = lang;
    document.getElementById('en-btn').classList.toggle('active', lang === 'en');
    document.getElementById('mr-btn').classList.toggle('active', lang === 'mr');
    
    // Update question select options
    const select = document.getElementById('questionSelect');
    select.innerHTML = '<option value="">Select a question...</option>';
    
    Object.entries(questions[currentLanguage]).forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        select.appendChild(option);
    });
}

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

function handleQuestionSelect() {
    const select = document.getElementById('questionSelect');
    if (select) {
        const selectedQuestion = select.options[select.selectedIndex].text;
        const selectedValue = select.value;

        if (selectedValue) {
            addMessage(selectedQuestion, true);
            setTimeout(() => {
                addMessage(chatbotResponses[currentLanguage][selectedValue], false);
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
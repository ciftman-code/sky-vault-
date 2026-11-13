const translations = {
    ar: {
        nav_home: "الرئيسية",
        nav_stats: "الإحصائيات",
        nav_bazaar: "البازار",
        nav_minions: "المينيونز",
        nav_events: "الأحداث",
        hero_desc: "مرجعك الشامل لإحصائيات، أدوات، وأسرار Hypixel SkyBlock",
        search_btn: "بحث",
        stats_title: "إحصائيات اللاعب والبروفايل",
        skills_level: "مستوى المهارات",
        bazaar_title: "حاسبة البازار (Bazaar Flipper)",
        item_name: "اسم العنصر:",
        buy_price: "سعر الشراء:",
        sell_price: "سعر البيع:",
        calculate_btn: "حساب الربح",
        minions_title: "حاسبة أرباح المينيونز",
        minion_type: "نوع المينيون:",
        fuel_type: "نوع الوقود (Fuel):",
        events_title: "الأحداث والأوقات (SkyBlock Events)",
        dark_auction: "Dark Auction",
        jacob_contest: "Jacob's Farming Contest",
        enable_notif: "تفعيل إشعارات الأحداث",
        test_notif: "تجربة التنبيه",
        footer_by: "صُمم بواسطة"
    },
    en: {
        nav_home: "Home",
        nav_stats: "Stats",
        nav_bazaar: "Bazaar",
        nav_minions: "Minions",
        nav_events: "Events",
        hero_desc: "Your comprehensive guide for Hypixel SkyBlock stats, tools, and secrets",
        search_btn: "Search",
        stats_title: "Player Stats & Profile",
        skills_level: "Skills Level",
        bazaar_title: "Bazaar Flipper Calculator",
        item_name: "Item Name:",
        buy_price: "Buy Price:",
        sell_price: "Sell Price:",
        calculate_btn: "Calculate Profit",
        minions_title: "Minion Profit Calculator",
        minion_type: "Minion Type:",
        fuel_type: "Fuel Type:",
        events_title: "SkyBlock Events & Timers",
        dark_auction: "Dark Auction",
        jacob_contest: "Jacob's Farming Contest",
        enable_notif: "Enable Event Notifications",
        test_notif: "Test Notification",
        footer_by: "Designed by"
    },
    fr: {
        nav_home: "Accueil",
        nav_stats: "Stats",
        nav_bazaar: "Bazaar",
        nav_minions: "Minions",
        nav_events: "Événements",
        hero_desc: "Votre guide complet pour les statistiques, outils et secrets d'Hypixel SkyBlock",
        search_btn: "Rechercher",
        stats_title: "Statistiques du Joueur",
        skills_level: "Niveau des Compétences",
        bazaar_title: "Calculateur Bazaar Flipper",
        item_name: "Nom de l'article:",
        buy_price: "Prix d'achat:",
        sell_price: "Prix de vente:",
        calculate_btn: "Calculer le Profit",
        minions_title: "Calculateur de Minions",
        minion_type: "Type de Minion:",
        fuel_type: "Type de Carburant:",
        events_title: "Événements et Minuteries SkyBlock",
        dark_auction: "Dark Auction",
        jacob_contest: "Jacob's Farming Contest",
        enable_notif: "Activer les Notifications",
        test_notif: "Tester la Notification",
        footer_by: "Conçu par"
    },
    es: {
        nav_home: "Inicio",
        nav_stats: "Estadísticas",
        nav_bazaar: "Bazaar",
        nav_minions: "Minions",
        nav_events: "Eventos",
        hero_desc: "Tu guía completa para estadísticas, herramientas y secretos de Hypixel SkyBlock",
        search_btn: "Buscar",
        stats_title: "Estadísticas del Jugador",
        skills_level: "Nivel de Habilidades",
        bazaar_title: "Calculadora de Bazaar Flipper",
        item_name: "Nombre del artículo:",
        buy_price: "Precio de compra:",
        sell_price: "Precio de venta:",
        calculate_btn: "Calcular Ganancia",
        minions_title: "Calculadora de Minions",
        minion_type: "Tipo de Minion:",
        fuel_type: "Tipo de Combustible:",
        events_title: "Eventos y Temporizadores de SkyBlock",
        dark_auction: "Dark Auction",
        jacob_contest: "Jacob's Farming Contest",
        enable_notif: "Activar Notificaciones",
        test_notif: "Probar Notificación",
        footer_by: "Diseñado por"
    },
    ru: {
        nav_home: "Главная",
        nav_stats: "Статистика",
        nav_bazaar: "Базар",
        nav_minions: "Миньоны",
        nav_events: "События",
        hero_dest: "Ваш полный гид по статистике, инструментам и секретам Hypixel SkyBlock",
        search_btn: "Поиск",
        stats_title: "Статистика игрока",
        skills_level: "Уровень навыков",
        bazaar_title: "Калькулятор базара",
        item_name: "Название предмета:",
        buy_price: "Цена покупки:",
        sell_price: "Цена продажи:",
        calculate_btn: "Рассчитать прибыль",
        minions_title: "Калькулятор миньонов",
        minion_type: "Тип миньона:",
        fuel_type: "Тип топлива:",
        events_title: "События и таймеры SkyBlock",
        dark_auction: "Dark Auction",
        jacob_contest: "Jacob's Farming Contest",
        enable_notif: "Включить уведомления",
        test_notif: "Тест уведомления",
        footer_by: "Разработано"
    }
};

const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active-section'));

        link.classList.add('active');
        const targetId = link.getAttribute('href').substring(1);
        document.getElementById(targetId).classList.add('active-section');
    });
});

const langSelect = document.getElementById('langSelect');
langSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    const isRtl = lang === 'ar';
    document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
});

const searchBtn = document.getElementById('searchBtn');
const ignInput = document.getElementById('ignInput');

function performSearch() {
    const ign = ignInput.value.trim();
    if (ign === "") {
        alert("المرجو إدخال اسم اللاعب (IGN) أولاً!");
        return;
    }
    
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active-section'));
    
    document.querySelector('a[href="#stats"]').classList.add('active');
    document.getElementById('stats').classList.add('active-section');
    
    document.getElementById('networthVal').textContent = `${ign}'s Networth: 2,543,980,111 coins`;
}

searchBtn.addEventListener('click', performSearch);
ignInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

document.getElementById('calcBazaar').addEventListener('click', () => {
    const buy = parseFloat(document.getElementById('buyPrice').value) || 0;
    const sell = parseFloat(document.getElementById('sellPrice').value) || 0;
    const tax = sell * 0.0125;
    const profit = (sell - buy) - tax;
    const resBox = document.getElementById('bazaarResult');
    resBox.innerHTML = `الربح الصافي بعد ضريبة 1.25%: <strong>${profit.toLocaleString()} coins</strong>`;
});

document.getElementById('toggleNotif').addEventListener('click', () => {
    if (Notification && Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                alert("تم تفعيل إشعارات المتصفح بنجاح!");
            }
        });
    } else {
        alert("الإشعارات مفعلة مسبقاً أو غير مدعومة.");
    }
});

document.getElementById('testNotif').addEventListener('click', () => {
    if (Notification && Notification.permission === "granted") {
        new Notification("Skyblock Hub", {
            body: "تنبيه تجريبي: قرب موعد Dark Auction!",
            icon: "https://minecraft.wiki/images/Gold_Ingot_JE3_BE2.png"
        });
    } else {
        alert("يرجى تفعيل إشعارات المتصفح أولاً.");
    }
});

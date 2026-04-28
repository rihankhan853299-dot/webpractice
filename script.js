let khataRegister = JSON.parse(localStorage.getItem("proKhata")) || {};

function calculateShopTotal() {
    let totalDukanKaUdhar = 0;
    for (let grahak in khataRegister) {
        totalDukanKaUdhar += khataRegister[grahak].totalBalance;
    }
    document.getElementById("totalShopBalance").innerText = "₹" + totalDukanKaUdhar;
}

function addTransaction(type) {
    let name = document.getElementById("customerName").value.trim();
    let money = Number(document.getElementById("amount").value);
    let items = document.getElementById("items").value;

    if (name === "" || money <= 0) {
        alert("Bhai, naam aur paise sahi se likho!");
        return;
    }

    let now = new Date();
    let exactTime = now.toLocaleString("en-IN");

    if (khataRegister[name] === undefined) {
        khataRegister[name] = { totalBalance: 0, history:[] };
    }

    if (type === 'udhar') {
        khataRegister[name].totalBalance += money;
        khataRegister[name].history.push({
            type: 'udhar',
            amount: money,
            samaan: items || "Udhar Samaan",
            time: exactTime
        });
    } else if (type === 'jama') {
        khataRegister[name].totalBalance -= money;
        khataRegister[name].history.push({
            type: 'jama',
            amount: money,
            samaan: items || "Paise Jama Kiye",
            time: exactTime
        });
    }

    localStorage.setItem("proKhata", JSON.stringify(khataRegister));

    document.getElementById("customerName").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("items").value = "";

    updateScreen();
}

// 🌟 NAYA FUNCTION: WhatsApp par Detail Bhejna
function sendToWhatsApp(grahakKaNaam) {
    let grahakKaData = khataRegister[grahakKaNaam];
    
    // Line 1: Message banana shuru karo ( \n ka matlab hai Nayi Line yani Enter dabana )
    let message = `📘 *Jamshaid Kirana store udhaar Statement* 📘\n\n`;
    message += `👤 *Grahak ka Naam:* ${grahakKaNaam}\n`;
    message += `💰 *Aapka Baki Balance:* ₹${grahakKaData.totalBalance}\n\n`;
    message += `*--- Aapke Hisaab ki Details ---*\n`;

    // Line 2: Grahak ki history mein loop chalakar ek-ek bill msg mein dalo
    grahakKaData.history.forEach(function(bill) {
        let nishan = bill.type === 'udhar' ? '+ ₹' : '- ₹';
        message += `🗓️ ${bill.time}\n📝 ${bill.samaan} : ${nishan}${bill.amount}\n\n`;
    });

    message += `🙏 Kripya apna hisaab check kar lein. Koi gadbad ho toh batayein!`;

    // Line 3: Is normal text message ko "Internet (URL)" ke samajhne layk code mein badalna
    let internetWalaMessage = encodeURIComponent(message);

    // Line 4: WhatsApp ki website ya App kholna, message ke saath
    let whatsappLink = `https://wa.me/?text=${internetWalaMessage}`;
    
    // Naye tab (panna) mein link khol do
    window.open(whatsappLink, '_blank');
}

function updateScreen(searchWord = "") {
    let listDiv = document.getElementById("accountList");
    listDiv.innerHTML = "";

    for (let grahak in khataRegister) {
        if (grahak.toLowerCase().includes(searchWord.toLowerCase())) {
            
            let grahakKaData = khataRegister[grahak];
            let historyHTML = "";
            let reversedHistory =[...grahakKaData.history].reverse();

            reversedHistory.forEach(function(bill) {
                let amountColorClass = bill.type === 'udhar' ? 'text-red' : 'text-green';
                let sign = bill.type === 'udhar' ? '+ ₹' : '- ₹';

                historyHTML += `
                    <li class="history-item">
                        <div>
                            <span>${bill.samaan}</span>
                            <span class="date-time">🕒 ${bill.time}</span>
                        </div>
                        <span class="${amountColorClass}">${sign}${bill.amount}</span>
                    </li>
                `;
            });

            let balanceColor = grahakKaData.totalBalance > 0 ? "color: #dc3545;" : "color: #28a745;";

            // 🌟 UPDATE: Yahan maine "WhatsApp Par Bhejein" wala naya button add kiya hai
            listDiv.innerHTML += `
                <div class="account-card">
                    <div class="card-header" style="flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; width: 100%;">
                            <h4>👤 ${grahak}</h4>
                            <span class="total-amt" style="${balanceColor}">₹${grahakKaData.totalBalance} Baki</span>
                        </div>
                        <button class="btn-whatsapp" onclick="sendToWhatsApp('${grahak}')">
                            📲 WhatsApp Par Pura Hisaab Bhejein
                        </button>
                    </div>
                    <ul class="history-list">
                        ${historyHTML}
                    </ul>
                </div>
            `;
        }
    }
    
    calculateShopTotal();
}

function searchCustomer() {
    let word = document.getElementById("searchInput").value;
    updateScreen(word);
}

updateScreen();

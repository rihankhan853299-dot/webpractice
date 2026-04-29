// Memory se purana register nikalo, agar nahi hai toh khali register '{}' bana do
let khataRegister = JSON.parse(localStorage.getItem("proKhataV5")) || {};

// 🌟 FUNCTION 1: Dukan ka total paise jodna
function calculateShopTotal() {
    let totalDukanKaUdhar = 0; // Shuru mein total 0 hai
    
    // Har ek grahak ke panno par jao
    for (let grahak in khataRegister) {
        // Unka udhar (totalBalance) dukan ke total mein jod do
        totalDukanKaUdhar += khataRegister[grahak].totalBalance;
    }
    
    // Screen par nile dabbe mein total dikha do
    document.getElementById("totalShopBalance").innerText = "₹" + totalDukanKaUdhar;
}

// 🌟 FUNCTION 2: Naya Udhar ya Jama likhna
function addTransaction(type) {
    // Box se naam, paise aur samaan nikalo (trim() aage-peeche ki khali jagah hata deta hai)
    let name = document.getElementById("customerName").value.trim();
    let money = Number(document.getElementById("amount").value);
    let items = document.getElementById("items").value;

    // Agar naam nahi likha ya paise 0 hain, toh Warning do aur aage kaam mat karo
    if (name === "" || money <= 0) {
        alert("Bhai, naam aur paise dono likhna zaroori hai!");
        return; 
    }

    // Aaj ki exact Date aur Time nikalo
    let exactTime = new Date().toLocaleString("en-IN");
    
    // NAYA: Har ek lenden (transaction) ko ek Password (ID) de rahe hain, taaki baad mein edit kar sakein
    let uniqueId = Date.now(); 

    // Agar grahak ka naam register mein nahi hai, toh uska naya page (object) banao
    if (khataRegister[name] === undefined) {
        khataRegister[name] = { totalBalance: 0, history:[] };
    }

    // Agar Lal button (Udhar) dabaya
    if (type === 'udhar') {
        khataRegister[name].totalBalance += money; // Paise plus karo
        khataRegister[name].history.push({ 
            id: uniqueId, // Ye naya id add kiya
            type: 'udhar', amount: money, samaan: items || "Udhar", time: exactTime 
        });
    } 
    // Agar Hara button (Jama) dabaya
    else if (type === 'jama') {
        khataRegister[name].totalBalance -= money; // Paise minus karo
        khataRegister[name].history.push({ 
            id: uniqueId, 
            type: 'jama', amount: money, samaan: items || "Jama kiye", time: exactTime 
        });
    }

    // Memory (LocalStorage) mein Data save karo
    localStorage.setItem("proKhataV5", JSON.stringify(khataRegister));

    // Type karne wale boxes ko khali kar do taaki agli entry kar sakein
    document.getElementById("customerName").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("items").value = "";

    // Pura page refresh karke naya data dikhao
    updateScreen();
}

// 🌟 FUNCTION 3 (NAYA): Grahak ka Naam Edit karna (Reason 2)
function editCustomerName(puranaNaam) {
    // prompt() ek box dikhata hai jisme hum type kar sakte hain. Humne purana naam wahan pehle se likh diya.
    let nayaNaam = prompt("Grahak ka naya naam likhein:", puranaNaam);
    
    // Agar kisi ne Cancel daba diya, ya khali chhod diya, ya wahi naam dobara likh diya toh wapas jao
    if (nayaNaam === null || nayaNaam.trim() === "" || nayaNaam === puranaNaam) {
        return; 
    }
    
    nayaNaam = nayaNaam.trim(); // Khali space hatao

    // Agar naye naam ka grahak pehle se hi hamari dukan mein hai toh mana kar do
    if (khataRegister[nayaNaam] !== undefined) {
        alert("Bhai, is naam ka grahak pehle se dukan mein hai. Koi aur naam rakhein!");
        return;
    }

    // MAGIC: Naye naam ka page banao, aur usme purane naam ka saara data (paise, history) Copy kar do
    khataRegister[nayaNaam] = khataRegister[puranaNaam];
    
    // Phir purane naam ka page Register se faad do (Delete kar do)
    delete khataRegister[puranaNaam];

    // Data Save karo aur Screen update karo
    localStorage.setItem("proKhataV5", JSON.stringify(khataRegister));
    updateScreen();
}

// 🌟 FUNCTION 4 (NAYA): Samaan ya Paise Edit karna (Reason 1)
function editTransaction(grahakKaNaam, transactionID) {
    let grahakData = khataRegister[grahakKaNaam];
    
    // Us ID wale lenden (transaction) ko dhoondho
    let uskBazaHisaab = grahakData.history.find(bill => bill.id === transactionID);
    
    if(!uskBazaHisaab) return; // Agar nahi mila toh ruk jao

    // 1. Naya Samaan poocho
    let nayaSamaan = prompt("Sahi samaan ki detail likhein:", uskBazaHisaab.samaan);
    if(nayaSamaan === null) return; // Cancel dabaya toh ruk jao

    // 2. Naye Paise poocho
    let nayePaise = prompt("Sahi paise (Amount) likhein:", uskBazaHisaab.amount);
    if(nayePaise === null) return; 
    nayePaise = Number(nayePaise); // Use number mein badlo

    // Agar paise galat daale toh mana karo
    if(isNaN(nayePaise) || nayePaise <= 0) {
        alert("Sahi paise dalo bhai!");
        return;
    }

    // MAGIC: Dukan ka aur grahak ka Total balance thik karna (Maths Logic)
    if (uskBazaHisaab.type === 'udhar') {
        // Agar udhar tha: Purane paise balance se ghatao, aur naye paise jod do
        grahakData.totalBalance = grahakData.totalBalance - uskBazaHisaab.amount + nayePaise;
    } else {
        // Agar jama tha: Purane paise wapas dukan mein jodo, aur naye paise ghatao
        grahakData.totalBalance = grahakData.totalBalance + uskBazaHisaab.amount - nayePaise;
    }

    // Ab finally us lenden ki details update kar do
    uskBazaHisaab.samaan = nayaSamaan;
    uskBazaHisaab.amount = nayePaise;

    // Save karo aur update karo
    localStorage.setItem("proKhataV5", JSON.stringify(khataRegister));
    updateScreen();
}

// 🌟 FUNCTION 5: WhatsApp par message bhejna (Purana wala hi hai)
function sendToWhatsApp(grahakKaNaam) {
    let grahakKaData = khataRegister[grahakKaNaam];
    let message = `📘 *Mera KhataBook Statement* 📘\n\n👤 *Grahak ka Naam:* ${grahakKaNaam}\n💰 *Aapka Baki Balance:* ₹${grahakKaData.totalBalance}\n\n*--- Aapke Hisaab ki Details ---*\n`;

    grahakKaData.history.forEach(function(bill) {
        let nishan = bill.type === 'udhar' ? '+ ₹' : '- ₹';
        message += `🗓️ ${bill.time}\n📝 ${bill.samaan} : ${nishan}${bill.amount}\n\n`;
    });

    let internetWalaMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${internetWalaMessage}`, '_blank');
}

// 🌟 FUNCTION 6: Khata Delete karna (Purana wala)
function deleteAccount(grahakKaNaam) {
    if (confirm(`🚨 Kya aap sach mein "${grahakKaNaam}" ka khata udana chahte hain?`)) {
        delete khataRegister[grahakKaNaam];
        localStorage.setItem("proKhataV5", JSON.stringify(khataRegister));
        updateScreen();
    }
}

// 🌟 FUNCTION 7: Screen par sab kuch dikhana (Main Function)
function updateScreen(searchWord = "") {
    let listDiv = document.getElementById("accountList");
    listDiv.innerHTML = ""; // Pehle purana dikhaya hua saaf karo

    for (let grahak in khataRegister) {
        // Search bar ka check (kya naam search ho raha hai)
        if (grahak.toLowerCase().includes(searchWord.toLowerCase())) {
            let grahakKaData = khataRegister[grahak];
            let historyHTML = "";
            
            // History ko ulta karo taaki nayi entry upar dikhe
            let reversedHistory = [...grahakKaData.history].reverse();

            // Har ek hisaab ki line banana
            reversedHistory.forEach(function(bill) {
                let colorClass = bill.type === 'udhar' ? 'text-red' : 'text-green';
                let sign = bill.type === 'udhar' ? '+ ₹' : '- ₹';

                // Yahan har samaan ke aage Naya 'Edit' button joda hai ✏️
                historyHTML += `
                    <li class="history-item">
                        <div>
                            <span>${bill.samaan}</span>
                            <span class="date-time">🕒 ${bill.time}</span>
                        </div>
                        <div style="text-align:right;">
                            <span class="${colorClass}">${sign}${bill.amount}</span><br>
                            <!-- Chhota Edit Button lenden badalne ke liye -->
                            <button class="btn-edit" onclick="editTransaction('${grahak}', ${bill.id})" style="margin-top:5px; padding:2px 8px; font-size:10px;">✏️ Edit</button>
                        </div>
                    </li>
                `;
            });

            // Grahak ke khate mein udhar baki hai ya jama (Rang tai karna)
            let balanceColor = grahakKaData.totalBalance > 0 ? "color: #ff4757;" : "color: #2ed573;";

            // Grahak ka dabba banana jisme ab "Edit Name" ka button bhi hai
            listDiv.innerHTML += `
                <div class="account-card">
                    <div class="card-header">
                        <div class="header-row">
                            <!-- Naam ke theek bagal mein Naam Edit karne ka button ✏️ -->
                            <h4 onclick="editCustomerName('${grahak}')" style="cursor:pointer;" title="Naam badalne ke liye click karein">👤 ${grahak} ✏️</h4>
                            <span style="font-weight:bold; font-size:18px; ${balanceColor}">₹${grahakKaData.totalBalance} Baki</span>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn-whatsapp" onclick="sendToWhatsApp('${grahak}')">📲 WhatsApp</button>
                            <button class="btn-delete" onclick="deleteAccount('${grahak}')">🗑️ Delete</button>
                        </div>
                    </div>
                    <ul class="history-list">
                        ${historyHTML}
                    </ul>
                </div>
            `;
        }
    }
    
    // Aakhir mein dukan ka total update kar do
    calculateShopTotal();
}

// 🌟 FUNCTION 8: Search chalana
function searchCustomer() {
    let word = document.getElementById("searchInput").value;
    updateScreen(word);
}

// Page load hote hi ek baar screen update karna
updateScreen();

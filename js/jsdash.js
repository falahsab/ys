const API_URL="https://script.google.com/macros/s/AKfycbyxZ2RsVQyQdDC_pzCPIsIzj4MLFZeoFUF1rvyHFxlynEXsa-kJBY6d_eY8gxXaBNoX0Q/exec";
let allData=[],filteredData=[];
let dealer=sessionStorage.getItem("dealer");
/* ✅ التحقق من تسجيل الدخول */
if(!dealer){
  window.location.href="index.html";
}

async function loadData(){
  dealerName.innerText=dealer;
  const res=await fetch(API_URL,{method:"POST",body:JSON.stringify({dealer})});
  const json=await res.json();
  allData=json.data||[];
  filteredData=[...allData];
  fillUserFilter(allData);
  renderTable(filteredData);
}

const level1ProfitEl = document.getElementById("level1Profit");
const level2ProfitEl = document.getElementById("level2Profit");
const levelsTotalProfitEl = document.getElementById("levelsTotalProfit");



function fillUserFilter(data){
  filterUser.innerHTML='<option value="">اختر المستخدم</option>';
  [...new Set(data.map(r=>r[3]))].forEach(u=>{
    if(u){ filterUser.innerHTML+=`<option>${u}</option>` }
  });
}

function applyFilters(){
  filteredData=allData.filter(r=>{
    const d=r[0].split("T")[0];
    return (!startDate.value||d>=startDate.value)
      &&(!endDate.value||d<=endDate.value)
      &&(!filterUser.value||r[3]==filterUser.value);
  });
  renderTable(filteredData);
}

function resetFilters(){
  startDate.value=endDate.value=filterUser.value="";
  renderTable(allData);
}

function renderTable(data){

  const tbody = dataTable.querySelector("tbody");

  let profit = 0;
  let amount = 0;
  let cancelled = 0;
  let html = "";

  data.forEach(r => {

    const p = Number(r[5]) || 0;
    const a = Number(r[2]) || 0;

    profit += p;

    if (p < 0) {
      amount -= a;
      cancelled++;
    } else {
      amount += a;
    }

    html += `
    <tr>
      <td>${String(r[0]).split("T")[0]}</td>
      <td>${r[1]}</td>
      <td>${r[2]}</td>
      <td>${r[3]}</td>
      <td>${r[4]}</td>
      <td>${r[5]}</td>
      <td class="status-${r[6]}">${r[6]}</td>
    </tr>`;
  });

  tbody.innerHTML = html;

  totalProfit.innerText = Number(profit.toFixed(3));
  totalAmount.innerText = Number(amount.toFixed(3));
  totalCodes.innerText = data.length;
  cancelledCodes.innerText = cancelled;
  netCodes.innerText = data.length - (cancelled * 2);
 document.getElementById("selectedUser").innerText =
    filterUser.value || "All";
    
    if (filterUser.value) {

    const subDealerRate = 25;
    const mainDealerRate = Math.max(0, 25 - cancelled);

    const subDealerCommission = profit * subDealerRate / 100;
    const mainDealerCommission = profit * mainDealerRate / 100;

    const totalCommission =
        subDealerCommission + mainDealerCommission;

    document.getElementById("mainDealerRate").innerText = mainDealerRate;
    document.getElementById("subDealerCommission").innerText =
        subDealerCommission.toFixed(3);

    document.getElementById("mainDealerCommission").innerText =
        mainDealerCommission.toFixed(3);

    document.getElementById("totalCommission").innerText =
        totalCommission.toFixed(3);

} else {

    document.getElementById("mainDealerRate").innerText = "-";
    document.getElementById("subDealerCommission").innerText = "-";
    document.getElementById("mainDealerCommission").innerText = "-";
    document.getElementById("totalCommission").innerText = "-";

} 
  
  if (typeof percent1 !== "undefined") {

    const raw1 = (profit / 40) * 100;
    const raw2 = (profit / 70) * 100;

    percent1.innerText = raw1.toFixed(1);
    percent2.innerText = raw2.toFixed(1);

    progressBar1.style.width = Math.min(raw1, 100) + "%";
    progressBar2.style.width = Math.min(raw2, 100) + "%";

    progressBar1.innerText = raw1.toFixed(1) + "%";
    progressBar2.innerText = raw2.toFixed(1) + "%";

    const level1Profit = raw1 >= 100 ? profit : 0;
    const level2Profit = raw2 >= 100 ? profit * 0.7 : 0;

    level1ProfitEl.innerText = level1Profit.toLocaleString();
    level2ProfitEl.innerText = level2Profit.toLocaleString();
    levelsTotalProfitEl.innerText =
      (level1Profit + level2Profit).toLocaleString();
  }
}

function logout() {
  sessionStorage.clear();          // مسح بيانات الجلسة
  window.location.href = "login.html"; // الانتقال لصفحة تسجيل الدخول
}
filterUser.addEventListener("change", applyFilters);
        //.......ترجمة

let currentLang = "ar";

function toggleLanguage() {

    const currencies = document.querySelectorAll(".currency");

    if (currentLang === "ar") {

        document.documentElement.lang = "en";
        document.documentElement.dir = "ltr";
        document.getElementById("dealerName1").textContent = "Hi, ";
        document.getElementById("lblUser").textContent = "👤 User:";
        document.getElementById("lblProfit").textContent = "💰 Total Profit:";
        document.getElementById("lblSales").textContent = "🛒 Total Sales:";
        document.getElementById("lblOperations").textContent = "🔢 Total Transactions:";
        document.getElementById("lblCancelled").textContent = "❌ Cancelled Codes:";
        document.getElementById("lblNet").textContent = "✅ Net Sold Codes:";
        document.getElementById("lblSubDealer").textContent = "👤 Sub Dealer Commission (25%):";
        document.getElementById("lblMainDealer").textContent = "👑 Main Dealer Commission (";
        document.getElementById("lblTotalCommission").textContent = "💰 Total Commissions:";

        currencies.forEach(el => el.textContent = "Mango");

       document.querySelectorAll(".salesRow").forEach(row => {
    row.style.display = "none";
});

        document.getElementById("langBtn").textContent = "العربية";

        currentLang = "en";

    } else {

        document.documentElement.lang = "ar";
        document.documentElement.dir = "rtl";
        document.getElementById("dealerName1").textContent = "مرحبا, ";
        document.getElementById("lblUser").textContent = "👤 المستخدم:";
        document.getElementById("lblProfit").textContent = "💰 إجمالي الربح:";
        document.getElementById("lblSales").textContent = "🛒 إجمالي المبيعات:";
        document.getElementById("lblOperations").textContent = "🔢 إجمالي العمليات:";
        document.getElementById("lblCancelled").textContent = "❌ عدد الأكواد الملغية:";
        document.getElementById("lblNet").textContent = "✅ صافي الأكواد المباعة:";
        document.getElementById("lblSubDealer").textContent = "👤 عمولة الوكيل الفرعي (25%):";
        document.getElementById("lblMainDealer").textContent = "👑 عمولة الوكيل الرئيسي (";
        document.getElementById("lblTotalCommission").textContent = "💰 إجمالي العمولتين:";

        currencies.forEach(el => el.textContent = "مانجو");

       document.querySelectorAll(".salesRow").forEach(row => {
    row.style.display = "";
});

        document.getElementById("langBtn").textContent = "English";

        currentLang = "ar";
    }
}
window.onload=loadData;

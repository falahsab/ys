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

async function loadData(){
  if(!dealer){ alert("يرجى تسجيل الدخول"); return; }
  dealerName.innerText=dealer;

  const res=await fetch(API_URL,{method:"POST",body:JSON.stringify({dealer})});
  const json=await res.json();
  allData=json.data||[];
  filteredData=[...allData];
  fillUserFilter(allData);
  renderTable(filteredData);
}

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
  let profit=0,amount=0,cancelled=0;
  dataTable.querySelector("tbody").innerHTML="";

  data.forEach(r=>{
    const p=Number(r[5])||0;
    profit+=p;
    amount+=Number(r[2])||0;
    if(p<0) cancelled++;

    dataTable.querySelector("tbody").innerHTML+=`
    <tr>
      <td>${r[0].split("T")[0]}</td>
      <td>${r[1]}</td>
      <td>${r[2]}</td>
      <td>${r[3]}</td>
      <td>${r[4]}</td>
      <td>${r[5]}</td>
      <td class="status-${r[6]}">${r[6]}</td>
    </tr>`;
  });

totalProfit.innerText = Number(profit.toFixed(3));
totalAmount.innerText = Number(amount.toFixed(3));
totalCodes.innerText = data.length;
cancelledCodes.innerText = cancelled;
netCodes.innerText = data.length - (cancelled*2);


  const raw1 = (profit / 40) * 100;
  const raw2 = (profit / 70) * 100;

  percent1.innerText = raw1.toFixed(1);
  percent2.innerText = raw2.toFixed(1);

  progressBar1.style.width = Math.min(raw1,100)+"%";
  progressBar2.style.width = Math.min(raw2,100)+"%";
  progressBar1.innerText = raw1.toFixed(1)+"%";
  progressBar2.innerText = raw2.toFixed(1)+"%";

  const level1Profit = raw1 >= 100 ? profit : 0;
  const level2Profit = raw2 >= 100 ? profit * 0.7 : 0;

  level1ProfitEl.innerText = level1Profit.toLocaleString();
  level2ProfitEl.innerText = level2Profit.toLocaleString();
  levelsTotalProfitEl.innerText = (level1Profit + level2Profit).toLocaleString();
}

function logout() {
  sessionStorage.clear();          // مسح بيانات الجلسة
  window.location.href = "login.html"; // الانتقال لصفحة تسجيل الدخول
}
window.onload=loadData;

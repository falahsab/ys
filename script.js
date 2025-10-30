const API_BASE = "/api/proxy"; // كل الطلبات تمر عبر السيرفر
const $ = s => document.querySelector(s);

$('#checkBtn').onclick = async () => {
  const id = $('#orderID').value.trim();
  if(!id){ alert('الرجاء إدخال رقم الطلب'); return; }

  $('#checkBtn').style.display = 'none';
  $('#loading').style.display = 'block';
  $('#result').innerHTML = '';

  try {
    const res = await fetch(API_BASE); // لا حاجة لإرسال توكن من المتصفح
    const orders = await res.json();
    const order = orders.find(o => String(o.OrderID) === id);

    if(!order){
      $('#result').innerHTML = `<span>🚫 لم يتم العثور على الطلب رقم ${id}</span>`;
    } else {
      const statuses = [
        {text:'تم استلام طلبك', cls:'badge-received'},
        {text:'⏳ جاري تجهيز طلبك', cls:'badge-processing'},
        {text:'🥳 طلبك جاهز 🥳', cls:'badge-ready'},
        {text:'تم التسليم', cls:'badge-delivered'}
      ];
      const statusIndex = order.Status ? order.Status - 1 : 0;
      const date = new Date(order.Date);
      const dateFormatted = ('0'+date.getDate()).slice(-2)+'/'+('0'+(date.getMonth()+1)).slice(-2)+'/'+date.getFullYear().toString().slice(-2);

      $('#result').innerHTML = `
        <div style="font-size:18px;font-weight:bold;">#${order.OrderID} — ${order.CustomerName}</div>
        <div style="margin-top:5px;">📞 ${order.Phone||'-'} | 💰 ${order.Price||'-'} | 📅 ${dateFormatted}</div>
        <div class="statusBadge ${statuses[statusIndex].cls}" style="margin-top:10px;">${statuses[statusIndex].text}</div>
        ${order.Status == 1 ? 
          `<div class="statusBadge ${statuses[statusIndex].cls}" style="border-radius:10px;margin-top:10px;">
            📦 تم استلام طلبك بنجاح، شكرًا لك ${order.CustomerName}! سيتم التعامل معه بكل عناية وسنوافيك بالتحديث قريباً.
          </div>` : ''}
        ${order.Status == 2 ? 
          `<div class="statusBadge ${statuses[statusIndex].cls}" style="border-radius:10px;margin-top:10px;">
            ✨ مرحبًا ${order.CustomerName}! طلبك الآن قيد الإعداد وسيكون جاهزاً قريباً. شكراً لصبرك!
          </div>` : ''}
        ${order.Status == 3 ? 
          `<div class="statusBadge ${statuses[statusIndex].cls}" style="border-radius:10px;margin-top:10px;">
            🎁 خبر سار! طلبك جاهز الآن. تعال واستلمه في أي وقت يناسبك!
          </div>` : ''}
        ${order.Status == 4 ? 
          `<div class="statusBadge ${statuses[statusIndex].cls}" style="border-radius:10px;margin-top:10px;">
            🌟 شكرًا لك ${order.CustomerName} .لقد استلمت طلبك بنجاح. نتمنى أن تستمتع بمشترياتك! شكراً لاختيارك متجرنا ونتطلع لخدمتك مرة أخرى.
          </div>` : ''}
      `;
    }
  } catch(err) {
    console.error(err);
    $('#result').innerHTML = `<span>⚠️ حدث خطأ أثناء جلب البيانات من الخادم</span>`;
  } finally {
    $('#loading').style.display = 'none';
    setTimeout(()=>$('#checkBtn').style.display = 'inline-block',700);
  }
};

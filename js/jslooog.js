
const API_URL = "https://script.google.com/macros/s/AKfycbyxZ2RsVQyQdDC_pzCPIsIzj4MLFZeoFUF1rvyHFxlynEXsa-kJBY6d_eY8gxXaBNoX0Q/exec";

async function login(){
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");
  msg.innerText = "";

  if(!mobile || !password){ msg.innerText="يرجى تعبئة جميع الحقول"; return; }

  try{
    const res = await fetch(API_URL,{
      method:"POST",
      body: JSON.stringify({ mobile, password })
    });
    const data = await res.json();

    if(!data.success){ msg.innerText="رقم الجوال أو كلمة المرور غير صحيحة"; return; }

    // حفظ اسم الموزع في sessionStorage وفتح الـ dashboard
    sessionStorage.setItem("dealer", data.dealer);
    window.location.href="dashboard.html";

  }catch(err){
    console.error(err);
    msg.innerText="خطأ في الاتصال بالخادم";
  }
}

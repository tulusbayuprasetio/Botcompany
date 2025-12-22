const tg = window.Telegram.WebApp;
tg.ready();

const uid = tg.initDataUnsafe.user?.id || 0;
document.getElementById("user").innerText =
  "Hello, " + (tg.initDataUnsafe.user?.first_name || "User");

document.getElementById("reflink").innerText =
  `https://t.me/YOUR_BOT_USERNAME?start=${uid}`;

function showTab(id, el){
  document.querySelectorAll('.container').forEach(d=>d.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');

  if(id==="bonus"){
    tg.sendData(JSON.stringify({action:"get_referrals"}));
  }
}

function deviceHash(){
  return btoa(
    navigator.userAgent + navigator.language + screen.width
  ).substring(0,32);
}

function mine(){
  document.getElementById("orb").classList.add("mining");
  tg.sendData(JSON.stringify({action:"mine", device:deviceHash()}));
}

function copyRef(){
  navigator.clipboard.writeText(document.getElementById("reflink").innerText);
  tg.showToast({message:"Copied"});
}

tg.sendData(JSON.stringify({action:"get_data"}));

tg.onEvent("message", e=>{
  try{
    const d = JSON.parse(e.data);

    if(d.balance!==undefined){
      document.getElementById("balance").innerText=d.balance;
      document.getElementById("walletBalance").innerText=d.balance+" NPR";
      document.getElementById("refActive").innerText=d.ref_active;
      document.getElementById("orb").classList.remove("mining");
    }

    if(d.referrals){
      const box=document.getElementById("refList");
      box.innerHTML="";
      d.referrals.forEach(r=>{
        box.innerHTML+=`
          <div>
            <b>@${r.username}</b><br>
            <span style="color:${r.active?'#4ade80':'#f87171'}">
              ${r.active?'Active':'Inactive'}
            </span>
          </div><hr>
        `;
      });
    }

  }catch{}
});
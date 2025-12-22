const tg = window.Telegram.WebApp;
tg.ready();

const orb = document.getElementById("orb");
const balanceEl = document.getElementById("balance");
const refActiveEl = document.getElementById("refActive");
const referralSummary = document.getElementById("referralSummary");
const referralList = document.getElementById("referralList");

let cooldown = 0;

document.getElementById("user").innerText = "Hello, " + (tg.initDataUnsafe.user?.first_name || "User");

// ---- NAV ----
function showTab(id,el){
  document.querySelectorAll('.container').forEach(d=>d.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
}

// ---- MINING ----
document.getElementById("mineBtn").onclick = () => {
  const deviceHash = navigator.userAgent; // bisa ganti sesuai device ID
  tg.sendData(JSON.stringify({action:"mine", device:deviceHash}));
};

// ---- COPY REF ----
function copyRef(){
  navigator.clipboard.writeText(document.getElementById('reflink').innerText);
  tg.showToast({message:"Referral link copied"});
}

// ---- UPDATE UI ----
function updateUI(data){
  if(data.balance !== undefined){
    balanceEl.innerText = data.balance.toFixed(2);
    refActiveEl.innerText = data.ref_active;
    cooldown = data.cooldown || 0;
    const progress = Math.floor((1 - cooldown/86400)*100);
    orb.innerText = `Mining ${progress}%`;
    document.getElementById("walletBalance").innerText = data.balance.toFixed(2);
  }
  if(data.referrals){
    referralSummary.innerHTML = `<b>Referral Summary</b><br>Total: ${data.referrals.length}<br>Active: ${data.referrals.filter(r=>r.active).length}<br>Inactive: ${data.referrals.filter(r=>!r.active).length}`;
    referralList.innerHTML = `<b>Referral List</b><br>` + data.referrals.map(r=>`<div><b>@${r.username}</b> - <span class="${r.active?'status-active':'status-inactive'}">${r.active?'● Active':'● Inactive'}</span></div>`).join('<div class="hr"></div>');
  }
}

// ---- REQUEST DATA ----
tg.sendData(JSON.stringify({action:"get_data"}));
tg.onEvent('message', e=>{
  try{
    const data = JSON.parse(e.data);
    updateUI(data);
  }catch(err){}
});

// ---- BACKGROUND ANIMASI ----
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for(let i=0;i<100;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*2+1,
    dx:(Math.random()-0.5)*1,
    dy:(Math.random()-0.5)*1
  });
}

function animate(){
  ctx.fillStyle = "#0b0f14";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle="#4ade80";
    ctx.fill();
    p.x+=p.dx;p.y+=p.dy;
    if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;
    if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;
  }
  requestAnimationFrame(animate);
}
animate();
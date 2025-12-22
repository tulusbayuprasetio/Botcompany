const tg = window.Telegram.WebApp;
tg.ready();

// set user name
document.getElementById("user").innerText = "Hello, " + (tg.initDataUnsafe.user?.first_name || "User");

// tab navigation
function showTab(id,el){
  document.querySelectorAll('.container').forEach(d=>d.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
}

// copy referral
function copyRef(){
  const text = document.getElementById('reflink')?.innerText || "Link belum tersedia";
  navigator.clipboard.writeText(text);
  tg.showToast({message:"Referral link copied"});
}

// orb progress
function updateOrb(percent){
  const circle = document.querySelector(".orb-progress");
  const offset = 754 - (754 * percent/100);
  circle.style.strokeDashoffset = offset;
  document.getElementById("orbText").innerText = `${percent}%`;
}

// mining
function mine(){
  updateOrb(0);
  tg.sendData(JSON.stringify({action:"mine",device:"device123"}));
}

// handle bot messages
tg.onEvent('message', function(e){
  try{
    const data = JSON.parse(e.data);
    if(data.balance!==undefined){
      document.getElementById("balance").innerText = data.balance.toFixed(2);
      document.getElementById("walletBalance").innerText = data.balance.toFixed(2);
      document.getElementById("refActive").innerText = data.ref_active;
      if(data.cooldown!==undefined){
        let percent = Math.min(100, Math.floor((24*3600 - data.cooldown)/(24*3600)*100));
        updateOrb(percent);
      }
    }
    if(data.referrals){
      const list = document.getElementById("refList");
      list.innerHTML = "";
      data.referrals.forEach(r=>{
        const div = document.createElement("div");
        div.innerHTML = `<b>@${r.username}</b><br><span class="${r.active?'status-active':'status-inactive'}">● ${r.active?'Active':'Inactive'}</span><hr class="hr">`;
        list.appendChild(div);
      });
    }
  }catch(err){console.log(err);}
});

// request initial data
tg.sendData(JSON.stringify({action:"get_data"}));
tg.sendData(JSON.stringify({action:"get_referrals"}));

// background animation
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for(let i=0;i<100;i++){
  particles.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    vx: (Math.random()-0.5)*0.5,
    vy: (Math.random()-0.5)*0.5,
    size: Math.random()*2+1
  });
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x+=p.vx;
    p.y+=p.vy;
    if(p.x<0)p.x=canvas.width;
    if(p.x>canvas.width)p.x=0;
    if(p.y<0)p.y=canvas.height;
    if(p.y>canvas.height)p.y=0;
    ctx.fillStyle="rgba(74,222,128,0.7)";
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();
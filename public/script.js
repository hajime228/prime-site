let isAdmin = false;

/* ---------- Проверка админа ---------- */

fetch('/check-admin')
.then(res => res.json())
.then(data => isAdmin = data.isAdmin);

/* ---------- Загрузка слотов ---------- */

fetch('/slots')
.then(res => res.json())
.then(slots => {

    const container = document.getElementById("slots");

    slots.forEach((busy, i) => {
        const div = document.createElement("div");
        div.className = "slot";
        if(busy) div.classList.add("busy");

        div.addEventListener("click", function(){
            if(!isAdmin) return;

            fetch('/toggle-slot', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({index:i})
            }).then(()=>location.reload());
        });

        container.appendChild(div);
    });

});

/* ---------- ЛОГИН ---------- */

function adminLogin(){
    const pass = prompt("Введите пароль администратора:");

    fetch('/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({password:pass})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.success){
            alert("Админ режим включен");
            location.reload();
        } else {
            alert("Неверный пароль");
        }
    });
}

/* ---------- МОДАЛЬНЫЕ ОКНА ---------- */

function openModal(type){
    const modal=document.getElementById("modal");
    const text=document.getElementById("modal-text");

    if(type==="about")
        text.innerHTML="<h2>О компании</h2><p>Размещаем рекламу более 5 лет.</p>";

    if(type==="prices")
        text.innerHTML="<h2>Тарифы</h2><p>1 слот — 1000 руб/мес</p>";

    if(type==="contacts")
        text.innerHTML="<h2>Контакты</h2><p>+7 (999) 123-45-67</p>";

    modal.style.display="flex";
}

function closeModal(){
    document.getElementById("modal").style.display="none";
}

window.onclick=function(e){
    const modal=document.getElementById("modal");
    if(e.target==modal) modal.style.display="none";
};

/* ---------- КАРТА ---------- */

const map = document.getElementById("map");

let scale = 1;
let posX = 0;
let posY = 0;
let dragging = false;
let startX, startY;

map.addEventListener("wheel", function(e){
    e.preventDefault();

    if(e.deltaY < 0) scale += 0.1;
    else scale -= 0.1;

    if(scale < 1) scale = 1;

    update();
});

map.addEventListener("mousedown", function(e){
    dragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    map.style.cursor="grabbing";
});

document.addEventListener("mouseup", function(){
    dragging = false;
    map.style.cursor="grab";
});

document.addEventListener("mousemove", function(e){
    if(!dragging) return;

    posX = e.clientX - startX;
    posY = e.clientY - startY;

    update();
});

function update(){
    map.style.transform =
        `translate(${posX}px, ${posY}px) scale(${scale})`;
}
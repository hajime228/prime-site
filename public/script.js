let isAdmin = false;

/* Проверка админа */
fetch('/check-admin')
.then(res => res.json())
.then(data => isAdmin = data.isAdmin);

/* Загрузка слотов */
fetch('/slots')
.then(res => res.json())
.then(slots => {
    const container = document.getElementById("slots");

    slots.forEach((busy, index) => {
        const div = document.createElement("div");
        div.className = "slot";
        if (busy) div.classList.add("busy");

        div.onclick = () => {
            if (!isAdmin) return;

            fetch('/toggle-slot', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ index })
            }).then(() => location.reload());
        };

        container.appendChild(div);
    });
});

/* Логин */
function login() {
    const password = prompt("Введите пароль:");
    if (!password) return;

    fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Вход выполнен");
            location.reload();
        } else {
            alert("Неверный пароль");
        }
    });
}
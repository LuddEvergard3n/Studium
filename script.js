// Tela de boot
window.addEventListener("load", () => {
    const boot = document.getElementById("boot-screen");

    setTimeout(() => {
        boot.style.opacity = "0";
        boot.style.transition = "1s";
        setTimeout(() => boot.remove(), 1200);
    }, 1200);
});
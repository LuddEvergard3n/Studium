// CRONOGRAMA
document.getElementById("btnCronograma").onclick = () => {
    const horasSemana = Number(document.getElementById("horasSemana").value);
    const materias = document.getElementById("materias").value.split(",").map(s => s.trim());
    
    if (!horasSemana || materias.length === 0) {
        alert("Preencha todos os campos.");
        return;
    }

    const horasPorMateria = (horasSemana / materias.length).toFixed(2);

    let output = "";
    materias.forEach(m => output += `${m}: ${horasPorMateria}h/semana\n`);

    document.getElementById("outputCronograma").textContent = output;
};

// CALCULADORA
document.getElementById("btnCalcular").onclick = () => {
    const horasTotais = Number(document.getElementById("horasTotais").value);
    const semanas = Number(document.getElementById("semanasDisp").value);

    if (!horasTotais || !semanas) {
        alert("Preencha todos os campos.");
        return;
    }

    const resultado = (horasTotais / semanas).toFixed(2);
    document.getElementById("outputCalculo").textContent =
        `Você precisa estudar ${resultado}h por semana.`;
};

// DASHBOARD
document.getElementById("btnProgresso").onclick = () => {
    const novo = Number(document.getElementById("novoProgresso").value);

    if (novo < 0 || novo > 100) {
        alert("Digite um valor entre 0 e 100.");
        return;
    }

    document.getElementById("barra").value = novo;
    document.getElementById("porcentagem").innerText = `${novo}%`;
};
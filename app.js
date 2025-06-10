// app.js

function resolverProblema(num) {
  const resultados = {
    1: {
      funcion: (t, N) => 0.000095 * N * (5000 - N),
      x0: 0,
      y0: 100,
      h: 5,
      tmax: 20,
      label: 'Población',
    },
    2: {
      funcion: (t, A) => 0.8 * A * (1 - Math.pow(A / 60, 0.25)),
      x0: 0,
      y0: 1,
      h: 5,
      tmax: 30,
      label: 'Tumor',
    },
    3: {
      funcion: (t, v) => (-5 * 9.81 + 0.05 * v * v) / 5,
      x0: 0,
      y0: 0,
      h: 5,
      tmax: 15,
      label: 'Velocidad',
    },
  };

  const { funcion, x0, y0, h, tmax, label } = resultados[num];

  const heun = metodoHeun(funcion, x0, y0, h, tmax);
  const rk4 = metodoRungeKutta(funcion, x0, y0, h, tmax);

  mostrarResultados(num, heun, rk4, label);
}

function metodoHeun(f, x0, y0, h, tmax) {
  let resultados = [];
  let x = x0, y = y0;
  let i = 0;
  while (x <= tmax) {
    const k1 = f(x, y);
    const k2 = f(x + h, y + h * k1);
    const yNext = y + (h / 2) * (k1 + k2);
    resultados.push({ i, x: x.toFixed(2), y: y.toFixed(6), h, k1: k1.toFixed(6), k2: k2.toFixed(6) });
    y = yNext;
    x += h;
    i++;
  }
  return resultados;
}

function metodoRungeKutta(f, x0, y0, h, tmax) {
  let resultados = [];
  let x = x0, y = y0;
  let i = 0;
  while (x <= tmax) {
    const k1 = f(x, y);
    const k2 = f(x + h / 2, y + h * k1 / 2);
    const k3 = f(x + h / 2, y + h * k2 / 2);
    const k4 = f(x + h, y + h * k3);
    const yNext = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    resultados.push({ i, x: x.toFixed(2), y: y.toFixed(6), h, k1: k1.toFixed(6), k2: k2.toFixed(6), k3: k3.toFixed(6), k4: k4.toFixed(6) });
    y = yNext;
    x += h;
    i++;
  }
  return resultados;
}

function mostrarResultados(num, heun, rk4, label) {
  const div = document.getElementById(`resultado${num}`);
  div.innerHTML = `
    <h5>Tabla Método de Heun</h5>
    ${generarTabla(heun)}
    <h5 class="mt-4">Tabla Método de Runge-Kutta</h5>
    ${generarTabla(rk4)}
  `;

  const ctx = document.getElementById(`grafico${num}`).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: heun.map(p => p.x),
      datasets: [
        {
          label: `${label} (Heun)`,
          data: heun.map(p => p.y),
          borderColor: 'blue',
          fill: false,
        },
        {
          label: `${label} (RK4)`,
          data: rk4.map(p => p.y),
          borderColor: 'red',
          fill: false,
        },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Comparación de Métodos'
        }
      }
    }
  });
}

function generarTabla(datos) {
  const columnas = Object.keys(datos[0]);
  const thead = columnas.map(c => `<th>${c}</th>`).join('');
  const filas = datos.map(d => {
    return `<tr>${columnas.map(c => `<td>${d[c]}</td>`).join('')}</tr>`;
  }).join('');
  return `<table class="table table-sm table-bordered"><thead><tr>${thead}</tr></thead><tbody>${filas}</tbody></table>`;
}

document.addEventListener("DOMContentLoaded", () => {

  // Primer formulario
  const inputPresupuesto = document.getElementById("presupuesto");
  const botonCalcular = document.getElementById("calcularSaldo");
  //Segundo formulario
  const inputNombreGasto = document.getElementById("nombreGasto");
  const inputCantidadGasto = document.getElementById("cantidadGasto");
  const botonAnadirGasto = document.getElementById("anadirGasto");
  // Primera tabla
  const campoPresupuesto = document.getElementById("campoPresupuesto");
  const campoGastos = document.getElementById("campoGastos");
  const campoSaldo = document.getElementById("campoSaldo");
  // Segunda tabla
  const cuerpoTablaGastos = document.getElementById("cuerpoTablaGastos");

  // Modelo del gasto
  class Gasto {
    constructor(id, nombre, cantidad) {
      this.id = id;
      this.nombre = nombre;
      (cantidad > 0) ? this.cantidad = cantidad : this.cantidad = 0;
    }
  }

  function* generarID() {
    let i = 0;
    while (true) yield i++;
  };

  let g = generarID();

  const appPresupuesto = {
    listaGastos: [],
    presupuesto: 0,
    gastos: 0,
    saldo: 0,

    calcularGastos: function () {
      let gastos = 0;
      this.listaGastos.forEach((gasto) => {
        gastos += gasto.cantidad;
      });
      this.gastos = gastos;
    },

    calcularSaldo: function () {
      this.saldo = this.presupuesto - this.gastos;
    },

    anadirPresupuesto: function (presupuesto) {
      (presupuesto > 0) ? this.presupuesto = presupuesto : this.presupuesto = 0;
      this.calcularGastos();
      this.calcularSaldo();
    },

    anadirGasto: function (gasto) {
      this.listaGastos.push(gasto);
      this.calcularGastos();
      this.calcularSaldo();
    },

    quitarGasto: function (idGasto) {
      let indice = this.listaGastos.findIndex((gasto) => gasto.id == idGasto);
      if (indice == -1) {
        console.log("Error, el gasto ya no existe.");
        return false;
      } else {
        this.listaGastos.splice(indice, 1);
        this.calcularGastos();
        this.calcularSaldo();
        return true;
      }
    },

    generarHTMLGastos: function () {
      let tbody = "";
      this.listaGastos.forEach((gasto) => {
        tbody += `
             <tr>
                <td>${gasto.nombre}</td>
                <td>$ ${gasto.cantidad}</td>
                <td><a href="#"><i id="${gasto.id}" class="bi bi-trash-fill"></i></a></td>
              </tr>
              `;
      });
      return tbody;
    },
  };

  const actualizarHTML = function () {
    campoPresupuesto.innerText = appPresupuesto.presupuesto;
    campoGastos.innerText = appPresupuesto.gastos;
    campoSaldo.innerText = appPresupuesto.saldo;
    cuerpoTablaGastos.innerHTML = appPresupuesto.generarHTMLGastos();
    return true;
  };

  botonCalcular.addEventListener("click", function (e) {
    e.preventDefault();
    appPresupuesto.anadirPresupuesto(parseInt(inputPresupuesto.value));
    inputPresupuesto.value = "";
    actualizarHTML();
    return true;
  });

  botonAnadirGasto.addEventListener("click", function (e) {
    e.preventDefault();
    let nuevoGasto = new Gasto(g.next().value, inputNombreGasto.value, parseInt(inputCantidadGasto.value));
    appPresupuesto.anadirGasto(nuevoGasto);
    inputCantidadGasto.value = "";
    inputNombreGasto.value = "";
    actualizarHTML();
    return true;
  });

  document.addEventListener('click', function (e) {
    if (e.target && e.target.tagName == 'I') {
      let id = e.target.id;
      appPresupuesto.quitarGasto(id);
      actualizarHTML();
    }
  });
});
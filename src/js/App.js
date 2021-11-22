'use strict'
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded', () => {
     document.querySelector('#ciudad').value = "";
     document.querySelector('#pais').value = "";
     console.log('DOM fully loaded and parsed');
});

window.addEventListener('load', () => {
     formulario.addEventListener('submit', obtenerCiudad);
});

function obtenerCiudad(e) {
     e.preventDefault();
     const ciudad = document.querySelector('#ciudad').value
     const pais = document.querySelector('#pais').value
     if (ciudad === '' || pais === '') {
          limpiarHTML();
          mostrarAlerta('Ambos campos son obligatorios');
          return;
     }
     consultarApi(ciudad, pais).then(resultado => {
          limpiarHTML()
          mostrarClima(resultado);
     }).catch(error => {
          limpiarHTML();
          mostrarAlerta(error.message);
     });
}

async function consultarApi(ciudad, pais) {
     const appId = '2bc8ebd8b22487612480ca885a85d51d';
     let url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
     Spinner()
     const Response = await fetch(url);
     if (!Response.ok) {
          const message = `Ciudad No Encontrada`;
          throw new Error(message);
     }
     const consulta = Response.json();
     return consulta;
}

function mostrarClima(consulta) {
     const {
          name,
          main: {
               temp,
               temp_max,
               temp_min
          },
          weather: {
               0: {
                    icon,
               }
          },
          sys: {
               country,
          }
     } = consulta;
     const temperatura = KelvinACentigrados(temp);
     const temperatura_min = KelvinACentigrados(temp_min);
     const temperatura_max = KelvinACentigrados(temp_max);

     const resultadoDiv = document.createElement('div');
     resultadoDiv.classList.add('w-full', 'max-w-sm', 'bg-gray-100', 'p-4', 'rounded-xl', 'border-t-4', 'border-blue-500', 'text-center', 'grid', 'grid-flow-row')

     const nombreCiudad = document.createElement('p');
     nombreCiudad.classList.add('font-bold', 'text-2xl', 'col-span-2');
     nombreCiudad.textContent = `${name}, ${country}`;

     const tempActual = document.createElement('p');
     tempActual.classList.add('font-bold', 'text-3xl', 'row-span-2', 'self-center');
     tempActual.innerHTML = `${temperatura} &#8451;`;

     const tempMax = document.createElement('p');
     tempMax.classList.add('text-xl', 'col-span-2');
     tempMax.innerHTML = `Max: ${temperatura_max} &#8451;`;

     const tempMin = document.createElement('p');
     tempMin.classList.add('text-xl', 'col-span-2');
     tempMin.innerHTML = `Min: ${temperatura_min} &#8451;`;

     const tempDiv = document.createElement('div');
     tempDiv.classList.add('grid', 'grid-rows-1', 'grid-flow-col');

     tempDiv.appendChild(tempActual);
     tempDiv.appendChild(tempMax);
     tempDiv.appendChild(tempMin);
     const imgTemp = document.createElement('img');
     imgTemp.classList.add('w-24', 'h-24', 'self-center', 'bg-black', 'rounded-full');
     imgTemp.src = `http://openweathermap.org/img/wn/${icon}@2x.png`

     resultadoDiv.appendChild(nombreCiudad);
     resultadoDiv.appendChild(imgTemp);
     resultadoDiv.appendChild(tempDiv);
     resultado.appendChild(resultadoDiv);
}

function mostrarAlerta(alerta) {
     const resultadoDiv = document.createElement('div');
     resultadoDiv.classList.add('w-full', 'max-w-sm', 'bg-white', 'p-4', 'rounded-xl', 'border-t-4', 'border-red-500', 'text-center')
     const TipoAlerta = document.createElement('strong');
     TipoAlerta.classList.add('font-bold', 'text-red-700', 'block', 'sm:inline', 'pr-1')
     TipoAlerta.textContent = 'Error!!';
     const MensajeAlerta = document.createElement('span');
     MensajeAlerta.classList.add('block', 'sm:inline', 'text-red-400');
     MensajeAlerta.textContent = `${alerta}`;
     resultadoDiv.appendChild(TipoAlerta);
     resultadoDiv.appendChild(MensajeAlerta);
     resultado.appendChild(resultadoDiv);
     setTimeout(() => {
          resultadoDiv.remove();
     }, 3000);
}

function KelvinACentigrados(grados) {
     return parseInt(grados - 273.15);
}

function KelvinaFarenheit(grados) {
     return parseInt(((grados - 273.15) * 1.8) + 32);
}

function limpiarHTML() {
     while (resultado.firstChild) {
          resultado.removeChild(resultado.firstChild);
     }
}

function Spinner() {

     limpiarHTML();
   
     const divSpinner = document.createElement('div');
     divSpinner.classList.add('spinner');
     const Spinner1 = document.createElement('div');
     Spinner1.classList.add('double-bounce1');
     const Spiner2 = document.createElement('div');
     Spiner2.classList.add('double-bounce2')
     divSpinner.appendChild(Spinner1);
     divSpinner.appendChild(Spiner2);
     resultado.appendChild(divSpinner);
   }
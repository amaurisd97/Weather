const container = document.querySelector('.container')
const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')

window.addEventListener('load', () => {
  formulario.addEventListener('submit', buscarClima)
})

function buscarClima(evt) {
  evt.preventDefault()

  //Validar
  const ciudad = document.querySelector('#ciudad').value
  const pais = document.querySelector('#pais').value

  if (!ciudad || !pais) {
    mostrarError('All the fields are required')
    return
  }
  //Consultar API
  consultarAPI(ciudad, pais)
}

function mostrarError(mensaje) {
  //Crear alerta
  const alerta = document.querySelector('.bg-red-100')
  if (!alerta) {
    const alerta = document.createElement('div')
    alerta.classList.add(
      'bg-red-100',
      'border-red-400',
      'text-red-700',
      'px-4',
      'py-3',
      'rounded',
      'max-w-md',
      'mx-auto',
      'mt-6',
      'text-center'
    )

    alerta.innerHTML = `
  <strong class ='font-bold'> Error </strong>
  <span class='block'>${mensaje}</span>`

    container.appendChild(alerta)

    setTimeout(() => {
      alerta.remove()
    }, 5000)
  }
}

function consultarAPI(ciudad, pais) {
  const APIKey = '3f43ea8f54e34be96b4527ef592965e0'

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${APIKey}`

  spinner()

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(data => {
      limpiarHTML()
      if (data.cod === '404') {
        mostrarError('City not found')
        return
      }

      mostrarClima(data)
    })
}

function mostrarClima({ name, main: { temp, temp_max, temp_min } }) {
  const actual = document.createElement('p')

  const centigrados = (temp - 273.14).toFixed()
  const centigradosMax = (temp_max - 273.14).toFixed()
  const centigradosMin = (temp_min - 273.14).toFixed()

  const nombreCiudad = document.createElement('p')
  nombreCiudad.textContent = `${name}`

  actual.innerHTML = `${centigrados} &#8451`
  actual.classList.add('font-bold', 'text-6xl')

  const temperaturaMax = document.createElement('p')
  const temperaturaMin = document.createElement('p')

  temperaturaMax.innerHTML = `Max ${centigradosMax} &#8451
  `
  temperaturaMin.innerHTML = `Min ${centigradosMin} &#8451
  `

  const resultadoDiv = document.createElement('div')
  resultadoDiv.classList.add('text-center', 'text-white')
  temperaturaMax.classList.add('text-xl')
  temperaturaMin.classList.add('text-xl')
  nombreCiudad.classList.add('text-2xl', 'font-bold')
  resultadoDiv.appendChild(nombreCiudad)
  resultadoDiv.appendChild(actual)
  resultadoDiv.appendChild(temperaturaMax)
  resultadoDiv.appendChild(temperaturaMin)

  resultado.appendChild(resultadoDiv)
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild)
  }
}

function spinner() {
  limpiarHTML()
  const divSpinner = document.createElement('div')
  divSpinner.classList.add('sk-fading-circle')

  divSpinner.innerHTML = `<div class="spinner"></div>`
  resultado.appendChild(divSpinner)
}

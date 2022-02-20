// Labels
const shortPasswordLabel = 'Password é muito curta'
const mustHaveMoreCharactersLabel = 'A password devia ter mais caracteres'
const lowerCaseCharactersLabel = 'letras minúsculas'
const upperCaseCharactersLabel = 'letras maiúsculas'
const numbersLabel = 'números'
const specialCharactersLabel = 'caracteres especiais'
const repeatedCharactersLabel = 'Caracteres repetidos'
const doesNotHaveLabel = 'Não tem'
const mustHaveMoreLabel = 'Devia ter mais'

const strengthMeter = document.getElementById('strengt-meter')
const passwordInput = document.getElementById('password-input')
const reasonsContainer = document.getElementById('reasons')

passwordInput.addEventListener('input', updateStrengthMeter)

// force initial execution
updateStrengthMeter()

function updateStrengthMeter() {
  const weaknesses = calculatePasswordStrength(passwordInput.value)
  
  let strength = 100
  reasonsContainer.innerHTML = ''

  weaknesses.forEach(weakness => {
    if (weakness == null) {
      return
    }

    strength -= weakness.deduction

    const messageElement = document.createElement('div')
    messageElement.innerText = weakness.message
    reasonsContainer.appendChild(messageElement)
  })

  strengthMeter.style.setProperty('--strength', strength)
}

function calculatePasswordStrength(password) {
  const weaknesses = []

  weaknesses.push(lengthWeakness(password))
  weaknesses.push(lowerCaseWeakness(password))
  weaknesses.push(upperCaseWeakness(password))
  weaknesses.push(numberWeakness(password))
  weaknesses.push(specialCharactersWeakness(password))
  weaknesses.push(repeatCharacteresWeakness(password))

  return weaknesses
}

function lengthWeakness(password) {
  const length = password.length

  if (length <= 5) {
    return {
      message: shortPasswordMessage,
      deduction: 40
    }
  }

  if (length <= 10) {
    return {
      message: mustHaveMoreCharactersLabel,
      deduction: 15
    }
  }
}

function lowerCaseWeakness(password) {
  return characterTypeWeakness(password, /[a-z]/g, lowerCaseCharactersLabel)
}

function upperCaseWeakness(password) {
  return characterTypeWeakness(password, /[A-Z]/g, upperCaseCharactersLabel)
}

function numberWeakness(password) {
  return characterTypeWeakness(password, /[1-9]/g, numbersLabel)
}

function specialCharactersWeakness(password) {
  return characterTypeWeakness(password, /[^0-9a-zA-Z\s]/g, specialCharactersLabel)
}

function characterTypeWeakness(password, regexExpression, type) {
  const matches = password.match(regexExpression) || []

  if (matches.length === 0) {
    return {
      message: `${doesNotHaveLabel} ${type}`,
      deduction: 20
    }
  }

  if (matches.length <= 2) {
    return {
      message: `${mustHaveMoreLabel} ${type}`,
      deduction: 5
    }
  }
}

function repeatCharacteresWeakness(password) {
  const matches = password.match(/(.)\1/g) || []

  if (matches.length > 0) {
    return {
      message: repeatedCharactersLabel,
      deduction: matches.length * 10
    }
  }
}
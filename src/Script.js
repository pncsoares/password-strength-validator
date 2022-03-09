// Labels
const shortPasswordLabel = 'Password too short';
const mustHaveMoreCharactersLabel = 'The password could have more characters';
const lowerCaseCharactersLabel = 'lowercase letters';
const upperCaseCharactersLabel = 'uppercase letters';
const numbersLabel = 'numbers';
const specialCharactersLabel = 'special characters';
const repeatedCharactersLabel = 'Repeated characters';
const doesNotHaveLabel = 'Does not have';
const mustHaveMoreLabel = 'Could have more';

const strengthMeter = document.getElementById('strength-meter');
const passwordInput = document.getElementById('password-input');
const reasonsContainer = document.getElementById('reasons');

passwordInput.addEventListener('input', updateStrengthMeter);

// force initial execution
updateStrengthMeter();

function updateStrengthMeter() {
    const weaknesses = calculatePasswordStrength(passwordInput.value);

    let strength = 100;
    reasonsContainer.innerHTML = '';

    weaknesses.forEach(weakness => {
        if (weakness == null) {
            return;
        }

        strength -= weakness.deduction;

        const messageElement = document.createElement('div');
        messageElement.innerText = weakness.message;
        reasonsContainer.appendChild(messageElement);
    })

    strengthMeter.style.setProperty('--strength', strength);
}

function calculatePasswordStrength(password) {
    const weaknesses = [];

    weaknesses.push(lengthWeakness(password));
    weaknesses.push(lowerCaseWeakness(password));
    weaknesses.push(upperCaseWeakness(password));
    weaknesses.push(numberWeakness(password));
    weaknesses.push(specialCharactersWeakness(password));
    weaknesses.push(repeatCharactersWeakness(password));

    return weaknesses;
}

function lengthWeakness(password) {
    const length = password.length;

    if (length <= 5) {
        return {
            message: shortPasswordLabel,
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
    return characterTypeWeakness(password, /[a-z]/g, lowerCaseCharactersLabel);
}

function upperCaseWeakness(password) {
    return characterTypeWeakness(password, /[A-Z]/g, upperCaseCharactersLabel);
}

function numberWeakness(password) {
    return characterTypeWeakness(password, /[1-9]/g, numbersLabel);
}

function specialCharactersWeakness(password) {
    return characterTypeWeakness(password, /[^0-9a-zA-Z\s]/g, specialCharactersLabel);
}

function characterTypeWeakness(password, regexExpression, type) {
    const matches = password.match(regexExpression) || [];

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

function repeatCharactersWeakness(password) {
    const matches = password.match(/(.)\1/g) || [];

    if (matches.length > 0) {
        return {
            message: repeatedCharactersLabel,
            deduction: matches.length * 10
        }
    }
}

function getAlphabet() {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
}

function getRandomAlphabet(index) {
    const alphabet = getAlphabet();
    return alphabet[index];
}

function getNumbers() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
}

function getRandomNumber(index) {
    const numbers = getNumbers();
    return numbers[index];
}

function getSpecialCharacters() {
    return ['$', '!', '_', '-', '.', '#', '@', '%', '(', ')', '=', '*'];
}

function getRandomSpecialCharacter(index) {
    const specialCharacters = getSpecialCharacters();
    return specialCharacters[index];
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePassword() {
    const passwordLabel = document.getElementById('generated-password');
    let generatedPassword = '';
    let randomNumber, flag, lowerUpperCaseFlag;

    for (let i = 0; i < 16; i++) {
        flag = generateRandomNumber(1, 3);

        if (flag == 1) {
            lowerUpperCaseFlag = generateRandomNumber(0, 1);
            randomNumber = generateRandomNumber(0, 25);
            let letter = getRandomAlphabet(randomNumber);

            if (lowerUpperCaseFlag == 0) {
                letter = letter.toLowerCase();
            }

            generatedPassword += letter;
        }
        else if (flag == 2) {
            randomNumber = generateRandomNumber(0, 9);
            const number = getRandomNumber(randomNumber);
            generatedPassword += number;
        }
        else if (flag == 3) {
            randomNumber = generateRandomNumber(0, 11);
            const specialCharacter = getRandomSpecialCharacter(randomNumber);
            generatedPassword += specialCharacter;
        }
    }

    passwordLabel.innerText = generatedPassword;
}

function copyToClipboard() {
    
}
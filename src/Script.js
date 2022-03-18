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

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const specialCharacters = ['$', '!', '_', '-', '.', '#', '@', '%', '(', ')', '=', '*'];

function getRandomAlphabet() {
    const index = generateRandomNumber(0, 25);
    return alphabet[index];
}

function getRandomNumber() {
    const index = generateRandomNumber(0, 9);
    return numbers[index];
}

function getRandomSpecialCharacter() {
    const index = generateRandomNumber(0, 11);
    return specialCharacters[index];
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePassword() {
    const passwordLabel = getPasswordLabel();
    let generatedPassword = '';
    const firstSlice = 20;
    const secondSlice = 80;
    let flag, lowerCaseFlag;

    while (generatedPassword.length < 20) {
        flag = generateRandomNumber(1, 100);

        console.log(flag);

        if (flag >= 0 && flag < firstSlice) {
            const number = getRandomNumber();

            if (generatedPassword.indexOf(number) > -1) {
                continue;
            }

            generatedPassword += number;
        }
        else if (flag > firstSlice && flag < secondSlice) {
            let letter = getRandomAlphabet();

            if (generatedPassword.indexOf(letter) > -1) {
                continue;
            }

            lowerCaseFlag = generateRandomNumber(0, 100);

            if (flag <= 50) {
                letter = letter.toLowerCase();
            }

            generatedPassword += letter;
        }
        else if (flag > secondSlice && flag <= 100) {
            const specialCharacter = getRandomSpecialCharacter();

            if (generatedPassword.indexOf(specialCharacter) > -1) {
                continue;
            }

            generatedPassword += specialCharacter;
        }
    }

    passwordLabel.innerText = generatedPassword;

    copyToClipboard();
}

function copyToClipboard() {
    const passwordLabel = getPasswordLabel();
    navigator.clipboard.writeText(passwordLabel.innerText);

    showClipboardLabel();

    const messageLabel = getCopyToClipboardLabel();
    messageLabel.innerText = 'Password copied to clipboard';


    setTimeout(() => {
        hideClipboardLabel();
    }, 5000);
}

function showClipboardLabel() {
    const passwordLabel = getCopyToClipboardLabel();
    passwordLabel.style.visibility = 'visible';
}

function hideClipboardLabel() {
    const passwordLabel = getCopyToClipboardLabel();
    passwordLabel.style.visibility = 'hidden';
}

function getPasswordLabel() {
    return document.getElementById('generated-password-label');
}

function getCopyToClipboardLabel() {
    return document.getElementById('copy-message-label');
}
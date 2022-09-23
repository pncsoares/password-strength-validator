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
    const passwordLenghtSelector = getPasswordLenghtSelector();
    let passwordLength = Number(passwordLenghtSelector.value);

    const lowerCaseLettersCheckbox = getLowerCaseLettersCheckbox();
    const lowerCaseLettersQuantitySelector = getLowerCaseLettersQuantitySelector();

    const upperCaseLettersCheckbox = getUpperCaseLettersCheckbox();
    const upperCaseLettersQuantitySelector = getUpperCaseLettersQuantitySelector();

    const numbersCheckbox = getNumbersCheckbox();
    const numbersQuantitySelector = getNumbersQuantitySelector();

    const specialCharactersCheckbox = getSpecialCharactersCheckbox();
    const specialCharactersQuantitySelectorx = getSpecialCharactersQuantitySelector();

    if (!lowerCaseLettersCheckbox.checked &&
        !upperCaseLettersCheckbox.checked &&
        !numbersCheckbox.checked &&
        !specialCharactersCheckbox.checked) {
        alert('You need to check at least one rule!');
        return;
    }

    const passwordRules = [];

    if (lowerCaseLettersCheckbox.checked) {
        passwordRules.push({
            characters: 'abcdefghijklmnopqrstuvwxyz',
            min: Number(lowerCaseLettersQuantitySelector.value)
        });
    }

    if (upperCaseLettersCheckbox.checked) {
        passwordRules.push({
            characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            min: Number(upperCaseLettersQuantitySelector.value)
        });
    }

    if (numbersCheckbox.checked) {
        passwordRules.push({
            characters: '0123456789',
            min: Number(numbersQuantitySelector.value)
        });
    }

    if (specialCharactersCheckbox.checked) {
        passwordRules.push({
            characters: '!@#$&*?|%+-_./:;=()[]{}',
            min: Number(specialCharactersQuantitySelectorx.value)
        });
    }

    let allCharacters = '';
    let allMin = 0;

    passwordRules.forEach((rule) => {
        allCharacters += rule.characters;
        allMin += rule.min;
    });

    if (allMin != passwordLength) {
        alert(`The rules you chose only have ${Number(allMin)} characters but you chose ${passwordLength} as password lenght...\n\nReview your configurations!`);
        return;
    }

    passwordRules.push({
        characters: allCharacters,
        min: passwordLength - allMin
    });

    let generatedPassword = '';

    passwordRules.forEach((rule) => {
        if (rule.min > 0) {
            generatedPassword += shuffleString(rule.characters, rule.min);
        }
    });

    const passwordLabel = getPasswordLabel();
    passwordLabel.innerText = shuffleString(generatedPassword);

    copyToClipboard();
}

function shuffleString(str, maxlength) {
    let shuffledString = str.split('').sort(() => {
        return 0.5 - Math.random();
    }).join('');

    if (maxlength > 0) {
        shuffledString = shuffledString.substr(0, maxlength);
    }

    return shuffledString;
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

function handleCheck(element, relatedElementId) {
    var visible = 'none';

    if (element.checked) {
        visible = 'inline-block';
    }

    document.getElementById(relatedElementId).style.display = visible;
}

function resetToDefaults() {
    const passwordLenghtSelector = getPasswordLenghtSelector();
    passwordLenghtSelector.value = 16;

    const lowerCaseLettersCheckbox = getLowerCaseLettersCheckbox();
    lowerCaseLettersCheckbox.checked = true;

    const lowerCaseLettersQuantitySelector = getLowerCaseLettersQuantitySelector();
    lowerCaseLettersQuantitySelector.value = 4;
    lowerCaseLettersQuantitySelector.style.display = 'inline-block';

    const upperCaseLettersCheckbox = getUpperCaseLettersCheckbox();
    upperCaseLettersCheckbox.checked = true;

    const upperCaseLettersQuantitySelector = getUpperCaseLettersQuantitySelector();
    upperCaseLettersQuantitySelector.value = 4;
    upperCaseLettersQuantitySelector.style.display = 'inline-block';

    const numbersCheckbox = getNumbersCheckbox();
    numbersCheckbox.checked = true;

    const numbersQuantitySelector = getNumbersQuantitySelector();
    numbersQuantitySelector.value = 4;
    numbersQuantitySelector.style.display = 'inline-block';

    const specialCharactersCheckbox = getSpecialCharactersCheckbox();
    specialCharactersCheckbox.checked = true;

    const specialCharactersQuantitySelectorx = getSpecialCharactersQuantitySelector();
    specialCharactersQuantitySelectorx.value = 4;
    specialCharactersQuantitySelectorx.style.display = 'inline-block';
}

function getPasswordLenghtSelector() {
    return document.getElementById('password-lenght');
}

function getLowerCaseLettersCheckbox() {
    return document.getElementById('lower-case-letters');
}

function getLowerCaseLettersQuantitySelector() {
    return document.getElementById('lower-case-letters-quantity');
}

function getUpperCaseLettersCheckbox() {
    return document.getElementById('upper-case-letters');
}

function getUpperCaseLettersQuantitySelector() {
    return document.getElementById('upper-case-letters-quantity');
}

function getNumbersCheckbox() {
    return document.getElementById('numbers');
}

function getNumbersQuantitySelector() {
    return document.getElementById('numbers-quantity');
}

function getSpecialCharactersCheckbox() {
    return document.getElementById('special-characters');
}

function getSpecialCharactersQuantitySelector() {
    return document.getElementById('special-characters-quantity');
}

function getPasswordLabel() {
    return document.getElementById('generated-password-label');
}

function getCopyToClipboardLabel() {
    return document.getElementById('copy-message-label');
}

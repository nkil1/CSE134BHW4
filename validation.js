let form_errors = [];

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const questionsInput = document.getElementById('questions');
const re = /^[A-Za-z0-9 .,!?@']+$/;

function _pushError(type, errorMsg) {
    form_errors.push({
        field: type.id,
        error: errorMsg
    });

}

function _invalidInput(inputField, errorID) {
    
    _pushError(inputField, 'Illegal character detected.')


    inputField.classList.add('flash');
    document.getElementById(errorID).textContent = 'Illegal character detected.';
    setTimeout(() => {
        inputField.classList.remove('flash');
        inputField.classList.add('flash.transition-to-white')
    }, 300);

    setTimeout(() => {
        inputField.classList.remove('flash.transition-to-white');
    }, 600);

    setTimeout(() => {
        inputField.classList.remove('flash.transition-to-white');
        document.getElementById(errorID).textContent = '';
    }, 2200);
}


function _lengthCheck(inputField, limit) {
    console.log('length checking');
    const remaining = limit - inputField.value.length;
    const infoElement = document.getElementById('questionsInfo')

    if (remaining <= 10) {
        infoElement.classList.remove('info-message', 'warn-message');
        infoElement.classList.add('error-message');
    } else if (remaining <= 50) {
        infoElement.classList.remove('info-message', 'error-message');
        infoElement.classList.add('warn-message');
    } else {
        infoElement.classList.remove('error-message', 'warn-message');
        infoElement.classList.add('info-message');
    }

    infoElement.textContent = remaining + ' characters remaining.';

}

// Store the last valid value of each input
let lastValid = {
    name: nameInput.value,
    email: emailInput.value,
    questions: questionsInput.value
};

function handleInput(inputField, fieldName) {
    if (inputField.value.length <= 0 ||re.test(inputField.value)) {
        lastValid[fieldName] = inputField.value; // Update the last valid value
    } else {
        _invalidInput(inputField, inputField.id + 'Error');
        inputField.value = lastValid[fieldName]; // Revert to the last valid value
    }
}

nameInput.addEventListener('input', () => handleInput(nameInput, 'name'));
emailInput.addEventListener('input', () => handleInput(emailInput, 'email'));
questionsInput.addEventListener('input', () => {
    handleInput(questionsInput, 'questions');
    _lengthCheck(questionsInput, 250);
});

_lengthCheck(questionsInput, 250); // Initial check


[nameInput, emailInput, questionsInput].forEach(function(inputField) {
    inputField.addEventListener('input', function(event) {
        let value = inputField.value;
        let lastChar = value.charAt(value.length - 1);

        // Check if the last character matches the pattern
        if (!re.test(lastChar) && value.length > 0) {
            _invalidInput(inputField, inputField.id + 'Error');
            // Remove the last character
            inputField.value = value.substring(0, value.length - 1);
        } else if (inputField.value.length >= 250) {
            inputField.value = value.substring(0, value.length - 1);
        }
    });
});

    document.getElementById('form-container').addEventListener('submit', function(event) {
        let isValid = true;
        console.log('Submit event triggered');


        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('questionsError').textContent = '';

        if (!nameInput.checkValidity()) {
            _pushError(nameInput, 'Please enter your name.')
            document.getElementById('nameError').textContent = 'Please enter your name.';
            isValid = false;
        }

        if (!emailInput.checkValidity()) {
            _pushError(emailInput, 'Please enter a valid email address.')
            document.getElementById('emailError').textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        if (questionsInput.value.length < 10 || questionsInput.value.length > 250) {
            _pushError(questionsInput, 'Please enter between 10 and 250 characters for comments.')
            document.getElementById('questionsError').textContent = 'Please enter between 10 and 250 characters for comments.';
            isValid = false;
        } 

        if (!isValid) {
            event.preventDefault();
            const errorInput = document.createElement('input');
            errorInput.type = 'hidden';
            errorInput.name = 'form_errors';
            errorInput.value = JSON.stringify(form_errors);
            this.appendChild(errorInput);
        }
    });
function _invalidInput(inputField, errorID) {
    inputField.classList.add('flash');
    document.getElementById(errorID).textContent = 'Illegal character detected.';
    setTimeout(() => {
        inputField.classList.remove('flash');
        document.getElementById(errorID).textContent = '';
    }, 3000);
}

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const questionsInput = document.getElementById('questions');
const re = /^[A-Za-z0-9 .,!?']+$/;

[nameInput, emailInput, questionsInput].forEach(function(inputField) {
    inputField.addEventListener('input', function(event) {
        let value = inputField.value;
        let lastChar = value.charAt(value.length - 1);

        // Check if the last character matches the pattern
        if (!re.test(lastChar) && value.length > 0) {
            _invalidInput(inputField, inputField.id + 'Error');
            // Remove the last character
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
            document.getElementById('nameError').textContent = 'Please enter your name.';
            isValid = false;
        }

        if (!emailInput.checkValidity()) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        if (questionsInput.value.length < 10 || questionsInput.value.length > 500) {
            document.getElementById('questionsError').textContent = 'Please enter between 10 and 500 characters for comments.';
            isValid = false;
        } else if (!re.test(questionsInput.value)) {
            document.getElementById('questionsError').textContent = 'Please only use alphanumeric characters and basic punctuation.'
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
    });
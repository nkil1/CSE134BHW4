document.getElementById('mode-switch').addEventListener('change', function() {
    var mode = this.checked ? 'dark' : 'light';
    document.getElementById('my-references').contentWindow.postMessage(mode, '*'); 

    if(this.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });


let form_errors = [];

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const commentsInput = document.getElementById('comments');
const re = /^[A-Za-z0-9 .,!?@']+$/;

function _pushError(inputField, errorMsg) {
    form_errors.push({
        field: inputField.id,
        error: errorMsg,
        value: inputField.value
    });

}


// for noscript
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('form-container');
    if (form) {
        form.setAttribute('novalidate', '');
    }

    if(localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('mode-switch').checked = true;
    }

    document.body.classList.add('js-enabled');
});



function _invalidInput(inputField, errorID) {
    
    // _pushError(inputField, 'Illegal character detected.')


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

    const remaining = limit - inputField.value.length;
    const infoElement = document.getElementById('commentsInfo')

    if (remaining <= 20) {
        infoElement.classList.remove('info-message', 'warn-message');
        infoElement.classList.add('error-message');
    } else if (remaining <= 75) {
        infoElement.classList.remove('info-message', 'error-message');
        infoElement.classList.add('warn-message');
    } else {
        infoElement.classList.remove('error-message', 'warn-message');
        infoElement.classList.add('info-message');
    }

    infoElement.textContent = remaining + ' characters remaining.';

}

commentsInput.addEventListener('paste', function(event) {
    setTimeout(() => {
        if (this.value.length > 250) {
            this.value = this.value.substr(0, 250);
        }

        _lengthCheck(this, 250);
    }, 0);
});

let lastValid = {
    name: nameInput.value,
    email: emailInput.value,
    comments: commentsInput.value
};

function handleInput(inputField, fieldName) {
    if (inputField.value.length <= 0 ||re.test(inputField.value)) {
        lastValid[fieldName] = inputField.value; 
    } else {
        // if (inputField.value !== lastValid[fieldName]) {
        //     _pushError(inputField, 'Illegal character detected.');
        // }
        _invalidInput(inputField, inputField.id + 'Error');
        inputField.value = lastValid[fieldName]; 
    }
}

nameInput.addEventListener('input', () => handleInput(nameInput, 'name'));
emailInput.addEventListener('input', () => handleInput(emailInput, 'email'));
commentsInput.addEventListener('input', () => {
    handleInput(commentsInput, 'comments');
    _lengthCheck(commentsInput, 250);
});

_lengthCheck(commentsInput, 250); // Initial check


[nameInput, emailInput, commentsInput].forEach(function(inputField) {
    inputField.addEventListener('input', function(event) {
        let value = inputField.value;
        let lastChar = value.charAt(value.length - 1);

       
        if (!re.test(lastChar) && value.length > 0) {
            _invalidInput(inputField, inputField.id + 'Error');
          
            inputField.value = value.substring(0, value.length - 1);
        } else if (inputField.value.length >= 250) {
            inputField.value = value.substring(0, 250);
        }
    });
});

let formSubmitted = false;

    document.getElementById('form-container').addEventListener('submit', function(event) {
        event.preventDefault();
        form_errors = [];
        
        let isValid = true;

        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('commentsError').textContent = '';

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

        if (commentsInput.value.length < 10 || commentsInput.value.length > 250) {
            _pushError(commentsInput, 'Please enter between 10 and 250 characters for comments.')
            document.getElementById('commentsError').textContent = 'Please enter between 10 and 250 characters for comments.';
            isValid = false;
        } 
            
        if (!formSubmitted || form_errors.length > 0) {
            const errorInput = document.createElement('input');
            errorInput.type = 'hidden';
            errorInput.name = 'form_errors';
            errorInput.value = JSON.stringify(form_errors);
            this.appendChild(errorInput);
        }
    
        formSubmitted = true;
        
            if(isValid) {
                this.submit();
            }
    });
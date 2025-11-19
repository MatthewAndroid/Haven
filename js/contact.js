document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const alertMessage = document.getElementById('alertMessage');

    function validateForm(formData) {
        const errors = {};
        
        // Validate first name
        if (!formData.get('firstName').trim()) {
            errors.firstName = 'First name is required';
        }
        
        // Validate last name
        if (!formData.get('lastName').trim()) {
            errors.lastName = 'Last name is required';
        }
        
        // Validate email
        const email = formData.get('email').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        // Validate phone (optional, but validate if provided)
        const phone = formData.get('phone').trim();
        if (phone) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone) || phone.length < 10) {
                errors.phone = 'Please enter a valid phone number';
            }
        }
        
        // Validate query type
        if (!formData.get('queryType')) {
            errors.queryType = 'Please select a query type';
        }
        
        // Validate message
        if (!formData.get('message').trim()) {
            errors.message = 'Message is required';
        }
        
        return errors;
    }

    function displayErrors(errors) {
        // Clear all previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });

        // Display new errors
        Object.keys(errors).forEach(field => {
            const input = document.getElementById(field) || document.querySelector(`input[name="${field}"]`);
            const errorSpan = input.closest('.form-group').querySelector('.error-message');
            
            if (input) {
                input.classList.add('error');
            }
            if (errorSpan) {
                errorSpan.textContent = errors[field];
            }
        });
    }

    // Clear errors on input
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorSpan = this.closest('.form-group')?.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        });
        
        input.addEventListener('change', function() {
            this.classList.remove('error');
            const errorSpan = this.closest('.form-group')?.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        });
    });

    function showAlert(message, type) {
        alertMessage.textContent = message;
        alertMessage.className = `alert alert-${type}`;
        alertMessage.style.display = 'block';
        
        alertMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                alertMessage.style.display = 'none';
            }, 5000);
        }
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide any previous alerts
        alertMessage.style.display = 'none';
        
        const formData = new FormData(form);
        
        const errors = validateForm(formData);
        
        if (Object.keys(errors).length > 0) {
            displayErrors(errors);
            showAlert('Please fix the errors below', 'error');
            return;
        }
        
        displayErrors({});
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        
        try {
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                queryType: formData.get('queryType'),
                message: formData.get('message')
            };
            
            const response = await fetch('https://formspree.io/f/mblwyyrp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showAlert('Thank you for reaching out! We will get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showAlert(
                'There was an error sending your message. Please try again later.',
                'error'
            );
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
});
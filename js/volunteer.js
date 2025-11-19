document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('volunteerForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const alertMessage = document.getElementById('alertMessage');

    // Form validation
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
        
        // Validate phone
        const phone = formData.get('phone').trim();
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phone) {
            errors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(phone) || phone.length < 10) {
            errors.phone = 'Please enter a valid phone number';
        }
        
        // Validate interests (at least one checkbox)
        const interests = formData.getAll('interest');
        if (interests.length === 0) {
            errors.interest = 'Please select at least one area of interest';
        }
        
        return errors;
    }

    // Display errors
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
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorSpan = this.closest('.form-group')?.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        });
    });

    // Show alert message
    function showAlert(message, type) {
        alertMessage.textContent = message;
        alertMessage.className = `alert alert-${type}`;
        alertMessage.style.display = 'block';
        
        // Scroll to alert
        alertMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                alertMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide any previous alerts
        alertMessage.style.display = 'none';
        
        // Get form data
        const formData = new FormData(form);
        
        // Validate form
        const errors = validateForm(formData);
        
        if (Object.keys(errors).length > 0) {
            displayErrors(errors);
            showAlert('Please fix the errors below', 'error');
            return;
        }
        
        // Clear any previous errors
        displayErrors({});
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        
        try {
            // Prepare data for Formspree
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                interests: formData.getAll('interest').join(', '),
                message: formData.get('message')
            };
            
            // Make request to Formspree
            const response = await fetch('https://formspree.io/f/mblwyyrp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                // Success
                showAlert('Thank you for signing up! We will contact you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showAlert(
                'There was an error submitting your application. Please try again later.',
                'error'
            );
        } finally {
            // Re-enable button and hide loading state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
});
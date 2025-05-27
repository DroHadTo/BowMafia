document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Make toggleBowDogFields function global so it can be called from HTML
function toggleBowDogFields() {
    const bowDogYes = document.getElementById('bowDogYes');
    const bowDogFields = document.getElementById('bowDogFields');
    
    if (bowDogYes && bowDogYes.checked) {
        bowDogFields.style.display = 'block';
    } else {
        bowDogFields.style.display = 'none';
    }
}

// DAO Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const daoForm = document.getElementById('daoForm');
    
    if (daoForm) {
        daoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.xHandle || !data.telegramHandle || !data.paymentAsset || !data.bowDog) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // If they own a bow dog, check for additional fields
            if (data.bowDog === 'yes') {
                if (!data.dogeWallet) {
                    alert('Please enter your Doge wallet address.');
                    return;
                }
            }
            
            // Here you would normally send the data to your server
            console.log('Form submitted:', data);
            alert('Thank you for joining the BowMafia DAO! We will contact you soon.');
            
            // Reset form
            this.reset();
            document.getElementById('bowDogFields').style.display = 'none';
        });
    }
});
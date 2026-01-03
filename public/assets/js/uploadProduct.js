const form = document.getElementById('prod-form');
const errorEl = document.createElement('p');
errorEl.style.color = 'red';
form.prepend(errorEl);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // --- Get field-specific error spans ---
    const nameErr = document.getElementById('name-err');
    const imgErr = document.getElementById('img-err');
    imgErr.textContent = '';
    errorEl.textContent = '';
    errorEl.style.color = 'red';

    // --- Get values ---
    const name = form.name.value.trim();
    const imageInput = form.querySelector('input[name="product-image"]');
    const file = imageInput.files[0];

    // --- Field validation ---
    if (name.length < 5) {
        nameErr.textContent = 'Five Character long';
        return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        imgErr.textContent = 'Only JPG, PNG, or WEBP images are allowed';
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        imgErr.textContent = 'Image size must be under 2MB';
        return;
    }

    // --- Prepare form data ---
    

    // --- Loading state ---
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    // --- Send to backend ---
    setTimeout(()=>{
        const formData = new FormData(form);
    fetch('../../backend/products/addProduct.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Product';

        if (data.status !== 'success') {
            errorEl.textContent = data.message || 'Upload failed';
            return;
        }

        // Success
        errorEl.style.color = 'green';
        errorEl.textContent = data.message;
        form.reset();

        // Optional image preview
        if (data.file) {
            const img = document.getElementById('preview');
            if (img) {
                img.src = '../../images/' + data.file;
                img.style.display = 'block';
            }
        }
    })
    .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Product';
        errorEl.textContent = 'Upload failed';
        console.error('Upload failed:', error);
    });
    }   
    ,2000);
});

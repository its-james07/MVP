const logOutBtns = document.querySelectorAll('.log-out-btn');

logOutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        fetch('../backend/authe/logout.php', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                window.location.href = 'index.php';
            } else {
                console.error('Sign out failed:', data.message);
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
        });
    });
});

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Product Not Found</title>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', 'Segoe UI', sans-serif;
}

body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #eef2f3, #dfe9f3);
    padding: 20px;
}

/* Glass card */
.container {
    width: 100%;
    max-width: 600px;
    text-align: center;
    padding: 60px 40px;
    border-radius: 20px;
    background: rgba(179, 183, 181, 0.6);
    backdrop-filter: blur(15px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
    transition: 0.3s ease;
}

.container:hover {
    transform: translateY(-6px);
    box-shadow: 0 30px 60px rgba(0,0,0,0.15);
}

/* Icon */
.icon {
    font-size: 70px;
    margin-bottom: 20px;
    animation: float 2.5s ease-in-out infinite;
}

@keyframes float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
}

/* Title */
h1 {
    font-size: 36px;
    font-weight: 700;
    color: #1f3d2b;
    margin-bottom: 10px;
}

/* Subtitle */
p {
    color: #555;
    font-size: 16px;
    margin-bottom: 35px;
    line-height: 1.6;
}

/* Buttons */
.buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
}

.buttons a {
    text-decoration: none;
    padding: 12px 22px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.25s ease;
}

/* Primary button */
.primary {
    background: #1f3d2b;
    color: white;
    box-shadow: 0 8px 20px rgba(31, 61, 43, 0.2);
}

.primary:hover {
    background: #2e5c42;
    transform: translateY(-2px);
}

/* Secondary button */
.secondary {
    border: 2px solid #1f3d2b;
    color: #1f3d2b;
}

.secondary:hover {
    background: #1f3d2b;
    color: white;
    transform: translateY(-2px);
}

/* Small hint text */
.hint {
    margin-top: 25px;
    font-size: 13px;
    color: #888;
}

/* Responsive */
@media (max-width: 600px) {
    h1 {
        font-size: 28px;
    }
    p {
        font-size: 15px;
    }
}
</style>
</head>

<body>

<div class="container">
    
    <div class="icon">!</div>

    <h1>Product Not Found</h1>

    <p>
        We couldn’t find the product you’re looking for. It may have been removed,
        renamed, or is temporarily unavailable.
    </p>

    <div class="buttons">
        <a href="../pages/product-catalog.php" class="secondary">Browse Products</a>
        <a href="../index.php" class="primary">Go Home</a>
    </div>

    <div class="hint">
        Tip: Try searching for similar products or explore our catalog.
    </div>

</div>

</body>
</html>
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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

body {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9fafb;
    color: #111;
}

/* Wrapper */
.wrapper {
    text-align: center;
    max-width: 420px;
    padding: 20px;
}

/* Icon */
.icon {
    font-size: 40px;
    margin-bottom: 20px;
    color: #999;
}

/* Title */
h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
}

/* Text */
p {
    font-size: 15px;
    color: #666;
    margin-bottom: 30px;
    line-height: 1.5;
}

/* Buttons */
.actions {
    display: flex;
    justify-content: center;
    gap: 12px;
}

/* Button base */
a {
    text-decoration: none;
    padding: 10px 18px;
    font-size: 14px;
    border-radius: 6px;
    transition: 0.2s ease;
}

/* Primary */
.primary {
    background: #111;
    color: #fff;
}

.primary:hover {
    background: #333;
}

/* Secondary */
.secondary {
    border: 1px solid #ccc;
    color: #333;
}

.secondary:hover {
    background: #eee;
}
</style>
</head>

<body>

<div class="wrapper">

    <div class="icon">⚠️</div>

    <h1>Product not found</h1>

    <p>
        The product you’re looking for doesn’t exist or is no longer available.
    </p>

    <div class="actions">
        <a href="../pages/product-catalog.php" class="secondary">Browse</a>
        <a href="../index.php" class="primary">Home</a>
    </div>

</div>

</body>
</html>
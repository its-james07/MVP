<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Product Not Found</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family: Arial, Helvetica, sans-serif;
}

body{
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    background: rgba(232, 237, 232, 0.45);
    padding:20px;
}

.not-found-container{
    max-width:700px;
    width:100%;
    text-align:center;
    background:white;
    padding:50px 30px;
    border-radius:12px;
    box-shadow:0 10px 25px rgba(0,0,0,0.08);
    background: 
        radial-gradient(ellipse at 20% 50%, rgba(7, 52, 32, 0.07) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(7, 52, 32, 0.05) 0%, transparent 50%),
        radial-gradient(ellipse at 60% 80%, rgba(7, 52, 32, 0.04) 0%, transparent 40%),
        linear-gradient(135deg, rgba(7, 52, 32, 0.03) 0%, transparent 50%, rgba(7, 52, 32, 0.06) 100%);
}

.not-found-icon{
    font-size:70px;
    margin-bottom:20px;
}

.not-found-title{
    font-size:32px;
    font-weight:700;
    margin-bottom:10px;
    color:#2c6e49;
}

.not-found-text{
    color:#333;
    margin-bottom:30px;
}

/* .search-box{
    display:flex;
    gap:10px;
    margin-bottom:25px;
} */

/* .search-box input{
    flex:1;
    padding:12px 14px;
    border:1px solid #ddd;
    border-radius:6px;
    font-size:15px;
}

.search-box button{
    padding:12px 20px;
    border:none;
    background:#111;
    color:white;
    border-radius:6px;
    cursor:pointer;
}

.search-box button:hover{
    background:#333;
} */

.actions{
    display:flex;
    justify-content:center;
    gap:15px;
    flex-wrap:wrap;
}

.actions a{
    text-decoration:none;
    padding:12px 20px;
    border-radius:6px;
    font-size:14px;
}

.btn-primary{
    background:#111;
    color:white;
}

.btn-outline{
    border:1px solid #111;
    color:#111;
}

.btn-primary:hover{
    background:#333;
}

.btn-outline:hover{
    background:#111;
    color:white;
}


/* Responsive */

@media (max-width:600px){

.not-found-title{
    font-size:26px;
}

/* .search-box{
    flex-direction:column;
}

.search-box button{
    width:100%;
} */

}

</style>
</head>

<body>

<div class="not-found-container">

<div class="not-found-icon">🐾</div>

<h1 class="not-found-title">Product Not Found</h1>

<p class="not-found-text">
Sorry, the product you are looking for doesn't exist or may have been removed.
</p>

<!-- <div class="search-box">
<input type="text" placeholder="Search for products...">
<button>Search</button>
</div> -->

<div class="actions">
<a href="../pages/product-catalog.php" class="btn-outline">Browse Products</a>
<a href="../index.php" class="btn-primary">Go Home</a>
</div>

</div>

</body>
</html>
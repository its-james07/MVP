<?php 
// echo "Hello".$_SESSION['username'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../codespace/CSS/styles.css">
  <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"> -->
  <title>Document</title>
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
  <style>
    
    .container{
      display: flex;
      border-radius: 10px;
      box-shadow: 2px 7px 6px rgba(0, 0, 0, 0.1);
    }
 
    .admin-panel{
      height: 80vh;
      width: 17vw;
      padding: 10px;
      margin: 20px;
      border-radius: 15px;
    }

    .admin-panel{
      max-height: 100vh;
      width: 1400px;
    }

    .admin-info{
      color: #333333;
    }

    .actions{
      display: flex;
    }
    .action-btns{
      padding: 8px 15px;
      font-size: 1.1rem;
      font-weight: bold;
      margin: 0 4px;
      background-color: #F5F5F5;
      color: #333333;
      border: none;
      border-radius: 5px; 
      cursor: pointer;
      transition: 0.3s ease;
    }

    .action-btns:hover{background-color:#E7F5EC; color: #1A7F4B}

    .action-btns.active{
      background-color: #1A7F4B;
      color: #ffffff;
    }

    .for-sellers{
      height: 580px;
      box-shadow: 2px 7px 6px rgba(0, 0, 0, 0.1);
    }

    .for-sellers .table-head{
      display: flex;
      margin: 20px 5px;
      justify-content: space-around;
      background: #F5F5F5;
      padding: 10px 15px;
      text-align: left;
      border-bottom: 1px solid #E7E7E7;
      font-weight: 600;
    }

    .table-head li{
      font-weight: 600;
      margin: 15px 5px;
    }

    .icon-modal2{
      position: fixed;
      top: 10%;
      right: 8%;
      width: fit-content;
      height: 80px;
      background-color: #fafafa;
      padding: 10px;
      z-index: 99;
    }

    .ibtn{
      margin: 4px;
      padding: 10px;
    }
  </style>
</head>
<body>
    <header>
      <div class="header-main">
      <div class="logo-container">
      <a href="#main" style="color: green;"><b>admin Dashboard</b></a>
      </div>
      <!-- Top Right Icons -->
      <div class="top-right-icons">
      <span class="admin-info">James Karki</span>
      <button class="action-btn user-login">
          <ion-icon name="person-outline"></ion-icon>
        </button>
      </div>
    </div>
    </header>
    <main>
       <div class="icon-modal2" style="border: 1px solid black;">
        <button class="ibtn">Profile</button><br>
        <button class="ibtn">Logout</button>
      </div>
    <div class="container">
    <div class="admin-panel">
      <div class="actions">
        <button class="action-btns">Seller Registration</button>
          <button class="action-btns">User Control Panel</button><br>
          <button class="action-btns">Product Control Panel</button>
      <div class="search-bar" style="margin-left: 40px;">
      <input type="search" name="search" class="search-field" placeholder="Search here" />
      <button class="search-btn">
      <ion-icon name="search-outline"></ion-icon>
      </button>
      </div>
          </div>
          <div class="for-sellers"> 
              <ul class="table-head">
                <li>Shop Name</li>
                <li>Owners name</li>
                <li>Address</li>
                <li>Contact</li>
                <li>Status</li>
              </ul>
          </div>
        </div>
      </div>
    </main>
    <script>
    const actionBtns = document.querySelectorAll('.action-btns');
    actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
    actionBtns.forEach(button => button.classList.remove('active'));
    btn.classList.add('active');
  });
});

    </script>
</body>
</html>
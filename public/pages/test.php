<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bootstrap Live Alert</title>

  <link rel="stylesheet" href="../assets/vendor/bootstrap/css/bootstrap.min.css" />
</head>
<body class="p-4">
<button type="button" class="btn btn-primary" id="liveToastBtn">Show live toast</button>

<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <img src="/mvp/" class="rounded me-2" alt="...">
      <strong class="me-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      Hello, world! This is a toast message.
    </div>
  </div>
</div>
<script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

<script>
// const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
// const alertBtn = document.getElementById('liveAlertBtn');

// function showAlert(message, type) {
//   const wrapper = document.createElement('div');
//   wrapper.innerHTML = `
//     <div class="alert alert-${type} alert-dismissible fade show" role="alert">
//       ${message}
//       <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
//     </div>
//   `;
//   alertPlaceholder.append(wrapper);
// }

// alertBtn.addEventListener('click', () => {
//   showAlert('Nice, you triggered a live Bootstrap alert!', 'primary');
// });
const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}
</script>

</body>
</html>

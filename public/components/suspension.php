<?php
// No if-check here — JS handles the show/hide logic
?>
<div class="modal fade" id="suspendedModal" tabindex="-1"
     data-bs-backdrop="static" data-bs-keyboard="false"
     aria-labelledby="suspendedModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-danger">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="suspendedModalLabel">
          <i class="fas fa-ban me-2"></i> Account Suspended
        </h5>
      </div>
      <div class="modal-body text-center py-4">
        <i class="fas fa-exclamation-circle text-danger mb-3" style="font-size:3rem;"></i>
        <p class="mb-2 fw-semibold">Your account has been suspended.</p>
        <p class="text-muted small">
          Please <a href="/mvp/public/pages/contact-us.php" class="text-danger fw-semibold">contact us</a>
          to reactivate your account.
        </p>
      </div>
      <div class="modal-footer justify-content-center">
        <a href="/mvp/public/index.php" class="btn btn-danger px-4">OK, Got it</a>
      </div>
    </div>
  </div>
</div>
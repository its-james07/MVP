<!-- Cart Modal -->
<div class="cart-modal">
<div class="cart-header">
    <h2>Shopping cart</h2>
    <button class="close-btn">&times;</button>
</div>
<form id="cart-form">
  <div id="inside-cart">
   <table>
    <thead>
      <tr>
        <th>Image</th>
        <th>Product</th>
        <th>Qty</th>
        <th>Total</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="cart-items">
      <!-- <tr>
        <td>
          <img src="assets/images/catProducts/cat-wear.png">
          </td>
          <td>Vans Sk8-Hi Shoes</td>
          <td class="qty"><input type="number" value="2"></td>
          <td>$178</td>
          <td>
            <button class="delete-btn">X</button>
          </td>
          </tr>
          <tr>
        <td>
          <img src="assets/images/catProducts/cat-wear.png">
          </td>
          <td>Vans Sk8-Hi Shoes</td>
          <td class="qty"><input type="number" value="2"></td>
          <td>$178</td>
          <td>
            <button class="delete-btn">X</button>
          </td>
          </tr> -->
  </tbody>
</table>
  </div>
    <div class="total">
        Total: $<span id="cart-total"></span>
    </div>
    <div class="modal-footer">
        <button type="button" id="btn-update" class="cart-btn btn-update">Update</button>
        <button type="button" class="cart-btn btn-checkout">Checkout</button>
    </div>
  <!-- </div> -->
</form>
</div>
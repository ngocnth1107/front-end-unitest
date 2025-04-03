# Unit Test Checklist for OrderService

## 1. Validation of Order Items
- [ ] Ensure an error is thrown if the `items` array is empty.
  - Test case: `'should throw an error if order items are empty'`
- [ ] Ensure an error is thrown if any item has an invalid `price` or `quantity` (e.g., `price <= 0` or `quantity <= 0`).
  - Test case: `'should throw an error if any item has invalid price or quantity'`

## 2. Total Price Calculation
- [ ] Ensure the `totalPrice` is calculated correctly for valid items.
  - Test case: `'should calculate the total price correctly'`
- [ ] Ensure an error is thrown if the `totalPrice` is less than or equal to 0.
  - Test case: `'should throw an error if totalPrice is less than or equal to 0'`

## 3. Coupon Application
- [ ] Ensure a valid coupon is applied and the `totalPrice` is adjusted correctly.
  - Test case: `'should apply a valid coupon and adjust the total price'`
- [ ] Ensure an error is thrown if the coupon is invalid.
  - Test case: `'should throw an error if coupon is invalid'`
- [ ] Ensure the `totalPrice` does not go below 0 after applying a coupon.
  - Test case: `'should ensure total price does not go below 0 after applying a coupon'`

## 4. Order API Integration
- [ ] Ensure the correct order payload is sent to the API.
  - Test case: `'should send the correct order payload to the API'`
- [ ] Ensure an error is thrown if the order creation fails.
  - Test case: `'should throw an error if order creation fails'`

## 5. Payment Handling
- [ ] Ensure the `payViaLink` method is called with the created order.
  - Test case: `'should call payViaLink with the created order'`

## 6. Mocking and Spying
- [ ] Ensure all external dependencies (e.g., `fetch`, `paymentService`) are properly mocked.
- [ ] Ensure all relevant methods (e.g., `buildPaymentMethod`, `payViaLink`) are spied on and validated.

## 7. Edge Cases
- [ ] Test edge cases for `items` with extreme values (e.g., very high `price` or `quantity`).
- [ ] Test edge cases for `totalPrice` with boundary values (e.g., exactly 0 or slightly above 0).
- [ ] Test scenarios where no `couponId` is provided.

---

# Unit Test Checklist for PaymentService

## 1. `buildPaymentMethod` Method
- [ ] Ensure all payment methods are included when `totalPrice` is below thresholds.
  - Test case: `'should include all payment methods when totalPrice is below thresholds'`
- [ ] Ensure `PAYPAY` is excluded when `totalPrice` is greater than 500,000.
  - Test case: `'should exclude PAYPAY when totalPrice is greater than 500,000'`
- [ ] Ensure `AUPAY` is excluded when `totalPrice` is greater than 300,000.
  - Test case: `'should exclude AUPAY when totalPrice is greater than 300,000'`
- [ ] Ensure both `PAYPAY` and `AUPAY` are excluded when `totalPrice` is greater than 500,000.
  - Test case: `'should exclude both PAYPAY and AUPAY when totalPrice is greater than 500,000'`

## 2. `payViaLink` Method
- [ ] Ensure a new window is opened with the correct URL when `payViaLink` is called.
  - Test case: `'should open a new window with the correct URL'`
- [ ] Ensure the URL includes the correct `orderId` parameter.
  - Test case: `'should open a new window with the correct URL'`

## 3. Mocking and Spying
- [ ] Ensure the `window.open` method is properly mocked and restored in the `payViaLink` tests.
- [ ] Ensure all external dependencies are properly mocked where necessary.

## 4. Edge Cases
- [ ] Test `buildPaymentMethod` with `totalPrice` exactly at the thresholds (e.g., 300,000 and 500,000).
- [ ] Test `payViaLink` with an `Order` object that has no `id` or invalid data.
- [ ] Test `buildPaymentMethod` with `totalPrice` as `0` or negative values (if applicable).

---

# Unit Test Checklist for Counter

## 1. Initialization
- [ ] Ensure the counter initializes with the correct default value (e.g., `0`).
  - Test case: `'should initialize the counter with default value'`
- [ ] Ensure the counter initializes with a custom starting value if provided.
  - Test case: `'should initialize the counter with a custom starting value'`

## 2. Increment Functionality
- [ ] Ensure the counter increments by `1` when the increment function is called.
  - Test case: `'should increment the counter by 1'`
- [ ] Ensure the counter increments correctly multiple times.
  - Test case: `'should increment the counter multiple times'`

## 3. Decrement Functionality
- [ ] Ensure the counter decrements by `1` when the decrement function is called.
  - Test case: `'should decrement the counter by 1'`
- [ ] Ensure the counter decrements correctly multiple times.
  - Test case: `'should decrement the counter multiple times'`
- [ ] Ensure the counter does not go below `0` (if applicable).
  - Test case: `'should not decrement below 0'`

## 4. Reset Functionality
- [ ] Ensure the counter resets to the default value when the reset function is called.
  - Test case: `'should reset the counter to the default value'`
- [ ] Ensure the counter resets to a custom starting value if provided.
  - Test case: `'should reset the counter to the custom starting value'`

## 5. Edge Cases
- [ ] Test the counter with very large numbers (e.g., `Number.MAX_SAFE_INTEGER`).
  - Test case: `'should handle large numbers correctly'`
- [ ] Test the counter with negative starting values (if applicable).
  - Test case: `'should handle negative starting values correctly'`

## 6. Event Handling (if applicable)
- [ ] Ensure the counter updates correctly when a button is clicked to increment.
  - Test case: `'should increment the counter when the increment button is clicked'`
- [ ] Ensure the counter updates correctly when a button is clicked to decrement.
  - Test case: `'should decrement the counter when the decrement button is clicked'`
- [ ] Ensure the counter resets correctly when a reset button is clicked.
  - Test case: `'should reset the counter when the reset button is clicked'`

## 7. Accessibility (if applicable)
- [ ] Ensure the counter has appropriate ARIA attributes for accessibility.
  - Test case: `'should have appropriate ARIA attributes for accessibility'`

## 8. Mocking and Spying (if applicable)
- [ ] Ensure any external dependencies (e.g., event listeners) are properly mocked.
- [ ] Ensure all relevant methods (e.g., `increment`, `decrement`, `reset`) are spied on and validated.

---

# Unit Test Checklist for main.ts

## 1. Initialization
- [ ] Ensure the `#app` element is rendered in the DOM.
  - Test case: `'should render the #app element'`
- [ ] Ensure the `#app` element has the correct initial `innerHTML`.
  - Test case: `'should set the correct innerHTML for the #app element'`

## 2. Counter Setup
- [ ] Ensure the `setupCounter` function is called with the `#counter` button.
  - Test case: `'should call setupCounter with the #counter button'`
- [ ] Ensure no error is thrown if the `#counter` button is not found.
  - Test case: `'should not throw error if #counter is not found'`

## 3. Event Handling
- [ ] Ensure the `setupCounter` function correctly attaches event listeners to the `#counter` button.
  - Test case: `'should attach event listeners to the #counter button'`

## 4. Edge Cases
- [ ] Test behavior when the `#app` element is missing from the DOM.
  - Test case: `'should not throw error if #app is not found'`
- [ ] Test behavior when the `#counter` button is missing from the DOM.
  - Test case: `'should not throw error if #counter is not found'`

## 5. Mocking and Spying
- [ ] Ensure the `setupCounter` function is properly mocked in tests.
- [ ] Ensure all DOM-related methods (e.g., `document.querySelector`) are spied on and validated.

## 6. Accessibility (if applicable)
- [ ] Ensure the `#app` element and its children have appropriate ARIA attributes for accessibility.
  - Test case: `'should have appropriate ARIA attributes for accessibility'`

---

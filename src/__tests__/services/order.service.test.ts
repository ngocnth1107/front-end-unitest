import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { Order } from '../../models/order.model';

globalThis.fetch = vi.fn();

describe('OrderService', () => {
  let orderService: OrderService;
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = {
      buildPaymentMethod: vi.fn(),
      payViaLink: vi.fn(),
    } as unknown as PaymentService;

    orderService = new OrderService(paymentService);
    vi.resetAllMocks();
  });

  // 1. Validation of Order Items
  it('should throw an error if order items are empty', async () => {
    await expect(orderService.process({})).rejects.toThrow('Order items are required');
  });

  it('should throw an error if any item has invalid price or quantity', async () => {
    const invalidOrder = {
      items: [{ id: '1', productId: 'product 1', price: 0, quantity: 1 }],
    };

    await expect(orderService.process(invalidOrder)).rejects.toThrow('Order items are invalid');
  });

  // 2. Total Price Calculation
  it('should calculate the total price correctly', async () => {
    const validOrder = {
      items: [
        { id: '1', productId: 'product 1', price: 100, quantity: 2 },
        { id: '2', productId: 'p2', price: 50, quantity: 1 },
      ],
    };

    paymentService.buildPaymentMethod = vi.fn().mockReturnValue('mock-payment-method');
    (fetch as any).mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce({ id: 'order123' }) });

    await orderService.process(validOrder);

    expect(paymentService.buildPaymentMethod).toHaveBeenCalledWith(250); // 100*2 + 50*1
  });
  
  // 3. Coupon Application
  it('should apply a valid coupon and adjust the total price', async () => {
    const validOrder = {
      items: [{ id: '1', productId: 'product 1', price: 100, quantity: 1 }],
      couponId: '123',
    };

    (fetch as any)
      .mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce({ discount: 50 }) }) // Mock coupon API
      .mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce({ id: 'order123' }) }); // Mock order API

    paymentService.buildPaymentMethod = vi.fn().mockReturnValue('mock-payment-method');

    await orderService.process(validOrder);

    expect(fetch).toHaveBeenCalledWith('https://67eb7353aa794fb3222a4c0e.mockapi.io/coupons/123');
    expect(paymentService.buildPaymentMethod).toHaveBeenCalledWith(50); // Total price after discount
  });

  it('should throw an error if coupon is invalid', async () => {
    const invalidCouponOrder = {
      items: [{ id: '1', productId: 'product 1', price: 20, quantity: 1 }],
      couponId: 'AAA',
    };

    (fetch as any).mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce(null) }); // Mock invalid coupon API

    await expect(orderService.process(invalidCouponOrder)).rejects.toThrow('Invalid coupon');
  });

  it('should ensure total price does not go below 0 after applying a coupon', async () => {
    const validOrder = {
      items: [{ id: '1', productId: 'product 1', price: 50, quantity: 1 }],
      couponId: 'BBB',
    };

    (fetch as any)
      .mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce({ discount: 100 }) }) // Mock coupon API
      .mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce({ id: 'order123' }) }); // Mock order API

    paymentService.buildPaymentMethod = vi.fn().mockReturnValue('mock-payment-method');

    await orderService.process(validOrder);

    expect(paymentService.buildPaymentMethod).toHaveBeenCalledWith(0); // Total price cannot be negative
  });

  // 4. Payment Method
  it('should call buildPaymentMethod with the correct total price', async () => {
    const validOrder = {
      items: [{ id: '1', productId: 'product 1', price: 100, quantity: 2 }],
    };

    paymentService.buildPaymentMethod = vi.fn().mockReturnValue('mock-payment-method');
    (fetch as any).mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce({ id: 'order123' }) });

    await orderService.process(validOrder);

    expect(paymentService.buildPaymentMethod).toHaveBeenCalledWith(200); // Total price = 100 * 2
  });

  // 5. Order API
  it('should send the correct order payload to the API', async () => {
    const validOrder: Partial<Order> = {
      items: [{ id: '1', productId: 'product 1', price: 100, quantity: 1 }],
      couponId: '123',
    };

    (fetch as any)
      .mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce({ discount: 100 }) })
      .mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce({ id: 'order123' }) }); // Mock order API
    paymentService.buildPaymentMethod = vi.fn().mockReturnValue('mock-payment-method');

    await orderService.process(validOrder);

    expect(fetch).toHaveBeenCalledWith('https://67eb7353aa794fb3222a4c0e.mockapi.io/coupons/123');
    expect(fetch).toHaveBeenCalledWith('https://67eb7353aa794fb3222a4c0e.mockapi.io/order', {
      method: 'POST',
      body: JSON.stringify({
        items: [ { id: '1', productId: 'product 1', price: 100, quantity: 1 } ],
        couponId: '123',
        totalPrice: 0,
        paymentMethod: 'mock-payment-method'
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    
  });

  // 6. Payment Handling
  it('should call payViaLink with the created order', async () => {
    const validOrder = {
      items: [{ id: '1', productId: 'product 1', price: 100, quantity: 1 }], discount: 90,
    };

    (fetch as any)
      .mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce({ id: 'order123' }) }); // Mock order API

    paymentService.buildPaymentMethod = vi.fn().mockReturnValue('mock-payment-method');

    await orderService.process(validOrder);

    expect(paymentService.payViaLink).toHaveBeenCalledWith({ id: 'order123'}); // Expecting payViaLink to be called with the created order
  });
});
import { describe, it, expect, vi } from 'vitest';
import { PaymentService } from '../../services/payment.service';
import { PaymentMethod } from '../../models/payment.model';
import { Order } from '../../models/order.model';

describe('PaymentService', () => {
  const paymentService = new PaymentService();

  describe('buildPaymentMethod', () => {
    it('should include all payment methods when totalPrice is below thresholds', () => {
      const result = paymentService.buildPaymentMethod(100000);
      expect(result).toBe(
        `${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY},${PaymentMethod.AUPAY}`
      );
    });

    it('should exclude PAYPAY when totalPrice is greater than 500,000', () => {
      const result = paymentService.buildPaymentMethod(600000);
      expect(result).toBe(`${PaymentMethod.CREDIT}`);
    });

    it('should exclude AUPAY when totalPrice is greater than 300,000', () => {
      const result = paymentService.buildPaymentMethod(400000);
      expect(result).toBe(`${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY}`);
    });

    it('should exclude both PAYPAY and AUPAY when totalPrice is greater than 500,000', () => {
      const result = paymentService.buildPaymentMethod(600000);
      expect(result).toBe(`${PaymentMethod.CREDIT}`);
    });
  });

  describe('payViaLink', () => {
    it('should open a new window with the correct URL', () => {
      const order: Order = { 
        id: '12345', 
        totalPrice: 100000, 
        items: [], 
        paymentMethod: PaymentMethod.CREDIT 
      };
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      paymentService.payViaLink(order);

      expect(openSpy).toHaveBeenCalledWith(
        `https://payment.example.com/pay?orderId=12345`,
        '_blank'
      );

      openSpy.mockRestore();
    });
  });
});
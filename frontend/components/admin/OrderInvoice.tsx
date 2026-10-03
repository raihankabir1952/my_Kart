import { Order } from '@/types/order';

interface OrderInvoiceProps {
  order: Order;
}

export default function OrderInvoice({ order }: OrderInvoiceProps) {
  const orderDate = new Date(order.createdAt);

  return (
    <div
      id="order-invoice"
      className="mx-auto hidden w-full max-w-3xl bg-white p-10 text-gray-900 print:block"
    >
      {/* Invoice Header */}
      <div className="flex items-start justify-between border-b-2 border-gray-900 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MY-KART</h1>

          <p className="mt-1 text-sm text-gray-500">
            Your trusted online shopping store
          </p>
        </div>

        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            Invoice
          </h2>

          <p className="mt-1 font-mono text-sm text-gray-600">
            #{order.orderNumber}
          </p>
        </div>
      </div>

      {/* Customer + Order Info */}
      <div className="grid grid-cols-2 gap-8 border-b border-gray-200 py-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Bill To
          </p>

          <p className="font-semibold text-gray-900">
            {order.user?.name || order.shippingName || 'N/A'}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {order.user?.email || 'N/A'}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {order.shippingPhone || 'N/A'}
          </p>
        </div>

        <div className="text-right">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Order Information
          </p>

          <p className="text-sm text-gray-600">
            Date:{' '}
            <span className="font-medium text-gray-900">
              {orderDate.toLocaleDateString('en-BD', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </p>

          <p className="mt-1 text-sm text-gray-600">
            Time:{' '}
            <span className="font-medium text-gray-900">
              {orderDate.toLocaleTimeString('en-BD', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </p>

          <p className="mt-1 text-sm text-gray-600">
            Payment:{' '}
            <span className="font-medium capitalize text-gray-900">
              {order.paymentMethod || 'N/A'}
            </span>
          </p>

          <p className="mt-1 text-sm text-gray-600">
            Status:{' '}
            <span className="font-medium capitalize text-gray-900">
              {order.paymentStatus}
            </span>
          </p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border-b border-gray-200 py-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Shipping Address
        </p>

        <p className="text-sm leading-6 text-gray-700">
          {order.shippingAddress || 'N/A'}
        </p>

        {order.shippingCity && (
          <p className="text-sm text-gray-700">
            {order.shippingCity}
            {order.shippingPostal ? ` - ${order.shippingPostal}` : ''}
          </p>
        )}
      </div>

      {/* Items Table */}
      <div className="py-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="pb-3 text-left text-xs font-bold uppercase tracking-wide">
                Product
              </th>

              <th className="pb-3 text-center text-xs font-bold uppercase tracking-wide">
                Qty
              </th>

              <th className="pb-3 text-right text-xs font-bold uppercase tracking-wide">
                Price
              </th>

              <th className="pb-3 text-right text-xs font-bold uppercase tracking-wide">
                Subtotal
              </th>
            </tr>
          </thead>

          <tbody>
            {order.items?.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4 text-sm font-medium text-gray-900">
                  {item.productName}
                </td>

                <td className="py-4 text-center text-sm text-gray-600">
                  {item.quantity}
                </td>

                <td className="py-4 text-right text-sm text-gray-600">
                  ৳{Number(item.price).toLocaleString()}
                </td>

                <td className="py-4 text-right text-sm font-semibold text-gray-900">
                  ৳{Number(item.subtotal).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="ml-auto w-full max-w-sm border-t border-gray-200 pt-5">
        <div className="flex justify-between py-2 text-sm text-gray-600">
          <span>Subtotal</span>
          <span>৳{Number(order.subtotal).toLocaleString()}</span>
        </div>

        <div className="flex justify-between py-2 text-sm text-gray-600">
          <span>Shipping</span>

          <span>
            {Number(order.shippingCost) === 0
              ? 'Free'
              : `৳${Number(order.shippingCost).toLocaleString()}`}
          </span>
        </div>

        <div className="mt-2 flex justify-between border-t-2 border-gray-900 pt-4 text-xl font-bold">
          <span>Total</span>
          <span>৳{Number(order.total).toLocaleString()}</span>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mt-8 border-t border-gray-200 pt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Customer Notes
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {order.notes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 border-t border-gray-200 pt-5 text-center">
        <p className="text-sm font-medium text-gray-700">
          Thank you for shopping with My-Kart!
        </p>

        <p className="mt-1 text-xs text-gray-400">
          This is a computer-generated invoice.
        </p>
      </div>
    </div>
  );
}

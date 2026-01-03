using System;

namespace MiniStore.Core.Entities
{
    public class OrderItem
    {
        public Guid Id { get; set; }

        public Guid ProductId { get; set; }
        public Product? Product { get; set; }

        public Guid OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}

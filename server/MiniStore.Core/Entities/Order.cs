using MiniStore.Core.Enums;

namespace MiniStore.Core.Entities
{
    public class Order
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public decimal TotalAmount { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public bool IsDeleted { get; set; } = false;

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}


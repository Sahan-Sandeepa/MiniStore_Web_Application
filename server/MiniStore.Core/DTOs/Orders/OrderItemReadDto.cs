namespace MiniStore.Core.DTOs
{

    public class OrderItemReadDto
    {
        public Guid ProductId { get; set; }
        public required string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class AdminOrderReadDto
    {
        public Guid Id { get; set; }
        public string Status { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }

        public Guid UserId { get; set; }
        public string UserName { get; set; } = default!;
        public string FullName { get; set; } = default!;

        public List<OrderItemReadDto> Items { get; set; } = [];
    }

}
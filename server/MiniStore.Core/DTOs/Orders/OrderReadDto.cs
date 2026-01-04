namespace MiniStore.Core.DTOs
{
    public class OrderReadDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }
        public required string Status { get; set; }

        public required List<OrderItemReadDto> Items { get; set; }
    }
}
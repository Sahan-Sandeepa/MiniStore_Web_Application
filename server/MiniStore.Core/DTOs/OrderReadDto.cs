namespace MiniStore.Core.DTOs
{
    public class OrderReadDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }

        public List<OrderItemReadDto> Items { get; set; }
    }
}
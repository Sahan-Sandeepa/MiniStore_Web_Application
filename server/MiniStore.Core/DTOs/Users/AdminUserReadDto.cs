namespace MiniStore.Core.DTOs
{
    public class AdminUserReadDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = default!;
        public string FullName { get; set; } = default!;
        public string Role { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
    }
}
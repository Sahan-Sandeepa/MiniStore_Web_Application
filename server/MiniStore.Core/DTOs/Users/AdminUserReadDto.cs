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

    public class AdminUserDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = "";
        public string FullName { get; set; } = "";
        public string Role { get; set; } = "";
        public string Status { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }

}
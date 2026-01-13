namespace MiniStore.Core.DTOs
{
    public class FakeStoreProduct
    {
        public int id { get; set; }
        public string title { get; set; } = string.Empty;
        public double price { get; set; }
        public string description { get; set; } = string.Empty;
        public string category { get; set; } = string.Empty;
        public string image { get; set; } = string.Empty;
    }
}
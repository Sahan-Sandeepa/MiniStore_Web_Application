using System.Net.Http.Json;
using MiniStore.Core.DTOs;
using MiniStore.Core.Entities;
using MiniStore.Infrastructure.Data;

public class ExternalProductService
{
    private readonly HttpClient _http;
    private readonly AppDbContext _db;

    public ExternalProductService(HttpClient http, AppDbContext db)
    {
        _http = http;
        _db = db;
    }

    public async Task<List<ProductReadDto>> FetchExternalProductsAsync()
    {
        var items = await _http.GetFromJsonAsync<List<FakeStoreProduct>>("https://fakestoreapi.com/products");
        if (items == null) return new List<ProductReadDto>();

        return items.Select(p => new ProductReadDto
        {
            Id = Guid.NewGuid(),
            Name = p.title,
            Description = p.description,
            Price = (decimal)p.price,
            Stock = 15,
            Category = p.category,
            ImageUrl = p.image,
            CreatedAt = DateTime.UtcNow
        }).ToList();
    }

    public async Task<ProductReadDto> ImportExternalProductAsync(int externalId)
    {
        var p = await _http.GetFromJsonAsync<FakeStoreProduct>($"https://fakestoreapi.com/products/{externalId}");
        if (p == null) throw new Exception("External product not found");

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = p.title,
            Description = p.description,
            Price = (decimal)p.price,
            Stock = 50,
            Category = p.category,
            ImageUrl = p.image
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return new ProductReadDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            Category = product.Category,
            ImageUrl = product.ImageUrl,
            CreatedAt = product.CreatedAt
        };
    }

}

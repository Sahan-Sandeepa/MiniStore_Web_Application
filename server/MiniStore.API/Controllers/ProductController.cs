using Microsoft.AspNetCore.Mvc;
using MiniStore.Core.DTOs;
using MiniStore.Core.Interfaces;
using MiniStore.Infrastructure.Services;
using MiniStore.Core.Entities;

namespace MiniStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _repository;
        private readonly RedisCacheService _cache;
        private readonly ElasticsearchService _es;

        public ProductController(IProductRepository repository, RedisCacheService cache, ElasticsearchService es)
        {
            _repository = repository;
            _cache = cache;
            _es = es;
        }

        // GET ALL (with Redis cache)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetAll()
        {
            var cacheKey = "products_all";

            var cached = await _cache.GetAsync<List<ProductReadDto>>(cacheKey);
            if (cached != null)
                return Ok(cached);

            var products = await _repository.GetAllAsync();

            var result = products.Select(p => new ProductReadDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                Category = p.Category,
                CreatedAt = p.CreatedAt
            }).ToList();

            await _cache.SetAsync(cacheKey, result, TimeSpan.FromMinutes(5));

            return Ok(result);
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductReadDto>> GetById(Guid id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();

            return new ProductReadDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Category = product.Category,
                CreatedAt = product.CreatedAt
            };
        }

        // CREATE
        [HttpPost]
        public async Task<ActionResult<ProductReadDto>> Create(ProductCreateDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                Category = dto.Category
            };

            await _repository.AddAsync(product);
            await _es.IndexProductAsync(product);

            // clear cache
            await _cache.RemoveAsync("products_all");

            var result = new ProductReadDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Category = product.Category,
                CreatedAt = product.CreatedAt
            };

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, result);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, ProductCreateDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.Name = dto.Name;
            existing.Description = dto.Description;
            existing.Price = dto.Price;
            existing.Stock = dto.Stock;
            existing.Category = dto.Category;

            await _repository.UpdateAsync(existing);
            await _cache.RemoveAsync("products_all");

            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _repository.DeleteAsync(id);
            await _cache.RemoveAsync("products_all");

            return NoContent();
        }

        // GET: api/Product/search?query=laptop
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query)) return BadRequest("Query cannot be empty");
            var results = await _es.SearchProductsAsync(query);
            return Ok(results);
        }
    }
}

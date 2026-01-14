using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MiniStore.API.Controllers
{


    [ApiController]
    [Route("api/external/products")]
    public class ExternalProductsController : ControllerBase
    {
        private readonly ExternalProductService _external;

        public ExternalProductsController(ExternalProductService external)
        {
            _external = external;
        }

        [HttpGet]
        public async Task<IActionResult> GetExternalProducts()
        {
            var products = await _external.FetchExternalProductsAsync();
            return Ok(products);
        }

        [HttpPost("import")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Import([FromBody] ImportRequest req)
        {
            var product = await _external.ImportExternalProductAsync(req.ExternalId);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpGet("local/{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            return NoContent();
        }

        public class ImportRequest
        {
            public int ExternalId { get; set; }
        }
    }
}
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniStore.Core.DTOs;
using MiniStore.Core.Entities;
using MiniStore.Core.Enums;
using MiniStore.Infrastructure.Data;

namespace MiniStore.API.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // CUSTOMER: Create order
        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            if (dto.Items.Count == 0)
                return BadRequest("Order must contain items");

            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var order = new Order
            {
                UserId = userId,
                TotalAmount = dto.Items.Sum(i => i.Price * i.Quantity),
                Items = dto.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order.Id);
        }

        // CUSTOMER: My orders
        [HttpGet("mine")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        // ADMIN: All orders + search
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrders(string? search)
        {
            var query = _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(o =>
                    o.User.UserName!.Contains(search) ||
                    o.User.FullName!.Contains(search));
            }

            return Ok(await query
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync());
        }

        // ADMIN: Update status
        [Authorize(Roles = "Admin")]
        [HttpPatch("{orderId}/status")]
        public async Task<IActionResult> UpdateStatus(Guid orderId, UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound();

            if (!Enum.TryParse<OrderStatus>(dto.Status, true, out var status))
            {
                return BadRequest("Invalid order status");
            }

            order.Status = status;
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}

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
        [Authorize]
        [HttpGet("mine")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderReadDto
                {
                    Id = o.Id,
                    CreatedAt = o.CreatedAt,
                    Status = o.Status.ToString(),
                    TotalAmount = o.TotalAmount,
                    Items = o.Items.Select(i => new OrderItemReadDto
                    {
                        ProductId = i.ProductId,
                        ProductName = i.Product.Name,
                        Quantity = i.Quantity,
                        Price = i.Price
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        //Customer Cancel Endpoint
        [Authorize]
        [HttpPatch("{orderId}/cancel")]
        public async Task<IActionResult> CancelOrder(Guid orderId)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null) return NotFound();

            if (order.Status != OrderStatus.Pending &&
                order.Status != OrderStatus.Processing)
            {
                return BadRequest("Order cannot be cancelled at this stage");
            }

            order.Status = OrderStatus.Cancelled;
            await _context.SaveChangesAsync();

            return Ok(new { order.Id, Status = order.Status.ToString() });
        }

        // ADMIN: All orders + search
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrders(string? search)
        {
            var query = _context.Orders.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(o =>
                    o.User.UserName!.Contains(search) ||
                    o.User.FullName!.Contains(search) ||
                    o.Id.ToString().Contains(search));
            }

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new AdminOrderReadDto
                {
                    Id = o.Id,
                    CreatedAt = o.CreatedAt,
                    Status = o.Status.ToString(),
                    TotalAmount = o.TotalAmount,

                    UserId = o.User.Id,
                    UserName = o.User.UserName!,
                    FullName = o.User.FullName!,

                    Items = o.Items.Select(i => new OrderItemReadDto
                    {
                        ProductId = i.ProductId,
                        ProductName = i.Product.Name,
                        Quantity = i.Quantity,
                        Price = i.Price
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
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

            return Ok(new
            {
                order.Id,
                Status = order.Status.ToString()
            });
        }

        //Admin Soft Delete Endpoint
        [Authorize(Roles = "Admin")]
        [HttpDelete("{orderId}")]
        public async Task<IActionResult> DeleteOrder(Guid orderId)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && !o.IsDeleted);

            if (order == null)
                return NotFound();

            if (order.Status != OrderStatus.Cancelled && order.Status != OrderStatus.Completed)
                return BadRequest("Only cancelled or completed orders can be deleted");

            order.IsDeleted = true;
            await _context.SaveChangesAsync();

            return Ok(new { order.Id, Message = "Order deleted successfully" });
        }
    }
}

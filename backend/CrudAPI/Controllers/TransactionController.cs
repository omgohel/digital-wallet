using CrudAPI.Data;
using CrudAPI.Models;
using CrudAPI.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrudAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public TransactionController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IActionResult> AddTransaction([FromBody] AddTransactionDto transactionDto)
        {
            // Validate model state
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await dbContext.Users.FindAsync(transactionDto.UserId);
            if (user == null)
                return NotFound("User not found");

            // Check for sufficient balance for debit transactions
            if (transactionDto.Type == "Debit")
            {
                if (user.Balance < transactionDto.Amount)
                    return BadRequest("Insufficient balance");
                user.Balance -= transactionDto.Amount;
            }
            else if (transactionDto.Type == "Credit")
            {
                user.Balance += transactionDto.Amount;
            }

            // Create transaction entity from DTO
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = transactionDto.UserId,
                Amount = transactionDto.Amount,
                Type = transactionDto.Type,
                Description = transactionDto.Description,
                Timestamp = DateTime.UtcNow
            };

            dbContext.Transactions.Add(transaction);
            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                Message = "Transaction added successfully"
            });
        }

        // Add this method to your TransactionController class

        [HttpGet]
        [Route("user/{userId}")]
        public async Task<IActionResult> GetUserTransactions(Guid userId)
        {
            // First check if user exists
            var userExists = await dbContext.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                return NotFound("User not found");
            }

            // Get all transactions for the user
            var transactions = await dbContext.Transactions
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.Timestamp)
                .Select(t => new
                {
                    t.Id,
                    t.Amount,
                    t.Type,
                    t.Description,
                    t.Timestamp,
                    t.UserId
                })
                .ToListAsync();

            if (!transactions.Any())
            {
                return Ok(new
                {
                    Message = "No transactions found for this user",
                    UserId = userId,
                    Transactions = new List<object>()
                });
            }

            return Ok(new
            {
                Message = "Transactions retrieved successfully",
                UserId = userId,
                TransactionCount = transactions.Count,
                Transactions = transactions
            });
        }
    }
}

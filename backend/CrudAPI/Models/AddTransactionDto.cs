using System.ComponentModel.DataAnnotations;

namespace CrudAPI.Models
{
    public class AddTransactionDto
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        [RegularExpression("^(Credit|Debit)$", ErrorMessage = "Type must be either 'Credit' or 'Debit'")]
        public string Type { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; }
    }
}

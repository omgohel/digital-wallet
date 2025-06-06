namespace CrudAPI.Models.Entities
{
    public class Transaction
    {
        public Guid Id { get; set; }

        public decimal Amount { get; set; }

        public string Type { get; set; } // "Credit" or "Debit"

        public string Description { get; set; }

        public DateTime Timestamp { get; set; }

        public Guid UserId { get; set; }

        public User User { get; set; }
    }
}

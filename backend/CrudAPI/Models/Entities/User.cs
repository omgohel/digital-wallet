namespace CrudAPI.Models.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        public required string Name { get; set; }

        public decimal Balance { get; set; }

        public ICollection<Transaction> Transactions { get; set; }
    }
}

namespace CrudAPI.Models
{
    public class AddUserDto
    {
        public required string Name { get; set; }
        public decimal Balance { get; set; } = 0;
    }
}
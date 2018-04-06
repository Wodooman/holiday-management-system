using System;

namespace UserManagement.Models
{
    public class ADUser
    {
        public string Description { get; set; }
        public string DisplayName { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public DateTime WhenCreated { get; set; }
        public string Department { get; set; }
        public string Email { get; set; }
        public string AccountName { get; set; }
        public string PhysicalDeliveryOfficeName { get; set; }
        public string TelephoneNumber { get; set; }
        public string Title { get; set; }
    }
}

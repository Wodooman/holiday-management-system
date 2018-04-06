using Newtonsoft.Json;

namespace UserManagement.General
{
    public class ErrorResponse
    {
        [JsonProperty("error")]
        public string Error { get; set; }
    }
}

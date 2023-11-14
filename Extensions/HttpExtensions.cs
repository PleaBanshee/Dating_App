using Dating_App.Helpers;
using System.Text.Json;

namespace Dating_App.Extensions
{
    // Extension class for Http Response
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header) 
        {
            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(header, jsonOptions));

            // CORS enabled in header
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}

using Microsoft.Extensions.Configuration;
using MiniStore.Core.Entities;
using Nest;

namespace MiniStore.Infrastructure.Services
{
    public class ElasticsearchService
    {
        private readonly IElasticClient _client;

        public ElasticsearchService(IConfiguration config)
        {
            var uri = config["ELASTIC_URI"] ?? throw new Exception("ELASTIC_URI not set in configuration");

            var settings = new ConnectionSettings(new Uri(uri))
                .DefaultIndex("products");

            _client = new ElasticClient(settings);
        }

        public async Task IndexProductAsync(Product product)
        {
            await _client.IndexDocumentAsync(product);
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string query)
        {
            var response = await _client.SearchAsync<Product>(s => s
                .Query(q => q
                    .MultiMatch(m => m
                        .Fields(f => f
                            .Field(p => p.Name)
                            .Field(p => p.Description)
                        )
                        .Query(query)
                    )
                )
            );

            return response.Documents;
        }
    }
}

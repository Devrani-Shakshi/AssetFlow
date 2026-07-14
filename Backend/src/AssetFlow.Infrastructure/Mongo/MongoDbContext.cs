using AssetFlow.Infrastructure.Mongo.Configuration;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace AssetFlow.Infrastructure.Mongo;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IOptions<MongoDbSettings> options)
    {
        var client = new MongoClient(options.Value.ConnectionString);

        _database = client.GetDatabase(options.Value.DatabaseName);
    }

    public IMongoDatabase Database => _database;
}
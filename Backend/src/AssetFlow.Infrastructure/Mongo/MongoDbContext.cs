using AssetFlow.Infrastructure.Mongo.Configuration;
using AssetFlow.Domain.Entities;
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

    public IMongoCollection<User> Users => Database.GetCollection<User>("Users");
    public IMongoCollection<Department> Departments => Database.GetCollection<Department>("Departments");
    public IMongoCollection<PasswordResetToken> PasswordResetTokens => Database.GetCollection<PasswordResetToken>("PasswordResetTokens");

    // Unimplemented entities can be uncommented once their classes are defined:
    // public IMongoCollection<ActivityLog> ActivityLogs => _database.GetCollection<ActivityLog>("ActivityLogs");
    public IMongoCollection<Allocation> Allocations => Database.GetCollection<Allocation>("Allocations");
    public IMongoCollection<Asset> Assets => Database.GetCollection<Asset>("Assets");
    public IMongoCollection<AssetCategory> AssetCategories => Database.GetCollection<AssetCategory>("AssetCategories");
    public IMongoCollection<Location> Locations => Database.GetCollection<Location>("Locations");
    public IMongoCollection<AssetReturn> AssetReturns => Database.GetCollection<AssetReturn>("AssetReturns");
    public IMongoCollection<AssetMaintenance> AssetMaintenances => Database.GetCollection<AssetMaintenance>("AssetMaintenances");
    public IMongoCollection<AssetDisposal> AssetDisposals => Database.GetCollection<AssetDisposal>("AssetDisposals");
    // public IMongoCollection<AuditCycle> AuditCycles => _database.GetCollection<AuditCycle>("AuditCycles");
    // public IMongoCollection<Booking> Bookings => _database.GetCollection<Booking>("Bookings");
    // public IMongoCollection<Employee> Employees => _database.GetCollection<Employee>("Employees");
    // public IMongoCollection<MaintenanceRequest> MaintenanceRequests => _database.GetCollection<MaintenanceRequest>("MaintenanceRequests");
    public IMongoCollection<Notification> Notifications => Database.GetCollection<Notification>("Notifications");
    public IMongoCollection<AuditLog> AuditLogs => Database.GetCollection<AuditLog>("AuditLogs");
    // public IMongoCollection<TransferRequest> TransferRequests => _database.GetCollection<TransferRequest>("TransferRequests");
}
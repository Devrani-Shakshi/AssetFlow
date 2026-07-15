using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;

namespace AssetFlow.Infrastructure.Repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly IMongoCollection<Department> _departments;

    public DepartmentRepository(MongoDbContext context)
    {
        _departments = context.Departments;
    }

    public async Task CreateAsync(Department department)
    {
        await _departments.InsertOneAsync(department);
    }

    public async Task<List<Department>> GetAllAsync()
    {
        return await _departments.Find(x => !x.IsDeleted).ToListAsync();
    }

    public async Task<Department?> GetByIdAsync(string id)
    {
        return await _departments
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<Department?> GetByCodeAsync(string code)
    {
        return await _departments
            .Find(x => x.Code == code && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(Department department)
    {
        department.UpdatedAt = DateTime.UtcNow;

        await _departments.ReplaceOneAsync(
            x => x.Id == department.Id,
            department);
    }

    public async Task DeleteAsync(string id)
    {
        var update = Builders<Department>.Update
            .Set(x => x.IsDeleted, true)
            .Set(x => x.UpdatedAt, DateTime.UtcNow);

        await _departments.UpdateOneAsync(
            x => x.Id == id,
            update);
    }
}
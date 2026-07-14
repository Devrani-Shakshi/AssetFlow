using AssetFlow.Infrastructure.Mongo;
using Microsoft.AspNetCore.Mvc;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly MongoDbContext _context;

    public HealthController(MongoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            // Ping the database to verify active connection
            await _context.Database.RunCommandAsync((MongoDB.Driver.Command<MongoDB.Bson.BsonDocument>)"{ping:1}");
            
            return Ok(new
            {
                Status = "Healthy",
                Message = "API and MongoDB are connected and running successfully",
                Database = _context.Database.DatabaseNamespace.DatabaseName
            });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new
            {
                Status = "Unhealthy",
                Message = "Could not connect to MongoDB",
                Error = ex.Message
            });
        }
    }
}
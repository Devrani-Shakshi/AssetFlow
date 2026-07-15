using AssetFlow.Application.Features.Notifications.DTOs;
using AssetFlow.Application.Features.Notifications.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateNotificationRequest request)
    {
        return Ok(await _notificationService.CreateAsync(request));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _notificationService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var n = await _notificationService.GetByIdAsync(id);

        if (n == null)
            return NotFound();

        return Ok(n);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateNotificationRequest request)
    {
        return Ok(await _notificationService.UpdateAsync(request));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _notificationService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok("Notification deleted successfully.");
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
        return Ok(await _notificationService.GetByUserIdAsync(userId));
    }

    [HttpGet("user/{userId}/unread")]
    public async Task<IActionResult> GetUnreadByUserId(string userId)
    {
        return Ok(await _notificationService.GetUnreadByUserIdAsync(userId));
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        var updated = await _notificationService.MarkAsReadAsync(id);

        if (!updated)
            return NotFound();

        return Ok("Notification marked as read successfully.");
    }
}

using AssetFlow.Application.Features.Employees.DTOs;
using AssetFlow.Application.Features.Employees.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeeController(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateEmployeeRequest request)
    {
        var result = await _employeeService.CreateAsync(request);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _employeeService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _employeeService.GetByIdAsync(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet("Department/{departmentId}")]
    public async Task<IActionResult> GetByDepartment(string departmentId)
    {
        var result = await _employeeService.GetByDepartmentAsync(departmentId);
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateEmployeeRequest request)
    {
        var result = await _employeeService.UpdateAsync(request);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _employeeService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return Ok("Employee deleted successfully.");
    }
}
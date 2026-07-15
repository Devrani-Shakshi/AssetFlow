using AssetFlow.Shared.Responses;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace AssetFlow.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred during the request.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = HttpStatusCode.InternalServerError;
        string message = "An internal server error occurred.";
        List<string>? errors = null;

        switch (exception)
        {
            case ValidationException valEx:
                statusCode = HttpStatusCode.BadRequest;
                message = "One or more validation failures occurred.";
                errors = valEx.Errors.Select(x => $"{x.PropertyName}: {x.ErrorMessage}").ToList();
                break;

            case KeyNotFoundException:
                statusCode = HttpStatusCode.NotFound;
                message = "The requested resource was not found.";
                break;

            case UnauthorizedAccessException:
                statusCode = HttpStatusCode.Unauthorized;
                message = "You are not authorized to access this resource.";
                break;

            case InvalidOperationException:
            case ArgumentException:
                statusCode = HttpStatusCode.BadRequest;
                message = exception.Message;
                break;

            default:
                message = exception.Message;
                break;
        }

        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse.Fail(message, errors);
        var json = JsonSerializer.Serialize(response);

        return context.Response.WriteAsync(json);
    }
}

using System.Collections.Generic;

namespace AssetFlow.Shared.Responses;

public class ApiResponse<T>
{
    public bool Succeeded { get; set; }

    public string? Message { get; set; }

    public T? Data { get; set; }

    public List<string>? Errors { get; set; }

    public ApiResponse()
    {
    }

    public ApiResponse(T data, string? message = null)
    {
        Succeeded = true;
        Message = message;
        Data = data;
    }

    public static ApiResponse<T> Success(T data, string? message = null)
    {
        return new ApiResponse<T>(data, message);
    }

    public static ApiResponse<T> Fail(string message, List<string>? errors = null)
    {
        return new ApiResponse<T>
        {
            Succeeded = false,
            Message = message,
            Errors = errors
        };
    }
}

public class ApiResponse : ApiResponse<object>
{
    public ApiResponse()
    {
    }

    public ApiResponse(object data, string? message = null) : base(data, message)
    {
    }

    public static ApiResponse Success(string? message = null)
    {
        return new ApiResponse
        {
            Succeeded = true,
            Message = message
        };
    }

    public static new ApiResponse Fail(string message, List<string>? errors = null)
    {
        return new ApiResponse
        {
            Succeeded = false,
            Message = message,
            Errors = errors
        };
    }
}

// W320: Endpoint filter pipelines / Argument 1 range 1 through 10
namespace DotnetWeb;
public static class W320{

public static async ValueTask<object?> Invoke(EndpointFilterInvocationContext context,EndpointFilterDelegate next){
if(context.Arguments.Count<=1||context.Arguments[1] is not int n||n<1||n>10)return Results.BadRequest();return await next(context);
}
}

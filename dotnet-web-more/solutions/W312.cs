// W312: Endpoint filter pipelines / Argument 1 range 1 through 2
namespace DotnetWeb;
public static class W312{

public static async ValueTask<object?> Invoke(EndpointFilterInvocationContext context,EndpointFilterDelegate next){
if(context.Arguments.Count<=1||context.Arguments[1] is not int n||n<1||n>2)return Results.BadRequest();return await next(context);
}
}

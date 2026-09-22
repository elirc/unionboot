// W313: Endpoint filter pipelines / Argument 0 range 1 through 3
namespace DotnetWeb;
public static class W313{

public static async ValueTask<object?> Invoke(EndpointFilterInvocationContext context,EndpointFilterDelegate next){
if(context.Arguments.Count<=0||context.Arguments[0] is not int n||n<1||n>3)return Results.BadRequest();return await next(context);
}
}

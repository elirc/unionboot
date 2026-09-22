// W315: Endpoint filter pipelines / Argument 0 range 1 through 5
namespace DotnetWeb;
public static class W315{

public static async ValueTask<object?> Invoke(EndpointFilterInvocationContext context,EndpointFilterDelegate next){
if(context.Arguments.Count<=0||context.Arguments[0] is not int n||n<1||n>5)return Results.BadRequest();return await next(context);
}
}

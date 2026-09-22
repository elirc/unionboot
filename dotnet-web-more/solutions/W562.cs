// W562: Typed route groups and delegate contracts / Typed GET group /api/v2
namespace DotnetWeb;
public static class W562{

public static RouteGroupBuilder Register(IEndpointRouteBuilder routes,Func<int,IResult> handler){
var group=routes.MapGroup("/api/v2");group.MapGet("/items/{id:int}",handler).WithName("items-v2");return group;
}
}

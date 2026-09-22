// W563: Typed route groups and delegate contracts / Typed GET group /api/v3
namespace DotnetWeb;
public static class W563{

public static RouteGroupBuilder Register(IEndpointRouteBuilder routes,Func<int,IResult> handler){
var group=routes.MapGroup("/api/v3");group.MapGet("/items/{id:int}",handler).WithName("items-v3");return group;
}
}

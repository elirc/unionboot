// W561: Typed route groups and delegate contracts / Typed GET group /api/v1
namespace DotnetWeb;
public static class W561{

public static RouteGroupBuilder Register(IEndpointRouteBuilder routes,Func<int,IResult> handler){
var group=routes.MapGroup("/api/v1");group.MapGet("/items/{id:int}",handler).WithName("items-v1");return group;
}
}

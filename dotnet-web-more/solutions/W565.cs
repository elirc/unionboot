// W565: Typed route groups and delegate contracts / Typed GET group /api/v5
namespace DotnetWeb;
public static class W565{

public static RouteGroupBuilder Register(IEndpointRouteBuilder routes,Func<int,IResult> handler){
var group=routes.MapGroup("/api/v5");group.MapGet("/items/{id:int}",handler).WithName("items-v5");return group;
}
}

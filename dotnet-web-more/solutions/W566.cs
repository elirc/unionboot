// W566: Typed route groups and delegate contracts / Typed GET group /api/v6
namespace DotnetWeb;
public static class W566{

public static RouteGroupBuilder Register(IEndpointRouteBuilder routes,Func<int,IResult> handler){
var group=routes.MapGroup("/api/v6");group.MapGet("/items/{id:int}",handler).WithName("items-v6");return group;
}
}

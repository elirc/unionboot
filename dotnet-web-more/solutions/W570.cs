// W570: Typed route groups and delegate contracts / Typed GET group /api/v10
namespace DotnetWeb;
public static class W570{

public static RouteGroupBuilder Register(IEndpointRouteBuilder routes,Func<int,IResult> handler){
var group=routes.MapGroup("/api/v10");group.MapGet("/items/{id:int}",handler).WithName("items-v10");return group;
}
}

// W569: Typed route groups and delegate contracts / Typed GET group /api/v9
namespace DotnetWeb;
public static class W569{

public static RouteGroupBuilder Register(IEndpointRouteBuilder routes,Func<int,IResult> handler){
var group=routes.MapGroup("/api/v9");group.MapGet("/items/{id:int}",handler).WithName("items-v9");return group;
}
}

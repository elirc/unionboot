// W568: Typed route groups and delegate contracts / Typed GET group /api/v8
namespace DotnetWeb;
public static class W568{

public static RouteGroupBuilder Register(IEndpointRouteBuilder routes,Func<int,IResult> handler){
var group=routes.MapGroup("/api/v8");group.MapGet("/items/{id:int}",handler).WithName("items-v8");return group;
}
}

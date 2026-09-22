// W564: Typed route groups and delegate contracts / Typed GET group /api/v4
namespace DotnetWeb;
public static class W564{

public static RouteGroupBuilder Register(IEndpointRouteBuilder routes,Func<int,IResult> handler){
var group=routes.MapGroup("/api/v4");group.MapGet("/items/{id:int}",handler).WithName("items-v4");return group;
}
}

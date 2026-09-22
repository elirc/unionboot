// W338: ProblemDetails customization / Problem status 422 with trace correlation
namespace DotnetWeb;
public static class W338{

public static IResult Handle(string? detail,HttpContext context){
var p=new ProblemDetails{Status=422,Title="Rejected 422",Detail=detail,Type="urn:problem:422",Instance=context.Request.Path};p.Extensions["traceId"]=context.TraceIdentifier;return Results.Problem(p);
}
}

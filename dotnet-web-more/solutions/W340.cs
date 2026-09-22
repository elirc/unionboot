// W340: ProblemDetails customization / Problem status 503 with trace correlation
namespace DotnetWeb;
public static class W340{

public static IResult Handle(string? detail,HttpContext context){
var p=new ProblemDetails{Status=503,Title="Rejected 503",Detail=detail,Type="urn:problem:503",Instance=context.Request.Path};p.Extensions["traceId"]=context.TraceIdentifier;return Results.Problem(p);
}
}

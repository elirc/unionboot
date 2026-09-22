// W336: ProblemDetails customization / Problem status 413 with trace correlation
namespace DotnetWeb;
public static class W336{

public static IResult Handle(string? detail,HttpContext context){
var p=new ProblemDetails{Status=413,Title="Rejected 413",Detail=detail,Type="urn:problem:413",Instance=context.Request.Path};p.Extensions["traceId"]=context.TraceIdentifier;return Results.Problem(p);
}
}

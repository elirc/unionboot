// W335: ProblemDetails customization / Problem status 410 with trace correlation
namespace DotnetWeb;
public static class W335{

public static IResult Handle(string? detail,HttpContext context){
var p=new ProblemDetails{Status=410,Title="Rejected 410",Detail=detail,Type="urn:problem:410",Instance=context.Request.Path};p.Extensions["traceId"]=context.TraceIdentifier;return Results.Problem(p);
}
}

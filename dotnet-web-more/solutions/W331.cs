// W331: ProblemDetails customization / Problem status 400 with trace correlation
namespace DotnetWeb;
public static class W331{

public static IResult Handle(string? detail,HttpContext context){
var p=new ProblemDetails{Status=400,Title="Rejected 400",Detail=detail,Type="urn:problem:400",Instance=context.Request.Path};p.Extensions["traceId"]=context.TraceIdentifier;return Results.Problem(p);
}
}

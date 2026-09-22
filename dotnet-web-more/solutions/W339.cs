// W339: ProblemDetails customization / Problem status 429 with trace correlation
namespace DotnetWeb;
public static class W339{

public static IResult Handle(string? detail,HttpContext context){
var p=new ProblemDetails{Status=429,Title="Rejected 429",Detail=detail,Type="urn:problem:429",Instance=context.Request.Path};p.Extensions["traceId"]=context.TraceIdentifier;return Results.Problem(p);
}
}

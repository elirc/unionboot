// W334: ProblemDetails customization / Problem status 409 with trace correlation
namespace DotnetWeb;
public static class W334{

public static IResult Handle(string? detail,HttpContext context){
var p=new ProblemDetails{Status=409,Title="Rejected 409",Detail=detail,Type="urn:problem:409",Instance=context.Request.Path};p.Extensions["traceId"]=context.TraceIdentifier;return Results.Problem(p);
}
}

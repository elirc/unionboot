// W333: ProblemDetails customization / Problem status 404 with trace correlation
namespace DotnetWeb;
public static class W333{

public static IResult Handle(string? detail,HttpContext context){
var p=new ProblemDetails{Status=404,Title="Rejected 404",Detail=detail,Type="urn:problem:404",Instance=context.Request.Path};p.Extensions["traceId"]=context.TraceIdentifier;return Results.Problem(p);
}
}

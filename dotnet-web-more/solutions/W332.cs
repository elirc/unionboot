// W332: ProblemDetails customization / Problem status 403 with trace correlation
namespace DotnetWeb;
public static class W332{

public static IResult Handle(string? detail,HttpContext context){
var p=new ProblemDetails{Status=403,Title="Rejected 403",Detail=detail,Type="urn:problem:403",Instance=context.Request.Path};p.Extensions["traceId"]=context.TraceIdentifier;return Results.Problem(p);
}
}

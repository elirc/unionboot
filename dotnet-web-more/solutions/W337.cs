// W337: ProblemDetails customization / Problem status 415 with trace correlation
namespace DotnetWeb;
public static class W337{

public static IResult Handle(string? detail,HttpContext context){
var p=new ProblemDetails{Status=415,Title="Rejected 415",Detail=detail,Type="urn:problem:415",Instance=context.Request.Path};p.Extensions["traceId"]=context.TraceIdentifier;return Results.Problem(p);
}
}

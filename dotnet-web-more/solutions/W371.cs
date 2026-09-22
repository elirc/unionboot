// W371: CORS policy evaluation / Credentialed origin app1 preflight GET
namespace DotnetWeb;
public static class W371{

public static CorsResult Evaluate(HttpContext context){
var policy=new CorsPolicyBuilder().WithOrigins("https://app1.example").WithMethods("GET").WithHeaders("X-App").AllowCredentials().Build();var service=new CorsService(Options.Create(new CorsOptions()),Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);var result=service.EvaluatePolicy(context,policy);service.ApplyResult(result,context.Response);return result;
}
}

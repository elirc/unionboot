// W377: CORS policy evaluation / Credentialed origin app7 preflight GET
namespace DotnetWeb;
public static class W377{

public static CorsResult Evaluate(HttpContext context){
var policy=new CorsPolicyBuilder().WithOrigins("https://app7.example").WithMethods("GET").WithHeaders("X-App").AllowCredentials().Build();var service=new CorsService(Options.Create(new CorsOptions()),Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);var result=service.EvaluatePolicy(context,policy);service.ApplyResult(result,context.Response);return result;
}
}

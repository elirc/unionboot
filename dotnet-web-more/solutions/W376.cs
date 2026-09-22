// W376: CORS policy evaluation / Credentialed origin app6 preflight HEAD
namespace DotnetWeb;
public static class W376{

public static CorsResult Evaluate(HttpContext context){
var policy=new CorsPolicyBuilder().WithOrigins("https://app6.example").WithMethods("HEAD").WithHeaders("X-App").AllowCredentials().Build();var service=new CorsService(Options.Create(new CorsOptions()),Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);var result=service.EvaluatePolicy(context,policy);service.ApplyResult(result,context.Response);return result;
}
}

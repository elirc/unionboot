// W378: CORS policy evaluation / Credentialed origin app8 preflight POST
namespace DotnetWeb;
public static class W378{

public static CorsResult Evaluate(HttpContext context){
var policy=new CorsPolicyBuilder().WithOrigins("https://app8.example").WithMethods("POST").WithHeaders("X-App").AllowCredentials().Build();var service=new CorsService(Options.Create(new CorsOptions()),Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);var result=service.EvaluatePolicy(context,policy);service.ApplyResult(result,context.Response);return result;
}
}

// W219: Authorization policy registration / scenario 9
// permission-9 requires authenticated permission reports.read
// Read prompts/W219.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W219 {

 public static void Configure(IServiceCollection services) {
  services.AddAuthorization(options=>options.AddPolicy("permission-9",p=>p.RequireAuthenticatedUser().RequireClaim("permission","reports.read")));
 }
}

// W211: Authorization policy registration / scenario 1
// permission-1 requires authenticated permission orders.read
// Read prompts/W211.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W211 {

 public static void Configure(IServiceCollection services) {
  services.AddAuthorization(options=>options.AddPolicy("permission-1",p=>p.RequireAuthenticatedUser().RequireClaim("permission","orders.read")));
 }
}

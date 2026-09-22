// W218: Authorization policy registration / scenario 8
// permission-8 requires authenticated permission lists.write
// Read prompts/W218.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W218 {

 public static void Configure(IServiceCollection services) {
  services.AddAuthorization(options=>options.AddPolicy("permission-8",p=>p.RequireAuthenticatedUser().RequireClaim("permission","lists.write")));
 }
}

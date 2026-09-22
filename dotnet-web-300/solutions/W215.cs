// W215: Authorization policy registration / scenario 5
// permission-5 requires authenticated permission teams.read
// Read prompts/W215.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W215 {

 public static void Configure(IServiceCollection services) {
  services.AddAuthorization(options=>options.AddPolicy("permission-5",p=>p.RequireAuthenticatedUser().RequireClaim("permission","teams.read")));
 }
}

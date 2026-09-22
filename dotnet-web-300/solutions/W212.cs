// W212: Authorization policy registration / scenario 2
// permission-2 requires authenticated permission tickets.read
// Read prompts/W212.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W212 {

 public static void Configure(IServiceCollection services) {
  services.AddAuthorization(options=>options.AddPolicy("permission-2",p=>p.RequireAuthenticatedUser().RequireClaim("permission","tickets.read")));
 }
}

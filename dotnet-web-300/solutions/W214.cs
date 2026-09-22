// W214: Authorization policy registration / scenario 4
// permission-4 requires authenticated permission tasks.write
// Read prompts/W214.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W214 {

 public static void Configure(IServiceCollection services) {
  services.AddAuthorization(options=>options.AddPolicy("permission-4",p=>p.RequireAuthenticatedUser().RequireClaim("permission","tasks.write")));
 }
}

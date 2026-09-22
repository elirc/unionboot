// W213: Authorization policy registration / scenario 3
// permission-3 requires authenticated permission notes.write
// Read prompts/W213.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W213 {

 public static void Configure(IServiceCollection services) {
  services.AddAuthorization(options=>options.AddPolicy("permission-3",p=>p.RequireAuthenticatedUser().RequireClaim("permission","notes.write")));
 }
}

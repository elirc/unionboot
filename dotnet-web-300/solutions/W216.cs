// W216: Authorization policy registration / scenario 6
// permission-6 requires authenticated permission boards.write
// Read prompts/W216.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W216 {

 public static void Configure(IServiceCollection services) {
  services.AddAuthorization(options=>options.AddPolicy("permission-6",p=>p.RequireAuthenticatedUser().RequireClaim("permission","boards.write")));
 }
}
